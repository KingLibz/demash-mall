import axios from "axios";

// Core System Configuration (Locked Production Values)
const CONFIG = {
    WHATSAPP_CLOUD_API_URL: "https://facebook.com",
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    MY_BUSINESS_NUMBER: "+263784219178", // Direct Operations Line
    TREASURER_NUMBER: "+263772608954",    // Chief Treasurer Contact Line
    DAILY_ECOCASH_LIMIT: 300.00
};

/**
 * Psychological Lead Parser & WhatsApp Dispatcher
 * Parses real intent customer activity and routes data streams instantly.
 */
export async function routeIncomingSalesLead(leadPayload) {
    try {
        const { clientName, clientPhone, projectType, estimatedValue, location, transactionId } = leadPayload;

        console.log(`Processing high-intent pipeline lead for: ${clientName}`);

        // 1. Construct a high-impact, short, action-oriented message block for individual reps
        const messagePayload = 
`⚡ *NEW HIGH-INTENT DEMASH LEAD* ⚡
------------------------------------
👤 *Client:* ${clientName}
📞 *Phone:* ${clientPhone}
📍 *Region:* ${location}
🏗️ *Project:* ${projectType}
💰 *Est. Worth:* $${estimatedValue} USD

*Action Required:* Review supplier POS deployment catalogs and sync affiliate referral links immediately.`;

        // 2. Dispatch to your primary business phone number
        await dispatchWhatsAppMessage(CONFIG.MY_BUSINESS_NUMBER, messagePayload);

        // 3. Automated Revenue Routing Logic (AgriBank Hook)
        if (transactionId) {
            console.log(`Checking ledger parameters for clearing transaction: ${transactionId}`);
            
            // Logic to calculate distribution profiles (\$300 EcoCash ceiling rule)
            let ecoCashAllocation = estimatedValue > CONFIG.DAILY_ECOCASH_LIMIT ? CONFIG.DAILY_ECOCASH_LIMIT : estimatedValue;
            let bankAllocation = estimatedValue > CONFIG.DAILY_ECOCASH_LIMIT ? (estimatedValue - CONFIG.DAILY_ECOCASH_LIMIT) : 0;

            const revenueAlertMessage = 
`🏦 *AGRIBANK LEDGER SETTLEMENT INTAKE*
------------------------------------
🧾 *Txn Ref:* ${transactionId}
💵 *Total Cleared:* $${estimatedValue} USD
📲 *EcoCash Route:* $${ecoCashAllocation} USD
🏛️ *Bank Ledger Route:* $${bankAllocation} USD

*System Instruction:* Notify Chief Treasurer to compile direct construction paperwork immediately.`;

            // Alert the Chief Treasurer line automatically to trigger paperwork preparation
            await dispatchWhatsAppMessage(CONFIG.TREASURER_NUMBER, revenueAlertMessage);
        }

        return { status: "success", message: "Ecosystem payload routed flawlessly." };

    } catch (error) {
        console.error("Critical error in automation routing node:", error.message);
        throw error;
    }
}

/**
 * Executes the secure WhatsApp Cloud API outbound push payload
 */
async function dispatchWhatsAppMessage(targetNumber, textMessage) {
    try {
        await axios.post(
            CONFIG.WHATSAPP_CLOUD_API_URL,
            {
                messaging_product: "whatsapp",
                to: targetNumber,
                type: "text",
                text: { body: textMessage }
            },
            {
                headers: {
                    "Authorization": `Bearer ${CONFIG.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(`Message pushed cleanly to target: ${targetNumber}`);
    } catch (err) {
        console.error(`Failed to execute message drop to ${targetNumber}:`, err.response?.data || err.message);
    }
}

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

// Simulated persistent tracking state for daily splits
let dailyTracker = {
    lastResetDate: new Date().toDateString(),
    ecoCashDrawnToday: 0.00,
    monthlyTotalDrawn: 0.00
};

/**
 * 🌍 Upgraded Geo-Sensitive Pricing Engine
 * Adjusts structural pricing models seamlessly across borders
 */
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

/**
 * Master Inbound Payload Traffic Handler
 */
export async function processUnifiedEcosystemPipeline(payload) {
    try {
        const { clientName, clientPhone, rawWorth, region, transactionId } = payload;
        const currentRegion = region || "ZW";
        
        // 1. Run Dynamic Geo-Pricing Engine
        const pricing = calculateGeoSensitivePricing(Number(rawWorth || 1000), currentRegion);

        // 2. Invisible Financial Settlement Splitting Engine
        let ecoCashRoute = 0.00;
        let bankRoute = Number(pricing.calibratedValue);
        const todayStr = new Date().toDateString();

        // Daily reset routine checks
        if (dailyTracker.lastResetDate !== todayStr) {
            dailyTracker.ecoCashDrawnToday = 0.00;
            dailyTracker.lastResetDate = todayStr;
        }

        // Apply rules: Split first transaction parameters cleanly
        if (dailyTracker.ecoCashDrawnToday < CONFIG.DAILY_ECOCASH_ALLOCATION && dailyTracker.monthlyTotalDrawn < CONFIG.MONTHLY_ECOCASH_CAP) {
            let spaceLeftToday = CONFIG.DAILY_ECOCASH_ALLOCATION - dailyTracker.ecoCashDrawnToday;
            ecoCashRoute = bankRoute > spaceLeftToday ? spaceLeftToday : bankRoute;
            bankRoute = bankRoute - ecoCashRoute;

            dailyTracker.ecoCashDrawnToday += ecoCashRoute;
            dailyTracker.monthlyTotalDrawn += ecoCashRoute;
        }

        console.log(`Split Executed Invisible to Client. EcoCash: $${ecoCashRoute}, Bank Account: $${bankRoute}`);

        // 3. Dispatch Psychological WhatsApp Response to Internal Ops Line
        const opsAlert = 
`⚡ *DEMASH ENGINE PIPELINE ACTIVE* ⚡
------------------------------------
👤 *Client:* ${clientName}
📞 *Contact:* ${clientPhone}
🌍 *Detected Region:* ${currentRegion}
💰 *Calibrated Project Value:* $${pricing.calibratedValue} USD

*System Action:* Automated web response template deployed instantly to client portal.`;

        await dispatchWhatsAppMessage(CONFIG.MY_BUSINESS_NUMBER, opsAlert);

        // 4. Secure AgriBank Settlement Layer Hook
        if (transactionId) {
            const treasurerAlert = 
`🏦 *AGRIBANK SETTLEMENT INTELLIGENCE*
------------------------------------
🧾 *Txn Reference:* ${transactionId}
💎 *Total Gross Cleared:* $${pricing.calibratedValue} USD
📲 *Invisible EcoCash Sweep:* $${ecoCashRoute} USD 
🏛️ *Nostro Bank Settle (${CONFIG.AGRIBANK_ACCOUNT}):* $${bankRoute} USD

*Instruction:* Vault ledger logged. Treasurer compile logistics deployment files now.`;

            await dispatchWhatsAppMessage(CONFIG.TREASURER_NUMBER, treasurerAlert);
        }

        return { status: "success", geoCalibratedValue: pricing.calibratedValue };

    } catch (error) {
        console.error("Critical failure in ecosystem pipeline routing:", error.message);
        throw error;
    }
}

async function dispatchWhatsAppMessage(targetNumber, textMessage) {
    try {
        await axios.post(CONFIG.WHATSAPP_CLOUD_API_URL, {
            messaging_product: "whatsapp",
            to: targetNumber,
            type: "text",
            text: { body: textMessage }
        }, {
            headers: {
                "Authorization": `Bearer ${CONFIG.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.error(`WhatsApp notification drop skipped or failed: ${err.message}`);
    }
}
/**
 * 🚀 High-Impact Automated Client Onboarding Dispatcher
 * Sends a premium welcoming sequence directly to the client's WhatsApp number.
 */
export async function dispatchClientOnboardingWelcome(clientName, clientPhone, projectType) {
    try {
        console.log(`Deploying onboarding sequence to client: ${clientName} (${clientPhone})`);

        const welcomePayload = 
`Greetings *${clientName}*,

Thank you for engaging *Demash Global Infrastructure & Capital*. Your intake request for structural project framing under our *${projectType}* division has been successfully ingested into our sovereign core operations engine.

🏢 *What Happens Next:*
1. Our engineering desk will calibrate material sourcing baselines for your regional zone.
2. A formal logistical deployment layout will be generated.
3. An executive manager will reach out directly via this line to finalize your supplier POS parameters.

We look forward to structuring your high-yield assets.

Best Regards,
*Executive Operations Desk*
Demash Global
_Sovereign Infrastructure. Managed Capital._`;

        // Execute outbound push straight to the customer's phone
        await dispatchWhatsAppMessage(clientPhone, welcomePayload);
        console.log(`Onboarding template successfully pushed to client line.`);

    } catch (error) {
        console.error(`Failed to execute automated client onboarding drop: ${error.message}`);
    }
}
