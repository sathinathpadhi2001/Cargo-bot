// PORT-AI Engine - Intelligent Logistics Operations Agent
// Simulates 7 real-world port operations tools with predictive reasoning

import { ships, containers, alerts, shipmentLookup } from "./data";

// ─── Tool Definitions ────────────────────────────────────────────────────────

export interface ToolCall {
    name: string;
    args: Record<string, string>;
    result: unknown;
}

export interface PortAIResponse {
    thinking: string[];         // Step-by-step reasoning chain
    toolCalls: ToolCall[];      // Tools called
    structured: StructuredReport | null;
    freeText: string | null;    // For non-structured responses
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;
}

export interface StructuredReport {
    shipmentId?: string;
    currentLocation?: string;
    dock?: string;
    vessel?: string;
    eta?: string;
    delayPrediction?: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    operationalNote: string;
    extraFields?: { label: string; value: string }[];
}

// ─── Dock Database ────────────────────────────────────────────────────────────

const dockDatabase: Record<number, {
    occupancy: number;
    vessels: number;
    queued: number;
    turnaround: number;
    status: "AVAILABLE" | "NEAR CAPACITY" | "FULL";
}> = {
    1: { occupancy: 45, vessels: 1, queued: 0, turnaround: 14.2, status: "AVAILABLE" },
    2: { occupancy: 71, vessels: 2, queued: 1, turnaround: 19.8, status: "AVAILABLE" },
    3: { occupancy: 58, vessels: 2, queued: 0, turnaround: 16.5, status: "AVAILABLE" },
    4: { occupancy: 63, vessels: 2, queued: 1, turnaround: 18.3, status: "AVAILABLE" },
    5: { occupancy: 52, vessels: 1, queued: 0, turnaround: 15.1, status: "AVAILABLE" },
    6: { occupancy: 88, vessels: 3, queued: 2, turnaround: 24.7, status: "NEAR CAPACITY" },
    7: { occupancy: 94, vessels: 3, queued: 1, turnaround: 22.4, status: "NEAR CAPACITY" },
    8: { occupancy: 100, vessels: 4, queued: 3, turnaround: 28.9, status: "FULL" },
    9: { occupancy: 76, vessels: 3, queued: 1, turnaround: 20.1, status: "AVAILABLE" },
    10: { occupancy: 33, vessels: 1, queued: 0, turnaround: 12.0, status: "AVAILABLE" },
};

const weatherData: Record<string, {
    condition: string;
    windSpeed: string;
    waveHeight: string;
    visibility: string;
    impactLevel: "NONE" | "LOW" | "MODERATE" | "HIGH";
    delayEstimate: number;
}> = {
    "port of singapore": { condition: "Partly Cloudy", windSpeed: "12 knots", waveHeight: "0.8m", visibility: "Good", impactLevel: "LOW", delayEstimate: 0 },
    "rotterdam": { condition: "Storm Warning", windSpeed: "38 knots", waveHeight: "3.5m", visibility: "Poor", impactLevel: "HIGH", delayEstimate: 8 },
    "shanghai": { condition: "Clear", windSpeed: "8 knots", waveHeight: "0.4m", visibility: "Excellent", impactLevel: "NONE", delayEstimate: 0 },
    "los angeles": { condition: "Foggy", windSpeed: "6 knots", waveHeight: "1.1m", visibility: "Moderate", impactLevel: "MODERATE", delayEstimate: 3 },
    "mumbai": { condition: "Clear", windSpeed: "14 knots", waveHeight: "1.2m", visibility: "Good", impactLevel: "LOW", delayEstimate: 1 },
    "hamburg": { condition: "Overcast", windSpeed: "22 knots", waveHeight: "2.1m", visibility: "Moderate", impactLevel: "MODERATE", delayEstimate: 4 },
};

// ─── The 7 Core Port Tools ─────────────────────────────────────────────────

export function getShipmentStatus(shipmentId: string) {
    const id = shipmentId.toUpperCase();
    const shipment = shipmentLookup[id];
    if (!shipment) return null;
    return { ...shipment, status: shipment.delay > 0 ? "DELAYED" : "ON-TIME" };
}

export function getShipLocation(shipName: string) {
    const ship = ships.find(
        (s) => s.name.toLowerCase().includes(shipName.toLowerCase())
    );
    if (!ship) return null;
    return {
        name: ship.name,
        id: ship.id,
        lat: ship.lat,
        lng: ship.lng,
        speed: ship.speed,
        heading: ship.heading,
        status: ship.status,
        cargo: ship.cargo,
        origin: ship.origin,
        destination: ship.destination,
    };
}

export function getDockOccupancy(dockNumber: number) {
    const dock = dockDatabase[dockNumber];
    if (!dock) return null;
    return { dockNumber, ...dock };
}

export function getContainerStatus(containerId: string) {
    const id = containerId.toUpperCase();
    const container = containers.find((c) => c.id === id);
    if (!container) return null;
    const overThreshold = container.temperature > container.threshold;
    const riskLevel = overThreshold ? "HIGH RISK" : "NOMINAL";
    return { ...container, riskLevel };
}

export function predictDelay(shipmentId: string) {
    const id = shipmentId.toUpperCase();
    const shipment = shipmentLookup[id];
    if (!shipment) return null;

    const factors: string[] = [];
    let totalDelay = shipment.delay;

    if (shipment.risk === "High") {
        factors.push("Adverse weather conditions along transit route");
        factors.push("Route deviation detected — recalibrating ETA");
    }
    if (shipment.risk === "Medium") {
        factors.push("Moderate headwinds reducing vessel speed");
    }
    if (shipment.delay === 0) {
        factors.push("No significant delay factors identified");
        factors.push("Vessel operating within optimal parameters");
    }

    const dockMatch = parseInt(shipment.dock.replace(/[^0-9]/g, "")) || 4;
    const dock = dockDatabase[dockMatch];
    if (dock && dock.occupancy > 85) {
        totalDelay += 2;
        factors.push(`Dock ${dockMatch} congestion adds ~2 hrs berthing delay`);
    }

    return {
        shipmentId: id,
        predictedDelay: totalDelay,
        confidence: totalDelay === 0 ? 97 : 84,
        factors,
        recommendation: totalDelay > 6
            ? "Consider alternate dock assignment and notify downstream logistics"
            : totalDelay > 0
                ? "Monitor closely; minor adjustment to ETA recommended"
                : "No action required — shipment on schedule",
    };
}

export function getWeatherImpact(portName: string) {
    const key = portName.toLowerCase();
    const weather = weatherData[key] ?? {
        condition: "Moderate Swell",
        windSpeed: "18 knots",
        waveHeight: "1.8m",
        visibility: "Good",
        impactLevel: "LOW" as const,
        delayEstimate: 1,
    };
    return { port: portName, ...weather };
}

export function triggerAlert(alertType: string, entityId: string) {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    return {
        success: true,
        alertId: `ALT-${Math.floor(Math.random() * 90000) + 10000}`,
        alertType,
        entityId: entityId.toUpperCase(),
        timestamp,
        message: `Alert triggered for ${entityId.toUpperCase()} — Port operations team notified`,
        priority: alertType.toLowerCase().includes("temp") ? "CRITICAL" : "HIGH",
    };
}

// ─── Intent Parser ─────────────────────────────────────────────────────────

function parseIntent(input: string): {
    intent: string;
    shipmentId?: string;
    containerId?: string;
    dockNumber?: number;
    shipName?: string;
    portName?: string;
} {
    const upper = input.toUpperCase();
    const lower = input.toLowerCase();

    // Extract IDs
    const shpMatch = upper.match(/SHP-\d+/);
    const cntrMatch = upper.match(/CNTR-\d+/);
    const dockMatch = lower.match(/dock\s*(\d+)/);

    // Ship name detection
    const shipKeywords = ["atlantic crown", "pacific voyager", "nordic star"];
    const foundShip = shipKeywords.find((s) => lower.includes(s));

    // Port name detection
    const portKeywords = Object.keys(weatherData);
    const foundPort = portKeywords.find((p) => lower.includes(p));

    // Intent classification
    let intent = "general";
    if (shpMatch) intent = "track_shipment";
    else if (cntrMatch) intent = "container_status";
    else if (dockMatch) intent = "dock_status";
    else if (foundShip && !cntrMatch) intent = "ship_location";
    else if (
        lower.includes("weather") ||
        lower.includes("storm") ||
        lower.includes("wind")
    )
        intent = "weather";
    else if (lower.includes("delay") || lower.includes("delayed"))
        intent = "delays";
    else if (lower.includes("alert") || lower.includes("reefer") || lower.includes("temperature"))
        intent = "alerts";
    else if (lower.includes("congestion") || lower.includes("dock") || lower.includes("berthing"))
        intent = "congestion";
    else if (lower.includes("ship") || lower.includes("vessel") || lower.includes("fleet"))
        intent = "fleet_overview";
    else if (lower.includes("help") || lower.includes("what can"))
        intent = "help";

    return {
        intent,
        shipmentId: shpMatch?.[0],
        containerId: cntrMatch?.[0],
        dockNumber: dockMatch ? parseInt(dockMatch[1]) : undefined,
        shipName: foundShip,
        portName: foundPort,
    };
}

// ─── Main PORT-AI Brain ────────────────────────────────────────────────────

export async function processPortAIQuery(userInput: string): Promise<PortAIResponse> {
    const parsed = parseIntent(userInput);
    const toolCalls: ToolCall[] = [];
    const thinking: string[] = [];

    // ── Track Shipment ──────────────────────────────────────────────────────
    if (parsed.intent === "track_shipment" && parsed.shipmentId) {
        thinking.push(`Detected shipment ID: ${parsed.shipmentId}`);
        thinking.push("Calling getShipmentStatus() to retrieve live data...");

        const statusResult = getShipmentStatus(parsed.shipmentId);
        toolCalls.push({ name: "getShipmentStatus", args: { shipment_id: parsed.shipmentId }, result: statusResult });

        if (!statusResult) {
            return {
                thinking,
                toolCalls,
                structured: null,
                freeText: `⚠️ Shipment **${parsed.shipmentId}** not found in the system. Please verify the ID and try again. Available IDs: SHP-20931, SHP-40127, SHP-71583.`,
                riskLevel: null,
            };
        }

        thinking.push(`Shipment found — vessel: ${statusResult.vessel}, status: ${statusResult.status}`);
        thinking.push("Running predictDelay() to forecast operational impact...");

        const delayResult = predictDelay(parsed.shipmentId);
        toolCalls.push({ name: "predictDelay", args: { shipment_id: parsed.shipmentId }, result: delayResult });

        thinking.push("Checking dock congestion levels...");
        const dockNum = parseInt(statusResult.dock.replace(/[^0-9]/g, "")) || 4;
        const dockResult = getDockOccupancy(dockNum);
        toolCalls.push({ name: "getDockOccupancy", args: { dock_number: String(dockNum) }, result: dockResult });

        thinking.push("Analyzing all data — composing structured risk report...");

        const risk =
            statusResult.risk === "High"
                ? "HIGH"
                : statusResult.risk === "Medium"
                    ? "MEDIUM"
                    : "LOW";

        const riskFull =
            dockResult && dockResult.occupancy > 90 && risk !== "HIGH"
                ? "MEDIUM"
                : risk;

        let note = delayResult?.recommendation ?? "Monitoring in progress.";
        if (dockResult && dockResult.status === "NEAR CAPACITY") {
            note += ` Dock ${dockNum} operating at ${dockResult.occupancy}% — consider alternate berth allocation.`;
        } else if (dockResult && dockResult.status === "FULL") {
            note += ` ⚠️ Dock ${dockNum} is at FULL capacity — immediate rerouting required.`;
        }

        return {
            thinking,
            toolCalls,
            structured: {
                shipmentId: statusResult.id,
                currentLocation: statusResult.location,
                dock: statusResult.dock,
                vessel: statusResult.vessel,
                eta: statusResult.eta,
                delayPrediction:
                    (delayResult?.predictedDelay ?? 0) > 0
                        ? `+${delayResult!.predictedDelay} hours (${delayResult!.confidence}% confidence)`
                        : `No delay expected (${delayResult?.confidence ?? 97}% confidence)`,
                riskLevel: riskFull as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                operationalNote: note,
                extraFields: [
                    { label: "Origin", value: statusResult.origin },
                    {
                        label: "Delay Factors",
                        value:
                            delayResult?.factors.join("; ") ?? "None identified",
                    },
                ],
            },
            freeText: null,
            riskLevel: riskFull as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        };
    }

    // ── Container Status ────────────────────────────────────────────────────
    if (parsed.intent === "container_status" && parsed.containerId) {
        thinking.push(`Detected container ID: ${parsed.containerId}`);
        thinking.push("Calling getContainerStatus() to retrieve sensor data...");

        const result = getContainerStatus(parsed.containerId);
        toolCalls.push({ name: "getContainerStatus", args: { container_id: parsed.containerId }, result });

        if (!result) {
            return {
                thinking,
                toolCalls,
                structured: null,
                freeText: `⚠️ Container **${parsed.containerId}** not found. Try CNTR-44573, CNTR-33817, or CNTR-88241.`,
                riskLevel: null,
            };
        }

        thinking.push(`Temperature: ${result.temperature}°C vs threshold ${result.threshold}°C`);

        if (result.riskAlert) {
            thinking.push("Temperature EXCEEDS threshold — classifying as HIGH RISK");
            thinking.push("Triggering automated alert for operations team...");

            const alertResult = triggerAlert("temperature_breach", parsed.containerId);
            toolCalls.push({
                name: "triggerAlert",
                args: { alert_type: "temperature_breach", entity_id: parsed.containerId },
                result: alertResult,
            });

            return {
                thinking,
                toolCalls,
                structured: {
                    riskLevel: "CRITICAL",
                    operationalNote: `Container temperature ${result.temperature}°C EXCEEDS safe threshold of ${result.threshold}°C. Immediate intervention required. Alert ${alertResult.alertId} dispatched to port operations.`,
                    extraFields: [
                        { label: "Container ID", value: result.id },
                        { label: "Contents", value: result.contents },
                        { label: "Location", value: result.location },
                        { label: "Temperature", value: `${result.temperature}°C` },
                        { label: "Safe Threshold", value: `${result.threshold}°C` },
                        { label: "Status", value: "🔴 HIGH RISK — BREACH DETECTED" },
                        { label: "Alert ID", value: alertResult.alertId },
                    ],
                },
                freeText: null,
                riskLevel: "CRITICAL",
            };
        }

        return {
            thinking,
            toolCalls,
            structured: {
                riskLevel: "LOW",
                operationalNote: "Container operating within safe thermal parameters. No action required.",
                extraFields: [
                    { label: "Container ID", value: result.id },
                    { label: "Contents", value: result.contents },
                    { label: "Location", value: result.location },
                    { label: "Temperature", value: `${result.temperature}°C` },
                    { label: "Safe Threshold", value: `${result.threshold}°C` },
                    { label: "Status", value: "✅ NOMINAL" },
                ],
            },
            freeText: null,
            riskLevel: "LOW",
        };
    }

    // ── Dock Status ─────────────────────────────────────────────────────────
    if (parsed.intent === "dock_status" && parsed.dockNumber != null) {
        thinking.push(`Dock ${parsed.dockNumber} query detected`);
        thinking.push("Calling getDockOccupancy() for real-time berth data...");

        const result = getDockOccupancy(parsed.dockNumber);
        toolCalls.push({ name: "getDockOccupancy", args: { dock_number: String(parsed.dockNumber) }, result });

        if (!result) {
            return {
                thinking,
                toolCalls,
                structured: null,
                freeText: `⚠️ Dock ${parsed.dockNumber} is not in the system. Valid docks: 1–10.`,
                riskLevel: null,
            };
        }

        thinking.push(`Occupancy: ${result.occupancy}%. Status: ${result.status}`);

        const riskLevel =
            result.occupancy >= 100
                ? "CRITICAL"
                : result.occupancy >= 88
                    ? "HIGH"
                    : result.occupancy >= 70
                        ? "MEDIUM"
                        : "LOW";

        const note =
            result.status === "FULL"
                ? `Dock ${parsed.dockNumber} is at FULL capacity. Incoming vessels must be rerouted to Dock 5 or Dock 10 immediately.`
                : result.status === "NEAR CAPACITY"
                    ? `Dock ${parsed.dockNumber} approaching saturation at ${result.occupancy}%. Recommend proactive rerouting of next 2 queued vessels.`
                    : `Dock ${parsed.dockNumber} operating normally. ${5 - result.vessels} berth slots available for incoming vessels.`;

        return {
            thinking,
            toolCalls,
            structured: {
                dock: `Dock ${parsed.dockNumber}`,
                riskLevel: riskLevel as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                operationalNote: note,
                extraFields: [
                    { label: "Occupancy", value: `${result.occupancy}%` },
                    { label: "Active Vessels", value: String(result.vessels) },
                    { label: "Queued Vessels", value: String(result.queued) },
                    { label: "Avg. Turnaround", value: `${result.turnaround} hrs` },
                    { label: "Operational Status", value: result.status },
                ],
            },
            freeText: null,
            riskLevel: riskLevel as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        };
    }

    // ── Ship Location ────────────────────────────────────────────────────────
    if (parsed.intent === "ship_location" && parsed.shipName) {
        thinking.push(`Ship name detected: ${parsed.shipName}`);
        thinking.push("Calling getShipLocation() for live AIS data...");

        const result = getShipLocation(parsed.shipName);
        toolCalls.push({ name: "getShipLocation", args: { ship_name: parsed.shipName }, result });

        if (!result) {
            return {
                thinking,
                toolCalls,
                structured: null,
                freeText: `⚠️ Vessel not found. Available vessels: MV Atlantic Crown, SS Pacific Voyager, MV Nordic Star.`,
                riskLevel: null,
            };
        }

        return {
            thinking,
            toolCalls,
            structured: {
                vessel: result.name,
                currentLocation: `${result.lat.toFixed(2)}°N, ${Math.abs(result.lng).toFixed(2)}°${result.lng < 0 ? "W" : "E"}`,
                riskLevel: result.status === "Delayed" ? "MEDIUM" : "LOW",
                operationalNote:
                    result.status === "Delayed"
                        ? `${result.name} is currently DELAYED. Low speed of ${result.speed} detected — likely weather-induced drag or route deviation. Monitor continuously.`
                        : `${result.name} is operating normally at ${result.speed}. No corrective action required.`,
                extraFields: [
                    { label: "Vessel ID", value: result.id },
                    { label: "Speed", value: result.speed },
                    { label: "Heading", value: `${result.heading}°` },
                    { label: "Cargo", value: result.cargo },
                    { label: "Origin", value: result.origin },
                    { label: "Destination", value: result.destination },
                    { label: "Status", value: result.status },
                ],
            },
            freeText: null,
            riskLevel: result.status === "Delayed" ? "MEDIUM" : "LOW",
        };
    }

    // ── Weather Impact ───────────────────────────────────────────────────────
    if (parsed.intent === "weather") {
        const portToCheck = parsed.portName ?? "port of singapore";
        thinking.push(`Weather query detected for: ${portToCheck}`);
        thinking.push("Calling getWeatherImpact() for current maritime conditions...");

        const result = getWeatherImpact(portToCheck);
        toolCalls.push({ name: "getWeatherImpact", args: { port_name: portToCheck }, result });

        const riskLevel =
            result.impactLevel === "HIGH"
                ? "HIGH"
                : result.impactLevel === "MODERATE"
                    ? "MEDIUM"
                    : "LOW";

        return {
            thinking,
            toolCalls,
            structured: {
                riskLevel: riskLevel as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                operationalNote:
                    result.impactLevel === "HIGH"
                        ? `Storm conditions at ${portToCheck}. Expected delay: +${result.delayEstimate} hours. Issue advisory to all vessels within 200nm radius.`
                        : result.impactLevel === "MODERATE"
                            ? `Moderate weather impact at ${portToCheck}. Minor delays of ~${result.delayEstimate} hours possible. Monitor vessel ETAs.`
                            : `Weather conditions favorable at ${portToCheck}. No operational impact expected.`,
                extraFields: [
                    { label: "Port", value: result.port },
                    { label: "Condition", value: result.condition },
                    { label: "Wind Speed", value: result.windSpeed },
                    { label: "Wave Height", value: result.waveHeight },
                    { label: "Visibility", value: result.visibility },
                    { label: "Impact Level", value: result.impactLevel },
                    { label: "Estimated Delay", value: result.delayEstimate > 0 ? `+${result.delayEstimate} hrs` : "None" },
                ],
            },
            freeText: null,
            riskLevel: riskLevel as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        };
    }

    // ── Delayed Shipments ────────────────────────────────────────────────────
    if (parsed.intent === "delays") {
        thinking.push("Scanning all active shipments for delay indicators...");

        const delayed = Object.values(shipmentLookup).filter((s) => s.delay > 0);
        toolCalls.push({
            name: "getShipmentStatus",
            args: { shipment_id: "ALL_DELAYED" },
            result: delayed,
        });

        thinking.push(`Found ${delayed.length} delayed shipments. Analyzing severity...`);

        const mostCritical = delayed.sort((a, b) => b.delay - a.delay)[0];

        return {
            thinking,
            toolCalls,
            structured: null,
            freeText: `**🚨 Delayed Shipments Report (${delayed.length} active)**\n\n${delayed
                .map(
                    (s) =>
                        `• **${s.id}** on ${s.vessel} — **+${s.delay} hrs** delay | Risk: ${s.risk} | ${s.location}`
                )
                .join("\n")}\n\n**Most Critical:** ${mostCritical.id} on ${mostCritical.vessel} (+${mostCritical.delay} hrs). Notify downstream facilities immediately.`,
            riskLevel: "HIGH",
        };
    }

    // ── Alerts ────────────────────────────────────────────────────────────────
    if (parsed.intent === "alerts") {
        thinking.push("Querying active alert registry...");

        const criticalAlerts = alerts.filter((a) => a.severity === "critical");
        const warningAlerts = alerts.filter((a) => a.severity === "warning");

        toolCalls.push({
            name: "triggerAlert",
            args: { alert_type: "status_check", entity_id: "PORT_SYSTEM" },
            result: { criticalCount: criticalAlerts.length, warningCount: warningAlerts.length },
        });

        return {
            thinking,
            toolCalls,
            structured: null,
            freeText: `**🔔 Active Port Alerts**\n\n**Critical (${criticalAlerts.length}):**\n${criticalAlerts
                .map((a) => `• ${a.title} — ${a.message} (${a.time})`)
                .join("\n")}\n\n**Warnings (${warningAlerts.length}):**\n${warningAlerts
                    .map((a) => `• ${a.title} — ${a.message} (${a.time})`)
                    .join("\n")}`,
            riskLevel: criticalAlerts.length > 2 ? "CRITICAL" : "HIGH",
        };
    }

    // ── Fleet Overview ────────────────────────────────────────────────────────
    if (parsed.intent === "fleet_overview") {
        thinking.push("Fetching fleet-wide AIS data for all active vessels...");

        ships.forEach((ship) => {
            toolCalls.push({ name: "getShipLocation", args: { ship_name: ship.name }, result: ship });
        });

        const delayed = ships.filter((s) => s.status === "Delayed");

        return {
            thinking,
            toolCalls,
            structured: null,
            freeText: `**🚢 Fleet Status Overview (${ships.length} vessels)**\n\n${ships
                .map(
                    (s) =>
                        `• **${s.name}** (${s.id}) — ${s.status === "Delayed" ? "🔴 DELAYED" : "🟢 ON-TIME"} | ${s.speed} | ${s.cargo} | ETA: ${s.eta}`
                )
                .join("\n")}\n\n${delayed.length > 0 ? `⚠️ ${delayed.length} vessel(s) delayed — initiate downstream logistics adjustment.` : "✅ All vessels operating on schedule."}`,
            riskLevel: delayed.length > 0 ? "MEDIUM" : "LOW",
        };
    }

    // ── Congestion ────────────────────────────────────────────────────────────
    if (parsed.intent === "congestion") {
        thinking.push("Scanning all dock occupancy levels for congestion analysis...");

        const allDocks = Object.entries(dockDatabase).map(([num, data]) => ({
            dockNumber: parseInt(num),
            ...data,
        }));
        toolCalls.push({ name: "getDockOccupancy", args: { dock_number: "ALL" }, result: allDocks });

        const overloaded = allDocks.filter((d) => d.occupancy >= 85);

        return {
            thinking,
            toolCalls,
            structured: null,
            freeText: `**⚓ Port Congestion Analysis**\n\n${allDocks
                .map(
                    (d) =>
                        `• **Dock ${d.dockNumber}** — ${d.occupancy}% [${d.status}] | ${d.vessels} vessels | Turnaround: ${d.turnaround} hrs`
                )
                .join("\n")}\n\n${overloaded.length > 0 ? `🔴 **${overloaded.length} dock(s) near/at capacity:** ${overloaded.map((d) => `Dock ${d.dockNumber}`).join(", ")}. Recommend traffic redistribution to Docks 1, 5, and 10.` : "✅ All docks operating within normal parameters."}`,
            riskLevel: overloaded.some((d) => d.occupancy >= 100) ? "CRITICAL" : overloaded.length > 0 ? "HIGH" : "LOW",
        };
    }

    // ── Help ──────────────────────────────────────────────────────────────────
    if (parsed.intent === "help") {
        return {
            thinking: ["Help command detected — displaying capability manifest"],
            toolCalls: [],
            structured: null,
            freeText: `**PORT-AI Capability Manifest**\n\nI can assist with the following operations:\n\n🔍 **Shipment Tracking** — \`Track SHP-20931\`\n📦 **Container Monitoring** — \`Status of CNTR-44573\`\n⚓ **Dock Occupancy** — \`Dock 7 status\`\n🚢 **Vessel Location** — \`Where is MV Atlantic Crown?\`\n⏱️ **Delay Prediction** — \`Predict delay for SHP-40127\`\n🌀 **Weather Impact** — \`Weather at Rotterdam\`\n🚨 **Alert Management** — \`Show active alerts\`\n🌐 **Fleet Overview** — \`Show all ships\`\n📊 **Congestion Analysis** — \`Port congestion levels\``,
            riskLevel: null,
        };
    }

    // ── Default / General ──────────────────────────────────────────────────────
    thinking.push("Query classified as general — providing contextual response");
    return {
        thinking,
        toolCalls: [],
        structured: null,
        freeText: `I'm PORT-AI, your intelligent port operations agent. I didn't recognize a specific data entity in your query.\n\nPlease provide a **Shipment ID** (SHP-XXXXX), **Container ID** (CNTR-XXXXX), or **dock number** for precise analysis.\n\nType \`help\` to see all available commands.`,
        riskLevel: null,
    };
}
