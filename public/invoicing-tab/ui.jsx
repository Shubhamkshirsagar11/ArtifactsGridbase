// Small UI primitives styled like shadcn/ui (New York), Tailwind only.

// ---------- Button ----------
const Button = React.forwardRef(({ variant = 'default', size = 'md', className = '', children, ...rest }, ref) => {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-400/60';
  const variants = {
    default:   'bg-brand-400 hover:bg-brand-500 active:bg-brand-600 text-white border-brand-500 shadow-sm disabled:hover:bg-brand-400',
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-card',
    ghost:     'bg-transparent hover:bg-slate-100 text-slate-700 border-transparent',
    soft:      'bg-slate-100 hover:bg-slate-200 text-slate-800 border-transparent',
    outline:   'bg-transparent hover:bg-slate-50 text-slate-700 border-slate-200',
    danger:    'bg-white hover:bg-red-50 text-red-700 border-red-200',
    dark:      'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-500 disabled:opacity-100',
  };
  const sizes = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-8 px-3 text-[13px]',
    lg: 'h-9 px-3.5 text-sm',
  };
  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
});

// ---------- Card ----------
const Card = ({ className = '', children, ...rest }) => (
  <div className={`bg-white border border-slate-200 rounded-lg shadow-card ${className}`} {...rest}>
    {children}
  </div>
);

// ---------- Status Badge (pill with dot) ----------
const STATUS_STYLES = {
  'Complete':    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-100' },
  'In Progress': { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500',     border: 'border-sky-100' },
  'Invoiced':    { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400',   border: 'border-slate-200' },
  'Active':      { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-100' },
  'Not Started': { bg: 'bg-slate-50',   text: 'text-slate-600',   dot: 'bg-slate-400',   border: 'border-slate-200' },
  'Open':        { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500',     border: 'border-sky-100' },
  'Closed':      { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400',   border: 'border-slate-200' },
};
const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Not Started'];
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-[12px]';
  const isPeriod = status === 'Period Open' || status === 'Period Closed';
  const cls = isPeriod
    ? (status === 'Period Open'
        ? 'bg-sky-100 text-sky-800 border-sky-300 font-semibold'
        : 'bg-slate-200 text-slate-700 border-slate-300 font-semibold')
    : `${s.bg} ${s.text} ${s.border} font-medium`;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${cls} ${pad} ${className}`}>
      {status === 'Period Closed'
        ? <IconLock size={11} className="text-slate-600 ml-[1px] mr-[1px]"/>
        : <span className={`w-1.5 h-1.5 rounded-full ${isPeriod ? 'bg-sky-600' : s.dot}`} />
      }
      {status}
    </span>
  );
};

// ---------- Function tag (Install / Remove / Transfer) ----------
const FUNCTION_STYLES = {
  'Install':  { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  'Transfer': { bg: 'bg-amber-50',    text: 'text-amber-800',   border: 'border-amber-200' },
  'Retire':   { bg: 'bg-amber-50',    text: 'text-amber-800',   border: 'border-amber-200' },
};
const FunctionTag = ({ fn }) => {
  const s = FUNCTION_STYLES[fn] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
  return (
    <span className={`inline-flex items-center px-1.5 h-5 rounded text-[11px] font-medium border ${s.bg} ${s.text} ${s.border}`}>
      {fn}
    </span>
  );
};

// ---------- Checkbox (controlled, with indeterminate) ----------
const Checkbox = ({ checked, indeterminate, disabled, onChange, label, ariaLabel, className = '' }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label className={`inline-flex items-center gap-2 select-none ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      <span className="relative inline-flex">
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          checked={!!checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
        />
        <span className={`
          w-[15px] h-[15px] rounded border flex items-center justify-center transition-colors
          ${checked ? 'bg-brand-400 border-brand-500' : indeterminate ? 'bg-brand-400 border-brand-500' : 'bg-white border-slate-300 peer-hover:border-slate-400'}
          peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-brand-400/60
        `}>
          {checked && (
            <svg viewBox="0 0 16 16" width="11" height="11" className="text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          )}
          {!checked && indeterminate && (
            <span className="w-2 h-0.5 bg-white rounded" />
          )}
        </span>
      </span>
      {label && <span className="text-[13px] text-slate-700">{label}</span>}
    </label>
  );
};

// ---------- Tooltip ----------
const Tooltip = ({ content, children, side = 'top', align = 'center', maxWidth = 260 }) => {
  const [open, setOpen] = React.useState(false);
  const v = side === 'top' ? 'bottom-full mb-1' : side === 'bottom' ? 'top-full mt-1' : '';
  const h = side === 'left' || side === 'right' ? '' :
    align === 'start' ? 'left-0'
    : align === 'end' ? 'right-0'
    : 'left-1/2 -translate-x-1/2';
  const sidePositions = {
    right: 'left-full ml-1 top-1/2 -translate-y-1/2',
    left:  'right-full mr-1 top-1/2 -translate-y-1/2',
  };
  const positionCls = (side === 'left' || side === 'right') ? sidePositions[side] : `${v} ${h}`;
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open && (
        <span
          className={`absolute ${positionCls} z-50 pointer-events-none px-2 py-1.5 rounded-md bg-slate-900 text-white text-[11.5px] leading-snug font-medium shadow-pop text-left normal-case tracking-normal`}
          style={{ width: 'max-content', maxWidth }}
        >
          {content}
        </span>
      )}
    </span>
  );
};

// ---------- Skeleton ----------
const Skeleton = ({ className = '' }) => (
  <span className={`inline-block bg-slate-200/80 rounded animate-pulse ${className}`} />
);

// ---------- Dialog ----------
const Dialog = ({ open, onClose, children, maxWidth = 'max-w-md' }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-pop border border-slate-200 w-full ${maxWidth} dialog-enter`}>
        {children}
      </div>
    </div>
  );
};

// ---------- Sonner-style toast ----------
const ToastCtx = React.createContext(null);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);
  // Track which toast id is currently the "latest undoable" — only the most
  // recently pushed action toast can be undone. Older ones lose their handle
  // as soon as a new one supersedes them.
  const latestActionRef = React.useRef(null);
  const dismiss = React.useCallback((id) => {
    setToasts((s) => s.filter((x) => x.id !== id));
    if (latestActionRef.current === id) latestActionRef.current = null;
  }, []);
  const push = React.useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    const item = { id, kind: 'success', duration: t.action ? 5000 : 4200, ...t };
    setToasts((s) => [...s, item]);
    if (item.action) latestActionRef.current = id;
    setTimeout(() => dismiss(id), item.duration);
    return id;
  }, [dismiss]);
  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const canUndo = !!t.action && latestActionRef.current === t.id;
          return (
            <div key={t.id} className="pointer-events-auto bg-white border border-slate-200 shadow-pop rounded-lg pl-3 pr-3 py-3 flex items-start gap-2.5 min-w-[300px] max-w-[420px] dialog-enter">
              <span className={`mt-0.5 ${t.kind === 'success' ? 'text-emerald-600' : 'text-slate-600'}`}>
                {t.kind === 'success' ? <IconCheckCircle2 size={18}/> : <IconInfo size={18}/>}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-slate-900 leading-tight">{t.title}</div>
                {t.description && <div className="text-[12.5px] text-slate-600 mt-0.5 leading-snug">{t.description}</div>}
              </div>
              {t.action && (
                <button
                  type="button"
                  disabled={!canUndo}
                  onClick={() => {
                    if (!canUndo) return;
                    t.action.onClick();
                    dismiss(t.id);
                  }}
                  className={`text-[12.5px] font-semibold px-2 py-1 rounded transition-colors shrink-0 ${
                    canUndo
                      ? 'text-brand-600 hover:bg-brand-50 cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {t.action.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
};
const useToast = () => React.useContext(ToastCtx);

// ---------- Segmented control ----------
const Segmented = ({ value, onChange, options, size = 'md', className = '' }) => {
  const sz = size === 'sm' ? 'h-7 text-[12px] px-2.5' : 'h-8 text-[13px] px-3';
  return (
    <div className={`inline-flex items-center bg-slate-100 border border-slate-200 rounded-md p-0.5 ${className}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`${sz} rounded font-medium transition-colors ${active ? 'bg-white text-slate-900 shadow-card' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

// ---------- Dropdown menu (very lightweight) ----------
const Dropdown = ({ trigger, children, align = 'right', menuClassName = '' }) => {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <span className="relative inline-flex" ref={rootRef}>
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-[calc(100%+4px)] z-50 min-w-[200px] bg-white border border-slate-200 rounded-lg shadow-pop p-1 fade-in ${menuClassName}`}>
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </span>
  );
};
const MenuItem = ({ children, onClick, className = '', leftIcon = null, active = false }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-2 h-8 rounded text-[13px] text-slate-700 hover:bg-slate-100 flex items-center gap-2 ${active ? 'bg-slate-100' : ''} ${className}`}
  >
    {leftIcon}
    <span className="flex-1">{children}</span>
  </button>
);

Object.assign(window, {
  Button, Card, StatusBadge, FunctionTag, Checkbox, Tooltip,
  Skeleton, Dialog, ToastProvider, useToast, Segmented, Dropdown, MenuItem,
});
