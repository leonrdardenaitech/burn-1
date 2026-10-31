"""
YELLE // Reviewer Authentication Module
Handles:
- reviewers table in vault_audit.db
- bcrypt password verification & hashing
- signed session cookies with 7-day expiration
"""

import os
import time
import sqlite3
import bcrypt
from typing import Optional, Dict, Any
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

DB_PATH = os.environ.get("BURN1_VAULT_DB", "/opt/burn1-engine/vault_audit.db")
SECRET_KEY = os.environ.get("REVIEW_SESSION_SECRET", "yelle-anergi-review-secret-2026-burn1-sha256")
COOKIE_NAME = "yelle_session"
SESSION_MAX_AGE = 7 * 24 * 3600  # 7 days

serializer = URLSafeTimedSerializer(SECRET_KEY)

def get_db_connection():
    os.makedirs(os.path.dirname(os.path.abspath(DB_PATH)), exist_ok=True)
    conn = sqlite3.connect(os.path.abspath(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_reviewers_table():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS reviewers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at INTEGER,
        last_login INTEGER
    )
    """)
    conn.commit()
    conn.close()

def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def seed_reviewer(email: str, plain_password: str, name: str = "Anergi"):
    init_reviewers_table()
    conn = get_db_connection()
    cur = conn.cursor()
    p_hash = hash_password(plain_password)
    now = int(time.time())
    cur.execute("""
        INSERT INTO reviewers (email, password_hash, name, created_at, last_login)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash, name=excluded.name
    """, (email, p_hash, name, now, now))
    conn.commit()
    conn.close()

def authenticate_reviewer(email: str, plain_password: str) -> Optional[Dict[str, Any]]:
    init_reviewers_table()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM reviewers WHERE email = ?", (email.strip().lower(),))
    row = cur.fetchone()
    if not row:
        conn.close()
        return None

    if verify_password(plain_password, row["password_hash"]):
        now = int(time.time())
        cur.execute("UPDATE reviewers SET last_login = ? WHERE id = ?", (now, row["id"]))
        conn.commit()
        reviewer_data = dict(row)
        conn.close()
        return reviewer_data

    conn.close()
    return None

def create_session_token(email: str) -> str:
    return serializer.dumps({"email": email.strip().lower(), "ts": time.time()})

def verify_session_token(token: str) -> Optional[str]:
    if not token:
        return None
    try:
        data = serializer.loads(token, max_age=SESSION_MAX_AGE)
        return data.get("email")
    except (BadSignature, SignatureExpired):
        return None
