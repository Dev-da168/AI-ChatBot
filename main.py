from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import date, datetime, timedelta


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Dental Clinic Customer Service Chatbot",
    description="Customer service and appointment chatbot for a dental clinic",
    version="1.0.0"
)


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


# ============================================================
# DATA MODELS
# ============================================================

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    options: list[str] = []


# ============================================================
# TEMPORARY APPOINTMENT STORAGE
# ============================================================
#
# This stores appointments only while the server is running.
#
# Later, we can replace this with MySQL/PostgreSQL.
#

appointments = []


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


# ============================================================
# HOME PAGE
# ============================================================

@app.get("/")
def home():

    return FileResponse("index.html")


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

        return (
            "Which service would you like to know the price of?",
            SERVICES
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

    return ChatResponse(
        response=response,
        options=options
    )


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


    # Remove already booked times

    booked_times = []

    for appointment in appointments:

        if appointment["date"] == selected_date:

            booked_times.append(
                appointment["time"]
            )


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

    services: list[str] | None = None

    service: str | None = None

    date: str

    time: str

    name: str

    phone: str


@app.post("/appointment")
def create_appointment(
    appointment: AppointmentRequest
):

    services = appointment.services or (
        [appointment.service]
        if appointment.service
        else []
    )

    if not services:

        return {
            "success": False,
            "message": "Select at least one service."
        }

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


    # Check if time is already booked

    for existing in appointments:

        if (
            existing["date"]
            == appointment.date
            and existing["time"]
            == appointment.time
        ):

            return {
                "success": False,
                "message": "This time slot is already booked."
            }


    # Create appointment ID

    appointment_id = (
        "APT-"
        + datetime.now().strftime("%Y%m%d%H%M%S")
    )


    new_appointment = {

        "id": appointment_id,

        "services": services,

        "service": ", ".join(services),

        "date": appointment.date,

        "time": appointment.time,

        "name": appointment.name,

        "phone": appointment.phone
    }


    appointments.append(
        new_appointment
    )


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

    return {
        "appointments": appointments
    }