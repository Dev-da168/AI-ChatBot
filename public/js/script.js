/* ============================================================
   ELEMENTS
============================================================ */

const welcomeScreen =
    document.getElementById(
        "welcomeScreen"
    );


const chatScreen =
    document.getElementById(
        "chatScreen"
    );


const chatBox =
    document.getElementById(
        "chatBox"
    );


const messageInput =
    document.getElementById(
        "messageInput"
    );


const sendButton =
    document.getElementById(
        "sendButton"
    );


/* ============================================================
   APPOINTMENT STATE
============================================================ */

let appointment = {

    services: [],

    date: "",

    time: "",

    name: "",

    phone: ""

};
// Tracks how the user entered the service flow
let appointmentMode = false;
let currentLanguage = "en";

const translations = {
    en: {
        title: "Dental Clinic",
        subtitle: "Customer Service Assistant",
        welcomeDescription: "Our virtual assistant can help you make appointments, learn about dental services, and get information about common dental concerns.",
        startChat: "Start Chat",
        startAiChat: "🧠 Ask Dental AI",
        chatTitle: "Dental Assistant",
        online: "Online",
        messagePlaceholder: "Ask about your teeth...",
        aiTitle: "Dental AI",
        aiSubtitle: "Ask me anything dental",
        aiMessagePlaceholder: "e.g. Why do my gums bleed?",
        aiGreeting: "Hi! I'm Dr. Dento 🦷\n\nI can answer your dental health questions — from brushing tips to understanding treatments.\n\nWhat would you like to know?",
        aiDisclaimer: "⚕️ For educational purposes only. Always consult your dentist.",
        aiSuggestionBrush: "How often should I brush?",
        aiSuggestionDecay: "What causes tooth decay?",
        aiSuggestionGums: "Why do my gums bleed?",
        aiSuggestionWhitening: "Is teeth whitening safe?",
        aiSuggestionRootCanal: "What is a root canal?",
        aiSuggestionBreath: "How to fix bad breath?",
        aiSuggestionKids: "When should kids see a dentist?",
        aiSuggestionFoods: "What foods damage teeth?",
        aiApiKeyTitle: "⚙️ API Key Required",
        aiApiKeyNotice: `To use the Dental AI, you need a free Google Gemini API key:<br><br>
                    1. Visit <strong>aistudio.google.com/app/apikey</strong><br>
                    2. Click <strong>"Create API key"</strong><br>
                    3. Copy the key and open the <code>.env</code> file in your project<br>
                    4. Replace <code>your_api_key_here</code> with your key<br>
                    5. Restart the server`,
        aiError: "Sorry, the AI service encountered a problem. Please try again.",
        aiTimeout: "The AI response is taking longer than expected. Please try again.",
        aiConnectionError: "Sorry, I couldn't connect to the server. Please try again.",
        greeting: "Hello! 👋 Welcome to our dental clinic.\n\nHow can I help you today?",
        appointmentOption: "📅 Make an Appointment",
        serviceOption: "🏥 Dental Services",
        productsOption: "🛍️ Shop Products",
        priceOption: "💰 Price Information",
        hoursOption: "🕐 Opening Hours",
        contactOption: "📞 Contact Us",
        beginAppointment: "Sure! 📅 Let's make your appointment.\n\nFirst, please select the dental service:",
        serviceSelectionHint: "Select one or more services:",
        servicePrompt: "Please select a dental service to learn more:",
        showServiceDetails: "Show selected service details",
        showSelectedPrices: "Show selected prices",
        selectedService: "Excellent! You selected:\n\n🦷 ",
        selectDate: "\n\nPlease select your preferred date.",
        calendarTitle: "📅 Select Appointment Date",
        timesTitle: "🕐 Available Appointment Times",
        continue: "Continue",
        sundayClosed: "The clinic is closed on Sunday. Please select another date.",
        invalidDate: "Invalid date. Please select another date.",
        noTimes: "No appointment times are available on this date.",
        unableTimes: "Unable to load appointment times.",
        chosenDate: "📅 ",
        chosenTime: "🕐 ",
        patientPrompt: "Great! 👤 Now I need some information to create your appointment.",
        patientTitle: "👤 Patient Information",
        fullName: "Full Name",
        namePlaceholder: "Enter your full name",
        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        nameRequired: "Please enter your full name.",
        phoneRequired: "Please enter your phone number.",
        reviewPrompt: "Please review your appointment information.",
        summaryTitle: "📋 Appointment Summary",
        service: "Service",
        date: "Date",
        time: "Time",
        patient: "Patient",
        confirm: "✅ Confirm Appointment",
        saving: "Saving...",
        saveError: "Sorry, something went wrong while saving your appointment.",
        bookingRejected: "The appointment could not be confirmed. Please choose another date or time.",
        success: "🎉 Your appointment has been successfully created!",
        confirmed: "✅ Appointment Confirmed",
        appointmentId: "Appointment ID:",
        confirmationNote: "Our clinic will contact you to confirm your appointment.",
        next: "What would you like to do next?",
        mainMenu: "⬅️ Main Menu",
        makeAppointment: "📅 Make Appointment",
        otherServices: "🏥 Other Services",
        shopPrompt: "Choose the dental products you would like to buy:",
        toothpaste: "Toothpaste",
        toothbrush: "Toothbrush",
        oralRinse: "Oral Rinse",
        quantity: "Qty",
        addToCart: "Add to cart",
        shoppingCart: "🛒 Your Cart",
        cartEmpty: "Your cart is empty.",
        removeItem: "Remove",
        checkout: "🚚 Choose delivery",
        deliveryDetails: "🚚 Delivery details",
        deliveryDate: "Delivery date",
        deliveryTime: "Delivery time",
        selectDeliveryTime: "Select a time",
        customerName: "Your name",
        customerPhone: "Phone number",
        deliveryAddress: "Delivery address",
        addressPlaceholder: "Street, building, area, and any directions",
        placeOrder: "Place order",
        orderError: "We couldn't place your order. Check your details and try again.",
        sundayDelivery: "Delivery is not available on Sunday. Please choose another date.",
        orderSuccess: "✅ Order placed! Order ID: ",
        orderTotal: "Total: ",
        priceLabel: "Price: ",
        priceListTitle: "Our service price list:",
        openingHoursTitle: "🕐 Our clinic opening hours:",
        openingDays: "Monday - Saturday",
        openingTime: "8:00 AM - 6:00 PM",
        sundayClosedLabel: "Sunday: Closed",
        contactTitle: "📞 Contact our dental clinic:",
        phoneLabel: "Phone: ",
        emailLabel: "Email: ",
        checkup: "Dental Check-up",
        cleaning: "Teeth Cleaning",
        whitening: "Teeth Whitening",
        filling: "Dental Filling",
        extraction: "Tooth Extraction",
        clinicAssistant: "Clinic Assistant",
        askDentalAI: "Ask Dental AI",
        newChat: "New chat",
        recentChats: "RECENT CHATS",
        aiBrandName: "Dr. Dento",
        assistantTagline: "Dental health assistant",
        friendlyGuidance: "Friendly guidance, anytime",
        dentalAiTitle: "Dental AI",
        languageLabel: "Reply in",
        aiPrompt: "Ask a dental health question...",
        aiDisclaimer: "Dr. Dento can share general information, but can’t diagnose. Please consult your dentist for personal advice.",
        aiDisclaimerShort: "For educational purposes only. Always consult your dentist.",
        aiHistoryEmpty: "Your conversations will appear here.",
        dentalConversation: "Dental health conversation",
        aiLoadingError: "I couldn't load that conversation. Please try again.",
        aiTimeout: "The AI response is taking longer than expected. Please try again.",
        aiConnectionError: "Sorry, I couldn't connect to the server. Please try again.",
        aiIssuePrefix: "Sorry, I ran into an issue: ",
        aiApiKeyRequired: "API key required",
        aiApiKeyInstructions: "To use Dental AI, configure a Google Gemini API key in your .env file and restart the server.",
        voiceStart: "Start voice input",
        voiceListening: "Listening...",
        voiceUnsupported: "Voice input is not supported in this browser. Try Chrome or Edge.",
        voiceNoSpeech: "No speech was heard. Please try again.",
        voiceDenied: "Microphone access was denied. Allow microphone access and try again.",
        voiceLanguageUnsupported: "Speech recognition for this language is not supported by your browser.",
        voiceError: "Voice input failed. Please try again.",
        aiQuestionAria: "Ask a dental health question",
        aiWelcome: "Hi! I'm Dr. Dento 🦷\n\nI can answer your dental health questions — from brushing tips to understanding treatments.\n\nWhat would you like to know?",
        aiSuggestions: [
            "How often should I brush?",
            "What causes tooth decay?",
            "Why do my gums bleed?",
            "Is teeth whitening safe?",
            "What is a root canal?",
            "How can I improve bad breath?",
            "When should children see a dentist?",
            "What foods can damage teeth?"
        ]
    },
    km: {
        title: "គ្លីនិកធ្មេញ",
        subtitle: "ជំនួយការសេវាកម្មអតិថិជន",
        welcomeDescription: "ជំនួយការនិម្មិតរបស់យើងអាចជួយកក់ការណាត់ជួប ស្វែងយល់អំពីសេវាកម្មទន្តសាស្ត្រ និងទទួលព័ត៌មានអំពីបញ្ហាសុខភាពមាត់ធ្មេញទូទៅ។",
        startChat: "ចាប់ផ្តើម",
        startAiChat: "🧠 សួរ AI ទន្តសាស្ត្រ",
        chatTitle: "ជំនួយការទន្តសាស្ត្រ",
        online: "នៅលើបណ្ដាញ",
        messagePlaceholder: "សួរអំពីសុខភាពមាត់ធ្មេញ...",
        aiTitle: "AI ទន្តសាស្ត្រ",
        aiSubtitle: "សួរខ្ញុំអំពីបញ្ហាសុខភាពមាត់ធ្មេញ",
        aiMessagePlaceholder: "ឧ. ហេតុអ្វីបានជាអញ្ចាញធ្មេញខ្ញុំហូរឈាម?",
        aiGreeting: "សួស្តី! ខ្ញុំគឺលោកវេជ្ជបណ្ឌិត ដេនតូ 🦷\n\nខ្ញុំអាចឆ្លើយសំណួររបស់អ្នកអំពីសុខភាពមាត់ធ្មេញ ចាប់ពីវិធីដុសធ្មេញ រហូតដល់ការពន្យល់អំពីការព្យាបាល។\n\nតើអ្នកចង់សួរអ្វីដែរ?",
        aiDisclaimer: "⚕️ ព័ត៌មាននេះសម្រាប់គោលបំណងអប់រំប៉ុណ្ណោះ។ សូមពិគ្រោះជាមួយទន្តបណ្ឌិតរបស់អ្នកជានិច្ច។",
        aiSuggestionBrush: "តើគួរដុសធ្មេញញឹកញាប់ប៉ុណ្ណា?",
        aiSuggestionDecay: "តើអ្វីបណ្តាលឱ្យពុកធ្មេញ?",
        aiSuggestionGums: "ហេតុអ្វីបានជាអញ្ចាញធ្មេញហូរឈាម?",
        aiSuggestionWhitening: "តើការធ្វើឱ្យធ្មេញសមានសុវត្ថិភាពទេ?",
        aiSuggestionRootCanal: "តើការព្យាបាលឫសធ្មេញជាអ្វី?",
        aiSuggestionBreath: "តើធ្វើដូចម្តេចដើម្បីបំបាត់ក្លិនមាត់?",
        aiSuggestionKids: "តើកុមារគួរទៅជួបទន្តបណ្ឌិតនៅពេលណា?",
        aiSuggestionFoods: "តើអាហារអ្វីខ្លះបំផ្លាញធ្មេញ?",
        aiApiKeyTitle: "⚙️ ត្រូវការសោ API",
        aiApiKeyNotice: `ដើម្បីប្រើ AI ទន្តសាស្ត្រ អ្នកត្រូវការសោ Google Gemini API ឥតគិតថ្លៃ៖<br><br>
                    1. ចូលទៅកាន់ <strong>aistudio.google.com/app/apikey</strong><br>
                    2. ចុច <strong>"Create API key"</strong><br>
                    3. ចម្លងសោ រួចបើកឯកសារ <code>.env</code> ក្នុងគម្រោងរបស់អ្នក<br>
                    4. ជំនួស <code>your_api_key_here</code> ដោយសោរបស់អ្នក<br>
                    5. ចាប់ផ្តើមម៉ាស៊ីនមេឡើងវិញ`,
        aiError: "សូមអភ័យទោស សេវាកម្ម AI មានបញ្ហា។ សូមព្យាយាមម្តងទៀត។",
        aiTimeout: "ការឆ្លើយតបរបស់ AI ចំណាយពេលយូរជាងធម្មតា។ សូមព្យាយាមម្តងទៀត។",
        aiConnectionError: "សូមអភ័យទោស មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។ សូមព្យាយាមម្តងទៀត។",
        greeting: "ជំរាបសួរ! 👋 សូមស្វាគមន៍មកកាន់គ្លីនិកធ្មេញរបស់យើង។\n\nតើខ្ញុំអាចជួយអ្វីអ្នកបានខ្លះ?",
        appointmentOption: "📅 កក់ការណាត់ជួប",
        serviceOption: "🏥 សេវាកម្មទន្តសាស្ត្រ",
        productsOption: "🛍️ ទិញផលិតផល",
        priceOption: "💰 តម្លៃសេវាកម្ម",
        hoursOption: "🕐 ម៉ោងបើកបម្រើ",
        contactOption: "📞 ទាក់ទងយើង",
        beginAppointment: "ខ្ញុំរីករាយជួយអ្នក! 📅 ដើម្បីកក់ការណាត់ជួប សូមជ្រើសរើសសេវាកម្មទន្តសាស្ត្រដែលអ្នកត្រូវការ៖",
        serviceSelectionHint: "សូមជ្រើសរើសសេវាកម្មមួយ ឬច្រើន៖",
        servicePrompt: "សូមជ្រើសរើសសេវាកម្មទន្តសាស្ត្រ ដើម្បីស្វែងយល់បន្ថែម៖",
        showServiceDetails: "បង្ហាញព័ត៌មានសេវាកម្មដែលបានជ្រើសរើស",
        showSelectedPrices: "បង្ហាញតម្លៃសេវាកម្មដែលបានជ្រើសរើស",
        selectedService: "ល្អណាស់! អ្នកបានជ្រើសរើស៖\n\n🦷 ",
        selectDate: "\n\nសូមជ្រើសរើសកាលបរិច្ឆេទដែលអ្នកចង់បាន។",
        calendarTitle: "📅 ជ្រើសរើសកាលបរិច្ឆេទណាត់ជួប",
        timesTitle: "🕐 ម៉ោងណាត់ជួបដែលអាចជ្រើសរើសបាន",
        continue: "បន្ត",
        sundayClosed: "គ្លីនិកបិទនៅថ្ងៃអាទិត្យ។ សូមជ្រើសរើសថ្ងៃផ្សេង។",
        invalidDate: "កាលបរិច្ឆេទមិនត្រឹមត្រូវ។ សូមជ្រើសរើសថ្ងៃផ្សេង។",
        noTimes: "មិនមានម៉ោងណាត់ជួបនៅថ្ងៃនេះទេ។",
        unableTimes: "មិនអាចទាញយកម៉ោងណាត់ជួបបានទេ។ សូមព្យាយាមម្តងទៀត។",
        chosenDate: "📅 ",
        chosenTime: "🕐 ",
        patientPrompt: "ល្អណាស់! 👤 សូមផ្តល់ព័ត៌មានខ្លះ ដើម្បីបង្កើតការណាត់ជួបរបស់អ្នក។",
        patientTitle: "👤 ព័ត៌មានអ្នកជំងឺ",
        fullName: "ឈ្មោះពេញ",
        namePlaceholder: "បញ្ចូលឈ្មោះពេញរបស់អ្នក",
        phone: "លេខទូរស័ព្ទ",
        phonePlaceholder: "បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក",
        nameRequired: "សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។",
        phoneRequired: "សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក។",
        reviewPrompt: "សូមពិនិត្យព័ត៌មានការណាត់ជួបរបស់អ្នក។",
        summaryTitle: "📋 សេចក្តីសង្ខេបការណាត់ជួប",
        service: "សេវាកម្ម",
        date: "កាលបរិច្ឆេទ",
        time: "ម៉ោង",
        patient: "អ្នកជំងឺ",
        confirm: "✅ បញ្ជាក់ការណាត់ជួប",
        saving: "កំពុងរក្សាទុក...",
        saveError: "សូមអភ័យទោស មានបញ្ហាក្នុងការរក្សាទុកការណាត់ជួប។",
        bookingRejected: "មិនអាចបញ្ជាក់ការណាត់ជួបបានទេ។ សូមជ្រើសរើសកាលបរិច្ឆេទ ឬម៉ោងផ្សេង។",
        success: "🎉 ការណាត់ជួបរបស់អ្នកត្រូវបានបង្កើតដោយជោគជ័យ!",
        confirmed: "✅ បានបញ្ជាក់ការណាត់ជួប",
        appointmentId: "លេខសម្គាល់ការណាត់ជួប៖",
        confirmationNote: "គ្លីនិករបស់យើងនឹងទាក់ទងអ្នកដើម្បីបញ្ជាក់ការណាត់ជួប។",
        next: "តើអ្នកចង់ធ្វើអ្វីបន្ទាប់?",
        mainMenu: "⬅️ ម៉ឺនុយដើម",
        makeAppointment: "📅 កក់ការណាត់ជួប",
        otherServices: "🏥 សេវាកម្មផ្សេងទៀត",
        shopPrompt: "សូមជ្រើសរើសផលិតផលថែទាំធ្មេញដែលអ្នកចង់ទិញ៖",
        toothpaste: "ថ្នាំដុសធ្មេញ",
        toothbrush: "ច្រាសដុសធ្មេញ",
        oralRinse: "ទឹកខ្ពុរមាត់",
        quantity: "ចំនួន",
        addToCart: "ដាក់ក្នុងកន្ត្រក",
        shoppingCart: "🛒 កន្ត្រកទំនិញ",
        cartEmpty: "កន្ត្រករបស់អ្នកមិនទាន់មានទំនិញទេ។",
        removeItem: "លុបចេញ",
        checkout: "🚚 ជ្រើសរើសការដឹកជញ្ជូន",
        deliveryDetails: "🚚 ព័ត៌មានដឹកជញ្ជូន",
        deliveryDate: "កាលបរិច្ឆេទដឹកជញ្ជូន",
        deliveryTime: "ម៉ោងដឹកជញ្ជូន",
        selectDeliveryTime: "សូមជ្រើសរើសម៉ោង",
        customerName: "ឈ្មោះរបស់អ្នក",
        customerPhone: "លេខទូរស័ព្ទ",
        deliveryAddress: "អាសយដ្ឋានដឹកជញ្ជូន",
        addressPlaceholder: "ផ្លូវ អគារ តំបន់ និងការណែនាំអំពីទីតាំង",
        placeOrder: "បញ្ជាទិញ",
        orderError: "មិនអាចដាក់ការបញ្ជាទិញបានទេ។ សូមពិនិត្យព័ត៌មាន និងព្យាយាមម្ដងទៀត។",
        sundayDelivery: "មិនមានការដឹកជញ្ជូននៅថ្ងៃអាទិត្យទេ។ សូមជ្រើសរើសថ្ងៃផ្សេង។",
        orderSuccess: "✅ បានដាក់ការបញ្ជាទិញ! លេខបញ្ជាទិញ៖ ",
        orderTotal: "សរុប៖ ",
        priceLabel: "តម្លៃ៖ ",
        priceListTitle: "តារាងតម្លៃសេវាកម្មរបស់យើង៖",
        openingHoursTitle: "🕐 ម៉ោងបើកបម្រើរបស់គ្លីនិក៖",
        openingDays: "ថ្ងៃច័ន្ទ ដល់ថ្ងៃសៅរ៍",
        openingTime: "ម៉ោង ៨:០០ ព្រឹក ដល់ ៦:០០ ល្ងាច",
        sundayClosedLabel: "ថ្ងៃអាទិត្យ៖ បិទ",
        contactTitle: "📞 ទាក់ទងគ្លីនិកធ្មេញរបស់យើង៖",
        phoneLabel: "ទូរស័ព្ទ៖ ",
        emailLabel: "អ៊ីមែល៖ ",
        checkup: "ពិនិត្យសុខភាពមាត់ធ្មេញ",
        cleaning: "សម្អាតធ្មេញ",
        whitening: "ធ្វើឱ្យធ្មេញស",
        filling: "ប៉ះធ្មេញ",
        extraction: "ដកធ្មេញ",
        clinicAssistant: "ជំនួយការគ្លីនិក",
        askDentalAI: "សួរអ្នកជំនួយការទន្តសាស្ត្រ",
        newChat: "ជជែកថ្មី",
        recentChats: "ការជជែកថ្មីៗ",
        aiBrandName: "Dr. Dento",
        assistantTagline: "ជំនួយការព័ត៌មានសុខភាពមាត់ធ្មេញ",
        friendlyGuidance: "ណែនាំដោយមិត្តភាព សម្រាប់អ្នកជានិច្ច",
        dentalAiTitle: "AI ទន្តសាស្ត្រ",
        languageLabel: "ភាសាចម្លើយ",
        aiPrompt: "សួរសំណួរអំពីសុខភាពមាត់ធ្មេញ...",
        aiDisclaimer: "Dr. Dento អាចផ្តល់ព័ត៌មានទូទៅ ប៉ុន្តែមិនអាចធ្វើរោគវិនិច្ឆ័យបានទេ។ សូមពិគ្រោះជាមួយទន្តបណ្ឌិតសម្រាប់ការណែនាំផ្ទាល់ខ្លួន។",
        aiDisclaimerShort: "ព័ត៌មាននេះសម្រាប់ការអប់រំប៉ុណ្ណោះ។ សូមពិគ្រោះជាមួយទន្តបណ្ឌិតជានិច្ច។",
        aiHistoryEmpty: "ការជជែករបស់អ្នកនឹងបង្ហាញនៅទីនេះ។",
        dentalConversation: "ការជជែកទន្តសាស្ត្រ",
        aiLoadingError: "ខ្ញុំមិនអាចផ្ទុកការជជែកនោះបានទេ។ សូមព្យាយាមម្តងទៀត។",
        aiTimeout: "ការឆ្លើយតបរបស់ AI ចំណាយពេលយូរជាងការរំពឹងទុក។ សូមព្យាយាមម្តងទៀត។",
        aiConnectionError: "សូមអភ័យទោស ខ្ញុំមិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។ សូមព្យាយាមម្តងទៀត។",
        aiIssuePrefix: "សូមអភ័យទោស មានបញ្ហា៖ ",
        aiApiKeyRequired: "ត្រូវការសោ API",
        aiApiKeyInstructions: "ដើម្បីប្រើ Dental AI សូមកំណត់សោ Google Gemini API ក្នុងឯកសារ .env ហើយចាប់ផ្តើមម៉ាស៊ីនមេឡើងវិញ។",
        voiceStart: "ចាប់ផ្តើមបញ្ចូលសំឡេង",
        voiceListening: "កំពុងស្តាប់...",
        voiceUnsupported: "កម្មវិធីរុករកនេះមិនគាំទ្រការបញ្ចូលសំឡេងទេ។ សូមប្រើ Chrome ឬ Edge។",
        voiceNoSpeech: "មិនបានឮសំឡេងទេ។ សូមព្យាយាមម្តងទៀត។",
        voiceDenied: "មិនអាចចូលប្រើមីក្រូហ្វូនបានទេ។ សូមអនុញ្ញាតការប្រើមីក្រូហ្វូន ហើយព្យាយាមម្តងទៀត។",
        voiceLanguageUnsupported: "កម្មវិធីរុករកនេះមិនគាំទ្រការសម្គាល់សំឡេងសម្រាប់ភាសានេះទេ។",
        voiceError: "ការបញ្ចូលសំឡេងមិនបានសម្រេចទេ។ សូមព្យាយាមម្តងទៀត។",
        aiQuestionAria: "សួរសុខភាពធ្មេញ",
        aiWelcome: "សួស្តី! ខ្ញុំជាអ្នកជំនួយការទន្តសាស្ត្រ Dr. Dento 🦷\n\nខ្ញុំអាចឆ្លើយសំណួរអំពីសុខភាពធ្មេញរបស់អ្នក — ចាប់ពីគន្លឹះការដុសធ្មេញ ដល់ការយល់ដឹងអំពីការព្យាបាល។\n\nតើអ្នកចង់ដឹងអ្វី?",
        aiSuggestions: [
            "តើខ្ញុំគួរដុសធ្មេញប៉ុន្មានដងក្នុងមួយថ្ងៃ?",
            "តើអ្វីបណ្តាលឱ្យធ្មេញពុក?",
            "ហេតុអ្វីអញ្ចាញធ្មេញរបស់ខ្ញុំហូរឈាម?",
            "តើការធ្វើឱ្យធ្មេញសមានសុវត្ថិភាពទេ?",
            "ការព្យាបាលឫសធ្មេញគឺជាអ្វី?",
            "តើខ្ញុំអាចកាត់បន្ថយក្លិនមាត់មិនល្អដោយរបៀបណា?",
            "តើកុមារគួរទៅជួបទន្តបណ្ឌិតនៅពេលណា?",
            "តើអាហារអ្វីខ្លះអាចបំផ្លាញធ្មេញ?"
        ]
    }
};

const dentalServices = [
    { key: "checkup", english: "Dental Check-up" },
    { key: "cleaning", english: "Teeth Cleaning" },
    { key: "whitening", english: "Teeth Whitening" },
    { key: "filling", english: "Dental Filling" },
    { key: "extraction", english: "Tooth Extraction" }
];

const products = [
    { id: "toothpaste", nameKey: "toothpaste", priceCents: 500, image: "/img/toothpaste.avif" },
    { id: "toothbrush", nameKey: "toothbrush", priceCents: 100, image: "/img/toothbrush.avif" },
    { id: "oral_rinse", nameKey: "oralRinse", priceCents: 500, image: "/img/oral%20rinse.avif" }
];

const deliveryTimes = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
];

let productCart = {};

const servicePrices = {
    "Dental Check-up": "$10 USD",
    "Teeth Cleaning": "$15 USD",
    "Teeth Whitening": "$50 USD",
    "Dental Filling": "$35 USD",
    "Tooth Extraction": "$60 USD"
};

function text(key) {

    return translations[currentLanguage][key];

}

function mainMenuOptions() {

    return [
        text("appointmentOption"),
        text("serviceOption"),
        text("productsOption"),
        text("priceOption"),
        text("hoursOption"),
        text("contactOption")
    ];

}

function serviceLabel(service) {

    const item = dentalServices.find(
        function(candidate) {

            return candidate.english === service;

        }
    );

    return item
        ? text(item.key)
        : service;

}

function serviceLabels(services) {

    return services
        .map(serviceLabel)
        .join(", ");

}

function formatAppointmentDate(date) {

    if (currentLanguage !== "km") {

        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    }

    const weekdays = [
        "អាទិត្យ",
        "ចន្ទ",
        "អង្គារ",
        "ពុធ",
        "ព្រហស្បតិ៍",
        "សុក្រ",
        "សៅរ៍"
    ];
    const months = [
        "មករា",
        "កុម្ភៈ",
        "មីនា",
        "មេសា",
        "ឧសភា",
        "មិថុនា",
        "កក្កដា",
        "សីហា",
        "កញ្ញា",
        "តុលា",
        "វិច្ឆិកា",
        "ធ្នូ"
    ];
    const khmerDigits = "០១២៣៤៥៦៧៨៩";
    const toKhmerDigits = function(value) {

        return String(value).replace(
            /\d/g,
            function(digit) {

                return khmerDigits[Number(digit)];

            }
        );

    };

    return "ថ្ងៃ" + weekdays[date.getDay()]
        + " ទី" + toKhmerDigits(date.getDate())
        + " ខែ" + months[date.getMonth()]
        + " ឆ្នាំ" + toKhmerDigits(date.getFullYear());

}

function setLanguage(language) {

    const previousLanguage = currentLanguage;
    currentLanguage = language === "km" ? "km" : "en";
    localStorage.setItem("dental-chat-language", currentLanguage);
    if (previousLanguage !== currentLanguage && activeSpeechRecognition) {
        activeSpeechRecognition.stop();
    }
    document.documentElement.lang =
        currentLanguage === "km" ? "km" : "en";

    document.getElementById("englishLanguage").classList.toggle(
        "active",
        currentLanguage === "en"
    );
    document.getElementById("englishLanguage").setAttribute(
        "aria-pressed",
        String(currentLanguage === "en")
    );
    document.getElementById("khmerLanguage").classList.toggle(
        "active",
        currentLanguage === "km"
    );
    document.getElementById("khmerLanguage").setAttribute(
        "aria-pressed",
        String(currentLanguage === "km")
    );

    document.title = currentLanguage === "km"
        ? "គ្លីនិកធ្មេញ"
        : "Dental Clinic Assistant";

    document.getElementById("welcomeTitle").textContent = text("title");
    document.getElementById("welcomeSubtitle").textContent = text("subtitle");
    document.getElementById("welcomeDescription").textContent = text("welcomeDescription");
    const startClinicBtn = document.getElementById("startClinicBtn");
    if (startClinicBtn) {
        startClinicBtn.textContent = "💬 " + text("clinicAssistant");
    }
    const startAiBtn = document.getElementById("startAiBtn");
    if (startAiBtn) {
        startAiBtn.textContent = "🧠 " + text("askDentalAI");
    }

    const aiBrandName = document.getElementById("aiBrandName");
    if (aiBrandName) {
        aiBrandName.textContent = text("aiBrandName");
    }
    const aiNewChatText = document.getElementById("aiNewChatText");
    if (aiNewChatText) {
        aiNewChatText.textContent = text("newChat");
    }
    const aiHistoryHeading = document.getElementById("aiHistoryHeading");
    if (aiHistoryHeading) {
        aiHistoryHeading.textContent = text("recentChats");
    }
    const aiAssistantTitle = document.getElementById("aiAssistantTitle");
    if (aiAssistantTitle) {
        aiAssistantTitle.textContent = text("assistantTagline");
    }
    const aiAssistantTagline = document.getElementById("aiAssistantTagline");
    if (aiAssistantTagline) {
        aiAssistantTagline.textContent = text("friendlyGuidance");
    }
    const aiTopbarTitle = document.getElementById("aiTopbarTitle");
    if (aiTopbarTitle) {
        aiTopbarTitle.textContent = text("dentalAiTitle");
    }
    const aiLanguageSelect = document.getElementById("aiLanguageSelect");
    if (aiLanguageSelect) {
        aiLanguageSelect.value = currentLanguage;
    }
    const aiLanguageLabel = document.getElementById("aiLanguageLabel");
    if (aiLanguageLabel) {
        aiLanguageLabel.textContent = text("languageLabel");
    }
    const aiStatusText = document.getElementById("aiStatusText");
    if (aiStatusText) {
        aiStatusText.textContent = text("assistantTagline");
    }
    const aiMessageInputField = document.getElementById("aiMessageInput");
    if (aiMessageInputField) {
        aiMessageInputField.placeholder = text("aiPrompt");
        aiMessageInputField.setAttribute("aria-label", text("aiQuestionAria"));
    }
    const aiDisclaimerText = document.getElementById("aiDisclaimerText");
    if (aiDisclaimerText) {
        aiDisclaimerText.textContent = text("aiDisclaimer");
    }
    const aiMicrophoneButton = document.getElementById("aiMicrophoneButton");
    if (aiMicrophoneButton) {
        aiMicrophoneButton.setAttribute("aria-label", text("voiceStart"));
        aiMicrophoneButton.title = text("voiceStart");
    }
    const aiSpeechStatus = document.getElementById("aiSpeechStatus");
    if (aiSpeechStatus && !activeSpeechRecognition) {
        aiSpeechStatus.textContent = "";
    }
    if (aiChatBox && aiChatBox.querySelector(".ai-suggestions")) {
        showAiSuggestions();
    }

    const appointmentsFeature = document.getElementById("appointmentsFeature");
    const servicesFeature = document.getElementById("servicesFeature");

    if (appointmentsFeature) {
        appointmentsFeature.textContent = text("appointmentsFeature");
    }

    if (servicesFeature) {
        servicesFeature.textContent = text("servicesFeature");
    }

    document.querySelector(".start-button").textContent = text("startChat");
    document.getElementById("startAiBtn").textContent = text("startAiChat");
    document.getElementById("chatTitle").textContent = text("chatTitle");
    document.getElementById("onlineText").textContent = text("online");
    messageInput.placeholder = text("messagePlaceholder");
    document.getElementById("aiTitle").textContent = text("aiTitle");
    document.getElementById("aiSubtitle").textContent = text("aiSubtitle");
    aiMessageInput.placeholder = text("aiMessagePlaceholder");
    refreshAiTranslations();

}

/* ============================================================
   START CHAT
============================================================ */

function startChat() {

    appointmentMode = false;

    welcomeScreen.style.display =
        "none";

    chatScreen.style.display =
        "flex";


    addMessage(
        text("greeting"),
        "bot",
        mainMenuOptions()
    );


    messageInput.focus();

}

/* ============================================================
   BACK
============================================================ */

function goBack() {

    chatScreen.style.display =
        "none";

    welcomeScreen.style.display =
        "flex";

    chatBox.innerHTML = "";

    resetAppointment();

}


/* ============================================================
   RESET APPOINTMENT
============================================================ */

function resetAppointment() {

    appointment = {

        services: [],

        date: "",

        time: "",

        name: "",

        phone: ""

    };
    appointmentMode = false;

}


/* ============================================================
   SEND MESSAGE
============================================================ */

async function sendMessage(
    selectedMessage = null
) {

    const message =
        selectedMessage ||
        messageInput.value.trim();

    if (!message) {

        return;

    }

    addMessage(
        message,
        "user"
    );

    messageInput.value = "";

    /*
     * APPOINTMENT START
     */

    if (
        /make(?: an)? appointment/i.test(message)
        || (
            currentLanguage === "km"
            && message.includes("ណាត់ជួប")
        )
    ) {

        if (appointment.services.length > 0) {

            appointmentMode = true;
            showCalendar();
            return;

        }

        appointmentMode = true;

        addMessage(
            text("beginAppointment"),
            "bot"
        );
        showServiceSelection();

        return;

    }

    if (
        message.includes(text("productsOption"))
        || /\b(shop|products|buy|order|toothpaste|toothbrush|oral rinse|mouthwash)\b/i.test(message)
        || (
            currentLanguage === "km"
            && (
                message.includes("ថ្នាំដុសធ្មេញ")
                || message.includes("ច្រាសដុសធ្មេញ")
                || message.includes("ទឹកខ្ពុរមាត់")
                || message.includes("ផលិតផល")
            )
        )
    ) {

        showProductShop();
        return;

    }

    if (
        message.includes(text("priceOption"))
        || /\b(price information|prices?|pricing|costs?|fees?)\b/i.test(message)
        || (
            currentLanguage === "km"
            && (message.includes("តម្លៃ") || message.includes("ថ្លៃ"))
        )
    ) {

        showServiceSelection("prices");
        return;

    }

    if (
        message.includes(text("serviceOption"))
        || /\b(dental services|other services)\b/i.test(message)
        || (
            currentLanguage === "km"
            && (
                message.includes("សេវាកម្មទន្តសាស្ត្រ")
                || message.includes("សេវាកម្មផ្សេងទៀត")
            )
        )
    ) {

        showServiceSelection("information");
        return;

    }

    if (
        currentLanguage === "km"
        && (
            (message.includes("ម៉ោង") && message.includes("បើក"))
            || /\b(opening hours|business hours|when.*open)\b/i.test(message)
        )
    ) {

        addMessage(
            text("openingHoursTitle") + "\n\n"
            + text("openingDays") + "\n"
            + text("openingTime") + "\n\n"
            + text("sundayClosedLabel"),
            "bot",
            [text("mainMenu")]
        );

        return;

    }

    if (
        currentLanguage === "km"
        && (
            message.includes("ទាក់ទង")
            || message.includes("លេខទូរស័ព្ទ")
            || /\b(contact|phone|telephone|email)\b/i.test(message)
        )
    ) {

        addMessage(
            text("contactTitle") + "\n\n"
            + text("phoneLabel") + "+855 12 345 678\n"
            + text("emailLabel") + "dentalclinic@gmail.com",
            "bot",
            [text("mainMenu")]
        );

        return;

    }

    if (
        currentLanguage === "km"
        && message.includes("ម៉ឺនុយដើម")
    ) {

        addMessage(
            text("greeting"),
            "bot",
            mainMenuOptions()
        );

        return;

    }

    /*
     * SERVICE SELECTED
     */

    const serviceItem =
        dentalServices.find(
            function(service) {

                return message.toLowerCase().includes(
                    service.english.toLowerCase()
                ) || message.includes(
                    text(service.key)
                );

            }
        );

    if (serviceItem) {

        appointment.services = [serviceItem.english];
        appointment.date = "";
        appointment.time = "";

        if (appointmentMode) {

            showCalendar();

        } else {

            showServiceInformation([serviceItem.english]);

        }

        return;

    }

    
    /*
     * NORMAL CHATBOT
     */

    sendButton.disabled = true;

    const typingId = showTyping();

    try {

        const response = await fetch(
            "/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message
                })
            }
        );

        if (!response.ok) {

            throw new Error("Server error");

        }

        const data = await response.json();

        removeTyping(typingId);

        addMessage(
            data.response,
            "bot",
            data.options || []
        );

    } catch (error) {

        console.error(error);
        removeTyping(typingId);

        addMessage(
            "Sorry, I couldn't connect to the server. "
            + "Please try again.",
            "bot"
        );

    } finally {

        sendButton.disabled = false;
        messageInput.focus();

    }

}

function formatProductPrice(priceCents) {

    return "$" + (priceCents / 100).toFixed(2) + " USD";

}

function showProductShop() {

    addMessage(text("shopPrompt"), "bot");

    const shopCard = document.createElement("div");
    shopCard.className = "product-shop";
    shopCard.innerHTML = `
        <div class="product-catalog">
            ${products.map(function(product) {
                return `
                    <article class="product-item">
                        <img
                            class="product-image"
                            src="${product.image}"
                            alt="${escapeHtml(text(product.nameKey))}"
                        >
                        <div class="product-info">
                            <h3>${escapeHtml(text(product.nameKey))}</h3>
                            <span class="product-price">${formatProductPrice(product.priceCents)}</span>
                        </div>
                        <div class="product-item-actions">
                            <label>
                                ${text("quantity")}
                                <input
                                    class="product-quantity"
                                    type="number"
                                    min="1"
                                    max="99"
                                    value="1"
                                    aria-label="${escapeHtml(text("quantity"))}"
                                >
                            </label>
                            <button
                                class="product-add-button"
                                type="button"
                                data-product-id="${product.id}"
                            >${text("addToCart")}</button>
                        </div>
                    </article>
                `;
            }).join("")}
        </div>
        <section class="product-cart">
            <h3>${text("shoppingCart")}</h3>
            <div class="cart-content"></div>
        </section>
    `;

    shopCard.querySelectorAll(".product-add-button").forEach(function(button) {
        button.addEventListener("click", function() {
            const quantityInput = button.closest(".product-item")
                .querySelector(".product-quantity");
            const quantity = Number(quantityInput.value);

            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
                quantityInput.reportValidity();
                return;
            }

            const productId = button.dataset.productId;
            productCart[productId] = (productCart[productId] || 0) + quantity;
            quantityInput.value = "1";
            updateProductCart(shopCard);
        });

        updateDeliveryOrderSummary(shopCard);

    });

    shopCard.querySelector(".product-cart").addEventListener("click", function(event) {
        const button = event.target.closest("[data-cart-action]");

        if (!button) {
            return;
        }

        const productId = button.dataset.productId;
        const action = button.dataset.cartAction;

        if (action === "remove") {
            delete productCart[productId];
        } else {
            const nextQuantity = productCart[productId]
                + (action === "increase" ? 1 : -1);

            if (nextQuantity < 1) {
                delete productCart[productId];
            } else {
                productCart[productId] = nextQuantity;
            }
        }

        updateProductCart(shopCard);
    });

    chatBox.appendChild(shopCard);
    updateProductCart(shopCard);
    scrollToBottom();

}

function productCartTotal() {

    return products.reduce(function(total, product) {
        return total + product.priceCents * (productCart[product.id] || 0);
    }, 0);

}

function updateProductCart(shopCard) {

    const cartContent = shopCard.querySelector(".cart-content");
    const cartProducts = products.filter(function(product) {
        return productCart[product.id] > 0;
    });

    if (cartProducts.length === 0) {
        cartContent.innerHTML = `<p>${text("cartEmpty")}</p>`;
        const checkout = shopCard.querySelector(".delivery-checkout");

        if (checkout) {
            checkout.remove();
        }

        return;
    }

    cartContent.innerHTML = `
        ${cartProducts.map(function(product) {
            return `
                <div class="cart-row">
                    <span>${escapeHtml(text(product.nameKey))} × ${productCart[product.id]}</span>
                    <div class="cart-controls">
                        <button
                            class="cart-action-button"
                            type="button"
                            data-cart-action="decrease"
                            data-product-id="${product.id}"
                            aria-label="${escapeHtml(text("quantity"))} −"
                        >−</button>
                        <button
                            class="cart-action-button"
                            type="button"
                            data-cart-action="increase"
                            data-product-id="${product.id}"
                            aria-label="${escapeHtml(text("quantity"))} +"
                        >+</button>
                        <button
                            class="cart-action-button"
                            type="button"
                            data-cart-action="remove"
                            data-product-id="${product.id}"
                            aria-label="${escapeHtml(text("removeItem"))}"
                        >×</button>
                    </div>
                </div>
            `;
        }).join("")}
        <div class="cart-total">${text("orderTotal")}${formatProductPrice(productCartTotal())}</div>
        <button class="continue-button checkout-button" type="button">
            ${text("checkout")}
        </button>
    `;

    cartContent.querySelector(".checkout-button").addEventListener("click", function() {
        showDeliveryCheckout(shopCard);
    });

}

function showDeliveryCheckout(shopCard) {

    const existingCheckout = shopCard.querySelector(".delivery-checkout");

    if (existingCheckout) {
        existingCheckout.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
    }

    const today = new Date();
    const minDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");
    const checkout = document.createElement("section");
    checkout.className = "delivery-checkout";
    checkout.innerHTML = `
        <h3>${text("deliveryDetails")}</h3>
        <div class="delivery-order-summary"></div>
        <form class="delivery-form">
            <label>
                ${text("deliveryDate")}
                <input type="date" name="date" min="${minDate}" required>
            </label>
            <label>
                ${text("deliveryTime")}
                <select name="time" required>
                    <option value="">${text("selectDeliveryTime")}</option>
                    ${deliveryTimes.map(function(time) {
                        return `<option value="${time}">${time}</option>`;
                    }).join("")}
                </select>
            </label>
            <label>
                ${text("customerName")}
                <input type="text" name="name" maxlength="120" required>
            </label>
            <label>
                ${text("customerPhone")}
                <input type="tel" name="phone" maxlength="40" required>
            </label>
            <label>
                ${text("deliveryAddress")}
                <textarea name="address" maxlength="500" placeholder="${text("addressPlaceholder")}" required></textarea>
            </label>
            <p class="order-feedback" role="alert"></p>
            <button class="continue-button" type="submit">${text("placeOrder")}</button>
        </form>
    `;

    shopCard.appendChild(checkout);
    updateDeliveryOrderSummary(shopCard);

    const dateInput = checkout.querySelector('input[name="date"]');
    dateInput.addEventListener("change", function() {
        const selectedDate = new Date(dateInput.value + "T00:00:00");

        if (dateInput.value && selectedDate.getDay() === 0) {
            dateInput.setCustomValidity(text("sundayDelivery"));
        } else {
            dateInput.setCustomValidity("");
        }
    });

    checkout.querySelector(".delivery-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        if (!this.reportValidity()) {
            return;
        }

        const submitButton = this.querySelector('button[type="submit"]');
        const feedback = checkout.querySelector(".order-feedback");
        const formData = new FormData(this);
        submitButton.disabled = true;
        feedback.textContent = "";

        try {
            const response = await fetch("/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: products.filter(function(product) {
                        return productCart[product.id] > 0;
                    }).map(function(product) {
                        return {
                            product_id: product.id,
                            quantity: productCart[product.id]
                        };
                    }),
                    date: formData.get("date"),
                    time: formData.get("time"),
                    name: formData.get("name"),
                    phone: formData.get("phone"),
                    address: formData.get("address")
                })
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.detail || text("orderError"));
            }

            const order = data.order;
            checkout.className = "order-confirmation";
            checkout.innerHTML = `
                <h3>${text("orderSuccess")}${escapeHtml(order.id)}</h3>
                <p>${text("orderTotal")}${formatProductPrice(order.total_cents)}</p>
                <p>${escapeHtml(order.date)} · ${escapeHtml(order.time)}</p>
            `;
            productCart = {};
            updateProductCart(shopCard);
            scrollToBottom();
        } catch (error) {
            console.error(error);
            feedback.textContent = text("orderError");
            submitButton.disabled = false;
        }
    });

    scrollToBottom();

}

function updateDeliveryOrderSummary(shopCard) {

    const summary = shopCard.querySelector(".delivery-order-summary");

    if (!summary) {
        return;
    }

    summary.textContent = products.filter(function(product) {
        return productCart[product.id] > 0;
    }).map(function(product) {
        return text(product.nameKey)
            + " × " + productCart[product.id];
    }).join(", ");

}

function showServiceSelection(mode = "appointment") {

    const card = document.createElement("div");
    card.className = "appointment-card";
    const continueLabel = mode === "prices"
        ? text("showSelectedPrices")
        : mode === "information"
            ? text("showServiceDetails")
            : text("continue");
    card.innerHTML = `
        <h3>${text("serviceSelectionHint")}</h3>
        ${dentalServices.map(function(service) {
            return `
                <label class="service-choice">
                    <input
                        type="checkbox"
                        value="${escapeHtml(service.english)}"
                    >
                    <span>${escapeHtml(serviceLabel(service.english))}</span>
                </label>
            `;
        }).join("")}
        <button class="continue-button service-continue" type="button" disabled>
            ${continueLabel}
        </button>
    `;

    chatBox.appendChild(card);

    const continueButton = card.querySelector(".service-continue");
    card.querySelectorAll('input[type="checkbox"]').forEach(function(input) {
        input.addEventListener("change", function() {
            continueButton.disabled =
                card.querySelectorAll('input[type="checkbox"]:checked').length === 0;
        });
    });

    continueButton.addEventListener("click", function() {
        const selectedServices = Array.from(
            card.querySelectorAll('input[type="checkbox"]:checked')
        ).map(function(input) {
            return input.value;
        });

        if (mode === "prices") {
            const priceList = selectedServices.map(function(service) {
                return serviceLabel(service) + " — " + servicePrices[service];
            }).join("\n");

            addMessage(
                text("priceListTitle") + "\n\n" + priceList,
                "bot",
                [text("makeAppointment"), text("mainMenu")]
            );
            return;
        }

        if (mode === "information") {
            showServiceInformation(selectedServices);
            return;
        }

        appointment.services = selectedServices;
        appointment.date = "";
        appointment.time = "";
        showCalendar();
    });

    scrollToBottom();

}

function showServiceInformation(services) {

    const descriptions = {
        "Dental Check-up": {
            en: "A dental check-up allows the dentist to examine your teeth and gums and identify possible dental problems.",
            km: "ការពិនិត្យមាត់ធ្មេញជួយឱ្យទន្តបណ្ឌិតពិនិត្យធ្មេញ និងអញ្ចាញធ្មេញរបស់អ្នក ព្រមទាំងស្វែងរកបញ្ហាដែលអាចកើតមាន។"
        },
        "Teeth Cleaning": {
            en: "Professional teeth cleaning helps remove plaque and tartar and keeps your teeth and gums healthy.",
            km: "ការសម្អាតធ្មេញដោយអ្នកជំនាញជួយកម្ចាត់កំណកបន្ទះ និងកំបោរ ដើម្បីថែរក្សាសុខភាពធ្មេញ និងអញ្ចាញធ្មេញ។"
        },
        "Teeth Whitening": {
            en: "Professional teeth whitening can help improve the appearance of stained or discolored teeth.",
            km: "ការធ្វើឱ្យធ្មេញសដោយអ្នកជំនាញអាចជួយកែលម្អស្នាមប្រឡាក់ ឬការប្រែពណ៌របស់ធ្មេញ។"
        },
        "Dental Filling": {
            en: "Dental fillings are commonly used to repair teeth affected by cavities or damage.",
            km: "ការប៉ះធ្មេញត្រូវបានប្រើជាទូទៅ ដើម្បីជួសជុលធ្មេញដែលពុក ឬខូច។"
        },
        "Tooth Extraction": {
            en: "A dentist may recommend extraction when a tooth cannot be safely repaired.",
            km: "ទន្តបណ្ឌិតអាចណែនាំឱ្យដកធ្មេញ ប្រសិនបើមិនអាចជួសជុលធ្មេញនោះដោយសុវត្ថិភាពបាន។"
        }
    };

    const serviceInformation = services.map(function(service) {
        const description = descriptions[service][currentLanguage];

        return "🦷 " + serviceLabel(service) + "\n\n"
            + description + "\n\n"
            + text("priceLabel") + servicePrices[service];
    }).join("\n\n");

    addMessage(
        serviceInformation
        + (currentLanguage === "km"
            ? "\n\nតើអ្នកចង់កក់ការណាត់ជួបសម្រាប់សេវាកម្មទាំងនេះទេ?"
            : "\n\nWould you like to make an appointment for these services?"),
        "bot",
        [
            text("makeAppointment"),
            text("otherServices"),
            text("mainMenu")
        ]
    );

}

/* ============================================================
   CALENDAR
============================================================ */

function showCalendar() {


    addMessage(
        text("selectedService")
        + serviceLabels(appointment.services)
        + text("selectDate"),
        "bot"
    );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "appointment-card";


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    const minDate =
        year
        + "-"
        + month
        + "-"
        + day;


    card.innerHTML = `

        <h3>${text("calendarTitle")}</h3>

        <input
            type="date"
            id="appointmentDate"
            class="date-input"
            lang="${currentLanguage}"
            min="${minDate}"
        >

        <div
            id="dateMessage"
            class="date-message"
        ></div>

        <div
            id="timeSection"
            style="display:none;"
        >

            <div class="time-title">

                ${text("timesTitle")}

            </div>

            <div
                class="time-grid"
                id="timeGrid"
            ></div>

            <button
                class="continue-button"
                id="timeContinue"
                disabled
            >

                ${text("continue")}

            </button>

        </div>

    `;


    chatBox.appendChild(
        card
    );


    const dateInput =
        document.getElementById(
            "appointmentDate"
        );


    dateInput.addEventListener(
        "change",
        function() {

            loadAvailableTimes(
                this.value
            );

        }
    );


    scrollToBottom();

}


/* ============================================================
   LOAD AVAILABLE TIMES
============================================================ */

async function loadAvailableTimes(
    selectedDate
) {


    if (!selectedDate) {

        return;

    }


    const date =
        new Date(
            selectedDate
            + "T00:00:00"
        );


    /*
     * Sunday
     */

    if (
        date.getDay() === 0
    ) {

        document.getElementById(
            "dateMessage"
        ).textContent =
            text("sundayClosed");

        document.getElementById(
            "timeSection"
        ).style.display =
            "none";

        appointment.date =
            "";

        return;

    }


    appointment.date =
        selectedDate;


    appointment.time =
        "";


    document.getElementById(
        "dateMessage"
    ).textContent =
        "";


    try {

        const response =
            await fetch(
                "/appointment/times?selected_date="
                + encodeURIComponent(
                    selectedDate
                )
            );


        const data =
            await response.json();


        if (
            !data.available
        ) {

            document.getElementById(
                "dateMessage"
            ).textContent =
                currentLanguage === "km"
                    ? text("invalidDate")
                    : data.message;

            return;

        }


        const timeGrid =
            document.getElementById(
                "timeGrid"
            );


        timeGrid.innerHTML =
            "";


        data.times.forEach(
            function(time) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "time-button";


                button.textContent =
                    time;


                button.type =
                    "button";


                button.onclick =
                    function() {

                        selectTime(
                            button,
                            time
                        );

                    };


                timeGrid.appendChild(
                    button
                );

            }
        );


        if (
            data.times.length === 0
        ) {

            timeGrid.innerHTML = `

                <p
                    style="
                        grid-column:1/-1;
                        color:#64748b;
                        font-size:13px;
                    "
                >
                    ${text("noTimes")}
                </p>

            `;

        }


        document.getElementById(
            "timeSection"
        ).style.display =
            "block";


        scrollToBottom();

    } catch (error) {

        console.error(
            error
        );

        document.getElementById(
            "dateMessage"
        ).textContent =
            text("unableTimes");

    }

}


/* ============================================================
   SELECT TIME
============================================================ */

function selectTime(
    button,
    time
) {


    document
        .querySelectorAll(
            ".time-button"
        )
        .forEach(
            function(item) {

                item.classList.remove(
                    "selected"
                );

            }
        );


    button.classList.add(
        "selected"
    );


    appointment.time =
        time;


    const continueButton =
        document.getElementById(
            "timeContinue"
        );


    continueButton.disabled =
        false;


    continueButton.onclick =
        function() {

            continueAppointment();

        };

}


/* ============================================================
   CONTINUE APPOINTMENT
============================================================ */

function continueAppointment() {


    if (
        !appointment.date
        ||
        !appointment.time
    ) {

        return;

    }


    const date =
        new Date(
            appointment.date
            + "T00:00:00"
        );


    const formattedDate =
        formatAppointmentDate(date);


    addMessage(
        text("chosenDate")
        + formattedDate
        + "\n"
        + text("chosenTime")
        + appointment.time,
        "user"
    );


    showPatientForm();

}


/* ============================================================
   PATIENT FORM
============================================================ */

function showPatientForm() {


    addMessage(
        text("patientPrompt"),
        "bot"
    );


    const form =
        document.createElement(
            "div"
        );


    form.className =
        "patient-form";


    form.innerHTML = `

        <h3>${text("patientTitle")}</h3>


        <label>
            ${text("fullName")}
        </label>


        <input
            type="text"
            id="patientName"
            placeholder="${text("namePlaceholder")}"
        >


        <label>
            ${text("phone")}
        </label>


        <input
            type="tel"
            id="patientPhone"
            placeholder="${text("phonePlaceholder")}"
        >


        <button
            class="continue-button"
            id="patientContinue"
        >

            ${text("continue")}

        </button>

    `;


    chatBox.appendChild(
        form
    );


    document
        .getElementById(
            "patientContinue"
        )
        .onclick =
        function() {

            reviewAppointment();

        };


    scrollToBottom();

}


/* ============================================================
   REVIEW APPOINTMENT
============================================================ */

function reviewAppointment() {


    const name =
        document
            .getElementById(
                "patientName"
            )
            .value
            .trim();


    const phone =
        document
            .getElementById(
                "patientPhone"
            )
            .value
            .trim();


    if (!name) {

        alert(
            text("nameRequired")
        );

        return;

    }


    if (!phone) {

        alert(
            text("phoneRequired")
        );

        return;

    }


    appointment.name =
        name;


    appointment.phone =
        phone;


    const date =
        new Date(
            appointment.date
            + "T00:00:00"
        );


    const formattedDate =
        formatAppointmentDate(date);


    addMessage(
        text("reviewPrompt"),
        "bot"
    );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "confirm-card";


    card.innerHTML = `

        <h3>${text("summaryTitle")}</h3>


        <div class="confirm-row">

            <span class="confirm-label">
                ${text("service")}
            </span>

            <span class="confirm-value">
                ${escapeHtml(
                serviceLabels(appointment.services)
                )}
            </span>

        </div>


        <div class="confirm-row">

            <span class="confirm-label">
                ${text("date")}
            </span>

            <span class="confirm-value">
                ${escapeHtml(
                    formattedDate
                )}
            </span>

        </div>


        <div class="confirm-row">

            <span class="confirm-label">
                ${text("time")}
            </span>

            <span class="confirm-value">
                ${escapeHtml(
                    appointment.time
                )}
            </span>

        </div>


        <div class="confirm-row">

            <span class="confirm-label">
                ${text("patient")}
            </span>

            <span class="confirm-value">
                ${escapeHtml(
                    appointment.name
                )}
            </span>

        </div>


        <div class="confirm-row">

            <span class="confirm-label">
                ${text("phone")}
            </span>

            <span class="confirm-value">
                ${escapeHtml(
                    appointment.phone
                )}
            </span>

        </div>


        <button
            class="confirm-button"
            id="confirmButton"
        >

            ${text("confirm")}

        </button>

    `;


    chatBox.appendChild(
        card
    );


    document
        .getElementById(
            "confirmButton"
        )
        .onclick =
        function() {

            confirmAppointment();

        };


    scrollToBottom();

}


/* ============================================================
   CONFIRM APPOINTMENT
============================================================ */

async function confirmAppointment() {


    const button =
        document.getElementById(
            "confirmButton"
        );


    button.disabled =
        true;


    button.textContent =
        text("saving");


    try {

        const response =
            await fetch(
                "/appointment",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        services:
                            appointment.services,

                        date:
                            appointment.date,

                        time:
                            appointment.time,

                        name:
                            appointment.name,

                        phone:
                            appointment.phone

                    })

                }
            );


        const data =
            await response.json();


        if (
            !data.success
        ) {

            button.disabled =
                false;

            button.textContent =
                text("confirm");


            addMessage(
                "⚠️ "
                + (
                    currentLanguage === "km"
                        ? text("bookingRejected")
                        : data.message || text("bookingRejected")
                ),
                "bot"
            );


            return;

        }


        showAppointmentSuccess(
            data.appointment
        );


    } catch (error) {

        console.error(
            error
        );


        button.disabled =
            false;

        button.textContent =
            text("confirm");


        addMessage(
            text("saveError"),
            "bot"
        );

    }

}


/* ============================================================
   SUCCESS
============================================================ */

function showAppointmentSuccess(
    savedAppointment
) {


    const date =
        new Date(
            savedAppointment.date
            + "T00:00:00"
        );


    const formattedDate =
        formatAppointmentDate(date);


    addMessage(
        text("success"),
        "bot"
    );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "success-card";


    card.innerHTML = `

        <h3>${text("confirmed")}</h3>


        <p>

            <strong>
                ${text("appointmentId")}
            </strong>

            ${escapeHtml(
                savedAppointment.id
            )}

            <br><br>


            <strong>
                ${text("service")}:
            </strong>

            ${escapeHtml(
            serviceLabels(
                savedAppointment.services || [savedAppointment.service]
            )
            )}

            <br>


            <strong>
                ${text("date")}:
            </strong>

            ${escapeHtml(
                formattedDate
            )}

            <br>


            <strong>
                ${text("time")}:
            </strong>

            ${escapeHtml(
                savedAppointment.time
            )}

            <br>


            <strong>
                ${text("patient")}:
            </strong>

            ${escapeHtml(
                savedAppointment.name
            )}

            <br>


            <strong>
                ${text("phone")}:
            </strong>

            ${escapeHtml(
                savedAppointment.phone
            )}

            <br><br>

            ${text("confirmationNote")}

        </p>

    `;


    chatBox.appendChild(
        card
    );


    addMessage(
        text("next"),
        "bot",
        [
            text("appointmentOption"),
            text("serviceOption"),
            text("mainMenu")
        ]
    );


    resetAppointment();


    scrollToBottom();

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* ============================================================
   ADD MESSAGE
============================================================ */

function addMessage(
    message,
    sender,
    options = []
) {


    const messageDiv =
        document.createElement(
            "div"
        );


    messageDiv.className =
        "message "
        + sender
        + "-message";


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "message-wrapper";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    content.textContent =
        message;


    wrapper.appendChild(
        content
    );


    messageDiv.appendChild(
        wrapper
    );


    chatBox.appendChild(
        messageDiv
    );


    /*
     * OPTIONS
     */

    if (
        sender === "bot"
        &&
        options.length > 0
    ) {


        const optionContainer =
            document.createElement(
                "div"
            );


        optionContainer.className =
            "option-container";


        options.forEach(
            function(option) {


                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "option-button";


                button.type =
                    "button";


                button.textContent =
                    option;


                button.onclick =
                    function() {


                        /*
                         * Disable selected
                         * options
                         */

                        optionContainer
                            .querySelectorAll(
                                "button"
                            )
                            .forEach(
                                function(btn) {

                                    btn.disabled =
                                        true;

                                }
                            );


                        sendMessage(
                            option
                        );

                    };


                optionContainer.appendChild(
                    button
                );

            }
        );


        wrapper.appendChild(
            optionContainer
        );

    }


    scrollToBottom();

}


/* ============================================================
   TYPING
============================================================ */

function showTyping() {


    const id =
        "typing-"
        + Date.now();


    const messageDiv =
        document.createElement(
            "div"
        );


    messageDiv.className =
        "message bot-message";


    messageDiv.id =
        id;


    messageDiv.innerHTML = `

        <div class="message-wrapper">

            <div class="message-content">

                <div class="typing">

                    <span></span>

                    <span></span>

                    <span></span>

                </div>

            </div>

        </div>

    `;


    chatBox.appendChild(
        messageDiv
    );


    scrollToBottom();


    return id;

}


/* ============================================================
   REMOVE TYPING
============================================================ */

function removeTyping(
    id
) {


    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.remove();

    }

}


/* ============================================================
   SCROLL
============================================================ */

function scrollToBottom() {

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


/* ============================================================
   ENTER KEY
============================================================ */

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* ============================================================
   AI DENTAL KNOWLEDGE CHAT
============================================================ */

const aiChatScreen   = document.getElementById("aiChatScreen");
const aiChatBox      = document.getElementById("aiChatBox");
const aiMessageInput = document.getElementById("aiMessageInput");
const aiSendButton   = document.getElementById("aiSendButton");
const aiHistoryList  = document.getElementById("aiHistoryList");
const aiComposer     = document.getElementById("aiComposer");
let activeAiSessionId = "";
let activeSpeechRecognition = null;

function toggleSpeechInput() {
    if (activeSpeechRecognition) {
        activeSpeechRecognition.stop();
        return;
    }

    const SpeechRecognition = window.SpeechRecognition
        || window.webkitSpeechRecognition;
    const microphoneButton = document.getElementById("aiMicrophoneButton");
    const speechStatus = document.getElementById("aiSpeechStatus");

    if (!SpeechRecognition) {
        speechStatus.textContent = text("voiceUnsupported");
        return;
    }

    let recognition;
    try {
        recognition = new SpeechRecognition();
        recognition.lang = currentLanguage === "km" ? "km-KH" : "en-US";
        recognition.continuous = false;
        recognition.interimResults = true;
        let finalTranscript = "";
        let recognitionFailed = false;

        recognition.onstart = function() {
            activeSpeechRecognition = recognition;
            microphoneButton.classList.add("is-listening");
            microphoneButton.setAttribute("aria-pressed", "true");
            microphoneButton.setAttribute("aria-label", text("voiceListening"));
            microphoneButton.title = text("voiceListening");
            speechStatus.textContent = text("voiceListening");
        };

        recognition.onresult = function(event) {
            let interimTranscript = "";
            for (let index = event.resultIndex; index < event.results.length; index++) {
                const result = event.results[index];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }
            if (interimTranscript) {
                speechStatus.textContent = finalTranscript + interimTranscript;
            }
            if (finalTranscript) {
                const separator = aiMessageInput.value.trim() ? " " : "";
                aiMessageInput.value += separator + finalTranscript.trim();
                speechStatus.textContent = "";
                aiMessageInput.focus();
            }
        };

        recognition.onerror = function(event) {
            recognitionFailed = true;
            const errorMessages = {
                "not-allowed": "voiceDenied",
                "service-not-allowed": "voiceDenied",
                "language-not-supported": "voiceLanguageUnsupported",
                "no-speech": "voiceNoSpeech"
            };
            speechStatus.textContent = text(
                errorMessages[event.error] || "voiceError"
            );
        };

        recognition.onend = function() {
            activeSpeechRecognition = null;
            microphoneButton.classList.remove("is-listening");
            microphoneButton.setAttribute("aria-pressed", "false");
            microphoneButton.setAttribute("aria-label", text("voiceStart"));
            microphoneButton.title = text("voiceStart");
            if (!recognitionFailed && !finalTranscript) {
                speechStatus.textContent = "";
            }
        };

        recognition.start();
    } catch (error) {
        activeSpeechRecognition = null;
        speechStatus.textContent = text("voiceError");
        console.error("Failed to start speech recognition:", error);
    }
}

function createAiSessionId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    return "dental-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

if (aiComposer) {
    aiComposer.addEventListener("submit", function(event) {
        event.preventDefault();
        sendAiMessage();
    });
}

function getAiSuggestions() {
    return [
    "aiSuggestionBrush",
    "aiSuggestionDecay",
    "aiSuggestionGums",
    "aiSuggestionWhitening",
    "aiSuggestionRootCanal",
    "aiSuggestionBreath",
    "aiSuggestionKids",
    "aiSuggestionFoods"
    ];
}

function startAiChat() {
    const welcome = document.getElementById("welcomeScreen");
    const aiScreen = document.getElementById("aiChatScreen");
    const input = document.getElementById("aiMessageInput");

    if (welcome) welcome.style.display = "none";
    if (aiScreen) aiScreen.style.display = "flex";

    if (!activeAiSessionId) {
        startNewAiChat(false);
        toggleAiSidebar(window.innerWidth > 800);
    }
    loadAiHistoryList();

    if (input) input.focus();
}

function closeAiChat() {
    const welcome = document.getElementById("welcomeScreen");
    const aiScreen = document.getElementById("aiChatScreen");
    toggleAiSidebar(false);
    if (aiScreen) aiScreen.style.display = "none";
    if (welcome) welcome.style.display = "flex";
}

function toggleAiSidebar(forceOpen) {
    const sidebar = document.getElementById("aiSidebar");
    if (!sidebar) return;
    const shouldOpen = typeof forceOpen === "boolean"
        ? forceOpen
        : !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", shouldOpen);
    document.getElementById("aiChatScreen").classList.toggle("history-open", shouldOpen);
}

function startNewAiChat(focusInput = true) {
    activeAiSessionId = createAiSessionId();
    aiChatBox.innerHTML = "";
    addAiMessage(text("aiGreeting"), false, "aiGreeting");
    showAiSuggestions();
    renderAiHistoryActiveState();
    toggleAiSidebar(false);
    if (focusInput) aiMessageInput.focus();
}

async function loadAiHistoryList() {
    try {
        const response = await fetch("/chat/sessions?source=dental_ai");
        if (!response.ok) throw new Error("Could not load conversation history.");
        const data = await response.json();
        renderAiHistory(data.sessions || []);
    } catch (error) {
        console.error("Failed to load Dental AI history:", error);
    }
}

function renderAiHistory(sessions) {
    if (!aiHistoryList) return;
    aiHistoryList.innerHTML = "";
    if (!sessions.length) {
        const empty = document.createElement("p");
        empty.className = "ai-history-empty";
        empty.textContent = text("aiHistoryEmpty");
        aiHistoryList.appendChild(empty);
        return;
    }

    sessions.forEach(function(session) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ai-history-item";
        button.dataset.sessionId = session.session_id;
        button.textContent = session.title || text("dentalConversation");
        button.title = button.textContent;
        button.onclick = function() {
            loadAiConversation(session.session_id);
        };
        aiHistoryList.appendChild(button);
    });
    renderAiHistoryActiveState();
}

function renderAiHistoryActiveState() {
    if (!aiHistoryList) return;
    aiHistoryList.querySelectorAll(".ai-history-item").forEach(function(item) {
        item.classList.toggle("active", item.dataset.sessionId === activeAiSessionId);
    });
}

async function loadAiConversation(sessionId) {
    try {
        const response = await fetch(
            "/chat/history?session_id=" + encodeURIComponent(sessionId)
            + "&source=dental_ai&limit=200"
        );
        if (!response.ok) throw new Error("Could not load this conversation.");
        const data = await response.json();
        activeAiSessionId = sessionId;
        aiChatBox.innerHTML = "";
        (data.history || []).forEach(function(message) {
            if (message.role === "user") {
                addAiUserMessage(message.message);
            } else {
                addAiMessage(message.message, true);
            }
        });
        renderAiHistoryActiveState();
        toggleAiSidebar(false);
    } catch (error) {
        console.error("Failed to load Dental AI conversation:", error);
        addAiMessage(text("aiLoadingError"), false);
    }
}

function showAiSuggestions() {
    aiChatBox.querySelectorAll(".ai-suggestions").forEach(function(existing) {
        existing.remove();
    });
    const wrapper = document.createElement("div");
    wrapper.className = "ai-suggestions";
    getAiSuggestions().forEach(function(q) {
        const btn = document.createElement("button");
        btn.className = "ai-suggestion";
        btn.dataset.aiTranslationKey = q;
        btn.textContent = text(q);
        btn.onclick = function() {
            wrapper.remove();
            sendAiMessage(text(btn.dataset.aiTranslationKey));
        };
        wrapper.appendChild(btn);
    });
    aiChatBox.appendChild(wrapper);
    aiChatBox.scrollTop = aiChatBox.scrollHeight;
}

function addAiUserMessage(text) {
    const div = document.createElement("div");
    div.className = "message user-message";
    div.innerHTML = `<div class="message-wrapper"><div class="message-content">${escapeHtml(text)}</div></div>`;
    aiChatBox.appendChild(div);
    aiChatBox.scrollTop = aiChatBox.scrollHeight;
}

function addAiMessage(messageText, showDisclaimer, translationKey) {
    const wrapper = document.createElement("div");
    wrapper.className = "message bot-message ai-message";
    const translationAttributes = translationKey
        ? `data-ai-translation-key="${translationKey}" data-ai-translation-html="true"`
        : "";

    // Render basic markdown: **bold**, bullet lists
    let html = escapeHtml(messageText)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/^- (.+)$/gm, "• $1")
        .replace(/\n/g, "<br>");

    let disclaimerHtml = "";
    if (showDisclaimer) {
        disclaimerHtml = `<div class="ai-disclaimer" data-ai-translation-key="aiDisclaimer">${escapeHtml(text("aiDisclaimer"))}</div>`;
    }

    wrapper.innerHTML = `
        <div class="message-wrapper">
            <div class="message-content" ${translationAttributes}>${html}</div>
            ${disclaimerHtml}
        </div>
    `;
    aiChatBox.appendChild(wrapper);
    aiChatBox.scrollTop = aiChatBox.scrollHeight;
}

function refreshAiTranslations() {
    document.querySelectorAll("[data-ai-translation-key]").forEach(function(element) {
        const translation = text(element.dataset.aiTranslationKey);
        if (element.dataset.aiTranslationHtml === "true") {
            element.innerHTML = escapeHtml(translation).replace(/\n/g, "<br>");
        } else {
            element.textContent = translation;
        }
    });
}

function showAiTyping() {
    const id = "ai-typing-" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.className = "message bot-message";
    div.innerHTML = `<div class="message-wrapper"><div class="message-content"><div class="typing"><span></span><span></span><span></span></div></div></div>`;
    aiChatBox.appendChild(div);
    aiChatBox.scrollTop = aiChatBox.scrollHeight;
    return id;
}

async function sendAiMessage(preset) {
    const message = preset || aiMessageInput.value.trim();
    if (!message) return;

    const responseLanguage = /[\u1780-\u17FF]/.test(message)
        ? "km"
        : currentLanguage;
    if (responseLanguage !== currentLanguage) {
        setLanguage(responseLanguage);
    }

    aiChatBox.querySelectorAll(".ai-suggestions").forEach(function(existing) {
        existing.remove();
    });
    addAiUserMessage(message);
    aiMessageInput.value = "";

    aiSendButton.disabled = true;
    const typingId = showAiTyping();
    const controller = new AbortController();
    const requestTimeout = setTimeout(function() {
        controller.abort();
    }, 30000);

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: message,
                session_id: activeAiSessionId,
                language: responseLanguage
            }),
            signal: controller.signal
        });

        const data = await response.json();
        removeTyping(typingId);

        if (!response.ok) {
            // Check if it's a configuration error
            const detail = data.detail || "";
            if (detail.includes("GEMINI_API_KEY")) {
                const notice = document.createElement("div");
                notice.className = "ai-setup-notice";
                notice.innerHTML = `
                    <strong data-ai-translation-key="aiApiKeyTitle">${text("aiApiKeyTitle")}</strong>
                    <span data-ai-translation-key="aiApiKeyNotice" data-ai-translation-html="true">${text("aiApiKeyNotice")}</span>
                `;
                const msgDiv = document.createElement("div");
                msgDiv.className = "message bot-message ai-message";
                msgDiv.innerHTML = `<div class="message-wrapper"></div>`;
                msgDiv.querySelector(".message-wrapper").appendChild(notice);
                aiChatBox.appendChild(msgDiv);
            } else {
                console.error("Dental AI request failed:", detail);
                addAiMessage(text("aiError"), false, "aiError");
            }
        } else {
            addAiMessage(data.answer, true);
            showAiSuggestions();
            await loadAiHistoryList();
        }

    } catch (err) {
        removeTyping(typingId);
        if (err.name === "AbortError") {
            addAiMessage(text("aiTimeout"), false, "aiTimeout");
        } else {
            addAiMessage(text("aiConnectionError"), false, "aiConnectionError");
        }
    } finally {
        clearTimeout(requestTimeout);
        aiSendButton.disabled = false;
        aiMessageInput.focus();
    }
}

setLanguage(localStorage.getItem("dental-chat-language") || "en");
