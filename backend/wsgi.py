import sys, os

# Carpeta del proyecto en PythonAnywhere: /home/<tu_usuario_pa>/olas-del-mar
PROJECT_DIR = os.path.expanduser("~/olas-del-mar")
if PROJECT_DIR not in sys.path:
    sys.path.insert(0, PROJECT_DIR)

from app import app as application
