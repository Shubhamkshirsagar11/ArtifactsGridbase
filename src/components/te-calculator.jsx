import { useState, useMemo, useRef, useEffect, useCallback } from "react";

const NON_UNION_CLASSIFICATIONS = [
  "DIST-Foreman","DIST-Apprentice A","DIST-Apprentice B","DIST-General Foreman",
  "DIST-Groundman Dist Trans","DIST-Lineman A","DIST-Lineman B","DIST-Lineman C",
  "DIST-Operations Manager","DIST-Operator","FS-Driver","DD-Coordinator",
  "DD-Equipment Operator","TMN-Equipment Operator","TMN-Foreman",
  "TMN-Groundman Dist Trans","TMN-Lineman A","TMN-Lineman B","TMN-Lineman C",
  "TMN-General Foreman","TMN-Apprentice 1","TMN-Apprentice 2","TMN-Apprentice 7",
  "TMN-Apprentice B","UG-Coordinator","UG-Apprentice A","UG-Equipment Operator",
  "UG-Foreman","UG-Groundman Dist Trans","UG-Underground General Fore",
  "UG-Underground Groundman","UG-Underground Lineman A","UG-Underground Operator",
  "UG-Underground Lineman B","UG-Fiber Splicer","VV-Coordinator","VV-Driver",
  "VV-General Foreman","VV-Groundman Veg only","VV-Lineman C","VV-Safety Specialist",
  "VV-Trimmer Operator","VV-Trimmer Operator A","VV-Trimmer Operator B",
  "VV-Trimmer Operator C","VV-Vegetation Foreman"
];

const NON_UNION_DEFAULT_WAGES = {
  "DIST-Foreman": 42.50, "DIST-Apprentice A": 22.00, "DIST-Apprentice B": 18.50,
  "DIST-General Foreman": 48.00, "DIST-Groundman Dist Trans": 24.00,
  "DIST-Lineman A": 38.50, "DIST-Lineman B": 34.00, "DIST-Lineman C": 30.00,
  "DIST-Operations Manager": 55.00, "DIST-Operator": 36.00,
  "FS-Driver": 26.00, "DD-Coordinator": 32.00, "DD-Equipment Operator": 34.50,
  "TMN-Equipment Operator": 36.50, "TMN-Foreman": 44.00,
  "TMN-Groundman Dist Trans": 25.00, "TMN-Lineman A": 40.00,
  "TMN-Lineman B": 35.50, "TMN-Lineman C": 31.50, "TMN-General Foreman": 50.00,
  "TMN-Apprentice 1": 20.00, "TMN-Apprentice 2": 22.50, "TMN-Apprentice 7": 28.00,
  "TMN-Apprentice B": 19.50, "UG-Coordinator": 33.00, "UG-Apprentice A": 21.50,
  "UG-Equipment Operator": 35.00, "UG-Foreman": 43.50,
  "UG-Groundman Dist Trans": 24.50, "UG-Underground General Fore": 49.00,
  "UG-Underground Groundman": 23.00, "UG-Underground Lineman A": 39.50,
  "UG-Underground Operator": 36.00, "UG-Underground Lineman B": 34.50,
  "UG-Fiber Splicer": 41.00, "VV-Coordinator": 30.00, "VV-Driver": 24.00,
  "VV-General Foreman": 44.50, "VV-Groundman Veg only": 20.00,
  "VV-Lineman C": 29.00, "VV-Safety Specialist": 33.50,
  "VV-Trimmer Operator": 27.00, "VV-Trimmer Operator A": 28.50,
  "VV-Trimmer Operator B": 26.00, "VV-Trimmer Operator C": 24.50,
  "VV-Vegetation Foreman": 38.00
};

// Union Locals — Pay Scale and Benefits data
const UNION_PAY_SCALE_LOCALS = {
  "IBEW Local 1 - St. Louis": {
    classifications: {
      "Foreman": { st: 65.42, ot: 98.13 },
      "General Foreman": { st: 70.85, ot: 106.28 },
      "Journeyman Lineman": { st: 57.88, ot: 86.82 },
      "Apprentice 1st Year": { st: 28.94, ot: 43.41 },
      "Apprentice 2nd Year": { st: 34.73, ot: 52.09 },
      "Apprentice 3rd Year": { st: 40.52, ot: 60.77 },
      "Apprentice 4th Year": { st: 46.30, ot: 69.46 },
      "Operator": { st: 52.10, ot: 78.15 },
      "Groundman": { st: 35.20, ot: 52.80 },
      "Cable Splicer": { st: 61.92, ot: 92.88 },
      "Technician": { st: 48.50, ot: 72.75 },
    }
  },
  "IBEW Local 134 - Chicago": {
    classifications: {
      "Foreman": { st: 72.15, ot: 108.23 },
      "General Foreman": { st: 78.30, ot: 117.45 },
      "Journeyman Lineman": { st: 63.50, ot: 95.25 },
      "Apprentice 1st Year": { st: 31.75, ot: 47.63 },
      "Apprentice 2nd Year": { st: 38.10, ot: 57.15 },
      "Apprentice 3rd Year": { st: 44.45, ot: 66.68 },
      "Apprentice 4th Year": { st: 50.80, ot: 76.20 },
      "Operator": { st: 56.90, ot: 85.35 },
      "Groundman": { st: 38.40, ot: 57.60 },
      "Cable Splicer": { st: 68.10, ot: 102.15 },
      "Technician": { st: 53.20, ot: 79.80 },
    }
  },
  "IBEW Local 3 - New York": {
    classifications: {
      "Foreman": { st: 78.90, ot: 118.35 },
      "General Foreman": { st: 85.60, ot: 128.40 },
      "Journeyman Lineman": { st: 69.40, ot: 104.10 },
      "Apprentice 1st Year": { st: 34.70, ot: 52.05 },
      "Apprentice 2nd Year": { st: 41.64, ot: 62.46 },
      "Apprentice 3rd Year": { st: 48.58, ot: 72.87 },
      "Apprentice 4th Year": { st: 55.52, ot: 83.28 },
      "Operator": { st: 62.30, ot: 93.45 },
      "Groundman": { st: 42.10, ot: 63.15 },
      "Cable Splicer": { st: 74.50, ot: 111.75 },
      "Technician": { st: 58.00, ot: 87.00 },
    }
  },
  "IBEW Local 47 - Southern California": {
    classifications: {
      "Foreman": { st: 74.50, ot: 111.75 },
      "General Foreman": { st: 80.75, ot: 121.13 },
      "Journeyman Lineman": { st: 65.65, ot: 98.48 },
      "Apprentice 1st Year": { st: 32.83, ot: 49.24 },
      "Apprentice 2nd Year": { st: 39.39, ot: 59.09 },
      "Apprentice 3rd Year": { st: 45.96, ot: 68.93 },
      "Apprentice 4th Year": { st: 52.52, ot: 78.78 },
      "Operator": { st: 58.80, ot: 88.20 },
      "Groundman": { st: 39.70, ot: 59.55 },
      "Cable Splicer": { st: 70.20, ot: 105.30 },
      "Technician": { st: 54.80, ot: 82.20 },
    }
  },
  "IBEW Local 666 - Richmond": {
    classifications: {
      "Foreman": { st: 61.92, ot: 92.88 },
      "General Foreman": { st: 67.10, ot: 100.65 },
      "Journeyman Lineman": { st: 54.50, ot: 81.75 },
      "Apprentice 1st Year": { st: 27.25, ot: 40.88 },
      "Apprentice 2nd Year": { st: 32.70, ot: 49.05 },
      "Apprentice 3rd Year": { st: 38.15, ot: 57.23 },
      "Apprentice 4th Year": { st: 43.60, ot: 65.40 },
      "Operator": { st: 49.10, ot: 73.65 },
      "Groundman": { st: 33.10, ot: 49.65 },
      "Cable Splicer": { st: 58.40, ot: 87.60 },
      "Technician": { st: 45.60, ot: 68.40 },
    }
  }
};

const UNION_BENEFITS_LOCALS = {
  "IBEW Local 1 - St. Louis": {
    "Foreman": 31.68, "General Foreman": 31.68, "Journeyman Lineman": 30.12,
    "Apprentice 1st Year": 15.06, "Apprentice 2nd Year": 18.07, "Apprentice 3rd Year": 21.08,
    "Apprentice 4th Year": 24.10, "Operator": 27.50, "Groundman": 18.20,
    "Cable Splicer": 30.12, "Technician": 25.40
  },
  "IBEW Local 134 - Chicago": {
    "Foreman": 35.20, "General Foreman": 35.20, "Journeyman Lineman": 33.45,
    "Apprentice 1st Year": 16.73, "Apprentice 2nd Year": 20.07, "Apprentice 3rd Year": 23.42,
    "Apprentice 4th Year": 26.76, "Operator": 30.10, "Groundman": 20.20,
    "Cable Splicer": 33.45, "Technician": 28.00
  },
  "IBEW Local 3 - New York": {
    "Foreman": 42.50, "General Foreman": 42.50, "Journeyman Lineman": 40.35,
    "Apprentice 1st Year": 20.18, "Apprentice 2nd Year": 24.21, "Apprentice 3rd Year": 28.25,
    "Apprentice 4th Year": 32.28, "Operator": 36.20, "Groundman": 24.40,
    "Cable Splicer": 40.35, "Technician": 33.80
  },
  "IBEW Local 47 - Southern California": {
    "Foreman": 38.60, "General Foreman": 38.60, "Journeyman Lineman": 36.70,
    "Apprentice 1st Year": 18.35, "Apprentice 2nd Year": 22.02, "Apprentice 3rd Year": 25.69,
    "Apprentice 4th Year": 29.36, "Operator": 33.00, "Groundman": 22.20,
    "Cable Splicer": 36.70, "Technician": 30.60
  },
  "IBEW Local 666 - Richmond": {
    "Foreman": 29.40, "General Foreman": 29.40, "Journeyman Lineman": 27.95,
    "Apprentice 1st Year": 13.98, "Apprentice 2nd Year": 16.77, "Apprentice 3rd Year": 19.57,
    "Apprentice 4th Year": 22.36, "Operator": 25.50, "Groundman": 16.90,
    "Cable Splicer": 27.95, "Technician": 23.50
  }
};

const UNION_LOCAL_NAMES = Object.keys(UNION_PAY_SCALE_LOCALS);

const UTILITIES = [
  "AEP (American Electric Power)", "Alabama Power", "Ameren", "Austin Energy",
  "Baltimore Gas & Electric (BGE)", "CenterPoint Energy", "ComEd", "Con Edison",
  "Consumers Energy", "Dominion Energy", "DTE Energy", "Duke Energy",
  "Entergy", "Eversource Energy", "FirstEnergy", "Florida Power & Light (FPL)",
  "Georgia Power", "Gulf Power", "Idaho Power", "Indiana Michigan Power",
  "Kansas City Power & Light", "Kentucky Utilities", "Louisville Gas & Electric",
  "MidAmerican Energy", "National Grid", "NextEra Energy", "Oncor",
  "Pacific Gas & Electric (PG&E)", "PECO Energy", "Pepco", "Portland General Electric",
  "PPL Electric", "PSE&G", "Puget Sound Energy", "Rochester Gas & Electric",
  "San Diego Gas & Electric (SDG&E)", "Southern California Edison (SCE)",
  "Tampa Electric (TECO)", "Tennessee Valley Authority (TVA)",
  "Tucson Electric Power", "Xcel Energy"
];

const US_STATES = [
  "Alabama (AL)","Alaska (AK)","Arizona (AZ)","Arkansas (AR)","California (CA)",
  "Colorado (CO)","Connecticut (CT)","Delaware (DE)","Florida (FL)","Georgia (GA)",
  "Hawaii (HI)","Idaho (ID)","Illinois (IL)","Indiana (IN)","Iowa (IA)","Kansas (KS)",
  "Kentucky (KY)","Louisiana (LA)","Maine (ME)","Maryland (MD)","Massachusetts (MA)",
  "Michigan (MI)","Minnesota (MN)","Mississippi (MS)","Missouri (MO)","Montana (MT)",
  "Nebraska (NE)","Nevada (NV)","New Hampshire (NH)","New Jersey (NJ)","New Mexico (NM)",
  "New York (NY)","North Carolina (NC)","North Dakota (ND)","Ohio (OH)","Oklahoma (OK)",
  "Oregon (OR)","Pennsylvania (PA)","Rhode Island (RI)","South Carolina (SC)",
  "South Dakota (SD)","Tennessee (TN)","Texas (TX)","Utah (UT)","Vermont (VT)",
  "Virginia (VA)","Washington (WA)","West Virginia (WV)","Wisconsin (WI)","Wyoming (WY)"
];

const SERVICE_TYPES = ["Street Lighting","Distribution","Transmission","Underground","Vegetation Management","Fiber/Telecom","Substation","Storm Response"];
const BUSINESS_UNITS = ["PGS Distribution","PGS Transmission","PGS Underground","PGS Vegetation","PGS Fiber"];

const EQUIPMENT_INTERNAL_RATES = {
  "ATV": { id: "ATV", unitCost: 1.16, fuelCost: 0.85 },
  "Bulldozer": { id: "BDOZ", unitCost: 14.18, fuelCost: 12.50 },
  "Bucket Truck - 105'": { id: "BK105", unitCost: 35.00, fuelCost: 8.75 },
  "Bucket Truck - 125'": { id: "BK125", unitCost: 54.74, fuelCost: 9.50 },
  "Bucket Truck - 55' 2WD": { id: "BK552", unitCost: 15.71, fuelCost: 7.25 },
  "Bucket Truck - 55' 4WD": { id: "BK554", unitCost: 16.32, fuelCost: 7.50 },
  "Bucket Truck - 66' 2WD": { id: "BK662", unitCost: 13.25, fuelCost: 7.75 },
  "Bucket Truck - 77' 2WD": { id: "BK772", unitCost: 16.84, fuelCost: 8.25 },
  "Bucket Chipper Body": { id: "BKCB2", unitCost: 11.89, fuelCost: 6.50 },
  "Backhoe": { id: "BKHOE", unitCost: 10.57, fuelCost: 8.75 },
  "Tree Bucket - 2WD": { id: "BKTB2", unitCost: 16.28, fuelCost: 7.00 },
  "Tree Bucket - 24D": { id: "BKTB4", unitCost: 15.41, fuelCost: 7.25 },
  "Boat": { id: "BOAT", unitCost: 0.41, fuelCost: 3.50 },
  "Boring Machine": { id: "BORE", unitCost: 42.96, fuelCost: 14.00 },
  "Backyard Machine": { id: "BYARD", unitCost: 19.71, fuelCost: 6.25 },
  "Chipper": { id: "CHIP0", unitCost: 4.82, fuelCost: 4.50 },
  "Chip Dump Truck": { id: "CHPDMP", unitCost: 9.10, fuelCost: 7.50 },
  "Command Center": { id: "COMMAND", unitCost: 7.06, fuelCost: 2.00 },
  "Air Compressor": { id: "COMP", unitCost: 5.33, fuelCost: 3.75 },
  "Crane Truck": { id: "CRN2", unitCost: 41.00, fuelCost: 11.50 },
  "Digger Truck - 2WD": { id: "DGT2", unitCost: 16.90, fuelCost: 8.00 },
  "Digger Truck - 4WD": { id: "DGT4", unitCost: 22.01, fuelCost: 8.50 },
  "Digger Truck - 6WD": { id: "DGT6", unitCost: 29.38, fuelCost: 9.25 },
  "Drill Rig Transmission": { id: "DLRG", unitCost: 3.80, fuelCost: 10.00 },
  "Drill Rig Substation": { id: "DRGS", unitCost: 105.42, fuelCost: 18.00 },
  "Drill Rig Substation 2": { id: "DRGS1", unitCost: 96.75, fuelCost: 16.50 },
  "Dump Truck": { id: "DT6", unitCost: 7.34, fuelCost: 8.00 },
  "Flatbed 2-4Ton Mat'l Truck": { id: "FBMT", unitCost: 4.22, fuelCost: 6.75 },
  "Whse Forklift": { id: "FKLT", unitCost: 3.56, fuelCost: 2.50 },
  "Const Forklift": { id: "FLFT", unitCost: 23.88, fuelCost: 5.50 },
  "FORESTRY MULCHER": { id: "FMUL", unitCost: 20.87, fuelCost: 11.00 },
  "Bush Hog": { id: "GDSK", unitCost: 0.68, fuelCost: 3.25 },
  "Harley Rake": { id: "HRAKE", unitCost: 0.65, fuelCost: 0.00 },
  "Jaraff": { id: "JAR4", unitCost: 19.38, fuelCost: 8.50 },
  "Job Box": { id: "JBOX", unitCost: 0.66, fuelCost: 0.00 },
  "Vibratory Hammer": { id: "JKRM", unitCost: 0.53, fuelCost: 2.00 },
  "Lawn Mower": { id: "LMOW", unitCost: 0.70, fuelCost: 1.50 },
  "Loader Truck": { id: "LOAD", unitCost: 23.65, fuelCost: 9.00 },
  "Mud Mixer": { id: "MDMX", unitCost: 1.84, fuelCost: 2.25 },
  "Mechanic Truck - 2WD": { id: "MEC2", unitCost: 13.27, fuelCost: 7.00 },
  "Mechanic Truck - 4WD": { id: "MEC4", unitCost: 11.94, fuelCost: 7.25 },
  "Mulching Head": { id: "MULC", unitCost: 6.64, fuelCost: 0.00 },
  "Marsh Master": { id: "MMSTR", unitCost: 5.97, fuelCost: 6.00 },
  "Mini Excavator": { id: "MXVT", unitCost: 10.74, fuelCost: 5.50 },
  "Pressure Digger - 2WD": { id: "PDG2", unitCost: 22.92, fuelCost: 9.50 },
  "Pressure Digger - 6WD": { id: "PDG6", unitCost: 40.77, fuelCost: 10.25 },
  "Puller": { id: "PULL", unitCost: 4.24, fuelCost: 4.00 },
  "Puller Transmission": { id: "PULLT", unitCost: 24.11, fuelCost: 12.00 },
  "Pickup - 1500": { id: "PUT1", unitCost: 9.01, fuelCost: 5.50 },
  "Pickup - 2500": { id: "PUT2", unitCost: 7.95, fuelCost: 5.75 },
  "Pickup - 3500": { id: "PUT3", unitCost: 7.71, fuelCost: 6.00 },
  "Pickup - 5500": { id: "PUT5", unitCost: 16.23, fuelCost: 6.75 },
  "Condux Split Reel": { id: "REEL", unitCost: 9.51, fuelCost: 3.00 },
  "Rock Rig": { id: "RKRG", unitCost: 20.12, fuelCost: 13.00 },
  "Road Tractor": { id: "RT6", unitCost: 12.50, fuelCost: 9.50 },
  "Skid Steer SM": { id: "MSKIS", unitCost: 3.82, fuelCost: 4.00 },
  "Skid Steer C": { id: "SKIC", unitCost: 5.23, fuelCost: 4.25 },
  "Skid Steer": { id: "SKIS", unitCost: 11.31, fuelCost: 4.50 },
  "Service Bucket": { id: "SRVBKT", unitCost: 18.00, fuelCost: 7.50 },
  "Service Trailer": { id: "SRVTR", unitCost: 1.52, fuelCost: 0.00 },
  "Stump Cutter": { id: "STMP", unitCost: 0.87, fuelCost: 2.75 },
  "Reel Stand": { id: "STND", unitCost: 4.16, fuelCost: 0.00 },
  "SUV": { id: "SUV", unitCost: 6.02, fuelCost: 5.25 },
  "Tracked Bucket": { id: "TBK55", unitCost: 53.95, fuelCost: 10.50 },
  "Tracked Digger": { id: "TDGT", unitCost: 37.66, fuelCost: 10.00 },
  "Tensioner": { id: "TENS", unitCost: 4.65, fuelCost: 4.50 },
  "Tensioner Transmission": { id: "TENT", unitCost: 19.65, fuelCost: 12.50 },
  "Dump Trailer": { id: "TRAD", unitCost: 0.96, fuelCost: 0.00 },
  "Enclosed Trailer": { id: "TRAE", unitCost: 0.98, fuelCost: 0.00 },
  "Travel Trailer": { id: "TRAT", unitCost: 0.97, fuelCost: 0.00 },
  "Fiber Trailer": { id: "TRAF", unitCost: 2.42, fuelCost: 0.00 },
  "Hauling Trailer": { id: "TRAH", unitCost: 3.00, fuelCost: 0.00 },
  "Lowboy Trailer": { id: "TRAL", unitCost: 4.84, fuelCost: 0.00 },
  "Material Trailer": { id: "TRAM", unitCost: 0.61, fuelCost: 0.00 },
  "Pole Trailer": { id: "TRAP", unitCost: 0.96, fuelCost: 0.00 },
  "Double Reel Trailer": { id: "TRAR", unitCost: 2.30, fuelCost: 0.00 },
  "Welding Trailer": { id: "TRAW", unitCost: 0.53, fuelCost: 2.00 },
  "Tractor": { id: "TRC", unitCost: 4.02, fuelCost: 5.00 },
  "Trencher": { id: "TREN", unitCost: 22.35, fuelCost: 8.50 },
  "Trencher, Track 80HP": { id: "TRN8", unitCost: 1.89, fuelCost: 7.00 },
  "Underground Truck": { id: "UGT2", unitCost: 4.84, fuelCost: 7.50 },
  "Vac Trailer": { id: "VACTR", unitCost: 12.36, fuelCost: 5.00 },
  "Wheel Loader w/Cab": { id: "WHLDR", unitCost: 35.00, fuelCost: 10.00 },
  "Excavator": { id: "XVAT", unitCost: 18.00, fuelCost: 9.50 }
};

const EQUIPMENT_LIST = Object.keys(EQUIPMENT_INTERNAL_RATES).sort();

const GUIDE_STEPS = [
  {
    id: "project",
    title: "Project Description",
    desc: "Define the project scope, utility, location, and schedule. The duration auto-calculates from your start and end dates. Working days and hours per week set the baseline for all cost projections."
  },
  {
    id: "schedule",
    title: "Work Schedule",
    desc: "Set the crew's daily hours and configure overtime rules. The OT threshold determines when overtime kicks in — hours beyond the weekly threshold are billed at the OT multiplier rate."
  },
  {
    id: "crew",
    title: "Crew & Equipment",
    desc: "Build your crews and assign equipment. Crew quantity multiplies the entire crew makeup. Equipment can be assigned a number of days to reflect partial-project usage."
  },
  {
    id: "rates",
    title: "Labor Rate Builder",
    desc: "Set the base pay rate for each classification and hour type. Workers' comp (0.92%), benefits (5.4%), and payroll taxes (8.18%) are auto-calculated into the loaded cost for billing rate purposes. These burden costs are broken out separately in the P&L."
  },
  {
    id: "perdiem",
    title: "Per Diem",
    desc: "If the project requires travel, enter per diem amounts here. Per diem is calculated per worker per day and factors into your total job cost but is typically a pass-through on T&E contracts."
  },
  {
    id: "equiprates",
    title: "Equipment Rate Builder",
    desc: "Equipment unit and fuel costs are pre-set based on internal rates. Adjust profit markup to set your billing rate. Toggle fuel inclusion on/off if fuel is billed separately to the customer."
  },
  {
    id: "revenue",
    title: "Bid Summary",
    desc: "Detailed breakdown of cost, revenue, profit, and margin by labor classification and equipment item. Review profitability at the line-item level before finalizing your bid."
  },
  {
    id: "pnl",
    title: "Project P&L",
    desc: "Projected profit & loss with full cost visibility. Direct costs (wages, per diem, equipment), labor burden (workers' comp, benefits, payroll taxes), and overhead (% of revenue, % of wages, weekly fixed costs) are broken out separately. Edit overhead assumptions via the sidebar card."
  }
];

function fmt(n) { return "$" + (n || 0).toFixed(2); }
function fmtK(n) {
  if (Math.abs(n) >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
  if (Math.abs(n) >= 1000) return "$" + (n / 1000).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}
function fmtWhole(n) { return "$" + Math.round(n || 0).toLocaleString(); }
function pct(n) { return (n * 100).toFixed(2) + "%"; }

function InfoIcon({ tooltip }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 4, cursor: "help" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#94a3b8" />
        <text x="7" y="10.5" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">i</text>
      </svg>
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", color: "#e2e8f0", padding: "8px 12px", borderRadius: 6,
          fontSize: 12, lineHeight: 1.4, width: 220, zIndex: 999, whiteSpace: "normal",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", pointerEvents: "none"
        }}>
          {tooltip}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            border: "5px solid transparent", borderTopColor: "#1e293b"
          }} />
        </div>
      )}
    </span>
  );
}

function SectionCard({ id, title, children, info, headerRight }) {
  return (
    <div id={id} style={{
      background: "#fff", borderRadius: 10, marginBottom: 24,
      border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px", background: "#f4f6f8", borderBottom: "1px solid #e2e8f0",
        borderRadius: "10px 10px 0 0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#334155", margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
          {info && <InfoIcon tooltip={info} />}
        </div>
        {headerRight}
      </div>
      <div style={{ padding: "24px 28px" }}>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{children}</div>;
}

function TextInput({ value, onChange, placeholder, disabled, prefix }) {
  return (
    <div style={{ position: "relative" }}>
      {prefix && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 }}>{prefix}</span>}
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
        style={{
          width: "100%", padding: prefix ? "9px 12px 9px 24px" : "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6,
          fontSize: 14, color: disabled ? "#94a3b8" : "#0f172a", background: disabled ? "#f8fafc" : "#fff",
          outline: "none", boxSizing: "border-box", transition: "border-color 0.15s"
        }}
        onFocus={e => e.target.style.borderColor = "#3b82f6"}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
      />
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6,
      fontSize: 14, color: value ? "#0f172a" : "#94a3b8", background: "#fff",
      outline: "none", cursor: "pointer", appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, boxSizing: "border-box"
    }}>
      <option value="" disabled>{placeholder || "Select"}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function DateInput({ value, onChange }) {
  return (
    <input type="date" value={value} onChange={e => onChange(e.target.value)} style={{
      width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6,
      fontSize: 14, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box"
    }} />
  );
}

function NumberInput({ value, onChange, prefix, suffix, min, max, step, disabled }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {prefix && <span style={{ position: "absolute", left: 12, color: "#94a3b8", fontSize: 14, zIndex: 1 }}>{prefix}</span>}
      <input
        type="number" value={value} min={min} max={max} step={step || 1} disabled={disabled}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{
          width: "100%", padding: prefix ? "9px 12px 9px 24px" : "9px 12px",
          paddingRight: suffix ? 44 : 12,
          border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14,
          color: disabled ? "#94a3b8" : "#0f172a", background: disabled ? "#f8fafc" : "#fff",
          outline: "none", boxSizing: "border-box"
        }}
        onFocus={e => e.target.style.borderColor = "#3b82f6"}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
      />
      {suffix && <span style={{ position: "absolute", right: 12, color: "#94a3b8", fontSize: 12 }}>{suffix}</span>}
    </div>
  );
}

export default function TECalculator() {
  const [activeStep, setActiveStep] = useState(0);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComment, setHistoryComment] = useState("");
  const [historyEntries, setHistoryEntries] = useState([
    { type: "system", text: "Bid created", user: "System", timestamp: new Date(2026, 1, 20, 9, 15) },
    { type: "system", text: "Draft saved — crew composition updated", user: "System", timestamp: new Date(2026, 1, 20, 10, 42) },
    { type: "comment", text: "Initial crew setup based on the RFP requirements. Using 2 crews with 5-man makeup per the customer's spec.", user: "Ben M.", timestamp: new Date(2026, 1, 20, 10, 45) },
    { type: "system", text: "Equipment composition updated — 4 items added", user: "System", timestamp: new Date(2026, 1, 21, 8, 30) },
    { type: "comment", text: "Added bucket trucks and digger per site survey. May need a second crane if Phase 2 starts early.", user: "Ben M.", timestamp: new Date(2026, 1, 21, 9, 12) },
    { type: "system", text: "Rate builder updated — markup adjusted to 18%", user: "System", timestamp: new Date(2026, 1, 22, 14, 5) },
    { type: "comment", text: "Bumped markup from 15% to 18% after reviewing competitor bids. Should still be competitive.", user: "Jake R.", timestamp: new Date(2026, 1, 22, 14, 8) },
    { type: "system", text: "Per diem configuration added — 5 days/wk", user: "System", timestamp: new Date(2026, 1, 23, 11, 20) },
    { type: "comment", text: "Customer confirmed per diem is billable as pass-through. Using $85/day for linemen, $65 for groundmen.", user: "Ben M.", timestamp: new Date(2026, 1, 23, 11, 25) },
    { type: "system", text: "Bid submitted for review", user: "System", timestamp: new Date(2026, 1, 24, 9, 0) },
  ]);
  const historyEndRef = useRef(null);
  const [showRateSheet, setShowRateSheet] = useState(false);
  const [laborCostExpanded, setLaborCostExpanded] = useState(false);
  const [equipCostExpanded, setEquipCostExpanded] = useState(false);
  const [burdenExpanded, setBurdenExpanded] = useState(false);
  const [ohRevExpanded, setOhRevExpanded] = useState(false);
  const [ohWeeklyExpanded, setOhWeeklyExpanded] = useState(false);
  const [showOverheadRef, setShowOverheadRef] = useState(false);

  // Overhead assumptions
  const [overhead, setOverhead] = useState({
    // % of Revenue
    generalOverhead: 12.0,
    glInsurance: 0,
    // Weekly fixed costs
    supplies: 85.50,
    telephone: 0,
    postage: 15.50,
    newHireUniform: 30.00,
    safety: 25.50,
    incidentRepairs: 13.50,
    tools: 132.50,
    otherJobCosts: 19.50,
    equipRepairsMaint: 625.00,
  });
  const setOH = useCallback((key, val) => setOverhead(prev => ({ ...prev, [key]: val })), []);
  const [showClassRef, setShowClassRef] = useState(false);
  const [showEquipRef, setShowEquipRef] = useState(false);
  const sectionRefs = useRef({});

  // Project Description
  const [bidName, setProjectName] = useState("");
  const [utility, setUtility] = useState("");
  const [locationState, setLocationState] = useState("Alabama (AL)");
  const [businessUnit, setBusinessUnit] = useState("PGS Distribution");
  const [serviceType, setServiceType] = useState("Street Lighting");
  const [startDate, setStartDate] = useState("2026-03-24");
  const [endDate, setEndDate] = useState("2027-03-23");
  const [projectScope, setProjectScope] = useState("");
  const [projectAssumptions, setProjectAssumptions] = useState("");
  const [projectDocs, setProjectDocs] = useState([]); // [{ name, size, file }]
  const fileInputRef = useRef(null);

  // Crew
  const [laborType, setLaborType] = useState("non-union");
  const [crews, setCrews] = useState([]);
  const [unionPayScaleLocal, setUnionPayScaleLocal] = useState("");
  const [unionBenefitsLocal, setUnionBenefitsLocal] = useState("");
  const [unionClassMap, setUnionClassMap] = useState({}); // { "DIST-Foreman": { payClass: "Foreman", benefitsClass: "Foreman" } }

  // Schedule
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(0);
  const [otThresholdEnabled, setOtThresholdEnabled] = useState(true);
  const [otThreshold, setOtThreshold] = useState(40);

  // Per Diem — per classification
  const [perDiemDays, setPerDiemDays] = useState(null);
  const [perDiemRates, setPerDiemRates] = useState({}); // keyed by classification: { amount, billable, billingAmount }

  // Rates — keyed by `${classification}-${hourType}`
  const [rates, setRates] = useState({});
  const [markups, setMarkups] = useState({});
  const [otMultiplier, setOtMultiplier] = useState(1.5);

  // Equipment
  const [equipment, setEquipment] = useState([]); // [{ name, quantity, durationDays, isExternal, billable }]
  const [addingEquip, setAddingEquip] = useState("");
  const [addingExternalName, setAddingExternalName] = useState("");
  const [equipMarkups, setEquipMarkups] = useState({}); // keyed by equipment name
  const [externalRates, setExternalRates] = useState({});
  const [rentalMarkupEnabled, setRentalMarkupEnabled] = useState(false);
  const [rentalMarkupPct, setRentalMarkupPct] = useState(10); // keyed by equipment name: { unitCost, fuelCost }

  const unionPayScaleData = laborType === "union" && unionPayScaleLocal ? UNION_PAY_SCALE_LOCALS[unionPayScaleLocal] : null;
  const unionBenefitsData = laborType === "union" && unionBenefitsLocal ? UNION_BENEFITS_LOCALS[unionBenefitsLocal] : null;
  const classifications = NON_UNION_CLASSIFICATIONS;
  const payScaleClasses = unionPayScaleData ? Object.keys(unionPayScaleData.classifications) : [];
  const benefitsClasses = unionBenefitsData ? Object.keys(unionBenefitsData) : [];
  const weeklyTotalHours = daysPerWeek * hoursPerDay;
  const weeklyStHours = otThresholdEnabled && weeklyTotalHours > otThreshold ? otThreshold : weeklyTotalHours;
  const weeklyOtHours = otThresholdEnabled ? Math.max(0, weeklyTotalHours - otThreshold) : 0;
  const stHours = daysPerWeek > 0 ? weeklyStHours / daysPerWeek : 0;
  const otHours = daysPerWeek > 0 ? weeklyOtHours / daysPerWeek : 0;
  const hasOT = otHours > 0;

  // Day-level OT breakdown (full ST days, possible split day, full OT days)
  const otDayBreakdown = useMemo(() => {
    if (!hasOT || hoursPerDay === 0) return null;
    const fullStDays = Math.floor(otThreshold / hoursPerDay);
    const remainderSt = otThreshold % hoursPerDay;
    const hasSplitDay = remainderSt > 0 && fullStDays < daysPerWeek;
    const fullOtDays = daysPerWeek - fullStDays - (hasSplitDay ? 1 : 0);
    return { fullStDays, remainderSt, hasSplitDay, splitOtHours: hasSplitDay ? hoursPerDay - remainderSt : 0, fullOtDays };
  }, [hasOT, hoursPerDay, otThreshold, daysPerWeek]);

  // Duration calcs
  const durationWeeks = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate), e = new Date(endDate);
    const diffMs = e - s;
    return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24 * 7) * 10) / 10);
  }, [startDate, endDate]);

  const durationWorkingDays = Math.round(durationWeeks * daysPerWeek);

  // Crew helpers
  const addCrew = useCallback(() => {
    setCrews(prev => [...prev, { name: `Crew ${prev.length + 1}`, quantity: 1, members: [], addingClass: "" }]);
  }, []);

  const removeCrew = useCallback((crewIdx) => {
    setCrews(prev => prev.filter((_, i) => i !== crewIdx));
  }, []);

  const updateCrew = useCallback((crewIdx, field, value) => {
    setCrews(prev => prev.map((c, i) => i === crewIdx ? { ...c, [field]: value } : c));
  }, []);

  const addCrewMember = useCallback((crewIdx) => {
    setCrews(prev => prev.map((c, i) => {
      if (i !== crewIdx || !c.addingClass) return c;
      return { ...c, members: [...c.members, { classification: c.addingClass, quantity: 1 }], addingClass: "" };
    }));
  }, []);

  const updateCrewMember = useCallback((crewIdx, memberIdx, field, value) => {
    setCrews(prev => prev.map((c, ci) => ci !== crewIdx ? c : {
      ...c, members: c.members.map((m, mi) => mi === memberIdx ? { ...m, [field]: value } : m)
    }));
  }, []);

  const removeCrewMember = useCallback((crewIdx, memberIdx) => {
    setCrews(prev => prev.map((c, ci) => ci !== crewIdx ? c : {
      ...c, members: c.members.filter((_, mi) => mi !== memberIdx)
    }));
  }, []);

  const setUnionClassMapping = useCallback((classification, field, value) => {
    setUnionClassMap(prev => ({
      ...prev,
      [classification]: { ...(prev[classification] || { payClass: "", benefitsClass: "" }), [field]: value }
    }));
  }, []);

  // Flatten all crews into effective member list (qty × crew qty) for rates & P&L
  const allEffectiveMembers = useMemo(() => {
    const map = {};
    crews.forEach(crew => {
      crew.members.forEach(m => {
        const key = m.classification;
        if (!map[key]) map[key] = { classification: key, quantity: 0 };
        map[key].quantity += m.quantity * crew.quantity;
      });
    });
    return Object.values(map);
  }, [crews]);

  // Unique classifications across all crews (for rate builder)
  const uniqueClassifications = useMemo(() => {
    const seen = new Set();
    const result = [];
    crews.forEach(crew => {
      crew.members.forEach(m => {
        if (!seen.has(m.classification)) {
          seen.add(m.classification);
          result.push(m.classification);
        }
      });
    });
    return result;
  }, [crews]);

  // Section validation: "complete" | "partial" | "incomplete" | "empty"
  const sectionValidation = useMemo(() => {
    // Project Description
    const projRequired = bidName && utility && startDate && endDate;
    const projOptional = locationState && businessUnit && serviceType && projectScope.trim() && projectAssumptions.trim() && projectDocs.length > 0;
    const projStatus = !projRequired ? "incomplete" : !projOptional ? "partial" : "complete";

    // Work Schedule
    const schedStatus = hoursPerDay === 0 ? "incomplete" : "complete";

    // Crew & Equipment
    const hasMembers = crews.some(c => c.members.length > 0);
    const hasMissingUnionMap = laborType === "union" && hasMembers && crews.some(c =>
      c.members.some(m => {
        const map = unionClassMap[m.classification] || {};
        return !map.payClass || !map.benefitsClass;
      })
    );
    const hasEquip = equipment.length > 0;
    const crewStatus = !hasMembers && !hasEquip ? "incomplete" : !hasMembers || !hasEquip ? "partial" : hasMissingUnionMap ? "partial" : "complete";

    // Labor Rate Builder
    const hourTypes = hasOT ? ["ST", "OT"] : ["ST"];
    const allMarkupsSet = hasMembers && uniqueClassifications.every(c =>
      hourTypes.every(ht => markups[`${c}-${ht}`] !== undefined)
    );
    const ratesStatus = !hasMembers ? "incomplete" : allMarkupsSet ? "complete" : "partial";

    // Per Diem
    const pdHasUnset = perDiemDays > 0 && uniqueClassifications.some(c => perDiemRates[c] == null || perDiemRates[c].amount == null);
    const pdStatus = perDiemDays === null ? "incomplete" : perDiemDays === 0 ? "complete" : pdHasUnset ? "partial" : "complete";

    // Equipment Rate Builder
    const billableInternalEquip = equipment.filter(eq => !eq.isExternal && eq.billable !== false);
    const allEquipMarkupsSet = hasEquip && billableInternalEquip.every(eq => equipMarkups[eq.name] !== undefined);
    const equipStatus = !hasEquip ? "incomplete" : allEquipMarkupsSet ? "complete" : "partial";

    // Bid Summary & P&L — read-only, based on upstream
    const hasData = hasMembers || hasEquip;
    const summaryStatus = hasData ? "complete" : "empty";

    return {
      project: projStatus,
      schedule: schedStatus,
      crew: crewStatus,
      rates: ratesStatus,
      perdiem: pdStatus,
      equiprates: equipStatus,
      revenue: summaryStatus,
      pnl: summaryStatus
    };
  }, [bidName, utility, locationState, businessUnit, serviceType, startDate, endDate, projectScope, projectAssumptions, projectDocs, hoursPerDay, crews, laborType, unionClassMap, perDiemDays, perDiemRates, uniqueClassifications, equipment, markups, equipMarkups, hasOT]);

  const setRate = useCallback((key, val) => setRates(prev => ({ ...prev, [key]: val })), []);
  const setMarkup = useCallback((key, val) => setMarkups(prev => {
    if (val === undefined) { const next = { ...prev }; delete next[key]; return next; }
    return { ...prev, [key]: val };
  }), []);

  // Equipment handlers
  const addEquipment = useCallback(() => {
    if (!addingEquip) return;
    setEquipment(prev => [...prev, { name: addingEquip, quantity: 1, durationDays: durationWorkingDays, isExternal: false, billable: true }]);
    setAddingEquip("");
  }, [addingEquip, durationWorkingDays]);

  const addExternalEquipment = useCallback(() => {
    if (!addingExternalName.trim()) return;
    setEquipment(prev => [...prev, { name: addingExternalName.trim(), quantity: 1, durationDays: durationWorkingDays, isExternal: true, billable: true, rentalCost: 0, deliveryPickup: false, deliveryPickupFee: 0 }]);
    setAddingExternalName("");
  }, [addingExternalName]);

  const updateEquipment = useCallback((idx, field, value) => {
    setEquipment(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  }, []);

  const removeEquipment = useCallback((idx) => {
    setEquipment(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const setEquipMarkup = useCallback((key, val) => setEquipMarkups(prev => {
    if (val === undefined) { const next = { ...prev }; delete next[key]; return next; }
    return { ...prev, [key]: val };
  }), []);

  const setExternalRate = useCallback((name, field, value) => {
    setExternalRates(prev => ({
      ...prev,
      [name]: { ...(prev[name] || { unitCost: 0, fuelCost: 0 }), [field]: value }
    }));
  }, []);

  // Sync equipment durationDays when working days changes
  useEffect(() => {
    if (durationWorkingDays > 0) {
      setEquipment(prev => prev.map(eq => ({ ...eq, durationDays: durationWorkingDays })));
    }
  }, [durationWorkingDays]);

  // Equipment rate calculation
  const getEquipRateData = useCallback((eq) => {
    const isExt = eq.isExternal;
    const isBillable = eq.billable !== false;
    const baseRates = isExt
      ? (externalRates[eq.name] || { unitCost: 0, fuelCost: 0 })
      : (EQUIPMENT_INTERNAL_RATES[eq.name] || { unitCost: 0, fuelCost: 0 });
    const markupRaw = equipMarkups[eq.name];
    const markup = markupRaw !== undefined ? markupRaw : "";
    const markupNum = parseFloat(markup) || 0;
    const totalCost = baseRates.unitCost + (baseRates.fuelCost);
    const billingRate = isBillable ? totalCost * (1 + markupNum / 100) : 0;
    const profit = billingRate - totalCost;
    const profitMargin = billingRate > 0 ? profit / billingRate : 0;
    return { unitCost: baseRates.unitCost, fuelCost: baseRates.fuelCost, totalCost, billingRate, profit, profitMargin, markup, isExternal: isExt, billable: isBillable };
  }, [equipMarkups, externalRates]);

  // Rate calculations
  const getRateData = useCallback((classification, hourType) => {
    const key = `${classification}-${hourType}`;
    const stKey = `${classification}-ST`;
    const markupRaw = markups[key];
    const markup = markupRaw !== undefined ? markupRaw : "";
    const markupNum = parseFloat(markup) || 0;
    let wage, benefits;

    if (laborType === "union" && unionPayScaleData) {
      const mapping = unionClassMap[classification] || {};
      const payClass = mapping.payClass || "";
      const benefitsClass = mapping.benefitsClass || "";
      const payScale = payClass ? unionPayScaleData.classifications[payClass] : null;
      wage = payScale ? (hourType === "OT" ? payScale.ot : payScale.st) : 0;
      benefits = (unionBenefitsData && benefitsClass) ? (unionBenefitsData[benefitsClass] || 0) : 0;
    } else {
      const stWage = rates[stKey] !== undefined ? rates[stKey] : (NON_UNION_DEFAULT_WAGES[classification] || 0);
      wage = hourType === "OT" ? stWage * (parseFloat(otMultiplier) || 1.5) : stWage;
      benefits = wage * 0.054;
    }

    const workersComp = wage * 0.0092;
    const payrollTax = wage * 0.0818;
    const loadedCost = wage + workersComp + benefits + payrollTax;
    const billingRate = loadedCost * (1 + markupNum / 100);
    const profit = billingRate - loadedCost;
    const profitMargin = billingRate > 0 ? profit / billingRate : 0;
    return { wage, workersComp, benefits, payrollTax, loadedCost, billingRate, profit, profitMargin, markup, isUnion: laborType === "union" };
  }, [rates, markups, laborType, unionPayScaleData, unionBenefitsData, unionClassMap, otMultiplier]);

  // Per Diem helpers
  const perDiemDaysNum = perDiemDays || 0;
  const getPerDiem = useCallback((classif) => {
    return perDiemRates[classif] || { amount: 0, billable: false, billingAmount: 0 };
  }, [perDiemRates]);
  const setPerDiemField = useCallback((classif, field, value) => {
    setPerDiemRates(prev => ({
      ...prev,
      [classif]: { ...(prev[classif] || { amount: 0, billable: false, billingAmount: 0 }), [field]: value }
    }));
  }, []);

  // P&L calculations
  const pnl = useMemo(() => {
    let dailyRevenue = 0;
    let dailyWages = 0, dailyWC = 0, dailyBenefits = 0, dailyPayroll = 0;
    let dailyPerDiemCost = 0, dailyPerDiemRevenue = 0;
    const totalCrew = allEffectiveMembers.reduce((s, m) => s + m.quantity, 0);

    allEffectiveMembers.forEach(member => {
      const stData = getRateData(member.classification, "ST");
      const otData = getRateData(member.classification, "OT");

      const stRev = stData.billingRate * stHours * member.quantity;
      const otRev = hasOT ? otData.billingRate * otHours * member.quantity : 0;
      dailyRevenue += stRev + otRev;

      // Break down labor cost components
      const hrs = [{ d: stData, h: stHours }];
      if (hasOT) hrs.push({ d: otData, h: otHours });
      hrs.forEach(({ d, h }) => {
        dailyWages += d.wage * h * member.quantity;
        dailyWC += d.workersComp * h * member.quantity;
        dailyBenefits += d.benefits * h * member.quantity;
        dailyPayroll += d.payrollTax * h * member.quantity;
      });

      const pd = getPerDiem(member.classification);
      dailyPerDiemCost += pd.amount * member.quantity;
      if (pd.billable) {
        dailyPerDiemRevenue += (pd.billingAmount || 0) * member.quantity;
      }
    });

    const dailyLaborCost = dailyWages; // Direct labor = wages only

    const weeklyPerDiemCost = dailyPerDiemCost * perDiemDaysNum;
    const weeklyPerDiemRevenue = dailyPerDiemRevenue * perDiemDaysNum;
    const weeklyLaborRevenue = dailyRevenue * daysPerWeek;
    const weeklyLaborCost = dailyLaborCost * daysPerWeek;

    // Equipment — internal uses hourly rates, external uses daily rental cost
    let dailyEquipInternal = 0, dailyEquipFuel = 0, dailyEquipRental = 0;
    let dailyEquipRevenue = 0;
    let totalEquipCost = 0, totalEquipRevenue = 0;
    let totalEquipInternal = 0, totalEquipFuel = 0, totalEquipRental = 0;
    let totalDeliveryPickup = 0;
    const internalEquip = equipment.filter(e => !e.isExternal);
    const externalEquip = equipment.filter(e => e.isExternal);

    internalEquip.forEach(eq => {
      const rd = getEquipRateData(eq);
      const assignedDays = eq.durationDays || 0;
      const dailyUnit = rd.unitCost * hoursPerDay * eq.quantity;
      const dailyFuel = rd.fuelCost * hoursPerDay * eq.quantity;
      dailyEquipInternal += dailyUnit;
      dailyEquipFuel += dailyFuel;
      totalEquipInternal += dailyUnit * assignedDays;
      totalEquipFuel += dailyFuel * assignedDays;
      const dailyRev = rd.billingRate * hoursPerDay * eq.quantity;
      dailyEquipRevenue += dailyRev;
      totalEquipCost += rd.totalCost * hoursPerDay * eq.quantity * assignedDays;
      totalEquipRevenue += dailyRev * assignedDays;
    });

    externalEquip.forEach(eq => {
      const rentalCost = (eq.rentalCost || 0) * eq.quantity;
      const dpFee = eq.deliveryPickup ? (eq.deliveryPickupFee || 0) * eq.quantity : 0;
      const totalRentalCost = rentalCost + dpFee;
      totalDeliveryPickup += dpFee;
      const dailyRental = durationWorkingDays > 0 ? totalRentalCost / durationWorkingDays : 0;
      dailyEquipRental += dailyRental;
      totalEquipRental += totalRentalCost;
      totalEquipCost += totalRentalCost;
      if (eq.billable !== false) {
        const markupMult = rentalMarkupEnabled ? (1 + rentalMarkupPct / 100) : 1;
        const rev = totalRentalCost * markupMult;
        totalEquipRevenue += rev;
        dailyEquipRevenue += durationWorkingDays > 0 ? (rev / durationWorkingDays) : 0;
      }
    });
    const dailyEquipCost = dailyEquipInternal + dailyEquipFuel + dailyEquipRental;
    const weeklyEquipCost = dailyEquipCost * daysPerWeek;
    const weeklyEquipRevenue = dailyEquipRevenue * daysPerWeek;

    const weeklyRevenue = weeklyLaborRevenue + weeklyPerDiemRevenue + weeklyEquipRevenue;

    // Labor burden (separate from direct cost)
    const dailyBurden = dailyWC + dailyBenefits + dailyPayroll;
    const weeklyBurden = dailyBurden * daysPerWeek;

    // Overhead calculations
    // % of Revenue
    const weeklyOhRevenue = weeklyRevenue * (overhead.generalOverhead / 100) + weeklyRevenue * (overhead.glInsurance / 100);
    const ohRevDetail = {
      generalOverhead: weeklyRevenue * (overhead.generalOverhead / 100),
      glInsurance: weeklyRevenue * (overhead.glInsurance / 100),
    };
    // Weekly fixed
    const weeklyOhFixed = (overhead.supplies || 0) + (overhead.telephone || 0) + (overhead.postage || 0) + (overhead.newHireUniform || 0) + (overhead.safety || 0) + (overhead.incidentRepairs || 0) + (overhead.tools || 0) + (overhead.otherJobCosts || 0) + (overhead.equipRepairsMaint || 0);
    const ohFixedDetail = {
      supplies: overhead.supplies || 0,
      telephone: overhead.telephone || 0,
      postage: overhead.postage || 0,
      newHireUniform: overhead.newHireUniform || 0,
      safety: overhead.safety || 0,
      incidentRepairs: overhead.incidentRepairs || 0,
      tools: overhead.tools || 0,
      otherJobCosts: overhead.otherJobCosts || 0,
      equipRepairsMaint: overhead.equipRepairsMaint || 0,
    };
    const weeklyOverhead = weeklyOhRevenue + weeklyOhFixed;
    const dailyOverhead = daysPerWeek > 0 ? weeklyOverhead / daysPerWeek : 0;

    const weeklyTotalCost = weeklyLaborCost + weeklyBurden + weeklyPerDiemCost + weeklyEquipCost + weeklyOverhead;
    const weeklyProfit = weeklyRevenue - weeklyTotalCost;

    const totalRevenue = (weeklyLaborRevenue + weeklyPerDiemRevenue) * durationWeeks + totalEquipRevenue;
    const totalLaborCost = weeklyLaborCost * durationWeeks;
    const totalBurden = weeklyBurden * durationWeeks;
    const totalPerDiemCost = weeklyPerDiemCost * durationWeeks;
    const totalPerDiemRevenue = weeklyPerDiemRevenue * durationWeeks;
    const totalOverhead = weeklyOverhead * durationWeeks;
    const totalCostAll = totalLaborCost + totalBurden + totalPerDiemCost + totalEquipCost + totalOverhead;
    const totalProfit = totalRevenue - totalCostAll;
    const totalMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

    const dr = dailyRevenue + dailyPerDiemRevenue + dailyEquipRevenue;
    const dc = dailyLaborCost + dailyBurden + dailyPerDiemCost + dailyEquipCost + dailyOverhead;

    const mk = (d, w, t) => ({ daily: d, weekly: w, total: t });

    return {
      daily: { revenue: dr, laborCost: dailyLaborCost, burden: dailyBurden, perDiemCost: dailyPerDiemCost, perDiemRevenue: dailyPerDiemRevenue, equipCost: dailyEquipCost, equipRevenue: dailyEquipRevenue, overhead: dailyOverhead, totalCost: dc, profit: dr - dc },
      weekly: { revenue: weeklyRevenue, laborCost: weeklyLaborCost, burden: weeklyBurden, perDiemCost: weeklyPerDiemCost, perDiemRevenue: weeklyPerDiemRevenue, equipCost: weeklyEquipCost, equipRevenue: weeklyEquipRevenue, overhead: weeklyOverhead, totalCost: weeklyTotalCost, profit: weeklyProfit },
      total: { revenue: totalRevenue, laborCost: totalLaborCost, burden: totalBurden, perDiemCost: totalPerDiemCost, perDiemRevenue: totalPerDiemRevenue, equipCost: totalEquipCost, equipRevenue: totalEquipRevenue, overhead: totalOverhead, totalCost: totalCostAll, profit: totalProfit, margin: totalMargin },
      totalCrew,
      laborBreakdown: {
        wages: mk(dailyWages, dailyWages * daysPerWeek, dailyWages * daysPerWeek * durationWeeks),
        workersComp: mk(dailyWC, dailyWC * daysPerWeek, dailyWC * daysPerWeek * durationWeeks),
        benefits: mk(dailyBenefits, dailyBenefits * daysPerWeek, dailyBenefits * daysPerWeek * durationWeeks),
        payrollTax: mk(dailyPayroll, dailyPayroll * daysPerWeek, dailyPayroll * daysPerWeek * durationWeeks),
      },
      equipBreakdown: {
        internal: mk(dailyEquipInternal, dailyEquipInternal * daysPerWeek, totalEquipInternal),
        fuel: mk(dailyEquipFuel, dailyEquipFuel * daysPerWeek, totalEquipFuel),
        rental: mk(dailyEquipRental, dailyEquipRental * daysPerWeek, totalEquipRental),
      },
      overheadBreakdown: {
        revPct: mk(daysPerWeek > 0 ? weeklyOhRevenue / daysPerWeek : 0, weeklyOhRevenue, weeklyOhRevenue * durationWeeks),
        fixed: mk(daysPerWeek > 0 ? weeklyOhFixed / daysPerWeek : 0, weeklyOhFixed, weeklyOhFixed * durationWeeks),
        revDetail: ohRevDetail,  fixedDetail: ohFixedDetail,
      },
      hasRental: equipment.some(e => e.isExternal),
    };
  }, [allEffectiveMembers, getRateData, getPerDiem, getEquipRateData, equipment, stHours, otHours, hasOT, hoursPerDay, daysPerWeek, perDiemDaysNum, durationWeeks, durationWorkingDays, rentalMarkupEnabled, rentalMarkupPct, overhead]);

  // Scroll-based active step detection
  useEffect(() => {
    const handleScroll = () => {
      const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 40;
      if (atBottom) { setActiveStep(GUIDE_STEPS.length - 1); return; }
      const ids = GUIDE_STEPS.map(s => s.id);
      // Find the section whose top most recently crossed the trigger line.
      // We pick the section with the largest top value that's still <= threshold,
      // which is the one closest to the viewport top (just scrolled into view).
      let bestIdx = 0;
      let bestTop = -Infinity;
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 100 && top > bestTop) {
            bestTop = top;
            bestIdx = i;
          }
        }
      }
      setActiveStep(bestIdx);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const gridRow = (cols) => ({
    display: "grid", gridTemplateColumns: cols || "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 16
  });

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100, background: "#0f172a", padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff"
          }}>G</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", letterSpacing: "-0.01em" }}>Project Estimates | T&E Bid Sheet</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setShowHistory(!showHistory)} style={{
            padding: "8px 16px", borderRadius: 6, border: "1px solid #334155",
            background: showHistory ? "#1e293b" : "transparent",
            color: "#cbd5e1", fontSize: 13, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s"
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4.5V7l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            History
          </button>
          <button style={{
            padding: "8px 24px", borderRadius: 6, border: "none",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s", letterSpacing: "0.02em"
          }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >Share</button>
        </div>
      </div>

      {/* Assumptions Drawer */}
      {showAssumptions && (
        <div style={{
          position: "fixed", top: 60, right: 0, width: 380, bottom: 0, background: "#fff",
          borderLeft: "1px solid #e2e8f0", zIndex: 99, padding: 28, overflowY: "auto",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Project Snapshot</h3>
            <button onClick={() => setShowAssumptions(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>✕</button>
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Project Duration</strong><br />
              {durationWeeks} weeks · {durationWorkingDays} working days
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Work Schedule</strong><br />
              {daysPerWeek} days/wk · {hoursPerDay} hrs/day · {weeklyTotalHours} hrs/wk<br />
              ST: {weeklyStHours}h/wk{otDayBreakdown ? ` (${otDayBreakdown.fullStDays} day${otDayBreakdown.fullStDays !== 1 ? "s" : ""}${otDayBreakdown.hasSplitDay ? ` + ${otDayBreakdown.remainderSt}h` : ""})` : ""} · OT: {weeklyOtHours}h/wk{otDayBreakdown ? ` (${otDayBreakdown.hasSplitDay ? `${otDayBreakdown.splitOtHours}h + ` : ""}${otDayBreakdown.fullOtDays} day${otDayBreakdown.fullOtDays !== 1 ? "s" : ""})` : ""}{hasOT ? ` · OT after ${otThreshold}h · Multiplier: ${otMultiplier}×` : ""}
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Crew Size</strong><br />
              {pnl.totalCrew} workers across {crews.length} crew{crews.length !== 1 ? "s" : ""}
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Total Man Hours</strong><br />
              {(pnl.totalCrew * hoursPerDay * daysPerWeek * durationWeeks).toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Per Diem</strong><br />
              {perDiemDaysNum > 0 ? `${perDiemDaysNum} days/wk · ${uniqueClassifications.length} classifications configured` : "Not configured"}
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Equipment</strong><br />
              {equipment.length > 0
                ? `${equipment.reduce((s, e) => s + e.quantity, 0)} units`
                : "Not configured"}
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Labor Type</strong><br />
              {laborType === "union" ? (
                <>
                  Union · Pay Scale: {unionPayScaleLocal || "Not set"}<br />
                  Benefits: {unionBenefitsLocal || "Not set"}
                </>
              ) : "Non-Union"}
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#0f172a" }}>Labor Burden Rates</strong><br />
              Workers' Comp: 0.92% · {laborType === "union" ? "Benefits: per CBA" : "Benefits: 5.40%"} · Payroll Taxes: 8.18%
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", maxWidth: 1400, margin: "0 auto", padding: "24px 32px", gap: 28 }}>
        {/* Sidebar Guide */}
        <div style={{ width: 240, flexShrink: 0, position: "sticky", top: 84, alignSelf: "flex-start" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Template Guide
          </div>
          {GUIDE_STEPS.map((step, i) => {
            const status = sectionValidation[step.id];
            const showStatus = step.id !== "revenue" && step.id !== "pnl";
            const statusColor = status === "complete" ? "#16a34a" : status === "partial" ? "#f59e0b" : status === "incomplete" ? "#ef4444" : "#cbd5e1";
            const statusIcon = status === "complete" ? "✓" : status === "partial" ? "!" : status === "incomplete" ? "!" : "—";
            return (
            <div
              key={step.id}
              onClick={() => scrollToSection(step.id)}
              style={{
                padding: "10px 14px", marginBottom: 4, borderRadius: 8, cursor: "pointer",
                borderLeft: `3px solid ${activeStep === i ? "#3b82f6" : "transparent"}`,
                background: activeStep === i ? "#eff6ff" : "transparent",
                transition: "all 0.2s"
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <div style={{
                  fontSize: 13, fontWeight: activeStep === i ? 600 : 500,
                  color: activeStep === i ? "#1e40af" : "#64748b", marginBottom: 2
                }}>
                  {i + 1}. {step.title}
                </div>
                {showStatus && <div style={{
                  width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: status === "complete" ? 11 : 10, fontWeight: 700, flexShrink: 0,
                  background: status === "complete" ? "#dcfce7" : status === "partial" ? "#fef3c7" : status === "incomplete" ? "#fee2e2" : "#f1f5f9",
                  color: statusColor,
                  border: `1.5px solid ${statusColor}`
                }}>{statusIcon}</div>}
              </div>
              {activeStep === i && (
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, marginTop: 6 }}>
                  {step.desc}
                </div>
              )}
            </div>
            );
          })}

          {/* Classification Reference Link */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
            <button onClick={() => setShowAssumptions(!showAssumptions)} style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
              background: showAssumptions ? "#eff6ff" : "#fafbfc", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              marginBottom: 8, borderColor: showAssumptions ? "#3b82f6" : "#e2e8f0"
            }}
              onMouseOver={e => { if (!showAssumptions) { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3b82f6"; }}}
              onMouseOut={e => { if (!showAssumptions) { e.currentTarget.style.background = "#fafbfc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1e40af", display: "flex", alignItems: "center", gap: 6 }}>
                Project Snapshot
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                View burden rates &amp; cost assumptions
              </div>
            </button>
            <button onClick={() => setShowClassRef(true)} style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
              background: "#fafbfc", cursor: "pointer", textAlign: "left", transition: "all 0.15s"
            }}
              onMouseOver={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3b82f6"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#fafbfc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1e40af", display: "flex", alignItems: "center", gap: 6 }}>
                Labor Rate Reference
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                View all classes with benchmark wages
              </div>
            </button>
            <button onClick={() => setShowEquipRef(true)} style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
              background: "#fafbfc", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              marginTop: 8
            }}
              onMouseOver={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3b82f6"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#fafbfc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1e40af", display: "flex", alignItems: "center", gap: 6 }}>
                Equipment Rate Reference
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                View all equipment with unit &amp; fuel costs
              </div>
            </button>
            <button onClick={() => setShowOverheadRef(true)} style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
              background: "#fafbfc", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              marginTop: 8
            }}
              onMouseOver={e => { e.currentTarget.style.background = "#fef3c7"; e.currentTarget.style.borderColor = "#f59e0b"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#fafbfc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#92400e", display: "flex", alignItems: "center", gap: 6 }}>
                Overhead Assumptions
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                Edit burden rates, overhead %, and fixed costs
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* === 1. PROJECT DESCRIPTION === */}
          <SectionCard id="project" title="Project Description" info="Define the scope and schedule for your T&E project.">
            <div style={gridRow("1fr 1fr 1fr")}>
              <div style={{ gridColumn: "1 / 3" }}><FieldLabel>Bid Name</FieldLabel><TextInput value={bidName} onChange={setProjectName} placeholder="e.g. Utility XYZ 2026 Contract Bid" /></div>
              <div><FieldLabel>Utility</FieldLabel><Select value={utility} onChange={setUtility} options={UTILITIES} placeholder="Select utility" /></div>
            </div>
            <div style={gridRow("1fr 1fr 1fr")}>
              <div><FieldLabel>Location (State)</FieldLabel><Select value={locationState} onChange={setLocationState} options={US_STATES} /></div>
              <div><FieldLabel>Business Unit</FieldLabel><Select value={businessUnit} onChange={setBusinessUnit} options={BUSINESS_UNITS} /></div>
              <div><FieldLabel>Service Type</FieldLabel><Select value={serviceType} onChange={setServiceType} options={SERVICE_TYPES} /></div>
            </div>
            <div style={gridRow("1fr 1fr 1fr")}>
              <div><FieldLabel>Contract Start Date</FieldLabel><DateInput value={startDate} onChange={setStartDate} /></div>
              <div><FieldLabel>Contract End Date</FieldLabel><DateInput value={endDate} onChange={setEndDate} /></div>
              <div>
                <FieldLabel>Working Days / Week</FieldLabel>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <button key={d} onClick={() => setDaysPerWeek(d)} style={{
                      flex: 1, padding: "8px 0", borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      border: daysPerWeek === d ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                      background: daysPerWeek === d ? "#eff6ff" : "#fff",
                      color: daysPerWeek === d ? "#1e40af" : "#64748b"
                    }}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={gridRow("1fr 1fr 1fr")}>
              <div>
                <FieldLabel>Contract Duration</FieldLabel>
                <div style={{ padding: "9px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 14, color: "#64748b", border: "1px solid #e2e8f0" }}>{durationWeeks.toFixed(1)} weeks</div>
              </div>
              <div>
                <FieldLabel>Total Working Days</FieldLabel>
                <div style={{ padding: "9px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 14, color: "#64748b", border: "1px solid #e2e8f0" }}>{durationWorkingDays} days</div>
              </div>
              <div />
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #e2e8f0", margin: "20px 0" }} />

            {/* Project Scope */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Project Scope</FieldLabel>
              <textarea
                value={projectScope}
                onChange={e => setProjectScope(e.target.value)}
                placeholder="Describe the scope of work, key deliverables, milestones, and any special conditions..."
                rows={5}
                style={{
                  width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6,
                  fontSize: 14, color: "#0f172a", background: "#fff", resize: "vertical",
                  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                  lineHeight: 1.6, transition: "border-color 0.15s"
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Assumptions & Clarifications */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Assumptions & Clarifications</FieldLabel>
              <textarea
                value={projectAssumptions}
                onChange={e => setProjectAssumptions(e.target.value)}
                placeholder="List any assumptions, exclusions, clarifications, or conditions that apply to this bid..."
                rows={4}
                style={{
                  width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6,
                  fontSize: 14, color: "#0f172a", background: "#fff", resize: "vertical",
                  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                  lineHeight: 1.6, transition: "border-color 0.15s"
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Project Documents */}
            <div>
              <FieldLabel>Project Documents</FieldLabel>
              <input
                ref={fileInputRef}
                type="file" multiple
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  setProjectDocs(prev => [...prev, ...files.map(f => ({ name: f.name, size: f.size, file: f }))]);
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #e2e8f0", borderRadius: 8, padding: "24px 16px",
                  textAlign: "center", cursor: "pointer", transition: "all 0.15s",
                  background: "#fafbfc", marginBottom: projectDocs.length > 0 ? 12 : 0
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "#eff6ff"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fafbfc"; }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>📎</div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                  Click to attach documents
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                  Contracts, specs, drawings, RFPs, etc.
                </div>
              </div>
              {projectDocs.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {projectDocs.map((doc, idx) => (
                    <div key={idx} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 12px", background: "#f8fafc", borderRadius: 6,
                      border: "1px solid #e2e8f0"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: 14 }}>📄</span>
                        <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>
                          {doc.size < 1024 ? `${doc.size} B` : doc.size < 1048576 ? `${(doc.size / 1024).toFixed(1)} KB` : `${(doc.size / 1048576).toFixed(1)} MB`}
                        </span>
                      </div>
                      <button onClick={() => setProjectDocs(prev => prev.filter((_, i) => i !== idx))} style={{
                        background: "none", border: "none", cursor: "pointer", color: "#ef4444",
                        fontSize: 13, padding: "2px 4px", flexShrink: 0
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* === 2. WORK SCHEDULE === */}
          <SectionCard id="schedule" title="Work Schedule" info="Set hours per day and configure overtime rules. The OT threshold determines when overtime kicks in based on weekly hours.">
            <div style={gridRow("1fr 1fr")}>
              <div>
                <FieldLabel>Hours Per Day</FieldLabel>
                <div style={{ display: "flex", gap: 6 }}>
                  {[8, 10, 12, 14].map(h => (
                    <button key={h} onClick={() => setHoursPerDay(h)} style={{
                      flex: 1, padding: "9px 0", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer",
                      border: hoursPerDay === h ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                      background: hoursPerDay === h ? "#eff6ff" : "#fff",
                      color: hoursPerDay === h ? "#1e40af" : "#64748b"
                    }}>{h}</button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Weekly Hours</FieldLabel>
                <div style={{ padding: "9px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 14, color: "#64748b", border: "1px solid #e2e8f0", fontWeight: 500 }}>
                  {weeklyTotalHours} hrs/wk
                </div>
              </div>
            </div>

            {/* OT Threshold Rule */}
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "20px 24px", marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: hasOT ? 16 : 0 }}>
                <input type="checkbox" checked={otThresholdEnabled}
                  onChange={e => setOtThresholdEnabled(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#3b82f6" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Overtime Rule</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {otThresholdEnabled
                      ? "Hours exceeding the weekly ST threshold are billed at the OT rate"
                      : "All hours are billed at the straight time (ST) rate"}
                  </div>
                </div>
                {otThresholdEnabled && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>OT after</span>
                    <input type="number" min={0} max={weeklyTotalHours}
                      value={otThreshold}
                      onChange={e => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v >= 0) setOtThreshold(v);
                      }}
                      style={{
                        width: 56, textAlign: "center", padding: "6px 8px",
                        border: "1px solid #e2e8f0", borderRadius: 4,
                        fontSize: 14, fontWeight: 700, color: "#1e40af", background: "#fff",
                        outline: "none", boxSizing: "border-box",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                      onFocus={e => e.target.style.borderColor = "#3b82f6"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>hrs/wk</span>
                  </div>
                )}
              </div>

              {/* Weekly timeline with day ticks */}
              {hasOT && otDayBreakdown && (
                <>
                  {/* Summary line */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, fontWeight: 600 }}>
                      <span style={{ color: "#4eb6ad" }}>{weeklyStHours}h ST</span>
                      <span style={{ color: "#ffb74c" }}>{weeklyOtHours}h OT</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{weeklyTotalHours}h / week</div>
                  </div>
                  {/* Timeline bar with day ticks */}
                  <div style={{ position: "relative", marginBottom: 20 }}>
                    {/* The bar */}
                    <div style={{
                      height: 28, borderRadius: 8, overflow: "hidden", display: "flex"
                    }}>
                      <div style={{
                        width: `${(weeklyStHours / weeklyTotalHours) * 100}%`,
                        background: "#4eb6ad", transition: "width 0.3s",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: "#fff",
                        minWidth: weeklyStHours > 0 ? 40 : 0
                      }}>{weeklyStHours}h ST</div>
                      <div style={{
                        flex: 1, background: "#ffb74c", transition: "width 0.3s",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: "#fff",
                        minWidth: weeklyOtHours > 0 ? 40 : 0
                      }}>{weeklyOtHours}h OT</div>
                    </div>
                    {/* Day tick marks (lines only, between days) */}
                    {Array.from({ length: daysPerWeek - 1 }, (_, i) => {
                      const pct = ((i + 1) * hoursPerDay / weeklyTotalHours) * 100;
                      return (
                        <div key={i} style={{
                          position: "absolute", left: `${pct}%`, top: 0,
                          width: 1.5, height: 28,
                          background: "rgba(255,255,255,0.5)",
                          transform: "translateX(-50%)"
                        }} />
                      );
                    })}
                    {/* Day labels centered in each segment */}
                    <div style={{ display: "flex", marginTop: 4 }}>
                      {Array.from({ length: daysPerWeek }, (_, i) => (
                        <div key={i} style={{
                          flex: 1, textAlign: "center",
                          fontSize: 9, fontWeight: 600, color: "#94a3b8"
                        }}>Day {i + 1}</div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          {/* === 3. CREW COMPOSITION === */}
          <SectionCard id="crew" title="Crew Composition" info="Build one or more crews. Each crew can be duplicated via the crew quantity. Classifications within each crew define the per-crew makeup.">
            {/* Labor Type Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {["non-union", "union"].map(lt => (
                  <button key={lt} onClick={() => { setLaborType(lt); setCrews([]); setUnionPayScaleLocal(""); setUnionBenefitsLocal(""); }}
                    style={{
                      padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      border: laborType === lt ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                      background: laborType === lt ? "#eff6ff" : "#fff",
                      color: laborType === lt ? "#1e40af" : "#64748b", transition: "all 0.15s",
                      textTransform: "capitalize"
                    }}
                  >{lt}</button>
                ))}
              </div>
              <button onClick={addCrew} disabled={laborType === "union" && !unionPayScaleLocal} style={{
                padding: "8px 20px", borderRadius: 6, border: "none",
                cursor: (laborType === "union" && !unionPayScaleLocal) ? "default" : "pointer",
                background: (laborType === "union" && !unionPayScaleLocal) ? "#e2e8f0" : "#3b82f6",
                color: (laborType === "union" && !unionPayScaleLocal) ? "#94a3b8" : "#fff",
                fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6
              }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Crew
              </button>
            </div>

            {/* Union Local Selectors */}
            {laborType === "union" && (
              <div style={{
                padding: "20px 24px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0",
                marginBottom: 20
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L1 5v2h14V5L8 1zM2 8v5h3V8H2zm4.5 0v5h3V8h-3zM11 8v5h3V8h-3zM1 14h14v1.5H1V14z" fill="#3b82f6" />
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Union Local Configuration</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <FieldLabel>Pay Scale Local</FieldLabel>
                    <Select
                      value={unionPayScaleLocal}
                      onChange={val => { setUnionPayScaleLocal(val); setCrews([]); }}
                      options={UNION_LOCAL_NAMES}
                      placeholder="Select local for wage rates"
                    />
                    {unionPayScaleLocal && (
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>
                        {Object.keys(UNION_PAY_SCALE_LOCALS[unionPayScaleLocal].classifications).length} classifications available
                      </div>
                    )}
                  </div>
                  <div>
                    <FieldLabel>Benefits Package Local</FieldLabel>
                    <Select
                      value={unionBenefitsLocal}
                      onChange={setUnionBenefitsLocal}
                      options={UNION_LOCAL_NAMES}
                      placeholder="Select local for benefits"
                    />
                    {unionBenefitsLocal && (
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>
                        Benefits sourced from {unionBenefitsLocal}
                      </div>
                    )}
                  </div>
                </div>
                {!unionPayScaleLocal && (
                  <div style={{ fontSize: 12, color: "#ffb74c", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>⚠</span> Select a Pay Scale local to enable crew building
                  </div>
                )}
              </div>
            )}

            {/* Crew Cards */}
            {crews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 13 }}>
                No crews configured. Click "Add Crew" to get started.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {crews.map((crew, crewIdx) => {
                  const crewWorkerCount = crew.members.reduce((s, m) => s + m.quantity, 0);
                  return (
                    <div key={crewIdx} style={{
                      border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden",
                      background: "#fff"
                    }}>
                      {/* Crew Header */}
                      <div style={{
                        padding: "14px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                          <input
                            type="text" value={crew.name}
                            onChange={e => updateCrew(crewIdx, "name", e.target.value)}
                            style={{
                              fontSize: 15, fontWeight: 600, color: "#0f172a", border: "none", background: "transparent",
                              outline: "none", padding: "2px 0", width: 180,
                              borderBottom: "1.5px solid transparent"
                            }}
                            onFocus={e => e.target.style.borderBottomColor = "#3b82f6"}
                            onBlur={e => e.target.style.borderBottomColor = "transparent"}
                          />
                          <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                            {crewWorkerCount} worker{crewWorkerCount !== 1 ? "s" : ""} per crew
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Crew Qty</span>
                            <button onClick={() => updateCrew(crewIdx, "quantity", Math.max(1, crew.quantity - 1))}
                              style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#1e40af", width: 28, textAlign: "center" }}>{crew.quantity}</span>
                            <button onClick={() => updateCrew(crewIdx, "quantity", crew.quantity + 1)}
                              style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                          </div>
                          <button onClick={() => removeCrew(crewIdx)} style={{
                            background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 14,
                            padding: "4px 8px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4
                          }}>
                            <span style={{ fontSize: 16 }}>✕</span>
                          </button>
                        </div>
                      </div>

                      {/* Add Classification to this crew */}
                      <div style={{ padding: "14px 20px", borderBottom: crew.members.length > 0 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ display: "flex", gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <Select
                              value={crew.addingClass || ""}
                              onChange={val => updateCrew(crewIdx, "addingClass", val)}
                              options={classifications.filter(c => !crew.members.some(m => m.classification === c))}
                              placeholder="Select classification to add"
                            />
                          </div>
                          <button
                            onClick={() => addCrewMember(crewIdx)}
                            disabled={!crew.addingClass}
                            style={{
                              padding: "9px 16px", borderRadius: 6, border: "none",
                              cursor: crew.addingClass ? "pointer" : "default",
                              background: crew.addingClass ? "#3b82f6" : "#e2e8f0",
                              color: crew.addingClass ? "#fff" : "#94a3b8",
                              fontSize: 13, fontWeight: 600, transition: "all 0.15s"
                            }}
                          >+ Add</button>
                        </div>
                      </div>

                      {/* Members List */}
                      {crew.members.length > 0 && (
                        <div>
                          <div style={{
                            display: "grid", gridTemplateColumns: laborType === "union" ? "1fr 1fr 1fr 120px 36px" : "1fr 120px 36px", padding: "8px 20px",
                            fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
                            letterSpacing: "0.08em", borderBottom: "1px solid #f1f5f9"
                          }}>
                            <div>Classification</div>
                            {laborType === "union" && <div>Pay Scale Class</div>}
                            {laborType === "union" && <div>Benefits Class</div>}
                            <div style={{ textAlign: "center" }}>Qty</div><div></div>
                          </div>
                          {crew.members.map((member, mIdx) => (
                            <div key={mIdx} style={{
                              display: "grid", gridTemplateColumns: laborType === "union" ? "1fr 1fr 1fr 120px 36px" : "1fr 120px 36px", padding: "8px 20px",
                              borderBottom: mIdx < crew.members.length - 1 ? "1px solid #f8fafc" : "none",
                              alignItems: "center"
                            }}>
                              <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{member.classification}</div>
                              {laborType === "union" && (
                                <div style={{ paddingRight: 8 }}>
                                  <Select
                                    value={(unionClassMap[member.classification] || {}).payClass || ""}
                                    onChange={val => setUnionClassMapping(member.classification, "payClass", val)}
                                    options={payScaleClasses}
                                    placeholder="Select..."
                                  />
                                </div>
                              )}
                              {laborType === "union" && (
                                <div style={{ paddingRight: 8 }}>
                                  <Select
                                    value={(unionClassMap[member.classification] || {}).benefitsClass || ""}
                                    onChange={val => setUnionClassMapping(member.classification, "benefitsClass", val)}
                                    options={benefitsClasses}
                                    placeholder="Select..."
                                  />
                                </div>
                              )}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                <button onClick={() => updateCrewMember(crewIdx, mIdx, "quantity", Math.max(1, member.quantity - 1))}
                                  style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", width: 20, textAlign: "center" }}>{member.quantity}</span>
                                <button onClick={() => updateCrewMember(crewIdx, mIdx, "quantity", member.quantity + 1)}
                                  style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                              </div>
                              <button onClick={() => removeCrewMember(crewIdx, mIdx)} style={{
                                background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 14, padding: 2
                              }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Crew summary footer */}
                      {crew.members.length > 0 && crew.quantity > 1 && (
                        <div style={{
                          padding: "10px 20px", background: "#f0f9ff", borderTop: "1px solid #e0f2fe",
                          fontSize: 12, color: "#1e40af", fontWeight: 500
                        }}>
                          {crew.quantity} × {crewWorkerCount} workers = <strong>{crew.quantity * crewWorkerCount} total workers</strong> for this crew type
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* === EQUIPMENT COMPOSITION === */}
          <SectionCard id="equipment" title="Equipment Composition" info="Add internal company equipment and external rental equipment separately. Set quantities and the number of days each piece will be on the job.">
            {/* === INTERNAL EQUIPMENT === */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Internal Equipment
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <Select
                    value={addingEquip}
                    onChange={setAddingEquip}
                    options={EQUIPMENT_LIST.filter(e => !equipment.some(eq => eq.name === e && !eq.isExternal))}
                    placeholder="Select internal equipment"
                  />
                </div>
                <button onClick={addEquipment} disabled={!addingEquip} style={{
                  padding: "9px 16px", borderRadius: 6, border: "none",
                  cursor: addingEquip ? "pointer" : "default",
                  background: addingEquip ? "#3b82f6" : "#e2e8f0",
                  color: addingEquip ? "#fff" : "#94a3b8",
                  fontSize: 13, fontWeight: 600, transition: "all 0.15s", whiteSpace: "nowrap"
                }}>+ Add</button>
              </div>
              {equipment.filter(e => !e.isExternal).length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13, background: "#fafbfc", borderRadius: 8, border: "1px dashed #e2e8f0" }}>
                  No internal equipment added.
                </div>
              ) : (
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 80px 100px 160px 36px",
                    padding: "10px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
                    fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em",
                    alignItems: "center"
                  }}>
                    <div>Equipment</div>
                    <div style={{ textAlign: "center" }}>Billable</div>
                    <div style={{ textAlign: "center" }}>Qty</div>
                    <div style={{ textAlign: "center" }}>Days Assigned</div>
                    <div></div>
                  </div>
                  {equipment.map((eq, idx) => {
                    if (eq.isExternal) return null;
                    return (
                      <div key={idx} style={{
                        display: "grid", gridTemplateColumns: "1fr 80px 100px 160px 36px",
                        padding: "10px 16px", alignItems: "center",
                        borderBottom: "1px solid #f1f5f9"
                      }}>
                        <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{eq.name}</div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <input type="checkbox" checked={eq.billable !== false}
                            onChange={e => updateEquipment(idx, "billable", e.target.checked)}
                            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#3b82f6" }}
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <button onClick={() => updateEquipment(idx, "quantity", Math.max(1, eq.quantity - 1))}
                            style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", width: 20, textAlign: "center" }}>{eq.quantity}</span>
                          <button onClick={() => updateEquipment(idx, "quantity", eq.quantity + 1)}
                            style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <input type="number" min={0} max={durationWorkingDays} value={eq.durationDays}
                            onChange={e => { const v = parseInt(e.target.value); updateEquipment(idx, "durationDays", isNaN(v) ? 0 : Math.min(Math.max(0, v), durationWorkingDays)); }}
                            style={{ width: 52, textAlign: "center", padding: "5px 4px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 13, fontWeight: 600, color: "#1e40af", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "'JetBrains Mono', monospace" }}
                            onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                          />
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>of {durationWorkingDays}</span>
                        </div>
                        <button onClick={() => removeEquipment(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 14, padding: 2 }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

            {/* === EXTERNAL / RENTAL EQUIPMENT === */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ffb74c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                External / Rental Equipment
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <input type="text" value={addingExternalName}
                    onChange={e => setAddingExternalName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addExternalEquipment(); }}
                    placeholder="Enter rental equipment name"
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "#ffb74c"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <button onClick={addExternalEquipment} disabled={!addingExternalName.trim()} style={{
                  padding: "9px 16px", borderRadius: 6, border: "1px solid #ffb74c",
                  cursor: addingExternalName.trim() ? "pointer" : "default",
                  background: addingExternalName.trim() ? "#fff7ed" : "#e2e8f0",
                  color: addingExternalName.trim() ? "#ffb74c" : "#94a3b8",
                  fontSize: 13, fontWeight: 600, transition: "all 0.15s", whiteSpace: "nowrap",
                  borderColor: addingExternalName.trim() ? "#ffb74c" : "#e2e8f0"
                }}>+ Rental</button>
              </div>
              {equipment.filter(e => e.isExternal).length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13, background: "#fffbeb", borderRadius: 8, border: "1px dashed #fed7aa" }}>
                  No rental equipment added.
                </div>
              ) : (
                <>
                <div style={{ border: "1px solid #fed7aa", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 100px 120px 140px 160px 80px 36px",
                    padding: "10px 16px", background: "#fffbeb", borderBottom: "1px solid #fed7aa",
                    fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em",
                    alignItems: "center", whiteSpace: "nowrap"
                  }}>
                    <div>Equipment</div>
                    <div style={{ textAlign: "center" }}>Qty</div>
                    <div style={{ textAlign: "right" }}>Rental Cost</div>
                    <div style={{ textAlign: "center" }}>Days Assigned</div>
                    <div style={{ textAlign: "center" }}>Delivery / Pickup</div>
                    <div style={{ textAlign: "center" }}>Billable</div>
                    <div></div>
                  </div>
                  {equipment.map((eq, idx) => {
                    if (!eq.isExternal) return null;
                    const inputStyle = {
                      width: 72, textAlign: "right", padding: "5px 6px",
                      border: "1px solid #e2e8f0", borderRadius: 4,
                      fontSize: 13, color: "#0f172a", background: "#fff",
                      outline: "none", boxSizing: "border-box",
                      fontFamily: "'JetBrains Mono', monospace"
                    };
                    return (
                      <div key={idx} style={{
                        display: "grid", gridTemplateColumns: "1fr 100px 120px 140px 160px 80px 36px",
                        padding: "10px 16px", alignItems: "center",
                        borderBottom: "1px solid #fef3c7"
                      }}>
                        <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>
                          {eq.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <button onClick={() => updateEquipment(idx, "quantity", Math.max(1, eq.quantity - 1))}
                            style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", width: 20, textAlign: "center" }}>{eq.quantity}</span>
                          <button onClick={() => updateEquipment(idx, "quantity", eq.quantity + 1)}
                            style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <span style={{ fontSize: 12, color: "#64748b" }}>$</span>
                            <input type="number" min={0} step={1}
                              value={eq.rentalCost || ""}
                              onChange={e => updateEquipment(idx, "rentalCost", parseFloat(e.target.value) || 0)}
                              placeholder="0" style={inputStyle}
                              onFocus={e => e.target.style.borderColor = "#ffb74c"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                            />
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <input type="number" min={0} max={durationWorkingDays} value={eq.durationDays}
                            onChange={e => { const v = parseInt(e.target.value); updateEquipment(idx, "durationDays", isNaN(v) ? 0 : Math.min(Math.max(0, v), durationWorkingDays)); }}
                            style={{ width: 48, textAlign: "center", padding: "5px 4px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 13, fontWeight: 600, color: "#92400e", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "'JetBrains Mono', monospace" }}
                            onFocus={e => e.target.style.borderColor = "#ffb74c"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                          />
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>/ {durationWorkingDays}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <input type="checkbox" checked={eq.deliveryPickup || false}
                            onChange={e => updateEquipment(idx, "deliveryPickup", e.target.checked)}
                            style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#ffb74c" }}
                          />
                          {eq.deliveryPickup && (
                            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <span style={{ fontSize: 11, color: "#64748b" }}>$</span>
                              <input type="number" min={0} step={1}
                                value={eq.deliveryPickupFee || ""}
                                onChange={e => updateEquipment(idx, "deliveryPickupFee", parseFloat(e.target.value) || 0)}
                                placeholder="0" style={{ ...inputStyle, width: 60, fontSize: 12 }}
                                onFocus={e => e.target.style.borderColor = "#ffb74c"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                              />
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <input type="checkbox" checked={eq.billable !== false}
                            onChange={e => updateEquipment(idx, "billable", e.target.checked)}
                            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#3b82f6" }}
                          />
                        </div>
                        <button onClick={() => removeEquipment(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 14, padding: 2 }}>✕</button>
                      </div>
                    );
                  })}
                </div>

                {/* Rental Markup Toggle */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, marginTop: 12,
                  padding: "10px 16px", background: "#fffbeb", borderRadius: 8, border: "1px solid #fed7aa"
                }}>
                  <input type="checkbox" checked={rentalMarkupEnabled}
                    onChange={e => setRentalMarkupEnabled(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#ffb74c" }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#92400e" }}>Equipment Rental Markup</span>
                  {rentalMarkupEnabled && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <input type="number" min={0} max={100} step={0.5}
                        value={rentalMarkupPct}
                        onChange={e => setRentalMarkupPct(parseFloat(e.target.value) || 0)}
                        style={{
                          width: 52, textAlign: "center", padding: "4px 6px",
                          border: "1px solid #fed7aa", borderRadius: 4,
                          fontSize: 13, fontWeight: 700, color: "#92400e", background: "#fff",
                          outline: "none", fontFamily: "'JetBrains Mono', monospace"
                        }}
                        onFocus={e => e.target.style.borderColor = "#f59e0b"} onBlur={e => e.target.style.borderColor = "#fed7aa"}
                      />
                      <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>%</span>
                    </div>
                  )}
                  <span style={{ fontSize: 11, color: "#b45309" }}>
                    {rentalMarkupEnabled ? `Billing rental costs at ${rentalMarkupPct}% markup` : "Rental costs passed through at cost"}
                  </span>
                </div>
                </>
              )}
            </div>
          </SectionCard>

          {/* === 4. LABOR RATE BUILDER === */}
          <SectionCard id="rates" title="Labor Rate Builder" info={laborType === "union" ? "Wages and benefits are pulled from the selected union locals. Workers' comp (0.92%) and payroll taxes (9%) are auto-calculated. Adjust profit markup to set your billing rate." : "Set pay rates for each classification. Burden rates auto-calculate. Adjust profit markup to derive your billing rate."}
            headerRight={hasOT ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span style={{ color: "#92400e", fontWeight: 600 }}>OT Multiplier</span>
                <input
                  type="text"
                  value={otMultiplier}
                  onChange={e => {
                    const raw = e.target.value;
                    if (raw === "" || raw === "." ) { setOtMultiplier(raw); return; }
                    if (!/^\d{0,1}\.?\d{0,2}$/.test(raw)) return;
                    // Block completed values below 1.01 (but allow partial like "1." or "")
                    const v = parseFloat(raw);
                    if (!isNaN(v) && raw.indexOf(".") !== -1 && raw.split(".")[1]?.length === 2 && v < 1.01) return;
                    if (!isNaN(v) && raw.indexOf(".") === -1 && v < 1) return;
                    setOtMultiplier(raw);
                  }}
                  onBlur={e => {
                    const v = parseFloat(otMultiplier);
                    if (isNaN(v) || v < 1.01) setOtMultiplier(1.5);
                    else if (v > 9.99) setOtMultiplier(9.99);
                    else setOtMultiplier(parseFloat(v.toFixed(2)));
                    e.target.style.borderColor = "#fed7aa";
                  }}
                  style={{
                    width: 56, textAlign: "center", padding: "4px 6px",
                    border: "1px solid #fed7aa", borderRadius: 4,
                    fontSize: 13, fontWeight: 700, color: "#92400e", background: "#fffbeb",
                    outline: "none", boxSizing: "border-box",
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                  onFocus={e => e.target.style.borderColor = "#f59e0b"}
                />
                <span style={{ color: "#b45309" }}>×</span>
              </div>
            ) : null}
          >
            {laborType === "union" && unionPayScaleLocal && (
              <div style={{
                padding: "12px 16px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #e0f2fe",
                marginBottom: 20, fontSize: 12, color: "#1e40af", display: "flex", gap: 16, flexWrap: "wrap"
              }}>
                <span><strong>Pay Scale:</strong> {unionPayScaleLocal}</span>
                <span><strong>Benefits:</strong> {unionBenefitsLocal || "Not selected"}</span>
              </div>
            )}
            {uniqueClassifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 13 }}>
                Add crew members above to configure rates.
              </div>
            ) : (
              <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 860 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {[
                        { label: "Type", align: "center", width: 72 },
                        { label: "Wage", align: "right", width: 100 },
                        { label: "W/C (0.92%)", align: "right" },
                        { label: laborType === "union" ? "Benefits" : "Benefits (5.4%)", align: "right" },
                        { label: "Payroll (8.18%)", align: "right" },
                        { label: "Loaded Cost", align: "right" },
                        { label: "Billing Rate", align: "right" },
                        { label: "Margin", align: "right" },
                        { label: "Markup", align: "right", width: 90, hasInfo: true },
                      ].map((col, ci) => (
                        <th key={ci} style={{
                          padding: "12px 16px", textAlign: col.align || "left",
                          fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase",
                          letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0",
                          width: col.width || "auto", whiteSpace: "nowrap"
                        }}>
                          {col.label}
                          {col.hasInfo && <InfoIcon tooltip="Editable. Profit markup applied on top of loaded cost to determine billing rate." />}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueClassifications.map((classif, mIdx) => {
                      const hourTypes = hasOT ? ["ST", "OT"] : ["ST"];
                      const effectiveMember = allEffectiveMembers.find(m => m.classification === classif);
                      const totalQty = effectiveMember ? effectiveMember.quantity : 0;
                      return [
                        <tr key={`header-${mIdx}`}>
                          <td colSpan={9} style={{
                            padding: "12px 16px", background: "#f8fafc",
                            fontSize: 13, fontWeight: 600, color: "#0f172a",
                            borderBottom: "1px solid #e2e8f0",
                            borderTop: mIdx > 0 ? "2px solid #e2e8f0" : "none"
                          }}>
                            {classif}
                            <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12, marginLeft: 8 }}>× {totalQty} total</span>
                          </td>
                        </tr>,
                        ...hourTypes.map((ht, htIdx) => {
                          const key = `${classif}-${ht}`;
                          const data = getRateData(classif, ht);
                          const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 13 };
                          return (
                            <tr key={`${mIdx}-${ht}`} style={{
                              borderBottom: htIdx < hourTypes.length - 1 ? "1px solid #f1f5f9" : "none"
                            }}>
                              <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                <span style={{
                                  fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 4,
                                  background: ht === "ST" ? "#ecfdf5" : "#fff7ed",
                                  color: ht === "ST" ? "#4eb6ad" : "#ffb74c",
                                  display: "inline-block"
                                }}>{ht}</span>
                              </td>
                              <td style={{ padding: "10px 16px", textAlign: "right" }}>
                                {data.isUnion || ht === "OT" ? (
                                  <span style={{
                                    fontSize: 13, fontWeight: 600, color: ht === "OT" && !data.isUnion ? "#92400e" : "#0f172a",
                                    fontFamily: "'JetBrains Mono', monospace"
                                  }}>{fmt(data.wage)}</span>
                                ) : (
                                  <input
                                    type="number" min={0} step={0.01}
                                    value={rates[`${classif}-ST`] !== undefined ? rates[`${classif}-ST`] : (NON_UNION_DEFAULT_WAGES[classif] || "")}
                                    onChange={e => setRate(`${classif}-ST`, parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    style={{
                                      width: 80, textAlign: "right", padding: "6px 8px",
                                      border: "1px solid #e2e8f0", borderRadius: 4,
                                      fontSize: 14, color: "#0f172a", background: "#fff",
                                      outline: "none", boxSizing: "border-box",
                                      fontFamily: "'JetBrains Mono', monospace"
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                                  />
                                )}
                              </td>
                              <td style={{ padding: "10px 16px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(data.workersComp)}</td>
                              <td style={{ padding: "10px 16px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(data.benefits)}</td>
                              <td style={{ padding: "10px 16px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(data.payrollTax)}</td>
                              <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#0f172a", ...mono }}>{fmt(data.loadedCost)}</td>
                              <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#1e40af", ...mono }}>{fmt(data.billingRate)}</td>
                              <td style={{ padding: "10px 16px", textAlign: "right", color: "#64748b", ...mono }}>{pct(data.profitMargin)}</td>
                              <td style={{ padding: "10px 16px", textAlign: "right" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                                  <input
                                    type="number" min={0} max={100} step={0.25}
                                    value={markups[key] !== undefined ? markups[key] : ""}
                                    onChange={e => setMarkup(key, e.target.value === "" ? undefined : (parseFloat(e.target.value) || 0))}
                                    placeholder="—"
                                    style={{
                                      width: 52, textAlign: "right", padding: "6px 6px",
                                      border: `1px solid ${markups[key] !== undefined ? "#e2e8f0" : "#fca5a5"}`,
                                      borderRadius: 4,
                                      fontSize: 13, color: "#1e40af", fontWeight: 600,
                                      background: markups[key] !== undefined ? "#fff" : "#fff5f5", outline: "none",
                                      fontFamily: "'JetBrains Mono', monospace"
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                    onBlur={e => e.target.style.borderColor = markups[key] !== undefined ? "#e2e8f0" : "#fca5a5"}
                                  />
                                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ];
                    })}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </SectionCard>

          {/* === 5. PER DIEM === */}
          <SectionCard id="perdiem" title="Per Diem" info="Set per diem amounts by classification. Check 'Bill to Customer' if the per diem is a pass-through, and optionally set a different billing amount.">
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Per Diem Days / Week</FieldLabel>
              <div style={{ display: "flex", gap: 4, maxWidth: 320 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map(d => (
                  <button key={d} onClick={() => setPerDiemDays(prev => prev === d ? null : d)} style={{
                    flex: 1, padding: "8px 0", borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    border: perDiemDays === d ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                    background: perDiemDays === d ? "#eff6ff" : "#fff",
                    color: perDiemDays === d ? "#1e40af" : "#64748b"
                  }}>{d}</button>
                ))}
              </div>
            </div>

            {uniqueClassifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
                Add crew members above to configure per diem rates.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0" }}>Classification</th>
                    <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", width: 120 }}>Amount / Day</th>
                    <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", width: 100 }}>Per Week</th>
                    <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", width: 130 }}>Bill to Customer</th>
                    <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", width: 140 }}>Customer Rate / Day</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueClassifications.map((classif, idx) => {
                    const pd = getPerDiem(classif);
                    const weeklyAmount = pd.amount * perDiemDaysNum;
                    const hasAmount = perDiemRates[classif] && perDiemRates[classif].amount > 0;
                    const isZero = perDiemRates[classif] && perDiemRates[classif].amount === 0;
                    const rowDisabled = perDiemDaysNum === 0 || isZero;
                    return (
                      <tr key={classif} style={{ borderBottom: idx < uniqueClassifications.length - 1 ? "1px solid #f1f5f9" : "none", background: isZero ? "#fafbfc" : "transparent" }}>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, color: isZero ? "#94a3b8" : "#0f172a" }}>{classif}</td>
                        <td style={{ padding: "10px 16px", textAlign: "right" }}>
                          <input
                            type="number" min={0} step={5}
                            value={perDiemRates[classif] != null ? (pd.amount === 0 ? "0" : pd.amount || "") : ""}
                            onChange={e => setPerDiemField(classif, "amount", e.target.value === "" ? undefined : parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            disabled={perDiemDaysNum === 0}
                            style={{
                              width: 80, textAlign: "right", padding: "6px 8px",
                              border: "1px solid #e2e8f0", borderRadius: 4,
                              fontSize: 13, color: perDiemDaysNum === 0 ? "#94a3b8" : "#0f172a",
                              background: perDiemDaysNum === 0 ? "#f8fafc" : "#fff",
                              outline: "none", boxSizing: "border-box",
                              fontFamily: "'JetBrains Mono', monospace",
                              cursor: perDiemDaysNum === 0 ? "not-allowed" : "text"
                            }}
                            onFocus={e => e.target.style.borderColor = "#3b82f6"}
                            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                          />
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, color: rowDisabled ? "#cbd5e1" : "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
                          {rowDisabled ? "—" : fmt(weeklyAmount)}
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "center" }}>
                          <input
                            type="checkbox" checked={pd.billable}
                            onChange={e => setPerDiemField(classif, "billable", e.target.checked)}
                            disabled={rowDisabled}
                            style={{ width: 16, height: 16, cursor: rowDisabled ? "not-allowed" : "pointer", accentColor: "#3b82f6", opacity: rowDisabled ? 0.35 : 1 }}
                          />
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right" }}>
                          {pd.billable && !rowDisabled ? (
                            <input
                              type="number" min={0} step={5} value={pd.billingAmount || ""}
                              onChange={e => setPerDiemField(classif, "billingAmount", parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              style={{
                                width: 80, textAlign: "right", padding: "6px 8px",
                                border: "1px solid #e2e8f0", borderRadius: 4,
                                fontSize: 13, color: "#1e40af", fontWeight: 600, background: "#fff",
                                outline: "none", boxSizing: "border-box",
                                fontFamily: "'JetBrains Mono', monospace"
                              }}
                              onFocus={e => e.target.style.borderColor = "#3b82f6"}
                              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                            />
                          ) : (
                            <span style={{ fontSize: 13, color: "#cbd5e1" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </SectionCard>

          {/* === EQUIPMENT RATE BUILDER === */}
          <SectionCard id="equiprates" title="Equipment Rate Builder" info="Internal equipment unit and fuel costs are pre-set from internal rates. Adjust markup to derive billing rates.">
            {equipment.filter(e => !e.isExternal).length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 13 }}>
                Add internal equipment above to configure rates.
              </div>
            ) : (
              <>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 780 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        {[
                          { label: "Equipment", align: "left" },
                          { label: "Unit Cost/Hr", align: "right", width: 110 },
                          { label: "Fuel Cost/Hr", align: "right", width: 110 },
                          { label: "Total Cost/Hr", align: "right", width: 110 },
                          { label: "Billing Rate/Hr", align: "right", width: 120 },
                          { label: "Profit/Hr", align: "right", width: 100 },
                          { label: "Margin", align: "right", width: 80 },
                          { label: "Markup", align: "right", width: 90, hasInfo: true },
                        ].map((col, ci) => (
                          <th key={ci} style={{
                            padding: "12px 14px", textAlign: col.align || "left",
                            fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase",
                            letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0",
                            width: col.width || "auto", whiteSpace: "nowrap"
                          }}>
                            {col.label}
                            {col.hasInfo && <InfoIcon tooltip="Editable. Profit markup applied on top of total cost to determine billing rate." />}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {equipment.filter(eq => !eq.isExternal && (eq.billable !== false)).map((eq, idx) => {
                        const rd = getEquipRateData(eq);
                        const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 13 };
                        const notBillable = eq.billable === false;
                        const editStyle = {
                          width: 72, textAlign: "right", padding: "6px 8px",
                          border: "1px solid #e2e8f0", borderRadius: 4,
                          fontSize: 13, color: "#0f172a", background: "#fff",
                          outline: "none", boxSizing: "border-box",
                          fontFamily: "'JetBrains Mono', monospace"
                        };
                        return (
                          <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", opacity: notBillable ? 0.7 : 1 }}>
                            <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {eq.name}
                                {eq.isExternal && (
                                  <span style={{
                                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                    background: "#fff7ed", color: "#ffb74c", border: "1px solid #fed7aa",
                                    textTransform: "uppercase", letterSpacing: "0.05em"
                                  }}>Rental</span>
                                )}
                                {notBillable && (
                                  <span style={{
                                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                    background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
                                    textTransform: "uppercase", letterSpacing: "0.05em"
                                  }}>Not Billable</span>
                                )}
                              </div>
                              <span style={{ color: "#94a3b8", fontSize: 11 }}>{eq.durationDays} of {durationWorkingDays} days</span>
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right" }}>
                              {eq.isExternal ? (
                                <input
                                  type="number" min={0} step={1}
                                  value={(externalRates[eq.name] || {}).unitCost || ""}
                                  onChange={e => setExternalRate(eq.name, "unitCost", parseFloat(e.target.value) || 0)}
                                  placeholder="0.00" style={editStyle}
                                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                                />
                              ) : (
                                <span style={{ color: "#64748b", ...mono }}>{fmt(rd.unitCost)}</span>
                              )}
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right" }}>
                              {eq.isExternal ? (
                                <input
                                  type="number" min={0} step={1}
                                  value={(externalRates[eq.name] || {}).fuelCost || ""}
                                  onChange={e => setExternalRate(eq.name, "fuelCost", parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                  style={{
                                    ...editStyle,
                                    color: "#0f172a",
                                    textDecoration: "none"
                                  }}
                                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                                />
                              ) : (
                                <span style={{
                                  ...mono,
                                  color: "#64748b",
                                  textDecoration: "none"
                                }}>{fmt(rd.fuelCost)}</span>
                              )}
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#0f172a", ...mono }}>{fmt(rd.totalCost)}</td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: notBillable ? "#94a3b8" : "#1e40af", ...mono }}>
                              {notBillable ? "$0.00" : fmt(rd.billingRate)}
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", color: rd.profit >= 0 ? "#4eb6ad" : "#dc2626", fontWeight: 600, ...mono }}>{fmt(rd.profit)}</td>
                            <td style={{ padding: "10px 14px", textAlign: "right", color: "#64748b", ...mono }}>{notBillable ? "—" : pct(rd.profitMargin)}</td>
                            <td style={{ padding: "10px 14px", textAlign: "right" }}>
                              {notBillable ? (
                                <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                              ) : (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                                <input
                                  type="number" min={0} max={100} step={0.25}
                                  value={equipMarkups[eq.name] !== undefined ? equipMarkups[eq.name] : ""}
                                  onChange={e => setEquipMarkup(eq.name, e.target.value === "" ? undefined : (parseFloat(e.target.value) || 0))}
                                  placeholder="—"
                                  style={{
                                    width: 52, textAlign: "right", padding: "6px 6px",
                                    border: `1px solid ${equipMarkups[eq.name] !== undefined ? "#e2e8f0" : "#fca5a5"}`,
                                    borderRadius: 4,
                                    fontSize: 13, color: "#1e40af", fontWeight: 600,
                                    background: equipMarkups[eq.name] !== undefined ? "#fff" : "#fff5f5", outline: "none",
                                    fontFamily: "'JetBrains Mono', monospace"
                                  }}
                                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                  onBlur={e => e.target.style.borderColor = equipMarkups[eq.name] !== undefined ? "#e2e8f0" : "#fca5a5"}
                                />
                                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>%</span>
                              </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </SectionCard>

          {/* === REVENUE BREAKDOWN === */}
          <SectionCard id="revenue" title="Bid Summary" info="Detailed breakdown of expected revenue, cost, and profit by labor classification and equipment item.">
            {(() => {
              const laborLines = [];
              const hourTypes = hasOT ? ["ST", "OT"] : ["ST"];
              uniqueClassifications.forEach(classif => {
                const effectiveMember = allEffectiveMembers.find(m => m.classification === classif);
                const qty = effectiveMember ? effectiveMember.quantity : 0;
                hourTypes.forEach(ht => {
                  const rd = getRateData(classif, ht);
                  const hrsPerDay = ht === "ST" ? stHours : otHours;
                  const totalHours = hrsPerDay * daysPerWeek * durationWeeks * qty;
                  const totalRev = rd.billingRate * totalHours;
                  const totalCost = rd.loadedCost * totalHours;
                  const totalProfit = totalRev - totalCost;
                  laborLines.push({ name: classif, type: ht, qty, billingRate: rd.billingRate, loadedCost: rd.loadedCost, hrsPerDay, totalHours, totalRev, totalCost, totalProfit });
                });
              });
              const laborTotalRev = laborLines.reduce((s, l) => s + l.totalRev, 0);
              const laborTotalCost = laborLines.reduce((s, l) => s + l.totalCost, 0);
              const laborTotalProfit = laborTotalRev - laborTotalCost;

              const equipLines = [];
              equipment.filter(eq => !eq.isExternal && eq.billable !== false).forEach(eq => {
                const rd = getEquipRateData(eq);
                const assignedDays = eq.durationDays || 0;
                const totalHours = hoursPerDay * assignedDays * eq.quantity;
                const totalRev = rd.billingRate * totalHours;
                const totalCost = rd.totalCost * totalHours;
                const totalProfit = totalRev - totalCost;
                equipLines.push({ name: eq.name, qty: eq.quantity, billingRate: rd.billingRate, unitCost: rd.totalCost, durationDays: eq.durationDays, isExternal: false, totalHours, totalRev, totalCost, totalProfit });
              });
              const extEquipLines = [];
              equipment.filter(eq => eq.isExternal && eq.billable !== false).forEach(eq => {
                const assignedDays = eq.durationDays || 0;
                const rentalCost = (eq.rentalCost || 0) * eq.quantity;
                const dpFee = eq.deliveryPickup ? (eq.deliveryPickupFee || 0) * eq.quantity : 0;
                const totalCost = rentalCost + dpFee;
                const markupMult = rentalMarkupEnabled ? (1 + rentalMarkupPct / 100) : 1;
                const totalRev = totalCost * markupMult;
                const totalProfit = totalRev - totalCost;
                extEquipLines.push({ name: eq.name, qty: eq.quantity, rentalCost: eq.rentalCost || 0, durationDays: eq.durationDays, dpFee, totalCost, totalRev, totalProfit });
              });
              const equipTotalRev = equipLines.reduce((s, l) => s + l.totalRev, 0) + extEquipLines.reduce((s, l) => s + l.totalRev, 0);
              const equipTotalCost = equipLines.reduce((s, l) => s + l.totalCost, 0) + extEquipLines.reduce((s, l) => s + l.totalCost, 0);
              const equipTotalProfit = equipTotalRev - equipTotalCost;

              let perDiemRevTotal = 0;
              let perDiemCostTotal = 0;
              allEffectiveMembers.forEach(member => {
                const pd = getPerDiem(member.classification);
                const costAmt = (pd.amount || 0) * member.quantity * perDiemDaysNum * durationWeeks;
                const revAmt = pd.billable ? (pd.billingAmount || 0) * member.quantity * perDiemDaysNum * durationWeeks : 0;
                perDiemCostTotal += costAmt;
                perDiemRevTotal += revAmt;
              });
              const perDiemProfitTotal = perDiemRevTotal - perDiemCostTotal;

              const grandTotalRev = laborTotalRev + equipTotalRev + perDiemRevTotal;
              const grandTotalCost = laborTotalCost + equipTotalCost + perDiemCostTotal;
              const grandTotalProfit = grandTotalRev - grandTotalCost;
              const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 13 };

              return (
                <>
                  {/* Labor */}
                  {laborLines.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                        Labor
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 1000 }}>
                          <thead>
                            <tr style={{ background: "#f8fafc" }}>
                              {["Classification", "Type", "Qty", "Hours", "Cost / Hr", "Bill Rate / Hr", "Total Cost", "Total Revenue", "Profit", "Margin"].map((h, i) => (
                                <th key={i} style={{
                                  padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748b",
                                  textTransform: "uppercase", letterSpacing: "0.08em",
                                  textAlign: i < 1 ? "left" : i < 3 ? "center" : "right",
                                  borderBottom: "2px solid #e2e8f0"
                                }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {laborLines.map((line, idx) => (
                              <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{line.name}</td>
                                <td style={{ padding: "9px 14px", textAlign: "center" }}>
                                  <span style={{
                                    fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 4,
                                    background: line.type === "ST" ? "#ecfdf5" : "#fff7ed",
                                    color: line.type === "ST" ? "#4eb6ad" : "#ffb74c"
                                  }}>{line.type}</span>
                                </td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{line.qty}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{line.totalHours.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(line.loadedCost)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#1e40af", ...mono }}>{fmt(line.billingRate)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmtK(line.totalCost)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#0f172a", ...mono }}>{fmtK(line.totalRev)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: line.totalProfit >= 0 ? "#16a34a" : "#ef4444", ...mono }}>{fmtK(line.totalProfit)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: line.totalProfit >= 0 ? "#16a34a" : "#ef4444", ...mono }}>{line.totalRev > 0 ? (line.totalProfit / line.totalRev * 100).toFixed(1) + "%" : "—"}</td>
                              </tr>
                            ))}
                            <tr style={{ borderTop: "2px solid #e2e8f0", background: "#f8fafc" }}>
                              <td colSpan={6} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Total Labor</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#64748b", fontSize: 13, ...mono }}>{fmtK(laborTotalCost)}</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#1e40af", fontSize: 13, ...mono }}>{fmtK(laborTotalRev)}</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: laborTotalProfit >= 0 ? "#16a34a" : "#ef4444", fontSize: 13, ...mono }}>{fmtK(laborTotalProfit)}</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: laborTotalProfit >= 0 ? "#16a34a" : "#ef4444", fontSize: 13, ...mono }}>{laborTotalRev > 0 ? (laborTotalProfit / laborTotalRev * 100).toFixed(1) + "%" : "—"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Equipment */}
                  {(equipLines.length > 0 || extEquipLines.length > 0) && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                        Equipment
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 1000 }}>
                          <thead>
                            <tr style={{ background: "#f8fafc" }}>
                              {["Equipment", "Qty", "Days", "Cost Rate", "Bill Rate", "Total Cost", "Total Revenue", "Profit", "Margin"].map((h, i) => (
                                <th key={i} style={{
                                  padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748b",
                                  textTransform: "uppercase", letterSpacing: "0.08em",
                                  textAlign: i < 1 ? "left" : i < 3 ? "center" : "right",
                                  borderBottom: "2px solid #e2e8f0"
                                }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {equipLines.map((line, idx) => (
                              <tr key={`int-${idx}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{line.name}</td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{line.qty}</td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontSize: 12, color: "#64748b" }}>{line.durationDays} / {durationWorkingDays}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(line.unitCost)}/hr</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#1e40af", ...mono }}>{fmt(line.billingRate)}/hr</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmtK(line.totalCost)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#0f172a", ...mono }}>{fmtK(line.totalRev)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: line.totalProfit >= 0 ? "#16a34a" : "#ef4444", ...mono }}>{fmtK(line.totalProfit)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: line.totalProfit >= 0 ? "#16a34a" : "#ef4444", ...mono }}>{line.totalRev > 0 ? (line.totalProfit / line.totalRev * 100).toFixed(1) + "%" : "—"}</td>
                              </tr>
                            ))}
                            {extEquipLines.map((line, idx) => (
                              <tr key={`ext-${idx}`} style={{ borderBottom: "1px solid #f1f5f9", background: "#fffbeb" }}>
                                <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {line.name}
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#fff7ed", color: "#ffb74c", border: "1px solid #fed7aa", textTransform: "uppercase" }}>Rental</span>
                                  </div>
                                </td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{line.qty}</td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontSize: 12, color: "#64748b" }}>{line.durationDays} / {durationWorkingDays}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmtK(line.totalCost)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#1e40af", ...mono }}>{fmtK(line.totalRev)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmtK(line.totalCost)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#0f172a", ...mono }}>{fmtK(line.totalRev)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: line.totalProfit >= 0 ? "#16a34a" : "#ef4444", ...mono }}>{fmtK(line.totalProfit)}</td>
                                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: line.totalProfit >= 0 ? "#16a34a" : "#ef4444", ...mono }}>{line.totalRev > 0 ? (line.totalProfit / line.totalRev * 100).toFixed(1) + "%" : "—"}</td>
                              </tr>
                            ))}
                            <tr style={{ borderTop: "2px solid #e2e8f0", background: "#f8fafc" }}>
                              <td colSpan={5} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Total Equipment{rentalMarkupEnabled && extEquipLines.length > 0 ? ` (incl. ${rentalMarkupPct}% rental markup)` : ""}</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#64748b", fontSize: 13, ...mono }}>{fmtK(equipTotalCost)}</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#1e40af", fontSize: 13, ...mono }}>{fmtK(equipTotalRev)}</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: equipTotalProfit >= 0 ? "#16a34a" : "#ef4444", fontSize: 13, ...mono }}>{fmtK(equipTotalProfit)}</td>
                              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: equipTotalProfit >= 0 ? "#16a34a" : "#ef4444", fontSize: 13, ...mono }}>{equipTotalRev > 0 ? (equipTotalProfit / equipTotalRev * 100).toFixed(1) + "%" : "—"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </>
              );
            })()}
          </SectionCard>

          {/* === 7. PROJECT P&L === */}
          <SectionCard
            id="pnl"
            title="Project P&L"
            info="Projected profit & loss with direct costs, labor burden, and overhead broken out separately. Edit overhead assumptions via the sidebar."
            headerRight={
              (allEffectiveMembers.length > 0 || equipment.length > 0) ? (
                <button onClick={() => setShowRateSheet(true)} style={{
                  padding: "7px 16px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff",
                  color: "#1e40af", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3b82f6"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M12 8v3a1 1 0 01-1 1H3a1 1 0 01-1-1V8M8.5 1.5v7M5 5l3.5 3.5L12 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 7 7)"/>
                  </svg>
                  Rate Sheet
                </button>
              ) : null
            }
          >
            {allEffectiveMembers.length === 0 && equipment.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 13 }}>
                Build your crew and set rates to see the P&L projection.
              </div>
            ) : (() => {
              const totalManhours = pnl.totalCrew * hoursPerDay * daysPerWeek * durationWeeks;
              const revPerMH = totalManhours > 0 ? pnl.total.revenue / totalManhours : 0;
              const costPerMH = totalManhours > 0 ? pnl.total.totalCost / totalManhours : 0;
              const profitPerMH = totalManhours > 0 ? pnl.total.profit / totalManhours : 0;
              const totalDirect = pnl.total.laborCost + pnl.total.perDiemCost + pnl.total.equipCost;
              const totalGrossProfit = pnl.total.revenue - totalDirect - pnl.total.burden;
              const grossMarginPct = pnl.total.revenue > 0 ? totalGrossProfit / pnl.total.revenue : 0;
              const netMarginPct = pnl.total.revenue > 0 ? pnl.total.profit / pnl.total.revenue : 0;
              return (
              <>
                {/* Summary Cards — Row 1 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 12 }}>
                  {[
                    { label: "Total Revenue", value: fmtK(pnl.total.revenue), color: "#1e40af", bg: "#eff6ff" },
                    { label: "Gross Profit", value: fmtK(totalGrossProfit), color: totalGrossProfit >= 0 ? "#4eb6ad" : "#dc2626", bg: totalGrossProfit >= 0 ? "#ecfdf5" : "#fef2f2" },
                    { label: "Net Profit", value: fmtK(pnl.total.profit), color: pnl.total.profit >= 0 ? "#4eb6ad" : "#dc2626", bg: pnl.total.profit >= 0 ? "#ecfdf5" : "#fef2f2" },
                    { label: "Net Margin", value: (netMarginPct * 100).toFixed(1) + "%", color: netMarginPct >= 0 ? "#4eb6ad" : "#dc2626", bg: netMarginPct >= 0 ? "#ecfdf5" : "#fef2f2" }
                  ].map((card, i) => (
                    <div key={i} style={{
                      padding: "18px 20px", borderRadius: 8, background: card.bg, border: `1px solid ${card.bg}`
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{card.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: card.color, fontFamily: "'JetBrains Mono', monospace" }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Summary Cards — Row 2: Per Manhour */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
                  {[
                    { label: "Revenue / Manhour", value: fmt(revPerMH), color: "#1e40af" },
                    { label: "Cost / Manhour", value: fmt(costPerMH), color: "#dc2626" },
                    { label: "Profit / Manhour", value: fmt(profitPerMH), color: profitPerMH >= 0 ? "#4eb6ad" : "#dc2626" },
                    { label: "Total Manhours", value: totalManhours.toLocaleString(), color: "#475569" },
                  ].map((card, i) => (
                    <div key={i} style={{
                      padding: "14px 20px", borderRadius: 8, background: "#fff",
                      border: "1px solid #e2e8f0"
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{card.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: card.color, fontFamily: "'JetBrains Mono', monospace" }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* P&L Table */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "200px 1fr 1fr 1fr",
                    background: "#f8fafc", padding: "10px 16px", borderBottom: "1px solid #e2e8f0",
                    fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em"
                  }}>
                    <div></div><div style={{ textAlign: "right" }}>Per Day</div>
                    <div style={{ textAlign: "right" }}>Per Week</div>
                    <div style={{ textAlign: "right" }}>Total Job</div>
                  </div>
                  {(() => {
                    const pctStr = (rev, val) => rev > 0 ? ((val / rev) * 100).toFixed(1) + "%" : "—";
                    const lb = pnl.laborBreakdown;
                    const eb = pnl.equipBreakdown;

                    const chevron = (expanded) => (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
                        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.15s", marginRight: 6, flexShrink: 0
                      }}>
                        <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    );

                    const renderRow = (row, key) => {
                      if (row.divider) return <div key={key} style={{ borderBottom: "1px solid #e2e8f0" }} />;
                      return (
                        <div key={key} style={{
                          display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr",
                          padding: row.sub ? "7px 16px 7px 36px" : "10px 16px",
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: row.sub ? 12 : 13,
                          background: row.sub ? "#fafbfc" : "transparent",
                          cursor: row.toggle ? "pointer" : "default",
                          userSelect: row.toggle ? "none" : "auto"
                        }}
                          onClick={row.toggle || undefined}
                        >
                          <div style={{
                            fontWeight: row.bold ? 600 : 400,
                            fontStyle: row.italic ? "italic" : "normal",
                            color: row.sub ? "#94a3b8" : "#0f172a",
                            display: "flex", alignItems: "center"
                          }}>
                            {row.toggle && chevron(row.expanded)}
                            {row.label}
                          </div>
                          {(row.textValues || row.values).map((v, vi) => (
                            <div key={vi} style={{
                              textAlign: "right",
                              fontWeight: row.bold ? 700 : row.sub ? 400 : 500,
                              fontStyle: row.italic ? "italic" : "normal",
                              color: row.sub ? "#94a3b8" : (row.color || "#0f172a"),
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: row.sub ? 12 : 13
                            }}>{row.textValues ? v : fmtWhole(v)}</div>
                          ))}
                        </div>
                      );
                    };

                    const rows = [];
                    // Revenue
                    rows.push({ label: "Revenue (Labor)", values: [pnl.daily.revenue - pnl.daily.perDiemRevenue - pnl.daily.equipRevenue, pnl.weekly.revenue - pnl.weekly.perDiemRevenue - pnl.weekly.equipRevenue, pnl.total.revenue - pnl.total.perDiemRevenue - pnl.total.equipRevenue], color: "#0f172a" });
                    rows.push({ label: "Revenue (Per Diem)", values: [pnl.daily.perDiemRevenue, pnl.weekly.perDiemRevenue, pnl.total.perDiemRevenue], color: "#0f172a" });
                    rows.push({ label: "Revenue (Equipment)", values: [pnl.daily.equipRevenue, pnl.weekly.equipRevenue, pnl.total.equipRevenue], color: "#0f172a" });
                    rows.push({ label: "Total Revenue", values: [pnl.daily.revenue, pnl.weekly.revenue, pnl.total.revenue], bold: true, color: "#0f172a" });
                    rows.push({ divider: true });

                    // Direct Costs
                    rows.push({ label: "Wages (ST + OT)", values: [pnl.daily.laborCost, pnl.weekly.laborCost, pnl.total.laborCost], color: "#64748b" });
                    rows.push({ label: "Per Diem Cost", values: [pnl.daily.perDiemCost, pnl.weekly.perDiemCost, pnl.total.perDiemCost], color: "#64748b" });
                    rows.push({ label: "Equipment Cost", values: [pnl.daily.equipCost, pnl.weekly.equipCost, pnl.total.equipCost], color: "#64748b", toggle: () => setEquipCostExpanded(p => !p), expanded: equipCostExpanded });
                    if (equipCostExpanded) {
                      rows.push({ label: "Internal Unit Cost", values: [eb.internal.daily, eb.internal.weekly, eb.internal.total], sub: true });
                      rows.push({ label: "Fuel Cost", values: [eb.fuel.daily, eb.fuel.weekly, eb.fuel.total], sub: true });
                      if (pnl.hasRental) {
                        rows.push({ label: "Equipment Rental", values: [eb.rental.daily, eb.rental.weekly, eb.rental.total], sub: true });
                      }
                    }
                    const dailyDirect = pnl.daily.laborCost + pnl.daily.perDiemCost + pnl.daily.equipCost;
                    const weeklyDirect = pnl.weekly.laborCost + pnl.weekly.perDiemCost + pnl.weekly.equipCost;
                    const totalDirect = pnl.total.laborCost + pnl.total.perDiemCost + pnl.total.equipCost;
                    rows.push({ label: "Total Direct Cost", values: [dailyDirect, weeklyDirect, totalDirect], bold: true, color: "#64748b" });
                    rows.push({ divider: true });

                    // Labor Burden
                    rows.push({ label: "Labor Burden", values: [pnl.daily.burden, pnl.weekly.burden, pnl.total.burden], color: "#64748b", toggle: () => setBurdenExpanded(p => !p), expanded: burdenExpanded });
                    if (burdenExpanded) {
                      rows.push({ label: "Workers' Comp (0.92%)", values: [lb.workersComp.daily, lb.workersComp.weekly, lb.workersComp.total], sub: true });
                      rows.push({ label: "Benefits (5.40%)", values: [lb.benefits.daily, lb.benefits.weekly, lb.benefits.total], sub: true });
                      rows.push({ label: "Payroll Taxes (8.18%)", values: [lb.payrollTax.daily, lb.payrollTax.weekly, lb.payrollTax.total], sub: true });
                    }
                    rows.push({ divider: true });

                    // Gross Profit
                    const dailyGross = pnl.daily.revenue - dailyDirect - pnl.daily.burden;
                    const weeklyGross = pnl.weekly.revenue - weeklyDirect - pnl.weekly.burden;
                    const totalGross = pnl.total.revenue - totalDirect - pnl.total.burden;
                    rows.push({ label: "Gross Profit", values: [dailyGross, weeklyGross, totalGross], bold: true, color: totalGross >= 0 ? "#4eb6ad" : "#dc2626" });
                    rows.push({ label: "Gross Margin", textValues: [pctStr(pnl.daily.revenue, dailyGross), pctStr(pnl.weekly.revenue, weeklyGross), pctStr(pnl.total.revenue, totalGross)], color: totalGross >= 0 ? "#4eb6ad" : "#dc2626", italic: true });
                    rows.push({ divider: true });

                    // Overhead
                    const ob = pnl.overheadBreakdown;
                    rows.push({ label: "Overhead — % of Revenue", values: [ob.revPct.daily, ob.revPct.weekly, ob.revPct.total], color: "#64748b", toggle: () => setOhRevExpanded(p => !p), expanded: ohRevExpanded });
                    if (ohRevExpanded) {
                      rows.push({ label: `General Overhead (${overhead.generalOverhead}%)`, values: [ob.revDetail.generalOverhead / (daysPerWeek || 1), ob.revDetail.generalOverhead, ob.revDetail.generalOverhead * durationWeeks], sub: true });
                      if (overhead.glInsurance > 0) rows.push({ label: `GL Insurance (${overhead.glInsurance}%)`, values: [ob.revDetail.glInsurance / (daysPerWeek || 1), ob.revDetail.glInsurance, ob.revDetail.glInsurance * durationWeeks], sub: true });
                    }
                    rows.push({ label: "Overhead — Weekly Fixed", values: [ob.fixed.daily, ob.fixed.weekly, ob.fixed.total], color: "#64748b", toggle: () => setOhWeeklyExpanded(p => !p), expanded: ohWeeklyExpanded });
                    if (ohWeeklyExpanded) {
                      const fixedItems = [
                        ["Supplies", "supplies"], ["Telephone", "telephone"], ["Postage", "postage"],
                        ["New Hire & Uniform", "newHireUniform"], ["Safety", "safety"], ["Incident/Repairs", "incidentRepairs"],
                        ["Tools", "tools"], ["Other Job Costs", "otherJobCosts"], ["Equip Repairs/Maint", "equipRepairsMaint"]
                      ];
                      fixedItems.forEach(([label, key]) => {
                        if (ob.fixedDetail[key] > 0) {
                          rows.push({ label, values: [ob.fixedDetail[key] / (daysPerWeek || 1), ob.fixedDetail[key], ob.fixedDetail[key] * durationWeeks], sub: true });
                        }
                      });
                    }
                    rows.push({ label: "Total Overhead", values: [pnl.daily.overhead, pnl.weekly.overhead, pnl.total.overhead], bold: true, color: "#64748b" });
                    rows.push({ divider: true });

                    // Net Profit
                    rows.push({ label: "Net Profit", values: [pnl.daily.profit, pnl.weekly.profit, pnl.total.profit], bold: true, color: pnl.total.profit >= 0 ? "#4eb6ad" : "#dc2626" });
                    rows.push({ label: "Net Margin", textValues: [pctStr(pnl.daily.revenue, pnl.daily.profit), pctStr(pnl.weekly.revenue, pnl.weekly.profit), pctStr(pnl.total.revenue, pnl.total.profit)], color: pnl.total.profit >= 0 ? "#4eb6ad" : "#dc2626", italic: true });

                    return rows.map((row, i) => renderRow(row, i));
                  })()}
                </div>

                {/* Job Assumptions Footer */}
                <div style={{
                  marginTop: 16, padding: "14px 16px", background: "#f8fafc", borderRadius: 8,
                  fontSize: 12, color: "#64748b", display: "flex", gap: 24, flexWrap: "wrap"
                }}>
                  <span><strong>Duration:</strong> {durationWeeks.toFixed(1)} wks</span>
                  <span><strong>Schedule:</strong> {daysPerWeek}d × {hoursPerDay}h = {weeklyTotalHours}h/wk ({weeklyStHours}h ST + {weeklyOtHours}h OT{hasOT ? ` after ${otThreshold}h @ ${otMultiplier}×` : ""})</span>
                  <span><strong>Crew:</strong> {pnl.totalCrew} workers</span>
                  <span><strong>Equipment:</strong> {equipment.length > 0 ? `${equipment.reduce((s, e) => s + e.quantity, 0)} units` : "N/A"}</span>
                  <span><strong>Per Diem:</strong> {perDiemDaysNum > 0 ? `${perDiemDaysNum} days/wk` : "N/A"}</span>
                  <span><strong>Overhead:</strong> {fmtK(pnl.weekly.overhead)}/wk</span>
                </div>
              </>
              );
            })()}
          </SectionCard>

          {/* === CLASSIFICATION REFERENCE MODAL === */}
          {showClassRef && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)"
            }} onClick={() => setShowClassRef(false)}>
              <div style={{
                background: "#fff", borderRadius: 16, width: "90%", maxWidth: 820, maxHeight: "85vh",
                overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }} onClick={e => e.stopPropagation()}>
                <div style={{
                  padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex",
                  alignItems: "center", justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Labor Rate Reference</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {laborType === "union" ? `${unionPayScaleLocal || "Union"} — ST rates with loaded costs` : "Non-Union — ST rates with loaded costs"}
                    </div>
                  </div>
                  <button onClick={() => setShowClassRef(false)} style={{
                    background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94a3b8", padding: 4
                  }}>✕</button>
                </div>
                <div style={{ overflow: "auto", padding: "0 24px 24px" }}>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, marginTop: 16 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", position: "sticky", top: 0 }}>
                        {["Classification", "ST Wage", "W/C (0.92%)", laborType === "union" ? "Benefits" : "Benefits (5.4%)", "Payroll (8.18%)", "Loaded Cost"].map((h, i) => (
                          <th key={i} style={{
                            padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748b",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            textAlign: i === 0 ? "left" : "right",
                            borderBottom: "2px solid #e2e8f0", background: "#f8fafc"
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {laborType === "union" && unionPayScaleData
                        ? Object.keys(unionPayScaleData.classifications).map((classif, idx) => {
                          const ps = unionPayScaleData.classifications[classif];
                          const ben = unionBenefitsData ? (unionBenefitsData[classif] || 0) : 0;
                          const wc = ps.st * 0.0092;
                          const pt = ps.st * 0.09;
                          const loaded = ps.st + wc + ben + pt;
                          const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 13 };
                          return (
                            <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fafbfc" : "#fff" }}>
                              <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{classif}</td>
                              <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#0f172a", ...mono }}>{fmt(ps.st)}</td>
                              <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(wc)}</td>
                              <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(ben)}</td>
                              <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(pt)}</td>
                              <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: "#1e40af", ...mono }}>{fmt(loaded)}</td>
                            </tr>
                          );
                        })
                        : NON_UNION_CLASSIFICATIONS.map((classif, idx) => {
                        const rd = getRateData(classif, "ST");
                        const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 13 };
                        return (
                          <tr key={idx} style={{
                            borderBottom: "1px solid #f1f5f9",
                            background: idx % 2 === 0 ? "#fafbfc" : "#fff"
                          }}>
                            <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{classif}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#0f172a", ...mono }}>{fmt(rd.wage)}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(rd.workersComp)}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(rd.benefits)}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", color: "#64748b", ...mono }}>{fmt(rd.payrollTax)}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: "#1e40af", ...mono }}>{fmt(rd.loadedCost)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* === EQUIPMENT REFERENCE MODAL === */}
          {showEquipRef && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)"
            }} onClick={() => setShowEquipRef(false)}>
              <div style={{
                background: "#fff", borderRadius: 16, width: "90%", maxWidth: 780, maxHeight: "85vh",
                overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }} onClick={e => e.stopPropagation()}>
                <div style={{
                  padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex",
                  alignItems: "center", justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Equipment Rate Reference</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      Internal equipment — 2025 hourly rates
                    </div>
                  </div>
                  <button onClick={() => setShowEquipRef(false)} style={{
                    background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94a3b8", padding: 4
                  }}>✕</button>
                </div>
                <div style={{ overflow: "auto", padding: "0 24px 24px" }}>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, marginTop: 16 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", position: "sticky", top: 0 }}>
                        {["Equip ID", "Description", "Unit Cost / Hr", "Fuel Cost / Hr", "Total / Hr"].map((h, i) => (
                          <th key={i} style={{
                            padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748b",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            textAlign: i < 2 ? "left" : "right",
                            borderBottom: "2px solid #e2e8f0", background: "#f8fafc"
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {EQUIPMENT_LIST.map((name, idx) => {
                        const eq = EQUIPMENT_INTERNAL_RATES[name];
                        const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 13 };
                        return (
                          <tr key={idx} style={{
                            borderBottom: "1px solid #f1f5f9",
                            background: idx % 2 === 0 ? "#fafbfc" : "#fff"
                          }}>
                            <td style={{ padding: "9px 14px", fontSize: 11, fontWeight: 600, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{eq.id}</td>
                            <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{name}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", color: "#0f172a", fontWeight: 600, ...mono }}>{fmt(eq.unitCost)}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", color: eq.fuelCost > 0 ? "#64748b" : "#cbd5e1", ...mono }}>{eq.fuelCost > 0 ? fmt(eq.fuelCost) : "—"}</td>
                            <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: "#1e40af", ...mono }}>{fmt(eq.unitCost + eq.fuelCost)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* === HISTORY DRAWER === */}

          {/* === OVERHEAD ASSUMPTIONS DRAWER === */}
          {showOverheadRef && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)"
            }} onClick={() => setShowOverheadRef(false)}>
              <div style={{
                background: "#fff", borderRadius: 16, width: "90%", maxWidth: 640, maxHeight: "85vh",
                overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }} onClick={e => e.stopPropagation()}>
                <div style={{
                  padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex",
                  alignItems: "center", justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Overhead Assumptions</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      Edit burden rates, overhead percentages, and weekly fixed costs
                    </div>
                  </div>
                  <button onClick={() => setShowOverheadRef(false)} style={{
                    background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94a3b8", padding: 4
                  }}>✕</button>
                </div>
                <div style={{ overflow: "auto", padding: "16px 24px 24px" }}>
                  {(() => {
                    const ohInput = (label, key, suffix, desc) => (
                      <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{label}</div>
                          {desc && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{desc}</div>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <input
                            type="number"
                            step={suffix === "%" ? "0.01" : "0.50"}
                            value={overhead[key] ?? ""}
                            onChange={e => setOH(key, e.target.value === "" ? 0 : parseFloat(e.target.value))}
                            style={{
                              width: 90, padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0",
                              fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textAlign: "right",
                              outline: "none"
                            }}
                            onFocus={e => e.target.style.borderColor = "#3b82f6"}
                            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                          />
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, width: 30 }}>{suffix}</span>
                        </div>
                      </div>
                    );

                    const sectionStyle = (isOpen) => ({
                      border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 12,
                      overflow: "hidden"
                    });
                    const sectionHeader = (label, color, isOpen, toggle) => (
                      <div onClick={toggle} style={{
                        padding: "12px 16px", background: color, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none"
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
                            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s"
                          }}>
                            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {label}
                        </div>
                      </div>
                    );

                    const [s1, setS1] = [ohRevExpanded, setOhRevExpanded];
                    const [s3, setS3] = [ohWeeklyExpanded, setOhWeeklyExpanded];

                    return (
                      <>
                        <div style={sectionStyle(s1)}>
                          {sectionHeader("% of Revenue", "#eff6ff", s1, () => setS1(p => !p))}
                          {s1 && <div style={{ padding: "4px 16px 12px" }}>
                            {ohInput("General Overhead", "generalOverhead", "%", "Applied to total weekly revenue")}
                            {ohInput("GL Insurance Rate", "glInsurance", "%", "General liability insurance")}
                          </div>}
                        </div>

                        <div style={sectionStyle(s3)}>
                          {sectionHeader("Weekly Fixed Costs", "#fef3c7", s3, () => setS3(p => !p))}
                          {s3 && <div style={{ padding: "4px 16px 12px" }}>
                            {ohInput("Supplies", "supplies", "$/wk")}
                            {ohInput("Telephone", "telephone", "$/wk")}
                            {ohInput("Postage", "postage", "$/wk")}
                            {ohInput("New Hire & Uniform", "newHireUniform", "$/wk")}
                            {ohInput("Safety", "safety", "$/wk")}
                            {ohInput("Incident/Repairs", "incidentRepairs", "$/wk")}
                            {ohInput("Tools", "tools", "$/wk")}
                            {ohInput("Other Job Costs", "otherJobCosts", "$/wk")}
                            {ohInput("Equip Repairs/Maint", "equipRepairsMaint", "$/wk")}
                          </div>}
                        </div>

                        <div style={{
                          padding: "12px 16px", background: "#f8fafc", borderRadius: 8, marginTop: 4,
                          display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                          <div style={{ fontSize: 12, color: "#64748b" }}>Total weekly overhead</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" }}>
                            {fmt(pnl.weekly.overhead)}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
          {showHistory && (
            <div style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: 400, zIndex: 250,
              background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
              display: "flex", flexDirection: "column"
            }}>
              {/* Header */}
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Bid History</div>
                <button onClick={() => setShowHistory(false)} style={{
                  background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18, padding: 4
                }}>✕</button>
              </div>

              {/* Timeline */}
              <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 0 }}>
                {historyEntries.map((entry, idx) => {
                  const isSystem = entry.type === "system";
                  const prevEntry = idx > 0 ? historyEntries[idx - 1] : null;
                  const showDate = !prevEntry || entry.timestamp.toDateString() !== prevEntry.timestamp.toDateString();
                  const timeStr = entry.timestamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                  const dateStr = entry.timestamp.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

                  return (
                    <div key={idx}>
                      {showDate && (
                        <div style={{
                          textAlign: "center", padding: "12px 0 8px", fontSize: 11, fontWeight: 600,
                          color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em"
                        }}>
                          {dateStr}
                        </div>
                      )}
                      {isSystem ? (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 0"
                        }}>
                          <div style={{
                            width: 8, height: 8, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0
                          }} />
                          <div style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{entry.text}</div>
                          <div style={{ fontSize: 10, color: "#cbd5e1", flexShrink: 0 }}>{timeStr}</div>
                        </div>
                      ) : (
                        <div style={{
                          margin: "6px 0", padding: "10px 14px",
                          background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0",
                          marginLeft: 18
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#1e40af" }}>{entry.user}</span>
                            <span style={{ fontSize: 10, color: "#94a3b8" }}>{timeStr}</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{entry.text}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={historyEndRef} />
              </div>

              {/* Comment Input */}
              <div style={{
                padding: "12px 20px", borderTop: "1px solid #e2e8f0", background: "#fafbfc"
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text" value={historyComment}
                    onChange={e => setHistoryComment(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && historyComment.trim()) {
                        setHistoryEntries(prev => [...prev, {
                          type: "comment", text: historyComment.trim(),
                          user: "Ben M.", timestamp: new Date()
                        }]);
                        setHistoryComment("");
                        setTimeout(() => historyEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
                      }
                    }}
                    placeholder="Add a comment..."
                    style={{
                      flex: 1, padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6,
                      fontSize: 13, color: "#0f172a", background: "#fff",
                      outline: "none", boxSizing: "border-box"
                    }}
                    onFocus={e => e.target.style.borderColor = "#3b82f6"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                  <button
                    onClick={() => {
                      if (!historyComment.trim()) return;
                      setHistoryEntries(prev => [...prev, {
                        type: "comment", text: historyComment.trim(),
                        user: "Ben M.", timestamp: new Date()
                      }]);
                      setHistoryComment("");
                      setTimeout(() => historyEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
                    }}
                    disabled={!historyComment.trim()}
                    style={{
                      padding: "9px 16px", borderRadius: 6, border: "none",
                      background: historyComment.trim() ? "#3b82f6" : "#e2e8f0",
                      color: historyComment.trim() ? "#fff" : "#94a3b8",
                      fontSize: 13, fontWeight: 600, cursor: historyComment.trim() ? "pointer" : "default",
                      transition: "all 0.15s"
                    }}
                  >Send</button>
                </div>
              </div>
            </div>
          )}

          {/* === RATE SHEET MODAL === */}
          {showRateSheet && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)"
            }} onClick={() => setShowRateSheet(false)}>
              <div style={{
                background: "#fff", borderRadius: 12, width: "90%", maxWidth: 900, maxHeight: "85vh",
                overflow: "auto", padding: "36px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                position: "relative"
              }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Rate Sheet</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                      {bidName || "Project"} — {utility || "Utility"}
                    </h3>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                      {serviceType} · {locationState}
                    </div>
                  </div>
                  <button onClick={() => setShowRateSheet(false)} style={{
                    background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20, padding: 4
                  }}>✕</button>
                </div>

                {/* Labor Rates */}
                {uniqueClassifications.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                      Labor Rates
                    </div>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0" }}>Classification</th>
                          <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", width: 60 }}>Type</th>
                          <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", width: 130 }}>Billing Rate / Hr</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueClassifications.map((classif, cIdx) => {
                          const hourTypes = hasOT ? ["ST", "OT"] : ["ST"];
                          return hourTypes.map((ht, htIdx) => {
                            const data = getRateData(classif, ht);
                            return (
                              <tr key={`${cIdx}-${ht}`} style={{
                                borderBottom: "1px solid #f1f5f9",
                                background: htIdx === 0 && cIdx % 2 === 0 ? "#fafbfc" : "#fff"
                              }}>
                                {htIdx === 0 ? (
                                  <td rowSpan={hourTypes.length} style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#0f172a", borderBottom: "1px solid #e2e8f0", verticalAlign: "middle" }}>
                                    {classif}
                                  </td>
                                ) : null}
                                <td style={{ padding: "8px 16px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
                                  <span style={{
                                    fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 4,
                                    background: ht === "ST" ? "#ecfdf5" : "#fff7ed",
                                    color: ht === "ST" ? "#4eb6ad" : "#ffb74c"
                                  }}>{ht}</span>
                                </td>
                                <td style={{ padding: "8px 16px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#1e40af", fontFamily: "'JetBrains Mono', monospace", borderBottom: "1px solid #f1f5f9" }}>
                                  {fmt(data.billingRate)}
                                </td>
                              </tr>
                            );
                          });
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Equipment Rates */}
                {equipment.filter(eq => !eq.isExternal && eq.billable !== false).length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                      Equipment Rates
                    </div>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0" }}>Equipment</th>
                          <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", width: 130 }}>Billing Rate / Hr</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipment.filter(eq => !eq.isExternal && eq.billable !== false).map((eq, idx) => {
                          const rd = getEquipRateData(eq);
                          return (
                            <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fafbfc" : "#fff" }}>
                              <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{eq.name}</td>
                              <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#1e40af", fontFamily: "'JetBrains Mono', monospace" }}>
                                {fmt(rd.billingRate)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  marginTop: 28, paddingTop: 20, borderTop: "1px solid #e2e8f0",
                  fontSize: 11, color: "#94a3b8", display: "flex", justifyContent: "space-between"
                }}>
                  <span>Generated from Gridbase Project Estimates | T&E Bid Sheet</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 3px solid #3b82f6; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%; background: #fff;
          border: 3px solid #3b82f6; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        * { box-sizing: border-box; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        ::selection { background: #bfdbfe; }
      `}</style>
    </div>
  );
}
