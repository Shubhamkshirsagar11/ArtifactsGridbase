/**
 * dcRuntime — a compact interpreter that renders the original design's
 * declarative template (`{{ }}` holes + <sc-for>/<sc-if> directives) into real
 * React elements, evaluated against a view-model scope (the component's
 * `renderVals()` output).
 *
 * Why an interpreter instead of hand-written JSX? The source design is a single
 * ~1,760-line template driven by ~2,500 lines of view-model logic. Interpreting
 * the exact template against the ported logic reproduces the design 1:1 with far
 * less translation risk than re-authoring every element by hand. It also sidesteps
 * the HTML table "foster-parenting" bug that broke the design's own standalone
 * export: we rename table tags before parsing so `<sc-for>`/`<sc-if>` survive
 * inside <table>/<tr>/<td>, then map them back when creating elements.
 */
import React from 'react'

/* ---- attribute-name normalization (DOMParser lowercases every attr) ---- */
const ATTR_MAP: Record<string, string> = {
  onclick: 'onClick',
  oninput: 'onInput',
  onkeydown: 'onKeyDown',
  onkeyup: 'onKeyUp',
  onkeypress: 'onKeyPress',
  onblur: 'onBlur',
  onfocus: 'onFocus',
  onchange: 'onChange',
  onmouseenter: 'onMouseEnter',
  onmouseleave: 'onMouseLeave',
  onmousedown: 'onMouseDown',
  onmousemove: 'onMouseMove',
  onmouseup: 'onMouseUp',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  viewbox: 'viewBox',
  tabindex: 'tabIndex',
  class: 'className',
  for: 'htmlFor',
  autofocus: 'autoFocus',
  maxlength: 'maxLength',
  crossorigin: 'crossOrigin',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-miterlimit': 'strokeMiterlimit',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'text-anchor': 'textAnchor',
  'stop-color': 'stopColor',
}

/* Attributes that are design-time hints or unsupported directives — dropped. */
const DROP_ATTRS = new Set(['as', 'list', 'style-hover', 'data-screen-label', 'data-dc-script'])

/* Table-family tags are renamed during preprocessing; unmap on element creation. */
const TAG_UNMAP: Record<string, string> = {
  'dc-table': 'table',
  'dc-thead': 'thead',
  'dc-tbody': 'tbody',
  'dc-tfoot': 'tfoot',
  'dc-tr': 'tr',
  'dc-td': 'td',
  'dc-th': 'th',
}

/* ---- expression evaluation against a scope object ---- */
const exprCache = new Map<string, (s: any) => any>()
function compile(expr: string): (s: any) => any {
  let fn = exprCache.get(expr)
  if (!fn) {
    try {
      // `with` lets bare identifiers (on, shellD, loop vars…) resolve from scope
      // (and, via the prototype chain, from enclosing loop scopes).
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      fn = new Function('$s', `with($s){ return (${expr}); }`) as (s: any) => any
    } catch {
      fn = () => undefined
    }
    exprCache.set(expr, fn)
  }
  return fn
}
function evalExpr(expr: string, scope: any): any {
  try {
    return compile(expr)(scope)
  } catch {
    return undefined
  }
}

/* ---- holes: {{ expr }} ---- */
function singleHole(s: string): string | null {
  const m = /^\s*\{\{([\s\S]*?)\}\}\s*$/.exec(s)
  return m ? m[1] : null
}
/** Evaluate an attribute/text value that may contain holes. A value that is a
 *  single hole preserves the raw evaluated type (object, function, element…);
 *  a mixed value is interpolated to a string. */
function interpolate(s: string, scope: any): any {
  const single = singleHole(s)
  if (single != null) return evalExpr(single, scope)
  if (s.indexOf('{{') < 0) return s
  return s.replace(/\{\{([\s\S]*?)\}\}/g, (_m, e) => {
    const v = evalExpr(e, scope)
    return v == null ? '' : String(v)
  })
}

/* ---- inline style strings -> React style objects ---- */
const styleCache = new Map<string, React.CSSProperties>()
function cssProp(p: string): string {
  if (p.startsWith('--')) return p
  return p.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
}
function cssToObj(css: string): React.CSSProperties {
  let o = styleCache.get(css)
  if (o) return o
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim()
    if (!prop) continue
    out[cssProp(prop)] = decl.slice(i + 1).trim()
  }
  o = out as React.CSSProperties
  styleCache.set(css, o)
  return o
}
function styleValue(val: string, scope: any): React.CSSProperties | undefined {
  const single = singleHole(val)
  if (single != null) return evalExpr(single, scope)
  return cssToObj(val)
}

/* ---- the walk ---- */
let cachedRoots: ChildNode[] | null = null

function preprocess(html: string): string {
  // Rename table tags so the HTML parser doesn't foster-parent <sc-for>/<sc-if>
  // out of tables. Matches only the tag token (lookahead for whitespace, > or /).
  return html.replace(/<(\/?)(table|thead|tbody|tfoot|tr|td|th)(?=[\s/>])/gi, '<$1dc-$2')
}

function parseTemplate(html: string): ChildNode[] {
  const doc = new DOMParser().parseFromString('<dc-root>' + preprocess(html) + '</dc-root>', 'text/html')
  const root = doc.querySelector('dc-root')
  return root ? Array.from(root.childNodes) : []
}

function renderText(text: string, scope: any): React.ReactNode {
  if (text.indexOf('{{') < 0) {
    // Drop whitespace-only text nodes (indentation/newlines) to avoid stray
    // text — real spacing in this design comes from fl/gap, not source whitespace.
    return text.trim() === '' ? null : text
  }
  return interpolate(text, scope)
}

function renderChildren(el: Element, scope: any): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const kids = el.childNodes
  for (let i = 0; i < kids.length; i++) {
    const n = kids[i]
    if (n.nodeType === 3) {
      const r = renderText(n.textContent || '', scope)
      if (r != null && r !== '') out.push(r)
    } else if (n.nodeType === 1) {
      const r = renderEl(n as Element, scope, i)
      if (r != null) out.push(r)
    }
    // comments (8) skipped
  }
  return out
}

function renderFor(el: Element, scope: any, key: number): React.ReactNode {
  const listAttr = el.getAttribute('list') || ''
  const inner = singleHole(listAttr)
  const list = inner != null ? evalExpr(inner, scope) : undefined
  if (!Array.isArray(list)) return null
  const as = el.getAttribute('as') || 'item'
  const frags: React.ReactNode[] = []
  for (let idx = 0; idx < list.length; idx++) {
    const childScope = Object.create(scope)
    childScope[as] = list[idx]
    const kids = renderChildren(el, childScope)
    frags.push(React.createElement(React.Fragment, { key: `${key}:${idx}` }, ...kids))
  }
  return frags
}

function renderIf(el: Element, scope: any, key: number): React.ReactNode {
  const valAttr = el.getAttribute('value') || ''
  const inner = singleHole(valAttr)
  const cond = inner != null ? evalExpr(inner, scope) : false
  if (!cond) return null
  const kids = renderChildren(el, scope)
  return React.createElement(React.Fragment, { key }, ...kids)
}

function renderEl(el: Element, scope: any, key: number): React.ReactNode {
  const rawTag = el.tagName.toLowerCase()
  if (rawTag === 'sc-for') return renderFor(el, scope, key)
  if (rawTag === 'sc-if') return renderIf(el, scope, key)

  const tag = TAG_UNMAP[rawTag] || rawTag
  const props: Record<string, any> = { key }
  const attrs = el.attributes
  for (let i = 0; i < attrs.length; i++) {
    const name = attrs[i].name
    if (DROP_ATTRS.has(name) || name.startsWith('hint-placeholder')) continue
    const value = attrs[i].value
    if (name === 'style') {
      props.style = styleValue(value, scope)
      continue
    }
    const prop = ATTR_MAP[name] || name
    props[prop] = interpolate(value, scope)
  }

  const children = renderChildren(el, scope)
  return children.length
    ? React.createElement(tag, props, ...children)
    : React.createElement(tag, props)
}

/**
 * Render the whole template against `scope` (a view-model object, typically the
 * component's `renderVals()` output). The template is parsed once and cached.
 */
export function renderTemplate(templateHtml: string, scope: any): React.ReactNode {
  if (!cachedRoots) cachedRoots = parseTemplate(templateHtml)
  const out: React.ReactNode[] = []
  for (let i = 0; i < cachedRoots.length; i++) {
    const n = cachedRoots[i]
    if (n.nodeType === 1) out.push(renderEl(n as Element, scope, i))
    else if (n.nodeType === 3) {
      const r = renderText(n.textContent || '', scope)
      if (r != null && r !== '') out.push(r)
    }
  }
  return out
}
