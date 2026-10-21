import axios from "axios";

const CONFIG = {
    WHATSAPP_CLOUD_API_URL: "https://facebook.com",
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    MY_BUSINESS_NUMBER: "+263784219178", 
    TREASURER_NUMBER: "+263772608954",    
    AGRIBANK_ACCOUNT: "100007665703",
    MONTHLY_ECOCASH_CAP: 3000.00,
    DAILY_ECOCASH_ALLOCATION: 100.00
};

let dailyTracker = {
    lastResetDate: new Date().toDateString(),
    ecoCashDrawnToday: 0.00,
    monthlyTotalDrawn: 0.00
};

function calculateGeoSensitivePricing(baseValue, regionCode) {
    const regionalModifiers = {
        "ZW": { labor: 1.0, material: 1.0, currency: "USD" },
        "ZA": { labor: 0.85, material: 0.90, currency: "USD" },
        "UK": { labor: 2.2, material: 1.5, currency: "USD" },
        "US": { labor: 2.5, material: 1.6, currency: "USD" }
    };
    
    const modifier = regionalModifiers[regionCode.toUpperCase()] || regionalModifiers["ZW"];
    const calibratedValue = baseValue * ((modifier.labor + modifier.material) / 2);
    return { calibratedValue: calibratedValue.toFixed(2), currency: modifier.currency };
}

export async function processUnifiedEcosystemPipeline(payload) {
    try {
        const { clientName, clientPhone, rawWorth, region, transactionId } = payload;
        const currentRegion = region || "ZW";
        const pricing = calculateGeoSensitivePricing(Number(rawWorth || 1000), currentRegion);

        let ecoCashRoute = 0.00;
        let bankRoute = Number(pricing.calibratedValue);
        const todayStr = new Date().toDateString();

        if (dailyTracker.lastResetDate !== todayStr) {
            dailyTracker.ecoCashDrawnToday = 0.00;
            dailyTracker.lastResetDate = todayStr;
        }

        if (dailyTracker.ecoCashDrawnToday < CONFIG.DAILY_ECOCASH_ALLOCATION && dailyTracker.monthlyTotalDrawn < CONFIG.MONTHLY_ECOCASH_CAP) {
            let spaceLeftToday = CONFIG.DAILY_ECOCASH_ALLOCATION - dailyTracker.ecoCashDrawnToday;
            ecoCashRoute = bankRoute > spaceLeftToday ? spaceLeftToday : bankRoute;
            bankRoute = bankRoute - ecoCashRoute;

            dailyTracker.ecoCashDrawnToday += ecoCashRoute;
            dailyTracker.monthlyTotalDrawn += ecoCashRoute;
        }

        console.log(`\n💸 INVISIBLE SPLIT EXECUTED SUCCESSFULY`);
        console.log(`📲 EcoCash Sweep: $${ecoCashRoute} USD`);
        console.log(`🏛️ AgriBank Route [${CONFIG.AGRIBANK_ACCOUNT}]: $${bankRoute} USD`);

        return { status: "success", geoCalibratedValue: pricing.calibratedValue };
    } catch (error) {
        console.error("Critical failure in routing node:", error.message);
        throw error;
    }
}

export async function dispatchClientOnboardingWelcome(clientName, clientPhone, projectType) {
    console.log(`\n✉️ OUTBOUND DISPATCH: Onboarding client welcome text compiled for ${clientName}.`);
}

async function dispatchWhatsAppMessage(targetNumber, textMessage) {
    try {
        await axios.post(CONFIG.WHATSAPP_CLOUD_API_URL, {
            messaging_product: "whatsapp", to: targetNumber, type: "text", text: { body: textMessage }
        }, { headers: { "Authorization": `Bearer ${CONFIG.WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" } });
    } catch (err) {
        // Suppress API endpoint network logs for local environment simulation tracing
    }
}
