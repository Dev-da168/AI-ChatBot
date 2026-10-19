import sys
import os

# Add root directory to sys.path so main.py and static files can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, init_db

try:
    init_db()
except Exception:
    pass
