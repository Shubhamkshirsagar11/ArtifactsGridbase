import React, { useState, useMemo } from 'react';
import {
  Users, Truck, Plus, Search, MoreHorizontal, ChevronRight, ChevronDown,
  Activity, Clock, UserCheck, UserMinus, Briefcase, Calendar, X,
  AlertCircle, Check, ChevronLeft, History, Edit3, UserPlus,
  Filter, ArrowUpDown, Wrench, Shuffle, MoveRight, KeyRound, Link2, Mail, ExternalLink, Unlink
} from 'lucide-react';

// ============================================================================
// SAMPLE DATA
// ============================================================================

const IBEW_CLASSIFICATIONS = [
  { code: 'GF', label: 'General Foreman', rate: 68.50 },
  { code: 'FM', label: 'Foreman', rate: 62.25 },
  { code: 'JL', label: 'Journeyman Lineman', rate: 54.80 },
  { code: 'A4', label: 'Apprentice Step 4', rate: 49.32 },
  { code: 'A3', label: 'Apprentice Step 3', rate: 43.84 },
  { code: 'A2', label: 'Apprentice Step 2', rate: 38.36 },
  { code: 'A1', label: 'Apprentice Step 1', rate: 32.88 },
  { code: 'GM', label: 'Groundman', rate: 28.50 },
  { code: 'EO', label: 'Equipment Operator', rate: 51.20 },
  { code: 'CDL', label: 'CDL Driver', rate: 38.75 },
];

const DEACTIVATION_REASONS = [
  'Released from project',
  'Voluntary departure',
  'Transferred to other project',
  'Medical leave',
  'Terminated',
  'No-show',
  'End of assignment',
];

const EQUIPMENT_TYPES = [
  'Digger Derrick',
  'Bucket Truck',
  'Aerial Lift',
  'Pickup Truck',
  'Pole Trailer',
  'Material Trailer',
  'Service Truck',
];

// Gridbase Users (from the Settings module) — admins add/remove these separately.
// Roster entries can optionally link to a User to grant them project visibility.
const GRIDBASE_USERS = [
  { id: 'u1', name: 'Darryl Henderson', email: 'dhenderson@powergrid.com' },
  { id: 'u2', name: 'Mike Torres', email: 'mtorres@powergrid.com' },
  { id: 'u3', name: 'Kevin McAllister', email: 'kmcallister@powergrid.com' },
  { id: 'u4', name: 'Patricio Gomez', email: 'pgomez@powergrid.com' },
  { id: 'u5', name: 'Cameron Ross', email: 'cross@powergrid.com' },
  { id: 'u6', name: 'Jake Brennan', email: 'jbrennan@powergrid.com' },
  { id: 'u7', name: 'Summer Wallace', email: 'swallace@powergrid.com' },
  { id: 'u8', name: 'Antonio Silva', email: 'asilva@powergrid.com' },
];

// Seeded personnel with effective-dated history
const initialPersonnel = [
  {
    id: 'p1',
    name: 'Darryl Henderson',
    userId: 'u1',
    activeStartDate: '2026-01-15',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: null, // top of hierarchy
    classification: 'GF',
    history: [
      { date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added to project roster as General Foreman' },
    ],
  },
  {
    id: 'p2',
    name: 'Mike Torres',
    userId: 'u2',
    activeStartDate: '2026-01-15',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p1',
    classification: 'FM',
    history: [
      { date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added under Darryl Henderson as Foreman' },
    ],
  },
  {
    id: 'p3',
    name: 'James "Jim" Callahan',
    activeStartDate: '2026-01-15',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p2',
    classification: 'JL',
    history: [
      { date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added under Mike Torres' },
      { date: '2026-03-01', type: 'classification', user: 'Cameron Ross', details: 'Promoted from Apprentice Step 4 to Journeyman Lineman', previous: 'A4', next: 'JL' },
    ],
  },
  {
    id: 'p4',
    name: 'Roberto Diaz',
    activeStartDate: '2026-01-15',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p2',
    classification: 'A3',
    history: [
      { date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added under Mike Torres' },
    ],
  },
  {
    id: 'p5',
    name: 'Tyrell Washington',
    activeStartDate: '2026-01-15',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p2',
    classification: 'GM',
    history: [
      { date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added under Mike Torres' },
    ],
  },
  {
    id: 'p6',
    name: 'Kevin McAllister',
    userId: 'u3',
    activeStartDate: '2026-01-22',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p1',
    classification: 'FM',
    history: [
      { date: '2026-01-22', type: 'added', user: 'Cameron Ross', details: 'Added under Darryl Henderson as Foreman' },
    ],
  },
  {
    id: 'p7',
    name: 'Antonio Silva',
    activeStartDate: '2026-01-22',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p6',
    classification: 'JL',
    history: [
      { date: '2026-01-22', type: 'added', user: 'Cameron Ross', details: 'Added under Kevin McAllister' },
    ],
  },
  {
    id: 'p8',
    name: 'Derek Bolton',
    activeStartDate: '2026-01-22',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p6',
    classification: 'EO',
    history: [
      { date: '2026-01-22', type: 'added', user: 'Cameron Ross', details: 'Added under Kevin McAllister' },
    ],
  },
  {
    id: 'p9',
    name: 'Marcus Reid',
    activeStartDate: '2026-01-15',
    activeEndDate: '2026-03-20',
    deactivationReason: 'Transferred to other project',
    crewLead: 'p2',
    classification: 'A2',
    history: [
      { date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added under Mike Torres' },
      { date: '2026-03-20', type: 'deactivated', user: 'Cameron Ross', details: 'Deactivated — Transferred to other project' },
    ],
  },
  {
    id: 'p10',
    name: 'Patricio Gomez',
    activeStartDate: '2026-02-10',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p1',
    classification: 'FM',
    history: [
      { date: '2026-02-10', type: 'added', user: 'Cameron Ross', details: 'Added under Darryl Henderson as Foreman' },
    ],
  },
  {
    id: 'p11',
    name: 'Shawn Whitfield',
    activeStartDate: '2026-02-10',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p10',
    classification: 'JL',
    history: [
      { date: '2026-02-10', type: 'added', user: 'Cameron Ross', details: 'Added under Patricio Gomez' },
    ],
  },
  {
    id: 'p12',
    name: 'Brandon Keller',
    activeStartDate: '2026-02-10',
    activeEndDate: null,
    deactivationReason: null,
    crewLead: 'p10',
    classification: 'CDL',
    history: [
      { date: '2026-02-10', type: 'added', user: 'Cameron Ross', details: 'Added under Patricio Gomez' },
    ],
  },
];

const EQUIPMENT_DEACTIVATION_REASONS = [
  'Returned to yard',
  'Maintenance / repair',
  'Transferred to other project',
  'Sold',
  'Retired',
  'Damaged',
  'End of assignment',
];

// Simulated company fleet from Motive/Geotab integration. In production this
// would be a live API call. Units marked with onProject = true are currently
// on THIS project (in initialEquipment); others are available to add.
const COMPANY_FLEET = [
  { id: 'f1', unitNumber: 'T-4412', vin: '1FVACWDT8HHJV2845', type: 'Digger Derrick', internalClass: 'Class 8', internalRate: 85.50, billingRate: 145.00, source: 'Motive' },
  { id: 'f2', unitNumber: 'T-3891', vin: '1FVACWDT2GHHS4621', type: 'Bucket Truck',   internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive' },
  { id: 'f3', unitNumber: 'P-2201', vin: '1FTFW1E84LFA23781', type: 'Pickup Truck',   internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f4', unitNumber: 'T-4501', vin: '1FVACWDT0JHJV8812', type: 'Digger Derrick', internalClass: 'Class 8', internalRate: 87.00, billingRate: 148.00, source: 'Motive' },
  { id: 'f5', unitNumber: 'T-3902', vin: '1FVACWDT6HHJV9922', type: 'Bucket Truck',   internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive' },
  { id: 'f6', unitNumber: 'P-2205', vin: '1FTFW1E82LFA55671', type: 'Pickup Truck',   internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f7', unitNumber: 'TR-1104', vin: '1TRP0102XLA445901', type: 'Pole Trailer',  internalClass: 'Trailer',  internalRate: 12.00, billingRate: 22.50,  source: 'Motive' },
  { id: 'f8', unitNumber: 'P-2208', vin: '1FTFW1E84LFA78221', type: 'Pickup Truck',   internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f9', unitNumber: 'P-2210', vin: '1FTFW1E80LFA81102', type: 'Pickup Truck',   internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f10', unitNumber: 'T-3905', vin: '1FVACWDT5HHJV7745', type: 'Bucket Truck',  internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive' },
  { id: 'f11', unitNumber: 'A-2101', vin: '1FVACWDT1JHJ33420', type: 'Aerial Lift',   internalClass: 'Class 6', internalRate: 58.00, billingRate: 98.00,  source: 'Motive' },
  { id: 'f12', unitNumber: 'TR-1108', vin: '1TRP0102ZLA662230', type: 'Pole Trailer', internalClass: 'Trailer', internalRate: 12.00, billingRate: 22.50,  source: 'Motive' },
  { id: 'f13', unitNumber: 'TR-2201', vin: '1TRP0330XLA881125', type: 'Material Trailer', internalClass: 'Trailer', internalRate: 9.50, billingRate: 18.00, source: 'Motive' },
  { id: 'f14', unitNumber: 'S-1401', vin: '1FVACWDT9HHJV1188', type: 'Service Truck', internalClass: 'Class 5', internalRate: 42.00, billingRate: 72.50,  source: 'Motive' },
  { id: 'f15', unitNumber: 'P-2212', vin: '1FTFW1E85LFA90012', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f16', unitNumber: 'P-2215', vin: '1FTFW1E81LFA10022', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f17', unitNumber: 'P-2218', vin: '1FTFW1E83LFA11234', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f18', unitNumber: 'P-2221', vin: '1FTFW1E87LFA22310', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f19', unitNumber: 'P-2224', vin: '1FTFW1E89LFA33421', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f20', unitNumber: 'P-2227', vin: '1FTFW1E80LFA44532', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f21', unitNumber: 'P-2230', vin: '1FTFW1E82LFA55643', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f22', unitNumber: 'P-2233', vin: '1FTFW1E84LFA66754', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f23', unitNumber: 'P-2236', vin: '1FTFW1E86LFA77865', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f24', unitNumber: 'P-2239', vin: '1FTFW1E88LFA88976', type: 'Pickup Truck',  internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00,  source: 'Geotab' },
  { id: 'f25', unitNumber: 'T-3908', vin: '1FVACWDT1HHJV2233', type: 'Bucket Truck',  internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive' },
  { id: 'f26', unitNumber: 'T-3911', vin: '1FVACWDT3HHJV3344', type: 'Bucket Truck',  internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive' },
  { id: 'f27', unitNumber: 'T-3914', vin: '1FVACWDT5HHJV4455', type: 'Bucket Truck',  internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive' },
  { id: 'f28', unitNumber: 'T-4508', vin: '1FVACWDT2JHJV5566', type: 'Digger Derrick', internalClass: 'Class 8', internalRate: 87.00, billingRate: 148.00, source: 'Motive' },
  { id: 'f29', unitNumber: 'T-4515', vin: '1FVACWDT4JHJV6677', type: 'Digger Derrick', internalClass: 'Class 8', internalRate: 87.00, billingRate: 148.00, source: 'Motive' },
  { id: 'f30', unitNumber: 'A-2104', vin: '1FVACWDT3JHJ44531', type: 'Aerial Lift',   internalClass: 'Class 6', internalRate: 58.00, billingRate: 98.00,  source: 'Motive' },
  { id: 'f31', unitNumber: 'A-2107', vin: '1FVACWDT5JHJ55642', type: 'Aerial Lift',   internalClass: 'Class 6', internalRate: 58.00, billingRate: 98.00,  source: 'Motive' },
  { id: 'f32', unitNumber: 'TR-1115', vin: '1TRP0102ZLA773341', type: 'Pole Trailer', internalClass: 'Trailer', internalRate: 12.00, billingRate: 22.50,  source: 'Motive' },
  { id: 'f33', unitNumber: 'TR-1122', vin: '1TRP0102XLA884452', type: 'Pole Trailer', internalClass: 'Trailer', internalRate: 12.00, billingRate: 22.50,  source: 'Motive' },
  { id: 'f34', unitNumber: 'TR-2208', vin: '1TRP0330ZLA995563', type: 'Material Trailer', internalClass: 'Trailer', internalRate: 9.50, billingRate: 18.00, source: 'Motive' },
  { id: 'f35', unitNumber: 'S-1408', vin: '1FVACWDT1HHJV1199', type: 'Service Truck', internalClass: 'Class 5', internalRate: 42.00, billingRate: 72.50,  source: 'Motive' },
];

// Human-readable classification names — mapped by class + type combination.
// In production, these come from the equipment master config. Longer than
// the short code (Class 3, Class 7, etc.), so they live in sub-lines not chips.
const CLASSIFICATION_NAMES = {
  'Class 3|Pickup Truck':        'Light Duty Pickup Truck',
  'Class 5|Service Truck':       'Medium Duty Service Truck',
  'Class 6|Aerial Lift':         'Single-Man Aerial Lift',
  'Class 7|Bucket Truck':        'Single Bucket / Boom Truck',
  'Class 8|Digger Derrick':      'Heavy Duty Digger Derrick',
  'Trailer|Pole Trailer':        'Pole / Reel Trailer',
  'Trailer|Material Trailer':    'Flatbed Material Trailer',
};
const getClassificationName = (internalClass, type) =>
  CLASSIFICATION_NAMES[`${internalClass}|${type}`] || `${internalClass} ${type}`;

const initialEquipment = [
  { id: 'e1', fleetId: 'f1', unitNumber: 'T-4412', vin: '1FVACWDT8HHJV2845', type: 'Digger Derrick', internalClass: 'Class 8', internalRate: 85.50, billingRate: 145.00, source: 'Motive',
    assignedTo: 'p2', activeStartDate: '2026-01-15', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added to project · assigned to Mike Torres crew' }] },
  { id: 'e2', fleetId: 'f2', unitNumber: 'T-3891', vin: '1FVACWDT2GHHS4621', type: 'Bucket Truck', internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive',
    assignedTo: 'p2', activeStartDate: '2026-01-15', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added to project · assigned to Mike Torres crew' }] },
  { id: 'e3', fleetId: 'f3', unitNumber: 'P-2201', vin: '1FTFW1E84LFA23781', type: 'Pickup Truck', internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00, source: 'Geotab',
    assignedTo: 'p2', activeStartDate: '2026-01-15', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-01-15', type: 'added', user: 'Cameron Ross', details: 'Added to project · assigned to Mike Torres crew' }] },
  { id: 'e4', fleetId: 'f4', unitNumber: 'T-4501', vin: '1FVACWDT0JHJV8812', type: 'Digger Derrick', internalClass: 'Class 8', internalRate: 87.00, billingRate: 148.00, source: 'Motive',
    assignedTo: 'p6', activeStartDate: '2026-01-22', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-01-22', type: 'added', user: 'Cameron Ross', details: 'Added to project · assigned to Kevin McAllister crew' }] },
  { id: 'e5', fleetId: 'f5', unitNumber: 'T-3902', vin: '1FVACWDT6HHJV9922', type: 'Bucket Truck', internalClass: 'Class 7', internalRate: 72.00, billingRate: 125.00, source: 'Motive',
    assignedTo: 'p6', activeStartDate: '2026-01-22', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-01-22', type: 'added', user: 'Cameron Ross', details: 'Added to project · assigned to Kevin McAllister crew' }] },
  { id: 'e6', fleetId: 'f6', unitNumber: 'P-2205', vin: '1FTFW1E82LFA55671', type: 'Pickup Truck', internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00, source: 'Geotab',
    assignedTo: 'p10', activeStartDate: '2026-02-10', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-02-10', type: 'added', user: 'Cameron Ross', details: 'Added to project · assigned to Patricio Gomez crew' }] },
  { id: 'e7', fleetId: 'f7', unitNumber: 'TR-1104', vin: '1TRP0102XLA445901', type: 'Pole Trailer', internalClass: 'Trailer', internalRate: 12.00, billingRate: 22.50, source: 'Motive',
    assignedTo: 'p10', activeStartDate: '2026-02-10', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-02-10', type: 'added', user: 'Cameron Ross', details: 'Added to project · assigned to Patricio Gomez crew' }] },
  // Yard (unassigned) equipment
  { id: 'e8', fleetId: 'f8', unitNumber: 'P-2208', vin: '1FTFW1E84LFA78221', type: 'Pickup Truck', internalClass: 'Class 3', internalRate: 18.50, billingRate: 32.00, source: 'Geotab',
    assignedTo: null, activeStartDate: '2026-03-05', activeEndDate: null, deactivationReason: null,
    history: [{ date: '2026-03-05', type: 'added', user: 'Cameron Ross', details: 'Added to project · at the yard' }] },
];

// Seeded project-wide activity (newest first)
const initialActivity = [
  { id: 'a1', date: '2026-04-12', time: '09:42 AM', user: 'Cameron Ross', action: 'classification', personName: 'James "Jim" Callahan', details: 'Promoted from Apprentice Step 4 → Journeyman Lineman', effectiveDate: '2026-03-01' },
  { id: 'a2', date: '2026-03-20', time: '02:15 PM', user: 'Cameron Ross', action: 'deactivated', personName: 'Marcus Reid', details: 'Deactivated — Transferred to other project' },
  { id: 'a3', date: '2026-02-10', time: '10:20 AM', user: 'Cameron Ross', action: 'added', personName: 'Brandon Keller', details: 'Added to project under Patricio Gomez' },
  { id: 'a4', date: '2026-02-10', time: '10:18 AM', user: 'Cameron Ross', action: 'added', personName: 'Shawn Whitfield', details: 'Added to project under Patricio Gomez' },
  { id: 'a5', date: '2026-02-10', time: '10:15 AM', user: 'Cameron Ross', action: 'added', personName: 'Patricio Gomez', details: 'Added as Foreman under Darryl Henderson' },
  { id: 'a6', date: '2026-02-10', time: '10:15 AM', user: 'Cameron Ross', action: 'equipment', personName: 'TR-1104', details: 'Pole Trailer assigned to Patricio Gomez crew' },
  { id: 'a7', date: '2026-01-22', time: '08:30 AM', user: 'Cameron Ross', action: 'added', personName: 'Kevin McAllister', details: 'Added as Foreman under Darryl Henderson' },
  { id: 'a8', date: '2026-01-15', time: '07:45 AM', user: 'Cameron Ross', action: 'added', personName: 'Darryl Henderson', details: 'Added as General Foreman — top of crew hierarchy' },
];

// ============================================================================
// HELPERS
// ============================================================================

const getClassLabel = (code) => IBEW_CLASSIFICATIONS.find(c => c.code === code)?.label || code;
const getUser = (userId) => GRIDBASE_USERS.find(u => u.id === userId) || null;

// Parse a free-form name into structured parts. The UI keeps a single input for
// simplicity (foremen type fast), but downstream systems (payroll, IBEW dues
// reporting, external integrations) often need first/last/suffix separately, so
// we parse on save. Known suffixes are pulled out first; then first = first
// token, last = last token, middle = everything in between.
const NAME_SUFFIXES = new Set(['jr', 'jr.', 'sr', 'sr.', 'ii', 'iii', 'iv', 'v']);
const parseName = (fullName) => {
  const tokens = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { firstName: '', middleName: '', lastName: '', suffix: '' };

  let suffix = '';
  const lastToken = tokens[tokens.length - 1];
  if (NAME_SUFFIXES.has(lastToken.toLowerCase())) {
    suffix = tokens.pop();
  }

  if (tokens.length === 1) return { firstName: tokens[0], middleName: '', lastName: '', suffix };
  if (tokens.length === 2) return { firstName: tokens[0], middleName: '', lastName: tokens[1], suffix };
  return {
    firstName: tokens[0],
    middleName: tokens.slice(1, -1).join(' '),
    lastName: tokens[tokens.length - 1],
    suffix,
  };
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateShort = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const today = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// ============================================================================
// STATUS PILL
// ============================================================================

const StatusPill = ({ active }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
    active
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-gray-100 text-gray-500 border-gray-200'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
    {active ? 'Active' : 'Inactive'}
  </span>
);

const ClassBadge = ({ code }) => {
  const isLead = ['GF', 'FM'].includes(code);
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border font-mono ${
      isLead
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-gray-50 text-gray-600 border-gray-200'
    }`}>
      {code}
    </span>
  );
};

// Avatar with optional Gridbase access dot. If the person is linked to a user,
// an emerald dot sits at the bottom-right corner.
const PersonAvatar = ({ name, isLead, hasAccess, size = 'md' }) => {
  const sizeClasses = size === 'lg'
    ? 'w-10 h-10 text-sm'
    : 'w-7 h-7 text-[11px]';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div className="relative flex-shrink-0" title={hasAccess ? 'Has Gridbase access' : undefined}>
      <div className={`${sizeClasses} rounded-full flex items-center justify-center font-medium ${
        isLead ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {initials}
      </div>
      {hasAccess && (
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
};

// ============================================================================
// ADD PERSON DIALOG
// ============================================================================

function AddPersonDialog({ open, onClose, onSave, personnel, existingNames }) {
  const [name, setName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // if a user was picked from suggestions
  const [classification, setClassification] = useState('JL');
  const [crewLead, setCrewLead] = useState('');
  const [startDate, setStartDate] = useState(today());
  const [showSuggestions, setShowSuggestions] = useState(false);

  const activePersonnel = personnel.filter(p => !p.activeEndDate);
  const possibleLeads = activePersonnel.filter(p => ['GF', 'FM'].includes(p.classification));

  // Users already on this project's roster — exclude from suggestions
  const linkedUserIds = new Set(personnel.filter(p => p.userId).map(p => p.userId));

  // Suggest Gridbase users as admin types
  const userSuggestions = name.trim().length >= 2
    ? GRIDBASE_USERS
        .filter(u => {
          if (linkedUserIds.has(u.id)) return false;
          const q = name.toLowerCase();
          return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        })
        .slice(0, 5)
    : [];

  // Simple duplicate detection on existing roster names (not users)
  const potentialDup = name.trim().length >= 3 && !selectedUserId
    ? existingNames.find(n => {
        const a = n.toLowerCase().replace(/[^a-z]/g, '');
        const b = name.toLowerCase().replace(/[^a-z]/g, '');
        return a.includes(b) || b.includes(a);
      })
    : null;

  const isLead = ['GF', 'FM'].includes(classification);

  const resetForm = () => {
    setName(''); setSelectedUserId(null);
    setClassification('JL'); setCrewLead(''); setStartDate(today());
    setShowSuggestions(false);
  };

  const pickUser = (user) => {
    setName(user.name);
    setSelectedUserId(user.id);
    setShowSuggestions(false);
  };

  const handleNameChange = (value) => {
    setName(value);
    if (selectedUserId) setSelectedUserId(null); // typing clears the user link
    setShowSuggestions(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const parsed = parseName(name);
    onSave({
      name: name.trim(),
      firstName: parsed.firstName,
      middleName: parsed.middleName,
      lastName: parsed.lastName,
      suffix: parsed.suffix,
      userId: selectedUserId || null,
      classification,
      crewLead: crewLead || null,
      activeStartDate: startDate,
    });
    resetForm();
    onClose();
  };

  const handleCancel = () => { resetForm(); onClose(); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Add person to roster</h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Type name or search Gridbase users..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                autoFocus
              />

              {/* Suggestions dropdown */}
              {showSuggestions && userSuggestions.length > 0 && !selectedUserId && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
                    <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Gridbase Users</div>
                  </div>
                  {userSuggestions.map(u => (
                    <button
                      key={u.id}
                      onClick={() => pickUser(u)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-medium flex-shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                        <div className="text-[11px] text-gray-500 truncate">{u.email}</div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-xs text-gray-500 border-t border-gray-100"
                  >
                    Continue with "<span className="font-medium text-gray-700">{name}</span>" as non-user personnel
                  </button>
                </div>
              )}
            </div>

            {/* Linked user indicator */}
            {selectedUserId && (
              <div className="mt-1.5 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded p-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-emerald-800 truncate">
                      Linked to {getUser(selectedUserId)?.name}
                    </div>
                    <div className="text-[11px] text-emerald-700 truncate">{getUser(selectedUserId)?.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedUserId(null); }}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium flex-shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Parsed name preview — only shown when we have a usable parse
                (2+ tokens), not currently showing the user-suggestions dropdown,
                and not linked to an existing Gridbase user. Helps the foreman
                see what will be saved and catch surname issues. */}
            {(() => {
              const parsed = parseName(name);
              const hasFullName = parsed.firstName && parsed.lastName;
              const hasSingleName = parsed.firstName && !parsed.lastName;
              if (!hasFullName && !hasSingleName) return null;
              if (showSuggestions && userSuggestions.length > 0 && !selectedUserId) return null;
              if (selectedUserId) return null;

              if (hasSingleName) {
                return (
                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                    <span>Add a last name so this person can be identified on reports and in payroll.</span>
                  </div>
                );
              }
              return (
                <div className="mt-1.5 flex items-center gap-2 flex-wrap text-[11px] text-gray-500 px-2">
                  <span className="text-gray-400">Saved as:</span>
                  <span><span className="text-gray-400">First</span> <span className="text-gray-700 font-medium">{parsed.firstName}</span></span>
                  {parsed.middleName && (
                    <span><span className="text-gray-400">Middle</span> <span className="text-gray-700 font-medium">{parsed.middleName}</span></span>
                  )}
                  <span><span className="text-gray-400">Last</span> <span className="text-gray-700 font-medium">{parsed.lastName}</span></span>
                  {parsed.suffix && (
                    <span><span className="text-gray-400">Suffix</span> <span className="text-gray-700 font-medium">{parsed.suffix}</span></span>
                  )}
                </div>
              );
            })()}

            {potentialDup && (
              <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                <span>Possible duplicate: <strong>{potentialDup}</strong> already on roster</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Classification</label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              {IBEW_CLASSIFICATIONS.map(c => (
                <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Reports to {isLead ? '(optional for leads)' : ''}
            </label>
            <select
              value={crewLead}
              onChange={(e) => setCrewLead(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              <option value="">— Top of hierarchy —</option>
              {possibleLeads.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.classification})</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-1">
              {isLead
                ? 'Leads can report to another lead, or sit at the top.'
                : 'Non-lead personnel must report to a Foreman or General Foreman.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Timesheet eligibility starts on this date.
            </p>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || (!isLead && !crewLead)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to roster
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CHANGE CLASSIFICATION DIALOG
// ============================================================================

function ClassificationDialog({ open, person, onClose, onSave }) {
  const [newClass, setNewClass] = useState('');
  const [effDate, setEffDate] = useState(today());

  React.useEffect(() => {
    if (person) { setNewClass(person.classification); setEffDate(today()); }
  }, [person]);

  if (!open || !person) return null;

  const isChange = newClass !== person.classification;

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Change classification</h3>
            <p className="text-xs text-gray-500 mt-0.5">{person.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Current</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{getClassLabel(person.classification)}</span>
              <ClassBadge code={person.classification} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">New classification</label>
            <select
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              {IBEW_CLASSIFICATIONS.map(c => (
                <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective date</label>
            <input
              type="date"
              value={effDate}
              onChange={(e) => setEffDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
            <p className="text-[11px] text-gray-500 mt-1.5 flex items-start gap-1.5">
              <AlertCircle size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
              Timesheets before this date record the old classification. Timesheets on or after use the new classification.
            </p>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button
            onClick={() => { onSave(person.id, newClass, effDate); onClose(); }}
            disabled={!isChange}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save change
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEACTIVATE DIALOG
// ============================================================================

function DeactivateDialog({ open, person, personnel, onClose, onSave }) {
  const [reason, setReason] = useState('');
  const [effDate, setEffDate] = useState(today());
  const [succession, setSuccession] = useState('orphan'); // 'orphan' | 'promote' | 'reassign'
  const [promotee, setPromotee] = useState('');
  const [promoteeNewClass, setPromoteeNewClass] = useState('');
  const [reassignTo, setReassignTo] = useState('');

  React.useEffect(() => {
    if (person) {
      setReason('');
      setEffDate(today());
      setSuccession('orphan');
      setPromotee('');
      setPromoteeNewClass('');
      setReassignTo('');
    }
  }, [person]);

  if (!open || !person) return null;

  const directReports = personnel.filter(p => p.crewLead === person.id && !p.activeEndDate);
  const hasReports = directReports.length > 0;
  const isLead = ['GF', 'FM'].includes(person.classification);

  // Eligible reassignment targets: active GF/FM, not self, not a descendant
  const getDescendants = (id) => {
    const direct = personnel.filter(p => p.crewLead === id);
    let all = [...direct];
    direct.forEach(d => { all = [...all, ...getDescendants(d.id)]; });
    return all;
  };
  const excludedIds = new Set([person.id, ...getDescendants(person.id).map(d => d.id)]);
  const reassignCandidates = personnel.filter(p =>
    !p.activeEndDate
    && ['GF', 'FM'].includes(p.classification)
    && !excludedIds.has(p.id)
  );

  // Default promotee's new classification — match what they're replacing,
  // unless they're already at that level, then one up (rare: JL being promoted
  // straight to GF is unusual, but we'll default to person.classification)
  const promoteeObj = personnel.find(p => p.id === promotee);
  const defaultPromoteeClass = person.classification; // inherit the departing lead's class
  const effectivePromoteeClass = promoteeNewClass || defaultPromoteeClass;
  const promoteeOldClass = promoteeObj?.classification;

  // Validation
  const canSave = (
    !hasReports ||
    succession === 'orphan' ||
    (succession === 'promote' && promotee) ||
    (succession === 'reassign' && reassignTo)
  );

  const handleSave = () => {
    const payload = { id: person.id, effDate, reason };
    if (hasReports && succession === 'promote') {
      payload.succession = {
        mode: 'promote',
        promoteeId: promotee,
        newClassification: effectivePromoteeClass,
      };
    } else if (hasReports && succession === 'reassign') {
      payload.succession = { mode: 'reassign', newLeadId: reassignTo };
    } else {
      payload.succession = { mode: 'orphan' };
    }
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg max-h-[calc(100vh-2rem)] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Deactivate from roster</h3>
            <p className="text-xs text-gray-500 mt-0.5">{person.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>This person will no longer appear on timesheets generated after the effective date. Historical data is preserved.</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective end date</label>
              <input
                type="date"
                value={effDate}
                onChange={(e) => setEffDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Reason <span className="text-gray-400 font-normal">(optional)</span></label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              >
                <option value="">— Select reason —</option>
                {DEACTIVATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* SUCCESSION — only shown when the person has active direct reports */}
          {hasReports && (
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">Succession planning</h4>
                </div>
                <p className="text-xs text-gray-500">
                  {person.name} {isLead ? `leads ${directReports.length} ${directReports.length === 1 ? 'person' : 'people'}` : `has ${directReports.length} direct ${directReports.length === 1 ? 'report' : 'reports'}`}.
                  Decide what happens to the crew on {formatDate(effDate)}.
                </p>
              </div>

              <div className="space-y-2">
                {/* Promote from within */}
                <label className={`block rounded-lg border cursor-pointer transition-colors ${
                  succession === 'promote' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-2 p-3">
                    <input
                      type="radio"
                      checked={succession === 'promote'}
                      onChange={() => setSuccession('promote')}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">Promote from within</span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-px rounded">Recommended</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Pick one of their direct reports to inherit the crew.
                      </div>
                    </div>
                  </div>

                  {succession === 'promote' && (
                    <div className="px-3 pb-3 pt-1 space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Who takes over?</label>
                        <select
                          value={promotee}
                          onChange={(e) => {
                            setPromotee(e.target.value);
                            // reset class suggestion when person changes
                            setPromoteeNewClass('');
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                        >
                          <option value="">— Select successor —</option>
                          {directReports.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.classification})
                            </option>
                          ))}
                        </select>
                      </div>

                      {promotee && (
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Promote to which classification?
                          </label>
                          <select
                            value={effectivePromoteeClass}
                            onChange={(e) => setPromoteeNewClass(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                          >
                            {IBEW_CLASSIFICATIONS.filter(c => ['GF', 'FM', 'JL'].includes(c.code)).map(c => (
                              <option key={c.code} value={c.code}>
                                {c.label} ({c.code})
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Defaults to {getClassLabel(person.classification)} (matching {person.name.split(' ')[0]}'s current role).
                          </p>
                        </div>
                      )}

                      {promotee && promoteeOldClass !== effectivePromoteeClass && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-xs">
                          <span className="text-emerald-800">
                            {promoteeObj.name}: {getClassLabel(promoteeOldClass)} → {getClassLabel(effectivePromoteeClass)}
                          </span>
                        </div>
                      )}

                      {promotee && (
                        <div className="bg-gray-50 border border-gray-200 rounded p-2 text-[11px] text-gray-600 flex items-start gap-1.5">
                          <AlertCircle size={11} className="mt-0.5 flex-shrink-0 text-gray-400" />
                          <span>
                            {directReports.length - 1 > 0
                              ? `The other ${directReports.length - 1} ${directReports.length - 1 === 1 ? 'person' : 'people'} will now report to ${promoteeObj?.name.split(' ')[0]}.`
                              : `${promoteeObj?.name.split(' ')[0]} will take ${person.name.split(' ')[0]}'s position in the hierarchy.`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </label>

                {/* Reassign to existing lead */}
                <label className={`block rounded-lg border cursor-pointer transition-colors ${
                  succession === 'reassign' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-2 p-3">
                    <input
                      type="radio"
                      checked={succession === 'reassign'}
                      onChange={() => setSuccession('reassign')}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Reassign to another lead</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Move the whole crew under an existing GF or Foreman.
                      </div>
                    </div>
                  </div>

                  {succession === 'reassign' && (
                    <div className="px-3 pb-3 pt-1">
                      <select
                        value={reassignTo}
                        onChange={(e) => setReassignTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                      >
                        <option value="">— Select new supervisor —</option>
                        {reassignCandidates.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.classification})
                          </option>
                        ))}
                      </select>
                      {reassignCandidates.length === 0 && (
                        <p className="text-[11px] text-amber-700 mt-1">
                          No eligible supervisors available. Try another option.
                        </p>
                      )}
                    </div>
                  )}
                </label>

                {/* Orphan (deferred) */}
                <label className={`block rounded-lg border cursor-pointer transition-colors ${
                  succession === 'orphan' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-2 p-3">
                    <input
                      type="radio"
                      checked={succession === 'orphan'}
                      onChange={() => setSuccession('orphan')}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Handle later</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Crew members become orphans needing reassignment. A warning appears on each row.
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MOVE CREW DIALOG
// ============================================================================

function MoveCrewDialog({ open, person, personnel, onClose, onSave }) {
  const [newLead, setNewLead] = useState('');
  const [effDate, setEffDate] = useState(today());
  const [moveScope, setMoveScope] = useState('person'); // 'person' | 'crew'

  React.useEffect(() => {
    if (person) {
      setNewLead('');
      setEffDate(today());
      setMoveScope('person');
    }
  }, [person]);

  if (!open || !person) return null;

  // Find all descendants of this person (can't move under them — would create cycle)
  const getDescendants = (id, list) => {
    const direct = personnel.filter(p => p.crewLead === id);
    let all = [...direct];
    direct.forEach(d => { all = [...all, ...getDescendants(d.id, list)]; });
    return all;
  };
  const descendants = getDescendants(person.id, personnel);
  const excludedIds = new Set([person.id, ...descendants.map(d => d.id)]);

  const currentLead = personnel.find(p => p.id === person.crewLead);
  const directReports = personnel.filter(p => p.crewLead === person.id && !p.activeEndDate);
  const hasReports = directReports.length > 0;
  const isLead = ['GF', 'FM'].includes(person.classification);

  // Eligible new leads: active, GF or FM, not self, not a descendant
  const eligibleLeads = personnel.filter(p =>
    !p.activeEndDate &&
    ['GF', 'FM'].includes(p.classification) &&
    !excludedIds.has(p.id)
  );

  // Special "top of hierarchy" option only for leads
  const canGoToTop = isLead;

  const newLeadObj = personnel.find(p => p.id === newLead);
  const isValidChoice = newLead === 'TOP' || !!newLeadObj;
  const isActualChange = newLead !== '' && (
    (newLead === 'TOP' && person.crewLead !== null) ||
    (newLead !== 'TOP' && newLead !== person.crewLead)
  );

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Move to different crew</h3>
            <p className="text-xs text-gray-500 mt-0.5">{person.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Current crew context */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Currently reports to</div>
            <div className="text-sm font-medium text-gray-900">
              {currentLead ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-medium">
                    {currentLead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span>{currentLead.name}</span>
                  <ClassBadge code={currentLead.classification} />
                </div>
              ) : (
                <span className="text-gray-400 italic">Top of hierarchy</span>
              )}
            </div>
          </div>

          {/* If person has reports, ask about scope */}
          {hasReports && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Move scope</label>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2 flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-700 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800">
                  <strong>{person.name}</strong> currently leads {directReports.length} {directReports.length === 1 ? 'person' : 'people'}.
                  Decide what happens to them.
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  moveScope === 'person' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    checked={moveScope === 'person'}
                    onChange={() => setMoveScope('person')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Move only {person.name.split(' ')[0]}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Their {directReports.length} direct {directReports.length === 1 ? 'report stays' : 'reports stay'} on the current crew without a lead — you'll need to reassign them separately.
                    </div>
                  </div>
                </label>
                <label className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  moveScope === 'crew' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    checked={moveScope === 'crew'}
                    onChange={() => setMoveScope('crew')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Move {person.name.split(' ')[0]}'s entire crew</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {person.name} keeps {directReports.length === 1 ? 'their report' : 'all reports'} and the whole group moves together.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* New lead selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              {hasReports && moveScope === 'crew' ? 'New supervisor for the crew' : 'New supervisor'}
            </label>
            <select
              value={newLead}
              onChange={(e) => setNewLead(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              <option value="">— Select supervisor —</option>
              {canGoToTop && <option value="TOP">— Top of hierarchy (no supervisor) —</option>}
              {eligibleLeads.map(p => (
                <option key={p.id} value={p.id} disabled={p.id === person.crewLead}>
                  {p.name} ({p.classification}){p.id === person.crewLead ? ' — current supervisor' : ''}
                </option>
              ))}
            </select>
            {descendants.length > 0 && (
              <p className="text-[11px] text-gray-500 mt-1.5 flex items-start gap-1.5">
                <AlertCircle size={11} className="mt-0.5 flex-shrink-0 text-gray-400" />
                {descendants.length} {descendants.length === 1 ? 'person is' : 'people are'} hidden from this list because they report up through {person.name.split(' ')[0]}.
              </p>
            )}
          </div>

          {/* Effective date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective date</label>
            <input
              type="date"
              value={effDate}
              onChange={(e) => setEffDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
            <p className="text-[11px] text-gray-500 mt-1.5">
              Timesheets generated on or after this date will show the new crew assignment.
            </p>
          </div>

          {/* Preview */}
          {isActualChange && isValidChoice && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
              <div className="text-[11px] font-medium text-violet-700 uppercase tracking-wide mb-2">Preview</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="text-gray-500 line-through truncate">
                    {currentLead ? currentLead.name : 'Top of hierarchy'}
                  </span>
                </div>
                <MoveRight size={14} className="text-violet-600 flex-shrink-0" />
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="font-medium text-violet-800 truncate">
                    {newLead === 'TOP' ? 'Top of hierarchy' : newLeadObj?.name}
                  </span>
                </div>
              </div>
              {hasReports && moveScope === 'crew' && (
                <div className="mt-2 pt-2 border-t border-violet-200 text-xs text-violet-700">
                  Moving {person.name.split(' ')[0]} + {directReports.length} direct {directReports.length === 1 ? 'report' : 'reports'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => {
              const target = newLead === 'TOP' ? null : newLead;
              onSave(person.id, target, effDate, moveScope === 'crew');
              onClose();
            }}
            disabled={!isActualChange || !isValidChoice}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// REACTIVATE DIALOG
// ============================================================================

function ReactivateDialog({ open, person, personnel, onClose, onSave }) {
  const [startDate, setStartDate] = useState(today());
  const [classification, setClassification] = useState('');
  const [crewLead, setCrewLead] = useState('');
  const [note, setNote] = useState('');

  // Check if old lead is still active
  const previousLead = person ? personnel.find(p => p.id === person.crewLead) : null;
  const previousLeadStillActive = previousLead && !previousLead.activeEndDate;

  React.useEffect(() => {
    if (person) {
      setStartDate(today());
      setClassification(person.classification);
      // Prefill supervisor only if old lead is still active
      setCrewLead(previousLeadStillActive ? person.crewLead : '');
      setNote('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person]);

  if (!open || !person) return null;

  const activePersonnel = personnel.filter(p => !p.activeEndDate);
  const possibleLeads = activePersonnel.filter(p => ['GF', 'FM'].includes(p.classification) && p.id !== person.id);
  const isLead = ['GF', 'FM'].includes(classification);
  const gapDays = Math.ceil((new Date(startDate) - new Date(person.activeEndDate)) / (1000 * 60 * 60 * 24));
  const prevClassLabel = getClassLabel(person.classification);
  const newClassLabel = getClassLabel(classification);
  const classChanged = classification !== person.classification;

  const canSave = classification && (isLead || crewLead);

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reactivate to roster</h3>
            <p className="text-xs text-gray-500 mt-0.5">{person.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Last stint summary */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-1.5">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Previous stint</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {formatDate(person.activeStartDate)} → {formatDate(person.activeEndDate)}
              </span>
              <span className="text-xs text-gray-500">
                {gapDays > 0 ? `${gapDays} days ago` : 'just left'}
              </span>
            </div>
            {person.deactivationReason && (
              <div className="text-xs text-gray-500">
                Reason: {person.deactivationReason}
              </div>
            )}
          </div>

          {/* Start date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective start date</label>
            <input
              type="date"
              value={startDate}
              min={person.activeEndDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              {gapDays > 1
                ? `${gapDays - 1} day gap between stints. Timesheets in that window will continue to exclude ${person.name.split(' ')[0]}.`
                : 'Will appear on timesheets generated from this date forward.'}
            </p>
          </div>

          {/* Classification */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Classification
            </label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              {IBEW_CLASSIFICATIONS.map(c => (
                <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
              ))}
            </select>
            {classChanged && (
              <div className="mt-1.5 bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800 flex items-start gap-1.5">
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Classification change from <strong>{prevClassLabel}</strong> to <strong>{newClassLabel}</strong> will be logged as a promotion/reclassification on {formatDateShort(startDate)}.</span>
              </div>
            )}
          </div>

          {/* Supervisor */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Reports to {isLead ? '(optional for leads)' : ''}
            </label>
            {!previousLeadStillActive && previousLead && (
              <div className="mb-1.5 bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800 flex items-start gap-1.5">
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Previous supervisor <strong>{previousLead.name}</strong> is no longer on the project. Select a new supervisor.</span>
              </div>
            )}
            <select
              value={crewLead}
              onChange={(e) => setCrewLead(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              <option value="">— {isLead ? 'Top of hierarchy' : 'Select supervisor'} —</option>
              {possibleLeads.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.classification}){p.id === person.crewLead ? ' — previous supervisor' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Optional note */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Called back for additional crews"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(person.id, {
                startDate,
                classification,
                crewLead: crewLead || null,
                note,
                classChanged,
                previousClassification: person.classification,
              });
              onClose();
            }}
            disabled={!canSave}
            className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reactivate
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LINK USER DIALOG
// ============================================================================

function LinkUserDialog({ open, person, personnel, onClose, onSave }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    if (person) {
      setSelectedUserId(person.userId || '');
      setQuery('');
    }
  }, [person]);

  if (!open || !person) return null;

  // Already linked user IDs across ALL personnel (excluding this person) —
  // can't link the same user to two roster entries on the same project
  const otherLinkedIds = new Set(
    personnel.filter(p => p.id !== person.id && p.userId).map(p => p.userId)
  );

  const q = query.trim().toLowerCase();
  const results = GRIDBASE_USERS
    .filter(u => {
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    })
    .slice(0, 8);

  const isEditing = !!person.userId;
  const selectedUser = getUser(selectedUserId);
  const canSave = selectedUserId && selectedUserId !== person.userId;

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {isEditing ? 'Edit Gridbase link' : 'Link to Gridbase user'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{person.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 flex items-start gap-2">
            <AlertCircle size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
            <span>
              Linking a roster entry to a Gridbase user grants them visibility to this project
              when they log in. Users are managed in Settings — if the person doesn't have an
              account yet, create it there first.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Search Gridbase users</label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                autoFocus
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-gray-500">
                No users match. Add them in Settings, then come back.
              </div>
            ) : (
              results.map(u => {
                const alreadyLinkedElsewhere = otherLinkedIds.has(u.id);
                const isSelected = selectedUserId === u.id;
                const isCurrent = person.userId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => !alreadyLinkedElsewhere && setSelectedUserId(u.id)}
                    disabled={alreadyLinkedElsewhere}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-b border-gray-100 last:border-0 transition-colors ${
                      alreadyLinkedElsewhere
                        ? 'opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-50 hover:bg-emerald-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                      <div className="text-xs text-gray-500 truncate">{u.email}</div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-px rounded flex-shrink-0">
                        Currently linked
                      </span>
                    )}
                    {alreadyLinkedElsewhere && (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-px rounded flex-shrink-0">
                        Linked to another
                      </span>
                    )}
                    {isSelected && !isCurrent && (
                      <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {isEditing && selectedUserId === '' && (
            <div className="text-xs text-gray-500">
              To remove the link entirely, use the Unlink option below.
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-between">
          <div>
            {isEditing && (
              <button
                onClick={() => { onSave(person.id, null); onClose(); }}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center gap-1.5"
              >
                <Unlink size={13} /> Unlink
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button
              onClick={() => { onSave(person.id, selectedUserId); onClose(); }}
              disabled={!canSave}
              className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Save link' : 'Link user'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HISTORY DRAWER
// ============================================================================

function HistoryDrawer({ open, person, personnel, onClose, onEdit }) {
  if (!open || !person) return null;

  const lead = personnel.find(p => p.id === person.crewLead);
  const reports = personnel.filter(p => p.crewLead === person.id);

  // Compute stints from history — each 'added'/'reactivated' starts a stint,
  // each 'deactivated' ends it. Sort by date to be safe.
  const computeStints = () => {
    const sorted = [...person.history].sort((a, b) => a.date.localeCompare(b.date));
    const stints = [];
    let current = null;
    sorted.forEach(e => {
      if (e.type === 'added' || e.type === 'reactivated') {
        current = { start: e.date, end: null };
        stints.push(current);
      } else if (e.type === 'deactivated' && current) {
        current.end = e.date;
      }
    });
    return stints;
  };
  const stints = computeStints();
  const hasMultipleStints = stints.length > 1;

  const eventIcon = (type) => {
    switch (type) {
      case 'added': return <UserPlus size={12} />;
      case 'reactivated': return <UserPlus size={12} />;
      case 'classification': return <Briefcase size={12} />;
      case 'deactivated': return <UserMinus size={12} />;
      case 'crew': return <Shuffle size={12} />;
      case 'link': return <Link2 size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const eventColor = (type) => {
    switch (type) {
      case 'added': return 'bg-emerald-100 text-emerald-700';
      case 'reactivated': return 'bg-emerald-100 text-emerald-700';
      case 'classification': return 'bg-blue-100 text-blue-700';
      case 'deactivated': return 'bg-gray-200 text-gray-600';
      case 'crew': return 'bg-violet-100 text-violet-700';
      case 'link': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 z-40 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
              <StatusPill active={!person.activeEndDate} />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ClassBadge code={person.classification} />
              <span>{getClassLabel(person.classification)}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Reports to</div>
              <div className="text-sm font-medium text-gray-900">
                {lead ? lead.name : <span className="text-gray-400 italic">Top of hierarchy</span>}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Direct reports</div>
              <div className="text-sm font-medium text-gray-900">{reports.length || <span className="text-gray-400 italic">None</span>}</div>
            </div>
          </div>

          {/* Stints */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                {hasMultipleStints ? `Stints on project (${stints.length})` : 'On roster'}
              </div>
            </div>
            <div className="space-y-1">
              {stints.map((s, idx) => {
                const isCurrent = idx === stints.length - 1 && !s.end;
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCurrent ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span className="text-gray-700 tabular-nums">
                      {formatDate(s.start)} → {s.end ? formatDate(s.end) : 'present'}
                    </span>
                    {isCurrent && <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-px rounded">Current</span>}
                  </div>
                );
              })}
            </div>
          </div>
          {person.deactivationReason && person.activeEndDate && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Last deactivation reason</div>
              <div className="text-sm text-gray-700">{person.deactivationReason}</div>
            </div>
          )}

          {/* Gridbase Access */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Gridbase access</div>
              {person.userId && !person.activeEndDate && (
                <button
                  onClick={() => onEdit('editLink', person)}
                  className="text-[11px] font-medium text-gray-500 hover:text-gray-700 inline-flex items-center gap-0.5"
                >
                  <Edit3 size={10} /> Edit
                </button>
              )}
            </div>
            {person.userId ? (
              (() => {
                const u = getUser(person.userId);
                return u ? (
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                        <Mail size={11} className="flex-shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">Linked user not found</div>
                );
              })()
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span>No Gridbase account linked</span>
                </div>
                {!person.activeEndDate && (
                  <button
                    onClick={() => onEdit('link', person)}
                    className="text-xs font-medium text-gray-700 hover:text-gray-900 inline-flex items-center gap-1"
                  >
                    <Link2 size={11} /> Link to user
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <History size={14} className="text-gray-500" />
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Activity history</h4>
          </div>
          <div className="space-y-0">
            {[...person.history].reverse().map((event, idx) => (
              <div key={idx} className="flex gap-3 relative">
                {idx < person.history.length - 1 && (
                  <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-200" />
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${eventColor(event.type)}`}>
                  {eventIcon(event.type)}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm text-gray-900">{event.details}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatDate(event.date)} · {event.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!person.activeEndDate && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => onEdit('classification', person)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Briefcase size={14} /> Change classification
              </button>
              <button
                onClick={() => onEdit('move', person)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Shuffle size={14} /> Move crew
              </button>
            </div>
            <button
              onClick={() => onEdit('deactivate', person)}
              className="w-full px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-gray-200 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1.5"
            >
              <UserMinus size={14} /> Deactivate
            </button>
          </div>
        )}
        {person.activeEndDate && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => onEdit('reactivate', person)}
              className="w-full px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5"
            >
              <UserPlus size={14} /> Reactivate to roster
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PERSONNEL TABLE (with crew hierarchy)
// ============================================================================

function SortableHeader({ col, label, sortBy, sortDir, onSort, active, align = 'left', className = '' }) {
  const isSorted = active && sortBy === col;
  const thAlign = align === 'right' ? 'text-right' : 'text-left';

  if (!active) {
    return (
      <th className={`text-xs font-medium text-gray-500 px-3 py-2.5 ${thAlign} ${className}`}>
        {label}
      </th>
    );
  }

  return (
    <th className={`text-xs font-medium text-gray-500 px-3 py-2.5 ${thAlign} ${className}`}>
      <button
        onClick={() => onSort(col)}
        className={`inline-flex items-center gap-1 hover:text-gray-900 transition-colors ${
          isSorted ? 'text-gray-900' : ''
        }`}
      >
        {label}
        {isSorted ? (
          sortDir === 'asc' ? <ChevronDown size={12} className="rotate-180" /> : <ChevronDown size={12} />
        ) : (
          <ArrowUpDown size={11} className="text-gray-300" />
        )}
      </button>
    </th>
  );
}

function PersonnelTable({ personnel, onRowClick, activeFilter, searchTerm, viewMode }) {
  const [expanded, setExpanded] = useState(() => {
    const topLevel = personnel.filter(p => !p.crewLead).map(p => p.id);
    const seconds = personnel.filter(p => topLevel.includes(p.crewLead)).map(p => p.id);
    return new Set([...topLevel, ...seconds]);
  });

  // Sort state for List view
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const toggle = (id) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  // Filter
  const filtered = useMemo(() => {
    let list = personnel;
    if (activeFilter === 'active') list = list.filter(p => !p.activeEndDate);
    if (activeFilter === 'inactive') list = list.filter(p => p.activeEndDate);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(t) ||
        getClassLabel(p.classification).toLowerCase().includes(t) ||
        p.classification.toLowerCase().includes(t)
      );
    }
    return list;
  }, [personnel, activeFilter, searchTerm]);

  // Build rows based on viewMode.
  // - List mode: always flat, sortable by any column
  // - Crew mode: hierarchy (search still flattens, since search beats tree)
  const buildRows = () => {
    // LIST MODE — flat + sortable
    if (viewMode === 'list' || searchTerm) {
      const sorted = filtered.slice().sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        const leadA = personnel.find(x => x.id === a.crewLead);
        const leadB = personnel.find(x => x.id === b.crewLead);
        switch (sortBy) {
          case 'name':
            return dir * a.name.localeCompare(b.name);
          case 'classification':
            return dir * getClassLabel(a.classification).localeCompare(getClassLabel(b.classification));
          case 'reportsTo': {
            const va = leadA ? leadA.name : '';
            const vb = leadB ? leadB.name : '';
            return dir * va.localeCompare(vb);
          }
          case 'start':
            return dir * a.activeStartDate.localeCompare(b.activeStartDate);
          case 'end': {
            const va = a.activeEndDate || '9999-12-31'; // nulls last ascending
            const vb = b.activeEndDate || '9999-12-31';
            return dir * va.localeCompare(vb);
          }
          case 'status': {
            const sa = a.activeEndDate ? 1 : 0;
            const sb = b.activeEndDate ? 1 : 0;
            return dir * (sa - sb);
          }
          default:
            return 0;
        }
      });
      return sorted.map(p => ({
        person: p,
        depth: 0,
        hasChildren: false,
        showLeadBadge: true,
        isGhost: false,
        warnOrphan: false,
      }));
    }

    // CREW MODE — hierarchy with ghosts for context and orphan warnings
    const childrenMap = {};
    personnel.forEach(p => {
      const key = p.crewLead || 'root';
      if (!childrenMap[key]) childrenMap[key] = [];
      childrenMap[key].push(p);
    });

    const matchesFilter = (p) => {
      if (activeFilter === 'active') return !p.activeEndDate;
      if (activeFilter === 'inactive') return !!p.activeEndDate;
      return true;
    };

    const subtreeHasMatch = (personId) => {
      const person = personnel.find(p => p.id === personId);
      if (!person) return false;
      if (matchesFilter(person)) return true;
      const kids = childrenMap[personId] || [];
      return kids.some(k => subtreeHasMatch(k.id));
    };

    const rows = [];
    const walk = (leadId, depth) => {
      const kids = childrenMap[leadId || 'root'] || [];
      const sorted = kids.slice().sort((a, b) => {
        const aLead = ['GF', 'FM'].includes(a.classification) ? 0 : 1;
        const bLead = ['GF', 'FM'].includes(b.classification) ? 0 : 1;
        if (aLead !== bLead) return aLead - bLead;
        return a.name.localeCompare(b.name);
      });

      sorted.forEach(p => {
        const selfMatches = matchesFilter(p);
        const descendantMatches = (childrenMap[p.id] || []).some(k => subtreeHasMatch(k.id));

        // Skip entirely if neither the person nor their subtree has any matches
        if (!selfMatches && !descendantMatches) return;

        // Ghost rows (non-matching people shown for structural context) only
        // apply when filtering to Active — that's when "this inactive lead
        // still has active reports" is the useful signal.
        const allowGhost = activeFilter === 'active';

        // Decide whether to RENDER this node
        const shouldRender = selfMatches || (descendantMatches && allowGhost);
        const isGhost = shouldRender && !selfMatches;

        const lead = personnel.find(x => x.id === p.crewLead);
        const warnOrphan = activeFilter === 'active'
          && !p.activeEndDate
          && lead
          && !!lead.activeEndDate;

        const hasChildren = (childrenMap[p.id] || []).length > 0;

        if (shouldRender) {
          rows.push({
            person: p,
            depth,
            hasChildren,
            showLeadBadge: false,
            isGhost,
            warnOrphan,
          });
        }

        // Walk into children if there are any matching descendants, even if we
        // didn't render this node — matching descendants get promoted up a level.
        if (hasChildren && (shouldRender ? expanded.has(p.id) : true)) {
          walk(p.id, shouldRender ? depth + 1 : depth);
        }
      });
    };

    walk(null, 0);
    return rows;
  };

  const rows = buildRows();

  if (rows.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Users size={24} className="text-gray-400" />
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">No personnel found</div>
        <div className="text-xs text-gray-500">Try adjusting your filters or search.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <SortableHeader col="name" label="Name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={viewMode === 'list'} className="w-[32%]" />
            <SortableHeader col="classification" label="Classification" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={viewMode === 'list'} className="w-[16%]" />
            <SortableHeader col="reportsTo" label="Reports to" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={viewMode === 'list'} className="w-[16%]" />
            <SortableHeader col="start" label="Start" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={viewMode === 'list'} className="w-[11%]" />
            <SortableHeader col="end" label="End" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={viewMode === 'list'} className="w-[11%]" />
            <SortableHeader col="status" label="Status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={viewMode === 'list'} className="w-[14%]" />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ person: p, depth, hasChildren, showLeadBadge, isGhost, warnOrphan }) => {
            const active = !p.activeEndDate;
            const lead = personnel.find(x => x.id === p.crewLead);
            const isLead = ['GF', 'FM'].includes(p.classification);
            // Ghost rows are displayed for structural context and aren't clickable
            const rowOpacity = isGhost ? 'opacity-40' : (!active ? 'opacity-60' : '');
            return (
              <tr
                key={p.id}
                onClick={() => { if (!isGhost) onRowClick(p); }}
                className={`border-b border-gray-100 transition-colors ${
                  isGhost ? 'bg-gray-50/50 cursor-default' : 'hover:bg-gray-50 cursor-pointer'
                } ${rowOpacity}`}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2" style={{ paddingLeft: viewMode === 'list' ? 0 : depth * 20 }}>
                    {viewMode === 'crew' && (
                      hasChildren ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggle(p.id); }}
                          className="-my-1 -ml-1 p-1.5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md flex-shrink-0 transition-colors"
                          aria-label={expanded.has(p.id) ? 'Collapse crew' : 'Expand crew'}
                        >
                          {expanded.has(p.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      ) : (
                        <div className="w-7 flex-shrink-0" />
                      )
                    )}
                    <PersonAvatar name={p.name} isLead={isLead} hasAccess={!!p.userId} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-900 truncate">{p.name}</span>
                        {isGhost && (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1 py-px rounded">
                            Inactive · shown for context
                          </span>
                        )}
                      </div>
                      {showLeadBadge && isLead && (
                        <div className="text-[11px] text-blue-600">{p.classification === 'GF' ? 'General Foreman' : 'Foreman'}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <ClassBadge code={p.classification} />
                    <span className="text-sm text-gray-600 truncate">{getClassLabel(p.classification)}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-600">
                  {lead ? (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate">{lead.name}</span>
                      {warnOrphan && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRowClick(p); }}
                          title={`${lead.name} is inactive — reassign ${p.name.split(' ')[0]} to a new supervisor`}
                          className="flex-shrink-0 text-amber-600 hover:text-amber-700"
                        >
                          <AlertCircle size={13} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-600 tabular-nums">{formatDateShort(p.activeStartDate)}</td>
                <td className="px-3 py-2.5 text-sm text-gray-600 tabular-nums">
                  {p.activeEndDate ? formatDateShort(p.activeEndDate) : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-3 py-2.5">
                  <StatusPill active={active} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// EQUIPMENT TABLE
// ============================================================================

// ============================================================================
// ADD EQUIPMENT DIALOG
// ============================================================================

function AddEquipmentDialog({ open, onClose, onSave, equipment, personnel }) {
  const [mode, setMode] = useState('search'); // 'search' | 'manual'
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedFleetId, setSelectedFleetId] = useState(null);
  const [assignTo, setAssignTo] = useState(''); // '' = yard
  const [startDate, setStartDate] = useState(today());

  // manual entry fields
  const [mUnit, setMUnit] = useState('');
  const [mType, setMType] = useState('Pickup Truck');
  const [mClass, setMClass] = useState('');
  const [mVin, setMVin] = useState('');

  React.useEffect(() => {
    if (open) {
      setMode('search'); setQuery(''); setShowAll(false); setSelectedFleetId(null);
      setAssignTo(''); setStartDate(today());
      setMUnit(''); setMType('Pickup Truck'); setMClass('');
      setMVin('');
    }
  }, [open]);

  // Reset showAll whenever the query changes so "See all" doesn't persist
  // across different searches
  React.useEffect(() => { setShowAll(false); }, [query]);

  if (!open) return null;

  const onProjectFleetIds = new Set(equipment.map(e => e.fleetId).filter(Boolean));
  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;
  const totalAvailable = COMPANY_FLEET.filter(f => !onProjectFleetIds.has(f.id)).length;

  const allMatches = hasQuery
    ? COMPANY_FLEET
        .filter(f => !onProjectFleetIds.has(f.id))
        .filter(f => (
          f.unitNumber.toLowerCase().includes(q) ||
          f.vin.toLowerCase().includes(q) ||
          f.type.toLowerCase().includes(q) ||
          f.internalClass.toLowerCase().includes(q)
        ))
    : [];

  const RESULT_CAP = 10;
  const results = showAll ? allMatches : allMatches.slice(0, RESULT_CAP);
  const hasMoreMatches = allMatches.length > RESULT_CAP;

  const selectedFleet = COMPANY_FLEET.find(f => f.id === selectedFleetId);
  const activeLeads = personnel.filter(p =>
    !p.activeEndDate && ['GF', 'FM'].includes(p.classification)
  );

  const canSaveSearch = !!selectedFleetId && !!startDate;
  const canSaveManual = mUnit.trim() && mType && !!startDate;
  const canSave = mode === 'search' ? canSaveSearch : canSaveManual;

  const handleSave = () => {
    if (mode === 'search' && selectedFleet) {
      onSave({
        fleetId: selectedFleet.id,
        unitNumber: selectedFleet.unitNumber,
        vin: selectedFleet.vin,
        type: selectedFleet.type,
        internalClass: selectedFleet.internalClass,
        source: selectedFleet.source,
        assignedTo: assignTo || null,
        activeStartDate: startDate,
      });
    } else {
      onSave({
        fleetId: null,
        unitNumber: mUnit.trim(),
        vin: mVin.trim(),
        type: mType,
        internalClass: mClass.trim(),
        source: 'Manual',
        assignedTo: assignTo || null,
        activeStartDate: startDate,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg max-h-[calc(100vh-2rem)] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900">Add equipment to project</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Mode toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5 w-fit">
            {[
              { id: 'search', label: 'From company fleet', icon: Search },
              { id: 'manual', label: 'Manual entry', icon: Edit3 },
            ].map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    mode === m.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={12} />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* SEARCH MODE */}
          {mode === 'search' && (
            <>
              {/* If a unit is selected, show only that — no search UI, no list */}
              {selectedFleet ? (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Selected unit</label>
                  <div className="border-2 border-emerald-300 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-emerald-50">
                      <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center flex-shrink-0">
                        <Truck size={14} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 font-mono">{selectedFleet.unitNumber}</div>
                        <div className="text-[11px] text-gray-600 truncate mt-0.5">
                          {getClassificationName(selectedFleet.internalClass, selectedFleet.type)}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono truncate">{selectedFleet.vin}</span>
                          <span>·</span>
                          <span>{selectedFleet.source}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-3 py-2 bg-white border-t border-gray-200 flex items-center justify-end">
                      <button
                        onClick={() => setSelectedFleetId(null)}
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                      >
                        <ChevronLeft size={11} /> Change selection
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Search Motive / Geotab</label>
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Unit #, VIN, type, or class..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                        autoFocus
                      />
                    </div>
                  </div>

              {/* Results panel — three states: pre-search, no-match, matches */}
              {!hasQuery ? (
                <div className="border border-dashed border-gray-200 rounded-lg px-4 py-10 text-center bg-gray-50/50">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Search the fleet</div>
                  <div className="text-xs text-gray-500">
                    <span className="tabular-nums">{totalAvailable}</span> units available. Start typing to find the one you need.
                  </div>
                </div>
              ) : allMatches.length === 0 ? (
                <div className="border border-gray-200 rounded-lg px-4 py-8 text-center">
                  <div className="text-sm font-medium text-gray-900 mb-1">No matches for "{query}"</div>
                  <div className="text-xs text-gray-500 mb-3">This unit may not be in Motive or Geotab yet.</div>
                  <button
                    onClick={() => setMode('manual')}
                    className="text-xs font-medium text-gray-700 hover:text-gray-900 underline"
                  >
                    Add manually instead →
                  </button>
                </div>
              ) : (
                <div>
                  {/* Result count summary */}
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <div className="text-[11px] text-gray-500">
                      {showAll || !hasMoreMatches
                        ? <>Showing <span className="font-medium tabular-nums">{allMatches.length}</span> {allMatches.length === 1 ? 'match' : 'matches'}</>
                        : <>Showing <span className="font-medium tabular-nums">{RESULT_CAP}</span> of <span className="font-medium tabular-nums">{allMatches.length}</span> matches</>
                      }
                    </div>
                    {showAll && hasMoreMatches && (
                      <button
                        onClick={() => setShowAll(false)}
                        className="text-[11px] font-medium text-gray-500 hover:text-gray-700"
                      >
                        Collapse
                      </button>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
                    {results.map(f => {
                      const isSelected = selectedFleetId === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFleetId(f.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-b border-gray-100 last:border-0 transition-colors ${
                            isSelected ? 'bg-emerald-50 hover:bg-emerald-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Truck size={14} className="text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 font-mono">{f.unitNumber}</div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <span className="truncate">{getClassificationName(f.internalClass, f.type)}</span>
                              <span>·</span>
                              <span>{f.source}</span>
                            </div>
                          </div>
                          {isSelected && <Check size={14} className="text-emerald-600 flex-shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {hasMoreMatches && !showAll && (
                    <button
                      onClick={() => setShowAll(true)}
                      className="w-full mt-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      See all {allMatches.length} matches
                    </button>
                  )}
                </div>
              )}
                </>
              )}
            </>
          )}

          {/* MANUAL MODE */}
          {mode === 'manual' && (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 flex items-start gap-2">
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                <span>
                  Use manual entry for equipment not yet in Motive or Geotab. You'll need to sync it
                  with telematics later to auto-track utilization.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Unit #</label>
                  <input
                    type="text"
                    value={mUnit}
                    onChange={(e) => setMUnit(e.target.value)}
                    placeholder="e.g. P-2401"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
                  <select
                    value={mType}
                    onChange={(e) => setMType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  >
                    {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Internal class</label>
                  <input
                    type="text"
                    value={mClass}
                    onChange={(e) => setMClass(e.target.value)}
                    placeholder="e.g. Class 7"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">VIN <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={mVin}
                    onChange={(e) => setMVin(e.target.value.toUpperCase())}
                    placeholder="17 chars"
                    maxLength={17}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                </div>
              </div>
            </>
          )}

          {/* Common: assignment + start date */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Assign to crew</label>
              <select
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              >
                <option value="">— Hold at the Job —</option>
                {activeLeads.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.classification})</option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500 mt-1">
                Equipment can sit at the Job until a crew needs it. You can assign it later from the drawer.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to job
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ASSIGN EQUIPMENT DIALOG
// ============================================================================

function AssignEquipmentDialog({ open, unit, personnel, onClose, onSave }) {
  const [newAssignee, setNewAssignee] = useState('');
  const [effDate, setEffDate] = useState(today());

  React.useEffect(() => {
    if (unit) {
      setNewAssignee('');
      setEffDate(today());
    }
  }, [unit]);

  if (!open || !unit) return null;

  const currentAssignee = personnel.find(p => p.id === unit.assignedTo);
  const activeLeads = personnel.filter(p =>
    !p.activeEndDate && ['GF', 'FM'].includes(p.classification)
  );

  const isActualChange = newAssignee !== '' && (
    (newAssignee === 'YARD' && unit.assignedTo !== null) ||
    (newAssignee !== 'YARD' && newAssignee !== unit.assignedTo)
  );

  const targetLabel = newAssignee === 'YARD'
    ? 'the Job'
    : (personnel.find(p => p.id === newAssignee)?.name || '');

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reassign equipment</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{unit.unitNumber} · {unit.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Currently assigned to</div>
            <div className="text-sm font-medium text-gray-900">
              {currentAssignee ? currentAssignee.name : <span className="text-gray-400 italic">— Job —</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Reassign to</label>
            <select
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              <option value="">— Select destination —</option>
              <option value="YARD">— Return to Job —</option>
              {activeLeads.filter(p => p.id !== unit.assignedTo).map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.classification})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective date</label>
            <input
              type="date"
              value={effDate}
              onChange={(e) => setEffDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
          </div>

          {isActualChange && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
              <div className="text-[11px] font-medium text-violet-700 uppercase tracking-wide mb-2">Preview</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 line-through truncate flex-1">
                  {currentAssignee ? currentAssignee.name : 'Job'}
                </span>
                <MoveRight size={14} className="text-violet-600 flex-shrink-0" />
                <span className="font-medium text-violet-800 truncate flex-1">{targetLabel}</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button
            onClick={() => {
              const target = newAssignee === 'YARD' ? null : newAssignee;
              onSave(unit.id, target, effDate);
              onClose();
            }}
            disabled={!isActualChange}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reassign
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEACTIVATE EQUIPMENT DIALOG
// ============================================================================

function DeactivateEquipmentDialog({ open, unit, onClose, onSave }) {
  const [reason, setReason] = useState('');
  const [effDate, setEffDate] = useState(today());

  React.useEffect(() => {
    if (unit) { setReason(''); setEffDate(today()); }
  }, [unit]);

  if (!open || !unit) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Deactivate equipment</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{unit.unitNumber} · {unit.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>This unit will no longer appear on timesheets or rosters from the effective date. Historical data is preserved.</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective end date</label>
            <input
              type="date"
              value={effDate}
              onChange={(e) => setEffDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Reason <span className="text-gray-400 font-normal">(optional)</span></label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              <option value="">— Select reason —</option>
              {EQUIPMENT_DEACTIVATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button
            onClick={() => { onSave(unit.id, effDate, reason); onClose(); }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// REACTIVATE EQUIPMENT DIALOG
// ============================================================================

function ReactivateEquipmentDialog({ open, unit, personnel, onClose, onSave }) {
  const [startDate, setStartDate] = useState(today());
  const [assignTo, setAssignTo] = useState('');

  React.useEffect(() => {
    if (unit) { setStartDate(today()); setAssignTo(''); }
  }, [unit]);

  if (!open || !unit) return null;

  const activeLeads = personnel.filter(p =>
    !p.activeEndDate && ['GF', 'FM'].includes(p.classification)
  );
  const gapDays = Math.ceil((new Date(startDate) - new Date(unit.activeEndDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reactivate equipment</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{unit.unitNumber} · {unit.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-1">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Previous stint</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {formatDate(unit.activeStartDate)} → {formatDate(unit.activeEndDate)}
              </span>
              <span className="text-xs text-gray-500">{gapDays > 0 ? `${gapDays} days ago` : 'just deactivated'}</span>
            </div>
            {unit.deactivationReason && (
              <div className="text-xs text-gray-500">Reason: {unit.deactivationReason}</div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective start date</label>
            <input
              type="date"
              value={startDate}
              min={unit.activeEndDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Assign to crew</label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              <option value="">— Hold at the Job —</option>
              {activeLeads.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.classification})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button
            onClick={() => { onSave(unit.id, { startDate, assignTo: assignTo || null }); onClose(); }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
          >
            Reactivate
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EQUIPMENT DRAWER
// ============================================================================

function EquipmentDrawer({ open, unit, personnel, onClose, onEdit }) {
  if (!open || !unit) return null;

  const assignee = personnel.find(p => p.id === unit.assignedTo);
  const active = !unit.activeEndDate;

  const computeStints = () => {
    const sorted = [...unit.history].sort((a, b) => a.date.localeCompare(b.date));
    const stints = [];
    let current = null;
    sorted.forEach(e => {
      if (e.type === 'added' || e.type === 'reactivated') {
        current = { start: e.date, end: null };
        stints.push(current);
      } else if (e.type === 'deactivated' && current) {
        current.end = e.date;
      }
    });
    return stints;
  };
  const stints = computeStints();
  const hasMultipleStints = stints.length > 1;

  const eventIcon = (type) => {
    switch (type) {
      case 'added': return <Plus size={12} />;
      case 'reactivated': return <Plus size={12} />;
      case 'assigned': return <Shuffle size={12} />;
      case 'deactivated': return <UserMinus size={12} />;
      default: return <Clock size={12} />;
    }
  };
  const eventColor = (type) => {
    switch (type) {
      case 'added': return 'bg-emerald-100 text-emerald-700';
      case 'reactivated': return 'bg-emerald-100 text-emerald-700';
      case 'assigned': return 'bg-violet-100 text-violet-700';
      case 'deactivated': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 z-40 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900 font-mono">{unit.unitNumber}</h3>
              <StatusPill active={active} />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {unit.internalClass && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border font-mono bg-gray-50 text-gray-600 border-gray-200">
                  {unit.internalClass}
                </span>
              )}
              <span>{unit.type}</span>
              {unit.source && (
                <>
                  <span>·</span>
                  <span>{unit.source}</span>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Assigned to</div>
              <div className="text-sm font-medium text-gray-900">
                {assignee ? assignee.name : <span className="text-gray-400 italic">— Job —</span>}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">VIN</div>
              <div className="text-xs font-mono text-gray-700 truncate">{unit.vin || '—'}</div>
            </div>
          </div>

          {/* Stints */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">
              {hasMultipleStints ? `Stints on project (${stints.length})` : 'On project'}
            </div>
            <div className="space-y-1">
              {stints.map((s, idx) => {
                const isCurrent = idx === stints.length - 1 && !s.end;
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCurrent ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span className="text-gray-700 tabular-nums">
                      {formatDate(s.start)} → {s.end ? formatDate(s.end) : 'present'}
                    </span>
                    {isCurrent && <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-px rounded">Current</span>}
                  </div>
                );
              })}
            </div>
          </div>
          {unit.deactivationReason && unit.activeEndDate && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Last deactivation reason</div>
              <div className="text-sm text-gray-700">{unit.deactivationReason}</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <History size={14} className="text-gray-500" />
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Activity history</h4>
          </div>
          <div className="space-y-0">
            {[...unit.history].reverse().map((event, idx) => (
              <div key={idx} className="flex gap-3 relative">
                {idx < unit.history.length - 1 && (
                  <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-200" />
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${eventColor(event.type)}`}>
                  {eventIcon(event.type)}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm text-gray-900">{event.details}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatDate(event.date)} · {event.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {active && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => onEdit('assign', unit)}
              className="w-full px-3 py-1.5 mb-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Shuffle size={14} /> Reassign
            </button>
            <button
              onClick={() => onEdit('deactivate', unit)}
              className="w-full px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-gray-200 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1.5"
            >
              <UserMinus size={14} /> Deactivate
            </button>
          </div>
        )}
        {!active && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => onEdit('reactivate', unit)}
              className="w-full px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Plus size={14} /> Reactivate to project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EQUIPMENT TABLE
// ============================================================================

function EquipmentTable({ equipment, personnel, onRowClick, activeFilter, searchTerm, viewMode = 'crew' }) {
  const [sortBy, setSortBy] = useState('unitNumber');
  const [sortDir, setSortDir] = useState('asc');

  // Collapsed groups by group key ('job' or a person ID). Default: all expanded.
  // We track COLLAPSED (not expanded) so new crews appear expanded by default
  // without needing to seed the set on each equipment add.
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
  const toggleGroup = (key) => {
    const next = new Set(collapsedGroups);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCollapsedGroups(next);
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  // Filter
  const filtered = useMemo(() => {
    let list = equipment;
    if (activeFilter === 'active') list = list.filter(e => !e.activeEndDate);
    if (activeFilter === 'inactive') list = list.filter(e => e.activeEndDate);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(e =>
        e.unitNumber.toLowerCase().includes(t) ||
        e.type.toLowerCase().includes(t) ||
        (e.vin || '').toLowerCase().includes(t) ||
        (e.internalClass || '').toLowerCase().includes(t)
      );
    }
    return list;
  }, [equipment, activeFilter, searchTerm]);

  // Sort (used for list view and within crew groups)
  const sorted = useMemo(() => {
    const arr = filtered.slice();
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      const getAssigneeName = (x) => {
        const p = personnel.find(pp => pp.id === x.assignedTo);
        return p ? p.name : 'zzz_yard';
      };
      switch (sortBy) {
        case 'unitNumber': return dir * a.unitNumber.localeCompare(b.unitNumber);
        case 'internalClass': return dir * (a.internalClass || '').localeCompare(b.internalClass || '');
        case 'type': return dir * a.type.localeCompare(b.type);
        case 'vin': return dir * (a.vin || '').localeCompare(b.vin || '');
        case 'assignedTo': return dir * getAssigneeName(a).localeCompare(getAssigneeName(b));
        case 'start': return dir * a.activeStartDate.localeCompare(b.activeStartDate);
        case 'end': {
          const va = a.activeEndDate || '9999-12-31';
          const vb = b.activeEndDate || '9999-12-31';
          return dir * va.localeCompare(vb);
        }
        case 'status': {
          const sa = a.activeEndDate ? 1 : 0;
          const sb = b.activeEndDate ? 1 : 0;
          return dir * (sa - sb);
        }
        default: return 0;
      }
    });
    return arr;
  }, [filtered, sortBy, sortDir, personnel]);

  // Group equipment by assignee for crew view.
  // Structure: [{ leadId: null | personId, lead: person | null, units: [] }]
  // Job bucket first, then crew leads in personnel-list order.
  const groupedByCrew = useMemo(() => {
    if (viewMode !== 'crew') return null;

    // Partition
    const jobUnits = [];
    const byLead = new Map();
    filtered.forEach(e => {
      if (!e.assignedTo) {
        jobUnits.push(e);
      } else {
        if (!byLead.has(e.assignedTo)) byLead.set(e.assignedTo, []);
        byLead.get(e.assignedTo).push(e);
      }
    });

    // Sort units within each group by unit number ascending for consistency
    const sortUnits = (arr) => arr.slice().sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));

    const groups = [];
    if (jobUnits.length > 0) {
      groups.push({ leadId: null, lead: null, units: sortUnits(jobUnits) });
    }

    // Order crew groups by each lead's appearance in personnel, preserving
    // the crew hierarchy order the user sees in the personnel table.
    const orderedLeadIds = personnel
      .filter(p => byLead.has(p.id))
      .map(p => p.id);
    orderedLeadIds.forEach(leadId => {
      const lead = personnel.find(p => p.id === leadId);
      groups.push({ leadId, lead, units: sortUnits(byLead.get(leadId)) });
    });

    return groups;
  }, [filtered, personnel, viewMode]);

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
          <Truck size={20} className="text-gray-400" />
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">No equipment found</div>
        <div className="text-xs text-gray-500">
          {searchTerm ? 'Try adjusting your search or filters.' : 'Add trucks and equipment to this project.'}
        </div>
      </div>
    );
  }

  // Render a single equipment row — reused in both views.
  // In crew view, rows sit inside a group (foreman or Job) so we indent them
  // to match the personnel table's indentation pattern.
  const renderRow = (e) => {
    const assignee = personnel.find(p => p.id === e.assignedTo);
    const active = !e.activeEndDate;
    const indentInCrew = viewMode === 'crew';
    return (
      <tr
        key={e.id}
        onClick={() => onRowClick && onRowClick(e)}
        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!active ? 'opacity-60' : ''}`}
      >
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-2" style={{ paddingLeft: indentInCrew ? 20 : 0 }}>
            <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Truck size={13} className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-medium text-gray-900 font-mono">{e.unitNumber}</span>
            </div>
          </div>
        </td>
        <td className="px-3 py-2.5">
          {e.internalClass ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border font-mono bg-gray-50 text-gray-600 border-gray-200">
              {e.internalClass}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">—</span>
          )}
        </td>
        <td className="px-3 py-2.5 text-sm text-gray-700 truncate">{e.type}</td>
        <td className="px-3 py-2.5 text-xs text-gray-500 font-mono truncate">{e.vin || '—'}</td>
        {viewMode === 'list' && (
          <td className="px-3 py-2.5 text-sm text-gray-600">
            {assignee ? (
              <span className="truncate block">{assignee.name}</span>
            ) : (
              <span className="text-gray-400 italic">— Job —</span>
            )}
          </td>
        )}
        <td className="px-3 py-2.5 text-sm text-gray-600 tabular-nums">{formatDateShort(e.activeStartDate)}</td>
        <td className="px-3 py-2.5 text-sm text-gray-600 tabular-nums">
          {e.activeEndDate ? formatDateShort(e.activeEndDate) : <span className="text-gray-400">—</span>}
        </td>
        <td className="px-3 py-2.5"><StatusPill active={active} /></td>
      </tr>
    );
  };

  // Column widths — slightly different in crew vs list view since
  // "Assigned to" column is absent in crew view
  const isList = viewMode === 'list';

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <SortableHeader col="unitNumber" label="Unit #" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={isList} className={isList ? 'w-[12%]' : 'w-[14%]'} />
            <SortableHeader col="internalClass" label="Int. class" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={isList} className={isList ? 'w-[10%]' : 'w-[11%]'} />
            <SortableHeader col="type" label="Type" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={isList} className={isList ? 'w-[15%]' : 'w-[17%]'} />
            <SortableHeader col="vin" label="VIN" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={isList} className={isList ? 'w-[18%]' : 'w-[20%]'} />
            {isList && (
              <SortableHeader col="assignedTo" label="Assigned to" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active className="w-[15%]" />
            )}
            <SortableHeader col="start" label="Start" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={isList} className={isList ? 'w-[9%]' : 'w-[11%]'} />
            <SortableHeader col="end" label="End" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={isList} className={isList ? 'w-[9%]' : 'w-[11%]'} />
            <SortableHeader col="status" label="Status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} active={isList} className={isList ? 'w-[12%]' : 'w-[16%]'} />
          </tr>
        </thead>
        <tbody>
          {viewMode === 'list'
            ? sorted.map(renderRow)
            : groupedByCrew.map(group => {
                const groupKey = group.leadId || 'job';
                const isCollapsed = collapsedGroups.has(groupKey);
                return (
                  <React.Fragment key={groupKey}>
                    {/* Group header row — clickable to toggle collapse */}
                    <tr
                      className="bg-gray-50/60 border-b border-gray-100 hover:bg-gray-100/60 cursor-pointer"
                      onClick={() => toggleGroup(groupKey)}
                    >
                      <td colSpan={7} className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleGroup(groupKey); }}
                            className="-my-1 -ml-1 p-1.5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md flex-shrink-0 transition-colors"
                            aria-label={isCollapsed ? 'Expand crew group' : 'Collapse crew group'}
                          >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                          </button>
                          {group.lead ? (
                            <>
                              <PersonAvatar
                                name={group.lead.name}
                                isLead={['GF', 'FM'].includes(group.lead.classification)}
                                hasAccess={!!group.lead.userId}
                              />
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-gray-900">{group.lead.name}</span>
                                <ClassBadge code={group.lead.classification} />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <Truck size={11} className="text-gray-500" />
                              </div>
                              <span className="text-xs font-semibold text-gray-900 italic">— Job (unassigned) —</span>
                            </>
                          )}
                          <span className="text-xs text-gray-500">· {group.units.length} {group.units.length === 1 ? 'unit' : 'units'}</span>
                        </div>
                      </td>
                    </tr>
                    {!isCollapsed && group.units.map(renderRow)}
                  </React.Fragment>
                );
              })
          }
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// ACTIVITY FEED
// ============================================================================

function ActivityFeed({ activity, open, onClose }) {
  const icon = (action) => {
    switch (action) {
      case 'added': return <UserPlus size={12} className="text-emerald-700" />;
      case 'reactivated': return <UserPlus size={12} className="text-emerald-700" />;
      case 'classification': return <Briefcase size={12} className="text-blue-700" />;
      case 'deactivated': return <UserMinus size={12} className="text-gray-600" />;
      case 'equipment': return <Truck size={12} className="text-gray-600" />;
      case 'crew': return <Shuffle size={12} className="text-violet-700" />;
      case 'link': return <Link2 size={12} className="text-emerald-700" />;
      default: return <Activity size={12} className="text-gray-600" />;
    }
  };

  const bg = (action) => {
    switch (action) {
      case 'added': return 'bg-emerald-100';
      case 'reactivated': return 'bg-emerald-100';
      case 'classification': return 'bg-blue-100';
      case 'deactivated': return 'bg-gray-200';
      case 'equipment': return 'bg-gray-100';
      case 'crew': return 'bg-violet-100';
      case 'link': return 'bg-emerald-100';
      default: return 'bg-gray-100';
    }
  };

  // Group by date
  const grouped = activity.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/40 z-30 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-96 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Activity</h3>
            <span className="text-[11px] text-gray-500">· {activity.length} events</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Object.entries(grouped).map(([date, events]) => (
            <div key={date}>
              <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 sticky top-0">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{formatDate(date)}</div>
              </div>
              {events.map(e => (
                <div key={e.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${bg(e.action)}`}>
                      {icon(e.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-gray-900">
                        <span className="font-medium">{e.personName}</span>{' '}
                        <span className="text-gray-600">{e.details}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                        <span>{e.user}</span>
                        <span>·</span>
                        <span>{e.time}</span>
                        {e.effectiveDate && (
                          <>
                            <span>·</span>
                            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 px-1 py-px rounded border border-blue-200">
                              <Calendar size={9} />
                              eff. {formatDateShort(e.effectiveDate)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================================================
// MAIN
// ============================================================================

export default function ProjectRoster() {
  const [personnel, setPersonnel] = useState(initialPersonnel);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [activity, setActivity] = useState(initialActivity);
  const [activeFilter, setActiveFilter] = useState('active');
  const [viewMode, setViewMode] = useState('crew');
  const [searchTerm, setSearchTerm] = useState('');
  // Equipment-specific filter/search/view state (independent from personnel)
  const [eqFilter, setEqFilter] = useState('active');
  const [eqSearch, setEqSearch] = useState('');
  const [eqViewMode, setEqViewMode] = useState('crew');
  const [addOpen, setAddOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [deactOpen, setDeactOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [linkUserOpen, setLinkUserOpen] = useState(false);
  // Equipment dialogs
  const [addEqOpen, setAddEqOpen] = useState(false);
  const [assignEqOpen, setAssignEqOpen] = useState(false);
  const [deactEqOpen, setDeactEqOpen] = useState(false);
  const [reactEqOpen, setReactEqOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [drawerPerson, setDrawerPerson] = useState(null);
  const [drawerUnit, setDrawerUnit] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (title, body) => {
    setToast({ title, body });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddPerson = (data) => {
    const id = `p${Date.now()}`;
    const lead = personnel.find(p => p.id === data.crewLead);
    const hasLink = !!data.userId;
    const linkSuffix = hasLink ? ' · Linked to Gridbase user' : '';
    const historyDetail = lead
      ? `Added under ${lead.name} as ${getClassLabel(data.classification)}${linkSuffix}`
      : `Added as ${getClassLabel(data.classification)} — top of hierarchy${linkSuffix}`;
    const newP = {
      id,
      name: data.name,
      userId: data.userId || null,
      classification: data.classification,
      crewLead: data.crewLead,
      activeStartDate: data.activeStartDate,
      activeEndDate: null,
      deactivationReason: null,
      history: [{ date: data.activeStartDate, type: 'added', user: 'Cameron Ross', details: historyDetail }],
    };
    setPersonnel([...personnel, newP]);
    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'added',
      personName: data.name,
      details: lead ? `Added to project under ${lead.name}` : 'Added to project — top of hierarchy',
    }, ...activity]);
    showToast('Person added', `${data.name} is now on the roster${hasLink ? ' with Gridbase access' : ''}.`);
  };

  const handleClassChange = (id, newClass, effDate) => {
    const person = personnel.find(p => p.id === id);
    const prevLabel = getClassLabel(person.classification);
    const newLabel = getClassLabel(newClass);
    setPersonnel(personnel.map(p => p.id === id ? {
      ...p,
      classification: newClass,
      history: [...p.history, {
        date: effDate,
        type: 'classification',
        user: 'Cameron Ross',
        details: `Classification changed: ${prevLabel} → ${newLabel}`,
        previous: person.classification,
        next: newClass,
      }],
    } : p));
    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'classification',
      personName: person.name,
      details: `${prevLabel} → ${newLabel}`,
      effectiveDate: effDate,
    }, ...activity]);
    // Keep drawer in sync if open
    if (drawerPerson?.id === id) {
      setDrawerPerson({
        ...drawerPerson,
        classification: newClass,
        history: [...drawerPerson.history, {
          date: effDate,
          type: 'classification',
          user: 'Cameron Ross',
          details: `Classification changed: ${prevLabel} → ${newLabel}`,
        }],
      });
    }
    showToast('Classification updated', `Effective ${formatDateShort(effDate)}. Timesheets before this date use the old classification.`);
  };

  const handleDeactivate = (payload) => {
    const { id, effDate, reason, succession } = payload;
    const person = personnel.find(p => p.id === id);
    const directReports = personnel.filter(p => p.crewLead === id && !p.activeEndDate);

    // Collect all mutations to apply atomically
    const newEvents = []; // { personId, event } — for person.history appends
    const activityEvents = []; // for project-wide activity feed
    let nextPersonnel = personnel;

    // 1) Deactivate the person
    const deactivateDetail = reason ? `Deactivated — ${reason}` : 'Deactivated';
    newEvents.push({ personId: id, event: {
      date: effDate, type: 'deactivated', user: 'Cameron Ross', details: deactivateDetail,
    }});
    activityEvents.push({
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'deactivated',
      personName: person.name,
      details: deactivateDetail,
      effectiveDate: effDate,
    });

    nextPersonnel = nextPersonnel.map(p => p.id === id ? {
      ...p,
      activeEndDate: effDate,
      deactivationReason: reason || null,
    } : p);

    // 2) Apply succession if there are direct reports
    if (directReports.length > 0 && succession) {
      if (succession.mode === 'promote') {
        const promotee = personnel.find(p => p.id === succession.promoteeId);
        const newClass = succession.newClassification;
        const oldClass = promotee.classification;
        const classChanged = newClass !== oldClass;

        // 2a) Promote the successor — classification change + inherit person's crewLead position
        const promoteeEvents = [];
        if (classChanged) {
          promoteeEvents.push({
            date: effDate, type: 'classification', user: 'Cameron Ross',
            details: `Promoted: ${getClassLabel(oldClass)} → ${getClassLabel(newClass)} (succession for ${person.name})`,
          });
          activityEvents.push({
            id: `a${Date.now() + 1}`,
            date: today(),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            user: 'Cameron Ross',
            action: 'classification',
            personName: promotee.name,
            details: `Promoted ${getClassLabel(oldClass)} → ${getClassLabel(newClass)} (succession)`,
            effectiveDate: effDate,
          });
        }
        promoteeEvents.push({
          date: effDate, type: 'crew', user: 'Cameron Ross',
          details: `Inherited ${person.name}'s position (reports to ${
            person.crewLead ? personnel.find(p => p.id === person.crewLead)?.name || 'previous lead' : 'top of hierarchy'
          })`,
        });
        activityEvents.push({
          id: `a${Date.now() + 2}`,
          date: today(),
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          user: 'Cameron Ross',
          action: 'crew',
          personName: promotee.name,
          details: `Succeeded ${person.name} as crew lead`,
          effectiveDate: effDate,
        });

        promoteeEvents.forEach(ev => newEvents.push({ personId: promotee.id, event: ev }));

        // Update promotee: new classification + take over person's position in hierarchy
        nextPersonnel = nextPersonnel.map(p => p.id === promotee.id ? {
          ...p,
          classification: newClass,
          crewLead: person.crewLead, // take the departing person's slot
        } : p);

        // 2b) Reassign the OTHER direct reports (everyone except the promotee) to report to the promotee
        const otherReports = directReports.filter(r => r.id !== promotee.id);
        otherReports.forEach(r => {
          newEvents.push({ personId: r.id, event: {
            date: effDate, type: 'crew', user: 'Cameron Ross',
            details: `Now reports to ${promotee.name} (succession following ${person.name}'s departure)`,
          }});
          nextPersonnel = nextPersonnel.map(p => p.id === r.id ? {
            ...p, crewLead: promotee.id,
          } : p);
        });

      } else if (succession.mode === 'reassign') {
        const newLead = personnel.find(p => p.id === succession.newLeadId);
        directReports.forEach(r => {
          newEvents.push({ personId: r.id, event: {
            date: effDate, type: 'crew', user: 'Cameron Ross',
            details: `Crew reassigned: now reports to ${newLead.name} (following ${person.name}'s departure)`,
          }});
          nextPersonnel = nextPersonnel.map(p => p.id === r.id ? {
            ...p, crewLead: newLead.id,
          } : p);
        });
        activityEvents.push({
          id: `a${Date.now() + 3}`,
          date: today(),
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          user: 'Cameron Ross',
          action: 'crew',
          personName: `${person.name}'s crew`,
          details: `${directReports.length} ${directReports.length === 1 ? 'person' : 'people'} reassigned to ${newLead.name}`,
          effectiveDate: effDate,
        });
      }
      // mode === 'orphan' — do nothing, crewLead pointers remain pointing at a now-inactive person
    }

    // Apply all history events
    nextPersonnel = nextPersonnel.map(p => {
      const myEvents = newEvents.filter(e => e.personId === p.id).map(e => e.event);
      if (myEvents.length === 0) return p;
      return { ...p, history: [...p.history, ...myEvents] };
    });

    setPersonnel(nextPersonnel);
    setActivity([...activityEvents.reverse(), ...activity]);

    // Close drawer & toast
    if (drawerPerson?.id === id) setDrawerPerson(null);
    let toastBody;
    if (directReports.length > 0 && succession?.mode === 'promote') {
      const promotee = personnel.find(p => p.id === succession.promoteeId);
      toastBody = `${person.name} deactivated. ${promotee.name} promoted to ${getClassLabel(succession.newClassification)} and now leads the crew.`;
    } else if (directReports.length > 0 && succession?.mode === 'reassign') {
      const newLead = personnel.find(p => p.id === succession.newLeadId);
      toastBody = `${person.name} deactivated. ${directReports.length} ${directReports.length === 1 ? 'person' : 'people'} now report to ${newLead.name}.`;
    } else {
      toastBody = `${person.name} will not appear on timesheets from ${formatDateShort(effDate)}.`;
    }
    showToast('Person deactivated', toastBody);
  };

  const handleMove = (id, newLeadId, effDate, moveCrew) => {
    const person = personnel.find(p => p.id === id);
    const oldLead = personnel.find(p => p.id === person.crewLead);
    const newLead = personnel.find(p => p.id === newLeadId);
    const fromLabel = oldLead ? oldLead.name : 'Top of hierarchy';
    const toLabel = newLead ? newLead.name : 'Top of hierarchy';
    const detail = `Moved from ${fromLabel} → ${toLabel}`;

    // Always move the person themselves
    let updated = personnel.map(p => p.id === id ? {
      ...p,
      crewLead: newLeadId,
      history: [...p.history, {
        date: effDate,
        type: 'crew',
        user: 'Cameron Ross',
        details: detail,
      }],
    } : p);

    // If moveCrew is false and person had reports, we orphan them (keep them
    // reporting to this person — but since this person now reports to someone
    // new, the chain stays intact. "moveCrew" actually determines whether we
    // let the whole subtree tag along or not. Since we're only changing the
    // pointer of this person, their reports naturally follow unless we break
    // that pointer. The scope choice only matters for the wording; behaviorally
    // reports always follow their lead in a pointer-based tree. For "move only
    // this person", we need to reassign their direct reports to None (orphan)
    // so they stay on the old crew lead's tree. That's the correct semantic.)

    if (!moveCrew) {
      // Person's direct reports now become orphans — they lose their lead
      const directReports = personnel.filter(p => p.crewLead === id && !p.activeEndDate);
      updated = updated.map(p => directReports.find(d => d.id === p.id) ? {
        ...p,
        crewLead: null,
        history: [...p.history, {
          date: effDate,
          type: 'crew',
          user: 'Cameron Ross',
          details: `Lead ${person.name} moved off — needs reassignment`,
        }],
      } : p);
    }

    setPersonnel(updated);

    const activityDetail = moveCrew && (personnel.filter(p => p.crewLead === id && !p.activeEndDate).length > 0)
      ? `${fromLabel} → ${toLabel} (crew of ${personnel.filter(p => p.crewLead === id && !p.activeEndDate).length + 1} moved)`
      : `${fromLabel} → ${toLabel}`;

    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'crew',
      personName: person.name,
      details: activityDetail,
      effectiveDate: effDate,
    }, ...activity]);

    if (drawerPerson?.id === id) {
      setDrawerPerson({
        ...drawerPerson,
        crewLead: newLeadId,
        history: [...drawerPerson.history, {
          date: effDate,
          type: 'crew',
          user: 'Cameron Ross',
          details: detail,
        }],
      });
    }

    showToast('Crew assignment updated', `Effective ${formatDateShort(effDate)}. Timesheets will reflect the new crew from this date.`);
  };

  const handleReactivate = (id, data) => {
    const person = personnel.find(p => p.id === id);
    const newLead = personnel.find(p => p.id === data.crewLead);
    const leadLabel = newLead ? newLead.name : 'Top of hierarchy';

    // Build the reactivation event(s)
    const events = [];
    const reactivationDetail = data.classChanged
      ? `Reactivated to roster as ${getClassLabel(data.classification)} (was ${getClassLabel(data.previousClassification)}) — reports to ${leadLabel}`
      : `Reactivated to roster as ${getClassLabel(data.classification)} — reports to ${leadLabel}`;

    events.push({
      date: data.startDate,
      type: 'reactivated',
      user: 'Cameron Ross',
      details: data.note ? `${reactivationDetail}. Note: ${data.note}` : reactivationDetail,
    });

    setPersonnel(personnel.map(p => p.id === id ? {
      ...p,
      activeStartDate: data.startDate,
      activeEndDate: null,
      deactivationReason: null,
      classification: data.classification,
      crewLead: data.crewLead,
      history: [...p.history, ...events],
    } : p));

    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'reactivated',
      personName: person.name,
      details: data.classChanged
        ? `Reactivated — ${getClassLabel(data.previousClassification)} → ${getClassLabel(data.classification)}, under ${leadLabel}`
        : `Reactivated — ${getClassLabel(data.classification)}, under ${leadLabel}`,
      effectiveDate: data.startDate,
    }, ...activity]);

    // Sync drawer if open
    if (drawerPerson?.id === id) {
      setDrawerPerson({
        ...drawerPerson,
        activeStartDate: data.startDate,
        activeEndDate: null,
        deactivationReason: null,
        classification: data.classification,
        crewLead: data.crewLead,
        history: [...drawerPerson.history, ...events],
      });
    }

    showToast('Person reactivated', `${person.name} is back on the roster effective ${formatDateShort(data.startDate)}.`);
  };

  const handleLinkUser = (personId, newUserId) => {
    const person = personnel.find(p => p.id === personId);
    const oldUserId = person.userId;
    const oldUser = oldUserId ? getUser(oldUserId) : null;
    const newUser = newUserId ? getUser(newUserId) : null;

    let detail;
    let activityDetail;
    if (!oldUser && newUser) {
      detail = `Linked to Gridbase user ${newUser.name} (${newUser.email})`;
      activityDetail = `Linked to Gridbase user ${newUser.name}`;
    } else if (oldUser && !newUser) {
      detail = `Unlinked from Gridbase user ${oldUser.name}`;
      activityDetail = `Unlinked from Gridbase user ${oldUser.name}`;
    } else if (oldUser && newUser) {
      detail = `Re-linked: ${oldUser.name} → ${newUser.name}`;
      activityDetail = `Gridbase link changed: ${oldUser.name} → ${newUser.name}`;
    } else {
      return; // no-op
    }

    const event = {
      date: today(),
      type: 'link',
      user: 'Cameron Ross',
      details: detail,
    };

    setPersonnel(personnel.map(p => p.id === personId ? {
      ...p,
      userId: newUserId,
      history: [...p.history, event],
    } : p));

    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'link',
      personName: person.name,
      details: activityDetail,
    }, ...activity]);

    if (drawerPerson?.id === personId) {
      setDrawerPerson({
        ...drawerPerson,
        userId: newUserId,
        history: [...drawerPerson.history, event],
      });
    }

    const toastTitle = !oldUser && newUser
      ? 'Gridbase user linked'
      : oldUser && !newUser
      ? 'Gridbase user unlinked'
      : 'Gridbase link updated';
    showToast(toastTitle, detail);
  };

  const handleEditFromDrawer = (action, person) => {
    setEditingPerson(person);
    if (action === 'classification') setClassOpen(true);
    if (action === 'deactivate') setDeactOpen(true);
    if (action === 'move') setMoveOpen(true);
    if (action === 'reactivate') setReactivateOpen(true);
    if (action === 'link' || action === 'editLink') setLinkUserOpen(true);
  };

  // =========== EQUIPMENT HANDLERS ===========

  const handleAddEquipment = (data) => {
    const id = `e${Date.now()}`;
    const assignee = personnel.find(p => p.id === data.assignedTo);
    const historyDetail = assignee
      ? `Added to project · assigned to ${assignee.name} crew`
      : 'Added to project · at the Job';
    const newE = {
      id,
      fleetId: data.fleetId,
      unitNumber: data.unitNumber,
      vin: data.vin,
      type: data.type,
      internalClass: data.internalClass,
      source: data.source,
      assignedTo: data.assignedTo,
      activeStartDate: data.activeStartDate,
      activeEndDate: null,
      deactivationReason: null,
      history: [{ date: data.activeStartDate, type: 'added', user: 'Cameron Ross', details: historyDetail }],
    };
    setEquipment([...equipment, newE]);
    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'equipment',
      personName: data.unitNumber,
      details: assignee ? `${data.type} added · assigned to ${assignee.name} crew` : `${data.type} added · held at Job`,
    }, ...activity]);
    showToast('Equipment added', `${data.unitNumber} is now on the project${assignee ? ` with ${assignee.name}` : ' at the Job'}.`);
  };

  const handleAssignEquipment = (id, newAssigneeId, effDate) => {
    const unit = equipment.find(e => e.id === id);
    const oldAssignee = personnel.find(p => p.id === unit.assignedTo);
    const newAssignee = personnel.find(p => p.id === newAssigneeId);
    const fromLabel = oldAssignee ? oldAssignee.name : 'Job';
    const toLabel = newAssignee ? newAssignee.name : 'Job';
    const detail = `Reassigned: ${fromLabel} → ${toLabel}`;
    const event = { date: effDate, type: 'assigned', user: 'Cameron Ross', details: detail };

    setEquipment(equipment.map(e => e.id === id ? {
      ...e,
      assignedTo: newAssigneeId,
      history: [...e.history, event],
    } : e));
    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'equipment',
      personName: unit.unitNumber,
      details: detail,
      effectiveDate: effDate,
    }, ...activity]);
    if (drawerUnit?.id === id) {
      setDrawerUnit({ ...drawerUnit, assignedTo: newAssigneeId, history: [...drawerUnit.history, event] });
    }
    showToast('Equipment reassigned', `${unit.unitNumber} now with ${toLabel} effective ${formatDateShort(effDate)}.`);
  };

  const handleDeactivateEquipment = (id, effDate, reason) => {
    const unit = equipment.find(e => e.id === id);
    const detail = reason ? `Deactivated — ${reason}` : 'Deactivated';
    const event = { date: effDate, type: 'deactivated', user: 'Cameron Ross', details: detail };
    setEquipment(equipment.map(e => e.id === id ? {
      ...e,
      activeEndDate: effDate,
      deactivationReason: reason || null,
      history: [...e.history, event],
    } : e));
    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'equipment',
      personName: unit.unitNumber,
      details: detail,
      effectiveDate: effDate,
    }, ...activity]);
    if (drawerUnit?.id === id) setDrawerUnit(null);
    showToast('Equipment deactivated', `${unit.unitNumber} deactivated from project effective ${formatDateShort(effDate)}.`);
  };

  const handleReactivateEquipment = (id, data) => {
    const unit = equipment.find(e => e.id === id);
    const newAssignee = personnel.find(p => p.id === data.assignTo);
    const detail = newAssignee
      ? `Reactivated · assigned to ${newAssignee.name} crew`
      : 'Reactivated · held at Job';
    const event = { date: data.startDate, type: 'reactivated', user: 'Cameron Ross', details: detail };
    setEquipment(equipment.map(e => e.id === id ? {
      ...e,
      activeStartDate: data.startDate,
      activeEndDate: null,
      deactivationReason: null,
      assignedTo: data.assignTo,
      history: [...e.history, event],
    } : e));
    setActivity([{
      id: `a${Date.now()}`,
      date: today(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      user: 'Cameron Ross',
      action: 'equipment',
      personName: unit.unitNumber,
      details: detail,
      effectiveDate: data.startDate,
    }, ...activity]);
    if (drawerUnit?.id === id) {
      setDrawerUnit({
        ...drawerUnit,
        activeStartDate: data.startDate,
        activeEndDate: null,
        deactivationReason: null,
        assignedTo: data.assignTo,
        history: [...drawerUnit.history, event],
      });
    }
    showToast('Equipment reactivated', `${unit.unitNumber} is back on the project.`);
  };

  const handleEditUnitFromDrawer = (action, unit) => {
    setEditingUnit(unit);
    if (action === 'assign') setAssignEqOpen(true);
    if (action === 'deactivate') setDeactEqOpen(true);
    if (action === 'reactivate') setReactEqOpen(true);
  };

  // Stats
  const activeCount = personnel.filter(p => !p.activeEndDate).length;
  const inactiveCount = personnel.filter(p => p.activeEndDate).length;
  const activeEquipment = equipment.filter(e => !e.activeEndDate).length;
  const crewsCount = personnel.filter(p => !p.activeEndDate && ['GF', 'FM'].includes(p.classification) && personnel.some(x => x.crewLead === p.id && !x.activeEndDate)).length;

  const existingNames = personnel.map(p => p.name);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 pt-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <span>Bluesky</span>
            <ChevronRight size={12} />
            <span>Jobs</span>
            <ChevronRight size={12} />
            <span className="text-gray-900">North District – Batch 12</span>
          </div>
          {/* Title row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">North District – Batch 12</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivityOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg"
              >
                <Activity size={13} />
                Activity
                <span className="ml-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium px-1.5 py-0.5 rounded-full tabular-nums">
                  {activity.length}
                </span>
              </button>
            </div>
          </div>
          {/* Tab bar */}
          <div className="flex items-center gap-6 -mb-px">
            {[
              { id: 'overview', label: 'Overview', disabled: true },
              { id: 'crew', label: 'Crew & Equipment', disabled: false, active: true },
              { id: 'production', label: 'Production', disabled: true },
              { id: 'invoicing', label: 'Invoicing', disabled: true, soon: true },
              { id: 'settings', label: 'Settings', disabled: true, soon: true },
            ].map(tab => {
              if (tab.active) {
                return (
                  <div
                    key={tab.id}
                    className="relative text-sm font-semibold text-gray-900 pb-3 cursor-default"
                  >
                    {tab.label}
                    <div className="absolute left-0 right-0 -bottom-px h-0.5 bg-gray-900" />
                  </div>
                );
              }
              return (
                <div
                  key={tab.id}
                  className="text-sm font-medium text-gray-400 pb-3 cursor-not-allowed flex items-center gap-1.5"
                  aria-disabled="true"
                >
                  {tab.label}
                  {tab.soon && (
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Soon</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="overflow-y-auto">
        <div className="px-6 py-5">
            {/* Stat strip */}
            <div className="grid grid-cols-4 gap-4 mb-5">
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users size={12} className="text-gray-400" />
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Active personnel</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900 tabular-nums">{activeCount}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <UserMinus size={12} className="text-gray-400" />
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Inactive</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900 tabular-nums">{inactiveCount}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <UserCheck size={12} className="text-gray-400" />
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Active crews</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900 tabular-nums">{crewsCount}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wrench size={12} className="text-gray-400" />
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Equipment</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900 tabular-nums">{activeEquipment}</div>
              </div>
            </div>

            {/* Personnel section */}
            <div className="mb-6">
              {/* Floating section header — outside the table card */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">Personnel</h2>
                    <span className="text-xs text-gray-500">{personnel.length} total</span>
                  </div>

                  {/* View toggle (Crew vs List) */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-3">
                    {[
                      { id: 'crew', label: 'Crew', icon: Users },
                      { id: 'list', label: 'List', icon: ArrowUpDown },
                    ].map(v => {
                      const Icon = v.icon;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setViewMode(v.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            viewMode === v.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Icon size={12} />
                          {v.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Status filter */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                    {[
                      { id: 'active', label: `Active (${activeCount})` },
                      { id: 'inactive', label: `Inactive (${inactiveCount})` },
                      { id: 'all', label: `All (${personnel.length})` },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          activeFilter === f.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search personnel..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-56 bg-white"
                    />
                  </div>
                  <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg"
                  >
                    <Plus size={13} /> Add person
                  </button>
                </div>
              </div>

              {/* Search banner — only appears during search */}
              {searchTerm && (
                <div className="px-4 py-2 mb-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center justify-between">
                  <span>Showing flat search results. Clear search to return to crew hierarchy.</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="font-medium hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* Table card */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <PersonnelTable
                  personnel={personnel}
                  onRowClick={setDrawerPerson}
                  activeFilter={activeFilter}
                  searchTerm={searchTerm}
                  viewMode={viewMode}
                />
              </div>
            </div>

            {/* Equipment section */}
            <div className="mb-6">
              {/* Floating section header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">Equipment</h2>
                    <span className="text-xs text-gray-500">{equipment.length} units</span>
                  </div>

                  {/* View toggle (Crew vs List) */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-3">
                    {[
                      { id: 'crew', label: 'Crew', icon: Users },
                      { id: 'list', label: 'List', icon: ArrowUpDown },
                    ].map(v => {
                      const Icon = v.icon;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setEqViewMode(v.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            eqViewMode === v.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Icon size={12} />
                          {v.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Status filter */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                    {(() => {
                      const eqActive = equipment.filter(e => !e.activeEndDate).length;
                      const eqInactive = equipment.filter(e => e.activeEndDate).length;
                      return [
                        { id: 'active', label: `Active (${eqActive})` },
                        { id: 'inactive', label: `Inactive (${eqInactive})` },
                        { id: 'all', label: `All (${equipment.length})` },
                      ];
                    })().map(f => (
                      <button
                        key={f.id}
                        onClick={() => setEqFilter(f.id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          eqFilter === f.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search equipment..."
                      value={eqSearch}
                      onChange={(e) => setEqSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-56 bg-white"
                    />
                  </div>
                  <button
                    onClick={() => setAddEqOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg"
                  >
                    <Plus size={13} /> Add equipment
                  </button>
                </div>
              </div>

              {/* Table card */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <EquipmentTable
                  equipment={equipment}
                  personnel={personnel}
                  onRowClick={setDrawerUnit}
                  activeFilter={eqFilter}
                  searchTerm={eqSearch}
                  viewMode={eqViewMode}
                />
              </div>
            </div>
          </div>
      </div>

      {/* Activity slide-over */}
      <ActivityFeed
        activity={activity}
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
      />

      {/* Dialogs */}
      <AddPersonDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddPerson}
        personnel={personnel}
        existingNames={existingNames}
      />
      <ClassificationDialog
        open={classOpen}
        person={editingPerson}
        onClose={() => { setClassOpen(false); setEditingPerson(null); }}
        onSave={handleClassChange}
      />
      <DeactivateDialog
        open={deactOpen}
        person={editingPerson}
        personnel={personnel}
        onClose={() => { setDeactOpen(false); setEditingPerson(null); }}
        onSave={handleDeactivate}
      />
      <MoveCrewDialog
        open={moveOpen}
        person={editingPerson}
        personnel={personnel}
        onClose={() => { setMoveOpen(false); setEditingPerson(null); }}
        onSave={handleMove}
      />
      <ReactivateDialog
        open={reactivateOpen}
        person={editingPerson}
        personnel={personnel}
        onClose={() => { setReactivateOpen(false); setEditingPerson(null); }}
        onSave={handleReactivate}
      />
      <LinkUserDialog
        open={linkUserOpen}
        person={editingPerson}
        personnel={personnel}
        onClose={() => { setLinkUserOpen(false); setEditingPerson(null); }}
        onSave={handleLinkUser}
      />
      <HistoryDrawer
        open={!!drawerPerson}
        person={drawerPerson}
        personnel={personnel}
        onClose={() => setDrawerPerson(null)}
        onEdit={handleEditFromDrawer}
      />

      {/* Equipment dialogs & drawer */}
      <AddEquipmentDialog
        open={addEqOpen}
        equipment={equipment}
        personnel={personnel}
        onClose={() => setAddEqOpen(false)}
        onSave={handleAddEquipment}
      />
      <AssignEquipmentDialog
        open={assignEqOpen}
        unit={editingUnit}
        personnel={personnel}
        onClose={() => { setAssignEqOpen(false); setEditingUnit(null); }}
        onSave={handleAssignEquipment}
      />
      <DeactivateEquipmentDialog
        open={deactEqOpen}
        unit={editingUnit}
        onClose={() => { setDeactEqOpen(false); setEditingUnit(null); }}
        onSave={handleDeactivateEquipment}
      />
      <ReactivateEquipmentDialog
        open={reactEqOpen}
        unit={editingUnit}
        personnel={personnel}
        onClose={() => { setReactEqOpen(false); setEditingUnit(null); }}
        onSave={handleReactivateEquipment}
      />
      <EquipmentDrawer
        open={!!drawerUnit}
        unit={drawerUnit}
        personnel={personnel}
        onClose={() => setDrawerUnit(null)}
        onEdit={handleEditUnitFromDrawer}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-start gap-3 min-w-[320px] max-w-[420px]">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Check size={12} className="text-emerald-700" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{toast.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{toast.body}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}