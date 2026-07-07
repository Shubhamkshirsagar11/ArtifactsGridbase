// @ts-nocheck
/**
 * RateBookWizard — a faithful port of the design prototype's component logic
 * (originally a `class Component extends DCLogic`). DCLogic is API-compatible
 * with React.Component (same `state` / `setState` / `props`), so the state,
 * instance fields, handlers, and view-model methods port essentially verbatim.
 * `renderVals()` produces the object the template binds against; render() feeds
 * it to the template interpreter. File is @ts-nocheck because this is ported
 * dynamically-typed prototype logic; the typed surface lives in dcRuntime.ts.
 */
import React from 'react'
import { renderTemplate } from './dcRuntime'
import template from './template.html?raw'

export interface RateBookProps {
  accentColor?: string
}

export class RateBookWizard extends React.Component<RateBookProps, any> {
  state = {
    step: 1,
    prices: { labor:true, equipment:true, perdiem:true, delays:true },
    laborStructure: 'both',
    blended: { r: [ { rate:'176.50', code:'LAB-BLD' } ] },
    blendedCovers: { equipment:true, perdiem:false },
    utilNamesLabor: true,
    utilNamesEquip: false,
    laborOptsOpen: false,
    equipOptsOpen: false,
    apprCol: false,
    hoverTip: null,
    clsEdit: null,
    liveFocus: null,
    ddMenu: null,
    demoData: true,
    shell: { customer:'Duke Energy Carolinas', work:'OH Distribution', bookName:'Duke Carolinas 2026 T&E', eff:'Jan 1, 2026', exp:'Dec 31, 2026' },
    shellMenu: null,
    blendedMenu: false,
    coverDialog: null,
    tiers: [
      { key:'st', label:'Straight time', abbr:'ST', on:false, mult:1 },
      { key:'ot', label:'Overtime', abbr:'OT', on:true, mult:1.5 },
      { key:'dt', label:'Double time', abbr:'DT', on:true, mult:2 },
      { key:'ht', label:'Half-time', abbr:'HT', on:true, mult:0.5 },
    ],
    addTier: false,
    tierDraft: { name:'', abbr:'', mult:'' },
    activities: [],
    addActivity: false,
    activityDraft: '',
    regions: [],
    addRegion: false,
    regionDraft: '',
    regionError: '',
    equipDims: { basis:'hour', standby:true, cap:true },
    apprMenu: null,
    blendedAppr: false,
    billing: false,
    workWeekStart: 'Monday',
    kind: 'labor',
    customCats: [
      { name:'Mobilization', style:'list', on:true, approval:false, open:true,
        rows:[ { a:'Mobilization — one way', b:'$1,850.00 each', code:'MOB-OW' } ] },
      { name:'Test', style:'list', on:true, approval:false, open:true, rows:[] },
    ],
    pdMeals: { mode:'included', b:'13.00', l:'15.00', d:'26.00', bCode:'MEAL-B', lCode:'MEAL-L', dCode:'MEAL-D' },
    catTileMenu: null,
    tierRulesOpen: false,
    tierRulesSet: true,
    trDrag: null,
    trBpEdit: null,
    trSnapshot: null,
    holListOpen: false,
    holDraft: '',
    tierRules: {
      dailyOn: true,
      daily: [10, 16],
      weeklyOn: true, weeklyHrs: '40', weeklyTier: 'ot',
      days: { sat:'daily', sun:'dt', hol:'dt' },
      holidays: [
        { name:'New Year\u2019s Day', on:true }, { name:'Memorial Day', on:true }, { name:'Independence Day', on:true },
        { name:'Labor Day', on:true }, { name:'Thanksgiving', on:true }, { name:'Christmas', on:true },
      ],
      typesOn: true,
      types: { standby:'ot', mobilization:'dt', demobilization:'daily', weather:'dt' },
      upOn: true, upTier: 'ht', upHrs: '40',
    },
    catDialog: null,
    renameDialog: null,
    confirmDialog: null,
    open: { labor:true, equipment:true, perdiem:true, delays:true, reimb:true },
    reimb: {
      fuel: { h:'Reimbursed at cost', m:'', doc:'Fuel report', note:'' },
      meals: { h:'Fixed per-meal amounts', m:'', doc:'None', note:'', b:'13.00', l:'15.00', d:'26.00', bCode:'MEAL-B', lCode:'MEAL-L', dCode:'MEAL-D' },
      lodging: { h:'Reimbursed at cost', m:'', doc:'Receipts', note:'when not provided by customer' },
      tolls: { h:'Reimbursed at cost', m:'', doc:'Receipts', note:'tolls only, no admin fees' },
    },
    addRow: { labor:false, equipment:false, delays:false },
    addDrafts: { labor: { cls:'', util:'', cells:{} }, equipment: { type:'', util:'', code:'', cells:{} }, delays: { type:'', code:'', approval:'Customer', pricing:'Labor + equipment', amount:'' } },
    typeMenu: false,
    edit: null,
    labor: [
      { cls:'Working foreman', util:'Foreman - Class A', r:[
        { st:{rate:'104.97',code:'LAB-WF-ST'}, ot:{rate:'100.00',code:'LAB-WF-OT'} },
      ] },
      { cls:'Lineman A', r:[
        { st:{rate:'90.71',code:'LAB-LA-ST'}, ot:{code:'LAB-LA-OT'} },
      ] },
      { cls:'Lineman B', r:[
        { st:{rate:'75.42',code:'LAB-LB-ST'}, ot:{code:'LAB-LB-OT'} },
      ] },
      { cls:'Lineman C', r:[
        { st:{rate:'59.15',code:'LAB-LC-ST'}, ot:{code:'LAB-LC-OT'} },
      ] },
    ],
    ovrConfirm: null,
    equipment: [
      { type:"Bucket truck (55')", code:'EQP-BKT-55', cap:'40', r:[{rate:'42.95',standby:'21.50'}] },
      { type:'Digger derrick', code:'EQP-DGR', cap:'40', r:[{rate:'34.88',standby:'17.45'}] },
      { type:'Pickup truck', code:'EQP-PKP', cap:'45', r:[{rate:'20.66',standby:'10.35'}], billing:{ mode:'operator', operators:['General Foreman'] } },
      { type:'Material trailer', code:'EQP-MTL', cap:'40', r:[{rate:'8.38',standby:'4.20'}] },
      { type:'Pole trailer', code:'EQP-PLT', cap:'40', r:[{rate:'10.28',standby:'5.15'}] },
    ],
    delays: [
      { type:'Customer delay', code:'1615407', approval:'Customer', pricing:'Labor + equipment', amount:'', unit:'hr' },
      { type:'Engineering delay', code:'1615408', approval:'Customer', pricing:'Labor + equipment', amount:'', unit:'hr' },
      { type:'Flagging delay', code:'1624597', approval:'Customer', pricing:'Labor + equipment', amount:'', unit:'hr' },
      { type:'Hot line tag', code:'1615409', approval:'Customer', pricing:'Labor + equipment', amount:'', unit:'hr' },
      { type:'Standby hold', code:'1615410', approval:'Customer', pricing:'Flat rate', amount:'550.00', unit:'hr' },
    ],
    perdiemConfig: {
      'Working foreman': { eligible:true, billed:'135.00', code:'1455340' },
      'Lineman A':       { eligible:true, billed:'135.00', code:'1455341' },
      'Lineman B':       { eligible:true, billed:'135.00', code:'1455342' },
      'Lineman C':       { eligible:true, billed:'135.00', code:'1455343' },
    },
    periods: [ { label:'Jan 1 – Dec 31, 2026', start:'Jan 1, 2026', end:'Dec 31, 2026', status:'Current', data:null } ],
    viewingPeriod: 0,
    periodMenu: null,
    periodSelOpen: false,
    wwSelOpen: false,
    addPeriodOpen: false,
    addPeriod: { start:'Jan 1, 2027', end:'Dec 31, 2027', mode:'copy', pct:'4' },
    addPeriodError: '',
    endEarly: null,
    toast: '',
    woTip: false,
    woBasis: 'fixed',
    equipMenu: null,
    laborMenu: null,
    exc: null,
    woBasisTip: false,
    woRegionTip: false,
  };

  tierDefs = [];
  orgClassifications = ['General Foreman', 'Working foreman', 'Lineman A', 'Lineman B', 'Lineman C', 'Apprentice', 'Groundman'];

  tog(group, key) {
    this.setState(s => ({ [group]: { ...s[group], [key]: !s[group][key] } }));
  }

  equipCatalog = ["Bucket truck (55')", 'Digger derrick', 'Pickup truck', 'Material trailer', 'Pole trailer', 'Crane (30T)', 'Mini excavator', 'Wire puller'];
  addRef = { labor: React.createRef(), equipment: React.createRef(), delays: React.createRef() };

  fmtMoney(v) {
    const n = parseFloat(String(v).replace(/[$,\s]/g, ''));
    if (isNaN(n)) return v ? '$' + v : '';
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  settleLabor(ri) {
    this.setState(st => ({
      labor: st.labor.map((l, j) => (j === ri && l.live && l.cls) ? { ...l, live: false } : l),
      liveFocus: null,
    }));
  }

  settleEquip(ri) {
    this.setState(st => ({
      equipment: st.equipment.map((x, j) => (j === ri && x.live && (x.type || '').trim()) ? { ...x, live: false } : x),
      liveFocus: null,
    }));
  }
  appendEquip() {
    const unc = this.state.equipment.findIndex(x => x.live && !x.type);
    if (unc >= 0) { this.focusAdd('equipment'); return; }
    const r = this.regionAxis().map(() => ({}));
    this.setState(st => ({
      equipment: [...st.equipment.map(x => (x.live && x.type) ? { ...x, live: false } : x), { type:'', util:'', code:'', cap:'', r, live: true }],
      liveFocus: null,
    }));
    this.focusAdd('equipment');
  }

  scrollToPerdiem() {
    this.setState(st => ({ open: { ...st.open, perdiem: true } }));
    setTimeout(() => {
      try {
        const spans = Array.prototype.slice.call(document.querySelectorAll('span'));
        const hdr = spans.find(sp => sp.textContent === 'Per diem' && (sp.getAttribute('style') || '').indexOf('font-weight:700') >= 0 && sp.offsetParent);
        if (!hdr) return;
        let sc = hdr.parentElement;
        while (sc && !(sc.scrollHeight > sc.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
        if (!sc) return;
        sc.scrollTop += hdr.getBoundingClientRect().top - sc.getBoundingClientRect().top - 16;
      } catch (err) {}
    }, 80);
  }

  selEl(props, opts, placeholder) {
    const children = [];
    if (placeholder != null) children.push(React.createElement('option', { key: '__ph', value: '' }, placeholder));
    (opts || []).forEach(o => {
      const v = typeof o === 'string' ? o : o.v;
      const l = typeof o === 'string' ? o : o.label;
      children.push(React.createElement('option', { key: String(v), value: v }, l));
    });
    return React.createElement('select', props, children);
  }

  focusAdd(sec) {
    setTimeout(() => {
      const r = this.addRef && this.addRef[sec];
      if (r && r.current) r.current.focus();
    }, 60);
  }
  focusAddCustom(i) {
    setTimeout(() => {
      const r = this.customAddRefs && this.customAddRefs[i];
      if (r && r.current) r.current.focus();
    }, 60);
  }
  commitAddLabor() {
    const d = this.state.addDrafts.labor;
    const cls = (d.cls || '').trim();
    if (!cls) { this.focusAdd('labor'); return; }
    const regions = this.regionAxis();
    const r = regions.map(() => ({}));
    Object.keys(d.cells || {}).forEach(id => {
      const parts = id.split('|');
      const g = +parts[0], a = parts[1], key = parts[2];
      if (!r[g]) return;
      const dk = a ? a + '·' + key : key;
      const cd = d.cells[id] || {};
      const entry = {};
      if ((cd.rate || '').trim()) entry.rate = cd.rate.trim();
      if ((cd.code || '').trim()) entry.code = cd.code.trim();
      if (Object.keys(entry).length) r[g][dk] = entry;
    });
    this.setState(st => ({
      labor: [...st.labor, { cls, util: (d.util || '').trim(), r }],
      addDrafts: { ...st.addDrafts, labor: { cls:'', util:'', cells:{} } },
      addRow: { ...st.addRow, labor: true },
    }));
    this.focusAdd('labor');
  }
  commitAddEquip() {
    const d = this.state.addDrafts.equipment;
    const type = (d.type || '').trim();
    if (!type) { this.focusAdd('equipment'); return; }
    const regions = this.regionAxis();
    const r = regions.map((rg, g) => {
      const o = {};
      const rv = ((d.cells[g + '|rate'] || {}).v || '').trim(); if (rv) o.rate = rv;
      const sv = ((d.cells[g + '|standby'] || {}).v || '').trim(); if (sv) o.standby = sv;
      return o;
    });
    const cap = ((d.cells['cap'] || {}).v || '').trim();
    this.setState(st => ({
      equipment: [...st.equipment, { type, util: (d.util || '').trim(), code: (d.code || '').trim(), cap, r }],
      addDrafts: { ...st.addDrafts, equipment: { type:'', util:'', code:'', cells:{} } },
      addRow: { ...st.addRow, equipment: true },
    }));
    this.focusAdd('equipment');
  }
  commitAddDelay() {
    const d = this.state.addDrafts.delays;
    const type = (d.type || '').trim();
    if (!type) { this.focusAdd('delays'); return; }
    this.setState(st => ({
      delays: [...st.delays, { type, code: (d.code || '').trim() || '—', approval: d.approval || 'Customer', pricing: d.pricing || 'Labor + equipment', amount: d.pricing === 'Flat rate' ? (d.amount || '').trim() : '', unit:'hr' }],
      addDrafts: { ...st.addDrafts, delays: { type:'', code:'', approval:'Customer', pricing:'Labor + equipment', amount:'' } },
      addRow: { ...st.addRow, delays: true },
    }));
    this.focusAdd('delays');
  }
  commitAddCustom(i) {
    const c = this.state.customCats[i];
    if (!c) return;
    const d = c.draft || {};
    const a = (d.a || '').trim();
    if (!a) { this.focusAddCustom(i); return; }
    this.setState(st => ({
      customCats: st.customCats.map((x, j) => j === i
        ? { ...x, rows: [...x.rows, { a, b: (d.b || '').trim(), code: (d.code || '').trim() }], draft: { a:'', b:'', code:'' }, addOpen: true }
        : x),
    }));
    this.focusAddCustom(i);
  }

  setLaborCell(ri, g, dk, patch) {
    this.setState(st => ({ labor: st.labor.map((l, j) => j === ri
      ? { ...l, r: (l.r || []).map((rg2, g2) => g2 === g ? { ...rg2, [dk]: { ...(rg2[dk] || {}), ...patch } } : rg2) }
      : l) }));
  }
  appendLabor() {
    const unc = this.state.labor.findIndex(l => l.live && !l.cls);
    if (unc >= 0) { this.focusAdd('labor'); return; }
    const r = this.regionAxis().map(() => ({}));
    this.setState(st => ({
      labor: [...st.labor.map(l => (l.live && l.cls) ? { ...l, live: false } : l), { cls:'', util:'', r, live: true }],
      liveFocus: null,
    }));
    this.focusAdd('labor');
  }
  removeLaborRow(ri) {
    this.setState(st => {
      let labor = st.labor.filter((l, j) => j !== ri);
      if (labor.length === 0) labor = [ { cls:'', util:'', r: this.regionAxis().map(() => ({})), live: true } ];
      return { labor, laborMenu: null, edit: null };
    });
  }
  removeEquipRow(ri) {
    this.setState(st => {
      let equipment = st.equipment.filter((x, j) => j !== ri);
      if (equipment.length === 0) equipment = [ { type:'', util:'', code:'', cap:'', r: this.regionAxis().map(() => ({})), live: true } ];
      return { equipment, equipMenu: null, edit: null };
    });
  }
  appendDelay() {
    const unc = this.state.delays.findIndex(d => d.live && !(d.type || '').trim());
    if (unc >= 0) { this.focusAdd('delays'); return; }
    this.setState(st => ({
      delays: [...st.delays.map(d => (d.live && (d.type || '').trim()) ? { ...d, live: false } : d), { type:'', code:'', approval:'Customer', pricing:'Labor + equipment', amount:'', unit:'hr', live: true }],
    }));
    this.focusAdd('delays');
  }
  settleDelay(ri) {
    this.setState(st => ({ delays: st.delays.map((d, j) => (j === ri && d.live && (d.type || '').trim()) ? { ...d, live: false } : d) }));
  }
  removeDelayRow(ri) {
    this.setState(st => ({ delays: st.delays.filter((d, j) => j !== ri), edit: null }));
  }
  appendCustomItem(i) {
    const c = this.state.customCats[i];
    if (!c) return;
    const unc = c.rows.findIndex(r => r.live && !(r.a || '').trim());
    if (unc >= 0) { this.focusAddCustom(i); return; }
    this.setState(st => ({
      customCats: st.customCats.map((x, j) => j === i
        ? { ...x, open: true, rows: [...x.rows.map(r => (r.live && (r.a || '').trim()) ? { ...r, live: false } : r), { a:'', b:'', code:'', live: true }] }
        : x),
    }));
    this.focusAddCustom(i);
  }
  settleCustomItem(i) {
    this.setState(st => ({ customCats: st.customCats.map((x, j) => j === i
      ? { ...x, rows: x.rows.map(r => (r.live && (r.a || '').trim()) ? { ...r, live: false } : r) } : x) }));
  }
  removeCustomItem(i, ri) {
    this.setState(st => ({ customCats: st.customCats.map((x, j) => j === i
      ? { ...x, rows: x.rows.filter((r, m) => m !== ri) } : x) }));
  }
  pruneAll() {
    this.setState(st => {
      let labor = st.labor.filter(l => (l.cls || '').trim());
      if (labor.length === 0) labor = [ { cls:'', util:'', r: this.regionAxis().map(() => ({})), live: true } ];
      return {
        labor,
        equipment: (() => { let e = st.equipment.filter(x => (x.type || '').trim()); if (st.prices.equipment && e.length === 0) e = [ { type:'', util:'', code:'', cap:'', r: this.regionAxis().map(() => ({})), live: true } ]; return e; })(),
        delays: st.delays.filter(x => (x.type || '').trim()).map(x => x.live ? { ...x, live: false } : x),
        customCats: st.customCats.map(c => ({ ...c, rows: c.rows.filter(rr => (rr.a || '').trim()).map(rr => rr.live ? { ...rr, live: false } : rr) })),
        clsEdit: null,
      };
    });
  }

  openShellMenu(key, e) {
    const r = e.currentTarget.getBoundingClientRect();
    let cal = null;
    if (key === 'eff' || key === 'exp') {
      const parsed = new Date(this.state.shell[key] || '');
      cal = isNaN(parsed.getTime()) ? { y: 2026, mo: 0 } : { y: parsed.getFullYear(), mo: parsed.getMonth() };
    }
    this.setState(st => ({ shellMenu: (st.shellMenu && st.shellMenu.key === key) ? null : { key, x: r.left, y: r.bottom + 6, w: r.width, cal } }));
  }

  demoKeys() {
    return ['shell','prices','laborStructure','blended','blendedCovers','labor','equipment','delays','perdiemConfig','customCats',
      'tiers','activities','regions','billing','apprCol','utilNamesLabor','utilNamesEquip','pdMeals','tierRules','tierRulesSet',
      'blendedAppr','equipDims','periods','viewingPeriod','reimb','workWeekStart'];
  }
  emptyConfig() {
    return {
      shell: { customer:'', work:'', bookName:'', eff:'', exp:'' },
      prices: { labor:false, equipment:false, perdiem:false, delays:false },
      laborStructure: 'class',
      blended: { r: [ {} ] },
      blendedCovers: { equipment:false, perdiem:false },
      labor: [ { cls:'', util:'', r: [ {} ], live: true } ], equipment: [ { type:'', util:'', code:'', cap:'', r: [ {} ], live: true } ], delays: [], perdiemConfig: {}, customCats: [],
      tiers: [
        { key:'st', label:'Straight time', abbr:'ST', on:true, mult:1 },
        { key:'ot', label:'Overtime', abbr:'OT', on:true, mult:1.5 },
        { key:'dt', label:'Double time', abbr:'DT', on:false, mult:2 },
        { key:'ht', label:'Half-time', abbr:'HT', on:false, mult:0.5 },
      ],
      activities: [], regions: [],
      billing: false, apprCol: false, utilNamesLabor: false, utilNamesEquip: false,
      pdMeals: { mode:'included', b:'13.00', l:'15.00', d:'26.00', bCode:'MEAL-B', lCode:'MEAL-L', dCode:'MEAL-D' },
      tierRules: {
        dailyOn: true, daily: [10, 16],
        weeklyOn: false, weeklyHrs: '40', weeklyTier: 'ot',
        days: { sat:'daily', sun:'daily', hol:'daily' },
        holidays: [
          { name:'New Year\u2019s Day', on:true }, { name:'Memorial Day', on:true }, { name:'Independence Day', on:true },
          { name:'Labor Day', on:true }, { name:'Thanksgiving', on:true }, { name:'Christmas', on:true },
        ],
        typesOn: true,
        types: { standby:'daily', mobilization:'daily', demobilization:'daily', weather:'daily' },
        upOn: false, upTier: 'ht', upHrs: '40',
      },
      tierRulesSet: false,
      blendedAppr: false,
      equipDims: { basis:'hour', standby:false, cap:false },
      workWeekStart: 'Monday',
      periods: [ { label:'Jan 1 – Dec 31, 2026', start:'Jan 1, 2026', end:'Dec 31, 2026', status:'Current', data:null } ],
      viewingPeriod: 0,
      reimb: {
        fuel: { h:'Reimbursed at cost', m:'', doc:'Receipts', note:'' },
        meals: { h:'Included in per diem', m:'', doc:'None', note:'', b:'13.00', l:'15.00', d:'26.00', bCode:'', lCode:'', dCode:'' },
        lodging: { h:'Reimbursed at cost', m:'', doc:'Receipts', note:'' },
        tolls: { h:'Reimbursed at cost', m:'', doc:'Receipts', note:'' },
      },
    };
  }

  menuPosStyle(m, w) {
    return { position:'fixed', top: (m ? m.y : 0) + 'px', left: (m ? Math.max(8, m.x - w) : 0) + 'px', width: w + 'px',
      background:'#fff', border:'1px solid #E4E6EA', borderRadius:'10px', boxShadow:'0 10px 28px rgba(20,24,31,.13)',
      padding:'5px', zIndex:60, textAlign:'left', textTransform:'none', letterSpacing:'normal' };
  }

  mkApprCell(on, onClick) {
    return {
      apprOn: !!on,
      apprTrack: { width:'30px', height:'17px', borderRadius:'9px', background: on ? '#EE7B3D' : '#D0D3D9', position:'relative', cursor:'pointer', transition:'background .15s', flexShrink:0 },
      apprKnob: { position:'absolute', top:'2px', left: on ? '15px' : '2px', width:'13px', height:'13px', borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' },
      onAppr: onClick,
    };
  }

  mkCb(checked, disabled) {
    return {
      box: {
        width:'18px', height:'18px', borderRadius:'4px', flex:'0 0 auto',
        display:'flex', alignItems:'center', justifyContent:'center',
        border: checked ? '1px solid #1B2130' : '1px solid #CFD2D8',
        background: checked ? '#1B2130' : '#fff',
        opacity: disabled ? 0.45 : 1,
        transition:'all .12s',
      },
      check: { display: checked ? 'block' : 'none' },
    };
  }

  selTiers() { return this.state.tiers.filter(t => t.on); }

  regionAxis() {
    const rs = this.state.regions;
    if (rs.length < 2) return [{ name: rs.length ? rs[0].name : null, sfx:'' }];
    return rs.map(r => ({ name: r.name, sfx: '-' + ((r.name || '').split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 3) || 'R') }));
  }
  regionCount() { return Math.max(this.state.regions.length, 1); }
  eqUnit() { return { hour:'hr', day:'day', week:'wk' }[this.state.equipDims.basis]; }

  removeCat(i) {
    const cats = this.state.customCats;
    const c = cats[i];
    const ref = cats.find((x, j) => j !== i && x.style === 'percent' && x.pctOf === c.name);
    if (ref) {
      this.setState({ confirmDialog: {
        title: 'Can\u2019t remove ' + c.name,
        body: ref.name + ' is calculated from this category. Remove or repoint ' + ref.name + ' first.',
        confirmLabel: 'OK', noCancel: true,
      } });
      return;
    }
    const n = c.rows.length;
    const doRemove = () => this.setState(st => ({ customCats: st.customCats.filter((x, j) => j !== i), confirmDialog: null }));
    if (n > 0) {
      this.setState({ confirmDialog: {
        title: 'Remove ' + c.name + '?',
        body: 'Its ' + n + ' rate ' + (n === 1 ? 'entry' : 'entries') + ' will be deleted from this book.',
        confirmLabel: 'Remove', onConfirm: doRemove,
      } });
      return;
    }
    doRemove();
  }

  removeRegion(i) {
    const s = this.state;
    const hasRates =
      s.labor.some(l => { const rg = (l.r || [])[i]; return rg && Object.keys(rg).some(k => rg[k] && rg[k].rate); }) ||
      !!(((s.blended.r || [])[i] || {}).rate) ||
      s.equipment.some(eq => { const rg = (eq.r || [])[i]; return rg && (rg.rate || rg.standby); });
    const doRemove = () => this.applyRemoveRegion(i);
    if (hasRates) {
      this.setState({ confirmDialog: {
        title: 'Remove ' + s.regions[i].name + '?',
        body: 'Its rates will be deleted from every table in this book.',
        confirmLabel: 'Remove', onConfirm: doRemove,
      } });
      return;
    }
    doRemove();
  }
  applyRemoveRegion(i) {
    const cut = (arr) => (arr || []).filter((x, j) => j !== i);
    this.setState(st => ({
      regions: st.regions.filter((x, j) => j !== i),
      labor: st.labor.map(l => ({ ...l, r: cut(l.r) })),
      blended: { r: cut(st.blended.r) },
      equipment: st.equipment.map(eq => ({ ...eq, r: cut(eq.r) })),
      edit: null,
    }));
  }

  packData() {
    const s = this.state;
    return { labor: s.labor, equipment: s.equipment, perdiemConfig: s.perdiemConfig, delays: s.delays, blended: s.blended };
  }
  switchPeriod(to) {
    this.setState(s => {
      if (to === s.viewingPeriod) return { periodMenu:null, periodSelOpen:false };
      const periods = s.periods.map((p, i) => i === s.viewingPeriod ? { ...p, data: this.packData() } : p);
      const d = periods[to].data || this.packData();
      return { periods, viewingPeriod: to, labor: d.labor, equipment: d.equipment, perdiemConfig: d.perdiemConfig, delays: d.delays, blended: d.blended || s.blended, edit:null, periodMenu:null, periodSelOpen:false };
    });
  }
  scaleData(f) {
    const sc = (v) => v ? (Math.round(parseFloat(v) * f * 100) / 100).toFixed(2) : v;
    const s = this.state;
    return {
      labor: s.labor.map(l => ({ ...l, r: (l.r || []).map(rg => {
        const o = {};
        Object.keys(rg).forEach(k => { const c = rg[k] || {}; o[k] = { ...c, rate: sc(c.rate) }; });
        return o;
      }) })),
      equipment: s.equipment.map(eq => ({ ...eq, r: (eq.r || []).map(rg => ({ ...rg, rate: sc(rg.rate), standby: sc(rg.standby) })) })),
      perdiemConfig: Object.fromEntries(Object.entries(s.perdiemConfig).map(([k, c]) => [k, { ...c, billed: sc(c.billed) }])),
      delays: s.delays.map(d => ({ ...d, amount: sc(d.amount) })),
      blended: { r: (s.blended.r || []).map(c => ({ ...c, rate: sc(c.rate) })) },
    };
  }
  blankData() {
    const s = this.state;
    return {
      labor: s.labor.map(l => ({ ...l, r: (l.r || []).map(rg => {
        const o = {};
        Object.keys(rg).forEach(k => { o[k] = { ...(rg[k] || {}), rate:'' }; });
        return o;
      }) })),
      equipment: s.equipment.map(eq => ({ ...eq, cap:'', r: (eq.r || []).map(rg => ({ ...rg, rate:'', standby:'' })) })),
      perdiemConfig: Object.fromEntries(Object.entries(s.perdiemConfig).map(([k, c]) => [k, { ...c, billed:'' }])),
      delays: s.delays.map(d => ({ ...d, amount:'' })),
      blended: { r: (s.blended.r || []).map(c => ({ ...c, rate:'' })) },
    };
  }
  overlapError(start) {
    const cur = this.state.periods.find(p => p.status === 'Current');
    if (!cur) return '';
    const d = new Date(start);
    if (!isNaN(d.getTime()) && d <= new Date(cur.end)) return 'Overlaps the current period (ends ' + cur.end + ').';
    return '';
  }
  showToast(msg) {
    this.setState({ toast: msg });
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this.setState({ toast:'' }), 4500);
  }
  confirmAddPeriod() {
    const f = this.state.addPeriod;
    const err = this.overlapError(f.start);
    if (err) { this.setState({ addPeriodError: err }); return; }
    const pct = parseFloat(f.pct) || 0;
    const data = f.mode === 'copy' ? this.scaleData(1 + pct / 100) : this.blankData();
    const label = f.start.split(',')[0] + ' – ' + f.end;
    const yr = (f.end.match(/\d{4}/) || [''])[0];
    this.setState(s => ({
      periods: [...s.periods, { label, start: f.start, end: f.end, status:'Upcoming', data }],
      addPeriodOpen:false, addPeriodError:'',
    }));
    this.showToast(f.mode === 'copy' ? yr + ' period added — rates copied at +' + f.pct + '%.' : yr + ' period added — blank rates.');
  }
  confirmEndEarly() {
    const ee = this.state.endEarly;
    if (!ee) return;
    this.setState(s => ({
      periods: s.periods.map((p, i) => i === ee.index ? { ...p, end: ee.date, label: p.start.split(',')[0] + ' – ' + ee.date } : p),
      endEarly: null,
    }));
    this.showToast('Period now ends ' + ee.date + ' — the next period starts the following day.');
  }

  effectiveKind() {
    const { kind, prices } = this.state;
    if (prices[kind]) return kind;
    return ['labor','equipment','perdiem','delays'].find(k => prices[k]) || 'labor';
  }

  buildPreview(k) {
    const th = (axis, center) => ({
      textAlign: center ? 'center' : 'left', padding:'11px 16px', fontSize:'11px', fontWeight:600,
      letterSpacing:'.05em', textTransform:'uppercase', color:'#8A8F99',
      background: axis ? '#F3F5F8' : '#FAFAFB',
      borderLeft: center ? '1px solid #EEEFF1' : 'none',
      whiteSpace: center ? 'nowrap' : 'normal',
    });
    const td = (axis) => ({ padding:'14px 16px', background: axis ? '#F6F7F9' : '#fff', verticalAlign:'top', whiteSpace:'nowrap' });
    const mainAxis = { fontSize:'14px', fontWeight:600, color:'#1F2430' };
    const mainRate = { fontSize:'14px', color:'#1F2430' };
    const plain = { fontSize:'14px', color:'#6B7079' };
    const showCode = this.state.billing;
    const s = this.state;
    const one = (label, style, extra) => Object.assign({ label, style, colSpan:1, rowSpan:1 }, extra || {});

    // region axis (applies to labor + equipment)
    const regionList = s.regions.length > 1
      ? this.regionAxis().map(r => ({ label: r.name, sfx: r.sfx }))
      : [null];

    if (k === 'labor' && s.laborStructure === 'blended') {
      const grouped = s.regions.length > 1;
      const headers = [one('Classification', th(true))];
      const cells = [{ main:'Blended rate — all classifications', style: td(true), mainStyle: mainAxis, hasSub:false }];
      (grouped ? regionList : [null]).forEach((r, g) => {
        headers.push(one((r ? r.label + ' · ' : '') + 'Rate', th(false)));
        const c = (s.blended.r || [])[g] || {};
        cells.push({ main: c.rate ? '$' + c.rate : '—', sub: c.code || '', style: td(false), mainStyle: mainRate, hasSub: showCode && !!c.code });
      });
      return { headerRows: [{ cells: headers }], rows: [{ cells }] };
    }
    if (k === 'labor') {
      const tiers = this.selTiers();
      const first = s.labor[0] || {};
      const clsName = first.cls || 'Working foreman';
      const baseKey = tiers.some(t => t.key === 'st') ? 'st' : (tiers[0] ? tiers[0].key : 'st');
      const base = parseFloat(((((first.r || [])[0]) || {})[baseKey] || {}).rate) || 104.97;
      const codePfx = 'LAB-' + ((clsName.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 3)) || 'WF') + '-';
      const tm = (t) => (t.mult != null ? t.mult : 1);
      const actDefs = s.activities.filter(a => a.on).map(a => ({
        label: a.name,
        sfx: '-' + (a.name.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() || 'ACT'),
      }));
      const activityList = actDefs.length ? actDefs : [null];
      const grouped = s.regions.length > 1 || actDefs.length > 0;

      // groups = region × activity
      const groups = [];
      regionList.forEach(r => activityList.forEach(a => {
        const parts = [];
        if (r) parts.push(r.label);
        if (a) parts.push(a.label);
        groups.push({ label: parts.join(' · '), sfx: (r ? r.sfx : '') + (a ? a.sfx : '') });
      }));

      let headerRows;
      if (grouped) {
        const row1 = [one('Classification', th(true), { rowSpan:2 })];
        groups.forEach(g => row1.push(one(g.label, th(false, true), { colSpan: tiers.length })));
        const row2 = [];
        groups.forEach(() => tiers.forEach(t => {
          const m = tm(t);
          row2.push(one(t.abbr + (m !== 1 ? ' · ' + m + '×' : ''), th(false)));
        }));
        headerRows = [{ cells: row1 }, { cells: row2 }];
      } else {
        const row1 = [one('Classification', th(true))];
        tiers.forEach(t => {
          const m = tm(t);
          const nm = t.label === t.abbr ? t.label : t.label + ' (' + t.abbr + ')';
          row1.push(one(nm + (m !== 1 && t.mult != null ? ' · ' + m + '×' : ''), th(false)));
        });
        headerRows = [{ cells: row1 }];
      }

      const cells = [{ main: clsName, style: td(true), mainStyle: mainAxis, hasSub:false }];
      groups.forEach(g => tiers.forEach(t => {
        cells.push({ main:'$' + (base * tm(t)).toFixed(2), sub: codePfx + t.abbr.toUpperCase() + g.sfx, style: td(false), mainStyle: mainRate, hasSub: showCode });
      }));
      return { headerRows, rows:[{ cells }] };
    }

    if (k === 'equipment') {
      const unit = this.eqUnit();
      const eq = s.equipDims;
      const perRegion = 1 + (eq.standby ? 1 : 0);
      const rateCell = (sfx) => ({ main:'$42.95', sub:'EQP-BKT-55' + sfx, style: td(false), mainStyle: mainRate, hasSub: showCode });
      const standbyCell = () => ({ main:'$21.50', style: td(false), mainStyle: mainRate, hasSub:false });
      const capCell = () => ({ main:'40 hrs', style: td(false), mainStyle: plain, hasSub:false });
      if (s.regions.length > 1) {
        const row1 = [one('Equipment type', th(true), { rowSpan:2 })];
        regionList.forEach(r => row1.push(one(r.label, th(false, true), { colSpan: perRegion })));
        if (eq.cap) row1.push(one('Weekly cap (hrs)', th(false), { rowSpan:2 }));
        const row2 = [];
        regionList.forEach(() => {
          row2.push(one('Rate / ' + unit, th(false)));
          if (eq.standby) row2.push(one('Standby / ' + unit, th(false)));
        });
        const cells = [{ main:"Bucket truck (55')", style: td(true), mainStyle: mainAxis, hasSub:false }];
        regionList.forEach(r => {
          cells.push(rateCell(r.sfx));
          if (eq.standby) cells.push(standbyCell());
        });
        if (eq.cap) cells.push(capCell());
        return { headerRows:[{ cells: row1 }, { cells: row2 }], rows:[{ cells }] };
      }
      const hcells = [one('Equipment type', th(true)), one('Rate / ' + unit, th(false))];
      if (eq.standby) hcells.push(one('Standby / ' + unit, th(false)));
      if (eq.cap) hcells.push(one('Weekly cap (hrs)', th(false)));
      const cells = [{ main:"Bucket truck (55')", style: td(true), mainStyle: mainAxis, hasSub:false }, rateCell('')];
      if (eq.standby) cells.push(standbyCell());
      if (eq.cap) cells.push(capCell());
      return { headerRows: [{ cells: hcells }], rows: [{ cells }] };
    }

    if (k === 'perdiem') {
      return {
        headerRows: [{ cells: [one('Classification', th(true)), one('Billed / day', th(false))] }],
        rows: [{ cells: [
          { main:'Working foreman', style: td(true), mainStyle: mainAxis, hasSub:false },
          { main:'$135.00', sub:'1455340', style: td(false), mainStyle: mainRate, hasSub: showCode },
        ]}],
      };
    }

    // delays
    const drow = (type, code, pricing, amount) => ({ cells: [
      { main:type, style: td(true), mainStyle: mainAxis, hasSub:false },
      { main:code, style: td(false), mainStyle: { fontFamily:'ui-monospace,monospace', fontSize:'13px', color:'#6B7079' }, hasSub:false },
      { main:'Customer', style: td(false), mainStyle: plain, hasSub:false },
      { main:pricing, style: td(false), mainStyle: plain, hasSub:false },
      { main:amount, style: td(false), mainStyle: amount === '—' ? { fontSize:'14px', color:'#B9BDC5' } : mainRate, hasSub:false },
    ]});
    return {
      headerRows: [{ cells: [
        one('Delay type', th(true)), one('Code', th(false)), one('Approval', th(false)), one('Pricing', th(false)), one('Amount', th(false)),
      ]}],
      rows: [
        drow('Customer delay', '1615407', 'Labor + equipment', '—'),
        drow('Standby hold', '1615410', 'Flat rate', '$550.00 / hr'),
      ],
    };
  }

  startEdit(sec, row, field, sub, preset) {
    let cur = '';
    if (sec === 'labor') {
      const p = field.split('|');
      const dk = p[1] ? p[1] + '·' + p[2] : p[2];
      cur = ((((this.state.labor[row].r || [])[+p[0]] || {})[dk]) || {})[sub] || '';
    } else if (sec === 'blended') {
      cur = ((this.state.blended.r || [])[+field] || {})[sub] || '';
    } else if (sec === 'equipment') {
      const r = this.state.equipment[row];
      if (field === 'cap') cur = r.cap || '';
      else if (field === 'code') cur = r.code || '';
      else { const p = field.split('|'); cur = ((r.r || [])[+p[0]] || {})[p[1]] || ''; }
    }
    if (!cur && preset) cur = preset;
    this.setState({ edit: { sec, row, field, sub, value: cur }, ovrConfirm: null });
  }
  commitEdit(override) {
    const e = this.state.edit;
    if (!e) return;
    const val = override !== undefined ? override : e.value;
    if (e.sec === 'labor') {
      const p = e.field.split('|'); const g = +p[0];
      const dk = p[1] ? p[1] + '·' + p[2] : p[2];
      this.setState(s => ({ labor: s.labor.map((r,i) => {
        if (i !== e.row) return r;
        const rr = (r.r || []).slice();
        while (rr.length <= g) rr.push({});
        rr[g] = { ...rr[g], [dk]: { ...(rr[g][dk] || { rate:'', code:'' }), [e.sub]: val } };
        return { ...r, r: rr };
      }), edit:null }));
    } else if (e.sec === 'blended') {
      const g = +e.field;
      this.setState(s => {
        const rr = (s.blended.r || []).slice();
        while (rr.length <= g) rr.push({});
        rr[g] = { ...rr[g], [e.sub]: val };
        return { blended: { r: rr }, edit:null };
      });
    } else if (e.sec === 'equipment') {
      this.setState(s => ({ equipment: s.equipment.map((r,i) => {
        if (i !== e.row) return r;
        if (e.field === 'cap') return { ...r, cap: val };
        if (e.field === 'code') return { ...r, code: val };
        const p = e.field.split('|'); const g = +p[0], k = p[1];
        const rr = (r.r || []).slice();
        while (rr.length <= g) rr.push({});
        rr[g] = { ...rr[g], [k]: val };
        return { ...r, r: rr };
      }), edit:null }));
    }
  }

  startPdEdit(row, field) {
    const c = this.state.perdiemConfig[row] || {};
    this.setState({ edit: { sec:'perdiem', row, field, value: (c[field] ?? '') } });
  }
  commitPd(override) {
    const e = this.state.edit;
    if (!e || e.sec !== 'perdiem') return;
    const val = override !== undefined ? override : e.value;
    this.setState(s => {
      const cur = s.perdiemConfig[e.row] || { eligible:true };
      return { perdiemConfig: { ...s.perdiemConfig, [e.row]: { ...cur, [e.field]: val } }, edit:null };
    });
  }

  startDelayEdit(ri, field) {
    const d = this.state.delays[ri];
    this.setState({ edit: { sec:'delay', row:ri, field, value: (d[field] ?? '') } });
  }
  commitDelay(override) {
    const e = this.state.edit;
    if (!e || e.sec !== 'delay') return;
    const val = override !== undefined ? override : e.value;
    this.setState(s => ({ delays: s.delays.map((d,i) => i === e.row ? { ...d, [e.field]: val } : d), edit:null }));
  }

  baseTierOf(tiers) {
    const mult = tiers.filter(x => x.on && x.mult != null);
    if (!mult.length) return null;
    const one = mult.find(x => x.mult === 1);
    if (one) return one;
    const geOne = mult.filter(x => x.mult >= 1);
    if (geOne.length) return geOne.reduce((a, b) => (b.mult < a.mult ? b : a));
    return mult.reduce((a, b) => (b.mult < a.mult ? b : a));
  }
  progressionSeq() {
    const base = this.baseTierOf(this.state.tiers);
    if (!base) return [];
    return this.state.tiers.filter(t => t.on && t.mult != null && t.mult >= base.mult)
      .slice().sort((a, b) => a.mult - b.mult);
  }
  fmtFactor(f) {
    const r = Math.round(f * 1000) / 1000;
    return String(r);
  }
  calcRateFor(reg, col, baseKey, baseMult) {
    const baseDk = col.a ? col.a + '·' + baseKey : baseKey;
    const b = parseFloat((reg[baseDk] || {}).rate);
    const f = col.mult / (baseMult || 1);
    return isNaN(b) ? '' : (Math.round(b * f * 100) / 100).toFixed(2);
  }
  enabledTierSeq() {
    return this.state.tiers.filter(t => t.on).slice().sort((a, b) => {
      const am = a.mult == null ? Infinity : a.mult, bm = b.mult == null ? Infinity : b.mult;
      return am - bm;
    });
  }
  dailyBps(k) {
    const stored = (this.state.tierRules.daily || []);
    const out = [];
    for (let i = 0; i < k - 1; i++) out.push(stored[i] != null ? stored[i] : Math.round(24 * (i + 1) / k));
    for (let i = 1; i < out.length; i++) if (out[i] <= out[i - 1]) out[i] = out[i - 1] + 1;
    return out;
  }
  bucketHours(hours, dayKey) {
    const seq = this.progressionSeq();
    const rules = this.state.tierRules;
    const counts = seq.map(t => ({ key: t.key, abbr: t.abbr, n: 0 }));
    if (!seq.length) return counts;
    const ov = dayKey ? rules.days[dayKey] : null;
    if (ov && ov !== 'daily') {
      const c = counts.find(x => x.key === ov);
      if (c) { c.n = hours; return counts; }
    }
    if (rules.dailyOn === false) {
      const base = this.baseTierOf(this.state.tiers);
      const tk = (rules.offTier && counts.some(x => x.key === rules.offTier)) ? rules.offTier : (base ? base.key : null);
      const c = tk ? counts.find(x => x.key === tk) : null;
      if (c) c.n = hours; else if (counts.length) counts[0].n = hours;
      return counts;
    }
    const bps = this.dailyBps(seq.length);
    let prev = 0;
    seq.forEach((t, i) => {
      const end = i === seq.length - 1 ? 24 : bps[i];
      counts[i].n = Math.max(0, Math.min(hours, end) - prev);
      prev = end;
    });
    return counts;
  }
  fmtBucket(counts, withZeros) {
    const list = withZeros ? counts : counts.filter(c => c.n > 0);
    const use = list.length ? list : counts.slice(0, 1);
    return use.map(c => (Math.round(c.n * 10) / 10) + ' ' + c.abbr).join(' · ');
  }
  tierDkPairs(t, baseKey) {
    const acts = this.state.activities.filter(x => x.on);
    return (acts.length ? acts.map(a => a.name) : [null]).map(an => ({
      dk: an ? an + '·' + t.key : t.key,
      baseDk: baseKey ? (an ? an + '·' + baseKey : baseKey) : null,
    }));
  }

  tierRulesSummary() {
    const s = this.state;
    const r = s.tierRules;
    const abbr = (key) => { const t = s.tiers.find(x => x.key === key); return t ? t.abbr : key; };
    const prog = this.progressionSeq();
    const bps = this.dailyBps(prog.length);
    const bits = [];
    if (r.dailyOn === false) {
      const base = this.baseTierOf(s.tiers);
      const tk = (r.offTier && prog.some(t => t.key === r.offTier)) ? r.offTier : (base ? base.key : null);
      bits.push('All hours → ' + (tk ? abbr(tk) : '—') + ' (no daily progression)');
    } else if (prog.length > 1) {
      const parts = [];
      prog.forEach((t, i) => {
        if (i === 0) parts.push('First ' + bps[0] + ' hrs → ' + t.abbr);
        else if (i < prog.length - 1) parts.push('next ' + (bps[i] - bps[i - 1]) + ' → ' + t.abbr);
        else parts.push('then ' + t.abbr);
      });
      bits.push(parts.join(', '));
    } else if (prog.length === 1) {
      bits.push('All hours → ' + prog[0].abbr);
    }
    const dmap = { sat:'Saturdays', sun:'Sundays', hol:'holidays' };
    const groups = {};
    ['sat','sun','hol'].forEach(k => { const v = r.days[k]; if (v && v !== 'daily') (groups[v] = groups[v] || []).push(dmap[k]); });
    const dayBits = Object.keys(groups).map(v => groups[v].join(' & ') + ' → ' + abbr(v));
    if (dayBits.length) bits.push(dayBits.join(', '));
    const tmap = { standby:'Standby', mobilization:'Mobilization', demobilization:'Demobilization', weather:'Weather' };
    const typeBits = r.typesOn === false ? [] : Object.keys(tmap).filter(k => r.types[k] && r.types[k] !== 'daily').map(k => tmap[k] + ' → ' + abbr(r.types[k]));
    if (typeBits.length) bits.push(typeBits.join(', '));
    bits.push('Weekly floor: ' + (r.weeklyOn ? 'after ' + (r.weeklyHrs || '40') + ' hrs ≥ ' + abbr(r.weeklyTier) : 'off'));
    bits.push('Unit-price premium: ' + (r.upOn ? abbr(r.upTier) + ' after ' + (r.upHrs || '40') + ' hrs' : 'off'));
    return bits.join(' · ');
  }

  commitTrBp() {
    const ed = this.state.trBpEdit;
    if (!ed) return;
    const k = this.progressionSeq().length;
    const bps = this.dailyBps(k);
    const i = ed.idx;
    let h = parseFloat(ed.value);
    if (isNaN(h)) { this.setState({ trBpEdit: null }); return; }
    const lo = (i === 0 ? 0 : bps[i - 1]) + 1;
    const hi = (i === k - 2 ? 24 : bps[i + 1]) - 1;
    h = Math.max(lo, Math.min(hi, Math.round(h)));
    this.setState(st => {
      const daily = (st.tierRules.daily || []).slice();
      daily[i] = h;
      return { tierRules: { ...st.tierRules, daily }, trBpEdit: null };
    });
  }

  startTierEdit(i) {
    const t = this.state.tiers[i];
    this.setState({ edit: { sec:'tier', row:i, value: (t.mult != null ? String(t.mult) : '') } });
  }
  commitTier(override) {
    const e = this.state.edit;
    if (!e || e.sec !== 'tier') return;
    const raw = (override !== undefined ? override : e.value).trim();
    const parsed = raw === '' ? null : (isNaN(parseFloat(raw)) ? null : parseFloat(raw));
    const s = this.state;
    const t = s.tiers[e.row];
    if (!t) { this.setState({ edit:null }); return; }
    if (parsed === t.mult) { this.setState({ edit:null }); return; }
    const oldTiers = s.tiers;
    const newTiers = oldTiers.map((x,i) => i === e.row ? { ...x, mult: parsed } : x);
    const oldBase = this.baseTierOf(oldTiers);
    const newBase = this.baseTierOf(newTiers);
    const isCalc = (t2, tiers2, base) => !!base && !!t2 && t2.on && t2.mult != null && t2.key !== base.key
      && tiers2.filter(x => x.on && x.mult != null).length >= 2;

    // Any column that stops being calculated gets its current calculated values baked in as manual
    const toBake = oldTiers.filter(t2 => {
      const n2 = newTiers.find(x => x.key === t2.key);
      return isCalc(t2, oldTiers, oldBase) && !isCalc(n2, newTiers, newBase);
    });
    const bakeInto = (labor) => toBake.length === 0 ? labor : labor.map(l => ({ ...l, r: (l.r || []).map(rg => {
      const out = { ...rg };
      toBake.forEach(t2 => {
        this.tierDkPairs(t2, oldBase.key).forEach(({ dk, baseDk }) => {
          const cell = { ...(out[dk] || {}) };
          if (!cell.ovr) {
            const b = parseFloat((out[baseDk] || {}).rate);
            const f = t2.mult / oldBase.mult;
            if (!isNaN(b)) cell.rate = (Math.round(b * f * 100) / 100).toFixed(2);
          }
          delete cell.ovr;
          out[dk] = cell;
        });
      });
      return out;
    }) }));

    // The edited tier becoming a calculated column: confirm, then replace its values with calculated
    const newT = newTiers[e.row];
    if (!isCalc(t, oldTiers, oldBase) && isCalc(newT, newTiers, newBase)) {
      const f = newT.mult / newBase.mult;
      const fDisp = this.fmtFactor(f);
      const baseName = newBase.key === 'st' ? 'straight time' : newBase.abbr;
      const pairs = this.tierDkPairs(t, newBase.key);
      let diff = 0;
      s.labor.forEach(l => (l.r || []).forEach(rg => {
        pairs.forEach(({ dk, baseDk }) => {
          const cur = ((rg[dk] || {}).rate) || '';
          const b = parseFloat((rg[baseDk] || {}).rate);
          const calc = isNaN(b) ? '' : (Math.round(b * f * 100) / 100).toFixed(2);
          if (cur !== calc) diff++;
        });
      }));
      this.setState({ edit: null, confirmDialog: {
        title: 'Calculate ' + t.abbr + ' rates at × ' + fDisp + ' of ' + baseName + '?',
        body: 'Existing values will be replaced (' + diff + ' cell' + (diff !== 1 ? 's' : '') + ' differ' + (diff === 1 ? 's' : '') + ').',
        confirmLabel: 'Calculate',
        onConfirm: () => this.setState(st => ({
          tiers: newTiers,
          labor: bakeInto(st.labor).map(l => ({ ...l, r: (l.r || []).map(rg => {
            const out = { ...rg };
            pairs.forEach(({ dk }) => { const cell = { ...(out[dk] || {}) }; cell.rate = ''; delete cell.ovr; out[dk] = cell; });
            return out;
          }) })),
          confirmDialog: null,
        })),
      } });
      return;
    }

    // Otherwise: apply the change; bake any columns that stopped calculating (e.g. cleared multiplier)
    this.setState(st => ({ tiers: newTiers, labor: bakeInto(st.labor), edit:null }));
  }
  addTier() {
    const d = this.state.tierDraft;
    const name = (d.name || '').trim();
    if (!name) return;
    const abbr = (d.abbr || '').trim();
    if (!abbr) return;
    const mraw = (d.mult || '').trim();
    const mult = mraw === '' ? null : (isNaN(parseFloat(mraw)) ? null : parseFloat(mraw));
    const key = 'c' + Date.now();
    this.setState(s => ({
      tiers: [...s.tiers, { key, label:name, abbr, on:true, mult, custom:true }],
      tierDraft: { name:'', abbr:'', mult:'' }, addTier:false,
    }));
  }

  renderVals() {
    const s = this.state;    const accent = this.props.accentColor ?? '#EE7B3D';

    // ---- stepper ----
    const circle = (n, active) => ({
      width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center',
      justifyContent:'center', fontSize:'14px', fontWeight:600, flexShrink:0,
      background: active ? '#1B2130' : '#EDEEF0', color: active ? '#fff' : '#9AA0A9',
    });
    const slabel = (active) => ({ fontSize:'15px', fontWeight: active ? 600 : 500, color: active ? '#1F2430' : '#9AA0A9' });
    const stpr = {
      c1: circle(1, s.step >= 1), c2: circle(2, s.step >= 2), c3: circle(3, s.step >= 3),
      l1: slabel(s.step === 1), l2: slabel(s.step === 2), l3: slabel(s.step === 3),
    };

    // ---- checkboxes ----
    const laborOn = s.prices.labor, equipOn = s.prices.equipment;
    const cb = {
      labor: this.mkCb(s.prices.labor, false),
      equipment: this.mkCb(s.prices.equipment, false),
      perdiem: this.mkCb(s.prices.perdiem, false),
      delays: this.mkCb(s.prices.delays, false),
      billing: this.mkCb(s.billing, false),
      standby: this.mkCb(s.equipDims.standby, false),
      cap: this.mkCb(s.equipDims.cap, false),
    };

    const mkRadio = (sel) => ({
      ring: { width:'17px', height:'17px', borderRadius:'50%', boxSizing:'border-box', flexShrink:0, background:'#fff',
        border: sel ? '5.5px solid #1B2130' : '1.5px solid #CFD2D8', transition:'border .12s' },
    });
    const ap = { labor: { show: s.prices.labor }, delays: { show: s.prices.delays } };
    const mkKindLbl = (on) => ({ fontSize:'14.5px', fontWeight:500, opacity: on ? 1 : 0.5, transition:'opacity .12s' });
    const kindLbl = {
      labor: mkKindLbl(s.prices.labor),
      equipment: mkKindLbl(s.prices.equipment),
      perdiem: mkKindLbl(s.prices.perdiem),
      delays: mkKindLbl(s.prices.delays),
    };
    const laborStructSummary = ({ class: 'Per classification', blended: 'Blended — one rate', both: 'Both — blended + classifications' })[s.laborStructure] || '';
    const mkTile = (on) => ({
      card: { position:'relative', padding:'14px 15px', borderRadius:'11px', cursor:'pointer', minHeight:'118px', boxSizing:'border-box',
        background: on ? '#FDF8F3' : '#fff',
        border: on ? '1.5px solid #EE7B3D' : '1px solid #E4E6EA',
        boxShadow: on ? '0 1px 2px rgba(238,123,61,.12)' : 'none',
        transition: 'border .12s, background .12s' },
      check: { display: on ? 'flex' : 'none', position:'absolute', top:'10px', right:'10px', width:'18px', height:'18px', borderRadius:'50%', background:'#EE7B3D', alignItems:'center', justifyContent:'center' },
      icon: { color: on ? '#D9662B' : '#8A8F99' },
    });
    const tiles = { labor: mkTile(s.prices.labor), equipment: mkTile(s.prices.equipment), perdiem: mkTile(s.prices.perdiem), delays: mkTile(s.prices.delays) };
    const mkHoverTip = (key, w) => {
      const t = s.hoverTip;
      const showTip = !!t && t.key === key;
      return {
        onTipEnter: (e) => { const r = e.currentTarget.getBoundingClientRect(); this.setState({ hoverTip: { key, x: r.left, y: r.bottom + 8 } }); },
        onTipLeave: () => this.setState(st => (st.hoverTip && st.hoverTip.key === key ? { hoverTip: null } : null)),
        tipStyle: { display: showTip ? 'block' : 'none', position:'fixed', top: (showTip ? t.y : 0) + 'px', left: (showTip ? Math.max(8, t.x - 8) : 0) + 'px', width: w + 'px',
          background:'#1B2130', color:'#fff', fontSize:'11.5px', fontWeight:400, letterSpacing:'normal', textTransform:'none', lineHeight:'1.55',
          padding:'9px 11px', borderRadius:'8px', zIndex:60, boxShadow:'0 8px 24px rgba(15,18,24,.25)', whiteSpace:'normal', cursor:'default' },
      };
    };
    const mkApprHdr = (key, setAll) => ({
      ...mkHoverTip('appr:' + key, 232),
      onMenu: (e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ apprMenu: (st.apprMenu && st.apprMenu.key === key) ? null : { key, x: r.right, y: r.bottom + 4 } })); },
      menuStyle: { display: (s.apprMenu && s.apprMenu.key === key) ? 'block' : 'none' },
      menuPos: this.menuPosStyle(s.apprMenu, 210),
      onAll: (e) => { e.stopPropagation(); setAll(true); },
      onClear: (e) => { e.stopPropagation(); setAll(false); },
    });
    const apprHdr = {
      labor: mkApprHdr('labor', (v) => this.setState(st => ({ labor: st.labor.map(l => ({ ...l, appr: v })), blendedAppr: v, apprMenu: null }))),
      equipment: mkApprHdr('equipment', (v) => this.setState(st => ({ equipment: st.equipment.map(eq => ({ ...eq, appr: v })), apprMenu: null }))),
      perdiem: mkApprHdr('perdiem', (v) => this.setState(st => { const pc = { ...st.perdiemConfig }; st.labor.forEach(l => { const cur = pc[l.cls] || { eligible:true, billed:'135.00', code:'' }; pc[l.cls] = { ...cur, appr: v }; }); return { perdiemConfig: pc, apprMenu: null }; })),
    };
    const blendedAppr = this.mkApprCell(!!s.blendedAppr, () => this.setState(st => ({ blendedAppr: !st.blendedAppr })));
    const styleNotes = { list:'(by item)', flat:'(per person / day)', event:'(logged events)', percent:'(% of billings)' };
    const customKinds = s.customCats.map((c, i) => {
      const box = this.mkCb(c.on, false);
      return {
        name: c.name, note: c.style === 'percent' ? '(' + (c.pct || '3') + '% of ' + (c.pctOf || 'Labor') + ')' : styleNotes[c.style],
        box: box.box, check: box.check,
        labelStyle: mkKindLbl(c.on),
        card: mkTile(c.on).card,
        checkBadge: { display: c.on ? 'flex' : 'none', width:'18px', height:'18px', borderRadius:'50%', background:'#EE7B3D', alignItems:'center', justifyContent:'center' },
        icon: { color: c.on ? '#D9662B' : '#8A8F99' },
        desc: c.style === 'percent' ? (c.pct || '3') + '% of ' + (c.pctOf || 'Labor') + ' billings, calculated automatically'
          : c.style === 'flat' ? 'Flat amount per person per day'
          : c.style === 'event' ? 'Logged events with their own billing rules'
          : 'One-time charges priced per item — e.g., each way',
        onMenu: (e) => { e.stopPropagation(); this.setState(st => ({ catTileMenu: st.catTileMenu === i ? null : i })); },
        menuStyle: { display: s.catTileMenu === i ? 'block' : 'none' },
        onToggle: () => this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, on: !x.on } : x) })),
        onRename: (e) => { e.stopPropagation(); this.setState({ renameDialog: { index: i, name: c.name }, catTileMenu: null }); },
        onRemove: (e) => { e.stopPropagation(); this.setState({ catTileMenu: null }); this.removeCat(i); },
      };
    });
    const customSections = s.customCats.filter(c => c.on).map(c => {
      const i = s.customCats.indexOf(c);
      const liveIdx = c.rows.findIndex(r => r.live);
      const liveRow = liveIdx >= 0 ? c.rows[liveIdx] : null;
      const committedCount = c.rows.filter(r => (r.a || '').trim()).length;
      const isFlat = c.style === 'flat';
      const split = isFlat && !!c.split;
      let cols;
      if (c.style === 'list') cols = ['Item','Rate'];
      else if (isFlat) cols = split ? ['Classification','Breakfast','Lunch','Dinner'] : ['Classification','Amount / day'];
      else if (c.style === 'event') cols = ['Event type','Rules'];
      else cols = ['',''];
      const spBox = this.mkCb(split, false);
      return {
        name: c.name,
        meta: c.style === 'percent' ? 'calculated' : (committedCount + (committedCount === 1 ? ' item' : ' items')),
        wrapStyle: { border:'1px solid #E4E6EA', borderRadius:'12px', marginBottom:'16px', overflow:'hidden' },
        chev: { transform: c.open ? 'rotate(0deg)' : 'rotate(-90deg)', transition:'transform .15s' },
        bodyStyle: { display: c.open ? 'block' : 'none' },
        onOpen: () => this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, open: !x.open } : x) })),
        isPercent: c.style === 'percent',
        hasTable: c.style !== 'percent',
        isFlat,
        splitBox: spBox.box, splitCheck: spBox.check,
        onToggleSplit: () => this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, split: !x.split } : x) })),
        percentLine: (c.pct || '3') + '% of ' + (c.pctOf || 'Labor') + ' billings — calculated automatically at billing time.',
        cols, colCount: cols.length + (s.apprCol ? 1 : 0),
        empty: false,
        tableShow: c.style !== 'percent' && c.rows.length > 0,
        emptyShow: c.style !== 'percent' && c.rows.length === 0,
        addLinkShow: c.style !== 'percent',
        hasLiveRow: liveIdx >= 0,
        billingOn: s.billing,
        xShow: c.rows.length > 0,
        formRef: (this.customAddRefs = this.customAddRefs || {}, this.customAddRefs[i] = this.customAddRefs[i] || React.createRef()),
        dA: (c.draft || {}).a || '', dB: (c.draft || {}).b || '', dCode: (c.draft || {}).code || '',
        onDA: (e) => { const v = e.target.value; this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, draft: { ...(x.draft || {}), a: v } } : x) })); },
        onDB: (e) => { const v = e.target.value; this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, draft: { ...(x.draft || {}), b: v } } : x) })); },
        onDCode: (e) => { const v = e.target.value; this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, draft: { ...(x.draft || {}), code: v } } : x) })); },
        onCommit: () => this.commitAddCustom(i),
        onCloseForm: () => this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, addOpen: false } : x) })),
        onAddItem: (e) => { e.stopPropagation(); this.appendCustomItem(i); },
        live: {
          a: liveRow ? (liveRow.a || '') : '', b: liveRow ? (liveRow.b || '') : '', code: liveRow ? (liveRow.code || '') : '',
          ref: (this.customAddRefs = this.customAddRefs || {}, this.customAddRefs[i] = this.customAddRefs[i] || React.createRef()),
          onA: (e) => { const v = e.target.value; this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, rows: x.rows.map((rr,m) => m === liveIdx ? { ...rr, a: v } : rr) } : x) })); },
          onB: (e) => { const v = e.target.value; this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, rows: x.rows.map((rr,m) => m === liveIdx ? { ...rr, b: v } : rr) } : x) })); },
          onCode: (e) => { const v = e.target.value; this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, rows: x.rows.map((rr,m) => m === liveIdx ? { ...rr, code: v } : rr) } : x) })); },
          onKey: (e) => { if (e.key !== 'Enter') return; const tr = e.target.closest('tr'); if (!tr) return; const els = Array.prototype.slice.call(tr.querySelectorAll('input')); const idx = els.indexOf(e.target); if (idx > -1 && idx < els.length - 1) els[idx + 1].focus(); else this.appendCustomItem(i); },
          onBlur: (e) => { const tr0 = e.target.closest('tr'); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleCustomItem(i); }, 0); },
          onRemove: () => this.removeCustomItem(i, liveIdx),
        },
        apprHdr: mkApprHdr('custom-' + i, (v) => this.setState(st => ({ customCats: st.customCats.map((x,j) => j === i ? { ...x, rows: x.rows.map(r => ({ ...r, appr: v })) } : x), apprMenu: null }))),
        rows: c.rows.map((r, j) => {
          let cells;
          if (r.meals && split) cells = r.meals.map(m => ({ v: m.v, code: m.code || '', hasCode: s.billing && !!m.code }));
          else if (split) cells = [{ v:'—' }, { v:'—' }, { v:'—' }].map(x => ({ ...x, code:'', hasCode:false }));
          else if (r.meals) cells = [{ v: r.meals.map(m => m.v).join(' / '), code:'', hasCode:false }];
          else cells = [{ v: r.b, code: r.code || '', hasCode: s.billing && !!r.code }];
          return { _live: !!r.live, a: r.a, cells,
            ...this.mkApprCell(!!r.appr, () => this.setState(st => ({ customCats: st.customCats.map((x,k) => k === i ? { ...x, rows: x.rows.map((rr,m) => m === j ? { ...rr, appr: !rr.appr } : rr) } : x) }))) };
        }).filter(x => !x._live),
      };
    });
    const structDefs = [['class','Per class'],['blended','Blended'],['both','Both']];
    const structOpts = structDefs.map(([key, label]) => ({
      label,
      hasTip: key !== 'class',
      onClick: () => this.setState({ laborStructure: key }),
      style: {
        padding:'4px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
        background: s.laborStructure === key ? '#fff' : 'transparent',
        color: s.laborStructure === key ? '#1F2430' : '#8A8F99',
        boxShadow: s.laborStructure === key ? '0 1px 2px rgba(0,0,0,.08)' : 'none',
      },
    }));
    const billingSwitch = {
      track: { width:'38px', height:'22px', borderRadius:'11px', background: s.billing ? '#EE7B3D' : '#D0D3D9', position:'relative', cursor:'pointer', transition:'background .15s', flexShrink:0 },
      knob: { position:'absolute', top:'2px', left: s.billing ? '18px' : '2px', width:'18px', height:'18px', borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' },
    };
    const onDetail = s.step === 4 || s.step === 5;
    const secStyle = {};
    ['labor','equipment','perdiem','delays'].forEach(k2 => {
      secStyle[k2] = { border:'1px solid #E4E6EA', borderRadius:'12px', marginBottom:'16px', overflow:'hidden', display: s.prices[k2] ? 'block' : 'none' };
    });
    const chrome = {
      breadcrumb: { padding:'18px 44px 0', display: onDetail ? 'none' : 'block' },
      header: { display: onDetail ? 'none' : 'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 44px 20px', borderBottom:'1px solid #EEEFF1' },
      stepper: { display: onDetail ? 'none' : 'flex', alignItems:'center', justifyContent:'center', gap:0, padding:'26px 44px', borderBottom:'1px solid #EEEFF1' },
      footer: { display: onDetail ? 'none' : 'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 44px', borderTop:'1px solid #EEEFF1', background:'#fff' },
    };
    const periodRows = s.periods.map((p, i) => ({
      label: p.label, status: p.status,
      rowStyle: { display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px',
        borderTop: i ? '1px solid #EEEFF1' : 'none',
        borderRadius: i === 0 ? '12px 12px 0 0' : (i === s.periods.length - 1 ? '0 0 12px 12px' : '0'),
        background: p.status === 'Current' ? '#FDF8F3' : '#fff' },
      chipStyle: { fontSize:'11px', fontWeight:600, padding:'3px 9px', borderRadius:'6px',
        color: p.status === 'Current' ? '#1F8A5B' : '#6B7079',
        background: p.status === 'Current' ? '#E8F5EE' : '#EEF0F2' },
      menuStyle: { display: s.periodMenu === i ? 'block' : 'none' },
      onMenu: () => this.setState(st => ({ periodMenu: st.periodMenu === i ? null : i })),
      onEditRates: () => this.switchPeriod(i),
      onEndEarly: () => this.setState({ endEarly: { index: i, date: p.end }, periodMenu:null }),
    }));
    const periodOptions = s.periods.map((p, i) => ({
      label: p.label,
      onSelect: () => this.switchPeriod(i),
      style: { padding:'9px 12px', borderRadius:'7px', fontSize:'13.5px', cursor:'pointer',
        fontWeight: i === s.viewingPeriod ? 600 : 400,
        background: i === s.viewingPeriod ? '#F6F7F9' : '#fff' },
    }));
    const regionItems = s.regions.map((rg, i) => ({
      name: rg.name,
      onRemove: () => this.removeRegion(i),
    }));
    const enabledTierCount = s.tiers.filter(x => x.on).length;
    const tierItems = s.tiers.map((t, i) => {
      const locked = t.on && enabledTierCount === 1 && s.laborStructure !== 'blended';
      const c = this.mkCb(t.on, locked);
      const editingMult = s.edit && s.edit.sec === 'tier' && s.edit.row === i;
      const hasMult = t.mult != null;
      return {
        label: t.label, abbr: t.abbr, abbrText: t.label === t.abbr ? '' : '(' + t.abbr + ')', box: c.box, check: c.check, custom: !!t.custom,
        lockTitle: locked ? 'At least one time tier is required for per-classification rates.' : '',
        editingMult, notEditingMult: !editingMult,
        multText: hasMult ? '× ' + t.mult : '× —',
        multStyle: {
          fontSize:'12px', fontWeight:600, padding:'5px 9px', cursor:'pointer', display:'inline-flex', alignItems:'center', alignSelf:'stretch',
          color: hasMult ? '#5A5F69' : '#A7ACB5', whiteSpace:'nowrap',
        },
        onToggle: () => { if (locked) return; this.setState(st => ({ tiers: st.tiers.map((x,j) => j === i ? { ...x, on: !x.on } : x) })); },
        onEditMult: () => this.startTierEdit(i),
        onRemove: () => this.setState(st => ({ tiers: st.tiers.filter((x,j) => j !== i) })),
      };
    });
    const activityItems = s.activities.map((a, i) => {
      const c = this.mkCb(a.on, false);
      return {
        name: a.name, box: c.box, check: c.check,
        onToggle: () => this.setState(st => ({ activities: st.activities.map((x,j) => j === i ? { ...x, on: !x.on } : x) })),
        onRemove: () => this.setState(st => ({ activities: st.activities.filter((x,j) => j !== i) })),
      };
    });
    const activitiesEmpty = s.activities.length === 0;
    const addActivityShow = s.addActivity;

    // ---- preview ----
    const ek = this.effectiveKind();
    const kindDefs = [['labor','Labor'],['equipment','Equipment'],['perdiem','Per diem'],['delays','Delays']];
    const kinds = kindDefs.filter(([key]) => s.prices[key]).map(([key,label]) => ({
      label,
      onClick: () => this.setState({ kind: key }),
      style: {
        padding:'6px 15px', borderRadius:'7px', fontSize:'13px', fontWeight:600, cursor:'pointer',
        background: key === ek ? '#fff' : 'transparent',
        color: key === ek ? '#1F2430' : '#8A8F99',
        boxShadow: key === ek ? '0 1px 2px rgba(0,0,0,.08)' : 'none',
      },
    }));
    const preview = this.buildPreview(ek);

    // ---- math line ----
    const tc = this.selTiers().length;
    const ac = s.activities.filter(a => a.on).length;
    const r = this.regionCount();
    const parts = [tc + ' tier' + (tc !== 1 ? 's' : '')];
    if (ac > 0) parts.push(ac + ' activit' + (ac !== 1 ? 'ies' : 'y'));
    parts.push(r + ' region' + (r !== 1 ? 's' : ''));
    const cols = tc * (ac || 1) * r;
    const mathLine = parts.join(' × ') + ' = ' + cols + ' rate column' + (cols !== 1 ? 's' : '') + ' per classification';
    const unitWord = { hour:'hour', day:'day', week:'week' }[s.equipDims.basis];
    const eqCaption = 'One rate per equipment type, per ' + unitWord +
      (s.equipDims.standby ? ' + a standby rate' : '') +
      (s.equipDims.cap ? ' + a weekly billing cap' : '') +
      (s.regions.length > 1 ? ', per region' : '') + ' — tiers don\u2019t apply.';
    const captionByKind = {
      labor: mathLine,
      equipment: eqCaption,
      perdiem: 'A flat daily amount billed per eligible classification.',
      delays: 'Composed from labor + equipment rates, unless a delay is priced as a flat rate.',
    };
    const previewCaption = captionByKind[ek];

    // ---- preview rail: section mini list ----
    const railSections = [];
    if (s.prices.labor) {
      const lp = [];
      if (s.laborStructure === 'blended') lp.push('blended rate');
      else if (s.laborStructure === 'both') lp.push('blended + ' + s.labor.length + ' classification' + (s.labor.length !== 1 ? 's' : ''));
      else lp.push(s.labor.length + ' classification' + (s.labor.length !== 1 ? 's' : ''));
      if (s.laborStructure !== 'blended') {
        lp.push(tc + ' tier' + (tc !== 1 ? 's' : ''));
        if (ac > 0) lp.push(ac + ' activit' + (ac !== 1 ? 'ies' : 'y'));
      }
      if (s.regions.length > 1) lp.push(s.regions.length + ' regions');
      railSections.push({ name: 'Labor', shape: lp.join(' × ') });
    }
    if (s.prices.equipment) {
      const ep = [s.equipment.length + ' type' + (s.equipment.length !== 1 ? 's' : '')];
      if (s.equipDims.basis !== 'hour') ep.push('per ' + unitWord);
      if (s.equipDims.standby) ep.push('standby');
      if (s.equipDims.cap) ep.push('weekly cap');
      railSections.push({ name: 'Equipment', shape: ep.join(' · ') });
    }
    if (s.prices.perdiem) {
      railSections.push({ name: 'Per diem', shape: s.labor.length + ' class' + (s.labor.length !== 1 ? 'es' : '') + (s.pdSplit ? ' · by meal' : '') });
    }
    if (s.prices.delays) {
      railSections.push({ name: 'Delay types', shape: s.delays.length + ' type' + (s.delays.length !== 1 ? 's' : '') });
    }
    s.customCats.forEach(c => {
      if (!c.on) return;
      let shape;
      if (c.style === 'percent') shape = (c.pct || '3') + '% of ' + (c.pctOf || 'Labor');
      else if (c.style === 'flat') shape = 'per person / day' + (c.split ? ' · by meal' : '');
      else shape = c.rows.length + ' item' + (c.rows.length !== 1 ? 's' : '');
      railSections.push({ name: c.name, shape });
    });
    railSections.forEach((x, i) => { x.n = i + 1; });

    // ---- step 2 ----
    const tierCols = this.selTiers();
    const regionsGrouped = s.regions.length > 1;
    const rAxis = this.regionAxis();
    const actAxis = (() => { const a = s.activities.filter(x => x.on); return a.length ? a : [null]; })();
    const laborCols = [];
    if (s.laborStructure === 'blended') {
      rAxis.forEach((rg, g) => {
        laborCols.push({ g, a:null, key:'__blended', mult:null, label: (regionsGrouped ? rg.name + ' · ' : '') + 'Rate' });
      });
    } else {
      rAxis.forEach((rg, g) => actAxis.forEach(a => tierCols.forEach(t => {
        laborCols.push({ g, a: a ? a.name : null, key: t.key, mult: t.mult,
          label: [regionsGrouped ? rg.name : null, a ? a.name : null, t.abbr].filter(Boolean).join(' · ') });
      })));
    }
    const baseTierRV = this.baseTierOf(s.tiers);
    const baseKeyRV = baseTierRV ? baseTierRV.key : null;
    const baseMultRV = baseTierRV ? baseTierRV.mult : 1;
    const anyCalcRV = s.tiers.filter(x => x.on && x.mult != null).length >= 2;
    const baseNameRV = baseTierRV ? (baseTierRV.key === 'st' ? 'straight time' : baseTierRV.abbr) : '';
    laborCols.forEach(c2 => {
      const isMultCol = c2.mult != null && c2.key !== '__blended';
      const isBaseCol = isMultCol && c2.key === baseKeyRV;
      c2.isCalcCol = isMultCol && !isBaseCol && !!baseKeyRV && anyCalcRV;
      if (isBaseCol && anyCalcRV) {
        c2.hasBadge = true;
        c2.badge = 'base';
        c2.badgeTitle = 'Base tier — the other tiers\u2019 rates calculate from these.';
        c2.badgeStyle = { display:'inline-block', fontSize:'10px', fontWeight:700, padding:'2px 6px', borderRadius:'5px', whiteSpace:'nowrap', cursor:'default', letterSpacing:'normal', textTransform:'uppercase',
          background:'#F1F2F4', color:'#9AA0A9' };
      } else if (c2.isCalcCol) {
        const f = this.fmtFactor(c2.mult / baseMultRV);
        c2.hasBadge = true;
        c2.badge = '× ' + c2.mult;
        c2.badgeTitle = baseMultRV === 1
          ? 'Calculated from ' + baseNameRV + '. Click a rate to override.'
          : 'Calculated from ' + baseNameRV + ' (× ' + c2.mult + ' ÷ × ' + baseMultRV + ' = × ' + f + '). Click a rate to override.';
        c2.badgeStyle = { display:'inline-block', fontSize:'10px', fontWeight:700, padding:'2px 6px', borderRadius:'5px', whiteSpace:'nowrap', cursor:'default', letterSpacing:'normal',
          background:'#FCF2EA', color:'#D9662B' };
      } else {
        c2.hasBadge = false;
        c2.badge = ''; c2.badgeTitle = ''; c2.badgeStyle = {};
      }
    });
    const blendedRowShow = s.laborStructure !== 'class';
    const classRowsShow = s.laborStructure !== 'blended';
    const blendedSpan = s.laborStructure === 'blended' ? 1 : tierCols.length * actAxis.length;
    const blendedCells = rAxis.map((rg, g) => {
      const c = (s.blended.r || [])[g] || {};
      const editingRate = s.edit && s.edit.sec === 'blended' && s.edit.field === String(g) && s.edit.sub === 'rate';
      const editingCode = s.edit && s.edit.sec === 'blended' && s.edit.field === String(g) && s.edit.sub === 'code';
      return {
        span: blendedSpan,
        rateMain: c.rate ? this.fmtMoney(c.rate) : '+ Add',
        rateStyle: { fontSize:'14px', color: c.rate ? '#1F2430' : '#2563EB', fontWeight: c.rate ? 600 : 600 },
        code: c.code || '—',
        showCodeRow: s.billing && (!!c.rate || editingCode),
        editingRate, notEditingRate: !editingRate,
        editingCode, notEditingCode: !editingCode,
        onEditRate: () => this.startEdit('blended', 0, String(g), 'rate'),
        onEditCode: () => this.startEdit('blended', 0, String(g), 'code'),
      };
    });
    const laborN = s.labor.filter(l => (l.cls || '').trim()).length;
    const laborCountText = s.laborStructure === 'blended' ? 'blended rate'
      : (s.laborStructure === 'both' ? 'blended + ' + laborN + ' classification' + (laborN !== 1 ? 's' : '') : laborN + ' classification' + (laborN !== 1 ? 's' : ''));
    const laborRows = s.labor.map((row, ri) => {
      const rowKeyFn = (e) => {
        if (e.key !== 'Enter') return;
        const tr = e.target.closest('tr'); if (!tr) return;
        const els = Array.prototype.slice.call(tr.querySelectorAll('select,input'));
        const idx = els.indexOf(e.target);
        if (idx > -1 && idx < els.length - 1) els[idx + 1].focus(); else this.appendLabor();
      };
      const clsCellEl = ((!!row.live && !row.cls) || s.clsEdit === ri)
        ? this.selEl({
            value: row.cls,
            onChange: (e) => { const v = e.target.value; const tr0 = e.target.closest('tr'); this.setState(st => ({ labor: st.labor.map((l,j) => j === ri ? { ...l, cls: v } : l), clsEdit: null })); if (v && tr0) setTimeout(() => { const inp = tr0.querySelector('input'); if (inp) inp.focus(); }, 40); },
            onBlur: (e) => { const tr0 = e.target.closest('tr'); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleLabor(ri); }, 0); },
            onKeyDown: rowKeyFn,
            ref: row.live ? this.addRef.labor : null,
            style: { width:'100%', minWidth:'170px', height:'34px', padding:'0 10px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13.5px', background:'#fff', cursor:'pointer' },
          }, this.orgClassifications.filter(c => c === row.cls || !s.labor.some(l => l.cls === c)), 'Select classification…')
        : React.createElement('span', {
            onClick: () => this.setState({ clsEdit: ri }),
            title: 'Click to change classification',
            style: { display:'inline-block', padding:'5px 8px', margin:'-1px -8px', borderRadius:'7px', cursor:'pointer' },
          }, row.cls);
      const iconX = React.createElement('svg', { width:14, height:14, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:2 }, React.createElement('path', { d:'M18 6 6 18M6 6l12 12' }));
      const dots = React.createElement('svg', { width:16, height:16, viewBox:'0 0 24 24', fill:'currentColor' },
        React.createElement('circle', { cx:12, cy:5, r:1.6 }), React.createElement('circle', { cx:12, cy:12, r:1.6 }), React.createElement('circle', { cx:12, cy:19, r:1.6 }));
      const menuItem = (label, onClick) => React.createElement('div', { onClick, style: { padding:'9px 12px', borderRadius:'7px', fontSize:'13.5px', cursor:'pointer' } }, label);
      const actionEl = (!!row.live && !row.cls)
        ? (s.labor.length > 1
          ? React.createElement('div', { onClick: (e) => { e.stopPropagation(); this.removeLaborRow(ri); }, title: 'Remove row', style: { width:'28px', height:'28px', borderRadius:'7px', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#B9BDC5', cursor:'pointer' } }, iconX)
          : null)
        : React.createElement('div', { style: { position:'relative', display:'inline-block' } },
            React.createElement('div', {
              onClick: (e) => { e.stopPropagation(); const r2 = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ laborMenu: (st.laborMenu && st.laborMenu.i === ri) ? null : { i: ri, x: r2.right, y: r2.bottom + 4 }, equipMenu: null, blendedMenu: null })); },
              style: { width:'28px', height:'28px', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', color:'#B9BDC5', cursor:'pointer' },
            }, dots),
            React.createElement('div', { style: { display: (s.laborMenu && s.laborMenu.i === ri) ? 'block' : 'none' } },
              React.createElement('div', { style: this.menuPosStyle(s.laborMenu, 180) },
                menuItem('Remove classification', (e) => { e.stopPropagation(); this.removeLaborRow(ri); }),
                menuItem(row.nb ? 'Set a rate' : 'Mark non-billable', (e) => { e.stopPropagation(); this.setState(st => ({ labor: st.labor.map((l,j) => j === ri ? { ...l, nb: !l.nb } : l), laborMenu: null, edit: null })); }))));
      return ({
      cls: row.cls,
      clsCellEl, actionEl,
      onRowKey: rowKeyFn,
      util: row.util || '',
      onUtil: (e) => { const v = e.target.value; this.setState(st => ({ labor: st.labor.map((l,j) => j === ri ? { ...l, util: v } : l) })); },
      nonBillable: !!row.nb,
      billableShow: !row.nb,
      nbSpan: laborCols.length,
      menuLabel: row.nb ? 'Set a rate' : 'Mark non-billable',
      menuStyle: { display: (s.laborMenu && s.laborMenu.i === ri) ? 'block' : 'none' },
      menuPos: this.menuPosStyle(s.laborMenu, 180),
      onMenu: (e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ laborMenu: (st.laborMenu && st.laborMenu.i === ri) ? null : { i: ri, x: r.right, y: r.bottom + 4 }, equipMenu:null, blendedMenu:null })); },
      onToggleNB: (e) => { e.stopPropagation(); this.setState(st => ({ labor: st.labor.map((l,j) => j === ri ? { ...l, nb: !l.nb } : l), laborMenu:null, edit:null })); },
      ...this.mkApprCell(!!row.appr, () => this.setState(st => ({ labor: st.labor.map((l,j) => j === ri ? { ...l, appr: !l.appr } : l) }))),
      cells: laborCols.map(col => {
        const reg = (row.r || [])[col.g] || {};
        const dk = col.a ? col.a + '·' + col.key : col.key;
        const d = reg[dk] || { rate:'', code:'' };
        const fieldId = col.g + '|' + (col.a || '') + '|' + col.key;
        const isCalcCol = !!col.isCalcCol;
        const colFactor = isCalcCol ? this.fmtFactor(col.mult / baseMultRV) : '';
        const calcVal = isCalcCol ? this.calcRateFor(reg, col, baseKeyRV, baseMultRV) : '';
        const ovr = isCalcCol && !!d.ovr;
        const calcLocked = isCalcCol && !ovr;
        const shownRate = calcLocked ? calcVal : d.rate;
        const editingRate = s.edit && s.edit.sec === 'labor' && s.edit.row === ri && s.edit.field === fieldId && s.edit.sub === 'rate';
        const editingCode = s.edit && s.edit.sec === 'labor' && s.edit.row === ri && s.edit.field === fieldId && s.edit.sub === 'code';
        const focusId = (s.liveFocus && s.liveFocus.ri === ri) ? s.liveFocus.id : null;
        const baseFieldId = col.g + '|' + (col.a || '') + '|' + baseKeyRV;
        const baseDk2 = col.a ? col.a + '·' + baseKeyRV : baseKeyRV;
        const baseRateVal = baseKeyRV ? ((reg[baseDk2] || {}).rate || '') : '';
        const liveManual = !!row.live && !isCalcCol && (!(d.rate) || focusId === fieldId || focusId === fieldId + ':c');
        const liveCalc = !!row.live && isCalcCol && (!baseRateVal || focusId === baseFieldId || focusId === baseFieldId + ':c');
        const liveShown = liveManual || liveCalc;
        const ovrConfirmOpen = !!s.ovrConfirm && s.ovrConfirm.row === ri && s.ovrConfirm.field === fieldId;
        const setCell = (fn) => this.setState(st => ({
          labor: st.labor.map((l, j) => {
            if (j !== ri) return l;
            return { ...l, r: (l.r || []).map((rg2, g2) => {
              if (g2 !== col.g) return rg2;
              return { ...rg2, [dk]: fn({ ...(rg2[dk] || {}) }) };
            }) };
          }),
        }));
        return {
          liveEl: !liveShown ? null : React.createElement('div', null,
            liveCalc
              ? React.createElement('div', { style: { height:'34px', display:'flex', alignItems:'center', fontSize:'14px', color:'#B4B8C0' } }, calcVal ? this.fmtMoney(calcVal) : '—')
              : React.createElement('input', { value: d.rate || '', onChange: (e) => this.setLaborCell(ri, col.g, dk, { rate: e.target.value }), onKeyDown: rowKeyFn,
                  onFocus: () => this.setState({ liveFocus: { ri, id: fieldId } }),
                  onBlur: (e) => { const tr0 = e.target.closest('tr'); this.setState(st => ((st.liveFocus && st.liveFocus.ri === ri && st.liveFocus.id === fieldId) ? { liveFocus: null } : null)); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleLabor(ri); }, 0); },
                  placeholder: '$0.00', style: { width:'86px', height:'34px', padding:'0 9px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13.5px' } }),
            s.billing && liveManual ? React.createElement('input', { value: d.code || '', onChange: (e) => this.setLaborCell(ri, col.g, dk, { code: e.target.value }), onKeyDown: rowKeyFn,
                  onFocus: () => this.setState({ liveFocus: { ri, id: fieldId + ':c' } }),
                  onBlur: (e) => { const tr0 = e.target.closest('tr'); this.setState(st => ((st.liveFocus && st.liveFocus.ri === ri && st.liveFocus.id === fieldId + ':c') ? { liveFocus: null } : null)); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleLabor(ri); }, 0); },
                  placeholder: 'Code', style: { display:'block', marginTop:'4px', width:'86px', height:'26px', padding:'0 8px', border:'1px solid #E4E6EA', borderRadius:'6px', fontSize:'11px', fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace' } }) : null),
          rateMain: shownRate ? this.fmtMoney(shownRate) : (calcLocked ? '—' : '+ Add'),
          rateStyle: shownRate
            ? { fontSize:'14px', color:'#1F2430' }
            : (calcLocked ? { fontSize:'14px', color:'#C6C9CF' } : { fontSize:'14px', color:'#2563EB', fontWeight:600 }),
          rateWrap: { position:'relative', display:'inline-block', padding:'4px 8px', margin:'-4px -8px', borderRadius:'6px', cursor:'text', minWidth:'52px', minHeight:'20px' },
          code: d.code || '—',
          showCodeRow: !liveShown && s.billing && (!!shownRate || editingCode),
          editingRate, notEditingRate: !editingRate && !liveShown,
          editingCode, notEditingCode: !editingCode,
          isOvr: ovr, notOvr: !ovr,
          ovrTip: 'Manual override — calculated would be ' + (calcVal ? this.fmtMoney(calcVal) : '—') + '.',
          resetLabel: 'Reset to × ' + colFactor,
          onResetOvr: (e) => {
            e.stopPropagation();
            setCell(cell => { const c2 = { ...cell }; delete c2.ovr; c2.rate = ''; return c2; });
          },
          ovrConfirmOpen,
          ovrQuestion: 'Override this rate? It will stop following × ' + colFactor + '.',
          onOvrConfirm: (e) => {
            e.stopPropagation();
            this.setState(st => ({
              labor: st.labor.map((l, j) => {
                if (j !== ri) return l;
                return { ...l, r: (l.r || []).map((rg2, g2) => {
                  if (g2 !== col.g) return rg2;
                  return { ...rg2, [dk]: { ...(rg2[dk] || {}), rate: calcVal || '', ovr: true } };
                }) };
              }),
              ovrConfirm: null,
              edit: { sec:'labor', row: ri, field: fieldId, sub:'rate', value: calcVal || '' },
            }));
          },
          onOvrCancel: (e) => { e.stopPropagation(); this.setState({ ovrConfirm: null }); },
          onEditRate: calcLocked
            ? (() => this.setState({ ovrConfirm: { row: ri, field: fieldId }, edit: null }))
            : (() => this.startEdit('labor', ri, fieldId, 'rate', '')),
          onEditCode: () => this.startEdit('labor', ri, fieldId, 'code'),
        };
      }),
    }); });
    const eqUnit = this.eqUnit();
    const equipCols = [];
    rAxis.forEach((rg) => {
      equipCols.push({ label: (regionsGrouped ? rg.name + ' · ' : '') + 'Rate / ' + eqUnit, hasTip:false, noTip:true });
      if (s.equipDims.standby) equipCols.push({ label: (regionsGrouped ? rg.name + ' · ' : '') + 'Standby / ' + eqUnit, hasTip:false, noTip:true });
    });
    if (s.equipDims.cap) {
      const eqCapTip = mkHoverTip('eqcap', 252);
      equipCols.push({ label:'Weekly cap (hrs)', hasTip:true, noTip:false, tip:'Maximum billable hours per unit within the contract\u2019s work week (begins ' + (s.workWeekStart || 'Monday') + ').', onTipEnter: eqCapTip.onTipEnter, onTipLeave: eqCapTip.onTipLeave, tipStyle: eqCapTip.tipStyle });
    }
    const equipAddRateLabel = 'Rate / ' + eqUnit;
    const eqCell = (ri, row, field, main, first) => {
      const editing = s.edit && s.edit.sec === 'equipment' && s.edit.row === ri && s.edit.field === field && s.edit.sub === 'value';
      const editingCode = s.edit && s.edit.sec === 'equipment' && s.edit.row === ri && s.edit.field === 'code' && s.edit.sub === 'code';
      return {
        main: main || '+ Add',
        mainStyle: main ? { fontSize:'14px', color:'#1F2430' } : { fontSize:'14px', color:'#2563EB', fontWeight:600 },
        wrap: { display:'inline-block', padding:'4px 8px', margin:'-4px -8px', borderRadius:'6px', cursor:'text' },
        editing, notEditing: !editing,
        showCodeRow: first && s.billing,
        code: row.code || '—',
        editingCode: first && editingCode, notEditingCode: !(first && editingCode),
        onEdit: () => this.startEdit('equipment', ri, field, 'value'),
        onEditCode: () => this.startEdit('equipment', ri, 'code', 'code'),
      };
    };
    const equipN = s.equipment.filter(x => (x.type || '').trim()).length;
    const equipRows = s.equipment.map((row, ri) => {
      const live = !!row.live;
      const b = row.billing || { mode:'billable', operators:[] };
      const rowKeyFn = (e) => {
        if (e.key !== 'Enter') return;
        const tr = e.target.closest('tr'); if (!tr) return;
        const els = Array.prototype.slice.call(tr.querySelectorAll('select,input'));
        const idx = els.indexOf(e.target);
        if (idx > -1 && idx < els.length - 1) els[idx + 1].focus(); else this.appendEquip();
      };
      const focusId = (s.liveFocus && s.liveFocus.eri === ri) ? s.liveFocus.id : null;
      const settleOnBlur = (e) => { const tr0 = e.target.closest('tr'); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleEquip(ri); }, 0); };
      const typeCellEl = ((live && !row.type) || s.eqTypeEdit === ri)
        ? this.selEl({
            value: row.type,
            onChange: (e) => { const v = e.target.value; const tr0 = e.target.closest('tr'); this.setState(st => ({ equipment: st.equipment.map((x,j) => j === ri ? { ...x, type: v } : x), eqTypeEdit: null })); if (v && tr0) setTimeout(() => { const inp = tr0.querySelector('input'); if (inp) inp.focus(); }, 40); },
            onBlur: settleOnBlur,
            onKeyDown: rowKeyFn,
            ref: live ? this.addRef.equipment : null,
            style: { width:'100%', minWidth:'180px', height:'34px', padding:'0 10px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13.5px', background:'#fff', cursor:'pointer' },
          }, this.equipCatalog.filter(c => c === row.type || !s.equipment.some(x => x.type === c)), 'Select equipment…')
        : React.createElement('span', { onClick: () => this.setState({ eqTypeEdit: ri }), title:'Click to change equipment', style: { display:'inline-block', padding:'5px 8px', margin:'-1px -8px', borderRadius:'7px', cursor:'pointer' } }, row.type);
      const iconX = React.createElement('svg', { width:14, height:14, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:2 }, React.createElement('path', { d:'M18 6 6 18M6 6l12 12' }));
      const dots = React.createElement('svg', { width:16, height:16, viewBox:'0 0 24 24', fill:'currentColor' }, React.createElement('circle', { cx:12, cy:5, r:1.6 }), React.createElement('circle', { cx:12, cy:12, r:1.6 }), React.createElement('circle', { cx:12, cy:19, r:1.6 }));
      const menuItem = (label, onClick) => React.createElement('div', { onClick, style: { padding:'9px 12px', borderRadius:'7px', fontSize:'13.5px', cursor:'pointer' } }, label);
      const actionEl = (live && !row.type)
        ? (s.equipment.length > 1
          ? React.createElement('div', { onClick: (e) => { e.stopPropagation(); this.removeEquipRow(ri); }, title:'Remove row', style: { width:'28px', height:'28px', borderRadius:'7px', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#B9BDC5', cursor:'pointer' } }, iconX)
          : null)
        : React.createElement('div', { style: { position:'relative', display:'inline-block' } },
            React.createElement('div', { onClick: (e) => { e.stopPropagation(); const r2 = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ equipMenu: (st.equipMenu && st.equipMenu.i === ri) ? null : { i: ri, x: r2.right, y: r2.bottom + 4 }, laborMenu:null, blendedMenu:null })); }, style: { width:'28px', height:'28px', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', color:'#B9BDC5', cursor:'pointer' } }, dots),
            React.createElement('div', { style: { display: (s.equipMenu && s.equipMenu.i === ri) ? 'block' : 'none' } },
              React.createElement('div', { style: this.menuPosStyle(s.equipMenu, 190) },
                menuItem('Remove equipment', (e) => { e.stopPropagation(); this.removeEquipRow(ri); }),
                menuItem('Billing exception…', (e) => { e.stopPropagation(); this.setState({ exc: { row: ri, mode: b.mode, operators: (b.operators || []).slice() }, equipMenu:null }); }))));
      const mkCell = (fieldKey, rawVal, kind, isFirst) => {
        const editing = s.edit && s.edit.sec === 'equipment' && s.edit.row === ri && s.edit.field === fieldKey && s.edit.sub === 'value';
        const editingCode = s.edit && s.edit.sec === 'equipment' && s.edit.row === ri && s.edit.field === 'code' && s.edit.sub === 'code';
        const liveManual = live && (!rawVal || focusId === fieldKey || focusId === (fieldKey + ':c'));
        const commitVal = (v) => {
          if (kind === 'cap') { this.setState(st => ({ equipment: st.equipment.map((x,j) => j === ri ? { ...x, cap: v } : x) })); return; }
          const g = parseInt(fieldKey, 10);
          this.setState(st => ({ equipment: st.equipment.map((x,j) => j === ri ? { ...x, r: (x.r || []).map((rg2,g2) => g2 === g ? { ...rg2, [kind]: v } : rg2) } : x) }));
        };
        const liveEl = !liveManual ? null : React.createElement('div', null,
          React.createElement('input', { value: rawVal || '', onChange: (e) => commitVal(e.target.value), onKeyDown: rowKeyFn,
            onFocus: () => this.setState({ liveFocus: { eri: ri, id: fieldKey } }),
            onBlur: (e) => { const tr0 = e.target.closest('tr'); this.setState(st => ((st.liveFocus && st.liveFocus.eri === ri && st.liveFocus.id === fieldKey) ? { liveFocus: null } : null)); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleEquip(ri); }, 0); },
            placeholder: kind === 'cap' ? 'hrs' : '$0.00', style: { width:'86px', height:'34px', padding:'0 9px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13.5px' } }),
          (isFirst && s.billing) ? React.createElement('input', { value: row.code || '', onChange: (e) => this.setState(st => ({ equipment: st.equipment.map((x,j) => j === ri ? { ...x, code: e.target.value } : x) })), onKeyDown: rowKeyFn,
            onFocus: () => this.setState({ liveFocus: { eri: ri, id: fieldKey + ':c' } }),
            onBlur: (e) => { const tr0 = e.target.closest('tr'); this.setState(st => ((st.liveFocus && st.liveFocus.eri === ri && st.liveFocus.id === (fieldKey + ':c')) ? { liveFocus: null } : null)); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleEquip(ri); }, 0); },
            placeholder: 'Code', style: { display:'block', marginTop:'4px', width:'86px', height:'26px', padding:'0 8px', border:'1px solid #E4E6EA', borderRadius:'6px', fontSize:'11px', fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace' } }) : null);
        return {
          liveEl,
          main: rawVal ? (kind === 'cap' ? rawVal + ' hrs' : this.fmtMoney(rawVal)) : '+ Add',
          mainStyle: rawVal ? { fontSize:'14px', color:'#1F2430' } : { fontSize:'14px', color:'#2563EB', fontWeight:600 },
          wrap: { display:'inline-block', padding:'4px 8px', margin:'-4px -8px', borderRadius:'6px', cursor:'text' },
          editing: !liveManual && editing, notEditing: !liveManual && !editing,
          showCodeRow: !liveManual && isFirst && s.billing,
          code: row.code || '—',
          editingCode: !liveManual && isFirst && editingCode, notEditingCode: !(!liveManual && isFirst && editingCode),
          onEdit: () => this.startEdit('equipment', ri, fieldKey, 'value'),
          onEditCode: () => this.startEdit('equipment', ri, 'code', 'code'),
        };
      };
      const cells = [];
      rAxis.forEach((rg, g) => {
        const reg = (row.r || [])[g] || {};
        cells.push(mkCell(g + '|rate', reg.rate || '', 'rate', cells.length === 0));
        if (s.equipDims.standby) cells.push(mkCell(g + '|standby', reg.standby || '', 'standby', false));
      });
      if (s.equipDims.cap) cells.push(mkCell('cap', row.cap || '', 'cap', false));
      return {
        type: row.type, typeCellEl, actionEl, cells,
        onRowKey: rowKeyFn,
        util: row.util || '',
        onUtil: (e) => { const v = e.target.value; this.setState(st => ({ equipment: st.equipment.map((eq,j) => j === ri ? { ...eq, util: v } : eq) })); },
        ...this.mkApprCell(!!row.appr, () => this.setState(st => ({ equipment: st.equipment.map((eq,j) => j === ri ? { ...eq, appr: !eq.appr } : eq) }))),
        never: b.mode === 'never', notNever: b.mode !== 'never',
        neverSpan: equipCols.length,
        hasOperatorBadge: b.mode === 'operator' && (b.operators || []).length > 0,
        operatorBadge: 'Non-billable for: ' + (b.operators || []).join(', '),
      };
    });
    const perdiemRows = s.labor.filter(l => (l.cls || '').trim()).map(l => {
      const c = s.perdiemConfig[l.cls] || { eligible:true, billed:'135.00', code:'' };
      const editing = s.edit && s.edit.sec === 'perdiem' && s.edit.row === l.cls;
      const edBilled = editing && s.edit.field === 'billed';
      const edCode = editing && s.edit.field === 'code';
      const elig = c.eligible;
      return {
        cls: l.cls,
        eligible: elig, notEligible: !elig,
        editingBilled: edBilled, notEditingBilled: !edBilled,
        editingCode: edCode, notEditingCode: !edCode,
        track: { width:'38px', height:'22px', borderRadius:'11px', background: elig ? '#EE7B3D' : '#D0D3D9', position:'relative', cursor:'pointer', transition:'background .15s', flexShrink:0 },
        knob: { position:'absolute', top:'2px', left: elig ? '18px' : '2px', width:'18px', height:'18px', borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' },
        billed: elig ? this.fmtMoney(c.billed || '0.00') : '—',
        billedStyle: { color: elig ? '#1F2430' : '#B9BDC5' },
        billedWrap: { display:'inline-block', padding:'4px 8px', margin:'-4px -8px', borderRadius:'6px', cursor: elig ? 'text' : 'default', minWidth:'54px' },
        onEditBilled: elig ? (() => this.startPdEdit(l.cls, 'billed')) : (() => {}),
        code: elig ? (s.billing ? (c.code || '—') : '') : '—',
        codeStyle: { display:'inline-block', padding:'4px 8px', margin:'-4px -8px', borderRadius:'6px', color: elig ? '#6B7079' : '#B9BDC5', cursor: elig ? 'text' : 'default' },
        onEditCode: elig ? (() => this.startPdEdit(l.cls, 'code')) : (() => {}),
        onToggle: () => this.setState(st => {
          const cur = st.perdiemConfig[l.cls] || { eligible:true, billed:'135.00', code:'' };
          return { perdiemConfig: { ...st.perdiemConfig, [l.cls]: { ...cur, eligible: !cur.eligible } } };
        }),
        ...(elig
          ? this.mkApprCell(!!c.appr, () => this.setState(st => { const cur = st.perdiemConfig[l.cls] || { eligible:true, billed:'135.00', code:'' }; return { perdiemConfig: { ...st.perdiemConfig, [l.cls]: { ...cur, appr: !cur.appr } } }; }))
          : { apprOn:false,
              apprTrack: { width:'30px', height:'17px', borderRadius:'9px', background:'#E4E6EA', position:'relative', cursor:'default', opacity:0.5, flexShrink:0 },
              apprKnob: { position:'absolute', top:'2px', left:'2px', width:'13px', height:'13px', borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.15)' },
              onAppr: () => {} }),
      };
    });
    const perdiemEligible = s.labor.reduce((n, l) => {
      const c = s.perdiemConfig[l.cls];
      return n + ((c ? c.eligible : true) ? 1 : 0);
    }, 0);
    const delayRows = s.delays.map((row, ri) => {
      const isFlat = row.pricing === 'Flat rate';
      const editingCode = s.edit && s.edit.sec === 'delay' && s.edit.row === ri && s.edit.field === 'code';
      const editingAmount = s.edit && s.edit.sec === 'delay' && s.edit.row === ri && s.edit.field === 'amount';
      const live = !!row.live;
      const rowKeyFn = (e) => { if (e.key !== 'Enter') return; const tr = e.target.closest('tr'); if (!tr) return; const els = Array.prototype.slice.call(tr.querySelectorAll('select,input')); const idx = els.indexOf(e.target); if (idx > -1 && idx < els.length - 1) els[idx + 1].focus(); else this.appendDelay(); };
      const settleOnBlur = (e) => { const tr0 = e.target.closest('tr'); setTimeout(() => { if (tr0 && !tr0.contains(document.activeElement)) this.settleDelay(ri); }, 0); };
      const typeCellEl = live
        ? React.createElement('input', { value: row.type || '',
            onChange: (e) => { const v = e.target.value; this.setState(st => ({ delays: st.delays.map((d,j) => j === ri ? { ...d, type: v } : d) })); },
            onKeyDown: rowKeyFn, onBlur: settleOnBlur, ref: this.addRef.delays, placeholder: 'e.g. Access delay',
            style: { width:'100%', minWidth:'160px', height:'34px', padding:'0 10px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13.5px', outline:'none' } })
        : row.type;
      const actionEl = live
        ? React.createElement('div', { onClick: (e) => { e.stopPropagation(); this.removeDelayRow(ri); }, title:'Remove row', style: { width:'28px', height:'28px', borderRadius:'7px', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#B9BDC5', cursor:'pointer' } },
            React.createElement('svg', { width:14, height:14, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:2 }, React.createElement('path', { d:'M18 6 6 18M6 6l12 12' })))
        : React.createElement('span', { style: { cursor:'pointer', display:'inline-flex' } },
            React.createElement('svg', { width:16, height:16, viewBox:'0 0 24 24', fill:'currentColor' }, React.createElement('circle', { cx:12, cy:5, r:1.6 }), React.createElement('circle', { cx:12, cy:12, r:1.6 }), React.createElement('circle', { cx:12, cy:19, r:1.6 })));
      return {
        type: row.type, approval: row.approval, pricing: row.pricing, unit: row.unit,
        live, typeCellEl, actionEl, settleOnBlur,
        code: s.billing ? row.code : '',
        isFlat, notFlat: !isFlat,
        editingCode, notEditingCode: !editingCode,
        editingAmount, notEditingAmount: !editingAmount,
        amountDisplay: this.fmtMoney(row.amount || '0.00'),
        onEditCode: s.billing ? (() => this.startDelayEdit(ri, 'code')) : (() => {}),
        onEditAmount: () => this.startDelayEdit(ri, 'amount'),
        onApproval: (e) => this.setState(st => ({ delays: st.delays.map((d,i) => i === ri ? { ...d, approval: e.target.value } : d) })),
        onPricing: (e) => this.setState(st => ({ delays: st.delays.map((d,i) => i === ri ? { ...d, pricing: e.target.value } : d) })),
        onUnit: (e) => this.setState(st => ({ delays: st.delays.map((d,i) => i === ri ? { ...d, unit: e.target.value } : d) })),
      };
    });

    const counts = { labor: laborN, equip: equipN, perdiem: perdiemEligible, delays: s.delays.filter(d => (d.type || '').trim()).length };
    const chevRot = (open) => ({ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition:'transform .15s' });
    const chev = { labor: chevRot(s.open.labor), equipment: chevRot(s.open.equipment), perdiem: chevRot(s.open.perdiem), delays: chevRot(s.open.delays), reimb: chevRot(!!s.open.reimb) };
    const bodyShow = (open) => ({ display: open ? 'block' : 'none' });
    const body = { labor: bodyShow(s.open.labor), equipment: bodyShow(s.open.equipment), perdiem: bodyShow(s.open.perdiem), delays: bodyShow(s.open.delays), reimb: bodyShow(!!s.open.reimb) };
    const mkDD = (key, value, opts, onPick, w, disabled) => {
      const openDD = !disabled && s.ddMenu && s.ddMenu.key === key;
      const btn = React.createElement('div', {
        onClick: disabled ? null : (e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ ddMenu: (st.ddMenu && st.ddMenu.key === key) ? null : { key, x: r.left, y: r.bottom + 5, w: Math.max(r.width, 140) } })); },
        style: { display:'inline-flex', alignItems:'center', justifyContent:'space-between', gap:'8px', minWidth: (w || 150) + 'px', height:'34px', padding:'0 10px',
          border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13px', whiteSpace:'nowrap',
          background: disabled ? '#F6F7F9' : '#fff', color:'#1F2430', opacity: disabled ? 0.55 : 1, cursor: disabled ? 'default' : 'pointer' },
      },
        React.createElement('span', null, value),
        React.createElement('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none', stroke: '#9AA0A9', strokeWidth: 2 }, React.createElement('path', { d: 'M6 9l6 6 6-6' })));
      const menu = !openDD ? null : React.createElement('div', {
        style: { position:'fixed', top: s.ddMenu.y + 'px', left: s.ddMenu.x + 'px', minWidth: s.ddMenu.w + 'px', background:'#fff', border:'1px solid #E4E6EA',
          borderRadius:'10px', boxShadow:'0 12px 32px rgba(20,24,31,.16)', padding:'5px', zIndex:70, textAlign:'left' },
      }, opts.map(o => React.createElement('div', {
        key: o, className: 'dd-item',
        onClick: (e) => { e.stopPropagation(); onPick(o); this.setState({ ddMenu: null }); },
        style: { display:'flex', alignItems:'center', gap:'8px', padding:'8px 11px', borderRadius:'7px', fontSize:'13px', cursor:'pointer' },
      },
        React.createElement('span', { style: { width:'14px', display:'inline-flex', justifyContent:'center', color:'#EE7B3D', fontWeight:700, flexShrink:0 } }, o === value ? '✓' : ''),
        React.createElement('span', null, o))));
      return React.createElement('div', { style: { display:'inline-block' } }, btn, menu);
    };
    const mkReimb = (k, notePh) => {
      const r = s.reimb[k];
      const set = (patch) => this.setState(st => ({ reimb: { ...st.reimb, [k]: { ...st.reimb[k], ...patch } } }));
      const isMeals = k === 'meals';
      const mk = r.h === 'At cost + markup';
      const fixed = isMeals && r.h === 'Fixed per-meal amounts';
      const docOff = r.h === 'Not billable' || r.h === 'Included in rates' || r.h === 'Included in per diem' || fixed;
      const CANON = ['Not billable', 'Included in rates', 'Included in per diem', 'Fixed per-meal amounts', 'Reimbursed at cost', 'At cost + markup'];
      const handlingSupport = {
        fuel: ['Not billable', 'Included in rates', 'Reimbursed at cost', 'At cost + markup'],
        meals: ['Not billable', 'Included in rates', 'Included in per diem', 'Fixed per-meal amounts', 'Reimbursed at cost', 'At cost + markup'],
        lodging: ['Not billable', 'Included in rates', 'Included in per diem', 'Reimbursed at cost', 'At cost + markup'],
        tolls: ['Not billable', 'Included in rates', 'Reimbursed at cost', 'At cost + markup'],
      };
      const docOptions = {
        fuel: ['None', 'Receipts', 'Fuel report'],
        meals: ['None', 'Receipts'],
        lodging: ['None', 'Receipts', 'Invoice copy'],
        tolls: ['None', 'Receipts'],
      };
      const support = handlingSupport[k] || handlingSupport.fuel;
      const opts = CANON.filter(o => support.indexOf(o) >= 0);
      const docOpts = docOptions[k] || ['None', 'Receipts'];
      const docVal = docOpts.indexOf(r.doc) >= 0 ? r.doc : (k === 'fuel' ? 'Fuel report' : 'Receipts');
      const mealInputs = !fixed ? null : React.createElement('div', { style: { display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' } },
        [['b','B'],['l','L'],['d','D']].map(([mm, lbl]) => React.createElement('div', { key: mm, style: { display:'flex', alignItems:'center', gap:'4px' } },
          React.createElement('span', { style: { fontSize:'12px', fontWeight:700, color:'#6B7079' } }, lbl),
          React.createElement('span', { style: { fontSize:'12.5px', color:'#8A8F99' } }, '$'),
          React.createElement('input', { value: r[mm] || '', onChange: (e) => set({ [mm]: e.target.value }), placeholder: '0.00',
            style: { width:'58px', height:'34px', padding:'0 7px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13px' } }),
          s.billing ? React.createElement('input', { value: r[mm + 'Code'] || '', onChange: (e) => set({ [mm + 'Code']: e.target.value }), placeholder: 'Code',
            style: { width:'74px', height:'34px', padding:'0 7px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'11px', fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace' } }) : null)));
      return {
        handlingEl: React.createElement('div', { style: { display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' } },
          mkDD(k + ':h', r.h, opts, (v) => set({ h: v }), isMeals ? 186 : 168),
          mk ? React.createElement('input', { value: r.m, onChange: (e) => set({ m: e.target.value }), placeholder: '0',
            style: { width:'46px', height:'34px', padding:'0 7px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13px', textAlign:'center' } }) : null,
          mk ? React.createElement('span', { style: { fontSize:'12.5px', color:'#8A8F99' } }, '%') : null,
          mealInputs,
          (r.h === 'Included in per diem' && !s.prices.perdiem) ? React.createElement('span', {
            style: { fontSize:'12px', color:'#D9662B', lineHeight:'1.45', maxWidth:'260px' },
          }, 'Per diem isn\u2019t enabled on this book — enable it in Step 1 or choose a different handling.') : null),
        docEl: mkDD(k + ':doc', docVal, docOpts, (v) => set({ doc: v }), 132, docOff),
        noteEl: React.createElement('input', { value: r.note, onChange: (e) => set({ note: e.target.value }), placeholder: notePh,
          style: { width:'100%', minWidth:'190px', height:'34px', padding:'0 9px', border:'1px solid transparent', borderRadius:'7px', fontSize:'13px', background:'transparent' } }),
      };
    };

    const tierAbbrs = this.selTiers().map(t => t.abbr).join(', ') || '—';

    // ---- review ----
    const priceList = kindDefs.filter(([key]) => s.prices[key]).map(([,label]) => label)
      .concat(s.customCats.filter(c => c.on).map(c => c.name)).join(', ') || 'None';
    const review = {
      prices: priceList,
      tiers: tierAbbrs,
      tr: s.tierRulesSet ? this.tierRulesSummary() : 'Not configured — manual tier entry',
      trStyle: s.tierRulesSet
        ? { fontSize:'14.5px', fontWeight:500, lineHeight:'1.5' }
        : { fontSize:'14.5px', fontWeight:600, color:'#D9662B' },
      regions: s.regions.length ? s.regions.map(r => r.name).join(', ') : 'Single region',
      billing: s.billing ? 'On' : 'Off',
    };

    // ---- footer / nav ----
    const show = {
      step1: { display: s.step === 1 ? 'block' : 'none' },
      step2: { display: s.step === 2 ? 'block' : 'none' },
      step3: { display: s.step === 3 ? 'block' : 'none' },
      step4: { display: s.step === 4 ? 'block' : 'none' },
      step5: { display: s.step === 5 ? 'block' : 'none' },
      tables: { display: (s.step === 2 || s.step === 4) ? 'block' : 'none' },

      addLabor: { display: ((s.addRow.labor || s.labor.length === 0) && s.laborStructure !== 'blended') ? 'block' : 'none' },
      addEquip: { display: (s.addRow.equipment || s.equipment.length === 0) ? 'block' : 'none' },
      addDelay: { display: (s.addRow.delays || s.delays.length === 0) ? 'block' : 'none' },
    };
    const canContinue = !!s.shell.customer && (Object.values(s.prices).some(v => v) || s.customCats.some(c => c.on));
    const continueBlocked = s.step === 1 && !canContinue;
    const btnPrimary = {
      display:'inline-flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 24px',
      borderRadius:'9px', background: continueBlocked ? '#F0D9C9' : accent, color:'#fff', fontWeight:600, fontSize:'14px',
      cursor: continueBlocked ? 'default' : 'pointer',
      border:'none', boxShadow: continueBlocked ? 'none' : '0 1px 2px rgba(238,123,61,.35)',
    };
    const backBtn = {
      height:'44px', padding:'0 20px', borderRadius:'9px', background:'#fff', color:'#3A3F4A',
      fontWeight:600, fontSize:'14px', border:'1px solid #E4E6EA', cursor:'pointer',
      visibility: s.step === 1 ? 'hidden' : 'visible',
    };
    const backLabel = s.step === 3 ? 'Back to rates' : 'Back to setup';
    const nextLabel = s.step === 1 ? 'Continue' : (s.step === 2 ? 'Continue to review' : 'Create book');
    const footerNote = s.step === 1 ? 'A draft is created after this step.'
      : (s.step === 2 ? 'Draft saved automatically.' : 'Ready to create — the book activates immediately.');

    // ---- tier rules panel ----
    const trRules = s.tierRules;
    const trSeq = this.enabledTierSeq();
    const trProg = this.progressionSeq();
    const trBps = this.dailyBps(trProg.length);
    const trSegColors = { st:'#7FAFA9', ot:'#EDB458', dt:'#DE7A6C', ht:'#9A8FD0' };
    const trPalette = ['#7FAFA9','#EDB458','#DE7A6C','#9A8FD0','#6E9BD1','#C98BB9'];
    const trDailyOn = trRules.dailyOn !== false;
    const baseTierTR = this.baseTierOf(s.tiers);
    const trSegmentsOff = [{ label: baseTierTR ? baseTierTR.abbr : '—',
      style: { flex:'1 1 0%', background: baseTierTR ? (trSegColors[baseTierTR.key] || trPalette[0]) : '#C6C9CF',
        display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'11px', fontWeight:700, letterSpacing:'.04em' } }];
    const trSegmentsOn = trProg.map((t, i) => {
      const start = i === 0 ? 0 : trBps[i - 1];
      const end = i === trProg.length - 1 ? 24 : trBps[i];
      return { label: t.abbr,
        style: { flex: String(Math.max(end - start, 0.001)) + ' 1 0%', background: trSegColors[t.key] || trPalette[i % trPalette.length],
          display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'11px', fontWeight:700, letterSpacing:'.04em', minWidth:'0', overflow:'hidden', whiteSpace:'nowrap' } };
    });
    const trSegments = trDailyOn ? trSegmentsOn : trSegmentsOff;
    const trHandles = !trDailyOn ? [] : trBps.map((bp, i) => {
      const editing = !!s.trBpEdit && s.trBpEdit.idx === i;
      return {
        label: bp,
        style: { position:'absolute', top:'-5px', bottom:'-5px', left:'calc(' + (bp / 24 * 100) + '% - 7px)', width:'14px', display:'flex', alignItems:'stretch', justifyContent:'center', cursor:'ew-resize', zIndex:3, userSelect:'none' },
        lblStyle: { position:'absolute', left:'calc(' + (bp / 24 * 100) + '% - 8px)', fontWeight:600, color:'#6B7079', cursor:'pointer', padding:'1px 4px', margin:'-1px -4px', borderRadius:'4px' },
        inputStyle: { position:'absolute', left:'calc(' + (bp / 24 * 100) + '% - 17px)', top:'-2px', width:'34px', height:'19px', padding:'0 3px', border:'1px solid #B9BDC5', borderRadius:'5px', fontSize:'10.5px', textAlign:'center', outline:'none' },
        editing, notEditing: !editing,
        onLblClick: () => this.setState({ trBpEdit: { idx: i, value: String(bp) } }),
        onDown: (e) => { e.preventDefault(); this.setState({ trDrag: i }); },
      };
    });
    const mkTierOpts = (val, includeDaily) => {
      const opts = [];
      if (includeDaily) opts.push({ v:'daily', label:'Follow daily rules' });
      trSeq.forEach(t => opts.push({ v: t.key, label: t.abbr }));
      if (val && val !== 'daily' && !trSeq.some(t => t.key === val)) {
        const t = s.tiers.find(x => x.key === val);
        opts.push({ v: val, label: t ? t.abbr : val });
      }
      return opts;
    };
    const trSwitch = (on2) => ({
      track: { width:'30px', height:'17px', borderRadius:'9px', background: on2 ? '#EE7B3D' : '#D0D3D9', position:'relative', cursor:'pointer', transition:'background .15s', flexShrink:0 },
      knob: { position:'absolute', top:'2px', left: on2 ? '15px' : '2px', width:'13px', height:'13px', borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' },
    });
    const trCtrl = (on2) => ({ display:'inline-flex', alignItems:'center', gap:'9px', flexWrap:'wrap', opacity: on2 ? 1 : 0.45, pointerEvents: on2 ? 'auto' : 'none', transition:'opacity .15s' });
    const trSelStyle = { height:'30px', padding:'0 8px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13px', background:'#fff', cursor:'pointer' };
    const setTrField = (k, v) => this.setState(st => ({ tierRules: { ...st.tierRules, [k]: v } }));
    const trWeekly = { ...trSwitch(trRules.weeklyOn), hrs: trRules.weeklyHrs, ctrlStyle: trCtrl(trRules.weeklyOn),
      selectEl: this.selEl({ value: trRules.weeklyTier, onChange: (e) => setTrField('weeklyTier', e.target.value), style: trSelStyle }, mkTierOpts(trRules.weeklyTier, false)) };
    const offTierVal = (trRules.offTier && trProg.some(t => t.key === trRules.offTier)) ? trRules.offTier : (baseTierTR ? baseTierTR.key : '');
    const trDaily = { ...trSwitch(trDailyOn), offNote: !trDailyOn,
      offTierEl: this.selEl({ value: offTierVal, onChange: (e) => setTrField('offTier', e.target.value),
        style: { height:'24px', padding:'0 6px', border:'1px solid #E4E6EA', borderRadius:'6px', fontSize:'12px', background:'#fff', cursor:'pointer', color:'#4A4F59' } },
        trProg.map(t => ({ v: t.key, label: t.abbr }))),
      ctrlStyle: { opacity: trDailyOn ? 1 : 0.45, pointerEvents: trDailyOn ? 'auto' : 'none', transition:'opacity .15s' } };
    const trTypesOn = trRules.typesOn !== false;
    const trTypesSw = trSwitch(trTypesOn);
    const trTypesCtrl = { opacity: trTypesOn ? 1 : 0.45, pointerEvents: trTypesOn ? 'auto' : 'none', transition:'opacity .15s' };
    const trDays = [
      { key:'sat', label:'Saturday' }, { key:'sun', label:'Sunday' }, { key:'hol', label:'Holidays' },
    ].map(d => ({
      label: d.label,
      selectEl: this.selEl({ value: trRules.days[d.key],
        onChange: (e) => this.setState(st => ({ tierRules: { ...st.tierRules, days: { ...st.tierRules.days, [d.key]: e.target.value } } })),
        style: { height:'26px', padding:'0 6px', border:'1px solid #E4E6EA', borderRadius:'6px', fontSize:'12px', background:'#fff', cursor:'pointer' },
      }, mkTierOpts(trRules.days[d.key], true)),
    }));
    const trTypes = [
      { key:'standby', label:'Standby' }, { key:'mobilization', label:'Mobilization' },
      { key:'demobilization', label:'Demobilization' }, { key:'weather', label:'Inclement weather' },
    ].map(tt => ({
      label: tt.label,
      selectEl: this.selEl({ value: trRules.types[tt.key],
        onChange: (e) => this.setState(st => ({ tierRules: { ...st.tierRules, types: { ...st.tierRules.types, [tt.key]: e.target.value } } })),
        style: trSelStyle,
      }, mkTierOpts(trRules.types[tt.key], true)),
    }));
    const trHolidays = trRules.holidays.map((h, i) => {
      const hbox = this.mkCb(h.on, false);
      return { name: h.name, box: hbox.box, check: hbox.check,
        onToggle: () => this.setState(st => ({ tierRules: { ...st.tierRules, holidays: st.tierRules.holidays.map((x, j) => j === i ? { ...x, on: !x.on } : x) } })) };
    });
    const upTierObj = s.tiers.find(x => x.key === trRules.upTier);
    const trUp = {
      ...trSwitch(trRules.upOn),
      tierVal: trRules.upTier, hrs: trRules.upHrs,
      selectEl: this.selEl({ value: trRules.upTier, onChange: (e) => setTrField('upTier', e.target.value), style: trSelStyle }, mkTierOpts(trRules.upTier, false)),
      noteShow: trRules.upOn && !trSeq.some(t => t.key === trRules.upTier),
      noteText: (upTierObj ? upTierObj.label : trRules.upTier) + ' isn\u2019t enabled — enable it in Tiers or pick another tier.',
      ctrlStyle: trCtrl(trRules.upOn),
    };
    const trBtn = {
      style: { display:'inline-flex', alignItems:'center', gap:'6px', height:'28px', padding:'0 11px', borderRadius:'7px', cursor:'pointer', fontSize:'12.5px', fontWeight:600, whiteSpace:'nowrap',
        border: s.tierRulesSet ? '1px solid #E4E6EA' : '1px solid #F0D9C9',
        background: s.tierRulesSet ? '#fff' : '#FCF2EA',
        color: s.tierRulesSet ? '#4A4F59' : '#D9662B' },
      label: s.tierRulesSet ? 'Tier rules' : 'Tier rules — not set',
      check: s.tierRulesSet, dot: !s.tierRulesSet,
      hoverText: s.tierRulesSet ? this.tierRulesSummary() : 'Hours will require manual tier splits when logged. Click to set up rules.',
    };
    const trAbbr = (key) => { const t2 = s.tiers.find(x => x.key === key); return t2 ? t2.abbr : key; };
    const trExampleWeek = this.fmtBucket(this.bucketHours(14, null), false);
    const trExampleSun = this.fmtBucket(this.bucketHours(14, 'sun'), false);
    const trExampleMisc = (trRules.weeklyOn
      ? 'With the weekly floor on: hours past ' + (trRules.weeklyHrs || '40') + ' this week bill at least ' + trAbbr(trRules.weeklyTier)
      : 'Weekly floor off')
      + (trTypesOn ? ' · 4 standby hours → ' + (trRules.types.standby === 'daily' ? 'daily rules' : trAbbr(trRules.types.standby)) : '');
    const woCrew = [ { name:'M. Alvarez', hrs:14 }, { name:'J. Whitfield', hrs:8 } ].map((m, i) => ({
      name: m.name, hrsLabel: m.hrs.toFixed(1) + ' hrs',
      split: this.fmtBucket(this.bucketHours(m.hrs, null), false),
      rowStyle: { display:'flex', alignItems:'center', gap:'10px', padding:'13px 18px', borderTop: i === 0 ? 'none' : '1px solid #EEEFF1' },
    }));

    return {
      stpr, cb, billingSwitch, chrome,
      trOpen: s.tierRulesOpen, trBtn,
      billingOn: s.billing,
      laborAddLinkShow: s.laborStructure !== 'blended' && laborN > 0,
      equipAddLinkShow: s.equipment.length > 0,
      delayAddLinkShow: true,
      ...(() => {
        this.addRef = this.addRef || { labor: React.createRef(), equipment: React.createRef(), delays: React.createRef() };
        const dl = s.addDrafts.labor, de = s.addDrafts.equipment, dd = s.addDrafts.delays;
        const setDraft = (sec, patch) => this.setState(st => ({ addDrafts: { ...st.addDrafts, [sec]: { ...st.addDrafts[sec], ...patch } } }));
        const setCell = (sec, id, patch) => this.setState(st => ({ addDrafts: { ...st.addDrafts, [sec]: { ...st.addDrafts[sec], cells: { ...st.addDrafts[sec].cells, [id]: { ...(st.addDrafts[sec].cells[id] || {}), ...patch } } } } }));
        const lCells = laborCols.map(col => {
          const id = col.g + '|' + (col.a || '') + '|' + col.key;
          const cellD = dl.cells[id] || {};
          const isCalc = !!col.isCalcCol;
          let preview = '—';
          if (isCalc && baseKeyRV) {
            const baseId = col.g + '|' + (col.a || '') + '|' + baseKeyRV;
            const b = parseFloat((dl.cells[baseId] || {}).rate);
            preview = isNaN(b) ? '—' : '$' + (Math.round(b * (col.mult / baseMultRV) * 100) / 100).toFixed(2);
          }
          return {
            isCalc, isInput: !isCalc, preview,
            rate: cellD.rate || '', code: cellD.code || '',
            codeShow: s.billing,
            onRate: (e) => setCell('labor', id, { rate: e.target.value }),
            onCode: (e) => setCell('labor', id, { code: e.target.value }),
          };
        });
        const eCellDefs = [];
        rAxis.forEach((rg, g) => {
          eCellDefs.push({ id: g + '|rate', ph: '$0.00', codeShow: s.billing && eCellDefs.length === 0 });
          if (s.equipDims.standby) eCellDefs.push({ id: g + '|standby', ph: '$0.00', codeShow: false });
        });
        if (s.equipDims.cap) eCellDefs.push({ id: 'cap', ph: '40', codeShow: false });
        const eCells = eCellDefs.map(c0 => ({
          ...c0,
          val: (de.cells[c0.id] || {}).v || '',
          onVal: (e) => setCell('equipment', c0.id, { v: e.target.value }),
        }));
        return {
          addL: {
            cls: dl.cls, util: dl.util || '', cells: lCells,
            opts: this.orgClassifications.filter(c => !s.labor.some(l => l.cls === c)),
            ref: this.addRef.labor,
            xShow: s.labor.length > 0,
            onCls: (e) => setDraft('labor', { cls: e.target.value }),
            onUtil: (e) => setDraft('labor', { util: e.target.value }),
            onKey: (e) => { if (e.key === 'Enter') this.commitAddLabor(); },
            onCommit: () => this.commitAddLabor(),
            onClose: () => this.setState(st => ({ addRow: { ...st.addRow, labor: false } })),
          },
          addE: {
            type: de.type, util: de.util || '', code: de.code, cells: eCells,
            typeSelectEl: this.selEl({ value: de.type,
              onChange: (e) => setDraft('equipment', { type: e.target.value }),
              onKeyDown: (e) => { if (e.key === 'Enter') this.commitAddEquip(); },
              ref: this.addRef.equipment,
              style: { width:'100%', minWidth:'180px', height:'34px', padding:'0 10px', border:'1px solid #E4E6EA', borderRadius:'7px', fontSize:'13.5px', background:'#fff', cursor:'pointer' },
            }, this.equipCatalog.filter(t => !s.equipment.some(eq => eq.type === t)), 'Select equipment…'),
            ref: this.addRef.equipment,
            xShow: s.equipment.length > 0,
            onType: (e) => setDraft('equipment', { type: e.target.value }),
            onUtil: (e) => setDraft('equipment', { util: e.target.value }),
            onCode: (e) => setDraft('equipment', { code: e.target.value }),
            onKey: (e) => { if (e.key === 'Enter') this.commitAddEquip(); },
            onCommit: () => this.commitAddEquip(),
            onClose: () => this.setState(st => ({ addRow: { ...st.addRow, equipment: false } })),
          },
          addD: {
            type: dd.type, code: dd.code,
            approval: dd.approval || 'Customer', pricing: dd.pricing || 'Labor + equipment', amount: dd.amount || '',
            flatShow: dd.pricing === 'Flat rate', flatHide: dd.pricing !== 'Flat rate',
            ref: this.addRef.delays,
            xShow: s.delays.length > 0,
            onType: (e) => setDraft('delays', { type: e.target.value }),
            onCode: (e) => setDraft('delays', { code: e.target.value }),
            onApproval: (e) => setDraft('delays', { approval: e.target.value }),
            onPricing: (e) => setDraft('delays', { pricing: e.target.value }),
            onAmount: (e) => setDraft('delays', { amount: e.target.value }),
            onKey: (e) => { if (e.key === 'Enter') this.commitAddDelay(); },
            onCommit: () => this.commitAddDelay(),
            onClose: () => this.setState(st => ({ addRow: { ...st.addRow, delays: false } })),
          },
        };
      })(),
      demoSw: trSwitch(s.demoData),
      nextTitle: continueBlocked ? 'Select a customer and at least one billable category.' : '',
      laborEmptyShow: laborN === 0 && !blendedRowShow,
      laborTableShow: true,
      equipEmptyShow: equipN === 0,
      equipTableShow: true,
      pdEmptyShow: s.labor.length === 0,
      pdTableShow: s.labor.length > 0,
      delayEmptyShow: s.delays.length === 0,
      delayTableShow: s.delays.length > 0,
      shellMenuOpen: !!s.shellMenu,
      shellMenuPos: (() => {
        const m = s.shellMenu;
        const isCal = !!m && (m.key === 'eff' || m.key === 'exp');
        return { position:'fixed', top: (m ? m.y : 0) + 'px', left: (m ? m.x : 0) + 'px', width: (m ? (isCal ? 264 : m.w) : 240) + 'px',
          background:'#fff', border:'1px solid #E4E6EA', borderRadius:'10px', boxShadow:'0 12px 32px rgba(20,24,31,.16)',
          padding:'5px', zIndex:60, textAlign:'left' };
      })(),
      shellMenuItems: (() => {
        const m = s.shellMenu;
        if (!m) return [];
        const optsByKey = {
          customer: ['Duke Energy Carolinas', 'PPL Electric Utilities', 'Dominion Energy', 'National Grid'],
          work: ['OH Distribution', 'UG Distribution', 'OH Transmission', 'Storm response'],
        };
        return (optsByKey[m.key] || []).map(label => ({
          label,
          onPick: (e) => { e.stopPropagation(); this.setState(st => ({ shell: { ...st.shell, [m.key]: label }, shellMenu: null })); },
        }));
      })(),
      ...(() => {
        const m = s.shellMenu;
        const isCal = !!m && (m.key === 'eff' || m.key === 'exp');
        const cal = isCal ? (m.cal || { y: 2026, mo: 0 }) : null;
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const calDays = [];
        if (isCal) {
          const first = new Date(cal.y, cal.mo, 1).getDay();
          const dim = new Date(cal.y, cal.mo + 1, 0).getDate();
          for (let i = 0; i < first; i++) calDays.push({ label:'', style: { height:'28px' }, onPick: () => {} });
          const cur = s.shell[m.key];
          for (let d2 = 1; d2 <= dim; d2++) {
            const str = monthShort[cal.mo] + ' ' + d2 + ', ' + cal.y;
            const sel = cur === str;
            calDays.push({
              label: String(d2),
              style: { height:'28px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', fontSize:'12.5px', cursor:'pointer',
                background: sel ? '#EE7B3D' : 'transparent', color: sel ? '#fff' : '#1F2430', fontWeight: sel ? 600 : 400 },
              onPick: (e) => { e.stopPropagation(); this.setState(st => ({ shell: { ...st.shell, [m.key]: str }, shellMenu: null })); },
            });
          }
        }
        return {
          shellMenuIsCal: isCal,
          shellMenuIsList: !!m && !isCal,
          calLabel: isCal ? monthNames[cal.mo] + ' ' + cal.y : '',
          calDows: ['S','M','T','W','T','F','S'],
          calDays,
          calPrev: (e) => { e.stopPropagation(); this.setState(st => { const c = st.shellMenu.cal || { y:2026, mo:0 }; const mo = c.mo - 1; return { shellMenu: { ...st.shellMenu, cal: mo < 0 ? { y: c.y - 1, mo: 11 } : { y: c.y, mo } } }; }); },
          calNext: (e) => { e.stopPropagation(); this.setState(st => { const c = st.shellMenu.cal || { y:2026, mo:0 }; const mo = c.mo + 1; return { shellMenu: { ...st.shellMenu, cal: mo > 11 ? { y: c.y + 1, mo: 0 } : { y: c.y, mo } } }; }); },
        };
      })(),
      shellD: (() => {
        const sh = s.shell;
        const periodStr = (sh.eff && sh.exp) ? sh.eff.replace(/, \d{4}$/, '') + ' – ' + sh.exp : '';
        return {
          customer: sh.customer || 'Select customer…',
          custStyle: { fontSize:'14px', color: sh.customer ? '#1F2430' : '#A7ACB5' },
          hasWork: !!sh.work, noWork: !sh.work, work: sh.work,
          bookName: sh.bookName,
          bookNameDisp: sh.bookName || 'Untitled rate book',
          eff: sh.eff || 'Select date…', effStyle: { fontSize:'14px', color: sh.eff ? '#1F2430' : '#A7ACB5' },
          exp: sh.exp || 'Select date…', expStyle: { fontSize:'14px', color: sh.exp ? '#1F2430' : '#A7ACB5' },
          ratesFor: 'Rates for: ' + (periodStr || 'no period set'),
          custLine: (sh.customer && sh.work) ? sh.customer + ' · ' + sh.work : (sh.customer || 'No customer selected'),
          period: periodStr || '—',
          customerOr: sh.customer || '—', workOr: sh.work || '—', bookNameOr: sh.bookName || '—',
        };
      })(),
      optsBtnStyle: { display:'inline-flex', alignItems:'center', gap:'5px', height:'28px', padding:'0 11px', borderRadius:'7px', cursor:'pointer', fontSize:'12.5px', fontWeight:600, whiteSpace:'nowrap', border:'1px solid #E4E6EA', background:'#fff', color:'#4A4F59' },
      laborOptsLabel: (() => { const n = (s.activities.length ? 1 : 0) + (s.utilNamesLabor ? 1 : 0) + (s.apprCol ? 1 : 0); return 'Options' + (n ? ' · ' + n : ''); })(),
      equipOptsLabel: (() => { const n = (s.utilNamesEquip ? 1 : 0) + (s.apprCol ? 1 : 0); return 'Options' + (n ? ' · ' + n : ''); })(),
      apprThStyle: { display: s.apprCol ? 'table-cell' : 'none', textAlign:'left', padding:'11px 18px', fontSize:'11px', fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase', color:'#8A8F99', background:'#FAFAFB', whiteSpace:'nowrap' },
      apprTdTop: { display: s.apprCol ? 'table-cell' : 'none', padding:'11px 18px', verticalAlign:'top', whiteSpace:'nowrap' },
      apprTdMid: { display: s.apprCol ? 'table-cell' : 'none', padding:'11px 18px', verticalAlign:'middle', whiteSpace:'nowrap' },
      apprTdBlended: { display: s.apprCol ? 'table-cell' : 'none', padding:'13px 18px', verticalAlign:'top', whiteSpace:'nowrap' },
      ...(() => {
        const n = s.labor.filter(l => l.appr).length + (s.blendedAppr ? 1 : 0)
          + s.equipment.filter(eq => eq.appr).length
          + Object.values(s.perdiemConfig).filter(c => c && c.appr).length
          + s.customCats.reduce((m, c) => m + c.rows.filter(rr => rr.appr).length, 0);
        const blocked = s.apprCol && n > 0;
        const sw = trSwitch(s.apprCol);
        return {
          apprColBlocked: blocked,
          apprColNote: n + ' rate' + (n !== 1 ? 's' : '') + ' require' + (n === 1 ? 's' : '') + ' approval — clear ' + (n === 1 ? 'it' : 'them') + ' to hide this column.',
          apprColSw: blocked ? { track: { ...sw.track, opacity: 0.45, cursor: 'default' }, knob: sw.knob } : sw,
          onApprColToggle: () => { if (blocked) return; this.setState(st => ({ apprCol: !st.apprCol })); },
        };
      })(),
      laborOptsOpen: !!s.laborOptsOpen,
      equipOptsOpen: !!s.equipOptsOpen,
      laborOptsPanel: (() => { const m = s.laborOptsOpen; return { position:'fixed', top: (m ? m.y : 0) + 'px', left: (m ? Math.max(8, m.x - 300) : 0) + 'px', width:'300px', maxHeight:'72vh', overflowY:'auto', background:'#fff', border:'1px solid #E4E6EA', borderRadius:'11px', boxShadow:'0 12px 32px rgba(20,24,31,.16)', padding:'16px', zIndex:60, textAlign:'left' }; })(),
      equipOptsPanel: (() => { const m = s.equipOptsOpen; return { position:'fixed', top: (m ? m.y : 0) + 'px', left: (m ? Math.max(8, m.x - 290) : 0) + 'px', width:'290px', maxHeight:'72vh', overflowY:'auto', background:'#fff', border:'1px solid #E4E6EA', borderRadius:'11px', boxShadow:'0 12px 32px rgba(20,24,31,.16)', padding:'16px', zIndex:60, textAlign:'left' }; })(),
      utilLaborSw: trSwitch(s.utilNamesLabor),
      utilEquipSw: trSwitch(s.utilNamesEquip),
      utilTipLabor: mkHoverTip('utilL', 236),
      utilTipEquip: mkHoverTip('utilE', 236),
      blendedCoversText: 'covers labor' + (s.blendedCovers.equipment ? ' + equipment' : '') + (s.blendedCovers.perdiem ? ' + per diem' : ''),
      onBlendedMenu: (e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ blendedMenu: st.blendedMenu ? null : { x: r.right, y: r.bottom + 4 }, laborMenu:null, equipMenu:null })); },
      blendedMenuStyle: { display: s.blendedMenu ? 'block' : 'none' },
      blendedMenuPos: this.menuPosStyle(s.blendedMenu, 200),
      onCoverOpen: (e) => { e.stopPropagation(); this.setState(st => ({ coverDialog: { ...st.blendedCovers }, blendedMenu: false })); },
      coverOpen: !!s.coverDialog,
      coverLabor: this.mkCb(true, true),
      coverEq: this.mkCb(!!(s.coverDialog && s.coverDialog.equipment), false),
      coverPd: this.mkCb(!!(s.coverDialog && s.coverDialog.perdiem), false),
      onCoverEq: () => this.setState(st => ({ coverDialog: { ...st.coverDialog, equipment: !st.coverDialog.equipment } })),
      onCoverPd: () => this.setState(st => ({ coverDialog: { ...st.coverDialog, perdiem: !st.coverDialog.perdiem } })),
      onCoverCancel: () => this.setState({ coverDialog: null }),
      onCoverSave: () => this.setState(st => ({ blendedCovers: { ...st.coverDialog }, coverDialog: null })),
      equipCoverNote: blendedRowShow && s.blendedCovers.equipment,
      woEqCovered: s.blendedCovers.equipment,
      woEqNotCovered: !s.blendedCovers.equipment,
      trSegments, trHandles, trWeekly, trDaily, trDays, trTypes, trHolidays, trUp,
      trTypesSw, trTypesCtrl, trTypesOff: !trTypesOn,
      utilLabor: s.utilNamesLabor, utilEquip: s.utilNamesEquip,
      holOpen: s.holListOpen, holDraft: s.holDraft,
      trExampleWeek, trExampleSun, trExampleMisc, woCrew,
      trBpValue: s.trBpEdit ? s.trBpEdit.value : '',
      onTrBpInput: (e) => this.setState(st => ({ trBpEdit: { ...st.trBpEdit, value: e.target.value } })),
      onTrBpCommit: () => this.commitTrBp(),
      onTrBpKey: (e) => { if (e.key === 'Enter') this.commitTrBp(); else if (e.key === 'Escape') this.setState({ trBpEdit: null }); },
      trBarRef: this.trBarRef || (this.trBarRef = React.createRef()),
      onTrMove: (e) => {
        if (this.state.trDrag == null) return;
        const el = this.trBarRef && this.trBarRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const i = this.state.trDrag;
        const k = this.progressionSeq().length;
        const bps = this.dailyBps(k);
        const lo = (i === 0 ? 0 : bps[i - 1]) + 1;
        const hi = (i === k - 2 ? 24 : bps[i + 1]) - 1;
        let h = Math.round(((e.clientX - rect.left) / rect.width) * 24);
        h = Math.max(lo, Math.min(hi, h));
        if (h === bps[i]) return;
        this.setState(st => {
          const daily = (st.tierRules.daily || []).slice();
          daily[i] = h;
          return { tierRules: { ...st.tierRules, daily } };
        });
      },
      onTrUp: () => { if (this.state.trDrag != null) this.setState({ trDrag: null }); },
      isStep2: s.step === 2,
      showBookSettings: s.step === 2 || s.step === 4,
      billingSwitchSm: {
        track: { width:'30px', height:'17px', borderRadius:'9px', background: s.billing ? '#EE7B3D' : '#D0D3D9', position:'relative', cursor:'pointer', transition:'background .15s', flexShrink:0 },
        knob: { position:'absolute', top:'2px', left: s.billing ? '15px' : '2px', width:'13px', height:'13px', borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' },
      },
      secStyle,
      structOpts, blendedRowShow, classRowsShow, blendedCells, laborCountText,
      customKinds, customSections,
      tiles,
      mealsIncludedRing: mkRadio(s.pdMeals.mode === 'included').ring,
      mealsSeparateRing: mkRadio(s.pdMeals.mode === 'separate').ring,
      mealsIncluded: s.pdMeals.mode === 'included',
      mealsSeparate: s.pdMeals.mode === 'separate',
      mealB: s.pdMeals.b, mealL: s.pdMeals.l, mealD: s.pdMeals.d,
      mealBCode: s.pdMeals.bCode, mealLCode: s.pdMeals.lCode, mealDCode: s.pdMeals.dCode,
      mealCodesShow: s.billing,
      confirmOpen: !!s.confirmDialog,
      confirmTitle: s.confirmDialog ? s.confirmDialog.title : '',
      confirmBody: s.confirmDialog ? s.confirmDialog.body : '',
      confirmLabel: s.confirmDialog ? (s.confirmDialog.confirmLabel || 'OK') : 'OK',
      confirmHasCancel: !!s.confirmDialog && !s.confirmDialog.noCancel,
      renOpen: !!s.renameDialog,
      renName: s.renameDialog ? s.renameDialog.name : '',
      renStyleText: s.renameDialog
        ? ({ list:'a rate for each item on a list', flat:'a flat amount per person per day', event:'a logged event with its own billing rules', percent:'a percentage of another category\u2019s billings' })[(s.customCats[s.renameDialog.index] || {}).style] || ''
        : '',
      catPctSelectEl: this.selEl({
        value: s.catDialog ? s.catDialog.pctOf : 'Labor',
        onChange: (e) => this.setState(st => ({ catDialog: { ...st.catDialog, pctOf: e.target.value } })),
        style: { height:'34px', padding:'0 10px', border:'1px solid #E4E6EA', borderRadius:'8px', fontSize:'13.5px', color:'#1F2430', background:'#fff', cursor:'pointer' },
      }, ['Labor', 'Equipment', 'Per diem'].concat(s.customCats.filter(c => c.style !== 'percent').map(c => c.name))),
      catOpen: !!s.catDialog,
      catName: s.catDialog ? s.catDialog.name : '',
      catPct: s.catDialog ? s.catDialog.pct : '3',
      catPctOf: s.catDialog ? s.catDialog.pctOf : 'Labor',
      catStyles: [
        { key:'list', title:'A rate for each item on a list', like:'like Labor or Equipment', body:'List entries and give each a rate — per hour, day, week, or each (per occurrence).', hint:'For work the utility scopes on work orders — priced units with quantities — use a Units (CU) library instead. This is for rate-sheet charges billed alongside time, like mobilization.' },
        { key:'flat', title:'A flat amount per person per day', like:'like Per diem', body:'Set eligibility and a daily amount by classification.' },
        { key:'event', title:'A logged event with its own billing rules', like:'like Delay types', body:'Each occurrence is priced by its duration and rules, and can require approval.' },
        { key:'percent', title:'A percentage of another category\u2019s billings', like:'like a small-tools charge at 3% of labor', body:'Calculated automatically at billing time.' },
      ].map(def => {
        const sel = !!s.catDialog && s.catDialog.style === def.key;
        return {
          title: def.title, like: def.like, body: def.body,
          hint: def.hint || '', hasHint: !!def.hint,
          showPct: def.key === 'percent' && sel,
          onSelect: () => this.setState(st => ({ catDialog: { ...st.catDialog, style: def.key } })),
          card: { padding:'12px 14px', borderRadius:'10px', cursor:'pointer', transition:'border .12s, background .12s',
            border: sel ? '1.5px solid #EE7B3D' : '1px solid #E4E6EA',
            background: sel ? '#FDF8F3' : '#fff' },
        };
      }),
      catAddBtn: (() => {
        const ok = !!s.catDialog && !!(s.catDialog.name || '').trim() && !!s.catDialog.style;
        return { height:'40px', padding:'0 20px', borderRadius:'9px', border:'none', fontWeight:600, fontSize:'13.5px',
          background: ok ? '#EE7B3D' : '#F0D9C9', color:'#fff', cursor: ok ? 'pointer' : 'default',
          boxShadow: ok ? '0 1px 2px rgba(238,123,61,.35)' : 'none' };
      })(),
      excOpen: !!s.exc,
      excType: s.exc ? (s.equipment[s.exc.row] || {}).type : '',
      excOperatorMode: !!s.exc && s.exc.mode === 'operator',
      excRb: {
        billable: { ring: mkRadio(!!s.exc && s.exc.mode === 'billable').ring },
        never: { ring: mkRadio(!!s.exc && s.exc.mode === 'never').ring },
        operator: { ring: mkRadio(!!s.exc && s.exc.mode === 'operator').ring },
      },
      excClsOpts: (() => {
        const list = s.labor.map(l => (l.cls || '').trim()).filter(Boolean);
        if (s.exc) (s.exc.operators || []).forEach(o => { if (list.indexOf(o) < 0) list.push(o); });
        return list;
      })().map(cls => {
        const sel = !!s.exc && s.exc.operators.indexOf(cls) >= 0;
        return {
          label: cls,
          onToggle: () => this.setState(st => ({ exc: { ...st.exc, operators: sel ? st.exc.operators.filter(x => x !== cls) : [...st.exc.operators, cls] } })),
          style: { padding:'5px 11px', borderRadius:'7px', fontSize:'12.5px', fontWeight:600, cursor:'pointer',
            border: sel ? '1.5px solid #EE7B3D' : '1px solid #E4E6EA',
            background: sel ? '#FDF8F3' : '#fff',
            color: sel ? '#D9662B' : '#4A4F59' },
        };
      }),
      blendedOnlyHint: s.laborStructure === 'blended',
      structHelperShow: s.laborStructure !== 'class',
      woTipStyle: { display: s.woTip ? 'block' : 'none' },
      woBasisTipStyle: { display: s.woBasisTip ? 'block' : 'none' },
      woRegionTipStyle: { display: s.woRegionTip ? 'block' : 'none' },
      woBasisText: s.woBasis === 'fixed' ? 'Fixed price — accrues by % complete' : 'T&E — actual hours × blended rate',
      woFixed: s.woBasis === 'fixed',
      woHours: s.woBasis === 'fixed' ? '105.3' : '—',
      woHoursStyle: { fontSize:'22px', fontWeight:700, color: s.woBasis === 'fixed' ? '#1F2430' : '#B9BDC5' },
      woValue: s.woBasis === 'fixed' ? '$18,585.45' : 'Accrues from logged hours',
      woValueStyle: s.woBasis === 'fixed'
        ? { fontSize:'22px', fontWeight:700, color:'#D9662B' }
        : { fontSize:'15px', fontWeight:600, color:'#6B7079', lineHeight:'30px' },
      woToggleLabel: s.woBasis === 'fixed' ? 'View T&E variant →' : 'View fixed-price variant →',
      woFinePrint: s.woBasis === 'fixed'
        ? 'Accrues at % complete × work order value. Logged hours never drive billing on fixed-price work orders.'
        : 'Bills actual logged hours at the blended rate, invoiced as work is performed.',
      woTag: s.woBasis === 'fixed' ? 'Non-billable' : 'Billable',
      woTagStyle: { fontSize:'11px', fontWeight:600, padding:'3px 9px', borderRadius:'6px',
        color: s.woBasis === 'fixed' ? '#6B7079' : '#1F8A5B',
        background: s.woBasis === 'fixed' ? '#EEF0F2' : '#E8F5EE' },
      woSheetNote: s.woBasis === 'fixed'
        ? "Hours on blended work orders are tracked for productivity (actual vs. estimated) — they don't drive billing."
        : 'Hours on T&E work orders bill at the blended rate — every logged hour drives the invoice.',
      periodRows, periodOptions,
      showPeriodSelector: s.step === 4,
      viewingPeriodLabel: (s.periods[s.viewingPeriod] || s.periods[0]).label,
      periodSelMenuStyle: { display: s.periodSelOpen ? 'block' : 'none' },
      workWeekStart: s.workWeekStart || 'Monday',
      wwMenuStyle: { display: s.wwSelOpen ? 'block' : 'none' },
      wwLabelTip: mkHoverTip('wwlabel', 300),
      wwOptions: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => ({
        label: d,
        onSelect: () => this.setState({ workWeekStart: d, wwSelOpen: false }),
        style: { padding:'8px 11px', borderRadius:'7px', fontSize:'12.5px', cursor:'pointer', fontWeight: d === (s.workWeekStart || 'Monday') ? 600 : 400 },
      })),
      addPeriodOpen: s.addPeriodOpen,
      apStart: s.addPeriod.start, apEnd: s.addPeriod.end, apPct: s.addPeriod.pct,
      apError: s.addPeriodError, apErrorShow: !!s.addPeriodError,
      apRb: { copy: { ring: mkRadio(s.addPeriod.mode === 'copy').ring }, blank: { ring: mkRadio(s.addPeriod.mode === 'blank').ring } },
      endEarlyOpen: !!s.endEarly,
      eeDate: s.endEarly ? s.endEarly.date : '',
      toastShow: !!s.toast, toastMsg: s.toast,
      tierItems, addTierShow: s.addTier, tierDraftName: s.tierDraft.name, tierDraftAbbr: s.tierDraft.abbr, tierDraftMult: s.tierDraft.mult,
      tierAddBtn: (() => {
        const ok = !!(s.tierDraft.name || '').trim() && !!(s.tierDraft.abbr || '').trim();
        return { height:'40px', padding:'0 20px', borderRadius:'9px', border:'none', fontWeight:600, fontSize:'13.5px',
          background: ok ? '#EE7B3D' : '#F0D9C9', color:'#fff', cursor: ok ? 'pointer' : 'default',
          boxShadow: ok ? '0 1px 2px rgba(238,123,61,.35)' : 'none' };
      })(),
      tierEditValue: (s.edit && s.edit.sec === 'tier') ? s.edit.value : '',
      onTierInput: (e) => this.setState(st => ({ edit: { ...st.edit, value: e.target.value } })),
      onTierCommit: (e) => this.commitTier(e && e.target ? e.target.value : undefined),
      onTierKey: (e) => { if (e.key === 'Enter') this.commitTier(e.target.value); else if (e.key === 'Escape') this.setState({ edit: null }); },
      activityItems, activitiesEmpty, addActivityShow, activityDraft: s.activityDraft,
      regionItems, regionsEmpty: s.regions.length === 0, regionsOne: s.regions.length === 1, addRegionShow: s.addRegion, regionDraft: s.regionDraft,
      regionError: s.regionError || '', regionErrorShow: !!s.regionError, oneRegionTip: mkHoverTip('oneregion', 260),
      ap, apprHdr, blendedAppr, kindLbl, laborStructSummary, railSections, railEmpty: railSections.length === 0,
      laborCols, equipCols, equipAddRateLabel, equipBasis: s.equipDims.basis,
      tierCols, laborRows, equipRows, perdiemRows, delayRows, counts, chev, body, review,
      rb0: mkReimb('fuel', 'e.g., requires weekly fuel report'), rbMeals: mkReimb('meals', 'e.g., per-meal caps apply'), rb1: mkReimb('lodging', 'e.g., when not provided by customer'), rb2: mkReimb('tolls', 'e.g., tolls only, no admin fees'),
      lodgTip: mkHoverTip('reimbLodg', 256),
      show, btnPrimary, backBtn, backLabel, nextLabel, footerNote,
      typeMenu: { display: s.typeMenu ? 'block' : 'none' },

      pdEditValue: (s.edit && s.edit.sec === 'perdiem') ? s.edit.value : '',
      onPdInput: (e) => this.setState(st => ({ edit: { ...st.edit, value: e.target.value } })),
      onPdCommit: (e) => this.commitPd(e && e.target ? e.target.value : undefined),
      onPdKey: (e) => { if (e.key === 'Enter') this.commitPd(e.target.value); else if (e.key === 'Escape') this.setState({ edit: null }); },
      pdFocusRef: (el) => { if (el && !el.dataset.autofocused) { el.dataset.autofocused = '1'; el.focus(); } },
      delayEditValue: (s.edit && s.edit.sec === 'delay') ? s.edit.value : '',
      onDelayInput: (e) => this.setState(st => ({ edit: { ...st.edit, value: e.target.value } })),
      onDelayCommit: (e) => this.commitDelay(e && e.target ? e.target.value : undefined),
      onDelayKey: (e) => { if (e.key === 'Enter') this.commitDelay(e.target.value); else if (e.key === 'Escape') this.setState({ edit: null }); },
      cellEditValue: (s.edit && (s.edit.sec === 'labor' || s.edit.sec === 'equipment' || s.edit.sec === 'blended')) ? s.edit.value : '',
      onCellInput: (e) => this.setState(st => ({ edit: { ...st.edit, value: e.target.value } })),
      onCellCommit: (e) => this.commitEdit(e && e.target ? e.target.value : undefined),
      onCellKey: (e) => { if (e.key === 'Enter') this.commitEdit(e.target.value); else if (e.key === 'Escape') this.setState({ edit: null }); },
      on: {
        go1: () => this.setState({ step:1 }),
        go2: () => this.setState({ step:2 }),
        go3: () => this.setState({ step:3 }),
        next: () => {
          const st0 = this.state;
          if (st0.step === 1 && !(st0.shell.customer && (Object.values(st0.prices).some(v => v) || st0.customCats.some(c => c.on)))) return;
          if (st0.step >= 2) this.pruneAll();
          this.setState(st => ({ step: st.step >= 3 ? 4 : st.step + 1 }));
        },
        bookName: (e) => this.setState(st => ({ shell: { ...st.shell, bookName: e.target.value } })),
        shellCust: (e) => this.openShellMenu('customer', e),
        shellWork: (e) => this.openShellMenu('work', e),
        shellEff: (e) => this.openShellMenu('eff', e),
        shellExp: (e) => this.openShellMenu('exp', e),
        demoToggle: () => {
          if (this.state.demoData) {
            const stash = {};
            this.demoKeys().forEach(k => { stash[k] = this.state[k]; });
            this.demoStash = JSON.parse(JSON.stringify(stash));
            this.setState({ demoData: false, edit: null, ovrConfirm: null, laborMenu: null, equipMenu: null, blendedMenu: null, apprMenu: null, catTileMenu: null, laborOptsOpen: null, equipOptsOpen: null, hoverTip: null, shellMenu: null, ...this.emptyConfig() });
          } else {
            this.setState({ demoData: true, edit: null, ...(this.demoStash || {}) });
          }
        },
        back: () => this.setState(st => ({ step: Math.max(1, st.step - 1) })),
        goDetail: () => this.setState({ step:4 }),
        goWO: () => this.setState({ step:5, woTip:false }),
        toggleWoTip: () => this.setState(st => ({ woTip: !st.woTip, woBasisTip:false, woRegionTip:false })),
        toggleWoBasisTip: () => this.setState(st => ({ woBasisTip: !st.woBasisTip, woTip:false, woRegionTip:false })),
        toggleWoRegionTip: () => this.setState(st => ({ woRegionTip: !st.woRegionTip, woTip:false, woBasisTip:false })),
        toggleWoBasis: () => this.setState(st => ({ woBasis: st.woBasis === 'fixed' ? 'tande' : 'fixed', woTip:false })),
        openAddPeriod: () => this.setState({ addPeriodOpen:true, addPeriodError:'' }),
        closeAddPeriod: () => this.setState({ addPeriodOpen:false, addPeriodError:'' }),
        confirmAddPeriod: () => this.confirmAddPeriod(),
        apStart: (e) => { const v = e.target.value; this.setState(st => ({ addPeriod: { ...st.addPeriod, start: v }, addPeriodError: this.overlapError(v) })); },
        apEnd: (e) => this.setState(st => ({ addPeriod: { ...st.addPeriod, end: e.target.value } })),
        apPct: (e) => this.setState(st => ({ addPeriod: { ...st.addPeriod, pct: e.target.value } })),
        apModeCopy: () => this.setState(st => ({ addPeriod: { ...st.addPeriod, mode:'copy' } })),
        apModeBlank: () => this.setState(st => ({ addPeriod: { ...st.addPeriod, mode:'blank' } })),
        togglePeriodSel: () => this.setState(st => ({ periodSelOpen: !st.periodSelOpen, wwSelOpen:false })),
        toggleWwSel: () => this.setState(st => ({ wwSelOpen: !st.wwSelOpen, periodSelOpen:false })),
        mealsIncluded: () => this.setState(st => ({ pdMeals: { ...st.pdMeals, mode:'included' } })),
        mealsSeparate: () => this.setState(st => ({ pdMeals: { ...st.pdMeals, mode:'separate' } })),
        mealB: (e) => this.setState(st => ({ pdMeals: { ...st.pdMeals, b: e.target.value } })),
        mealL: (e) => this.setState(st => ({ pdMeals: { ...st.pdMeals, l: e.target.value } })),
        mealD: (e) => this.setState(st => ({ pdMeals: { ...st.pdMeals, d: e.target.value } })),
        mealBCode: (e) => this.setState(st => ({ pdMeals: { ...st.pdMeals, bCode: e.target.value } })),
        mealLCode: (e) => this.setState(st => ({ pdMeals: { ...st.pdMeals, lCode: e.target.value } })),
        mealDCode: (e) => this.setState(st => ({ pdMeals: { ...st.pdMeals, dCode: e.target.value } })),
        closeEndEarly: () => this.setState({ endEarly:null }),
        confirmEndEarly: () => this.confirmEndEarly(),
        eeDate: (e) => this.setState(st => ({ endEarly: { ...st.endEarly, date: e.target.value } })),
        pLabor: () => this.tog('prices','labor'),
        pEquipment: () => this.tog('prices','equipment'),
        pPerdiem: () => this.tog('prices','perdiem'),
        pDelays: () => this.tog('prices','delays'),
        toggleAddTier: () => this.setState(st => ({ addTier: !st.addTier })),
        openTierRules: () => this.setState(st => ({ tierRulesOpen: true, trSnapshot: JSON.parse(JSON.stringify(st.tierRules)) })),
        trCancel: () => this.setState(st => ({ tierRulesOpen: false, trDrag: null, holListOpen: false, trBpEdit: null, tierRules: st.trSnapshot || st.tierRules })),
        trSave: () => this.setState({ tierRulesOpen: false, tierRulesSet: true, trDrag: null, holListOpen: false, trBpEdit: null }),
        trWeeklyToggle: () => this.setState(st => ({ tierRules: { ...st.tierRules, weeklyOn: !st.tierRules.weeklyOn } })),
        trDailyToggle: () => this.setState(st => ({ tierRules: { ...st.tierRules, dailyOn: st.tierRules.dailyOn === false } })),
        trTypesToggle: () => this.setState(st => ({ tierRules: { ...st.tierRules, typesOn: st.tierRules.typesOn === false } })),
        utilLaborToggle: () => this.setState(st => ({ utilNamesLabor: !st.utilNamesLabor })),
        utilEquipToggle: () => this.setState(st => ({ utilNamesEquip: !st.utilNamesEquip })),
        laborOptsToggle: (e) => { const r = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ laborOptsOpen: st.laborOptsOpen ? null : { x: r.right, y: r.bottom + 6 }, equipOptsOpen: null, addActivity: false })); },
        equipOptsToggle: (e) => { const r = e.currentTarget.getBoundingClientRect(); this.setState(st => ({ equipOptsOpen: st.equipOptsOpen ? null : { x: r.right, y: r.bottom + 6 }, laborOptsOpen: null })); },
        trWeeklyHrs: (e) => this.setState(st => ({ tierRules: { ...st.tierRules, weeklyHrs: e.target.value } })),
        trWeeklyTier: (e) => this.setState(st => ({ tierRules: { ...st.tierRules, weeklyTier: e.target.value } })),
        trUpToggle: () => this.setState(st => ({ tierRules: { ...st.tierRules, upOn: !st.tierRules.upOn } })),
        trUpTier: (e) => this.setState(st => ({ tierRules: { ...st.tierRules, upTier: e.target.value } })),
        trUpHrs: (e) => this.setState(st => ({ tierRules: { ...st.tierRules, upHrs: e.target.value } })),
        holToggleList: () => this.setState(st => ({ holListOpen: !st.holListOpen })),
        holDraft: (e) => this.setState({ holDraft: e.target.value }),
        holKey: (e) => {
          if (e.key === 'Enter') {
            const name = (this.state.holDraft || '').trim();
            if (name) this.setState(st => ({ tierRules: { ...st.tierRules, holidays: [...st.tierRules.holidays, { name, on: true }] }, holDraft: '' }));
          } else if (e.key === 'Escape') {
            this.setState({ holDraft: '' });
          }
        },
        tierDraftName: (e) => this.setState(st => {
          const name = e.target.value;
          const d = { ...st.tierDraft, name };
          if (!d.abbrTouched) d.abbr = name.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase();
          return { tierDraft: d };
        }),
        tierDraftAbbr: (e) => this.setState(st => ({ tierDraft: { ...st.tierDraft, abbr: e.target.value, abbrTouched: e.target.value !== '' } })),
        tierDraftMult: (e) => this.setState(st => ({ tierDraft: { ...st.tierDraft, mult: e.target.value } })),
        addTierCommit: () => this.addTier(),
        billing: () => this.setState(st => ({ billing: !st.billing })),
        toggleAddActivity: () => this.setState(st => ({ addActivity: !st.addActivity })),
        activityDraft: (e) => this.setState({ activityDraft: e.target.value }),
        activityKey: (e) => {
          if (e.key === 'Enter') {
            const name = (this.state.activityDraft || '').trim();
            if (name) this.setState(st => ({ activities: [...st.activities, { name, on:true }], activityDraft:'' }));
          } else if (e.key === 'Escape') {
            this.setState({ addActivity:false, activityDraft:'' });
          }
        },
        toggleAddRegion: () => this.setState(st => ({ addRegion: !st.addRegion, regionError:'' })),
        regionDraft: (e) => this.setState({ regionDraft: e.target.value, regionError:'' }),
        regionBlur: () => this.setState({ addRegion:false, regionDraft:'', regionError:'' }),
        regionKey: (e) => {
          if (e.key === 'Enter') {
            const name = (this.state.regionDraft || '').trim();
            if (!name) return;
            const dup = this.state.regions.find(r => (r.name || '').trim().toLowerCase() === name.toLowerCase());
            if (dup) { this.setState({ regionError: 'A region named ‘' + dup.name + '’ already exists' }); return; }
            this.setState(st => ({ regions: [...st.regions, { name }], regionDraft:'', regionError:'' }));
          } else if (e.key === 'Escape') {
            this.setState({ addRegion:false, regionDraft:'', regionError:'' });
          }
        },
        setBasis: (e) => this.setState(st => ({ equipDims: { ...st.equipDims, basis: e.target.value } })),
        excBillable: () => this.setState(st => ({ exc: { ...st.exc, mode:'billable' } })),
        excNever: () => this.setState(st => ({ exc: { ...st.exc, mode:'never' } })),
        excOperator: () => this.setState(st => ({ exc: { ...st.exc, mode:'operator' } })),
        excCancel: () => this.setState({ exc:null }),
        excSave: () => this.setState(st => ({
          equipment: st.equipment.map((eq, j) => j === st.exc.row ? { ...eq, billing: { mode: st.exc.mode, operators: st.exc.operators.slice() } } : eq),
          exc: null,
        })),
        toggleStandby: () => this.setState(st => ({ equipDims: { ...st.equipDims, standby: !st.equipDims.standby } })),
        toggleCap: () => this.setState(st => ({ equipDims: { ...st.equipDims, cap: !st.equipDims.cap } })),
        openCatDialog: () => this.setState({ catDialog: { name:'', style:null, pct:'3', pctOf:'Labor' } }),
        renName: (e) => this.setState(st => ({ renameDialog: { ...st.renameDialog, name: e.target.value } })),
        renCancel: () => this.setState({ renameDialog:null }),
        confirmCancel: () => this.setState({ confirmDialog:null }),
        confirmOk: () => { const d = this.state.confirmDialog; this.setState({ confirmDialog:null }); if (d && d.onConfirm) d.onConfirm(); },
        renSave: () => {
          const d = this.state.renameDialog;
          if (!d || !(d.name || '').trim()) return;
          const newName = d.name.trim();
          this.setState(st => {
            const oldName = st.customCats[d.index].name;
            return {
              customCats: st.customCats.map((x, j) => {
                if (j === d.index) return { ...x, name: newName };
                if (x.style === 'percent' && x.pctOf === oldName) return { ...x, pctOf: newName };
                return x;
              }),
              renameDialog: null,
            };
          });
        },
        catCancel: () => this.setState({ catDialog:null }),
        catName: (e) => this.setState(st => ({ catDialog: { ...st.catDialog, name: e.target.value } })),
        catPct: (e) => this.setState(st => ({ catDialog: { ...st.catDialog, pct: e.target.value } })),
        catPctOf: (e) => this.setState(st => ({ catDialog: { ...st.catDialog, pctOf: e.target.value } })),
        catAdd: () => {
          const d = this.state.catDialog;
          if (!d || !(d.name || '').trim() || !d.style) return;
          this.setState(st => ({
            customCats: [...st.customCats, { name: d.name.trim(), style: d.style, on:true, approval:false, open:true, rows:[], pct: d.pct, pctOf: d.pctOf }],
            catDialog: null,
          }));
        },
        toggleTypeMenu: () => this.setState(st => ({ typeMenu: !st.typeMenu })),
        openLabor: () => this.tog('open','labor'),
        openEquip: () => this.tog('open','equipment'),
        openPerdiem: () => this.tog('open','perdiem'),
        openDelays: () => this.tog('open','delays'),
        openReimb: () => this.tog('open','reimb'),
        addLaborRow: (e) => { e.stopPropagation(); this.setState(st => ({ open:{...st.open,labor:true} })); this.appendLabor(); },
        addEquipRow: (e) => { e.stopPropagation(); this.setState(st => ({ open:{...st.open,equipment:true} })); this.appendEquip(); },
        addDelayRow: (e) => { e.stopPropagation(); this.setState(st => ({ open:{...st.open,delays:true} })); this.appendDelay(); },
      },
    };
  }

  render() {
    return renderTemplate(template, this.renderVals())
  }
}
