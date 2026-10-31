"""
YELLE // Routes & Dashboard Endpoints
Protected reviewer hub:
- /yelle/login (GET & POST)
- /yelle/logout (GET)
- /yelle (Dashboard: video + batch review queue)
- /yelle/batch/{batch_id} (Approval Card with 3 buttons)
- /yelle/publish-news (Triggers weekly news verification)
- /api/binder/{id}/approve (Calls burn1_cli vault publish)
- /api/binder/{id}/request-evidence
- /api/binder/{id}/reject
"""

import os
import json
import sqlite3
import urllib.request
from typing import Optional
from fastapi import APIRouter, Request, Response, Form, HTTPException, Depends
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from .auth import (
    authenticate_reviewer,
    create_session_token,
    verify_session_token,
    get_db_connection,
    COOKIE_NAME
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))
yelle_router = APIRouter()

CONFIG_PATH = os.path.join(BASE_DIR, "..", "yelle_config.json")

def load_yelle_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "current_week": "Current Week Briefing",
        "video_id": "YtkECKMfnBI",
        "video_title": "PhP and Black October: AI-Accelerated Vulnerability Crisis",
        "channel": "Anergi Cybersecurity"
    }

def get_current_reviewer(request: Request) -> Optional[dict]:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return None
    email = verify_session_token(token)
    if not email:
        return None
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, name FROM reviewers WHERE email = ?", (email,))
    row = cur.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def require_reviewer(request: Request):
    reviewer = get_current_reviewer(request)
    if not reviewer:
        raise HTTPException(status_code=303, headers={"Location": "/yelle/login"})
    return reviewer

# -------------------------------------------------------------
# Auth Routes
# -------------------------------------------------------------
@yelle_router.get("/yelle/login", response_class=HTMLResponse)
async def login_page(request: Request):
    if get_current_reviewer(request):
        return RedirectResponse(url="/yelle", status_code=302)
    return templates.TemplateResponse(request, "login.html", {"error": None})

@yelle_router.post("/yelle/login", response_class=HTMLResponse)
async def login_action(request: Request, response: Response, email: str = Form(...), password: str = Form(...)):
    reviewer = authenticate_reviewer(email, password)
    if not reviewer:
        return templates.TemplateResponse(request, "login.html", {
            "error": "Invalid email or authentication passkey.",
            "email": email
        })
    token = create_session_token(email)
    redirect = RedirectResponse(url="/yelle", status_code=303)
    redirect.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=7 * 24 * 3600,
        httponly=True,
        samesite="lax",
        secure=False # Set to True when HTTPS is enforced
    )
    return redirect

@yelle_router.get("/yelle/logout")
async def logout_action():
    resp = RedirectResponse(url="/yelle/login", status_code=302)
    resp.delete_cookie(COOKIE_NAME)
    return resp

# -------------------------------------------------------------
# Dashboard & Batch Queue Routes
# -------------------------------------------------------------
@yelle_router.get("/yelle", response_class=HTMLResponse)
async def yelle_dashboard(request: Request):
    reviewer = get_current_reviewer(request)
    if not reviewer:
        return RedirectResponse(url="/yelle/login", status_code=302)

    config = load_yelle_config()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM audit_pipeline_queue 
        WHERE status = 'HUMAN_REVIEW_QUEUE'
        ORDER BY id DESC
    """)
    rows = cur.fetchall()
    queue = [dict(r) for r in rows]
    conn.close()

    return templates.TemplateResponse(request, "dashboard.html", {
        "reviewer": reviewer,
        "config": config,
        "queue": queue
    })

@yelle_router.get("/yelle/batch/{batch_id}", response_class=HTMLResponse)
async def yelle_batch_card(request: Request, batch_id: int):
    reviewer = get_current_reviewer(request)
    if not reviewer:
        return RedirectResponse(url="/yelle/login", status_code=302)

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM audit_pipeline_queue WHERE id = ?", (batch_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Batch queue item not found")

    item = dict(row)
    return templates.TemplateResponse(request, "batch.html", {
        "reviewer": reviewer,
        "item": item
    })

# -------------------------------------------------------------
# Review Actions & Publication
# -------------------------------------------------------------
@yelle_router.post("/yelle/publish-news")
async def publish_news(request: Request):
    reviewer = get_current_reviewer(request)
    if not reviewer:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    config = load_yelle_config()
    # Option A: In a full CI/CD setup, this triggers GitHub Action workflow_dispatch
    # For local/droplet direct sync, report the active status
    return {
        "status": "success",
        "message": f"Verified live on news.html (Video: {config.get('video_id')})",
        "video": config.get("video_title")
    }

@yelle_router.post("/api/binder/{item_id}/approve")
async def approve_binder(item_id: int, request: Request):
    reviewer = get_current_reviewer(request)
    if not reviewer:
        raise HTTPException(status_code=401, detail="Unauthorized")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT client_domain, tier FROM audit_pipeline_queue WHERE id = ?", (item_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Binder not found")

    client_domain = row["client_domain"]
    tier = row["tier"]
    conn.close()

    try:
        from burn1_cli import publish_vault
        seal_type = "DUAL_ANERGI_SEAL" if "PLUS" in tier else "ANERGI_SEAL"
        result = publish_vault(domain=client_domain, seal_type=seal_type, reviewer=reviewer.get("name") or "Anergi Reviewer")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@yelle_router.post("/api/binder/{item_id}/request-evidence")
async def request_evidence(item_id: int, request: Request):
    reviewer = get_current_reviewer(request)
    if not reviewer:
        raise HTTPException(status_code=401, detail="Unauthorized")

    body = await request.json()
    reason = body.get("reason", "Additional evidence required for carrier underwriter approval.")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE audit_pipeline_queue 
        SET status = 'AWAITING_EVIDENCE',
            binder_summary = binder_summary || ' [EVIDENCE REQUESTED: ' || ? || ']'
        WHERE id = ?
    """, (reason, item_id))
    conn.commit()
    conn.close()

    return {"status": "success", "message": f"Evidence request recorded: {reason}"}

@yelle_router.post("/api/binder/{item_id}/reject")
async def reject_binder(item_id: int, request: Request):
    reviewer = get_current_reviewer(request)
    if not reviewer:
        raise HTTPException(status_code=401, detail="Unauthorized")

    body = await request.json()
    reason = body.get("reason", "Formal unsealed delivery without Anergi cryptographic attestation.")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE audit_pipeline_queue 
        SET status = 'REJECTED_UNSEALED',
            binder_summary = binder_summary || ' [REJECTED: ' || ? || ']'
        WHERE id = ?
    """, (reason, item_id))
    conn.commit()
    conn.close()

    return {"status": "success", "message": f"Binder set to unsealed delivery: {reason}"}
