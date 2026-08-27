import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

class MyHttpRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[Olas del Mar] {self.address_string()} - {format % args}")

port = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with HTTPServer(("", port), MyHttpRequestHandler) as httpd:
    print(f"Servidor web 'Olas del Mar' iniciado en http://localhost:{port}")
    print("Presiona Ctrl+C para detener.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
