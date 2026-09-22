#!/usr/bin/env python
"""
Dhwaj Backend - SIH 2026 Entrypoint
Allows starting the entire server with a single command:
    uv run main.py
"""

import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dhwaj_core.settings')
    
    try:
        import django
        from django.core.management import call_command, execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you running with 'uv run main.py'?"
        ) from exc

    django.setup()

    # Automatically ensure migrations are applied
    print("[*] Verifying database migrations...")
    call_command('migrate', interactive=False)

    # Determine host and port
    port = os.getenv('PORT', '8000')
    addr = f"0.0.0.0:{port}"
    print(f"\n========================================================")
    print(f"🌾 DHWAJ API BACKEND RUNNING (SIH 2026)")
    print(f"👉 Local: http://127.0.0.1:{port}/")
    print(f"📚 Swagger UI Docs: http://127.0.0.1:{port}/api/docs/")
    print(f"🔍 API Schema: http://127.0.0.1:{port}/api/schema/")
    print(f"========================================================\n")

    # Launch Django runserver
    execute_from_command_line([sys.argv[0], 'runserver', addr])

if __name__ == '__main__':
    main()
