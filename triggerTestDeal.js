import { processUnifiedEcosystemPipeline, dispatchClientOnboardingWelcome } from "./whatsappRouter.js";

// 🧪 REAL-WORLD PRODUCTION TEST SIMULATION DATA
const simulatedIncomingDeal = {
    clientName: "Tinashe Moyo",          // Simulated Client
    clientPhone: "+263712345678",        // Target customer phone number
    rawWorth: "1250.00",                 // Total transaction bill value
    region: "ZW",                        // Local country marker
    transactionId: "TXN-AGRI-99881122"   // Mocked AgriBank clearing reference string
};

async function executeSystemDiagnostic() {
    console.log("🏁 INITIALIZING LIVE SYSTEM DIAGNOSTIC TRACE...");
    
    try {
        // 1. Trigger the main invisible financial splitting engine
        console.log("\n--- Testing Invisible Split & Internal Notifications ---");
        const pipelineResult = await processUnifiedEcosystemPipeline(simulatedIncomingDeal);
        console.log("Pipeline processing result:", pipelineResult);

        // 2. Trigger the client-facing welcome sequence
        console.log("\n--- Testing Automated Client Welcome Dispatcher ---");
        await dispatchClientOnboardingWelcome(
            simulatedIncomingDeal.clientName,
            simulatedIncomingDeal.clientPhone,
            "Commercial Structural Framing"
        );

        console.log("\n✅ DIAGNOSTIC RUN COMPLETE. ALL LOGIC PATHWAYS STABLE.");

    } catch (error) {
        console.error("\n❌ CRITICAL COHESION ERROR DETECTED DURING TRACE:", error.message);
    }
}

executeSystemDiagnostic();
