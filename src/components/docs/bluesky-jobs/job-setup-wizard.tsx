import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  X,
  FileText,
  Settings,
  MapPin,
  Users,
  ClipboardCheck,
  Search,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Trash2,
  Briefcase,
  Building2,
  Truck,
  HardHat,
  Wrench,
  AlertTriangle,
  Info,
  GripVertical,
  FolderTree,
  Layers,
  Eye,
  Pencil,
  Columns3,
  ArrowLeft,
  Clock,
  DollarSign,
  MessageSquare,
  UserCircle,
  PackagePlus,
  Hash,
  Upload,
  MoreVertical,
  CheckSquare,
  Download,
  SendHorizontal,
  Unlock,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  SAMPLE DATA
// ═══════════════════════════════════════════════════════════════

const SAMPLE_UTILITIES = [
  { id: "util-a", name: "Tri-County Electric Cooperative", location: "Madison, FL", type: "Cooperative" },
  { id: "util-b", name: "Southern Grid Power", location: "Atlanta, GA", type: "IOU" },
  { id: "util-c", name: "Lakeshore Municipal Power", location: "Hammond, LA", type: "Municipal" },
  { id: "util-d", name: "Ridgeline Energy", location: "Greenville, SC", type: "IOU" },
  { id: "util-e", name: "Valley Light & Power", location: "Mooresville, NC", type: "Municipal" },
];

const SAMPLE_CONTRACTS = [
  { id: "tce-oh-2026", utilityId: "util-a", name: "Tri-County – OH Distribution 2026", type: "Unit-Price", workType: "OH Distribution", status: "Active", cuLibrary: "Tri-County OH 2026", rateType: "Per Classification", invoiceCadence: "Per Work Item", invoiceGrouping: "By Work Item", invoiceDetail: "By Function", startDate: "2026-01-01", endDate: "2026-12-31" },
  { id: "sgp-ug-yr4", utilityId: "util-b", name: "Southern Grid – UG Distribution Year 4", type: "Unit-Price", workType: "UG Distribution", status: "Active", cuLibrary: "Southern Grid UG Year 4", rateType: "Per Classification", invoiceCadence: "Periodic (Weekly)", invoiceGrouping: "By Work Item", invoiceDetail: "Line Item Detail", startDate: "2025-04-01", endDate: "2026-03-31" },
  { id: "lmp-oh-2025", utilityId: "util-c", name: "Lakeshore Municipal – OH Distribution 2025", type: "Unit-Price", workType: "OH Distribution", status: "Active", cuLibrary: "Lakeshore OH 2025", rateType: "Per Classification", invoiceCadence: "Periodic (Weekly)", invoiceGrouping: "By Work Item", invoiceDetail: "Summary", startDate: "2025-01-01", endDate: "" },
  { id: "re-oh-2026", utilityId: "util-d", name: "Ridgeline Energy – OH Distribution", type: "Unit-Price", workType: "OH Distribution", status: "Active", cuLibrary: "Ridgeline OH 2026", rateType: "Per Classification", invoiceCadence: "Periodic (Weekly)", invoiceGrouping: "By Project", invoiceDetail: "By Function", startDate: "2026-02-01", endDate: "" },
  { id: "vlp-oh-2026", utilityId: "util-e", name: "Valley Light – OH Distribution", type: "Unit-Price", workType: "OH Distribution", status: "Active", cuLibrary: "Valley Light OH 2026", rateType: "Per Classification", invoiceCadence: "Periodic (Weekly)", invoiceGrouping: "By Project", invoiceDetail: "Summary", startDate: "2026-01-15", endDate: "" },
];

const SAMPLE_UNION_LOCALS = [
  { id: "lu2", name: "LU 2", location: "St. Louis, MO" },
  { id: "lu71", name: "LU 71", location: "Columbus, OH" },
  { id: "lu379", name: "LU 379", location: "Charlotte, NC" },
  { id: "lu613", name: "LU 613", location: "Atlanta, GA" },
  { id: "lu915", name: "LU 915", location: "Tampa, FL" },
  { id: "lu1049", name: "LU 1049", location: "Long Island, NY" },
  { id: "lu1600", name: "LU 1600", location: "Harrisburg, PA" },
];

const SAMPLE_PERSONNEL = [
  { id: "p1", name: "Jason Turner", classification: "Foreman", status: "Available" },
  { id: "p2", name: "Chris Echele", classification: "Foreman", status: "Available" },
  { id: "p3", name: "Mike Rodriguez", classification: "Journeyman Lineman", status: "Available" },
  { id: "p4", name: "Travis Cummings", classification: "Journeyman Lineman", status: "On Job" },
  { id: "p5", name: "Kyle Bennett", classification: "Journeyman Lineman", status: "Available" },
  { id: "p6", name: "Ryan Cooper", classification: "Apprentice 7", status: "Available" },
  { id: "p7", name: "David Marshall", classification: "Apprentice 3", status: "Available" },
  { id: "p8", name: "Sam Torres", classification: "Groundman", status: "Available" },
  { id: "p9", name: "Nick Alvarez", classification: "Operator", status: "On Job" },
  { id: "p10", name: "Jake Simmons", classification: "CDL Driver", status: "Available" },
];

const SAMPLE_EQUIPMENT = [
  { id: "e1", name: "BT-5885", type: "Bucket Truck (55')", costCode: "BK552", status: "Available" },
  { id: "e2", name: "BT-9623", type: "Bucket Truck (55')", costCode: "BK552", status: "Available" },
  { id: "e3", name: "DD-3051", type: "Digger Derrick", costCode: "DGT2", status: "Available" },
  { id: "e4", name: "PU-4348", type: "Pickup Truck", costCode: "PUT2", status: "Available" },
  { id: "e5", name: "PU-0973", type: "Pickup Truck", costCode: "PUT2", status: "On Job" },
  { id: "e6", name: "PT-4096", type: "Pole Trailer", costCode: "TRAP", status: "Available" },
  { id: "e7", name: "PULL-0021", type: "Puller", costCode: "PULL", status: "Available" },
  { id: "e8", name: "TENS-0024", type: "Tensioner", costCode: "TENS", status: "Available" },
  { id: "e9", name: "BYM-0009", type: "Backyard Machine", costCode: "BYARD", status: "Available" },
  { id: "e10", name: "MT-1122", type: "Material Trailer", costCode: "TRAM", status: "Available" },
];

const SAMPLE_JOBS = [
  { id: "JOB-001", name: "North District – Batch 12", utility: "Tri-County Electric Cooperative", contract: "Tri-County – OH Distribution 2026", contractType: "Unit-Price", workType: "OH Distribution", status: "Active", city: "Madison", state: "FL", startDate: "2026-03-01", billedToDate: "$18,240.00", cusCompleted: 47, woCount: 8 },
  { id: "JOB-002", name: "Westside UG Expansion", utility: "Southern Grid Power", contract: "Southern Grid – UG Distribution Year 4", contractType: "Unit-Price", workType: "UG Distribution", status: "Active", city: "Marietta", state: "GA", startDate: "2025-11-15", billedToDate: "$142,680.00", cusCompleted: 312, woCount: 24 },
  { id: "JOB-003", name: "Main St Pole Replacement", utility: "Lakeshore Municipal Power", contract: "Lakeshore Municipal – OH Distribution 2025", contractType: "Unit-Price", workType: "OH Distribution", status: "Active", city: "Hammond", state: "LA", startDate: "2025-10-01", billedToDate: "$86,340.00", cusCompleted: 189, woCount: 12 },
  { id: "JOB-004", name: "Hwy 76 Tie Line Rebuild", utility: "Ridgeline Energy", contract: "Ridgeline Energy – OH Distribution", contractType: "Unit-Price", workType: "OH Distribution", status: "Active", city: "Greenville", state: "SC", startDate: "2026-02-10", billedToDate: "$22,340.74", cusCompleted: 80, woCount: 1 },
  { id: "JOB-005", name: "Feeder 4 Reconductoring", utility: "Valley Light & Power", contract: "Valley Light – OH Distribution", contractType: "Unit-Price", workType: "OH Distribution", status: "Pending", city: "Mooresville", state: "NC", startDate: "2026-04-15", billedToDate: "$0.00", cusCompleted: 0, woCount: 0 },
];

// ═══════════════════════════════════════════════════════════════
//  SAMPLE WO DATA (for Job Detail view)
// ═══════════════════════════════════════════════════════════════

const SAMPLE_WOS: Record<string, any[]> = {
  "JOB-001": [
    { id: "WO-27443", region: "North", priority: "Normal", station: "Z2F-035 thru Z2F-040", serviceCenter: "Madison SC", risDate: "2026-04-30", status: "In Progress", cusTotal: 19, cusCompleted: 11, crew: "Crew A – Rivera", lastActivity: "2 hrs ago" },
    { id: "WO-27444", region: "North", priority: "Normal", station: "Z2F-041 thru Z2F-048", serviceCenter: "Madison SC", risDate: "2026-05-15", status: "In Progress", cusTotal: 24, cusCompleted: 8, crew: "Crew A – Rivera", lastActivity: "2 hrs ago" },
    { id: "WO-27445", region: "North", priority: "Rush", station: "Z2F-049 thru Z2F-052", serviceCenter: "Madison SC", risDate: "2026-04-18", status: "In Progress", cusTotal: 14, cusCompleted: 14, crew: "Crew B – Thompson", lastActivity: "1 day ago" },
    { id: "WO-27446", region: "North", priority: "Normal", station: "Z3A-001 thru Z3A-006", serviceCenter: "Madison SC", risDate: "2026-05-30", status: "Not Started", cusTotal: 16, cusCompleted: 0, crew: "Unassigned", lastActivity: "—" },
    { id: "WO-27447", region: "East", priority: "Normal", station: "Z3A-007 thru Z3A-015", serviceCenter: "Lee SC", risDate: "2026-06-15", status: "Not Started", cusTotal: 22, cusCompleted: 0, crew: "Unassigned", lastActivity: "—" },
    { id: "WO-27448", region: "East", priority: "Normal", station: "Z3A-016 thru Z3A-020", serviceCenter: "Lee SC", risDate: "2026-06-30", status: "Not Started", cusTotal: 12, cusCompleted: 0, crew: "Unassigned", lastActivity: "—" },
    { id: "WO-27449", region: "North", priority: "Normal", station: "Z2F-053 thru Z2F-058", serviceCenter: "Madison SC", risDate: "2026-05-01", status: "Complete", cusTotal: 15, cusCompleted: 15, crew: "Crew B – Thompson", lastActivity: "3 days ago" },
    { id: "WO-27450", region: "North", priority: "Normal", station: "Z2F-059 thru Z2F-063", serviceCenter: "Madison SC", risDate: "2026-04-20", status: "Complete", cusTotal: 11, cusCompleted: 11, crew: "Crew A – Rivera", lastActivity: "1 wk ago" },
  ],
  "JOB-002": [
    { id: "WO-50881", region: "West", priority: "Normal", station: "UG-SEC-101", serviceCenter: "Marietta SC", risDate: "2026-03-30", status: "In Progress", cusTotal: 32, cusCompleted: 28, crew: "Crew C – Davis", lastActivity: "4 hrs ago" },
    { id: "WO-50882", region: "West", priority: "Normal", station: "UG-SEC-102", serviceCenter: "Marietta SC", risDate: "2026-04-15", status: "In Progress", cusTotal: 28, cusCompleted: 14, crew: "Crew C – Davis", lastActivity: "4 hrs ago" },
    { id: "WO-50883", region: "South", priority: "Rush", station: "UG-SEC-103", serviceCenter: "Smyrna SC", risDate: "2026-04-01", status: "Complete", cusTotal: 18, cusCompleted: 18, crew: "Crew D – Martinez", lastActivity: "2 days ago" },
  ],
  "JOB-003": [
    { id: "WO-13046", region: "Central", priority: "Normal", station: "Main St – Pole 1 thru 8", serviceCenter: "Hammond SC", risDate: "2026-03-15", status: "Complete", cusTotal: 34, cusCompleted: 34, crew: "Crew E – Johnson", lastActivity: "1 wk ago" },
    { id: "WO-13047", region: "Central", priority: "Normal", station: "Main St – Pole 9 thru 16", serviceCenter: "Hammond SC", risDate: "2026-04-01", status: "In Progress", cusTotal: 30, cusCompleted: 22, crew: "Crew E – Johnson", lastActivity: "5 hrs ago" },
    { id: "WO-13048", region: "Central", priority: "Normal", station: "Elm Ave – Pole 1 thru 12", serviceCenter: "Hammond SC", risDate: "2026-04-30", status: "Not Started", cusTotal: 28, cusCompleted: 0, crew: "Unassigned", lastActivity: "—" },
  ],
  "JOB-004": [
    { id: "WO-88201", region: "Upstate", priority: "Normal", station: "Hwy 76 – Mile 0 thru 4.2", serviceCenter: "Greenville SC", risDate: "2026-06-30", status: "In Progress", cusTotal: 80, cusCompleted: 80, crew: "Crew F – Brooks", lastActivity: "6 hrs ago" },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  SAMPLE CU LIBRARY (for WO Detail CU worksheet)
// ═══════════════════════════════════════════════════════════════

const CU_LIBRARY = [
  { code: "P45-3", desc: "Install 45' Wood Pole, Class 3", unitPrice: 1847.50, unit: "EA" },
  { code: "P50-2", desc: "Install 50' Wood Pole, Class 2", unitPrice: 2210.00, unit: "EA" },
  { code: "P55-2", desc: "Install 55' Wood Pole, Class 2", unitPrice: 2680.00, unit: "EA" },
  { code: "XA-10", desc: "Install 10' Crossarm Assembly", unitPrice: 425.00, unit: "EA" },
  { code: "XA-8", desc: "Install 8' Crossarm Assembly", unitPrice: 380.00, unit: "EA" },
  { code: "G6-1", desc: "Install Guy & Anchor, Single", unitPrice: 675.00, unit: "EA" },
  { code: "G6-2", desc: "Install Guy & Anchor, Double", unitPrice: 1120.00, unit: "EA" },
  { code: "T-25K", desc: "Install 25KVA Transformer", unitPrice: 1950.00, unit: "EA" },
  { code: "T-50K", desc: "Install 50KVA Transformer", unitPrice: 2875.00, unit: "EA" },
  { code: "T-100K", desc: "Install 100KVA Transformer", unitPrice: 4200.00, unit: "EA" },
  { code: "S-6090", desc: "Install Secondary Service Drop", unitPrice: 320.00, unit: "EA" },
  { code: "S-6091", desc: "Install Underground Service Lateral", unitPrice: 485.00, unit: "EA" },
  { code: "W-336", desc: "Install 336.4 ACSR Conductor", unitPrice: 8.50, unit: "LF" },
  { code: "W-477", desc: "Install 477 ACSR Conductor", unitPrice: 11.25, unit: "LF" },
  { code: "W-1/0", desc: "Install 1/0 ACSR Conductor", unitPrice: 5.75, unit: "LF" },
  { code: "RP45-3", desc: "Remove 45' Wood Pole", unitPrice: 1200.00, unit: "EA" },
  { code: "RP50-2", desc: "Remove 50' Wood Pole", unitPrice: 1440.00, unit: "EA" },
  { code: "RXA-10", desc: "Remove 10' Crossarm Assembly", unitPrice: 275.00, unit: "EA" },
  { code: "VM2-11", desc: "Vegetation Mgmt - Trim (per span)", unitPrice: 185.00, unit: "EA" },
  { code: "PR-LOOP", desc: "Primary Riser Loop", unitPrice: 450.00, unit: "EA" },
  { code: "JU-CDM", desc: "Joint-Use Comm. Device Move", unitPrice: 225.00, unit: "EA" },
  { code: "H1.1", desc: "Hardware Assembly - Misc", unitPrice: 95.00, unit: "EA" },
];

// Per-WO CU worksheets (pre-populated plan for each sample WO)
const WO_CU_WORKSHEETS: Record<string, { cuCode: string; function: string; originalPlannedQty: number; plannedQty: number; completedQty: number; lastCompletedDate: string | null; notes: string; group?: string }[]> = {
  "WO-27443": [
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-035" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-035" },
    { cuCode: "G6-1", function: "Install", originalPlannedQty: 1, plannedQty: 0, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-035" },
    { cuCode: "S-6090", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-035" },
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-036" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-036" },
    { cuCode: "RP45-3", function: "Remove", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-036" },
    { cuCode: "RXA-10", function: "Remove", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-036" },
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-037" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-037" },
    { cuCode: "S-6090", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-037" },
    { cuCode: "W-336", function: "Install", originalPlannedQty: 800, plannedQty: 800, completedQty: 800, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-037" },
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-038" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-038" },
    { cuCode: "S-6090", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-038" },
    { cuCode: "W-336", function: "Install", originalPlannedQty: 800, plannedQty: 800, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-038" },
    { cuCode: "RP45-3", function: "Remove", originalPlannedQty: 1, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-04", notes: "", group: "Pole Z2F-038" },
    { cuCode: "RXA-10", function: "Remove", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-038" },
    { cuCode: "W-336", function: "Install", originalPlannedQty: 800, plannedQty: 800, completedQty: 0, lastCompletedDate: null, notes: "", group: "Span Z2F-038 to Z2F-039" },
  ],
  "WO-27444": [
    { cuCode: "P50-2", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-041" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-041" },
    { cuCode: "G6-2", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-041" },
    { cuCode: "T-25K", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-041" },
    { cuCode: "P50-2", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-042" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-042" },
    { cuCode: "G6-2", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-042" },
    { cuCode: "S-6090", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-042" },
    { cuCode: "P50-2", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-043" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-043" },
    { cuCode: "G6-2", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-043" },
    { cuCode: "T-25K", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 0, lastCompletedDate: null, notes: "", group: "Pole Z2F-043" },
    { cuCode: "S-6090", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 1, lastCompletedDate: "2026-04-03", notes: "", group: "Pole Z2F-043" },
    { cuCode: "W-336", function: "Install", originalPlannedQty: 3200, plannedQty: 3200, completedQty: 800, lastCompletedDate: "2026-04-03", notes: "", group: "Span Z2F-041 to Z2F-048" },
  ],
  "WO-27445": [
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 3, plannedQty: 3, completedQty: 3, lastCompletedDate: "2026-04-02", notes: "", group: "Pole Z2F-049" },
    { cuCode: "P55-2", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 2, lastCompletedDate: "2026-04-02", notes: "", group: "Pole Z2F-049" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 5, plannedQty: 5, completedQty: 5, lastCompletedDate: "2026-04-02", notes: "", group: "Pole Z2F-050" },
    { cuCode: "G6-1", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 2, lastCompletedDate: "2026-04-02", notes: "", group: "Pole Z2F-050" },
    { cuCode: "T-50K", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-02", notes: "", group: "Pole Z2F-051" },
    { cuCode: "S-6091", function: "Install", originalPlannedQty: 1, plannedQty: 1, completedQty: 1, lastCompletedDate: "2026-04-02", notes: "", group: "Pole Z2F-051" },
  ],
  "WO-27449": [
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 5, plannedQty: 5, completedQty: 5, lastCompletedDate: "2026-03-31", notes: "" },
    { cuCode: "XA-8", function: "Install", originalPlannedQty: 5, plannedQty: 5, completedQty: 5, lastCompletedDate: "2026-03-31", notes: "" },
    { cuCode: "G6-1", function: "Install", originalPlannedQty: 3, plannedQty: 3, completedQty: 3, lastCompletedDate: "2026-03-31", notes: "" },
    { cuCode: "W-1/0", function: "Install", originalPlannedQty: 1200, plannedQty: 1200, completedQty: 1200, lastCompletedDate: "2026-03-31", notes: "" },
    { cuCode: "S-6090", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 2, lastCompletedDate: "2026-03-31", notes: "" },
  ],
  "WO-50881": [
    { cuCode: "S-6091", function: "Install", originalPlannedQty: 12, plannedQty: 12, completedQty: 10, lastCompletedDate: "2026-04-05", notes: "UG laterals" },
    { cuCode: "T-25K", function: "Install", originalPlannedQty: 8, plannedQty: 8, completedQty: 8, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "T-50K", function: "Install", originalPlannedQty: 4, plannedQty: 4, completedQty: 4, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "H1.1", function: "Install", originalPlannedQty: 8, plannedQty: 8, completedQty: 6, lastCompletedDate: "2026-04-05", notes: "" },
  ],
  "WO-13047": [
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 4, plannedQty: 4, completedQty: 3, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 9" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 4, plannedQty: 4, completedQty: 3, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 9" },
    { cuCode: "G6-1", function: "Install", originalPlannedQty: 3, plannedQty: 3, completedQty: 2, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 9" },
    { cuCode: "T-25K", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 2, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 9" },
    { cuCode: "P45-3", function: "Install", originalPlannedQty: 4, plannedQty: 4, completedQty: 3, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 10" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 4, plannedQty: 4, completedQty: 3, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 10" },
    { cuCode: "G6-1", function: "Install", originalPlannedQty: 3, plannedQty: 3, completedQty: 2, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 10" },
    { cuCode: "T-25K", function: "Install", originalPlannedQty: 2, plannedQty: 2, completedQty: 2, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 10" },
    { cuCode: "W-477", function: "Install", originalPlannedQty: 1600, plannedQty: 1600, completedQty: 1200, lastCompletedDate: "2026-04-05", notes: "", group: "Span 9 to 16" },
    { cuCode: "RP45-3", function: "Remove", originalPlannedQty: 4, plannedQty: 4, completedQty: 2, lastCompletedDate: "2026-04-05", notes: "", group: "Pole 11" },
  ],
  "WO-88201": [
    { cuCode: "P55-2", function: "Install", originalPlannedQty: 16, plannedQty: 16, completedQty: 16, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "XA-10", function: "Install", originalPlannedQty: 16, plannedQty: 16, completedQty: 16, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "G6-2", function: "Install", originalPlannedQty: 12, plannedQty: 12, completedQty: 12, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "T-100K", function: "Install", originalPlannedQty: 4, plannedQty: 4, completedQty: 4, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "W-477", function: "Install", originalPlannedQty: 22000, plannedQty: 22000, completedQty: 22000, lastCompletedDate: "2026-04-05", notes: "All 4.2 miles" },
    { cuCode: "S-6090", function: "Install", originalPlannedQty: 8, plannedQty: 8, completedQty: 8, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "RP50-2", function: "Remove", originalPlannedQty: 14, plannedQty: 14, completedQty: 14, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "PR-LOOP", function: "Install", originalPlannedQty: 6, plannedQty: 6, completedQty: 6, lastCompletedDate: "2026-04-05", notes: "" },
    { cuCode: "JU-CDM", function: "Install", originalPlannedQty: 4, plannedQty: 4, completedQty: 4, lastCompletedDate: "2026-04-05", notes: "" },
  ],
};

// Sample crew members for WO assignment
const WO_CREW_MEMBERS: Record<string, { name: string; classification: string; phone: string }[]> = {
  "Crew A – Rivera": [
    { name: "Carlos Rivera", classification: "Foreman", phone: "(850) 555-0142" },
    { name: "Mike Rodriguez", classification: "Journeyman Lineman", phone: "(850) 555-0188" },
    { name: "Kyle Bennett", classification: "Journeyman Lineman", phone: "(850) 555-0211" },
    { name: "Sam Torres", classification: "Groundman", phone: "(850) 555-0267" },
  ],
  "Crew B – Thompson": [
    { name: "Jake Thompson", classification: "Foreman", phone: "(850) 555-0301" },
    { name: "Travis Cummings", classification: "Journeyman Lineman", phone: "(850) 555-0318" },
    { name: "Ryan Cooper", classification: "Apprentice 7", phone: "(850) 555-0334" },
    { name: "David Marshall", classification: "Apprentice 3", phone: "(850) 555-0352" },
  ],
  "Crew C – Davis": [
    { name: "Marcus Davis", classification: "Foreman", phone: "(770) 555-0401" },
    { name: "Terrence Hill", classification: "Journeyman Lineman", phone: "(770) 555-0418" },
    { name: "Andre Williams", classification: "Journeyman Lineman", phone: "(770) 555-0425" },
    { name: "Dwayne Jackson", classification: "Operator", phone: "(770) 555-0441" },
  ],
  "Crew E – Johnson": [
    { name: "Derek Johnson", classification: "Foreman", phone: "(985) 555-0501" },
    { name: "Brandon Lee", classification: "Journeyman Lineman", phone: "(985) 555-0518" },
    { name: "Chris Martinez", classification: "Apprentice 7", phone: "(985) 555-0529" },
  ],
  "Crew F – Brooks": [
    { name: "Nathan Brooks", classification: "Foreman", phone: "(864) 555-0601" },
    { name: "Tyler Adams", classification: "Journeyman Lineman", phone: "(864) 555-0618" },
    { name: "Josh Wilson", classification: "Journeyman Lineman", phone: "(864) 555-0625" },
    { name: "Nick Alvarez", classification: "Operator", phone: "(864) 555-0641" },
    { name: "Jake Simmons", classification: "CDL Driver", phone: "(864) 555-0658" },
  ],
};

const WO_STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
  "not started": { label: "Not Started", dot: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  "in progress": { label: "In Progress", dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "complete": { label: "Complete", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "on hold": { label: "On Hold", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "invoiced": { label: "Invoiced", dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
};

// ═══════════════════════════════════════════════════════════════
//  CHANGE ORDER & VENDOR COST DATA (for WO Detail)
// ═══════════════════════════════════════════════════════════════

const CO_STATUS_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  draft: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  submitted: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "in progress": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  complete: { bg: "bg-emerald-50", text: "text-green-800", border: "border-emerald-300" },
  rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const INITIAL_CHANGE_ORDERS: Record<string, any[]> = {
  "WO-27443": [
    {
      id: "CO-001", description: "Add brace pole — soil unsuitable for guy anchors",
      reason: "Rocky subsurface at Pole 035 prevents screw-anchor installation. Brace pole required for structural support.",
      billingType: "unit-price", status: "Approved", submittedDate: "2026-03-05", approvedDate: "2026-03-06",
      approvedBy: "Duke Energy — Sarah Mitchell (Field Engineer)",
      cus: [
        { code: "P55-2", description: "Install 55' Class 2 Wood Pole (Brace)", unit: "EA", qty: 1, unitPrice: 1890 },
        { code: "CA8-1", description: "Install 8' Crossarm Assembly (Single)", unit: "EA", qty: 1, unitPrice: 520 },
      ],
      teHours: null, notes: "Brace pole replaces 2 guy wire assemblies eliminated via red line.",
    },
    {
      id: "CO-002", description: "Emergency tree removal — leaning oak obstructing pole access",
      reason: "Large oak leaning toward Pole 036, preventing safe bucket truck access. Not on original staking sheet.",
      billingType: "te", status: "Complete", submittedDate: "2026-03-04", approvedDate: "2026-03-04",
      approvedBy: "Duke Energy — verbal approval confirmed via email",
      cus: null,
      teHours: [
        { classification: "Foreman", hours: 2, rate: 95 },
        { classification: "Journeyman Lineman", hours: 4, rate: 85 },
      ],
      notes: "Tree crew dispatched same day. 2-person team, chainsaw + chipper.",
    },
  ],
  "WO-88201": [
    {
      id: "CO-001", description: "3 additional rot pole replacements at mile 2.8",
      reason: "Rot poles not on original staking sheet discovered during conductor pull.",
      billingType: "unit-price", status: "Approved", submittedDate: "2026-03-10", approvedDate: "2026-03-11",
      approvedBy: "FPL — Mark Torres (Construction Manager)",
      cus: [
        { code: "RP50-2", description: "Remove 50' Class 2 Rot Pole", unit: "EA", qty: 3, unitPrice: 580 },
        { code: "P55-2", description: "Install 55' Class 2 Wood Pole", unit: "EA", qty: 3, unitPrice: 1890 },
        { code: "TF-1", description: "Transfer Existing Facilities (per pole)", unit: "EA", qty: 3, unitPrice: 690 },
      ],
      teHours: null, notes: "3 poles at mile marker 2.8 — all showing significant base rot.",
    },
  ],
};

const VENDOR_COST_CATEGORIES = [
  { id: "materials", label: "Materials", color: "blue" },
  { id: "subcontractor", label: "Subcontractor", color: "violet" },
  { id: "rental", label: "Equipment Rental", color: "amber" },
  { id: "permits", label: "Permits / Fees", color: "emerald" },
  { id: "other", label: "Other", color: "gray" },
];

const VENDOR_COST_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  submitted: { label: "Submitted", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  paid: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
};

const INITIAL_VENDOR_COSTS: Record<string, any[]> = {
  "WO-27443": [
    { id: 1, vendor: "Anixter Power Solutions", description: "45' Class 3 Wood Poles (x12)", category: "materials", amount: 3420, markup: 0, billable: true, invoiceNumber: "ANX-90221", invoiceDate: "2026-03-02", status: "paid" },
    { id: 2, vendor: "Graybar Electric", description: "1/0 ACSR conductor — 600ft spool", category: "materials", amount: 570, markup: 0, billable: true, invoiceNumber: "GB-2026-1893", invoiceDate: "2026-03-03", status: "submitted" },
    { id: 3, vendor: "Sunbelt Rentals", description: "45-ton crane rental — 2 days", category: "rental", amount: 2400, markup: 15, billable: true, invoiceNumber: "SBR-50112", invoiceDate: "2026-03-04", status: "submitted" },
    { id: 4, vendor: "ABC Flagging Services", description: "Traffic control — pole work (8 hrs)", category: "subcontractor", amount: 640, markup: 10, billable: true, invoiceNumber: "ABC-4102", invoiceDate: "2026-03-04", status: "pending" },
  ],
  "WO-88201": [
    { id: 1, vendor: "Anixter Power Solutions", description: "55' Class 2 Wood Poles (x3)", category: "materials", amount: 1230, markup: 0, billable: true, invoiceNumber: "ANX-90445", invoiceDate: "2026-03-11", status: "submitted" },
    { id: 2, vendor: "Southeast Equipment", description: "Puller-tensioner rental — 1 week", category: "rental", amount: 4800, markup: 15, billable: true, invoiceNumber: "SE-7891", invoiceDate: "2026-03-08", status: "paid" },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  STATUS CONFIG
// ═══════════════════════════════════════════════════════════════

const JOB_STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  active: { label: "Active", dot: "bg-emerald-500" },
  pending: { label: "Pending", dot: "bg-amber-500" },
  on_hold: { label: "On Hold", dot: "bg-gray-400" },
  in_closeout: { label: "In Closeout", dot: "bg-blue-500" },
  closed: { label: "Closed", dot: "bg-gray-300" },
};

// ═══════════════════════════════════════════════════════════════
//  WIZARD STEPS
// ═══════════════════════════════════════════════════════════════

function getJobSteps(contractType: string) {
  // Step 2 label adapts based on contract type
  // Unit-Price → "Work Orders" (the primary organizing unit)
  // T&E / Lump Sum → different labels when built (future)
  // No contract selected → generic label
  let step2Label = "Configuration";
  let step2Icon = Settings;
  if (contractType === "Unit-Price") {
    step2Label = "Work Orders";
    step2Icon = FolderTree;
  }
  // Future: T&E might be "Time Tracking", Lump Sum might be "Scope & Milestones"

  return [
    { num: 1, label: "Basics", icon: FileText },
    { num: 2, label: step2Label, icon: step2Icon },
    { num: 3, label: "Labor & Crew", icon: Users },
    { num: 4, label: "Review", icon: Check },
  ];
}

// Suggestion chips — common WO fields that pre-fill a custom field row when clicked
const WO_FIELD_SUGGESTIONS = [
  { name: "Region", type: "dropdown", desc: "Geographic region or district" },
  { name: "Priority", type: "dropdown", desc: "WO priority level" },
  { name: "Budgeted Hours", type: "number", desc: "Man-hours allocated by the utility" },
  { name: "Job Type", type: "dropdown", desc: "Type of work on this WO" },
  { name: "Service Center", type: "text", desc: "Utility's service center assignment" },
  { name: "RIS Date", type: "date", desc: "Required In-Service date" },
  { name: "Responsible Engineer", type: "text", desc: "Utility-side engineer for this WO" },
];

// Suggestion chips for group-level identifier fields
const GROUP_FIELD_SUGGESTIONS = [
  { name: "Work Location", type: "text" },
  { name: "Work Point", type: "text" },
  { name: "Pole #", type: "text" },
  { name: "Address", type: "text" },
  { name: "Span", type: "text" },
  { name: "Station", type: "text" },
  { name: "Structure", type: "text" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

// ═══════════════════════════════════════════════════════════════
//  SHARED FORM COMPONENTS (matching contract wizard patterns)
// ═══════════════════════════════════════════════════════════════

function Field({ label, required, optional, helper, error, children, className = "" }: any) {
  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}
          {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {helper && !error && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, prefix, suffix, type = "text", disabled = false, error = false, numeric = false }: any) {
  const handleChange = (e: any) => {
    const v = e.target.value;
    if (numeric) {
      if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) onChange(v);
      return;
    }
    onChange(v);
  };
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={numeric ? "decimal" : undefined}
        className={`w-full ${prefix ? "pl-7" : "px-3"} ${suffix ? "pr-12" : ""} py-2 text-sm border rounded-lg bg-white placeholder-gray-400 focus:outline-none transition-colors ${
          error ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100" : "border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
        } ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder, disabled = false, error = false }: any) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full text-sm border rounded-lg pl-3 pr-8 py-2 bg-white text-gray-700 appearance-none focus:outline-none transition-colors ${
          error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-300"
        } ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map((opt: any) => (
          <option key={typeof opt === "string" ? opt : opt.id} value={typeof opt === "string" ? opt : opt.id}>
            {typeof opt === "string" ? opt : opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function MultiSelectDropdown({ values = [], onChange, options, placeholder, chipColor = "orange" }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: any) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (val: string) => {
    if (values.includes(val)) onChange(values.filter((v: string) => v !== val));
    else onChange([...values, val]);
  };

  const available = options.filter((opt: any) => {
    const v = typeof opt === "string" ? opt : opt.id;
    return !values.includes(v);
  });

  const colorMap: Record<string, string> = {
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const chipClass = colorMap[chipColor] || colorMap.orange;

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer min-h-[38px] flex flex-wrap items-center gap-1.5 focus:outline-none focus:border-gray-300 transition-colors"
      >
        {values.length === 0 && <span className="text-gray-400">{placeholder || "Select..."}</span>}
        {values.map((val: string) => {
          const opt = options.find((o: any) => (typeof o === "string" ? o : o.id) === val);
          const label = typeof opt === "string" ? opt : opt?.label || opt?.name || val;
          return (
            <span key={val} className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${chipClass}`}>
              {label}
              <button type="button" onClick={(e) => { e.stopPropagation(); toggle(val); }} className="hover:opacity-70 transition-colors">
                <X size={12} />
              </button>
            </span>
          );
        })}
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {open && available.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {available.map((opt: any) => {
            const v = typeof opt === "string" ? opt : opt.id;
            const label = typeof opt === "string" ? opt : opt.label || opt.name;
            const desc = typeof opt === "object" ? opt.location || opt.description : undefined;
            return (
              <button key={v} onClick={() => { toggle(v); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <span>{label}</span>
                {desc && <span className="text-xs text-gray-400">{desc}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RadioGroup({ value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      {options.map((opt: any) => (
        <label
          key={opt.id}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            value === opt.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onChange(opt.id)}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
            value === opt.id ? "border-gray-900" : "border-gray-300"
          }`}>
            {value === opt.id && <div className="w-2 h-2 rounded-full bg-gray-900" />}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{opt.label}</div>
            {opt.desc && <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>}
          </div>
        </label>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  QTY STEPPER (touch-friendly for iPad/field use)
// ═══════════════════════════════════════════════════════════════

// Global CSS injection — number-input spinners + CU table row dividers (idempotent: always overwrites)
const GRIDBASE_STYLE_ID = "gridbase-global-styles";
if (typeof document !== "undefined") {
  let style = document.getElementById(GRIDBASE_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = GRIDBASE_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
    input[type="number"].no-spin::-webkit-inner-spin-button,
    input[type="number"].no-spin::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"].no-spin {
      -moz-appearance: textfield;
      appearance: textfield;
    }
    /* CU table — header bottom stroke, footer top stroke, row dividers; all applied to <th>/<td> since <tr> borders don't render with border-collapse:separate */
    table.cu-table > thead > tr > th {
      border-bottom: 1px solid #E5E7EB;
    }
    table.cu-table > tfoot > tr > td {
      border-top: 1px solid #E5E7EB;
    }
    tr.cu-row-divider > td {
      border-bottom: 1px solid #E5E7EB;
    }
    tr.cu-row-divider:last-child > td {
      border-bottom: 0;
    }
    /* Child cavity row — top + bottom borders on its cell */
    tr.cu-cavity-row > td {
      border-top: 1px solid #E5E7EB;
      border-bottom: 1px solid #E5E7EB;
    }
    tr.cu-cavity-row:last-child > td {
      border-bottom: 0;
    }
  `;
}

function QtyStepper({ value, onChange, min = 0, placeholder = "0" }: { value: string; onChange: (v: string) => void; min?: number; placeholder?: string }) {
  const numVal = parseInt(value) || 0;
  const decrement = () => { const nv = Math.max(min, numVal - 1); onChange(String(nv)); };
  const increment = () => { onChange(String(numVal + 1)); };
  const btnStyle: any = {
    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer",
    background: "#fff", color: "#374151", borderRadius: 8, flexShrink: 0,
    transition: "all 0.1s",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <button onClick={decrement} style={{ ...btnStyle, opacity: numVal <= min ? 0.35 : 1 }} disabled={numVal <= min}
        onMouseEnter={(e) => { if (numVal > min) { (e.currentTarget).style.background = "#F3F4F6"; (e.currentTarget).style.borderColor = "#9CA3AF"; } }}
        onMouseLeave={(e) => { (e.currentTarget).style.background = "#fff"; (e.currentTarget).style.borderColor = "#D1D5DB"; }}
      >−</button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="no-spin"
        style={{
          width: 52, height: 40, textAlign: "center", fontSize: 15, fontWeight: 600,
          border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", background: "#fff",
          MozAppearance: "textfield",
          WebkitAppearance: "textfield",
        }}
      />
      <button onClick={increment} style={btnStyle}
        onMouseEnter={(e) => { (e.currentTarget).style.background = "#F3F4F6"; (e.currentTarget).style.borderColor = "#9CA3AF"; }}
        onMouseLeave={(e) => { (e.currentTarget).style.background = "#fff"; (e.currentTarget).style.borderColor = "#D1D5DB"; }}
      >+</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEPPER (matches contract wizard)
// ═══════════════════════════════════════════════════════════════

function Stepper({ currentStep, steps, contractSelected = true }: any) {
  return (
    <div className="flex items-center justify-center gap-0 py-4 border-b border-gray-200 bg-gray-50/50 px-8">
      {steps.map((step: any, i: number) => {
        const isComplete = currentStep > step.num;
        const isCurrent = currentStep === step.num;
        const isUpcoming = currentStep < step.num;
        // Steps beyond 1 are dimmed when no contract is selected yet
        const isLocked = !contractSelected && step.num > 1;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                isLocked ? "bg-gray-100 text-gray-300" :
                isComplete || isCurrent ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
              } ${isCurrent && !isLocked ? "ring-4 ring-gray-200" : ""}`}>
                {isComplete && !isLocked ? <Check size={14} /> : step.num}
              </div>
              <span className={`text-sm hidden sm:inline ${
                isLocked ? "text-gray-300" : isUpcoming ? "text-gray-400" : "font-medium text-gray-900"
              }`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px mx-3 ${isLocked ? "bg-gray-100" : isComplete ? "bg-gray-900" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SECTION HEADER
// ═══════════════════════════════════════════════════════════════

function SectionHeader({ title, description }: any) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONTRACT SUMMARY CARD
// ═══════════════════════════════════════════════════════════════

function ContractSummaryCard({ contract }: any) {
  if (!contract) return null;
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">{contract.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {contract.type}
            </span>
            <span className="text-xs text-gray-500">{contract.workType}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {contract.status}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">CU Library</div>
          <div className="text-xs text-gray-700 mt-0.5">{contract.cuLibrary}</div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Invoice Cadence</div>
          <div className="text-xs text-gray-700 mt-0.5">{contract.invoiceCadence}</div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Invoice Grouping</div>
          <div className="text-xs text-gray-700 mt-0.5">{contract.invoiceGrouping}</div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Rate Type</div>
          <div className="text-xs text-gray-700 mt-0.5">{contract.rateType}</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEP 1: UTILITY & CONTRACT + JOB BASICS
// ═══════════════════════════════════════════════════════════════

function Step1Basics({ form, setForm }: any) {
  const selectedUtility = SAMPLE_UTILITIES.find((u) => u.id === form.utilityId);
  const contractsForUtility = SAMPLE_CONTRACTS.filter((c) => c.utilityId === form.utilityId);
  const selectedContract = SAMPLE_CONTRACTS.find((c) => c.id === form.contractId);

  return (
    <div className="space-y-6">
      <SectionHeader title="Select Utility & Contract" description="Choose the utility this job is for, then select the governing contract." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Utility" required>
          <Select
            value={form.utilityId}
            onChange={(v: string) => setForm({ ...form, utilityId: v, contractId: "" })}
            options={SAMPLE_UTILITIES.map((u) => ({ id: u.id, label: u.name }))}
            placeholder="Select utility..."
          />
        </Field>

        <Field label="Contract" required>
          <Select
            value={form.contractId}
            onChange={(v: string) => setForm({ ...form, contractId: v })}
            options={contractsForUtility.map((c) => ({ id: c.id, label: c.name }))}
            placeholder={form.utilityId ? "Select contract..." : "Select a utility first"}
            disabled={!form.utilityId}
          />
        </Field>
      </div>

      {selectedContract && <ContractSummaryCard contract={selectedContract} />}

      <div className="border-t border-gray-200 pt-6">
        <SectionHeader title="Job Details" description="Basic information about this job." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Job Name" required helper="Descriptive name for this job (e.g., 'North District – Batch 12')">
            <TextInput value={form.jobName} onChange={(v: string) => setForm({ ...form, jobName: v })} placeholder="Enter job name..." />
          </Field>

          <Field label="Job Number" optional helper="Utility-assigned or internal reference number">
            <TextInput value={form.jobNumber} onChange={(v: string) => setForm({ ...form, jobNumber: v })} placeholder="e.g., WR-7286441" />
          </Field>

          <Field label="Start Date">
            <TextInput type="date" value={form.startDate} onChange={(v: string) => setForm({ ...form, startDate: v })} />
          </Field>

          <Field label="Initial Status">
            <Select
              value={form.initialStatus}
              onChange={(v: string) => setForm({ ...form, initialStatus: v })}
              options={[
                { id: "active", label: "Active — ready for work" },
                { id: "pending", label: "Pending — queued, not started" },
              ]}
            />
          </Field>

          <Field label="Primary City" helper="Main location for reference — work may span multiple areas">
            <TextInput value={form.city} onChange={(v: string) => setForm({ ...form, city: v })} placeholder="Enter city..." />
          </Field>

          <Field label="State">
            <Select
              value={form.state}
              onChange={(v: string) => setForm({ ...form, state: v })}
              options={US_STATES.map((s) => ({ id: s, label: s }))}
              placeholder="Select state..."
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEP 2: WORK ORDER CONFIGURATION
// ═══════════════════════════════════════════════════════════════

function FieldRow({ field, onUpdate, onRemove, typeOptions }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <TextInput value={field.name} onChange={(v: string) => onUpdate("name", v)} placeholder="Field name..." />
      </div>
      <div className="w-32">
        <Select
          value={field.type}
          onChange={(v: string) => onUpdate("type", v)}
          options={typeOptions || [
            { id: "text", label: "Text" },
            { id: "number", label: "Number" },
            { id: "date", label: "Date" },
            { id: "dropdown", label: "Dropdown" },
            { id: "checkbox", label: "Checkbox" },
          ]}
        />
      </div>
      <button onClick={onRemove} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function DropdownOptionsEditor({ options, onUpdate }: any) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="text-xs font-medium text-gray-500 mb-2">Dropdown Options</div>
      <div className="space-y-1.5">
        {(options || []).map((opt: string, optIdx: number) => (
          <div key={optIdx} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
            <input
              value={opt}
              onChange={(e) => { const o = [...(options || [])]; o[optIdx] = e.target.value; onUpdate(o); }}
              placeholder="Option value..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
            />
            <button onClick={() => onUpdate((options || []).filter((_: any, i: number) => i !== optIdx))} className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded">
              <X size={12} />
            </button>
          </div>
        ))}
        <button onClick={() => onUpdate([...(options || []), ""])} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1">
          <Plus size={12} /> Add option
        </button>
      </div>
    </div>
  );
}

function Step2WorkOrders({ form, setForm }: any) {
  const woFields = form.woCustomFields || [];
  const levels = form.woGroupLevels || [];
  const numLevels = levels.length;
  const MAX_LEVELS = 2;

  // === WO field CRUD ===
  const woAdd = (prefill?: { name: string; type: string }) => {
    setForm({ ...form, woCustomFields: [...woFields, { id: `f_${Date.now()}`, name: prefill?.name || "", type: prefill?.type || "text", options: [] }] });
  };
  const woUpdate = (idx: number, k: string, val: any) => {
    const f = [...woFields]; f[idx] = { ...f[idx], [k]: val }; setForm({ ...form, woCustomFields: f });
  };
  const woRemove = (idx: number) => {
    setForm({ ...form, woCustomFields: woFields.filter((_: any, i: number) => i !== idx) });
  };

  // === Group level CRUD ===
  const addLevel = () => {
    if (numLevels >= MAX_LEVELS) return;
    setForm({ ...form, woGroupLevels: [...levels, { fields: [] }] });
  };
  const removeLevel = (lvlIdx: number) => {
    // Removing a level also removes all deeper levels
    setForm({ ...form, woGroupLevels: levels.slice(0, lvlIdx) });
  };
  const lvlFieldAdd = (lvlIdx: number, prefill?: { name: string; type: string }) => {
    const newLevels = [...levels];
    newLevels[lvlIdx] = { ...newLevels[lvlIdx], fields: [...newLevels[lvlIdx].fields, { id: `g_${Date.now()}`, name: prefill?.name || "", type: prefill?.type || "text" }] };
    setForm({ ...form, woGroupLevels: newLevels });
  };
  const lvlFieldUpdate = (lvlIdx: number, fIdx: number, k: string, val: any) => {
    const newLevels = [...levels];
    const newFields = [...newLevels[lvlIdx].fields];
    newFields[fIdx] = { ...newFields[fIdx], [k]: val };
    newLevels[lvlIdx] = { ...newLevels[lvlIdx], fields: newFields };
    setForm({ ...form, woGroupLevels: newLevels });
  };
  const lvlFieldRemove = (lvlIdx: number, fIdx: number) => {
    const newLevels = [...levels];
    newLevels[lvlIdx] = { ...newLevels[lvlIdx], fields: newLevels[lvlIdx].fields.filter((_: any, i: number) => i !== fIdx) };
    setForm({ ...form, woGroupLevels: newLevels });
  };

  // Suggestion chip filtering — combine used names from ALL levels
  const usedWoNames = woFields.map((f: any) => f.name.toLowerCase().trim());
  const woSuggestions = WO_FIELD_SUGGESTIONS.filter((s) => !usedWoNames.includes(s.name.toLowerCase()));
  const allUsedGrpNames = levels.flatMap((lvl: any) => lvl.fields.map((f: any) => f.name.toLowerCase().trim()));
  const grpSuggestionsFor = (lvlIdx: number) => GROUP_FIELD_SUGGESTIONS.filter((s) => !allUsedGrpNames.includes(s.name.toLowerCase()));

  // Preview labels per level
  const woLabels = woFields.filter((f: any) => f.name.trim()).map((f: any) => f.name);
  const levelLabels = levels.map((lvl: any) => lvl.fields.filter((f: any) => f.name.trim()).map((f: any) => f.name));

  // Sample data for preview
  const sampleValues: Record<string, string[]> = {
    "work location": ["48923N36298", "48923N36305"],
    "work point": ["100", "200"],
    "pole #": ["P-1042", "P-1087"],
    "address": ["123 Oak St", "456 Elm Ave"],
    "span": ["S-101", "S-204"],
    "station": ["STA 10+00", "STA 15+50"],
    "structure": ["STR-A1", "STR-B3"],
  };

  // Level color tints
  const levelColors = [
    { bg: "bg-orange-50/30", headerBg: "bg-orange-50/50", border: "border-orange-200", dashBorder: "border-orange-200", iconColor: "text-orange-600" },
    { bg: "bg-amber-50/30", headerBg: "bg-amber-50/50", border: "border-amber-200", dashBorder: "border-amber-200", iconColor: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Work Order Setup" description="Configure how work orders are structured and tracked on this job. This should match how the utility organizes their work." />

      {/* Uses Work Orders */}
      <Field label="Does this job use work orders?">
        <RadioGroup
          value={form.usesWorkOrders}
          onChange={(v: string) => setForm({ ...form, usesWorkOrders: v })}
          options={[
            { id: "yes", label: "Yes — work is organized into work orders", desc: "The utility issues WOs with specific scope. Standard for most unit-price jobs." },
            { id: "no", label: "No — blanket job, no work orders", desc: "Time and production are logged directly against the job. Used for feeder-level or general assignments." },
          ]}
        />
      </Field>

      {form.usesWorkOrders === "no" && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Without work orders, all time and production will be logged directly at the job level. This is typically used for blanket or feeder-level assignments.
          </p>
        </div>
      )}

      {form.usesWorkOrders === "yes" && (
        <>
          {/* ─── Unified WO Builder ─── */}
          <div className="border-t border-gray-200 pt-6">
            <SectionHeader title="Work Order Builder" description="Define the fields on each work order, then set up how compatible units are organized within it." />

            {/* ── Section 1: WO Header Fields ── */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              <div className="bg-white">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <FolderTree size={14} className="text-gray-700" />
                  <span className="text-sm font-semibold text-gray-900">Work Order Fields</span>
                  <span className="text-xs text-gray-400 ml-1">— data captured on each work order header</span>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {/* WO # is always present */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-1.5 px-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <FileText size={12} />
                    <span>WO #</span>
                    <span className="text-[10px] ml-auto">always included</span>
                  </div>

                  {/* WO-level fields */}
                  {woFields.map((cf: any, idx: number) => (
                    <div key={cf.id} className="border border-gray-200 rounded-lg p-2.5">
                      <FieldRow
                        field={cf}
                        onUpdate={(k: string, v: any) => woUpdate(idx, k, v)}
                        onRemove={() => woRemove(idx)}
                      />
                      {cf.type === "dropdown" && (
                        <DropdownOptionsEditor options={cf.options} onUpdate={(opts: any) => woUpdate(idx, "options", opts)} />
                      )}
                    </div>
                  ))}

                  {/* Suggestion chips + add */}
                  <div className="pt-1">
                    {woSuggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {woSuggestions.map((s) => (
                          <button
                            key={s.name}
                            onClick={() => woAdd({ name: s.name, type: s.type })}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-md hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-colors"
                          >
                            <Plus size={10} /> {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => woAdd()} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      <Plus size={12} /> Add field
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: CU Organization ── */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">

              {/* Section header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Layers size={14} className="text-gray-700" />
                <span className="text-sm font-semibold text-gray-900">CU Organization</span>
                <span className="text-xs text-gray-400 ml-1">— how compatible units are grouped within each work order</span>
              </div>

              {/* ── Grouping Levels (nested) ── */}
              {levels.map((lvl: any, lvlIdx: number) => {
                const colors = levelColors[lvlIdx] || levelColors[0];
                const indent = lvlIdx === 0 ? "pl-8" : "pl-14";
                const headerIndent = lvlIdx === 0 ? "" : "pl-6";
                const suggestions = grpSuggestionsFor(lvlIdx);
                const levelLabel = lvlIdx === 0 ? "Primary Grouping Level" : "Sub-group Level";
                const levelDesc = lvlIdx === 0 ? "Primary grouping — e.g., by work location or address" : "Nested within each group above — e.g., by pole or span";
                return (
                  <div key={lvlIdx} className={`border-t-2 border-dashed ${colors.dashBorder} ${colors.bg}`}>
                    <div className={`px-4 py-3 flex items-center gap-2 ${colors.headerBg} border-b ${colors.border}/50 ${headerIndent}`}>
                      <Layers size={14} className={colors.iconColor} />
                      <span className="text-sm font-semibold text-gray-900 flex-1">{levelLabel}</span>
                      <span className="text-[10px] text-gray-400">{levelDesc}</span>
                      <button
                        onClick={() => removeLevel(lvlIdx)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                        title={`Remove ${levelLabel.toLowerCase()}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className={`px-4 py-3 ${indent} space-y-2`}>
                      {lvl.fields.map((gf: any, fIdx: number) => (
                        <div key={gf.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2.5">
                          <FieldRow
                            field={gf}
                            onUpdate={(k: string, v: any) => lvlFieldUpdate(lvlIdx, fIdx, k, v)}
                            onRemove={() => lvlFieldRemove(lvlIdx, fIdx)}
                            typeOptions={[{ id: "text", label: "Text" }, { id: "number", label: "Number" }]}
                          />
                        </div>
                      ))}

                      {/* Group suggestion chips + add */}
                      <div className="pt-1">
                        {suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {suggestions.map((s) => (
                              <button
                                key={s.name}
                                onClick={() => lvlFieldAdd(lvlIdx, { name: s.name, type: s.type })}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-colors"
                              >
                                <Plus size={10} /> {s.name}
                              </button>
                            ))}
                          </div>
                        )}
                        <button onClick={() => lvlFieldAdd(lvlIdx)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                          <Plus size={12} /> Add field
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Add grouping level button ── */}
              {numLevels < MAX_LEVELS && (
                <div className={`border-t ${numLevels > 0 ? "border-orange-200/50" : "border-gray-200"} px-4 py-3 bg-white`}>
                  <button
                    onClick={addLevel}
                    className={`flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full ${numLevels > 0 ? "pl-8" : ""}`}
                  >
                    <div className="w-5 h-5 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <Plus size={10} className="text-gray-400" />
                    </div>
                    <span>{numLevels === 0 ? "Add a grouping level" : "Add a sub-group level"}</span>
                    <span className="text-xs text-gray-400 ml-1">
                      {numLevels === 0
                        ? "— organize CUs into groups (e.g., by work location, address)"
                        : "— nest within each group (e.g., by pole, span)"}
                    </span>
                  </button>
                </div>
              )}

              {/* ── CU Line Items (always at the bottom) ── */}
              <div className={`border-t ${numLevels > 0 ? "border-orange-200/50" : "border-gray-200"} px-4 py-3 bg-gray-50/50`}>
                <div className={`flex items-center gap-2 text-sm text-gray-500 ${numLevels > 0 ? (numLevels > 1 ? "pl-14" : "pl-8") : ""}`}>
                  <ClipboardCheck size={14} className="text-gray-400" />
                  <span className="font-medium">CU Line Items</span>
                  <span className="text-xs text-gray-400">— compatible units logged here</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Live Preview ─── */}
          {(woLabels.length > 0 || numLevels > 0) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-3">Document Preview</div>
              <div className="border border-gray-300 rounded-lg bg-white text-[10px]">
                {/* WO header row */}
                <div className="px-3 py-2 border-b border-gray-200 bg-gray-50/80 rounded-t-lg">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="font-medium text-gray-600">WO #: <span className="text-gray-400">13046629</span></span>
                    {woLabels.map((label: string) => (
                      <span key={label} className="font-medium text-gray-600">{label}: <span className="text-gray-400">________</span></span>
                    ))}
                  </div>
                </div>

                {numLevels === 0 ? (
                  /* Flat — CUs directly on WO */
                  <div className="px-3 py-2">
                    <div className="grid grid-cols-5 gap-2 text-gray-400 font-medium border-b border-gray-100 pb-1 mb-1">
                      <span>Action</span><span>Qty</span><span>CU Code</span><span>Description</span><span>Trade</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-gray-300">
                      <span>Install</span><span>1</span><span>NEUT-CONN</span><span>Neutral connection</span><span>D-Line</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-gray-300 mt-0.5">
                      <span>Install</span><span>2</span><span>TC-F-C</span><span>Traffic control flag</span><span>Flag</span>
                    </div>
                  </div>
                ) : numLevels === 1 ? (
                  /* One grouping level */
                  <div className="divide-y divide-gray-100">
                    {[0, 1].map((gi) => (
                      <div key={gi} className="px-3 py-2">
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-1.5 pb-1.5 border-b border-gray-100">
                          {(levelLabels[0] || []).length > 0 ? (levelLabels[0] || []).map((label: string) => {
                            const samples = sampleValues[label.toLowerCase()] || [`Sample ${gi + 1}`];
                            return <span key={label} className="font-semibold text-gray-700">{label}: <span className="font-normal text-gray-400">{samples[gi]}</span></span>;
                          }) : (
                            <span className="font-semibold text-gray-700">Group {gi + 1}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-gray-400 font-medium border-b border-gray-50 pb-0.5 mb-0.5">
                          <span>Action</span><span>Qty</span><span>CU Code</span><span>Description</span><span>Trade</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-gray-300">
                          <span>Install</span><span>1</span><span>NEUT-CONN</span><span>Neutral connection</span><span>D-Line</span>
                        </div>
                        {gi === 0 && (
                          <div className="grid grid-cols-5 gap-2 text-gray-300 mt-0.5">
                            <span>Install</span><span>1</span><span>PREP-POLE</span><span>Prepare pole</span><span>D-Line</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Two grouping levels — nested */
                  <div className="divide-y divide-gray-100">
                    {[0, 1].map((gi) => (
                      <div key={gi} className="px-3 py-2">
                        {/* Level 1 header */}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2 pb-1.5 border-b border-gray-200">
                          {(levelLabels[0] || []).length > 0 ? (levelLabels[0] || []).map((label: string) => {
                            const samples = sampleValues[label.toLowerCase()] || [`Sample ${gi + 1}`];
                            return <span key={label} className="font-bold text-gray-800">{label}: <span className="font-normal text-gray-500">{samples[gi]}</span></span>;
                          }) : (
                            <span className="font-bold text-gray-800">Group {gi + 1}</span>
                          )}
                        </div>
                        {/* Level 2 sub-groups */}
                        {[0, 1].map((si) => {
                          if (gi === 1 && si === 1) return null; // Show fewer items in second group
                          return (
                            <div key={si} className={`ml-3 ${si > 0 ? "mt-2" : ""}`}>
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-1 pb-1 border-b border-gray-100">
                                {(levelLabels[1] || []).length > 0 ? (levelLabels[1] || []).map((label: string) => {
                                  const samples = sampleValues[label.toLowerCase()] || [`Sub ${si + 1}`];
                                  const idx = gi * 2 + si;
                                  return <span key={label} className="font-semibold text-gray-700">{label}: <span className="font-normal text-gray-400">{samples[idx] || samples[idx % samples.length]}</span></span>;
                                }) : (
                                  <span className="font-semibold text-gray-700">Sub-group {si + 1}</span>
                                )}
                              </div>
                              <div className="grid grid-cols-5 gap-2 text-gray-400 font-medium border-b border-gray-50 pb-0.5 mb-0.5">
                                <span>Action</span><span>Qty</span><span>CU Code</span><span>Description</span><span>Trade</span>
                              </div>
                              <div className="grid grid-cols-5 gap-2 text-gray-300">
                                <span>Install</span><span>1</span><span>{si === 0 ? "NEUT-CONN" : "PREP-POLE"}</span><span>{si === 0 ? "Neutral connection" : "Prepare pole"}</span><span>D-Line</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CU Worksheet Mode */}
          <div className="border-t border-gray-200 pt-6">
            <SectionHeader title="CU Worksheet Mode" description="How will compatible units be populated on work orders?" />
            <RadioGroup
              value={form.cuMode}
              onChange={(v: string) => setForm({ ...form, cuMode: v })}
              options={[
                { id: "pre_scoped", label: "Pre-scoped — utility provides CU worksheets", desc: "WOs arrive with CU lists and quantities. Crew works against a checklist and logs completions." },
                { id: "field_captured", label: "Field-captured — crew logs CUs as they work", desc: "No pre-built CU worksheet. Crew selects CUs from the library as they discover and complete work." },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEP 3: LABOR & CREW
// ═══════════════════════════════════════════════════════════════

function Step3LaborCrew({ form, setForm }: any) {
  const selectedPersonnel = form.personnel || [];
  const selectedEquipment = form.equipment || [];
  const [personnelSearch, setPersonnelSearch] = useState("");
  const [equipmentSearch, setEquipmentSearch] = useState("");

  const filteredPersonnel = SAMPLE_PERSONNEL.filter(
    (p) => !selectedPersonnel.includes(p.id) && (
      p.name.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.classification.toLowerCase().includes(personnelSearch.toLowerCase())
    )
  );

  const filteredEquipment = SAMPLE_EQUIPMENT.filter(
    (e) => !selectedEquipment.includes(e.id) && (
      e.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
      e.type.toLowerCase().includes(equipmentSearch.toLowerCase())
    )
  );

  const addPerson = (id: string) => {
    setForm({ ...form, personnel: [...selectedPersonnel, id] });
    setPersonnelSearch("");
  };

  const removePerson = (id: string) => {
    setForm({ ...form, personnel: selectedPersonnel.filter((p: string) => p !== id) });
  };

  const addEquip = (id: string) => {
    setForm({ ...form, equipment: [...selectedEquipment, id] });
    setEquipmentSearch("");
  };

  const removeEquip = (id: string) => {
    setForm({ ...form, equipment: selectedEquipment.filter((e: string) => e !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Union Labor */}
      <SectionHeader title="Labor Configuration" description="Is this job using union labor?" />

      <RadioGroup
        value={form.isUnion}
        onChange={(v: string) => setForm({ ...form, isUnion: v, unionLocals: v === "no" ? [] : form.unionLocals })}
        options={[
          { id: "yes", label: "Yes — union labor", desc: "Crew includes IBEW union members. Union wage and benefit data will be used for cost calculations." },
          { id: "no", label: "No — non-union / open shop" },
        ]}
      />

      {form.isUnion === "yes" && (
        <div>
          <Field label="Union Locals" helper="Select one or more IBEW locals. Jobs can cross jurisdictions.">
            <MultiSelectDropdown
              values={form.unionLocals}
              onChange={(v: string[]) => setForm({ ...form, unionLocals: v })}
              options={SAMPLE_UNION_LOCALS.map((u) => ({ id: u.id, label: u.name, location: u.location }))}
              placeholder="Select union locals..."
              chipColor="blue"
            />
          </Field>
        </div>
      )}

      {/* Crew Assignment */}
      <div className="border-t border-gray-200 pt-6">
        <SectionHeader title="Crew Assignment" description="Assign personnel and equipment to this job. This is optional — you can skip ahead and assign crew later." />
      </div>

      {/* Personnel */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-3">Personnel</div>

        {/* Selected personnel */}
        {selectedPersonnel.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
            <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 flex items-center justify-between">
              <span>Assigned ({selectedPersonnel.length})</span>
            </div>
            {selectedPersonnel.map((id: string) => {
              const person = SAMPLE_PERSONNEL.find((p) => p.id === id);
              if (!person) return null;
              return (
                <div key={id} className="flex items-center justify-between px-3 py-2.5 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      {person.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{person.name}</div>
                      <div className="text-xs text-gray-500">{person.classification}</div>
                    </div>
                  </div>
                  <button onClick={() => removePerson(id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Search to add */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={personnelSearch}
            onChange={(e) => setPersonnelSearch(e.target.value)}
            placeholder="Search personnel by name or classification..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
        {personnelSearch && filteredPersonnel.length > 0 && (
          <div className="mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
            {filteredPersonnel.map((p) => (
              <button
                key={p.id}
                onClick={() => addPerson(p.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <span className="text-gray-900">{p.name}</span>
                    <span className="text-gray-400 ml-2">{p.classification}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  p.status === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>{p.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Equipment */}
      <div className="border-t border-gray-200 pt-6">
        <div className="text-sm font-semibold text-gray-900 mb-3">Equipment</div>

        {selectedEquipment.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
            <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 flex items-center justify-between">
              <span>Assigned ({selectedEquipment.length})</span>
            </div>
            {selectedEquipment.map((id: string) => {
              const equip = SAMPLE_EQUIPMENT.find((e) => e.id === id);
              if (!equip) return null;
              return (
                <div key={id} className="flex items-center justify-between px-3 py-2.5 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <Truck size={12} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{equip.name}</div>
                      <div className="text-xs text-gray-500">{equip.type} · {equip.costCode}</div>
                    </div>
                  </div>
                  <button onClick={() => removeEquip(id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={equipmentSearch}
            onChange={(e) => setEquipmentSearch(e.target.value)}
            placeholder="Search equipment by name or type..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
        {equipmentSearch && filteredEquipment.length > 0 && (
          <div className="mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
            {filteredEquipment.map((e) => (
              <button
                key={e.id}
                onClick={() => addEquip(e.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Truck size={12} className="text-gray-400" />
                  <div>
                    <span className="text-gray-900">{e.name}</span>
                    <span className="text-gray-400 ml-2">{e.type}</span>
                    <span className="text-gray-300 ml-2">·</span>
                    <span className="text-gray-400 ml-2 font-mono text-xs">{e.costCode}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  e.status === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>{e.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEP 5: REVIEW & CREATE
// ═══════════════════════════════════════════════════════════════

function ReviewRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value || "—"}</span>
    </div>
  );
}

function ReviewSection({ title, children, first = false, onEdit }: any) {
  return (
    <div className={first ? "mb-6" : "mb-6 mt-2"}>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
        {onEdit && (
          <button onClick={onEdit} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil size={11} /> Edit
          </button>
        )}
      </div>
      <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "0.75rem", padding: "0 1.25rem", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Step5Review({ form, onGoToStep }: any) {
  const selectedContract = SAMPLE_CONTRACTS.find((c) => c.id === form.contractId);
  const selectedUtility = SAMPLE_UTILITIES.find((u) => u.id === form.utilityId);
  const woFieldNames = (form.woCustomFields || []).map((f: any) => f.name).filter(Boolean);
  const personnelNames = (form.personnel || []).map((id: string) => SAMPLE_PERSONNEL.find((p) => p.id === id)?.name).filter(Boolean);
  const equipmentNames = (form.equipment || []).map((id: string) => {
    const e = SAMPLE_EQUIPMENT.find((eq) => eq.id === id);
    return e ? `${e.name} (${e.type})` : null;
  }).filter(Boolean);
  const unionNames = (form.unionLocals || []).map((id: string) => SAMPLE_UNION_LOCALS.find((u) => u.id === id)?.name).filter(Boolean);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Review Job Configuration</h2>
        <p className="text-sm text-gray-500 mt-0.5">Review all settings before creating the job. You can go back to any step to make changes.</p>
      </div>

      <ReviewSection title="Utility & Contract" first onEdit={() => onGoToStep(1)}>
        <ReviewRow label="Utility" value={selectedUtility?.name} />
        <ReviewRow label="Contract" value={selectedContract?.name} />
        <ReviewRow label="Contract Type" value={selectedContract?.type} />
        <ReviewRow label="Work Type" value={selectedContract?.workType} />
        <ReviewRow label="CU Library" value={selectedContract?.cuLibrary} />
      </ReviewSection>

      <ReviewSection title="Job Details" onEdit={() => onGoToStep(1)}>
        <ReviewRow label="Job Name" value={form.jobName} />
        <ReviewRow label="Job Number" value={form.jobNumber} />
        <ReviewRow label="Start Date" value={form.startDate} />
        <ReviewRow label="Initial Status" value={form.initialStatus === "active" ? "Active" : "Pending"} />
        <ReviewRow label="Location" value={form.city && form.state ? `${form.city}, ${form.state}` : form.city || form.state || "—"} />
      </ReviewSection>

      <ReviewSection title="Work Order Configuration" onEdit={() => onGoToStep(2)}>
        <ReviewRow label="Uses Work Orders" value={form.usesWorkOrders === "yes" ? "Yes" : "No"} />
        {form.usesWorkOrders === "yes" && (
          <>
            <ReviewRow label="WO Structure" value={
              (form.woGroupLevels || []).length === 0 ? "Flat — CUs directly on WO" :
              (form.woGroupLevels || []).length === 1 ? "One grouping level" :
              `${(form.woGroupLevels || []).length} grouping levels (nested)`
            } />
            {(form.woGroupLevels || []).map((lvl: any, i: number) => {
              const fieldNames = (lvl.fields || []).map((f: any) => f.name).filter(Boolean).join(", ");
              return fieldNames ? <ReviewRow key={i} label={i === 0 ? "Group By" : "Then By"} value={fieldNames} /> : null;
            })}
            <ReviewRow label="CU Worksheet Mode" value={form.cuMode === "pre_scoped" ? "Pre-scoped" : form.cuMode === "field_captured" ? "Field-captured" : "—"} />
            <ReviewRow label="WO Fields" value={woFieldNames.length > 0 ? woFieldNames.join(", ") : "None configured"} />
          </>
        )}
      </ReviewSection>

      <ReviewSection title="Labor & Crew" onEdit={() => onGoToStep(3)}>
        <ReviewRow label="Union Labor" value={form.isUnion === "yes" ? "Yes" : form.isUnion === "no" ? "No" : "—"} />
        {form.isUnion === "yes" && (
          <ReviewRow label="Union Locals" value={unionNames.length > 0 ? unionNames.join(", ") : "—"} />
        )}
        <ReviewRow label="Personnel" value={personnelNames.length > 0 ? `${personnelNames.length} assigned` : "None — assign later"} />
        {personnelNames.length > 0 && <ReviewRow label="" value={personnelNames.join(", ")} />}
        <ReviewRow label="Equipment" value={equipmentNames.length > 0 ? `${equipmentNames.length} assigned` : "None — assign later"} />
        {equipmentNames.length > 0 && <ReviewRow label="" value={equipmentNames.join(", ")} />}
      </ReviewSection>

      <ReviewSection title="Inherited from Contract">
        <ReviewRow label="Rate Type" value={selectedContract?.rateType} />
        <ReviewRow label="Invoice Cadence" value={selectedContract?.invoiceCadence} />
        <ReviewRow label="Invoice Grouping" value={selectedContract?.invoiceGrouping} />
        <ReviewRow label="Invoice Detail" value={selectedContract?.invoiceDetail} />
      </ReviewSection>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  JOB SETUP WIZARD
// ═══════════════════════════════════════════════════════════════

function JobSetupWizard({ onCancel, onComplete }: any) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1 — Basics
    utilityId: "",
    contractId: "",
    jobName: "",
    jobNumber: "",
    startDate: "",
    initialStatus: "active",
    city: "",
    state: "",
    // Step 2 — Work Orders
    usesWorkOrders: "",
    woGroupLevels: [] as { fields: any[] }[],
    woCustomFields: [] as any[],
    cuMode: "",
    // Step 3 — Labor & Crew
    isUnion: "",
    unionLocals: [] as string[],
    personnel: [] as string[],
    equipment: [] as string[],
  });

  const selectedContract = SAMPLE_CONTRACTS.find((c) => c.id === form.contractId);

  const canAdvance = () => {
    if (step === 1) return form.utilityId && form.contractId && form.jobName;
    if (step === 2) return true;
    if (step === 3) return true; // labor & crew are optional
    return true;
  };

  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      // Create the job
      const selectedContract = SAMPLE_CONTRACTS.find((c) => c.id === form.contractId);
      const selectedUtility = SAMPLE_UTILITIES.find((u) => u.id === form.utilityId);
      const newJob = {
        id: `JOB-${String(Date.now()).slice(-3)}`,
        name: form.jobName,
        utility: selectedUtility?.name || "",
        contract: selectedContract?.name || "",
        contractType: selectedContract?.type || "",
        workType: selectedContract?.workType || "",
        status: form.initialStatus === "active" ? "Active" : "Pending",
        city: form.city,
        state: form.state,
        startDate: form.startDate,
        billedToDate: "$0.00",
        cusCompleted: 0,
        woCount: 0,
      };
      onComplete(newJob);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Create New Job</h1>
          <p className="text-sm text-gray-500">Configure the job and its work order structure</p>
        </div>
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1">
          <X size={16} /> Cancel
        </button>
      </div>

      {/* Stepper — steps adapt based on selected contract type */}
      <Stepper
        currentStep={step}
        steps={getJobSteps(selectedContract?.type || "")}
        contractSelected={!!form.contractId}
      />

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {step === 1 && <Step1Basics form={form} setForm={setForm} />}
        {step === 2 && <Step2WorkOrders form={form} setForm={setForm} />}
        {step === 3 && <Step3LaborCrew form={form} setForm={setForm} />}
        {step === 4 && <Step5Review form={form} onGoToStep={setStep} />}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between sticky bottom-0 bg-white">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} /> {step > 1 ? "Back" : "Cancel"}
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={next}
            disabled={!canAdvance()}
            className={`flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              canAdvance()
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {step === 4 ? "Create Job" : "Continue"} {step < 4 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  JOB DETAIL VIEW
// ═══════════════════════════════════════════════════════════════

const WO_COLUMNS = [
  { id: "id", label: "WO #", locked: true, defaultOn: true },
  { id: "station", label: "Station / Location", locked: false, defaultOn: true },
  { id: "region", label: "Region", locked: false, defaultOn: true },
  { id: "priority", label: "Priority", locked: false, defaultOn: true },
  { id: "status", label: "Status", locked: false, defaultOn: true },
  { id: "crew", label: "Crew", locked: false, defaultOn: true },
  { id: "cus", label: "CUs", locked: false, defaultOn: true },
  { id: "risDate", label: "RIS Date", locked: false, defaultOn: true },
  { id: "activity", label: "Activity", locked: false, defaultOn: true },
  { id: "serviceCenter", label: "Service Center", locked: false, defaultOn: false },
];

const SAMPLE_CREWS = [
  "Crew A – Rivera",
  "Crew B – Thompson",
  "Crew C – Davis",
  "Crew D – Martinez",
  "Crew E – Johnson",
  "Crew F – Brooks",
];

const EMPTY_WO_FORM = {
  woNumber: "",
  station: "",
  region: "",
  priority: "Normal",
  serviceCenter: "",
  risDate: "",
  crew: "",
  notes: "",
};

function JobDetail({ job, onBack, onViewWO }: any) {
  const [activeTab, setActiveTab] = useState("overview");
  const [woStatusFilter, setWoStatusFilter] = useState("all");
  const [woSearch, setWoSearch] = useState("");
  const [visibleCols, setVisibleCols] = useState<string[]>(WO_COLUMNS.filter((c) => c.defaultOn).map((c) => c.id));
  const [showColPicker, setShowColPicker] = useState(false);
  const colPickerRef = useRef<HTMLDivElement>(null);
  const [showAddWO, setShowAddWO] = useState(false);
  const [woForm, setWoForm] = useState({ ...EMPTY_WO_FORM });
  const [localWOs, setLocalWOs] = useState<any[]>([]);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [jobHeaderExpanded, setJobHeaderExpanded] = useState(false);

  // Crew & Equipment tab state
  const [crewMembers, setCrewMembers] = useState([
    { id: "cm-1", name: "Carlos Rivera", role: "General Foreman", initials: "CR" },
    { id: "cm-2", name: "Marcus Thompson", role: "Lineman", initials: "MT" },
    { id: "cm-3", name: "Sarah Chen", role: "Operator", initials: "SC" },
    { id: "cm-4", name: "Diego Martinez", role: "Groundman", initials: "DM" },
  ]);
  const [equipmentAssets, setEquipmentAssets] = useState([
    { id: "eq-1", assetId: "TRK-204", type: "Bucket Truck – 55ft" },
    { id: "eq-2", assetId: "DIG-118", type: "Digger Derrick" },
    { id: "eq-3", assetId: "PUP-306", type: "Crew Pickup (4x4)" },
    { id: "eq-4", assetId: "TRL-052", type: "Material Trailer – 24ft" },
  ]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberSearch, setNewMemberSearch] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Lineman");
  const [newMemberSelectedList, setNewMemberSelectedList] = useState<{ name: string; defaultRole: string; initials: string }[]>([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [creatingNewPerson, setCreatingNewPerson] = useState(false);
  const [newPersonFirstName, setNewPersonFirstName] = useState("");
  const [newPersonLastName, setNewPersonLastName] = useState("");
  const MOCK_AVAILABLE_USERS = [
    { name: "Alex Johnson", defaultRole: "Field", initials: "AJ" },
    { name: "Priya Patel", defaultRole: "Field", initials: "PP" },
    { name: "Tomás Vega", defaultRole: "Field", initials: "TV" },
    { name: "Rachel Kim", defaultRole: "Field", initials: "RK" },
    { name: "Jackson Wells", defaultRole: "Field", initials: "JW" },
  ];
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [newAssetId, setNewAssetId] = useState("");
  const [newAssetType, setNewAssetType] = useState("");

  // Production tab state
  const [productionSearch, setProductionSearch] = useState("");
  const [productionDateRange, setProductionDateRange] = useState("this_week");
  const [productionCrewFilter, setProductionCrewFilter] = useState("all");
  const [showProductionColPicker, setShowProductionColPicker] = useState(false);
  const productionColPickerRef = useRef<HTMLDivElement>(null);
  const PRODUCTION_COLUMNS = [
    { id: "logId", label: "Log ID", locked: true },
    { id: "logDate", label: "Log Date", locked: true },
    { id: "workOrder", label: "Work Order", locked: true },
    { id: "crew", label: "Crew", locked: false },
    { id: "cuCode", label: "CU Code", locked: true },
    { id: "description", label: "Description", locked: false },
    { id: "function", label: "Function", locked: false },
    { id: "unit", label: "Unit", locked: false },
    { id: "qty", label: "Qty", locked: false },
    { id: "unitPrice", label: "Unit Price", locked: false },
    { id: "earned", label: "Earned $", locked: true },
  ];
  const [showProductionDatePicker, setShowProductionDatePicker] = useState(false);
  const [showProductionCrewPicker, setShowProductionCrewPicker] = useState(false);
  const productionDatePickerRef = useRef<HTMLDivElement>(null);
  const productionCrewPickerRef = useRef<HTMLDivElement>(null);
  const [productionGroupBy, setProductionGroupBy] = useState<"none" | "workOrder" | "crew" | "logDate">("none");
  const [showProductionGroupByPicker, setShowProductionGroupByPicker] = useState(false);
  const productionGroupByPickerRef = useRef<HTMLDivElement>(null);
  const [collapsedProductionGroups, setCollapsedProductionGroups] = useState<Set<string>>(new Set());
  const toggleProductionGroup = (groupName: string) => {
    setCollapsedProductionGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (productionDatePickerRef.current && !productionDatePickerRef.current.contains(e.target as Node)) setShowProductionDatePicker(false);
      if (productionCrewPickerRef.current && !productionCrewPickerRef.current.contains(e.target as Node)) setShowProductionCrewPicker(false);
      if (productionGroupByPickerRef.current && !productionGroupByPickerRef.current.contains(e.target as Node)) setShowProductionGroupByPicker(false);
    };
    if (showProductionDatePicker || showProductionCrewPicker || showProductionGroupByPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showProductionDatePicker, showProductionCrewPicker, showProductionGroupByPicker]);
  const [visibleProductionCols, setVisibleProductionCols] = useState<string[]>(PRODUCTION_COLUMNS.map((c) => c.id));
  const toggleProductionCol = (colId: string) => {
    const col = PRODUCTION_COLUMNS.find((c) => c.id === colId);
    if (col?.locked) return;
    setVisibleProductionCols((prev) => prev.includes(colId) ? prev.filter((c) => c !== colId) : [...prev, colId]);
  };
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (productionColPickerRef.current && !productionColPickerRef.current.contains(e.target as Node)) setShowProductionColPicker(false);
    };
    if (showProductionColPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showProductionColPicker]);

  // Mock production log entries — realistic utility construction data with full audit metadata
  const productionLog = [
    { id: "pl-1", logId: "TX-A84F", logDate: "Apr 14, 2026", workOrder: "WO-27443", crew: "Crew A – Rivera", cuCode: "P45-3", desc: "Wood Pole, 45ft Class 3", fn: "Install", unit: "Each", qty: 4, unitPrice: 2847.50 },
    { id: "pl-2", logId: "TX-B291", logDate: "Apr 14, 2026", workOrder: "WO-27443", crew: "Crew A – Rivera", cuCode: "XA-10", desc: "10ft Crossarm Assembly", fn: "Install", unit: "Each", qty: 4, unitPrice: 318.75 },
    { id: "pl-3", logId: "TX-C7D2", logDate: "Apr 14, 2026", workOrder: "WO-27443", crew: "Crew A – Rivera", cuCode: "W-336", desc: "336 AWG Wire", fn: "Install", unit: "LF", qty: 800, unitPrice: 4.82 },
    { id: "pl-4", logId: "TX-D4A6", logDate: "Apr 13, 2026", workOrder: "WO-27444", crew: "Crew A – Rivera", cuCode: "GA-1", desc: "Ground Anchor w/ Rod", fn: "Install", unit: "Each", qty: 6, unitPrice: 145.20 },
    { id: "pl-5", logId: "TX-E519", logDate: "Apr 13, 2026", workOrder: "WO-27444", crew: "Crew A – Rivera", cuCode: "T-50K", desc: "50KVA Transformer", fn: "Install", unit: "Each", qty: 2, unitPrice: 4312.50 },
    { id: "pl-6", logId: "TX-F08C", logDate: "Apr 10, 2026", workOrder: "WO-27445", crew: "Crew B – Thompson", cuCode: "P50-2", desc: "Wood Pole, 50ft Class 2", fn: "Install", unit: "Each", qty: 3, unitPrice: 3612.00 },
    { id: "pl-7", logId: "TX-1B3E", logDate: "Apr 10, 2026", workOrder: "WO-27445", crew: "Crew B – Thompson", cuCode: "RP45-3", desc: "45ft Pole", fn: "Remove", unit: "Each", qty: 3, unitPrice: 1850.00 },
    { id: "pl-8", logId: "TX-2C7A", logDate: "Apr 9, 2026", workOrder: "WO-27445", crew: "Crew B – Thompson", cuCode: "S-6090", desc: "Service Drop Assembly", fn: "Transfer", unit: "Each", qty: 8, unitPrice: 186.40 },
  ];

  const uniqueCrewsInLog = [...new Set(productionLog.map((p) => p.crew))];

  const filteredProductionLog = productionLog.filter((p) => {
    if (productionSearch.trim()) {
      const q = productionSearch.trim().toLowerCase();
      const match = p.cuCode.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.workOrder.toLowerCase().includes(q) || p.crew.toLowerCase().includes(q) || p.logId.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (productionCrewFilter !== "all" && p.crew !== productionCrewFilter) return false;
    return true;
  });

  // Financial aggregates across filtered log
  const productionTotalEarned = filteredProductionLog.reduce((s, p) => s + p.qty * p.unitPrice, 0);
  const productionTotalUnits = filteredProductionLog.reduce((s, p) => s + p.qty, 0);

  // Group filtered log by active grouping
  const productionGroupKey = (p: any) =>
    productionGroupBy === "workOrder" ? p.workOrder
    : productionGroupBy === "crew" ? p.crew
    : productionGroupBy === "logDate" ? p.logDate
    : "";
  const productionGroupLabel: Record<string, string> = {
    workOrder: "Work Order",
    crew: "Crew",
    logDate: "Log Date",
  };
  const productionGroups = productionGroupBy === "none" ? null : (() => {
    const map = new Map<string, any[]>();
    filteredProductionLog.forEach((p) => {
      const key = productionGroupKey(p);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return [...map.entries()].map(([name, items]) => ({
      name,
      items,
      subtotal: items.reduce((s, p) => s + p.qty * p.unitPrice, 0),
      subtotalQty: items.reduce((s, p) => s + p.qty, 0),
    }));
  })();

  // Date range helpers — compute actual date windows dynamically
  const [productionCustomStart, setProductionCustomStart] = useState("");
  const [productionCustomEnd, setProductionCustomEnd] = useState("");
  const [showCustomRangeEditor, setShowCustomRangeEditor] = useState(false);

  const formatDateShort = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatDateLong = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const getDateRangeBounds = (rangeId: string): { start: Date | null; end: Date | null; label: string } => {
    const now = new Date();
    // Anchor "today" at local midnight
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (rangeId === "this_week") {
      // Sun-Sat week
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end, label: `${formatDateShort(start)} - ${formatDateShort(end)}` };
    }
    if (rangeId === "last_week") {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay() - 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end, label: `${formatDateShort(start)} - ${formatDateShort(end)}` };
    }
    if (rangeId === "this_month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start, end, label: `${formatDateShort(start)} - ${formatDateShort(end)}` };
    }
    if (rangeId === "custom" && productionCustomStart && productionCustomEnd) {
      return {
        start: new Date(productionCustomStart + "T00:00:00"),
        end: new Date(productionCustomEnd + "T00:00:00"),
        label: `${formatDateLong(productionCustomStart)} - ${formatDateLong(productionCustomEnd)}`,
      };
    }
    return { start: null, end: null, label: "All Time" };
  };
  const activeRangeBounds = getDateRangeBounds(productionDateRange);

  // Compact range formatter — collapses same-month ranges (e.g., "Apr 12 - 18")
  const formatCompactRange = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "";
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const startStr = formatDateShort(start);
    const endStr = sameMonth ? String(end.getDate()) : formatDateShort(end);
    return `${startStr} - ${endStr}`;
  };

  // Button label — combines preset name with its computed range; custom shows only the range
  const presetLabels: Record<string, string> = {
    this_week: "This Week",
    last_week: "Last Week",
    this_month: "This Month",
    all_time: "All Time",
  };
  const dateButtonLabel = (() => {
    if (productionDateRange === "all_time") return "All Time";
    if (productionDateRange === "custom") return formatCompactRange(activeRangeBounds.start, activeRangeBounds.end);
    const presetName = presetLabels[productionDateRange] || "";
    const range = formatCompactRange(activeRangeBounds.start, activeRangeBounds.end);
    return range ? `${presetName} (${range})` : presetName;
  })();

  // Close column picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colPickerRef.current && !colPickerRef.current.contains(e.target as Node)) setShowColPicker(false);
    };
    if (showColPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showColPicker]);

  const toggleCol = (colId: string) => {
    const col = WO_COLUMNS.find((c) => c.id === colId);
    if (col?.locked) return;
    setVisibleCols((prev) => prev.includes(colId) ? prev.filter((c) => c !== colId) : [...prev, colId]);
  };

  const isColVisible = (colId: string) => visibleCols.includes(colId);

  const saveWO = (andAddAnother: boolean) => {
    if (!woForm.woNumber.trim()) return;
    const newWO = {
      id: woForm.woNumber.trim(),
      station: woForm.station || "—",
      region: woForm.region || "—",
      priority: woForm.priority,
      serviceCenter: woForm.serviceCenter || "—",
      risDate: woForm.risDate || "—",
      status: "Not Started",
      cusTotal: 0,
      cusCompleted: 0,
      crew: woForm.crew || "Unassigned",
      lastActivity: "Just now",
      notes: woForm.notes,
    };
    setLocalWOs((prev) => [newWO, ...prev]);
    setJustAdded(newWO.id);
    setTimeout(() => setJustAdded(null), 2000);
    if (andAddAnother) {
      setWoForm({ ...EMPTY_WO_FORM });
    } else {
      setWoForm({ ...EMPTY_WO_FORM });
      setShowAddWO(false);
    }
  };

  const allWOs = [...localWOs, ...(SAMPLE_WOS[job.id] || [])];
  const contract = SAMPLE_CONTRACTS.find((c) => c.name === job.contract);
  const utility = SAMPLE_UTILITIES.find((u) => u.name === job.utility);
  const statusKey = job.status.toLowerCase().replace(/ /g, "_");
  const statusConfig = JOB_STATUS_CONFIG[statusKey] || JOB_STATUS_CONFIG.active;

  // KPI calculations
  const totalWOs = allWOs.length;
  const wosInProgress = allWOs.filter((w: any) => w.status === "In Progress").length;
  const wosComplete = allWOs.filter((w: any) => w.status === "Complete" || w.status === "Invoiced").length;
  const wosNotStarted = allWOs.filter((w: any) => w.status === "Not Started").length;
  const totalCUs = allWOs.reduce((s: number, w: any) => s + w.cusTotal, 0);
  const completedCUs = allWOs.reduce((s: number, w: any) => s + w.cusCompleted, 0);
  const cuPct = totalCUs > 0 ? Math.round((completedCUs / totalCUs) * 100) : 0;
  const uniqueCrews = [...new Set(allWOs.map((w: any) => w.crew).filter((c: string) => c !== "Unassigned"))];

  // WO filtering
  const filteredWOs = allWOs.filter((w: any) => {
    if (woStatusFilter !== "all" && w.status.toLowerCase() !== woStatusFilter) return false;
    if (woSearch) {
      const q = woSearch.toLowerCase();
      return w.id.toLowerCase().includes(q) || w.station.toLowerCase().includes(q) || w.crew.toLowerCase().includes(q) || w.region.toLowerCase().includes(q);
    }
    return true;
  });

  const woStatusCounts = allWOs.reduce((acc: any, w: any) => {
    const s = w.status.toLowerCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const tabs = [
    { id: "overview", label: "Overview", enabled: true },
    { id: "crew", label: "Crew & Equipment", enabled: true },
    { id: "production", label: "Production", enabled: true },
    { id: "invoicing", label: "Invoicing", enabled: false },
    { id: "settings", label: "Settings", enabled: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 flex items-center gap-1.5 text-xs text-gray-400">
          <span className="text-gray-400">Bluesky</span>
          <ChevronRight size={10} />
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">Jobs</button>
          <ChevronRight size={10} />
          <span className="text-gray-700 font-medium">{job.name}</span>
        </div>
      </div>

      {/* Page Header — progressive disclosure */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 cursor-pointer" onClick={() => setJobHeaderExpanded((e) => !e)}>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{job.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setJobHeaderExpanded((e) => !e)}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {jobHeaderExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Expanded Job Details */}
          {jobHeaderExpanded && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Job Details</div>
                <button
                  onClick={() => alert("Edit Job metadata — coming soon")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings size={12} /> Edit Job
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Job ID", value: job.id },
                  { label: "Utility", value: job.utility },
                  { label: "Contract", value: job.contract },
                  { label: "Location", value: `${job.city}, ${job.state}` },
                  { label: "Started", value: job.startDate },
                  ...(contract ? [
                    { label: "Work Type", value: contract.workType },
                    { label: "Contract Type", value: contract.type },
                  ] : []),
                ].map((f) => (
                  <div key={f.label}>
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">{f.label}</div>
                    <div className="text-sm font-medium text-gray-900">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab bar */}
          <div className="flex items-center gap-0 mt-4 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.enabled && setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors relative ${
                  activeTab === tab.id
                    ? "text-gray-900 border-gray-900"
                    : tab.enabled
                    ? "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    : "text-gray-300 border-transparent cursor-default"
                }`}
              >
                {tab.label}
                {!tab.enabled && (
                  <span className="ml-1.5 text-[9px] font-normal text-gray-300">Soon</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      {activeTab === "overview" && (
        <div className="px-6 py-6">
          {/* WO Backlog Table — Unified Control Plane */}
          <div>
            {/* Title row — title only */}
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Work Orders</h2>
            </div>

            {/* Unified control row — search + filters left, columns + add right */}
            <div className="flex justify-between items-center mb-4 mt-4 gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-full max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={woSearch}
                    onChange={(e) => setWoSearch(e.target.value)}
                    placeholder="Search work orders..."
                    className="w-full h-10 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {[
                    { id: "all", label: "All", count: totalWOs },
                    { id: "in progress", label: "In Progress", count: woStatusCounts["in progress"] || 0 },
                    { id: "not started", label: "Not Started", count: woStatusCounts["not started"] || 0 },
                    { id: "complete", label: "Complete", count: woStatusCounts["complete"] || 0 },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setWoStatusFilter(f.id)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        woStatusFilter === f.id
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {f.label} <span className={woStatusFilter === f.id ? "text-gray-400" : "text-gray-300"}>{f.count}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Column picker */}
                <div className="relative" ref={colPickerRef}>
                  <button
                    onClick={() => setShowColPicker(!showColPicker)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      showColPicker ? "bg-gray-100 text-gray-700 border border-gray-300" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Columns3 size={14} /> Columns
                  </button>
                  {showColPicker && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                      <div className="px-3 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wide">Columns</div>
                      {WO_COLUMNS.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => toggleCol(col.id)}
                          className="flex items-center gap-2.5 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isColVisible(col.id)
                              ? "bg-gray-800 border-gray-800"
                              : "border-gray-300 bg-white"
                          } ${col.locked ? "opacity-60" : ""}`}>
                            {isColVisible(col.id) && <Check size={10} className="text-white" />}
                          </div>
                          <span className={`flex-1 ${isColVisible(col.id) ? "text-gray-900 font-medium" : "text-gray-500"}`}>{col.label}</span>
                          {col.locked && <span className="text-[10px] text-gray-300">Locked</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Solid primary Add button */}
                <button
                  onClick={() => { setWoForm({ ...EMPTY_WO_FORM }); setShowAddWO(true); }}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} /> Add Work Order
                </button>
              </div>
            </div>

            {/* WO Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {isColVisible("id") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">WO #</th>}
                    {isColVisible("station") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Station / Location</th>}
                    {isColVisible("region") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Region</th>}
                    {isColVisible("serviceCenter") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Service Center</th>}
                    {isColVisible("priority") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Priority</th>}
                    {isColVisible("status") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Status</th>}
                    {isColVisible("crew") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Crew</th>}
                    {isColVisible("cus") && <th className="text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">CUs</th>}
                    {isColVisible("risDate") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">RIS Date</th>}
                    {isColVisible("activity") && <th className="text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Activity</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredWOs.map((wo: any) => {
                    const wsKey = wo.status.toLowerCase();
                    const ws = WO_STATUS_CONFIG[wsKey] || WO_STATUS_CONFIG["not started"];
                    const cuPctWo = wo.cusTotal > 0 ? Math.round((wo.cusCompleted / wo.cusTotal) * 100) : 0;
                    const isOverdue = wo.status !== "Complete" && wo.status !== "Invoiced" && new Date(wo.risDate) < new Date();
                    return (
                      <tr key={wo.id} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group ${justAdded === wo.id ? "bg-emerald-50/50" : ""}`} onClick={() => onViewWO && onViewWO(wo)}>
                        {isColVisible("id") && (
                          <td className="px-3 py-2.5">
                            <span className="text-sm font-medium text-gray-900">{wo.id}</span>
                          </td>
                        )}
                        {isColVisible("station") && (
                          <td className="px-3 py-2.5">
                            <span className="text-sm text-gray-700">{wo.station}</span>
                          </td>
                        )}
                        {isColVisible("region") && (
                          <td className="px-3 py-2.5">
                            <span className="text-sm text-gray-600">{wo.region}</span>
                          </td>
                        )}
                        {isColVisible("serviceCenter") && (
                          <td className="px-3 py-2.5">
                            <span className="text-sm text-gray-600">{wo.serviceCenter}</span>
                          </td>
                        )}
                        {isColVisible("priority") && (
                          <td className="px-3 py-2.5">
                            <span className="text-sm text-gray-600">{wo.priority}</span>
                          </td>
                        )}
                        {isColVisible("status") && (
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${ws.bg} ${ws.text} border ${ws.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ws.dot}`} />
                              {ws.label}
                            </span>
                          </td>
                        )}
                        {isColVisible("crew") && (
                          <td className="px-3 py-2.5">
                            <span className={`text-sm ${wo.crew === "Unassigned" ? "text-gray-400 italic" : "text-gray-700"}`}>{wo.crew}</span>
                          </td>
                        )}
                        {isColVisible("cus") && (
                          <td className="px-3 py-2.5 text-right">
                            <span className="text-sm text-gray-900 tabular-nums">{wo.cusCompleted.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 ml-1">logged</span>
                          </td>
                        )}
                        {isColVisible("risDate") && (
                          <td className="px-3 py-2.5">
                            <span className={`text-sm tabular-nums ${isOverdue ? "text-red-500 font-medium" : "text-gray-600"}`}>
                              {wo.risDate}
                              {isOverdue && <span className="text-[10px] ml-1">overdue</span>}
                            </span>
                          </td>
                        )}
                        {isColVisible("activity") && (
                          <td className="px-3 py-2.5 text-right">
                            <span className="text-xs text-gray-400">{wo.lastActivity}</span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {filteredWOs.length === 0 && (
                    <tr>
                      <td colSpan={visibleCols.length} className="px-3 py-12 text-center">
                        <div className="text-sm text-gray-400">No work orders match your filters</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {filteredWOs.length > 0 && (
                <div className="px-3 py-2 border-t border-gray-100 text-xs text-gray-400 text-right">
                  {filteredWOs.length} of {totalWOs} work orders
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Crew & Equipment Tab (Live Roster) ─── */}
      {activeTab === "crew" && (
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assigned Personnel Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Assigned Personnel</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{crewMembers.length} member{crewMembers.length !== 1 ? "s" : ""} on this job</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddMemberModal(true);
                    setNewMemberSearch("");
                    setNewMemberRole("Lineman");
                    setNewMemberSelectedList([]);
                    setUserDropdownOpen(false);
                    setCreatingNewPerson(false);
                    setNewPersonFirstName("");
                    setNewPersonLastName("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus size={12} /> Add Member
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {crewMembers.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <Users size={24} className="mx-auto text-gray-300 mb-2" />
                    <div className="text-sm text-gray-400">No personnel assigned yet</div>
                  </div>
                ) : crewMembers.map((m: any) => (
                  <div key={m.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {m.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{m.name}</div>
                      <div className="text-xs text-gray-500 truncate">{m.role}</div>
                    </div>
                    <button
                      onClick={() => setCrewMembers((prev) => prev.filter((x) => x.id !== m.id))}
                      title="Remove from job"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Equipment Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Assigned Equipment</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{equipmentAssets.length} asset{equipmentAssets.length !== 1 ? "s" : ""} on this job</p>
                </div>
                <button
                  disabled
                  title="Equipment management coming soon"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                >
                  <Plus size={12} /> Add Equipment
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {equipmentAssets.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <Truck size={24} className="mx-auto text-gray-300 mb-2" />
                    <div className="text-sm text-gray-400">No equipment assigned yet</div>
                  </div>
                ) : equipmentAssets.map((e: any) => (
                  <div key={e.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-100">
                      <Truck size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 font-mono truncate">{e.assetId}</div>
                      <div className="text-xs text-gray-500 truncate">{e.type}</div>
                    </div>
                    <button
                      onClick={() => setEquipmentAssets((prev) => prev.filter((x) => x.id !== e.id))}
                      title="Remove from job"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (() => {
        const q = newMemberSearch.trim().toLowerCase();
        const results = q
          ? MOCK_AVAILABLE_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.defaultRole.toLowerCase().includes(q))
          : MOCK_AVAILABLE_USERS;
        const closeModal = () => {
          setShowAddMemberModal(false);
          setNewMemberSelectedList([]);
          setNewMemberSearch("");
          setUserDropdownOpen(false);
          setCreatingNewPerson(false);
          setNewPersonFirstName("");
          setNewPersonLastName("");
        };
        const canSave = creatingNewPerson
          ? newPersonFirstName.trim().length > 0 && newPersonLastName.trim().length > 0
          : newMemberSelectedList.length > 0;
        const isUserSelected = (name: string) => newMemberSelectedList.some((u) => u.name === name);
        const toggleUserSelection = (u: { name: string; defaultRole: string; initials: string }) => {
          setNewMemberSelectedList((prev) =>
            prev.some((x) => x.name === u.name)
              ? prev.filter((x) => x.name !== u.name)
              : [...prev, u]
          );
        };
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={closeModal}>
            <div className="bg-white rounded-xl shadow-xl w-[480px] overflow-visible" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Add Member to Job</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Assign an existing user to this job's roster</p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={16} />
                </button>
              </div>
              <div className="px-5 py-4 space-y-4">
                {!creatingNewPerson ? (
                  /* ── Mode: Pick existing users (multi-select) ── */
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Select Existing Users
                        {newMemberSelectedList.length > 0 && (
                          <span className="ml-1.5 text-gray-400 font-normal">({newMemberSelectedList.length} selected)</span>
                        )}
                      </label>
                      <button
                        onClick={() => {
                          setCreatingNewPerson(true);
                          setNewMemberSelectedList([]);
                          setNewMemberSearch("");
                          setUserDropdownOpen(false);
                        }}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        + Add new person
                      </button>
                    </div>
                    {/* Chips row — selected users */}
                    {newMemberSelectedList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {newMemberSelectedList.map((u) => (
                          <span key={u.name} className="inline-flex items-center gap-1.5 pl-1 pr-1.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-semibold flex-shrink-0">
                              {u.initials}
                            </span>
                            <span className="font-medium">{u.name}</span>
                            <span className="text-blue-400">·</span>
                            <span className="text-blue-600/70">{u.defaultRole}</span>
                            <button
                              onClick={() => toggleUserSelection(u)}
                              className="ml-0.5 text-blue-400 hover:text-blue-700 p-0.5 rounded-full"
                              title="Remove from selection"
                            >
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Search combobox */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                      <input
                        type="text"
                        value={newMemberSearch}
                        onChange={(e) => { setNewMemberSearch(e.target.value); setUserDropdownOpen(true); }}
                        onClick={() => setUserDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setUserDropdownOpen(false), 150)}
                        placeholder="Search users..."
                        className="w-full h-10 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      />
                      {userDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                          <div className="divide-y divide-gray-100">
                            {results.length === 0 ? (
                              <div className="px-3 py-4 text-center text-sm text-gray-400">No users match "{newMemberSearch}"</div>
                            ) : results.map((u) => {
                              const selected = isUserSelected(u.name);
                              return (
                                <button
                                  key={u.name}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    toggleUserSelection(u);
                                    // Keep dropdown open for multi-pick, but clear query for faster next search
                                    setNewMemberSearch("");
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${selected ? "bg-blue-50/40" : ""}`}
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                                    {selected && <Check size={10} className="text-white" />}
                                  </div>
                                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                                    {u.initials}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{u.defaultRole}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setCreatingNewPerson(true);
                              setNewMemberSelectedList([]);
                              setNewMemberSearch("");
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 border-t border-gray-100 transition-colors"
                          >
                            <Plus size={14} />
                            Add new person{newMemberSearch.trim() ? ` "${newMemberSearch.trim()}"` : ""}
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">Each user will be added with their existing classification.</p>
                  </div>
                ) : (
                  /* ── Mode: Create new person ── */
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-gray-700">New Person</label>
                        <button
                          onClick={() => {
                            setCreatingNewPerson(false);
                            setNewPersonFirstName("");
                            setNewPersonLastName("");
                          }}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          ← Back to search
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">First Name</label>
                          <input
                            type="text"
                            value={newPersonFirstName}
                            onChange={(e) => setNewPersonFirstName(e.target.value)}
                            placeholder="e.g., Jordan"
                            autoFocus
                            className="w-full h-10 px-3 text-sm placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={newPersonLastName}
                            onChange={(e) => setNewPersonLastName(e.target.value)}
                            placeholder="e.g., Nguyen"
                            className="w-full h-10 px-3 text-sm placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Classification</label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full h-10 px-3 text-sm text-gray-900 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option>Foreman</option>
                        <option>Lineman</option>
                        <option>Operator</option>
                        <option>Groundman</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >Cancel</button>
                <button
                  onClick={() => {
                    if (!canSave) return;
                    if (creatingNewPerson) {
                      const first = newPersonFirstName.trim();
                      const last = newPersonLastName.trim();
                      const fullName = `${first} ${last}`;
                      const initials = `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
                      setCrewMembers((prev) => [
                        ...prev,
                        { id: `cm-${Date.now()}`, name: fullName, role: newMemberRole, initials },
                      ]);
                    } else if (newMemberSelectedList.length > 0) {
                      const newRows = newMemberSelectedList.map((u, i) => ({
                        id: `cm-${Date.now()}-${i}`,
                        name: u.name,
                        role: u.defaultRole,
                        initials: u.initials,
                      }));
                      setCrewMembers((prev) => [...prev, ...newRows]);
                    }
                    closeModal();
                  }}
                  disabled={!canSave}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    canSave
                      ? "bg-gray-900 text-white hover:bg-black"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {creatingNewPerson
                    ? "Save"
                    : newMemberSelectedList.length > 1
                    ? `Add ${newMemberSelectedList.length} Members`
                    : "Save"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Equipment Modal */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setShowAddEquipmentModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-[440px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Add Equipment</h3>
                <p className="text-xs text-gray-400 mt-0.5">Assign an asset to this job</p>
              </div>
              <button onClick={() => setShowAddEquipmentModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Asset ID</label>
                <input
                  type="text"
                  value={newAssetId}
                  onChange={(e) => setNewAssetId(e.target.value.toUpperCase())}
                  placeholder="e.g., TRK-215"
                  autoFocus
                  className="w-full h-10 px-3 text-sm font-mono placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Asset Type</label>
                <input
                  type="text"
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value)}
                  placeholder="e.g., Bucket Truck – 55ft"
                  className="w-full h-10 px-3 text-sm placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >Cancel</button>
              <button
                onClick={() => {
                  if (!newAssetId.trim() || !newAssetType.trim()) return;
                  setEquipmentAssets((prev) => [...prev, { id: `eq-${Date.now()}`, assetId: newAssetId.trim(), type: newAssetType.trim() }]);
                  setShowAddEquipmentModal(false);
                }}
                disabled={!newAssetId.trim() || !newAssetType.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  newAssetId.trim() && newAssetType.trim()
                    ? "bg-gray-900 text-white hover:bg-black"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Production Tab (Master Ledger) ─── */}
      {activeTab === "production" && (
        <div className="px-6 py-6">
          {/* Summary Cards — Financial Overview (2 cards) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Earned Value</div>
              <div className="text-3xl font-bold text-green-700 tabular-nums">
                ${productionTotalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-400 mt-1.5">Across {filteredProductionLog.length} logged event{filteredProductionLog.length !== 1 ? "s" : ""}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Units Logged</div>
              <div className="text-3xl font-bold text-gray-900 tabular-nums">
                {productionTotalUnits.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1.5">Units across {[...new Set(filteredProductionLog.map((p) => p.workOrder))].length} work order{[...new Set(filteredProductionLog.map((p) => p.workOrder))].length !== 1 ? "s" : ""}</div>
            </div>
          </div>

          {/* Unified Control Plane */}
          <div className="flex justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Search */}
              <div className="relative w-64 flex-shrink-0">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={productionSearch}
                  onChange={(e) => setProductionSearch(e.target.value)}
                  placeholder="Search production log..."
                  className="w-full h-10 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              {/* Date Range picker — explicit dates, with custom range support */}
              <div className="relative flex-shrink-0" ref={productionDatePickerRef}>
                <button
                  onClick={() => { setShowProductionDatePicker(!showProductionDatePicker); setShowProductionCrewPicker(false); setShowCustomRangeEditor(false); }}
                  className={`h-10 flex items-center gap-1.5 pl-3 pr-2 text-sm font-medium rounded-lg transition-colors border ${
                    showProductionDatePicker ? "bg-gray-100 text-gray-700 border-gray-300" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Clock size={14} />
                  <span>{dateButtonLabel}</span>
                  <ChevronDown size={14} className="text-gray-400 ml-1" />
                </button>
                {showProductionDatePicker && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5">
                    {!showCustomRangeEditor ? (
                      <>
                        {[
                          { id: "this_week", label: "This Week" },
                          { id: "last_week", label: "Last Week" },
                          { id: "this_month", label: "This Month" },
                          { id: "all_time", label: "All Time" },
                        ].map((opt) => {
                          const bounds = getDateRangeBounds(opt.id);
                          const rangeStr = opt.id === "all_time" ? "" : ` (${bounds.label})`;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => { setProductionDateRange(opt.id); setShowProductionDatePicker(false); }}
                              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                                productionDateRange === opt.id ? "text-gray-900 font-medium" : "text-gray-600"
                              }`}
                            >
                              {productionDateRange === opt.id ? <Check size={12} className="text-gray-900 flex-shrink-0" /> : <span className="w-3 flex-shrink-0" />}
                              <span>
                                {opt.label}
                                {rangeStr && <span className="text-gray-400 font-normal">{rangeStr}</span>}
                              </span>
                            </button>
                          );
                        })}
                        <div className="border-t border-gray-100 my-1.5" />
                        <button
                          onClick={() => {
                            setShowCustomRangeEditor(true);
                            // Pre-fill from current selection if available
                            if (activeRangeBounds.start && activeRangeBounds.end) {
                              setProductionCustomStart(activeRangeBounds.start.toISOString().split("T")[0]);
                              setProductionCustomEnd(activeRangeBounds.end.toISOString().split("T")[0]);
                            }
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          <span className="w-3 flex-shrink-0" />
                          <span>Custom Range...</span>
                        </button>
                      </>
                    ) : (
                      <div className="px-3 py-2">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Custom Range</div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="text-[11px] text-gray-500 block mb-1">Start</label>
                            <input
                              type="date"
                              value={productionCustomStart}
                              onChange={(e) => setProductionCustomStart(e.target.value)}
                              className="w-full h-9 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-gray-500 block mb-1">End</label>
                            <input
                              type="date"
                              value={productionCustomEnd}
                              onChange={(e) => setProductionCustomEnd(e.target.value)}
                              className="w-full h-9 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setShowCustomRangeEditor(false)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                          >Back</button>
                          <button
                            onClick={() => {
                              if (productionCustomStart && productionCustomEnd) {
                                setProductionDateRange("custom");
                                setShowCustomRangeEditor(false);
                                setShowProductionDatePicker(false);
                              }
                            }}
                            disabled={!productionCustomStart || !productionCustomEnd}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                              productionCustomStart && productionCustomEnd
                                ? "bg-gray-900 text-white hover:bg-black"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >Apply</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Crew dropdown — custom */}
              <div className="relative flex-shrink-0" ref={productionCrewPickerRef}>
                <button
                  onClick={() => { setShowProductionCrewPicker(!showProductionCrewPicker); setShowProductionDatePicker(false); }}
                  className={`h-10 flex items-center gap-1.5 pl-3 pr-2 text-sm font-medium rounded-lg transition-colors border ${
                    showProductionCrewPicker ? "bg-gray-100 text-gray-700 border-gray-300" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Users size={14} />
                  <span>{productionCrewFilter === "all" ? "All Crews" : productionCrewFilter}</span>
                  <ChevronDown size={14} className="text-gray-400 ml-1" />
                </button>
                {showProductionCrewPicker && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5">
                    <button
                      onClick={() => { setProductionCrewFilter("all"); setShowProductionCrewPicker(false); }}
                      className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                        productionCrewFilter === "all" ? "text-gray-900 font-medium" : "text-gray-600"
                      }`}
                    >
                      {productionCrewFilter === "all" ? <Check size={12} className="text-gray-900" /> : <span className="w-3" />}
                      All Crews
                    </button>
                    {uniqueCrewsInLog.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setProductionCrewFilter(c); setShowProductionCrewPicker(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                          productionCrewFilter === c ? "text-gray-900 font-medium" : "text-gray-600"
                        }`}
                      >
                        {productionCrewFilter === c ? <Check size={12} className="text-gray-900" /> : <span className="w-3" />}
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Group By picker — view control (with filter-pill clear when active) */}
              <div className="relative" ref={productionGroupByPickerRef}>
                <button
                  onClick={() => { setShowProductionGroupByPicker(!showProductionGroupByPicker); setShowProductionColPicker(false); }}
                  className={`h-10 flex items-center gap-1.5 px-3 text-sm font-medium rounded-lg transition-colors border ${
                    showProductionGroupByPicker
                      ? "bg-gray-100 text-gray-700 border-gray-300"
                      : productionGroupBy !== "none"
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Layers size={14} />
                  {productionGroupBy !== "none" ? `Grouped: ${productionGroupLabel[productionGroupBy]}` : "Group By"}
                  {productionGroupBy !== "none" && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductionGroupBy("none");
                        setCollapsedProductionGroups(new Set());
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          setProductionGroupBy("none");
                          setCollapsedProductionGroups(new Set());
                        }
                      }}
                      title="Clear grouping"
                      className="ml-1 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-white/50 cursor-pointer transition-colors"
                      style={{ width: 16, height: 16 }}
                    >
                      <X size={12} />
                    </span>
                  )}
                </button>
                {showProductionGroupByPicker && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5">
                    {[
                      { id: "none", label: "None (Flat List)" },
                      { id: "workOrder", label: "Work Order" },
                      { id: "crew", label: "Crew" },
                      { id: "logDate", label: "Log Date" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setProductionGroupBy(opt.id as any);
                          setCollapsedProductionGroups(new Set());
                          setShowProductionGroupByPicker(false);
                        }}
                        className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                          productionGroupBy === opt.id ? "text-gray-900 font-medium" : "text-gray-600"
                        }`}
                      >
                        {productionGroupBy === opt.id ? <Check size={12} className="text-gray-900" /> : <span className="w-3" />}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Column picker — view control */}
              <div className="relative" ref={productionColPickerRef}>
                <button
                  onClick={() => setShowProductionColPicker(!showProductionColPicker)}
                  className={`h-10 flex items-center gap-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                    showProductionColPicker ? "bg-gray-100 text-gray-700 border border-gray-300" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Columns3 size={14} /> Columns
                </button>
                {showProductionColPicker && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                    <div className="px-3 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wide">Columns</div>
                    {PRODUCTION_COLUMNS.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => toggleProductionCol(col.id)}
                        className="flex items-center gap-2.5 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          visibleProductionCols.includes(col.id) ? "bg-gray-800 border-gray-800" : "border-gray-300 bg-white"
                        } ${col.locked ? "opacity-60" : ""}`}>
                          {visibleProductionCols.includes(col.id) && <Check size={10} className="text-white" />}
                        </div>
                        <span className={`flex-1 ${visibleProductionCols.includes(col.id) ? "text-gray-900 font-medium" : "text-gray-500"}`}>{col.label}</span>
                        {col.locked && <span className="text-[10px] text-gray-300">Locked</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Export — black primary */}
              <button
                onClick={() => alert(`Exporting ${filteredProductionLog.length} production log entries...`)}
                className="h-10 flex items-center gap-2 bg-gray-900 hover:bg-black text-white shadow-sm font-medium px-4 rounded-lg transition-colors"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          {/* Production Ledger Table — full audit metadata per row */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {visibleProductionCols.includes("logId") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 90 }}>Log ID</th>}
                  {visibleProductionCols.includes("logDate") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 110 }}>Log Date</th>}
                  {visibleProductionCols.includes("workOrder") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 110 }}>Work Order</th>}
                  {visibleProductionCols.includes("crew") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 150 }}>Crew</th>}
                  {visibleProductionCols.includes("cuCode") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 90 }}>CU Code</th>}
                  {visibleProductionCols.includes("description") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Description</th>}
                  {visibleProductionCols.includes("function") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 90 }}>Function</th>}
                  {visibleProductionCols.includes("unit") && <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 60 }}>Unit</th>}
                  {visibleProductionCols.includes("qty") && <th className="text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 70 }}>Qty</th>}
                  {visibleProductionCols.includes("unitPrice") && <th className="text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 100 }}>Unit Price</th>}
                  {visibleProductionCols.includes("earned") && <th className="text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50" style={{ width: 110 }}>Earned $</th>}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Render a single production log row — hides the column that matches the active grouping
                  const renderProductionRow = (p: any) => {
                    const earned = p.qty * p.unitPrice;
                    const fnStyle = p.fn === "Install" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : p.fn === "Remove" ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-violet-50 text-violet-700 border-violet-200";
                    const hideCol = (colId: string) =>
                      (productionGroupBy === "workOrder" && colId === "workOrder") ||
                      (productionGroupBy === "crew" && colId === "crew") ||
                      (productionGroupBy === "logDate" && colId === "logDate");
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {visibleProductionCols.includes("logId") && (
                          <td className="px-3 py-3">
                            <button
                              onClick={() => {
                                if (typeof navigator !== "undefined" && navigator.clipboard) {
                                  navigator.clipboard.writeText(p.logId);
                                }
                              }}
                              title={`Click to copy ${p.logId}`}
                              className="font-mono text-xs text-gray-500 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                            >
                              {p.logId}
                            </button>
                          </td>
                        )}
                        {visibleProductionCols.includes("logDate") && (
                          hideCol("logDate")
                            ? <td className="px-3 py-3" />
                            : <td className="px-3 py-3 text-sm text-gray-700 tabular-nums whitespace-nowrap">{p.logDate}</td>
                        )}
                        {visibleProductionCols.includes("workOrder") && (
                          hideCol("workOrder")
                            ? <td className="px-3 py-3" />
                            : <td className="px-3 py-3"><span className="text-xs font-semibold text-blue-600 font-mono">{p.workOrder}</span></td>
                        )}
                        {visibleProductionCols.includes("crew") && (
                          hideCol("crew")
                            ? <td className="px-3 py-3" />
                            : <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{p.crew}</td>
                        )}
                        {visibleProductionCols.includes("cuCode") && (
                          <td className="px-3 py-3">
                            <span className="text-xs font-semibold text-gray-900 font-mono">{p.cuCode}</span>
                          </td>
                        )}
                        {visibleProductionCols.includes("description") && (
                          <td className="px-3 py-3 text-sm text-gray-600">{p.desc}</td>
                        )}
                        {visibleProductionCols.includes("function") && (
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${fnStyle}`}>{p.fn}</span>
                          </td>
                        )}
                        {visibleProductionCols.includes("unit") && (
                          <td className="px-3 py-3 text-xs text-gray-500">{p.unit}</td>
                        )}
                        {visibleProductionCols.includes("qty") && (
                          <td className="px-3 py-3 text-right tabular-nums text-sm font-semibold text-gray-900">{p.qty.toLocaleString()}</td>
                        )}
                        {visibleProductionCols.includes("unitPrice") && (
                          <td className="px-3 py-3 text-right tabular-nums text-sm text-gray-600">
                            ${p.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {visibleProductionCols.includes("earned") && (
                          <td className="px-3 py-3 text-right tabular-nums text-sm font-semibold text-gray-900">
                            ${earned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        )}
                      </tr>
                    );
                  };

                  if (filteredProductionLog.length === 0) {
                    return (
                      <tr>
                        <td colSpan={visibleProductionCols.length} className="px-3 py-10 text-center">
                          <div className="text-sm text-gray-400">No production log entries match the current filters</div>
                        </td>
                      </tr>
                    );
                  }

                  if (productionGroupBy === "none" || !productionGroups) {
                    return filteredProductionLog.map(renderProductionRow);
                  }

                  // Grouped rendering — parent accordion rows + nested child rows
                  return productionGroups.map((group) => {
                    const isCollapsed = collapsedProductionGroups.has(group.name);
                    const groupTitle = `${productionGroupLabel[productionGroupBy]}: ${group.name}`;
                    return (
                      <React.Fragment key={group.name}>
                        <tr
                          onClick={() => toggleProductionGroup(group.name)}
                          className="bg-gray-50 border-y border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <td colSpan={visibleProductionCols.length} className="px-3 py-2.5">
                            <div className="flex items-center gap-3">
                              <ChevronDown size={16} className="text-gray-500 flex-shrink-0" style={{ transition: "transform 0.15s", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
                              <span className="text-sm font-semibold text-gray-800">{groupTitle}</span>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                                {group.items.length} item{group.items.length !== 1 ? "s" : ""}
                              </span>
                              <span className="flex-1" />
                              <span className="text-xs text-gray-500">Subtotal</span>
                              <span className="text-sm font-bold text-green-700 tabular-nums">
                                ${group.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {!isCollapsed && group.items.map(renderProductionRow)}
                      </React.Fragment>
                    );
                  });
                })()}
              </tbody>
              {filteredProductionLog.length > 0 && (
                <tfoot>
                  <tr className="border-t border-gray-200 bg-gray-50/50">
                    <td colSpan={Math.max(0, visibleProductionCols.length - 2) - (visibleProductionCols.includes("unitPrice") ? 1 : 0)} className="px-3 py-2.5 text-xs font-medium text-gray-500">
                      {filteredProductionLog.length} entr{filteredProductionLog.length !== 1 ? "ies" : "y"}
                    </td>
                    {visibleProductionCols.includes("qty") && (
                      <td className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 tabular-nums">{productionTotalUnits.toLocaleString()}</td>
                    )}
                    {visibleProductionCols.includes("unitPrice") && <td className="px-3 py-2.5"></td>}
                    {visibleProductionCols.includes("earned") && (
                      <td className="px-3 py-2.5 text-right text-sm font-semibold text-green-700 tabular-nums">
                        ${productionTotalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    )}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Stubbed tabs */}
      {activeTab !== "overview" && activeTab !== "production" && activeTab !== "crew" && (
        <div className="px-6 py-16 text-center">
          <div className="text-gray-300 mb-2">
            <Settings size={32} className="mx-auto" />
          </div>
          <div className="text-sm font-medium text-gray-400">
            {tabs.find((t) => t.id === activeTab)?.label}
          </div>
          <div className="text-xs text-gray-300 mt-1">Coming soon</div>
        </div>
      )}

      {/* ─── Add Work Order Slide-over ─── */}
      {showAddWO && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={() => setShowAddWO(false)}
          />
          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Add Work Order</h2>
                <p className="text-xs text-gray-500 mt-0.5">{job.name}</p>
              </div>
              <button
                onClick={() => setShowAddWO(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {/* WO Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  WO Number <span className="text-red-400">*</span>
                </label>
                <input
                  value={woForm.woNumber}
                  onChange={(e) => setWoForm({ ...woForm, woNumber: e.target.value })}
                  placeholder="e.g., WO-27451"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  autoFocus
                />
              </div>

              {/* Station / Location */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Station / Location</label>
                <input
                  value={woForm.station}
                  onChange={(e) => setWoForm({ ...woForm, station: e.target.value })}
                  placeholder="e.g., Z3A-021 thru Z3A-028"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              {/* Region + Priority (2-col) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Region</label>
                  <input
                    value={woForm.region}
                    onChange={(e) => setWoForm({ ...woForm, region: e.target.value })}
                    placeholder="e.g., North"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Priority</label>
                  <select
                    value={woForm.priority}
                    onChange={(e) => setWoForm({ ...woForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400 transition-colors bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Rush">Rush</option>
                  </select>
                </div>
              </div>

              {/* Service Center */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Service Center</label>
                <input
                  value={woForm.serviceCenter}
                  onChange={(e) => setWoForm({ ...woForm, serviceCenter: e.target.value })}
                  placeholder="e.g., Madison SC"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              {/* RIS Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">RIS Date</label>
                <input
                  type="date"
                  value={woForm.risDate}
                  onChange={(e) => setWoForm({ ...woForm, risDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Assignment</label>
              </div>

              {/* Crew */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Assign Crew</label>
                <select
                  value={woForm.crew}
                  onChange={(e) => setWoForm({ ...woForm, crew: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400 transition-colors bg-white"
                >
                  <option value="">Unassigned</option>
                  {SAMPLE_CREWS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">You can assign a crew later from the WO detail page</p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea
                  value={woForm.notes}
                  onChange={(e) => setWoForm({ ...woForm, notes: e.target.value })}
                  placeholder="Optional notes about this work order..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                />
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Attachments</label>
                <div
                  style={{
                    border: "2px dashed #D1D5DB", borderRadius: 10, padding: "28px 16px",
                    textAlign: "center", cursor: "pointer", transition: "all 0.15s",
                    background: "#FAFAFA",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget).style.borderColor = "#9CA3AF"; (e.currentTarget).style.background = "#F3F4F6"; }}
                  onMouseLeave={(e) => { (e.currentTarget).style.borderColor = "#D1D5DB"; (e.currentTarget).style.background = "#FAFAFA"; }}
                  onDragOver={(e) => { e.preventDefault(); (e.currentTarget).style.borderColor = "#2563EB"; (e.currentTarget).style.background = "#EFF6FF"; }}
                  onDragLeave={(e) => { (e.currentTarget).style.borderColor = "#D1D5DB"; (e.currentTarget).style.background = "#FAFAFA"; }}
                  onDrop={(e) => { e.preventDefault(); (e.currentTarget).style.borderColor = "#D1D5DB"; (e.currentTarget).style.background = "#FAFAFA"; }}
                >
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <div className="text-sm font-medium text-gray-600">Upload Work Order Package</div>
                  <div className="text-xs text-gray-400 mt-1">PDF or Image — drag & drop or tap to browse</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
              <button
                onClick={() => saveWO(true)}
                disabled={!woForm.woNumber.trim()}
                className={`text-sm font-medium transition-colors ${
                  woForm.woNumber.trim() ? "text-gray-600 hover:text-gray-900" : "text-gray-300 cursor-not-allowed"
                }`}
              >
                Save & Add Another
              </button>
              <button
                onClick={() => saveWO(false)}
                disabled={!woForm.woNumber.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  woForm.woNumber.trim()
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Save Work Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  WO DETAIL PAGE
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  Red Line Action Form Component
// ═══════════════════════════════════════════════════════════════

function RedLineActionForm({ redLineCU, onConfirm, onCancel, cuLibrary }: any) {
  const isExistingRedLine = redLineCU.redLineStatus === "approved" || redLineCU.redLineStatus === "pending";
  const origQty = redLineCU.originalPlannedQty ?? redLineCU.plannedQty;
  const [action, setAction] = useState<"adjust" | "eliminate">(
    isExistingRedLine && redLineCU.plannedQty === 0 ? "eliminate" : "adjust"
  );
  const [newQty, setNewQty] = useState(isExistingRedLine ? redLineCU.plannedQty : origQty);
  const [reason, setReason] = useState(isExistingRedLine ? (redLineCU.redLineNote || "") : "");

  const cu = cuLibrary.find((c: any) => c.code === redLineCU.cuCode);
  const price = cu?.unitPrice || 0;
  const originalValue = price * origQty;
  const newValue = action === "eliminate" ? 0 : price * newQty;
  const valueDelta = newValue - originalValue;

  const isValid = reason.trim().length > 0;

  const handleConfirm = () => {
    onConfirm({
      rowId: redLineCU.id,
      newQty: action === "eliminate" ? 0 : newQty,
      note: reason.trim(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Action Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 block">Action</label>
        <div className="flex gap-2">
          {[
            { id: "adjust", label: "Adjust Quantity", icon: "pencil" },
            { id: "eliminate", label: "Eliminate Unit", icon: "trash" },
          ].map((opt: any) => (
            <button
              key={opt.id}
              onClick={() => setAction(opt.id as any)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                action === opt.id
                  ? opt.id === "eliminate"
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adjust Quantity Section */}
      {action === "adjust" && (
        <div className="space-y-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <label className="text-xs font-medium text-gray-700 block">New Quantity</label>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600">
              <span className="line-through">{redLineCU.originalQty ?? redLineCU.targetQty}</span>
              <span className="mx-2">→</span>
              <span className="font-medium text-amber-700">{newQty}</span>
            </div>
          </div>
          <input
            type="number"
            value={newQty}
            onChange={(e) => setNewQty(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-2 py-1.5 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 no-spin"
          />
          <div className="text-xs text-amber-700 font-medium pt-1">
            Value: <span className="line-through text-gray-600">${originalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="mx-1">→</span>
            <span className={valueDelta < 0 ? "text-red-600" : "text-amber-700"}>${newValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className={`ml-1 ${valueDelta < 0 ? "text-red-600" : "text-amber-700"}`}>
              ({valueDelta < 0 ? "-" : "+"} ${Math.abs(valueDelta).toLocaleString("en-US", { minimumFractionDigits: 2 })})
            </span>
          </div>
        </div>
      )}

      {/* Eliminate Section */}
      {action === "eliminate" && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-xs text-red-800 font-medium mb-2">This will set qty to 0 and mark as eliminated</div>
          <div className="text-xs text-red-700">
            Value removed: <span className="font-medium">${originalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}

      {/* Reason Note */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 block">Reason <span className="text-red-500">*</span></label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Document why this change is needed..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 resize-none"
          rows={3}
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isValid}
          className={`flex-1 px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors ${
            action === "eliminate"
              ? isValid ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"
              : isValid ? "bg-amber-600 hover:bg-amber-700" : "bg-amber-300 cursor-not-allowed"
          }`}
        >
          {action === "eliminate" ? "Eliminate Unit" : "Apply Red Line"}
        </button>
      </div>
    </div>
  );
}

function WODetail({ wo, job, onBack }: { wo: any; job: any; onBack: () => void }) {
  const [woTab, setWoTab] = useState("units");
  const [cuRows, setCuRows] = useState(() => {
    const planned = (WO_CU_WORKSHEETS[wo.id] || []).map((r: any, i: number) => {
      // Seed one log event per row for any pre-existing completed qty (represents prior logging)
      // ~25% of the qty is flagged as "this week" for mock demo; the rest is backdated
      const thisWeekPortion = r.completedQty > 0 ? Math.max(0, Math.min(r.completedQty, Math.round(r.completedQty * 0.25) || (i % 3 === 0 ? 1 : 0))) : 0;
      const priorPortion = r.completedQty - thisWeekPortion;
      const seedNote = i === 2 ? "Hit solid rock at 4 ft during excavation. Switched to jackhammer." : "";
      const seedRedline = i === 5 ? "Utility request — transformer upsize required" : "";
      const events: any[] = [];
      const now = new Date();
      if (priorPortion > 0) {
        // Older event (2 weeks ago)
        const older = new Date(now); older.setDate(older.getDate() - 14);
        events.push({
          id: `evt-${i}-prior`,
          timestamp: older.toISOString(),
          loggedBy: "Carlos Rivera (Foreman)",
          qty: priorPortion,
          note: seedNote || "",
        });
      }
      if (thisWeekPortion > 0) {
        // Recent event (2 days ago)
        const recent = new Date(now); recent.setDate(recent.getDate() - 2);
        events.push({
          id: `evt-${i}-week`,
          timestamp: recent.toISOString(),
          loggedBy: "Carlos Rivera (Foreman)",
          qty: thisWeekPortion,
          note: priorPortion === 0 ? (seedNote || "") : "",
        });
      }
      return {
        cuCode: r.cuCode,
        function: r.function,
        originalPlannedQty: r.originalPlannedQty,
        plannedQty: r.plannedQty,
        id: `plan-${i}`,
        source: "planned" as const,
        redLineNote: seedRedline || (r.originalPlannedQty !== r.plannedQty ? "Field adjustment from paper WO" : ""),
        redLineStatus: r.originalPlannedQty !== r.plannedQty ? "approved" : null,
        group: r.group || null,
        events,
      };
    });
    return planned;
  });
  // Tracks which parent rows have their execution history expanded; empty set = all collapsed by default
  const [expandedCuRows, setExpandedCuRows] = useState<Set<string>>(new Set());
  const toggleCuRowCollapse = (rowId: string) => {
    setExpandedCuRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };
  // Derived — sum event qty
  const getRowTotalQty = (row: any): number =>
    (row.events || []).reduce((s: number, e: any) => s + (e.qty || 0), 0);
  const getRowWeekQty = (row: any): number => {
    const now = new Date();
    const day = now.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMon);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return (row.events || [])
      .filter((e: any) => {
        const d = new Date(e.timestamp);
        return d >= weekStart && d < weekEnd;
      })
      .reduce((s: number, e: any) => s + (e.qty || 0), 0);
  };
  // Event mutators — append-only pattern
  const appendEvent = (rowId: string, qty: number, note: string = "") => {
    const evt = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      loggedBy: `${MOCK_AUTH_USER.fullName} (${MOCK_AUTH_USER.role})`,
      qty,
      note,
    };
    setCuRows((prev: any) => prev.map((r: any) => r.id === rowId ? { ...r, events: [...(r.events || []), evt] } : r));
    return evt;
  };
  const deleteEvent = (rowId: string, eventId: string) => {
    setCuRows((prev: any) => prev.map((r: any) =>
      r.id === rowId ? { ...r, events: (r.events || []).filter((e: any) => e.id !== eventId) } : r
    ));
  };
  const updateEventNote = (rowId: string, eventId: string, note: string) => {
    setCuRows((prev: any) => prev.map((r: any) =>
      r.id === rowId ? { ...r, events: (r.events || []).map((e: any) => e.id === eventId ? { ...e, note } : e) } : r
    ));
  };
  const [showAddCU, setShowAddCU] = useState(false);
  const [cuSearch, setCuSearch] = useState("");
  const [stagedCUs, setStagedCUs] = useState<any[]>([]);
  const [cuFilter, setCuFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCuColPicker, setShowCuColPicker] = useState(false);
  const cuColPickerRef = useRef<HTMLDivElement>(null);
  const CU_TABLE_COLUMNS = [
    { id: "cu", label: "CU", locked: true },
    { id: "function", label: "Function", locked: false },
    { id: "totalQty", label: "Total Qty", locked: true },
    { id: "weekQty", label: "Qty This Week", locked: false },
    { id: "redlinesNotes", label: "Redlines & Notes", locked: false },
    { id: "actions", label: "Actions", locked: true },
  ];
  const [visibleCuCols, setVisibleCuCols] = useState<string[]>(CU_TABLE_COLUMNS.map((c) => c.id));
  const toggleCuCol = (colId: string) => {
    const col = CU_TABLE_COLUMNS.find((c) => c.id === colId);
    if (col?.locked) return;
    setVisibleCuCols((prev) => prev.includes(colId) ? prev.filter((c) => c !== colId) : [...prev, colId]);
  };
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cuColPickerRef.current && !cuColPickerRef.current.contains(e.target as Node)) setShowCuColPicker(false);
    };
    if (showCuColPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCuColPicker]);
  const [redLineCU, setRedLineCU] = useState<any>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  // Mock flag — true when WO is configured with CU grouping (e.g., by Pole #)
  const isGroupedWO = cuRows.some((r: any) => r.group);
  // Derive the group type label from the first word of existing group names (e.g., "Pole Z2F-035" → "Pole")
  const groupTypeLabel = (() => {
    const firstGroup = cuRows.find((r: any) => r.group)?.group || "";
    const firstWord = firstGroup.split(" ")[0];
    return firstWord || "Group";
  })();

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };
  const [notes, setNotes] = useState<{ id: string; author: string; text: string; time: string }[]>([
    ...(wo.id === "WO-27443" ? [
      { id: "n1", author: "Carlos Rivera", text: "Poles 035-037 complete. 038 delayed — access issue with property owner. Will reattempt tomorrow.", time: "2 hrs ago" },
      { id: "n2", author: "System", text: "Crew A – Rivera assigned to this work order", time: "3 days ago" },
      { id: "n3", author: "System", text: "Work order created and added to backlog", time: "1 wk ago" },
    ] : wo.id === "WO-88201" ? [
      { id: "n1", author: "Nathan Brooks", text: "All 4.2 miles of conductor pulled and sagged. Final connections tomorrow.", time: "6 hrs ago" },
      { id: "n2", author: "Nathan Brooks", text: "Mile marker 2.8 had 3 rot poles not on the original staking sheet — added RP50-2 removals and P55-2 replacements.", time: "2 days ago" },
      { id: "n3", author: "System", text: "Crew F – Brooks assigned to this work order", time: "2 wks ago" },
      { id: "n4", author: "System", text: "Work order created and added to backlog", time: "3 wks ago" },
    ] : wo.id === "WO-13047" ? [
      { id: "n1", author: "Derek Johnson", text: "Poles 9-12 done. Starting on 13-16 tomorrow. Found a cracked crossarm on Pole 11, replaced with spare.", time: "5 hrs ago" },
      { id: "n2", author: "System", text: "Crew E – Johnson assigned to this work order", time: "1 wk ago" },
    ] : []),
  ]);
  const [newNote, setNewNote] = useState("");
  const [logWorkRow, setLogWorkRow] = useState<any>(null);
  const [logWorkQty, setLogWorkQty] = useState("");
  const [logWorkDate, setLogWorkDate] = useState("");
  const [logWorkMode, setLogWorkMode] = useState<"add" | "edit">("add");
  const [redlineModalRow, setRedlineModalRow] = useState<any>(null);
  const [redlinePaperQty, setRedlinePaperQty] = useState("");
  const [redlineReason, setRedlineReason] = useState("");
  const [redlineDeviationType, setRedlineDeviationType] = useState<"net_new" | "qty_change">("qty_change");
  const [noteModalRow, setNoteModalRow] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [noteEventTarget, setNoteEventTarget] = useState<{ rowId: string; eventId: string } | null>(null);
  const [deleteEventConfirm, setDeleteEventConfirm] = useState<{ rowId: string; eventId: string; qty: number; cuCode: string } | null>(null);
  const openEventNoteModal = (rowId: string, eventId: string) => {
    const row = cuRows.find((r: any) => r.id === rowId);
    const evt = row?.events?.find((e: any) => e.id === eventId);
    setNoteEventTarget({ rowId, eventId });
    setNoteText(evt?.note || "");
  };
  const handleEventNoteSave = () => {
    if (!noteEventTarget) return;
    updateEventNote(noteEventTarget.rowId, noteEventTarget.eventId, noteText.trim());
    setNoteEventTarget(null);
    setNoteText("");
  };
  const [addCUIntent, setAddCUIntent] = useState<"planned" | "completed">("planned");
  const [addCUGroup, setAddCUGroup] = useState("");
  const [addCUPlannedQty, setAddCUPlannedQty] = useState("1");
  const [addCUCompletedQty, setAddCUCompletedQty] = useState("");
  const [addCUDate, setAddCUDate] = useState("");
  const [addCUReason, setAddCUReason] = useState("");
  const [addCUError, setAddCUError] = useState("");
  const [ellipsisMenuRow, setEllipsisMenuRow] = useState<string | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<any>(null);
  const [typoFixModal, setTypoFixModal] = useState<any>(null);
  const [typoFixQty, setTypoFixQty] = useState("");
  const [signOffModal, setSignOffModal] = useState(false);
  const [signOffInitials, setSignOffInitials] = useState("");
  const [woStatus, setWoStatus] = useState<"in_progress" | "submitted">("in_progress");
  const [submittedBy, setSubmittedBy] = useState<{ initials: string; fullName: string; timestamp: string } | null>(null);
  // Mock authenticated user — in production, pulled from auth context
  const MOCK_AUTH_USER = { fullName: "Carlos Rivera", role: "Foreman" };
  // Mock activity log entries — in production, derived from audit trail
  const [activityLog, setActivityLog] = useState([
    { id: "a1", time: "Today, 9:00 AM", type: "create", title: "WO Created", user: "Sarah Chen (Office)", detail: "Work order created and dispatched to field crew" },
    { id: "a2", time: "Today, 10:15 AM", type: "unit_add", title: "Unit Added", user: "Carlos Rivera (Field)", detail: "P45-3 (Qty: 4)" },
    { id: "a3", time: "Today, 11:30 AM", type: "redline", title: "Redline Logged", user: "Carlos Rivera (Field)", detail: "T-50K (+1 unit). Reason: Utility request — transformer upsize required" },
    { id: "a4", time: "Today, 1:00 PM", type: "note", title: "Note Added", user: "Carlos Rivera (Field)", detail: "S-6091 — Hit solid rock at 4 ft during excavation. Switched to jackhammer." },
    { id: "a5", time: "Today, 2:45 PM", type: "unit_add", title: "Unit Added", user: "Carlos Rivera (Field)", detail: "XA-10 (Qty: 2)" },
  ]);
  const [passiveRedlinePrompt, setPassiveRedlinePrompt] = useState<{ pendingRows: any[]; reason: string } | null>(null);
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [changeOrders, setChangeOrders] = useState<any[]>(INITIAL_CHANGE_ORDERS[wo.id] || []);
  const [vendorCosts, setVendorCosts] = useState<any[]>(INITIAL_VENDOR_COSTS[wo.id] || []);
  const [expandedCO, setExpandedCO] = useState<string | null>(null);
  const [showAddVendorCost, setShowAddVendorCost] = useState(false);
  const [vcForm, setVcForm] = useState({ vendor: "", description: "", category: "materials", amount: "", markup: "", billable: true, invoiceNumber: "", status: "pending" });

  const wsKey = wo.status.toLowerCase();
  const ws = WO_STATUS_CONFIG[wsKey] || WO_STATUS_CONFIG["not started"];
  const crewMembers = WO_CREW_MEMBERS[wo.crew] || [];

  // CU library for modal — filter instantly on any input, empty when no search
  // Show full library alphabetically by default; filter when searching
  const cuSearchResults = cuSearch.length > 0
    ? CU_LIBRARY.filter((cu) => {
        const q = cuSearch.toLowerCase();
        return cu.code.toLowerCase().includes(q) || cu.desc.toLowerCase().includes(q);
      })
    : [...CU_LIBRARY].sort((a, b) => a.code.localeCompare(b.code));

  // Check if a given ISO date string falls within the current calendar week (Mon-Sun)
  const isInCurrentWeek = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    const day = now.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMon);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return d >= weekStart && d < weekEnd;
  };

  // Log Work save — append-only: creates a new timestamped event on the parent row
  const handleLogWorkSave = () => {
    if (!logWorkRow) return;
    const qtyValue = parseInt(logWorkQty) || 0;
    if (qtyValue <= 0) {
      setLogWorkRow(null); setLogWorkQty(""); setLogWorkDate("");
      return;
    }

    appendEvent(logWorkRow.id, qtyValue);

    // Append to activity log
    const now = new Date();
    const timeStr = "Today, " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setActivityLog((prev: any) => [...prev, {
      id: `act-${Date.now()}`,
      time: timeStr,
      type: "unit_add",
      title: "Work Logged",
      user: `${MOCK_AUTH_USER.fullName} (${MOCK_AUTH_USER.role})`,
      detail: `${logWorkRow.cuCode} (+${qtyValue} unit${qtyValue !== 1 ? "s" : ""})`,
    }]);

    setLogWorkRow(null);
    setLogWorkQty("");
    setLogWorkDate("");
  };

  // Redline Adjust Scope (from ⋮ menu)
  const handleRedlineAdjust = (rowId: string, newPlannedQty: number, reason: string) => {
    setCuRows((prev: any) => prev.map((r: any) =>
      r.id === rowId ? {
        ...r,
        plannedQty: newPlannedQty,
        redLineNote: reason,
        redLineStatus: "pending",
      } : r
    ));
    setRedLineCU(null);
  };

  // Delete CU row
  const deleteCURow = (rowId: string) => {
    setCuRows((prev: any) => prev.filter((r: any) => r.id !== rowId));
  };

  // Open + Add Qty modal (incremental — qty starts at 0, appends to existing total on save)
  const openLogWork = (row: any) => {
    setLogWorkRow(row);
    setLogWorkQty("0");
    setLogWorkDate(new Date().toISOString().split("T")[0]);
    setLogWorkMode("add");
  };

  // Open Edit Total Qty modal (absolute — pre-filled with current total; used to correct typos)
  // Legacy helper — kept for reference but no longer wired to any UI
  const openEditCompletion = (row: any) => {
    const currentRow = cuRows.find((r: any) => r.id === row.id) || row;
    setLogWorkRow(row);
    setLogWorkQty(String(getRowTotalQty(currentRow)));
    setLogWorkDate(new Date().toISOString().split("T")[0]);
    setLogWorkMode("edit");
  };

  // Open Redline Modal — captures Paper WO baseline + Reason (Total Qty is NEVER touched here)
  const openRedlineShortcut = (row: any) => {
    setRedlineModalRow(row);
    // Default deviation type: Net New if paperQty is 0 (or new unit), Qty Change otherwise
    const hasExistingPaperQty = (row.plannedQty || 0) > 0;
    setRedlineDeviationType(hasExistingPaperQty ? "qty_change" : "net_new");
    setRedlinePaperQty(String(row.plannedQty || 0));
    setRedlineReason(row.redLineNote || "");
  };

  // Save from Redline Modal — ONLY updates paperQty (plannedQty baseline) and redLineNote.
  // completedQty and weekQty are owned by the +Add Qty flow and are never touched here.
  const handleRedlineModalSave = () => {
    if (!redlineModalRow) return;
    const paperQty = redlineDeviationType === "net_new" ? 0 : (parseInt(redlinePaperQty) || 0);
    const currentRow = cuRows.find((r: any) => r.id === redlineModalRow.id) || redlineModalRow;
    const variance = getRowTotalQty(currentRow) - paperQty;
    if (variance === 0) return; // No variance — nothing to redline
    if (!redlineReason.trim()) return;

    setCuRows((prev: any) => prev.map((r: any) =>
      r.id === redlineModalRow.id ? {
        ...r,
        plannedQty: paperQty,
        originalPlannedQty: paperQty,
        redLineNote: redlineReason.trim(),
        redLineStatus: "approved",
      } : r
    ));

    // Append activity log entry for the redline
    const now = new Date();
    const timeStr = "Today, " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const deltaLabel = variance > 0 ? `+${variance}` : `${variance}`;
    setActivityLog((prev: any) => [...prev, {
      id: `act-${Date.now()}`,
      time: timeStr,
      type: "redline",
      title: "Redline Logged",
      user: `${MOCK_AUTH_USER.fullName} (${MOCK_AUTH_USER.role})`,
      detail: `${redlineModalRow.cuCode} (${deltaLabel} unit${Math.abs(variance) !== 1 ? "s" : ""}). Reason: ${redlineReason.trim()}`,
    }]);

    setRedlineModalRow(null);
    setRedlinePaperQty("");
    setRedlineReason("");
  };

  // Note modal openers
  const openNoteModal = (row: any) => {
    setNoteModalRow(row);
    setNoteText(row.fieldNote || "");
  };
  const handleNoteSave = () => {
    if (!noteModalRow) return;
    setCuRows((prev: any) => prev.map((r: any) =>
      r.id === noteModalRow.id ? { ...r, fieldNote: noteText.trim() } : r
    ));
    setNoteModalRow(null);
    setNoteText("");
  };

  // Fix Planned Qty (Typo) — silently updates both plannedQty and originalPlannedQty, no redline
  const openTypoFix = (row: any) => {
    setTypoFixModal(row);
    setTypoFixQty(String(row.plannedQty));
  };
  const handleTypoFixSave = () => {
    if (!typoFixModal) return;
    const newQty = parseInt(typoFixQty) || 0;
    if (newQty < 0) return;
    setCuRows((prev: any) => prev.map((r: any) =>
      r.id === typoFixModal.id ? { ...r, plannedQty: newQty, originalPlannedQty: newQty } : r
    ));
    setTypoFixModal(null);
    setTypoFixQty("");
  };

  const stageCU = (cu: typeof CU_LIBRARY[0]) => {
    const alreadyStaged = stagedCUs.some((s: any) => s.code === cu.code);
    if (!alreadyStaged) {
      setStagedCUs((prev: any) => [...prev, { ...cu, stagedId: `staged-${Date.now()}`, qty: 1, function: null, completedQty: "1", completedDate: "", group: "" }]);
    }
  };

  const removeStagedCU = (stagedId: string) => {
    setStagedCUs((prev: any) => prev.filter((s: any) => s.stagedId !== stagedId));
  };

  // Build row data from staged units
  // Commit staged CUs as events — reuses existing parent rows when possible (append-only)
  const commitStagedAsEvents = (reasonNote: string = "") => {
    const nowIso = new Date().toISOString();
    setCuRows((prev: any) => {
      const next = [...prev];
      stagedCUs.forEach((staged: any) => {
        const plannedQty = staged.qty || 0;
        const completedQty = parseInt(staged.completedQty) || 0;
        const isRedline = (plannedQty === 0 && completedQty > 0) || (completedQty > plannedQty);
        const effectivePlanned = isRedline ? Math.max(completedQty, plannedQty) : plannedQty;

        // Find existing parent with matching cuCode + function + group
        const existingIdx = next.findIndex((r: any) =>
          r.cuCode === staged.code &&
          r.function === staged.function &&
          (r.group || null) === (staged.group || null)
        );

        const newEvent = completedQty > 0 ? {
          id: `evt-${Date.now()}-${staged.stagedId}`,
          timestamp: nowIso,
          loggedBy: `${MOCK_AUTH_USER.fullName} (${MOCK_AUTH_USER.role})`,
          qty: completedQty,
          note: "",
        } : null;

        if (existingIdx >= 0) {
          // Append event to existing parent
          const existing = next[existingIdx];
          next[existingIdx] = {
            ...existing,
            events: newEvent ? [...(existing.events || []), newEvent] : (existing.events || []),
            // Keep any prior redline intact; new staged redline replaces only if explicitly set
            redLineNote: isRedline ? reasonNote : existing.redLineNote,
            redLineStatus: isRedline ? "approved" : existing.redLineStatus,
            plannedQty: isRedline ? effectivePlanned : existing.plannedQty,
          };
        } else {
          // Create new parent row with the event
          next.push({
            cuCode: staged.code,
            function: staged.function,
            originalPlannedQty: plannedQty,
            plannedQty: effectivePlanned,
            id: `added-${Date.now()}-${staged.stagedId}`,
            source: "planned" as const,
            redLineNote: isRedline ? reasonNote : "",
            redLineStatus: isRedline ? "approved" : null,
            group: staged.group || null,
            events: newEvent ? [newEvent] : [],
          });
        }
      });
      return next;
    });
  };

  // Check if any staged units trigger a passive redline
  const hasPassiveRedline = () => {
    return stagedCUs.some((staged: any) => {
      const plannedQty = staged.qty || 0;
      const completedQty = parseInt(staged.completedQty) || 0;
      return (plannedQty === 0 && completedQty > 0) || (completedQty > plannedQty);
    });
  };

  const addStagedCUsToWO = () => {
    if (hasPassiveRedline()) {
      // Prompt for redline reason before committing
      setPassiveRedlinePrompt({ pendingRows: [], reason: "" });
      return;
    }
    // No redlines — commit directly (append-only: each staged unit → new event on parent)
    commitStagedAsEvents();
    setStagedCUs([]);
    setShowAddCU(false);
  };

  const confirmPassiveRedline = () => {
    if (!passiveRedlinePrompt || !passiveRedlinePrompt.reason.trim()) return;
    commitStagedAsEvents(passiveRedlinePrompt.reason.trim());
    setStagedCUs([]);
    setShowAddCU(false);
    setPassiveRedlinePrompt(null);
  };

  // Get the start of the current week (Monday) for date restriction
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday.toISOString().split("T")[0];
  };
  const minDate = getWeekStart();

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      { id: `n-${Date.now()}`, author: "You", text: newNote.trim(), time: "Just now" },
      ...prev,
    ]);
    setNewNote("");
  };

  // Cost calculations
  const costRows = cuRows.map((row: any) => {
    const cu = CU_LIBRARY.find((c) => c.code === row.cuCode);
    const price = cu?.unitPrice || 0;
    return {
      ...row,
      unitPrice: price,
      plannedValue: price * row.plannedQty,
      completedValue: price * getRowTotalQty(row),
    };
  });
  const totalPlannedValue = costRows.reduce((s: number, r: any) => s + r.plannedValue, 0);
  const totalCompletedValue = costRows.reduce((s: number, r: any) => s + r.completedValue, 0);
  const totalPlannedQty = cuRows.reduce((s: number, r: any) => s + r.plannedQty, 0);
  const totalCompletedQty = cuRows.reduce((s: number, r: any) => s + getRowTotalQty(r), 0);
  const completedLines = cuRows.filter((r: any) => r.plannedQty > 0 && getRowTotalQty(r) >= r.plannedQty).length;
  const remainingLines = cuRows.filter((r: any) => r.plannedQty > 0 && getRowTotalQty(r) < r.plannedQty).length;
  const redLineCount = cuRows.filter((r: any) => r.originalPlannedQty !== r.plannedQty).length;
  const pctComplete = totalPlannedQty > 0 ? Math.round((totalCompletedQty / totalPlannedQty) * 100) : 0;

  // CU filter
  const filteredCUs = cuRows.filter((row: any) => {
    // Search filter — case-insensitive match against cuCode and description
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const cu = CU_LIBRARY.find((c) => c.code === row.cuCode);
      const desc = cu?.desc || "";
      const matches = row.cuCode.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (cuFilter === "complete") return row.plannedQty > 0 && getRowTotalQty(row) >= row.plannedQty;
    if (cuFilter === "remaining") return row.plannedQty === 0 || getRowTotalQty(row) < row.plannedQty;
    if (cuFilter === "redline") return row.originalPlannedQty !== row.plannedQty;
    return true;
  });

  // Format an event timestamp for child row display
  const formatEventTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  // Render a single CU parent row + optional child event rows (7 columns: chevron, CU, Function, Total Qty, Qty This Week, Redlines, Actions)
  const renderCURow = (row: any) => {
    const cu = CU_LIBRARY.find((c) => c.code === row.cuCode);
    const hasGroups = cuRows.some((r: any) => r.group);
    const isLocked = woStatus === "submitted";
    const totalQty = getRowTotalQty(row);
    const weekQty = getRowWeekQty(row);
    const events = (row.events || []).slice().sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const isExpanded = expandedCuRows.has(row.id);
    const hasEvents = events.length > 0;

    // Exception-based redline
    const hasRedline = !!(row.redLineNote && row.redLineNote.length > 0);
    const redlineDelta = hasRedline ? (totalQty - row.plannedQty) : 0;

    // Stop propagation handler for actions cell so clicks don't collapse/expand the row
    const stopPropagate = (e: any) => e.stopPropagation();

    return (
      <React.Fragment key={row.id}>
        {/* ── Parent Row — entire row is clickable to toggle expand/collapse ── */}
        <tr
          onClick={hasEvents ? () => toggleCuRowCollapse(row.id) : undefined}
          className={`cu-row-divider bg-white hover:bg-gray-50 transition-colors ${hasEvents ? "cursor-pointer" : ""}`}
        >
          {/* Chevron */}
          <td className="px-2 py-3" style={{ width: 32 }}>
            {hasEvents ? (
              <div
                className="w-6 h-6 flex items-center justify-center rounded text-gray-400"
                title={isExpanded ? "Collapse log" : "Expand log"}
              >
                <ChevronDown size={16} style={{ transition: "transform 0.15s", transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }} />
              </div>
            ) : (
              <span className="w-6 h-6 inline-block" />
            )}
          </td>
          {/* CU Details */}
          <td className="px-3 py-3" style={hasGroups ? { paddingLeft: 32 } : undefined}>
            <span className="text-xs font-semibold font-mono text-gray-800">{row.cuCode}</span>
            <div className="text-sm text-gray-500">{cu?.desc || row.cuCode}</div>
          </td>
          {/* Function */}
          <td className="px-3 py-3">
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{row.function}</span>
          </td>
          {/* Total Qty — derived from events */}
          <td className="px-3 py-3 text-right tabular-nums">
            <span className={`text-sm font-semibold ${totalQty > 0 ? "text-gray-900" : "text-gray-300"}`}>
              {totalQty.toLocaleString()}
            </span>
          </td>
          {/* Qty This Week — derived from events in current week */}
          <td className="px-3 py-3 text-right tabular-nums">
            {weekQty > 0 ? (
              <span className="text-sm font-medium text-green-700">
                +{weekQty.toLocaleString()}
              </span>
            ) : (
              <span className="text-gray-300 text-sm">—</span>
            )}
          </td>
          {/* Notes & Redlines — redline badge + aggregate note count from children */}
          <td className="px-3 py-3" style={{ whiteSpace: "nowrap" }}>
            {(() => {
              const noteCount = (row.events || []).filter((e: any) => e.note && e.note.trim().length > 0).length;
              if (!hasRedline && noteCount === 0) {
                return <span className="text-gray-300 text-sm">—</span>;
              }
              return (
                <div className="flex items-center gap-2 flex-wrap">
                  {hasRedline && (
                    <span
                      style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 9999, background: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA" }}
                      title={`Paper WO: ${row.plannedQty} → Actual: ${totalQty}. ${row.redLineNote}`}
                    >
                      {redlineDelta > 0 ? `▲ +${redlineDelta}` : redlineDelta < 0 ? `▼ ${redlineDelta}` : "▲"} Redlined
                    </span>
                  )}
                  {noteCount > 0 && (
                    <span className="text-gray-500 text-sm inline-flex items-center gap-1" title={`${noteCount} note${noteCount !== 1 ? "s" : ""} in execution log`}>
                      <MessageSquare size={12} className="text-gray-400" />
                      {noteCount} {noteCount === 1 ? "Note" : "Notes"}
                    </span>
                  )}
                </div>
              );
            })()}
          </td>
          {/* Actions — stopPropagation so buttons don't trigger row expand */}
          <td className="px-3 py-3" onClick={stopPropagate}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
              {isLocked ? (
                <span style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>Locked</span>
              ) : (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); openRedlineShortcut(row); }}
                    title="Redline"
                    style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #FECACA", background: "#fff", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.1s" }}
                    onMouseEnter={(e) => { (e.currentTarget).style.background = "#FEF2F2"; (e.currentTarget).style.borderColor = "#F87171"; }}
                    onMouseLeave={(e) => { (e.currentTarget).style.background = "#fff"; (e.currentTarget).style.borderColor = "#FECACA"; }}
                  >
                    <Pencil size={14} />
                  </button>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEllipsisMenuRow(ellipsisMenuRow === row.id ? null : row.id); }}
                      style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "1px solid #E5E7EB", background: ellipsisMenuRow === row.id ? "#F3F4F6" : "#fff", color: "#9CA3AF", cursor: "pointer", flexShrink: 0, transition: "all 0.1s" }}
                    >
                      <MoreVertical size={14} />
                    </button>
                    {ellipsisMenuRow === row.id && (
                      <div
                        style={{ position: "absolute", right: 0, top: "100%", marginTop: 4, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 60, width: 220, overflow: "visible" }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); setEllipsisMenuRow(null); setDeleteConfirmModal(row); }}
                          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", fontSize: 13, fontWeight: 500, color: "#DC2626", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                          onMouseEnter={(e) => { (e.currentTarget).style.background = "#FEF2F2"; }}
                          onMouseLeave={(e) => { (e.currentTarget).style.background = "none"; }}
                        >
                          <Trash2 size={14} style={{ color: "#DC2626" }} />
                          Remove Unit from WO
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </td>
        </tr>
        {/* ── Child Events — "Cavity": recessed gray container with hard border separators ── */}
        {hasEvents && isExpanded && (
          <tr className="cu-cavity-row bg-gray-50 shadow-inner">
            <td colSpan={7} className="p-0" onClick={stopPropagate}>
              <div className="divide-y divide-gray-200">
                {events.map((evt: any) => (
                  <div
                    key={evt.id}
                    className="flex items-center py-3"
                  >
                    {/* Col 1: chevron spacer — w-12 matches parent */}
                    <div className="w-12 flex-shrink-0 px-2"></div>
                    {/* Cols 2+3: CU + Function combined (flex-1 in child naturally absorbs parent's CU flex + Function w-24) */}
                    <div className="flex-1 min-w-0 px-3">
                      <div className="text-xs text-gray-700 tabular-nums whitespace-nowrap">{formatEventTime(evt.timestamp)}</div>
                      <div className="text-[11px] text-gray-500 truncate">{evt.loggedBy}</div>
                    </div>
                    {/* Col 4: Total Qty spacer — w-24 matches parent */}
                    <div className="w-24 flex-shrink-0 px-3"></div>
                    {/* Col 5: Qty This Week — w-32 holds +Qty, right-aligned */}
                    <div className="w-32 flex-shrink-0 px-3 text-right">
                      <span className="text-sm font-semibold text-green-700 whitespace-nowrap">+{evt.qty.toLocaleString()}</span>
                    </div>
                    {/* Col 6: Notes & Redlines — w-52 holds the inline note */}
                    <div className="w-52 flex-shrink-0 px-3">
                      {evt.note ? (
                        <div className="text-[11px] text-gray-600 italic truncate" title={evt.note}>
                          <MessageSquare size={10} className="inline mr-1 text-gray-400" />
                          <span>{evt.note.length > 22 ? evt.note.slice(0, 22) + "…" : evt.note}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </div>
                    {/* Col 7: Actions — w-40 matches parent */}
                    <div className="w-40 flex-shrink-0 px-3">
                      {!isLocked && (
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEventNoteModal(row.id, evt.id); }}
                            title={evt.note ? "Edit note" : "Add note"}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <MessageSquare size={13} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteEventConfirm({ rowId: row.id, eventId: evt.id, qty: evt.qty, cuCode: row.cuCode });
                            }}
                            title="Delete event"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  // Change order value calculations
  const coTotalValue = changeOrders.reduce((s: number, co: any) => {
    if (co.billingType === "unit-price" && co.cus) return s + co.cus.reduce((cs: number, cu: any) => cs + cu.qty * cu.unitPrice, 0);
    if (co.billingType === "te" && co.teHours) return s + co.teHours.reduce((hs: number, h: any) => hs + h.hours * h.rate, 0);
    return s;
  }, 0);
  const coApproved = changeOrders.filter((co: any) => ["Approved", "In Progress", "Complete"].includes(co.status)).length;
  const coPending = changeOrders.filter((co: any) => ["Draft", "Submitted"].includes(co.status)).length;

  // Vendor cost calculations
  const vcTotalCost = vendorCosts.reduce((s: number, c: any) => s + c.amount, 0);
  const vcTotalBillable = vendorCosts.filter((c: any) => c.billable).reduce((s: number, c: any) => s + c.amount * (1 + (c.markup || 0) / 100), 0);

  // WO-level tabs
  const woTabs = [
    { id: "units", label: "Compatible Units" },
    { id: "change-orders", label: `Change Orders (${changeOrders.length})` },
    { id: "vendors", label: `Vendor Costs (${vendorCosts.length})` },
    { id: "activity", label: `Activity (${activityLog.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ─── Top bar with breadcrumb ─── */}
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="text-gray-400">Bluesky</span>
            <ChevronRight size={10} />
            <button onClick={() => onBack()} className="hover:text-gray-600 transition-colors">Jobs</button>
            <ChevronRight size={10} />
            <button onClick={() => onBack()} className="hover:text-gray-600 transition-colors">{job.name}</button>
            <ChevronRight size={10} />
            <span className="text-gray-700 font-medium">Work Order: {wo.id}</span>
          </div>
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeft size={12} /> Back to Job
          </button>
        </div>
      </div>

      {/* ─── Content area ─── */}
      <div className="max-w-[1120px] mx-auto px-6 py-6">

        {/* ─── WO Header Card (collapsible like reference prototype) ─── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          {/* Top row — always visible */}
          <div className="flex items-center justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => setHeaderExpanded((e) => !e)}>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900 font-mono tracking-tight">{wo.id}</h1>
                {woStatus === "submitted" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Complete
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${ws.bg} ${ws.text} border ${ws.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ws.dot}`} />
                    {ws.label}
                  </span>
                )}
                {wo.priority === "Rush" && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">Rush</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => alert("Exporting as-built PDF...")}
                disabled={woStatus !== "submitted"}
                title={woStatus !== "submitted" ? "Work order must be submitted before exporting as-built" : "Export as-built PDF"}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  woStatus === "submitted"
                    ? "text-gray-600 bg-white border-gray-200 hover:bg-gray-50 cursor-pointer"
                    : "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
              >
                <Download size={12} /> Export As-Built
              </button>
              {woStatus !== "submitted" && (
                <button
                  onClick={() => { setSignOffModal(true); setSignOffInitials(""); }}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-orange-600 bg-white border border-orange-500 hover:bg-orange-50 rounded-lg shadow-sm transition-colors"
                >
                  <Upload size={14} /> Mark Complete
                </button>
              )}
              <button
                onClick={() => setHeaderExpanded((e) => !e)}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {headerExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Expanded details */}
          {headerExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-5 -mb-5 px-5 pb-5 pt-4 rounded-b-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Work Order Details</div>
                <button
                  onClick={(e) => { e.stopPropagation(); alert("Edit WO metadata — coming soon"); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
              </div>
              {/* Summary fields grid */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: "Location", value: wo.station },
                  { label: "Region", value: wo.region },
                  { label: "Crew", value: wo.crew || "Unassigned" },
                  { label: "Service Center", value: wo.serviceCenter },
                  { label: "RIS Date", value: wo.risDate },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">{f.label}</div>
                    <div className="text-sm font-medium text-gray-900">{f.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-4 mt-3">
                {[
                  { label: "Job", value: job.name },
                  { label: "Contract", value: job.contract },
                  { label: "Started", value: wo.status !== "Not Started" ? "2026-03-01" : "—" },
                  { label: "Last Activity", value: wo.lastActivity },
                  { label: "Priority", value: wo.priority },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">{f.label}</div>
                    <div className="text-sm font-medium text-gray-900">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Tab Bar ─── */}
        <div className="border-b border-gray-200 mb-5">
          <div className="flex items-center gap-0">
            {woTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setWoTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  woTab === tab.id
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════ TAB: Compatible Units ═══════ */}
        {woTab === "units" && (
          <div>
            {/* ─── Earned This Week Cards (Field Crew View) ─── */}
            {(() => {
              const byFunction = (fn: string) => costRows.filter((r: any) => r.function === fn);
              const earnedByFn = (fn: string) => byFunction(fn).reduce((s: number, r: any) => s + r.completedValue, 0);
              // Mock "this week" — in production, compare against weekly snapshots
              const weekEarned = (fn: string) => Math.round(earnedByFn(fn) * 0.22);
              const totalWeekEarned = Math.round(costRows.reduce((s: number, r: any) => s + r.completedValue, 0) * 0.22);
              const cards = [
                { label: "Install", weekVal: weekEarned("Install"), color: "#059669" },
                { label: "Remove", weekVal: weekEarned("Remove"), color: "#DC2626" },
                { label: "Transfer", weekVal: weekEarned("Transfer"), color: "#7C3AED" },
                { label: "Total", weekVal: totalWeekEarned, color: "#111827" },
              ];
              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                  {cards.map((card) => (
                    <div key={card.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px 18px" }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Earned This Week ({card.label})</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: card.weekVal > 0 ? "#059669" : "#D1D5DB", fontVariantNumeric: "tabular-nums" }}>
                        ${card.weekVal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Submitted success banner (shown above table when WO is locked) */}
            {woStatus === "submitted" && submittedBy && (
              <div style={{ marginBottom: 16, padding: "12px 16px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9999, background: "#fff", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={14} style={{ color: "#047857" }} />
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "#065F46" }}>
                  Submitted by <strong>{submittedBy.fullName}</strong> on {submittedBy.timestamp}
                </div>
                <button
                  onClick={() => { setWoStatus("in_progress"); setSubmittedBy(null); }}
                  className="flex items-center gap-1.5 border border-gray-300 shadow-sm bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-md text-sm transition-colors"
                >
                  <Unlock size={14} />
                  Re-open Work Order
                </button>
              </div>
            )}

            {/* Title row — title only */}
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Compatible Units</h2>
            </div>

            {/* Unified control row — search + columns left, add right */}
            <div className="flex justify-between items-center mb-4 mt-4 gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-full max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logged units..."
                    className="w-full h-10 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                {/* Column picker — immediately right of search */}
                <div className="relative flex-shrink-0" ref={cuColPickerRef}>
                  <button
                    onClick={() => setShowCuColPicker(!showCuColPicker)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      showCuColPicker ? "bg-gray-100 text-gray-700 border border-gray-300" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Columns3 size={14} /> Columns
                  </button>
                  {showCuColPicker && (
                    <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                      <div className="px-3 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wide">Columns</div>
                      {CU_TABLE_COLUMNS.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => toggleCuCol(col.id)}
                          className="flex items-center gap-2.5 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            visibleCuCols.includes(col.id) ? "bg-gray-800 border-gray-800" : "border-gray-300 bg-white"
                          } ${col.locked ? "opacity-60" : ""}`}>
                            {visibleCuCols.includes(col.id) && <Check size={10} className="text-white" />}
                          </div>
                          <span className={`flex-1 ${visibleCuCols.includes(col.id) ? "text-gray-900 font-medium" : "text-gray-500"}`}>{col.label}</span>
                          {col.locked && <span className="text-[10px] text-gray-300">Locked</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Solid primary Add button — right */}
              {woStatus !== "submitted" && (
                <button
                  onClick={() => setShowAddCU(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-shrink-0"
                >
                  <Plus size={16} /> Add Compatible Units
                </button>
              )}
            </div>

            {/* CU Table — framed SaaS pattern: stroke + rounded + clipped corners */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="cu-table w-full table-fixed" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-12 px-2 py-3 bg-gray-50"></th>
                    <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">CU</th>
                    <th className="w-24 text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Function</th>
                    <th className="w-24 text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Total Qty</th>
                    <th className="w-32 text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50 whitespace-nowrap">Qty This Week</th>
                    <th className="w-52 text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50 whitespace-nowrap">Notes & Redlines</th>
                    <th className="w-40 text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCUs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-10 text-center">
                        {searchQuery.trim() ? (
                          <>
                            <div className="text-sm text-gray-500">No units found matching "{searchQuery}"</div>
                            <button onClick={() => setSearchQuery("")} className="mt-1 text-xs text-blue-600 hover:underline">
                              Clear search
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-gray-400">{cuFilter === "all" ? "No CUs on this work order" : "No CUs match this filter"}</div>
                            {cuFilter === "all" && (
                              <button onClick={() => setShowAddCU(true)} className="mt-1 text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1">
                                <Plus size={14} /> Add from CU library
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                  {(() => {
                    // Build ordered groups from filteredCUs
                    const hasGroups = filteredCUs.some((r: any) => r.group);
                    if (!hasGroups) {
                      // Flat rendering — no groups
                      return filteredCUs.map((row: any) => renderCURow(row));
                    }
                    // Group rows preserving order
                    const groups: { name: string; rows: any[] }[] = [];
                    const groupMap = new Map<string, any[]>();
                    filteredCUs.forEach((row: any) => {
                      const g = row.group || "Ungrouped";
                      if (!groupMap.has(g)) {
                        groupMap.set(g, []);
                        groups.push({ name: g, rows: groupMap.get(g)! });
                      }
                      groupMap.get(g)!.push(row);
                    });
                    return groups.map((group) => {
                      const isCollapsed = collapsedGroups.has(group.name);
                      const groupTarget = group.rows.reduce((s: number, r: any) => s + r.plannedQty, 0);
                      const groupCompleted = group.rows.reduce((s: number, r: any) => s + getRowTotalQty(r), 0);
                      const groupPlannedVal = group.rows.reduce((s: number, r: any) => {
                        const cu = CU_LIBRARY.find((c) => c.code === r.cuCode);
                        return s + (cu?.unitPrice || 0) * r.plannedQty;
                      }, 0);
                      const groupEarnedVal = group.rows.reduce((s: number, r: any) => {
                        const cu = CU_LIBRARY.find((c) => c.code === r.cuCode);
                        return s + (cu?.unitPrice || 0) * getRowTotalQty(r);
                      }, 0);
                      const groupAllComplete = group.rows.every((r: any) => r.plannedQty > 0 && getRowTotalQty(r) >= r.plannedQty);
                      const groupHasProgress = group.rows.some((r: any) => getRowTotalQty(r) > 0);
                      return (
                        <React.Fragment key={group.name}>
                          <tr
                            onClick={() => toggleGroup(group.name)}
                            style={{ cursor: "pointer", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}
                          >
                            <td colSpan={7} style={{ padding: "8px 12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <ChevronDown size={18} style={{ color: "#6B7280", transition: "transform 0.15s", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)", flexShrink: 0 }} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{group.name}</span>
                                <span style={{ fontSize: 11, color: "#9CA3AF" }}>• {group.rows.length} unit{group.rows.length !== 1 ? "s" : ""}</span>
                                <span style={{ flex: 1 }} />
                                <span style={{ fontSize: 12, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>{groupCompleted.toLocaleString()} logged</span>
                              </div>
                            </td>
                          </tr>
                          {!isCollapsed && group.rows.map((row: any) => renderCURow(row))}
                        </React.Fragment>
                      );
                    });
                  })()}
                </tbody>
                {filteredCUs.length > 0 && (
                  <tfoot>
                    <tr className="border-t border-gray-200 bg-gray-50/50">
                      <td className="px-3 py-2.5"></td>
                      <td colSpan={2} className="px-3 py-2.5 text-xs font-medium text-gray-500">{filteredCUs.length} line items</td>
                      <td className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 tabular-nums">{filteredCUs.reduce((s: number, r: any) => s + getRowTotalQty(r), 0).toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-xs font-medium text-emerald-600 tabular-nums">{filteredCUs.reduce((s: number, r: any) => s + getRowWeekQty(r), 0).toLocaleString()}</td>
                      <td className="px-3 py-2.5"></td>
                      <td className="px-3 py-2.5"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

          </div>
        )}

        {/* ═══════ TAB: Change Orders — Coming Soon ═══════ */}
        {woTab === "change-orders" && (
          <div className="bg-white border border-gray-200 rounded-xl" style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FileText size={22} style={{ color: "#9CA3AF" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Change Orders</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>
              Track scope additions, T&E extras, and formal change documentation for this work order.
            </div>
            <div style={{ marginTop: 16, display: "inline-block", padding: "5px 14px", borderRadius: 9999, background: "#F3F4F6", fontSize: 11, fontWeight: 600, color: "#6B7280", letterSpacing: "0.03em" }}>
              Coming Soon
            </div>
          </div>
        )}

        {/* ═══════ TAB: Vendor Costs — Coming Soon ═══════ */}
        {woTab === "vendors" && (
          <div className="bg-white border border-gray-200 rounded-xl" style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <DollarSign size={22} style={{ color: "#9CA3AF" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Vendor Costs</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>
              Record third-party expenses, materials, and pass-through costs associated with this work order.
            </div>
            <div style={{ marginTop: 16, display: "inline-block", padding: "5px 14px", borderRadius: 9999, background: "#F3F4F6", fontSize: 11, fontWeight: 600, color: "#6B7280", letterSpacing: "0.03em" }}>
              Coming Soon
            </div>
          </div>
        )}

        {/* ═══════ TAB: Activity — Timeline (reverse chronological) ═══════ */}
        {woTab === "activity" && (() => {
          // Merge sign-off into activity if submitted; reverse so newest is first
          const baseEvents = [...activityLog];
          if (woStatus === "submitted" && submittedBy) {
            baseEvents.push({
              id: `submit-${submittedBy.timestamp}`,
              time: submittedBy.timestamp,
              type: "submit",
              title: "Work Order Submitted",
              user: `${submittedBy.fullName} (Foreman)`,
              detail: "Foreman signed off — work order locked for office review",
            });
          }
          const events = [...baseEvents].reverse();
          const typeStyles: Record<string, { bg: string; color: string; icon: any }> = {
            create: { bg: "#EFF6FF", color: "#2563EB", icon: FileText },
            unit_add: { bg: "#ECFDF5", color: "#059669", icon: PackagePlus },
            redline: { bg: "#FFF7ED", color: "#C2410C", icon: Pencil },
            note: { bg: "#F3F4F6", color: "#6B7280", icon: MessageSquare },
            submit: { bg: "#ECFDF5", color: "#047857", icon: Check },
          };
          return (
            <div className="bg-white border border-gray-200 rounded-xl" style={{ padding: "20px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Activity Log</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{events.length} event{events.length !== 1 ? "s" : ""} · newest first</div>
              </div>
              <div className="max-h-[600px] overflow-y-auto pl-4 pr-4" style={{ position: "relative" }}>
                <div style={{ position: "relative", paddingLeft: 28 }}>
                  {/* Vertical line */}
                  <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "#E5E7EB" }} />
                  {events.map((event: any, i: number) => {
                    const style = typeStyles[event.type] || typeStyles.create;
                    const Icon = style.icon;
                    return (
                      <div key={event.id} style={{ position: "relative", paddingBottom: i === events.length - 1 ? 0 : 22 }}>
                        {/* Dot */}
                        <div style={{
                          position: "absolute", left: -28, top: 2,
                          width: 24, height: 24, borderRadius: 9999,
                          background: style.bg, border: `2px solid #fff`, boxShadow: `0 0 0 2px ${style.color}22`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Icon size={12} style={{ color: style.color }} />
                        </div>
                        {/* Content */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{event.title}</span>
                            <span style={{ fontSize: 11, color: "#9CA3AF" }}>·</span>
                            <span style={{ fontSize: 11, color: "#6B7280" }}>{event.time}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#4B5563", marginBottom: 3, lineHeight: 1.5 }}>{event.detail}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>by {event.user}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══════ FULL-SCREEN TAKEOVER: Add CU from Library (Split-Pane) ═══════ */}
        {showAddCU && (() => {
          const canSave = stagedCUs.length > 0 && stagedCUs.every((s: any) => s.function && (s.qty > 0 || (parseInt(s.completedQty) || 0) > 0));
          const totalPlanned = stagedCUs.reduce((s: number, cu: any) => s + cu.unitPrice * (cu.qty || 0), 0);
          const totalEarned = stagedCUs.reduce((s: number, cu: any) => s + cu.unitPrice * (parseInt(cu.completedQty) || 0), 0);
          return (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
            {/* Takeover Header */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => { setShowAddCU(false); setStagedCUs([]); setCuSearch(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", fontSize: 13, fontWeight: 500, border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff", color: "#374151", cursor: "pointer" }}
                ><ArrowLeft size={14} /> Back to WO</button>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>Add Compatible Units</h2>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>CU Library: {job.cuLibrary || "Tri-County OH 2026"} · {CU_LIBRARY.length} units</div>
                </div>
              </div>
              {stagedCUs.length > 0 && (
                <div style={{ fontSize: 12, fontWeight: 500, color: "#6B7280" }}>
                  {stagedCUs.length} unit{stagedCUs.length !== 1 ? "s" : ""} staged
                </div>
              )}
            </div>

            {/* Split Pane Body */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

              {/* ── Left Column: CU Library (25%) ── */}
              <div style={{ width: "25%", minWidth: 260, borderRight: "1px solid #E5E7EB", background: "#fff", display: "flex", flexDirection: "column" }}>
                {/* Pinned Search */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #F3F4F6", flexShrink: 0 }}>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={cuSearch}
                      onChange={(e) => setCuSearch(e.target.value)}
                      placeholder="Search by CU code or description..."
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>
                {/* Scrollable Results */}
                <div style={{ flex: 1, overflow: "auto" }}>
                  {cuSearchResults.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                      No CUs match "{cuSearch}"
                    </div>
                  ) : cuSearchResults.map((cu) => {
                    const onWO = cuRows.some((r: any) => r.cuCode === cu.code);
                    const isStaged = stagedCUs.some((s: any) => s.code === cu.code);
                    return (
                      <div key={cu.code} onClick={() => stageCU(cu)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", transition: "all 0.1s", background: isStaged ? "#F0FDF4" : "transparent", borderBottom: "1px solid #F3F4F6" }}
                        onMouseEnter={(e) => { if (!isStaged) (e.currentTarget).style.background = "#F0F9FF"; }}
                        onMouseLeave={(e) => { if (!isStaged) (e.currentTarget).style.background = "transparent"; }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: 6, border: isStaged ? "none" : "1px dashed #D1D5DB", background: isStaged ? "#059669" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isStaged ? "#fff" : "#9CA3AF" }}>
                          {isStaged ? <Check size={12} /> : <Plus size={12} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{cu.code}</span>
                            {onWO && <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", background: "#F3F4F6", padding: "1px 5px", borderRadius: 3 }}>ON WO</span>}
                          </div>
                          <div style={{ fontSize: 13, color: "#111827", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cu.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Right Column: Staging Area (75%) ── */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Staging Header */}
                <div style={{ padding: "12px 20px", borderBottom: "1px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Staged Units ({stagedCUs.length})
                  </div>
                  {stagedCUs.length > 0 && (
                    <button onClick={() => setStagedCUs([])}
                      style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: "4px 6px" }}
                    >Clear all</button>
                  )}
                </div>

                {/* Staged Units — Scrollable Rows */}
                <div style={{ flex: 1, overflow: "auto", padding: "12px 20px" }}>
                  {stagedCUs.length === 0 ? (
                    <div style={{ padding: "80px 20px", textAlign: "center", color: "#9CA3AF" }}>
                      <PackagePlus size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>No units staged yet</div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>Search and tap CUs in the library panel to stage them here</div>
                    </div>
                  ) : stagedCUs.map((staged: any) => {
                    const existingGroups = [...new Set(cuRows.filter((r: any) => r.group).map((r: any) => r.group))];
                    const today = new Date().toISOString().split("T")[0];
                    const completedVal = parseInt(staged.completedQty) || 0;
                    const showDate = completedVal > 0;
                    const plannedDollars = staged.unitPrice * (staged.qty || 0);
                    const earnedDollars = staged.unitPrice * completedVal;
                    return (
                      <div key={staged.stagedId} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, marginBottom: 10, position: "relative" }}>
                        {/* ── Top Row: Full-width header ── */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", fontFamily: "ui-monospace, monospace", flexShrink: 0 }}>{staged.code}</span>
                            <span style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{staged.desc}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, marginLeft: 16 }}>
                            <button onClick={() => removeStagedCU(staged.stagedId)}
                              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", color: "#D1D5DB", cursor: "pointer", flexShrink: 0, transition: "all 0.1s" }}
                              onMouseEnter={(e) => { (e.currentTarget).style.color = "#DC2626"; (e.currentTarget).style.borderColor = "#FECACA"; }}
                              onMouseLeave={(e) => { (e.currentTarget).style.color = "#D1D5DB"; (e.currentTarget).style.borderColor = "#E5E7EB"; }}
                            ><X size={12} /></button>
                          </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: "#E5E7EB", margin: "0 14px" }} />

                        {/* ── Bottom Row: Controls with visual zones ── */}
                        <div style={{ padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>

                          {/* Function Toggle */}
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Function</div>
                            <div style={{ display: "flex", borderRadius: 6, border: "1px solid #E5E7EB", overflow: "hidden", height: 40 }}>
                              {["Install", "Remove", "Transfer"].map((fn) => (
                                <button key={fn}
                                  onClick={() => setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, function: fn } : s))}
                                  style={{
                                    padding: "0 14px", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    borderLeft: fn !== "Install" ? "1px solid #E5E7EB" : "none",
                                    background: staged.function === fn ? (fn === "Remove" ? "#FEF2F2" : fn === "Transfer" ? "#F5F3FF" : "#ECFDF5") : "#fff",
                                    color: staged.function === fn ? (fn === "Remove" ? "#DC2626" : fn === "Transfer" ? "#7C3AED" : "#059669") : "#9CA3AF",
                                    transition: "all 0.1s", height: "100%",
                                  }}
                                >{fn}</button>
                              ))}
                            </div>
                          </div>

                          {/* Quantity to Log — single stepper (exception-based model) */}
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Quantity to Log</div>
                            <QtyStepper value={String(staged.completedQty ?? "1")}
                              onChange={(v: string) => {
                                const newVal = parseInt(v) || 0;
                                setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? {
                                  ...s, completedQty: String(Math.max(0, newVal)), qty: Math.max(0, newVal),
                                } : s));
                              }}
                              min={0} placeholder="1"
                            />
                          </div>

                          {/* Group (if applicable) — positioned relative for dropdown overflow */}
                          {isGroupedWO && (
                            <div style={{ minWidth: 140, position: "relative" }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{groupTypeLabel}</div>
                              {/* If a group is selected, show as chip; otherwise show input */}
                              {staged.group && !staged.groupDropdownOpen ? (
                                <div style={{ display: "flex", alignItems: "center", height: 40, padding: "0 8px", border: "1px solid #E5E7EB", borderRadius: 6, background: "#fff", cursor: "pointer" }}
                                  onClick={() => setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, groupDropdownOpen: true, groupInput: "" } : s))}
                                >
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F3F4F6", borderRadius: 9999, padding: "3px 8px 3px 10px", fontSize: 11, fontWeight: 500, color: "#374151", maxWidth: "100%", overflow: "hidden" }}>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{staged.group}</span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, group: "", groupInput: "" } : s)); }}
                                      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 9999, border: "none", background: "transparent", color: "#9CA3AF", cursor: "pointer", flexShrink: 0, padding: 0 }}
                                      onMouseEnter={(e) => { (e.currentTarget).style.background = "#E5E7EB"; (e.currentTarget).style.color = "#374151"; }}
                                      onMouseLeave={(e) => { (e.currentTarget).style.background = "transparent"; (e.currentTarget).style.color = "#9CA3AF"; }}
                                    ><X size={10} /></button>
                                  </span>
                                </div>
                              ) : (
                                <input
                                  value={staged.groupInput ?? ""}
                                  onFocus={() => setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, groupDropdownOpen: true } : s))}
                                  onChange={(e) => setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, groupInput: e.target.value, groupDropdownOpen: true } : s))}
                                  onBlur={() => setTimeout(() => setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, groupDropdownOpen: false } : s)), 150)}
                                  placeholder="Type or select..."
                                  autoFocus={staged.groupDropdownOpen}
                                  style={{ width: "100%", padding: "7px 8px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 11, outline: "none", background: "#fff", color: "#111827", height: 40 }}
                                />
                              )}
                              {staged.groupDropdownOpen && (() => {
                                const gVal = (staged.groupInput ?? "").toLowerCase();
                                const filtered = existingGroups.filter((g: string) => g.toLowerCase().includes(gVal));
                                const exactMatch = existingGroups.some((g: string) => g.toLowerCase() === gVal);
                                if (filtered.length === 0 && !(gVal.trim() && !exactMatch)) return null;
                                return (
                                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 2, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50, maxHeight: 160, overflow: "auto" }}>
                                    {filtered.map((g: string) => (
                                      <button key={g}
                                        onMouseDown={(e) => { e.preventDefault(); setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, group: g, groupInput: g, groupDropdownOpen: false } : s)); }}
                                        style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 10px", fontSize: 12, color: "#374151", background: "none", border: "none", cursor: "pointer" }}
                                        onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#F3F4F6"; }}
                                        onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "none"; }}
                                      >{g}</button>
                                    ))}
                                    {gVal.trim() && !exactMatch && (
                                      <button
                                        onMouseDown={(e) => { e.preventDefault(); const newG = (staged.groupInput ?? "").trim(); setStagedCUs((prev: any) => prev.map((s: any) => s.stagedId === staged.stagedId ? { ...s, group: newG, groupInput: newG, groupDropdownOpen: false } : s)); }}
                                        style={{ display: "flex", alignItems: "center", gap: 4, width: "100%", textAlign: "left", padding: "7px 10px", fontSize: 12, color: "#2563EB", background: "none", border: "none", borderTop: filtered.length > 0 ? "1px solid #F3F4F6" : "none", cursor: "pointer", fontWeight: 500 }}
                                        onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#EFF6FF"; }}
                                        onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "none"; }}
                                      >+ Create "{(staged.groupInput ?? "").trim()}"</button>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sticky footer — checkout zone */}
                {stagedCUs.length > 0 && (
                  <div style={{ padding: "10px 20px", borderTop: "1px solid #E5E7EB", background: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>
                      {stagedCUs.length} unit{stagedCUs.length !== 1 ? "s" : ""} staged
                      {stagedCUs.some((s: any) => !s.function) && (
                        <span style={{ color: "#EF4444", fontWeight: 500, marginLeft: 8 }}>— select function for each</span>
                      )}
                      {hasPassiveRedline() && (
                        <span style={{ color: "#C2410C", fontWeight: 500, marginLeft: 8 }}>— includes scope changes</span>
                      )}
                    </div>
                    <button onClick={addStagedCUsToWO} disabled={!canSave}
                      style={{ padding: "10px 22px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 8, color: "#fff", background: canSave ? "#2563EB" : "#D1D5DB", cursor: canSave ? "pointer" : "not-allowed", boxShadow: canSave ? "0 1px 3px rgba(37,99,235,0.3)" : "none" }}
                    >Add {stagedCUs.length} Unit{stagedCUs.length !== 1 ? "s" : ""} to WO</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          );
        })()}

        {/* ═══════ MODAL: Red Line Change ═══════ */}
        {redLineCU && !logWorkRow && (
          <>
            <div
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.35)" }}
              onClick={() => setRedLineCU(null)}
            />
            <div
              className="fixed z-50"
              style={{
                top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: 480, background: "#fff", borderRadius: 12,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertTriangle size={14} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Red Line Change</h3>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Adjust or eliminate a CU on this work order</div>
                  </div>
                </div>
                <button onClick={() => setRedLineCU(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>×</button>
              </div>

              {/* CU Info Bar */}
              <div style={{ padding: "14px 20px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{redLineCU.cuCode}</span>
                  <span style={{ fontSize: 13, color: "#111827" }}>{CU_LIBRARY.find((c) => c.code === redLineCU.cuCode)?.desc}</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>Unit: <span style={{ fontWeight: 500, color: "#374151" }}>{CU_LIBRARY.find((c) => c.code === redLineCU.cuCode)?.unit}</span></span>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>Planned Qty: <span style={{ fontWeight: 500, color: "#374151" }}>{redLineCU.plannedQty}</span></span>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>Unit Price: <span style={{ fontWeight: 500, color: "#374151" }}>${(CU_LIBRARY.find((c) => c.code === redLineCU.cuCode)?.unitPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></span>
                </div>
              </div>

              {/* Action Selection */}
              <div style={{ padding: "16px 20px" }}>
                <RedLineActionForm
                  redLineCU={redLineCU}
                  onConfirm={(confirm) => {
                    handleRedlineAdjust(redLineCU.id, confirm.newQty, confirm.note);
                  }}
                  onCancel={() => setRedLineCU(null)}
                  cuLibrary={CU_LIBRARY}
                />
              </div>
            </div>
          </>
        )}

        {/* ═══════ MODAL A: Log Completed Work (Execution Only) ═══════ */}
        {/* ═══════ MODAL: Log Work (append-only event) ═══════ */}
        {logWorkRow && !redLineCU && !redlineModalRow && (() => {
          const qtyValue = parseInt(logWorkQty) || 0;
          const canSave = qtyValue > 0;
          return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 14, width: 420, overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              {/* Header */}
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Log Work</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{logWorkRow.cuCode}</span>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{CU_LIBRARY.find((c: any) => c.code === logWorkRow.cuCode)?.desc || logWorkRow.cuCode}</span>
                </div>
              </div>
              {/* Body — single stepper, no math */}
              <div style={{ padding: "28px 22px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 12, textAlign: "center" }}>Quantity Completed</label>
                <QtyStepper value={logWorkQty} onChange={setLogWorkQty} min={0} placeholder="0" />
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 22px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => { setLogWorkRow(null); setLogWorkQty(""); setLogWorkDate(""); }}
                  style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                >Cancel</button>
                <button onClick={handleLogWorkSave} disabled={!canSave}
                  style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: canSave ? "pointer" : "not-allowed", background: canSave ? "#111827" : "#D1D5DB", color: "#fff" }}
                >Save</button>
              </div>
            </div>
          </div>
          );
        })()}

        {/* ═══════ MODAL B: Log Scope Change (Baseline Redline — no execution) ═══════ */}
        {redlineModalRow && !logWorkRow && (() => {
          const currentRow = cuRows.find((r: any) => r.id === redlineModalRow.id) || redlineModalRow;
          const loggedQty = getRowTotalQty(currentRow);
          const paperVal = redlineDeviationType === "net_new" ? 0 : (parseInt(redlinePaperQty) || 0);
          const variance = loggedQty - paperVal;
          const hasVariance = variance !== 0;
          const canSave = hasVariance && redlineReason.trim();
          return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 14, width: 500, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Pencil size={16} style={{ color: "#C2410C" }} />
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Log Scope Change</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{redlineModalRow.cuCode}</span>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{CU_LIBRARY.find((c: any) => c.code === redlineModalRow.cuCode)?.desc || redlineModalRow.cuCode}</span>
                </div>
              </div>
              {/* Body */}
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16, lineHeight: 1.5 }}>
                  Document the paper work order baseline. This will <strong>not</strong> change the Total Qty logged — quantities are only adjusted via the Add Qty button.
                </div>

                {/* Deviation Type — segmented control */}
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Deviation Type</label>
                <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                  {[
                    { id: "net_new", label: "Net New Unit", hint: "Unit was missing from the paper WO" },
                    { id: "qty_change", label: "Quantity Change", hint: "Paper had a different quantity" },
                  ].map((opt, i) => {
                    const active = redlineDeviationType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setRedlineDeviationType(opt.id as any)}
                        style={{
                          flex: 1, padding: "10px 12px", fontSize: 12, fontWeight: 600,
                          border: "none", borderLeft: i > 0 ? "1px solid #E5E7EB" : "none",
                          background: active ? "#FFF7ED" : "#fff",
                          color: active ? "#C2410C" : "#6B7280",
                          cursor: "pointer", transition: "all 0.1s",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                        }}
                      >
                        <span>{opt.label}</span>
                        <span style={{ fontSize: 10, fontWeight: 400, color: active ? "#9A3412" : "#9CA3AF" }}>{opt.hint}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Qty on Paper WO stepper — centered under the 'Quantity Change' segment */}
                {redlineDeviationType === "qty_change" && (
                  <div style={{ marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                    <div></div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Qty on Paper WO</label>
                      <QtyStepper value={redlinePaperQty} onChange={setRedlinePaperQty} min={0} />
                    </div>
                  </div>
                )}

                {/* Dynamic math readout */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "12px 14px", background: hasVariance ? "#FFF7ED" : "#F9FAFB", border: `1px solid ${hasVariance ? "#FED7AA" : "#E5E7EB"}`, borderRadius: 8 }}>
                  <div style={{ flex: 1, fontSize: 13, color: "#374151" }}>
                    Paper WO: <strong className="tabular-nums">{paperVal}</strong>
                    <span style={{ margin: "0 8px", color: "#9CA3AF" }}>➔</span>
                    Currently Logged: <strong className="tabular-nums">{loggedQty}</strong>
                  </div>
                  {hasVariance ? (
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 9999, background: "#fff", color: "#C2410C", border: "1px solid #FED7AA", whiteSpace: "nowrap" }}>
                      {variance > 0 ? `▲ +${variance}` : `▼ ${variance}`} Redlined
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap" }}>No variance</span>
                  )}
                </div>

                {/* Redline Reason */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#92400E", marginBottom: 6 }}>
                    Redline Reason <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <textarea
                    value={redlineReason}
                    onChange={(e) => setRedlineReason(e.target.value)}
                    placeholder="Document why the paper work order needed to deviate..."
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 13, outline: "none", resize: "none", minHeight: 80, background: "#fff" }}
                  />
                </div>
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => { setRedlineModalRow(null); setRedlinePaperQty(""); setRedlineReason(""); }}
                  style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                >Cancel</button>
                <button onClick={handleRedlineModalSave} disabled={!canSave}
                  style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: canSave ? "pointer" : "not-allowed", background: canSave ? "#C2410C" : "#D1D5DB", color: "#fff" }}
                >Save Redline</button>
              </div>
            </div>
          </div>
          );
        })()}

        {/* ═══════ MODAL: Event Note (attached to child event) ═══════ */}
        {noteEventTarget && (() => {
          const row = cuRows.find((r: any) => r.id === noteEventTarget.rowId);
          const evt = row?.events?.find((e: any) => e.id === noteEventTarget.eventId);
          if (!evt) return null;
          return (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => { setNoteEventTarget(null); setNoteText(""); }}
            >
              <div style={{ background: "#fff", borderRadius: 14, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MessageSquare size={14} style={{ color: "#6B7280" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>{evt.note ? "Edit Event Note" : "Add Event Note"}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{row?.cuCode}</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>· +{evt.qty} · {formatEventTime(evt.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setNoteEventTarget(null); setNoteText(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>×</button>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Field Note</label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Describe anything notable about this specific log event..."
                    autoFocus
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", resize: "none", minHeight: 100, background: "#fff" }}
                  />
                </div>
                <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {evt.note && (
                      <button
                        onClick={() => { updateEventNote(noteEventTarget.rowId, noteEventTarget.eventId, ""); setNoteEventTarget(null); setNoteText(""); }}
                        style={{ padding: "8px 14px", fontSize: 12, fontWeight: 500, borderRadius: 8, border: "none", background: "none", color: "#DC2626", cursor: "pointer" }}
                      >Remove Note</button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setNoteEventTarget(null); setNoteText(""); }}
                      style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                    >Cancel</button>
                    <button onClick={handleEventNoteSave} disabled={!noteText.trim()}
                      style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: noteText.trim() ? "pointer" : "not-allowed", background: noteText.trim() ? "#111827" : "#D1D5DB", color: "#fff" }}
                    >Save Note</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══════ MODAL: Legacy parent-level note (kept for compat, no UI entry points) ═══════ */}
        {noteModalRow && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => { setNoteModalRow(null); setNoteText(""); }}
          >
            <div style={{ background: "#fff", borderRadius: 14, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare size={14} style={{ color: "#6B7280" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>{noteModalRow.fieldNote ? "Edit Note" : "Add Note"}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{noteModalRow.cuCode}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{CU_LIBRARY.find((c: any) => c.code === noteModalRow.cuCode)?.desc}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setNoteModalRow(null); setNoteText(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>×</button>
              </div>
              {/* Body */}
              <div style={{ padding: "18px 20px" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Field Note</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note or comment about this unit..."
                  autoFocus
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", resize: "none", minHeight: 100, background: "#fff" }}
                />
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  {noteModalRow.fieldNote && (
                    <button
                      onClick={() => { setCuRows((prev: any) => prev.map((r: any) => r.id === noteModalRow.id ? { ...r, fieldNote: "" } : r)); setNoteModalRow(null); setNoteText(""); }}
                      style={{ padding: "8px 14px", fontSize: 12, fontWeight: 500, borderRadius: 8, border: "none", background: "none", color: "#DC2626", cursor: "pointer" }}
                    >Remove Note</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setNoteModalRow(null); setNoteText(""); }}
                    style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                  >Cancel</button>
                  <button onClick={handleNoteSave} disabled={!noteText.trim()}
                    style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: noteText.trim() ? "pointer" : "not-allowed", background: noteText.trim() ? "#111827" : "#D1D5DB", color: "#fff" }}
                  >Save Note</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ MODAL: Delete Child Event Confirmation ═══════ */}
        {deleteEventConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 120, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setDeleteEventConfirm(null)}
          >
            <div style={{ background: "#fff", borderRadius: 14, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "24px 24px 16px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Trash2 size={22} style={{ color: "#DC2626" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>Delete Log Entry?</h3>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
                  This will permanently delete the log entry of <strong style={{ color: "#111827" }}>+{deleteEventConfirm.qty}</strong> on <strong style={{ color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{deleteEventConfirm.cuCode}</strong>. This action cannot be undone.
                </p>
              </div>
              <div style={{ padding: "16px 24px 20px", display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  onClick={() => setDeleteEventConfirm(null)}
                  style={{ padding: "10px 24px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", flex: 1 }}
                >Cancel</button>
                <button
                  onClick={() => {
                    deleteEvent(deleteEventConfirm.rowId, deleteEventConfirm.eventId);
                    setDeleteEventConfirm(null);
                  }}
                  style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", background: "#DC2626", color: "#fff", cursor: "pointer", flex: 1 }}
                >Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ MODAL: Safe Delete Confirmation ═══════ */}
        {deleteConfirmModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setDeleteConfirmModal(null)}
          >
            <div style={{ background: "#fff", borderRadius: 14, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "24px 24px 16px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Trash2 size={22} style={{ color: "#DC2626" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>Delete Unit?</h3>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
                  This will permanently remove <strong style={{ color: "#111827" }}>{deleteConfirmModal.cuCode}</strong> from this work order. This action cannot be undone.
                </p>
              </div>
              <div style={{ padding: "16px 24px 20px", display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => setDeleteConfirmModal(null)}
                  style={{ padding: "10px 24px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", flex: 1 }}
                >Cancel</button>
                <button onClick={() => { deleteCURow(deleteConfirmModal.id); setDeleteConfirmModal(null); }}
                  style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", background: "#DC2626", color: "#fff", cursor: "pointer", flex: 1 }}
                >Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ MODAL: Fix Planned Qty (Typo) ═══════ */}
        {typoFixModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => { setTypoFixModal(null); setTypoFixQty(""); }}
          >
            <div style={{ background: "#fff", borderRadius: 14, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Hash size={14} style={{ color: "#6B7280" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Fix Planned Qty</h3>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Correct a typo in the original plan — no redline will be created</div>
                  </div>
                </div>
                <button onClick={() => { setTypoFixModal(null); setTypoFixQty(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>×</button>
              </div>
              {/* CU Info */}
              <div style={{ padding: "14px 20px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "ui-monospace, monospace" }}>{typoFixModal.cuCode}</span>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{CU_LIBRARY.find((c: any) => c.code === typoFixModal.cuCode)?.desc}</span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>Current Planned Qty: <span style={{ fontWeight: 600, color: "#111827" }}>{typoFixModal.plannedQty}</span></div>
              </div>
              {/* Input */}
              <div style={{ padding: "16px 20px" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Correct Planned Qty</label>
                <input
                  type="number"
                  value={typoFixQty}
                  onChange={(e) => setTypoFixQty(e.target.value)}
                  min={0}
                  className="no-spin"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 600, outline: "none", background: "#fff" }}
                  autoFocus
                />
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => { setTypoFixModal(null); setTypoFixQty(""); }}
                  style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                >Cancel</button>
                <button onClick={handleTypoFixSave} disabled={typoFixQty === "" || parseInt(typoFixQty) < 0}
                  style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: (typoFixQty !== "" && parseInt(typoFixQty) >= 0) ? "pointer" : "not-allowed", background: (typoFixQty !== "" && parseInt(typoFixQty) >= 0) ? "#111827" : "#D1D5DB", color: "#fff" }}
                >Save Correction</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ MODAL: Sign-Off Work Order ═══════ */}
        {signOffModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setSignOffModal(false)}
          >
            <div style={{ background: "#fff", borderRadius: 14, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SendHorizontal size={14} style={{ color: "#059669" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Sign-Off Work Order</h3>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Confirm all work is complete and ready for review</div>
                  </div>
                </div>
                <button onClick={() => setSignOffModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>×</button>
              </div>
              {/* Body */}
              <div style={{ padding: "20px 20px" }}>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, lineHeight: 1.5 }}>
                  By signing off, you confirm that all compatible units have been completed and the work order is ready for office review and invoicing.
                </div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Foreman Initials <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  value={signOffInitials}
                  onChange={(e) => setSignOffInitials(e.target.value)}
                  placeholder="e.g., CR"
                  autoFocus
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 16, fontWeight: 600, letterSpacing: "0.05em", outline: "none", background: "#fff", textTransform: "uppercase" }}
                />
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setSignOffModal(false)}
                  style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                >Cancel</button>
                <button
                  onClick={() => {
                    const initials = signOffInitials.trim().toUpperCase();
                    setWoStatus("submitted");
                    setSubmittedBy({
                      initials,
                      fullName: MOCK_AUTH_USER.fullName,
                      timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                    });
                    setSignOffModal(false);
                    setSignOffInitials("");
                  }}
                  disabled={!signOffInitials.trim()}
                  style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: signOffInitials.trim() ? "pointer" : "not-allowed", background: signOffInitials.trim() ? "#059669" : "#D1D5DB", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Check size={14} />
                  Confirm Submission
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ MODAL: Passive Redline Reason Prompt ═══════ */}
        {passiveRedlinePrompt && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setPassiveRedlinePrompt(null)}
          >
            <div style={{ background: "#fff", borderRadius: 14, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", overflow: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Pencil size={14} style={{ color: "#C2410C" }} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Redline Detected</span>
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
                  One or more staged units have completed quantities that exceed the planned scope. A reason is required to document this scope change.
                </div>
              </div>
              {/* Affected units summary */}
              <div style={{ padding: "14px 24px", background: "#FFF7ED", borderBottom: "1px solid #FED7AA" }}>
                {stagedCUs.filter((s: any) => {
                  const p = s.qty || 0;
                  const c = parseInt(s.completedQty) || 0;
                  return (p === 0 && c > 0) || (c > p);
                }).map((s: any) => {
                  const p = s.qty || 0;
                  const c = parseInt(s.completedQty) || 0;
                  const delta = p === 0 ? c : c - p;
                  return (
                    <div key={s.stagedId} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#92400E", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#2563EB" }}>{s.code}</span>
                      <span>Planned: {p} → Completed: {c}</span>
                      <span style={{ fontWeight: 600, color: "#C2410C" }}>▲ +{delta} Redlined</span>
                    </div>
                  );
                })}
              </div>
              {/* Reason input */}
              <div style={{ padding: "16px 24px" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#92400E", marginBottom: 6 }}>
                  Redline Reason <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <textarea
                  value={passiveRedlinePrompt.reason}
                  onChange={(e) => setPassiveRedlinePrompt({ ...passiveRedlinePrompt, reason: e.target.value })}
                  placeholder="Document why this scope change is needed..."
                  autoFocus
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 13, outline: "none", resize: "none", minHeight: 80, background: "#fff" }}
                />
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setPassiveRedlinePrompt(null)}
                  style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                >Cancel</button>
                <button onClick={confirmPassiveRedline} disabled={!passiveRedlinePrompt.reason.trim()}
                  style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: passiveRedlinePrompt.reason.trim() ? "pointer" : "not-allowed", background: passiveRedlinePrompt.reason.trim() ? "#C2410C" : "#D1D5DB", color: "#fff" }}
                >Apply Redline & Add to WO</button>
              </div>
            </div>
          </div>
        )}

        {/* Close ellipsis menu on click outside */}
        {ellipsisMenuRow && (
          <div className="fixed inset-0 z-30" onClick={() => setEllipsisMenuRow(null)} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  JOBS TABLE (Landing Page)
// ═══════════════════════════════════════════════════════════════

function JobsTable({ jobs, onCreateJob, onViewJob }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = jobs.filter((j: any) => {
    if (statusFilter !== "all" && j.status.toLowerCase() !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        j.name.toLowerCase().includes(q) ||
        j.utility.toLowerCase().includes(q) ||
        j.contract.toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q) ||
        j.city?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusCounts = jobs.reduce((acc: any, j: any) => {
    const s = j.status.toLowerCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 flex items-center gap-1.5 text-xs text-gray-400">
          <span className="text-gray-400">Bluesky</span>
          <ChevronRight size={10} />
          <span className="text-gray-700 font-medium">Jobs</span>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Jobs</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your bluesky jobs and track work progress.</p>
          </div>
          <button
            onClick={onCreateJob}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 shadow-sm transition-colors"
          >
            <Plus size={16} /> Create Job
          </button>
        </div>
        <div style={{ borderBottom: "1px solid #E5E7EB", margin: "16px 0 20px" }} />

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(v: string) => setStatusFilter(v)}
            options={[
              { id: "all", label: "All Statuses" },
              { id: "active", label: "Active" },
              { id: "pending", label: "Pending" },
              { id: "on hold", label: "On Hold" },
              { id: "closed", label: "Closed" },
            ]}
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Job</th>
                <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Utility</th>
                <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Work Type</th>
                <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Location</th>
                <th className="text-left text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">Status</th>
                <th className="text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">CUs</th>
                <th className="text-right text-xs font-medium text-gray-900 px-3 py-3 bg-gray-50">WOs</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job: any) => {
                const statusKey = job.status.toLowerCase().replace(/ /g, "_");
                const statusConfig = JOB_STATUS_CONFIG[statusKey] || JOB_STATUS_CONFIG.active;
                return (
                  <tr
                    key={job.id}
                    onClick={() => onViewJob(job)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-3 py-2.5">
                      <div className="text-sm font-medium text-gray-900">{job.name}</div>
                      <div className="text-xs text-gray-400">{job.id}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-sm text-gray-700">{job.utility}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{job.contract}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {job.workType}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {job.city}, {job.state}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="text-sm text-gray-600 tabular-nums">{job.cusCompleted}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="text-sm text-gray-600 tabular-nums">{job.woCount}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center">
                    <div className="text-sm text-gray-400">No jobs found</div>
                    <button
                      onClick={onCreateJob}
                      className="mt-2 text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
                    >
                      <Plus size={14} /> Create your first job
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 text-xs text-gray-400 text-right">
              {filtered.length} of {jobs.length} jobs
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN SHELL
// ═══════════════════════════════════════════════════════════════

export default function JobSetupShell() {
  const [view, setView] = useState<"landing" | "wizard" | "detail" | "wo-detail">("landing");
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedWO, setSelectedWO] = useState<any>(null);

  return (
    <div style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {view === "landing" && (
        <JobsTable
          jobs={jobs}
          onCreateJob={() => setView("wizard")}
          onViewJob={(job: any) => {
            setSelectedJob(job);
            setView("detail");
          }}
        />
      )}
      {view === "detail" && selectedJob && (
        <JobDetail
          job={selectedJob}
          onBack={() => {
            setSelectedJob(null);
            setView("landing");
          }}
          onViewWO={(wo: any) => {
            setSelectedWO(wo);
            setView("wo-detail");
          }}
        />
      )}
      {view === "wo-detail" && selectedJob && selectedWO && (
        <WODetail
          wo={selectedWO}
          job={selectedJob}
          onBack={() => {
            setSelectedWO(null);
            setView("detail");
          }}
        />
      )}
      {view === "wizard" && (
        <JobSetupWizard
          onCancel={() => setView("landing")}
          onComplete={(newJob: any) => {
            setJobs([...jobs, newJob]);
            setSelectedJob(newJob);
            setView("detail");
          }}
        />
      )}
    </div>
  );
}
