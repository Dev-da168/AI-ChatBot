from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from datetime import date, datetime, timedelta
import sqlite3
import json
import os
import uuid

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

_genai_module = None
try:
    from google import genai as _genai_module
    _GEMINI_AVAILABLE = True
except ImportError:
    try:
        import google.generativeai as _genai_module  # fallback
        _GEMINI_AVAILABLE = True
    except ImportError:
        _GEMINI_AVAILABLE = False


# ============================================================
# DATABASE SETUP  (SQLite — built-in, zero config)
# ============================================================

# On serverless environments like Vercel, the root filesystem is read-only.
# We store the SQLite DB in /tmp when running on Vercel.
if os.environ.get("CLINIC_DB_PATH"):
    DB_PATH = os.environ["CLINIC_DB_PATH"]
elif os.environ.get("VERCEL"):
    DB_PATH = "/tmp/clinic.db"
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), "clinic.db")


def get_db():
    """Open a database connection with dict-like row access."""
    conn = sqlite3.connect(DB_PATH, timeout=15)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA busy_timeout = 15000")
    return conn


def init_db():
    """Create tables if they do not already exist."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS appointments (
                id          TEXT PRIMARY KEY,
                services    TEXT NOT NULL,
                service     TEXT NOT NULL,
                date        TEXT NOT NULL,
                time        TEXT NOT NULL,
                name        TEXT NOT NULL,
                phone       TEXT NOT NULL,
                created_at  TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS product_orders (
                id          TEXT PRIMARY KEY,
                items       TEXT NOT NULL,
                total_cents INTEGER NOT NULL,
                date        TEXT NOT NULL,
                time        TEXT NOT NULL,
                name        TEXT NOT NULL,
                phone       TEXT NOT NULL,
                address     TEXT NOT NULL,
                created_at  TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS chat_history (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id  TEXT NOT NULL,
                role        TEXT NOT NULL,
                message     TEXT NOT NULL,
                source      TEXT NOT NULL DEFAULT 'clinic',
                created_at  TEXT NOT NULL
            );
        """)
        # Migration: add 'source' column to existing databases
        columns = [
            row[1]
            for row in conn.execute("PRAGMA table_info(chat_history)").fetchall()
        ]
        if "source" not in columns:
            try:
                conn.execute(
                    "ALTER TABLE chat_history ADD COLUMN source TEXT NOT NULL DEFAULT 'clinic'"
                )
            except Exception:
                pass  # column already exists in this session


# Ensure tables exist immediately on import (essential for serverless environments)
init_db()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Dental Clinic Customer Service Chatbot",
    description="Customer service and appointment chatbot for a dental clinic",
    version="1.0.0"
)


@app.on_event("startup")
def startup_event():
    init_db()


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def handle_vercel_prefixes(request: Request, call_next):
    """Normalize paths forwarded by Vercel serverless functions."""
    # When Vercel rewrites requests to /api/index.py, the original requested path
    # is passed in x-matched-path or x-invoke-path or x-forwarded-uri.
    original = (
        request.headers.get("x-matched-path")
        or request.headers.get("x-invoke-path")
        or request.headers.get("x-forwarded-uri")
    )
    if original and original not in ("/api/index.py", "/api/index", "/api", "/api/"):
        request.scope["path"] = original.split("?")[0]
    else:
        path = request.scope.get("path", "")
        if path in ("/api", "/api/", "/api/index.py", "/api/index"):
            request.scope["path"] = "/"
        elif path.startswith("/api/index.py/"):
            request.scope["path"] = "/" + path[14:].lstrip("/")
        elif path.startswith("/api/"):
            request.scope["path"] = "/" + path[5:].lstrip("/")

    return await call_next(request)


IMG_DIR = os.path.join(os.path.dirname(__file__), "img")
if not os.path.exists(IMG_DIR):
    IMG_DIR = os.path.join(os.path.dirname(__file__), "public", "img")

if os.path.exists(IMG_DIR):
    app.mount("/img", StaticFiles(directory=IMG_DIR), name="img")
    app.mount("/api/img", StaticFiles(directory=IMG_DIR), name="api_img")

ASSET_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/css", StaticFiles(directory=os.path.join(ASSET_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(ASSET_DIR, "js")), name="js")


# ============================================================
# DATA MODELS
# ============================================================

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    response: str
    options: list[str] = []


# ============================================================
# CLINIC INFORMATION
# ============================================================

CLINIC_NAME = "Dental Clinic"

CLINIC_PHONE = "+855 12 345 678"

CLINIC_EMAIL = "dentalclinic@gmail.com"

OPENING_HOUR = 8

CLOSING_HOUR = 18


SERVICES = [
    "🦷 Dental Check-up",
    "🪥 Teeth Cleaning",
    "✨ Teeth Whitening",
    "🩹 Dental Filling",
    "🦷 Tooth Extraction"
]

SERVICE_PRICES = {
    "Dental Check-up": "$10 USD",
    "Teeth Cleaning": "$15 USD",
    "Teeth Whitening": "$50 USD",
    "Dental Filling": "$35 USD",
    "Tooth Extraction": "$60 USD"
}

PRODUCTS = {
    "toothpaste": {
        "name": "Toothpaste",
        "price_cents": 500
    },
    "toothbrush": {
        "name": "Toothbrush",
        "price_cents": 100
    },
    "oral_rinse": {
        "name": "Oral Rinse",
        "price_cents": 500
    }
}

# ============================================================
# HOME PAGE
# ============================================================

def _get_index_html_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(base_dir, "public", "index.html"),
        os.path.join(base_dir, "index.html"),
        os.path.join(os.getcwd(), "public", "index.html"),
        os.path.join(os.getcwd(), "index.html"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    return "index.html"


@app.get("/")
@app.get("/api")
@app.get("/api/")
@app.get("/api/index.py")
def home():
    return FileResponse(_get_index_html_path())


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "Dental Clinic Chatbot"
    }


# ============================================================
# CHATBOT RESPONSE
# ============================================================

def get_response(message):

    original_message = message.strip()

    message = original_message.lower()


    # --------------------------------------------------------
    # GREETING
    # --------------------------------------------------------

    if (
        message == "hi"
        or message == "hello"
        or message == "hey"
        or "good morning" in message
        or "good afternoon" in message
    ):

        return (
            "Hello! 👋 Welcome to our dental clinic.\n\n"
            "How can I help you today?",
            [
                "📅 Make an Appointment",
                "🏥 Dental Services",
                "🛍️ Shop Products",
                "💰 Price Information",
                "🕐 Opening Hours",
                "📞 Contact Us"
            ]
        )


    # --------------------------------------------------------
    # MAIN MENU
    # --------------------------------------------------------

    if (
        "main menu" in message
        or "go back" in message
    ):

        return (
            "Sure! What can I help you with?",
            [
                "📅 Make an Appointment",
                "🏥 Dental Services",
                "🛍️ Shop Products",
                "💰 Price Information",
                "🕐 Opening Hours",
                "📞 Contact Us"
            ]
        )


    # --------------------------------------------------------
    # MAKE APPOINTMENT
    # --------------------------------------------------------

    if (
        "make an appointment" in message
       
    ):

        return (
            "Sure! 📅 I can help you make an appointment.\n\n"
            "First, please select the dental service you need:",
            SERVICES
        )


    # --------------------------------------------------------
    # DENTAL SERVICES
    # --------------------------------------------------------

    if (
        "dental services" in message
        
    ):

        return (
            "Here are the dental services available at our clinic.\n\n"
            "Please select a service to learn more:",
            SERVICES
        )
        

    # --------------------------------------------------------
    # DENTAL CHECK-UP
    # --------------------------------------------------------

    if "dental check-up" in message:

        return (
            "🦷 Dental Check-up\n\n"
            "A dental check-up allows the dentist to "
            "examine your teeth and gums and identify "
            "possible dental problems.\n\n"
            "Price: " + SERVICE_PRICES["Dental Check-up"] + "\n\n"
            "Would you like to make an appointment?",
            [
                "📅 make an appointment",
                "⬅️ Main Menu"
            ]
        )


    # --------------------------------------------------------
    # TEETH CLEANING
    # --------------------------------------------------------

    if "teeth cleaning" in message:

        return (
            "🪥 Teeth Cleaning\n\n"
            "Professional dental cleaning helps remove "
            "plaque and tartar that regular brushing may "
            "not completely remove.\n\n"
            "Price: " + SERVICE_PRICES["Teeth Cleaning"] + "\n\n"
            "Would you like to make an appointment?",
            [
                "📅 make an appointment",
                "⬅️ Main Menu"
            ]
        )


    # --------------------------------------------------------
    # TEETH WHITENING
    # --------------------------------------------------------

    if "teeth whitening" in message:

        return (
            "✨ Teeth Whitening\n\n"
            "Professional teeth whitening can help improve "
            "the appearance of stained or discolored teeth.\n\n"
            "Price: " + SERVICE_PRICES["Teeth Whitening"] + "\n\n"
            "Would you like to make an appointment?",
            [
                "📅 make an appointment",
                "⬅️ Main Menu"
            ]
        )


    # --------------------------------------------------------
    # DENTAL FILLING
    # --------------------------------------------------------

    if "dental filling" in message:

        return (
            "🩹 Dental Filling\n\n"
            "Dental fillings are commonly used to repair "
            "teeth affected by cavities or damage.\n\n"
            "Price: " + SERVICE_PRICES["Dental Filling"] + "\n\n"
            "Would you like to make an appointment?",
            [
                "📅 make an appointment",
                "⬅️ Main Menu"
            ]
        )


    # --------------------------------------------------------
    # TOOTH EXTRACTION
    # --------------------------------------------------------

    if "tooth extraction" in message:

        return (
            "🦷 Tooth Extraction\n\n"
            "A dentist may recommend extraction when a tooth "
            "cannot be safely repaired.\n\n"
            "A dental examination is recommended first.\n\n"
            "Price: " + SERVICE_PRICES["Tooth Extraction"] + "\n\n"
            "Would you like to book a consultation?",
            [
                "📅 make an appointment",
                "⬅️ Main Menu"
            ]
        )

    # --------------------------------------------------------
    # PRICE
    # --------------------------------------------------------

    if (
        "price information" in message
        or "price" in message
        or "cost" in message
        or "fee" in message
        or "pricing" in message
    ):

        price_list = "\n".join(
            service + " — " + SERVICE_PRICES[service_name]
            for service_name, service in zip(SERVICE_PRICES, SERVICES)
        )

        return (
            "Our service price list:\n\n" + price_list,
            ["🏥 Dental Services", "⬅️ Main Menu"]
        )


    # --------------------------------------------------------
    # OPENING HOURS
    # --------------------------------------------------------

    if (
        "opening hours" in message
        or "opening" in message
        or message == "hours"
        or message == "open"
    ):

        return (
            "🕐 Our clinic opening hours:\n\n"
            "Monday - Saturday\n"
            "8:00 AM - 6:00 PM\n\n"
            "Sunday: Closed",
            [
                "📅 Make an Appointment",
                "🏥 Dental Services",
                "🛍️ Shop Products",
                "📞 Contact Us"
            ]
        )


    # --------------------------------------------------------
    # CONTACT
    # --------------------------------------------------------

    if (
        "contact us" in message
        or "contact" in message
        or "phone" in message
        or "telephone" in message
    ):

        return (
            "📞 Contact our dental clinic:\n\n"
            "Phone: " + CLINIC_PHONE + "\n"
            "Email: " + CLINIC_EMAIL,
            [
                "📅 Make an Appointment",
                "🏥 Dental Services",
                "🛍️ Shop Products",
                "🕐 Opening Hours",
                "⬅️ Main Menu"
            ]
        )


    # --------------------------------------------------------
    # THANK YOU
    # --------------------------------------------------------

    if (
        "thank" in message
        or "thanks" in message
    ):

        return (
            "You're very welcome! 😊\n\n"
            "How else can I help you?",
            [
                "📅 Make an Appointment",
                "🏥 Dental Services",
                "⬅️ Main Menu"
            ]
        )


    # --------------------------------------------------------
    # GOODBYE
    # --------------------------------------------------------

    if (
        "bye" in message
        or "goodbye" in message
    ):

        return (
            "Goodbye! 👋\n\n"
            "Thank you for contacting our dental clinic.",
            []
        )


    # --------------------------------------------------------
    # DEFAULT
    # --------------------------------------------------------

    return (
        "I'm here to help with dental questions, "
        "appointments, and general clinic information. 🦷\n\n"
        "Please select an option below:",
        [
            "📅 Make an Appointment",
            "🏥 Dental Services",
            "🛍️ Shop Products",
            "💰 Price Information",
            "🕐 Opening Hours",
            "📞 Contact Us"
        ]
    )


# ============================================================
# CHAT API
# ============================================================

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    response, options = get_response(
        request.message
    )

    now = datetime.now().isoformat()

    with get_db() as conn:
        conn.execute(
            "INSERT INTO chat_history (session_id, role, message, source, created_at) VALUES (?, ?, ?, ?, ?)",
            (request.session_id, "user", request.message, "clinic", now)
        )
        conn.execute(
            "INSERT INTO chat_history (session_id, role, message, source, created_at) VALUES (?, ?, ?, ?, ?)",
            (request.session_id, "bot", response, "clinic", now)
        )

    return ChatResponse(
        response=response,
        options=options
    )


# ============================================================
# CHAT HISTORY
# ============================================================

@app.get("/chat/history")
def chat_history(session_id: str = "default", limit: int = 50):
    """Return the last *limit* messages for a given session."""
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, session_id, role, message, created_at
            FROM chat_history
            WHERE session_id = ?
            ORDER BY id DESC
            LIMIT ?
            """,
            (session_id, limit)
        ).fetchall()

    history = [dict(row) for row in reversed(rows)]
    return {"session_id": session_id, "history": history}


@app.delete("/chat/history")
def clear_chat_history(session_id: str = "default"):
    """Delete all stored messages for a given session."""
    with get_db() as conn:
        conn.execute(
            "DELETE FROM chat_history WHERE session_id = ?",
            (session_id,)
        )
    return {"success": True, "message": f"History cleared for session '{session_id}'."}


# ============================================================
# AVAILABLE TIME SLOTS
# ============================================================

@app.get("/appointment/times")
def appointment_times(selected_date: str):

    try:

        selected = datetime.strptime(
            selected_date,
            "%Y-%m-%d"
        ).date()

    except ValueError:

        return {
            "available": False,
            "message": "Invalid date."
        }


    # Sunday closed

    if selected.weekday() == 6:

        return {
            "available": False,
            "message": "The clinic is closed on Sunday.",
            "times": []
        }


    # All appointment slots

    times = [
        "8:00 AM",
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
        "5:00 PM"
    ]


    # Remove already booked times (from database)

    with get_db() as conn:
        booked_rows = conn.execute(
            "SELECT time FROM appointments WHERE date = ?",
            (selected_date,)
        ).fetchall()

    booked_times = {row["time"] for row in booked_rows}

    available_times = [
        time
        for time in times
        if time not in booked_times
    ]


    return {
        "available": True,
        "times": available_times
    }


# ============================================================
# CREATE APPOINTMENT
# ============================================================

class AppointmentRequest(BaseModel):

    services: list[str] | None = Field(default=None, min_length=1, max_length=5)

    service: str | None = Field(default=None, min_length=1, max_length=120)

    date: str = Field(min_length=10, max_length=10)

    time: str = Field(min_length=1, max_length=20)

    name: str = Field(min_length=1, max_length=120)

    phone: str = Field(min_length=1, max_length=40)


@app.post("/appointment")
def create_appointment(
    appointment: AppointmentRequest
):

    services = appointment.services or (
        [appointment.service]
        if appointment.service
        else []
    )

    services = [service.strip() for service in services if service.strip()]

    if not services:

        return {
            "success": False,
            "message": "Select at least one service."
        }

    valid_services = set(SERVICE_PRICES)
    normalized_services = []
    for service in services:
        matched_service = next(
            (
                service_name
                for service_name in valid_services
                if service_name.lower() == service.lower()
            ),
            None
        )
        if matched_service is None:
            raise HTTPException(
                status_code=422,
                detail="One or more selected services are unavailable."
            )
        normalized_services.append(matched_service)
    services = list(dict.fromkeys(normalized_services))

    name = appointment.name.strip()
    phone = appointment.phone.strip()
    if not name or not phone:
        raise HTTPException(
            status_code=422,
            detail="Name and phone number are required."
        )

    # Check date

    try:

        selected_date = datetime.strptime(
            appointment.date,
            "%Y-%m-%d"
        ).date()

    except ValueError:

        return {
            "success": False,
            "message": "Invalid date."
        }


    # Sunday

    if selected_date.weekday() == 6:

        return {
            "success": False,
            "message": "The clinic is closed on Sunday."
        }

    if selected_date < date.today():
        raise HTTPException(
            status_code=422,
            detail="Appointment date cannot be in the past."
        )

    valid_times = [
        "8:00 AM",
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
        "5:00 PM"
    ]
    if appointment.time not in valid_times:
        raise HTTPException(
            status_code=422,
            detail="Select a valid appointment time."
        )

    # Create appointment ID

    appointment_id = "APT-" + uuid.uuid4().hex[:12].upper()

    service_str = ", ".join(services)
    now = datetime.now().isoformat()

    # Serialize booking writes so two requests cannot claim the same slot.
    with get_db() as conn:
        conn.execute("BEGIN IMMEDIATE")
        existing = conn.execute(
            "SELECT id FROM appointments WHERE date = ? AND time = ?",
            (appointment.date, appointment.time)
        ).fetchone()

        if existing:
            return {
                "success": False,
                "message": "This time slot is already booked."
            }

        conn.execute(
            """
            INSERT INTO appointments (id, services, service, date, time, name, phone, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                appointment_id,
                json.dumps(services),
                service_str,
                appointment.date,
                appointment.time,
                name,
                phone,
                now
            )
        )

    new_appointment = {
        "id": appointment_id,
        "services": services,
        "service": service_str,
        "date": appointment.date,
        "time": appointment.time,
        "name": name,
        "phone": phone
    }

    return {
        "success": True,
        "message": "Appointment successfully created.",
        "appointment": new_appointment
    }


# ============================================================
# VIEW APPOINTMENTS
# ============================================================

@app.get("/appointments")
def get_appointments():

    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM appointments ORDER BY date, time"
        ).fetchall()

    result = []
    for row in rows:
        item = dict(row)
        item["services"] = json.loads(item["services"])
        result.append(item)

    return {"appointments": result}


# ============================================================
# PRODUCT ORDERS
# ============================================================

class ProductOrderItem(BaseModel):

    product_id: str

    quantity: int = Field(ge=1, le=99)


class ProductOrderRequest(BaseModel):

    items: list[ProductOrderItem] = Field(min_length=1, max_length=3)

    date: str

    time: str

    name: str = Field(min_length=1, max_length=120)

    phone: str = Field(min_length=1, max_length=40)

    address: str = Field(min_length=1, max_length=500)


DELIVERY_TIMES = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
]


@app.post("/orders")
def create_product_order(order: ProductOrderRequest):

    name = order.name.strip()
    phone = order.phone.strip()
    address = order.address.strip()

    if not name or not phone or not address:
        raise HTTPException(
            status_code=422,
            detail="Name, phone, and delivery address are required."
        )

    try:
        delivery_date = datetime.strptime(
            order.date,
            "%Y-%m-%d"
        ).date()
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail="Invalid delivery date."
        ) from error

    if delivery_date < date.today():
        raise HTTPException(
            status_code=422,
            detail="Delivery date cannot be in the past."
        )

    if delivery_date.weekday() == 6:
        raise HTTPException(
            status_code=422,
            detail="Deliveries are not available on Sunday."
        )

    if order.time not in DELIVERY_TIMES:
        raise HTTPException(
            status_code=422,
            detail="Select a valid delivery time."
        )

    order_items = []
    total_cents = 0

    for item in order.items:
        product = PRODUCTS.get(item.product_id)

        if product is None:
            raise HTTPException(
                status_code=422,
                detail="A selected product is unavailable."
            )

        line_total_cents = product["price_cents"] * item.quantity
        total_cents += line_total_cents
        order_items.append({
            "product_id": item.product_id,
            "name": product["name"],
            "quantity": item.quantity,
            "unit_price_cents": product["price_cents"],
            "line_total_cents": line_total_cents
        })

    now = datetime.now().isoformat()

    with get_db() as conn:
        order_id = "ORD-" + uuid.uuid4().hex[:12].upper()

        conn.execute(
            """
            INSERT INTO product_orders (id, items, total_cents, date, time, name, phone, address, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order_id,
                json.dumps(order_items),
                total_cents,
                order.date,
                order.time,
                name,
                phone,
                address,
                now
            )
        )

    return {
        "success": True,
        "order": {
            "id": order_id,
            "total_cents": total_cents,
            "date": order.date,
            "time": order.time
        }
    }


# ============================================================
# VIEW PRODUCT ORDERS
# ============================================================

@app.get("/orders")
def get_product_orders():

    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM product_orders ORDER BY created_at DESC"
        ).fetchall()

    result = []
    for row in rows:
        item = dict(row)
        item["items"] = json.loads(item["items"])
        result.append(item)

    return {"orders": result}


# ============================================================
# DENTAL KNOWLEDGE AI  (Gemini)
# ============================================================

DENTAL_SYSTEM_PROMPT = """
You are Dr. Dento, a friendly and knowledgeable dental health assistant 
working for a dental clinic. Your role is ONLY to answer questions about:
- Dental health, oral hygiene, and tooth care
- Common dental conditions and symptoms
- Dental procedures and treatments
- Dental products and their usage
- When to see a dentist and what to expect

Rules:
1. ONLY answer dental/oral-health questions. If the user asks about 
   anything unrelated, kindly redirect them: say you can only help 
   with dental health questions.
2. Always recommend consulting a dentist for diagnosis or treatment.
3. Be warm, clear, and easy to understand — avoid overly technical jargon.
4. Keep answers concise (2-5 short paragraphs max).
5. Never diagnose a patient. Suggest professional evaluation instead.
6. Use emojis sparingly (1-2 per response) to keep things friendly.
"""


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    session_id: str = Field(default="default", min_length=1, max_length=128)


class AskResponse(BaseModel):
    answer: str
    disclaimer: str = (
        "This information is for educational purposes only. "
        "Please consult a qualified dentist for personal medical advice."
    )


@app.post("/ask", response_model=AskResponse)
def ask_dental(request: AskRequest):
    """Answer dental knowledge questions using Google Gemini."""

    api_key = os.environ.get("GEMINI_API_KEY", "")

    if not _GEMINI_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="AI service unavailable. Install google-genai."
        )

    assert _genai_module is not None

    if not api_key or api_key == "your_api_key_here":
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not configured. Please add it to your .env file."
        )

    if not request.question.strip():
        raise HTTPException(
            status_code=422,
            detail="Question cannot be empty."
        )

    try:
        # Build conversation history from DB
        with get_db() as conn:
            past = conn.execute(
                """
                SELECT role, message FROM chat_history
                WHERE session_id = ? AND source = 'dental_ai'
                ORDER BY id DESC LIMIT 6
                """,
                (request.session_id,)
            ).fetchall()

        contents = []
        for row in reversed(past):
            contents.append({
                "role": "user" if row["role"] == "user" else "model",
                "parts": [{"text": row["message"]}]
            })
        # Add the current user message
        contents.append({"role": "user", "parts": [{"text": request.question}]})

        client = _genai_module.Client(
            api_key=api_key,
            http_options=_genai_module.types.HttpOptions(
                timeout=12000,
                retry_options=_genai_module.types.HttpRetryOptions(
                    attempts=2,
                    initial_delay=0.5,
                    max_delay=1.0,
                    jitter=0,
                ),
            ),
        )
        model_name = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")
        gemini_response = client.models.generate_content(
            model=model_name,
            contents=contents,
            config=_genai_module.types.GenerateContentConfig(
                system_instruction=DENTAL_SYSTEM_PROMPT,
                max_output_tokens=600,
                temperature=0.6,
            )
        )
        if not gemini_response.text or not gemini_response.text.strip():
            raise RuntimeError("AI service returned an empty response.")
        answer = gemini_response.text.strip()

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {str(exc)}"
        ) from exc

    # Save to history
    now = datetime.now().isoformat()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO chat_history (session_id, role, message, source, created_at) VALUES (?, ?, ?, ?, ?)",
            (request.session_id, "user", request.question, "dental_ai", now)
        )
        conn.execute(
            "INSERT INTO chat_history (session_id, role, message, source, created_at) VALUES (?, ?, ?, ?, ?)",
            (request.session_id, "bot", answer, "dental_ai", now)
        )

    return AskResponse(answer=answer)