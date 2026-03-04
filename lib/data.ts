// Realistic mock data for AI Smart Port

export const ships = [
  {
    id: "VSL-2847",
    name: "MV Atlantic Crown",
    origin: "Rotterdam, Netherlands",
    destination: "Port of Singapore",
    eta: "2026-03-05 14:30",
    speed: "18.2 knots",
    status: "On-Time" as const,
    lat: 12.5,
    lng: 52.3,
    cargo: "4,200 TEU",
    heading: 145,
  },
  {
    id: "VSL-1093",
    name: "SS Pacific Voyager",
    origin: "Shanghai, China",
    destination: "Los Angeles, USA",
    eta: "2026-03-08 09:15",
    speed: "14.8 knots",
    status: "Delayed" as const,
    lat: 32.1,
    lng: -165.4,
    cargo: "6,800 TEU",
    heading: 78,
  },
  {
    id: "VSL-5521",
    name: "MV Nordic Star",
    origin: "Hamburg, Germany",
    destination: "Mumbai, India",
    eta: "2026-03-06 22:00",
    speed: "16.5 knots",
    status: "On-Time" as const,
    lat: 22.8,
    lng: 58.7,
    cargo: "3,150 TEU",
    heading: 112,
  },
];

export const containers = [
  {
    id: "CNTR-88241",
    temperature: 2.1,
    location: "Yard Block A-12",
    status: "Active",
    riskAlert: false,
    threshold: 5,
    contents: "Frozen Seafood",
  },
  {
    id: "CNTR-44573",
    temperature: 28.4,
    location: "Dock 7 - Bay 3",
    status: "Alert",
    riskAlert: true,
    threshold: 25,
    contents: "Pharmaceuticals",
  },
  {
    id: "CNTR-91035",
    temperature: -18.2,
    location: "Reefer Zone C",
    status: "Active",
    riskAlert: false,
    threshold: -15,
    contents: "Ice Cream",
  },
  {
    id: "CNTR-67294",
    temperature: 22.0,
    location: "Yard Block D-05",
    status: "Idle",
    riskAlert: false,
    threshold: 30,
    contents: "Electronics",
  },
  {
    id: "CNTR-33817",
    temperature: 31.7,
    location: "Dock 2 - Bay 1",
    status: "Alert",
    riskAlert: true,
    threshold: 25,
    contents: "Chemical Reagents",
  },
  {
    id: "CNTR-72940",
    temperature: 4.5,
    location: "Reefer Zone A",
    status: "Active",
    riskAlert: false,
    threshold: 8,
    contents: "Fresh Produce",
  },
];

export const alerts = [
  {
    id: 1,
    type: "idle" as const,
    title: "Container Idle Alert",
    message: "CNTR-67294 has been idle for 8.5 hours at Yard Block D-05",
    severity: "warning" as const,
    time: "12 min ago",
  },
  {
    id: 2,
    type: "temperature" as const,
    title: "Temperature Breach",
    message: "CNTR-44573 temperature at 28.4°C exceeds threshold of 25°C",
    severity: "critical" as const,
    time: "23 min ago",
  },
  {
    id: 3,
    type: "dock" as const,
    title: "Dock Overload Warning",
    message: "Dock 7 operating at 94% capacity. Reroute advised.",
    severity: "warning" as const,
    time: "45 min ago",
  },
  {
    id: 4,
    type: "route" as const,
    title: "Ship Route Deviation",
    message: "SS Pacific Voyager deviated 12nm from planned route near Pacific corridor",
    severity: "critical" as const,
    time: "1 hr ago",
  },
  {
    id: 5,
    type: "temperature" as const,
    title: "Temperature Breach",
    message: "CNTR-33817 temperature at 31.7°C exceeds threshold of 25°C",
    severity: "critical" as const,
    time: "2 hrs ago",
  },
];

export const congestionData = [
  { time: "00:00", occupancy: 62 },
  { time: "02:00", occupancy: 58 },
  { time: "04:00", occupancy: 55 },
  { time: "06:00", occupancy: 67 },
  { time: "08:00", occupancy: 78 },
  { time: "10:00", occupancy: 85 },
  { time: "12:00", occupancy: 91 },
  { time: "14:00", occupancy: 88 },
  { time: "16:00", occupancy: 82 },
  { time: "18:00", occupancy: 76 },
  { time: "20:00", occupancy: 70 },
  { time: "22:00", occupancy: 65 },
];

export const shipmentLookup: Record<string, {
  id: string;
  location: string;
  dock: string;
  eta: string;
  risk: "Low" | "Medium" | "High";
  delay: number;
  vessel: string;
  origin: string;
}> = {
  "SHP-20931": {
    id: "SHP-20931",
    location: "Dock 4 - Berth B",
    dock: "Dock 4",
    eta: "2026-03-04 10:00",
    risk: "Low",
    delay: 0,
    vessel: "MV Atlantic Crown",
    origin: "Rotterdam, Netherlands",
  },
  "SHP-40127": {
    id: "SHP-40127",
    location: "En Route - Pacific Ocean",
    dock: "Dock 9 (Assigned)",
    eta: "2026-03-08 09:15",
    risk: "High",
    delay: 14,
    vessel: "SS Pacific Voyager",
    origin: "Shanghai, China",
  },
  "SHP-71583": {
    id: "SHP-71583",
    location: "Arabian Sea - 450nm from port",
    dock: "Dock 2 (Assigned)",
    eta: "2026-03-06 22:00",
    risk: "Medium",
    delay: 3,
    vessel: "MV Nordic Star",
    origin: "Hamburg, Germany",
  },
};

export const analyticsMetrics = {
  totalShips: 47,
  totalContainers: 12840,
  delayedShipments: 8,
  onTimeRate: 89.4,
  costSavings: 2.4,
  avgTurnaround: 18.6,
};

export const dailyThroughput = [
  { day: "Mon", containers: 1840, ships: 7 },
  { day: "Tue", containers: 2100, ships: 9 },
  { day: "Wed", containers: 1950, ships: 8 },
  { day: "Thu", containers: 2300, ships: 11 },
  { day: "Fri", containers: 2580, ships: 12 },
  { day: "Sat", containers: 1600, ships: 6 },
  { day: "Sun", containers: 1200, ships: 4 },
];

export const delayDistribution = [
  { range: "0-2 hrs", count: 28 },
  { range: "2-6 hrs", count: 12 },
  { range: "6-12 hrs", count: 5 },
  { range: "12-24 hrs", count: 2 },
  { range: "24+ hrs", count: 1 },
];
