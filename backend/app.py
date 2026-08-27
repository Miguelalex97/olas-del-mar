#!/usr/bin/env python3
"""Servidor Flask para 'Olas del Mar' con base de datos SQLite.
Funciona localmente (python app.py) y en PythonAnywhere (WSGI)."""
import os, json, sqlite3, datetime, subprocess, threading, tempfile
from flask import Flask, request, send_from_directory, jsonify

ROOT = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(ROOT, "olasdelmar.db")
PORT = int(os.environ.get("PORT", 8000))

app = Flask(__name__, static_folder=None)

@app.after_request
def _cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return resp

def init_db():
    conn = sqlite3.connect(DB); c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, items TEXT, total REAL, fecha TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, telefono TEXT, fecha TEXT, hora TEXT,
        personas TEXT, mesa TEXT, notas TEXT, fecha_reg TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS mensajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, email TEXT, asunto TEXT, mensaje TEXT, fecha TEXT)""")
    conn.commit(); conn.close()

init_db()

# ─── Notificación de escritorio (Windows Toast) en la PC del dueño ───
def _show_toast(title, message):
    script = '''
$ErrorActionPreference='SilentlyContinue'
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom, ContentType = WindowsRuntime] | Out-Null
$tmpl = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
$tx = $tmpl.GetElementsByTagName('text')
$tx.Item(0).InnerText = @'
TITLE
'@
$tx.Item(1).InnerText = @'
MESSAGE
'@
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Olas del Mar').Show($tmpl)
'''
    script = script.replace('TITLE', (title or '').replace('\n', ' ')).replace('MESSAGE', (message or '').replace('\n', ' '))
    path = os.path.join(tempfile.gettempdir(), 'ola_toast.ps1')
    try:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(script)
        subprocess.Popen(
            ['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass

def notify(title, message):
    threading.Thread(target=_show_toast, args=(title, message), daemon=True).start()

def save_row(table, fields):
    conn = sqlite3.connect(DB); c = conn.cursor()
    cols = ", ".join(fields.keys()); vals = list(fields.values())
    ph = ", ".join("?" for _ in vals)
    c.execute(f"INSERT INTO {table} ({cols}) VALUES ({ph})", vals)
    last = c.lastrowid; conn.commit(); conn.close()
    return last

def read_rows(table):
    conn = sqlite3.connect(DB); c = conn.cursor()
    c.execute(f"SELECT * FROM {table} ORDER BY id DESC")
    cols = [d[0] for d in c.description]
    rows = [dict(zip(cols, r)) for r in c.fetchall()]
    conn.close(); return rows

@app.route("/")
def index():
    return send_from_directory(ROOT, "index.html")

@app.route("/admin")
def admin():
    return send_from_directory(ROOT, "admin.html")

@app.route("/<path:filename>")
def static_files(filename):
    if filename.startswith("api/"):
        return ("", 404)
    full = os.path.join(ROOT, filename)
    if os.path.isfile(full):
        return send_from_directory(ROOT, filename)
    return ("", 404)

@app.route("/api/pedidos", methods=["GET"])
def api_pedidos():
    return jsonify(read_rows("pedidos"))

@app.route("/api/reservas", methods=["GET"])
def api_reservas():
    return jsonify(read_rows("reservas"))

@app.route("/api/mensajes", methods=["GET"])
def api_mensajes():
    return jsonify(read_rows("mensajes"))

@app.route("/api/pedido", methods=["POST"])
def api_pedido():
    data = request.get_json(force=True, silent=True) or {}
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    rid = save_row("pedidos", {
        "nombre": data.get("nombre", "Cliente"),
        "items": json.dumps(data.get("items", []), ensure_ascii=False),
        "total": data.get("total", 0), "fecha": now})
    print(f"[PEDIDO #{rid}] {data.get('nombre')} - ${data.get('total')}")
    notify("🛒 Nuevo pedido", f"{data.get('nombre','Cliente')} - ${data.get('total')}")
    return jsonify({"ok": True, "id": rid})

@app.route("/api/reserva", methods=["POST"])
def api_reserva():
    data = request.get_json(force=True, silent=True) or {}
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    rid = save_row("reservas", {
        "nombre": data.get("nombre", ""), "telefono": data.get("telefono", ""),
        "fecha": data.get("fecha", ""), "hora": data.get("hora", ""),
        "personas": data.get("personas", ""), "mesa": data.get("mesa", ""),
        "notas": data.get("notas", ""), "fecha_reg": now})
    print(f"[RESERVA #{rid}] {data.get('nombre')} - {data.get('fecha')} {data.get('hora')}")
    notify("📅 Nueva reserva", f"{data.get('nombre')} - {data.get('fecha')} {data.get('hora')} ({data.get('personas')})")
    return jsonify({"ok": True, "id": rid})

@app.route("/api/contacto", methods=["POST"])
def api_contacto():
    data = request.get_json(force=True, silent=True) or {}
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    rid = save_row("mensajes", {
        "nombre": data.get("nombre", ""), "email": data.get("email", ""),
        "asunto": data.get("asunto", ""), "mensaje": data.get("mensaje", ""),
        "fecha": now})
    print(f"[MENSAJE #{rid}] {data.get('nombre')}: {data.get('asunto')}")
    notify("✉️ Nuevo mensaje", f"{data.get('nombre')}: {data.get('asunto')}")
    return jsonify({"ok": True, "id": rid})

if __name__ == "__main__":
    print(f"Servidor Olas del Mar en http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=False)
