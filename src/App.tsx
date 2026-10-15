import { useState } from 'react'

type Scenario = 'normal' | 'unavailable' | 'failed'
type MessageKind = 'welcome' | 'diagnostic' | 'unavailable' | 'voice'
type Message = { id: number; from: 'copilot' | 'user'; text: string; time: string; kind?: MessageKind }

const baseMessage: Message = { id: 1, from: 'copilot', kind: 'welcome', text: 'Hi Priyansh! I’m your Cheerio Setup Copilot. I can help you troubleshoot setup issues, understand errors, and get campaigns moving.', time: '10:41 AM' }
const quickQuestions = ['My WhatsApp template was rejected', 'Why is my campaign not sending?', 'Help me connect an integration']
const initialExampleValue = 'Summer sale — 20% off'
const scenarioLabels: Record<Scenario, string> = { normal: 'Normal resolution', unavailable: 'Status unavailable', failed: 'Action failed' }

function App() {
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([baseMessage])
  const [input, setInput] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [exampleValue, setExampleValue] = useState(initialExampleValue)
  const [saved, setSaved] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [status, setStatus] = useState<'rejected' | 'pending'>('rejected')
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [actionFailed, setActionFailed] = useState(false)
  const [listening, setListening] = useState(false)
  const [sent, setSent] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showHandoff, setShowHandoff] = useState(false)
  const [handoffPrepared, setHandoffPrepared] = useState(false)

  const hasDiagnostic = messages.some((message) => message.kind === 'diagnostic' || message.kind === 'unavailable')

  const resetDemo = (nextScenario: Scenario = 'normal') => {
    setMessages([baseMessage]); setInput(''); setShowEditor(false); setSaved(false); setStatus('rejected'); setExampleValue(initialExampleValue); setCopilotOpen(false)
    setActionFailed(false); setListening(false); setSent(false); setShowHandoff(false); setHandoffPrepared(false); setScenario(nextScenario)
  }

  const chooseScenario = (nextScenario: Scenario) => { resetDemo(nextScenario); setShowControls(false); setCopilotOpen(true) }

  const addAssistantResponse = () => {
    setMessages((current) => [...current, {
      id: Date.now() + 1, from: 'copilot', time: '10:42 AM', kind: scenario === 'unavailable' ? 'unavailable' : 'diagnostic',
      text: scenario === 'unavailable'
        ? 'I can’t retrieve the mock template status right now. I don’t want to guess, so I’ll share general guidance and a way to reach a person.'
        : 'I found a likely issue in your template configuration. I’ve prepared a diagnostic below so we can fix it together.',
    }])
    setSent(false)
  }

  const sendMessage = (text = input) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setMessages((current) => [...current, { id: Date.now(), from: 'user', text, time: now }])
    setInput(''); setSent(true); setTimeout(addAssistantResponse, 450)
  }

  const startVoice = () => {
    setListening(true)
    setTimeout(() => {
      setListening(false)
      setMessages((current) => [...current,
        { id: Date.now(), from: 'user', text: '“My WhatsApp template was rejected. What should I do?”', time: '10:43 AM', kind: 'voice' },
        { id: Date.now() + 1, from: 'copilot', text: scenario === 'unavailable' ? 'I can’t verify the mock status in this demo, so I’ll keep the advice general.' : 'I’ll check the template setup for you. In this demo, I found a missing example value for a variable.', time: '10:43 AM', kind: scenario === 'unavailable' ? 'unavailable' : 'diagnostic' },
      ])
    }, 850)
  }

  const confirmAction = () => {
    setShowConfirm(false)
    if (scenario === 'failed') { setActionFailed(true); return }
    setStatus('pending')
  }

  const openHandoff = () => { setHandoffPrepared(false); setShowHandoff(true) }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">C</span><span>cheerio</span></div>
      <div className="workspace-switcher"><span className="avatar tiny">AC</span><span><b>Acme Corp</b><small>Business workspace</small></span><span className="chevron">⌄</span></div>
      <nav><div className="nav-label">WORKSPACE</div>{['Overview', 'Campaigns', 'Contacts', 'Automations', 'AI Agents', 'Analytics'].map((item, index) => <button key={item} className={`nav-item ${index === 0 ? 'active' : ''}`}><span className="nav-icon">{['⌂', '▣', '♧', '⌁', '✦', '▥'][index]}</span>{item}{item === 'AI Agents' && <span className="new-pill">NEW</span>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><span className="nav-icon">?</span>Help center</button><button className="nav-item"><span className="nav-icon">⚙</span>Settings</button><div className="profile"><span className="avatar">PS</span><span><b>Priyansh Shah</b><small>Admin</small></span><span className="dots">•••</span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumbs"><span>Acme Corp</span><span>/</span><b>Overview</b></div><div className="top-actions"><span className="demo-badge"><i /> Concept prototype</span><div className="controls-wrap"><button aria-expanded={showControls} aria-haspopup="menu" className="controls-button" onClick={() => setShowControls((open) => !open)}>Demo controls <span>⌄</span></button>{showControls && <div className="controls-menu" role="menu"><span className="menu-label">TRY A SCENARIO</span>{(['normal', 'unavailable', 'failed'] as Scenario[]).map((item) => <button role="menuitem" key={item} className={scenario === item ? 'selected' : ''} onClick={() => chooseScenario(item)}><span className={`scenario-dot ${item}`} />{scenarioLabels[item]}{scenario === item && <b>✓</b>}</button>)}<div className="menu-divider" /><button role="menuitem" className="reset-button" onClick={() => { resetDemo(); setShowControls(false) }}>↻ Reset demo</button></div>}</div><button aria-label="Search" className="icon-button">⌕</button><button aria-label="Notifications" className="icon-button notification">♧<i /></button><span className="avatar">PS</span></div></header>
      <section className="page-body"><div className="welcome-line"><div><p className="eyebrow">WEDNESDAY, OCTOBER 15, 2026</p><h1>Good morning, Priyansh <span>✦</span></h1><p className="muted">Here’s what’s happening with your messaging workspace.</p></div><button className="outline-button" onClick={() => setCopilotOpen(true)}>＋ New campaign</button></div>
        <section className="copilot-banner"><div className="sparkle-orb">✦</div><div className="banner-copy"><div className="eyebrow purple">CHEERIO COPILOT</div><h2>Need a hand setting things up?</h2><p>Ask about WhatsApp, campaigns, automations, or integrations. I’ll guide you step by step.</p></div><button className="primary-button" onClick={() => setCopilotOpen(true)}>Ask Cheerio Copilot <span>→</span></button></section>
        <div className="section-heading"><div><h2>Workspace overview</h2><p className="muted">A snapshot of your messaging activity.</p></div><button className="date-button">Last 30 days　⌄</button></div>
        <div className="stat-grid"><Stat label="Messages sent" value="24,890" change="+18.4%" icon="↗" /><Stat label="Active contacts" value="8,462" change="+6.8%" icon="♧" /><Stat label="Campaigns" value="12" change="+2 this month" icon="▣" /><Stat label="Avg. delivery rate" value="96.8%" change="+1.2%" icon="✓" /></div>
        <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-head"><div><h3>Message activity</h3><p className="muted">Sent messages over time</p></div><div className="legend"><span><i className="dot blue" />Sent</span><span><i className="dot soft" />Delivered</span></div></div><div className="chart"><div className="y-labels"><span>1k</span><span>750</span><span>500</span><span>250</span><span>0</span></div><div className="chart-area"><div className="grid-lines" /><svg viewBox="0 0 600 190" preserveAspectRatio="none"><path className="area" d="M0,157 C35,150 45,124 80,137 S125,107 160,121 S205,74 240,100 S285,75 320,97 S350,70 385,90 S425,35 460,61 S505,50 540,71 S575,39 600,52 L600,190 L0,190Z" /><path className="line" d="M0,157 C35,150 45,124 80,137 S125,107 160,121 S205,74 240,100 S285,75 320,97 S350,70 385,90 S425,35 460,61 S505,50 540,71 S575,39 600,52" /></svg><div className="x-labels"><span>Sep 16</span><span>Sep 23</span><span>Sep 30</span><span>Oct 7</span><span>Oct 14</span></div></div></div></section><section className="panel activity-panel"><div className="panel-head"><div><h3>Recent activity</h3><p className="muted">Latest workspace updates</p></div><button className="text-button">View all →</button></div>{[['✓','Summer sale campaign','Campaign completed','2 min ago','green'],['▣','Welcome series','Campaign scheduled','1 hr ago','blue'],['⚠','order_updates_v3','Template needs attention','3 hrs ago','orange'],['♧','New contacts imported','342 contacts added','Yesterday','purple']].map(([icon,title,sub,time,color]) => <div className="activity-row" key={title}><span className={`activity-icon ${color}`}>{icon}</span><span className="activity-copy"><b>{title}</b><small>{sub}</small></span><small className="time">{time}</small></div>)}</section></div>
      </section>
    </main>

    {copilotOpen && <div className="copilot-overlay"><section aria-label="Cheerio Copilot support assistant" aria-modal="true" role="dialog" className="copilot-panel"><div className="copilot-header"><div className="copilot-title"><span className="copilot-icon">✦</span><span><b>Cheerio Copilot</b><small><i /> Online · Demo mode</small></span></div><button aria-label="Close Copilot" className="close-button" onClick={() => setCopilotOpen(false)}>×</button></div><div className="chat-scroll"><div className="source-note"><b>Demo knowledge</b><span> Help-center guidance and mock account diagnostics are clearly labelled.</span></div>{messages.map((message) => <div key={message.id} className={`message-row ${message.from}`}><div className="message-avatar">{message.from === 'copilot' ? '✦' : 'PS'}</div><div className="message-content"><div className={`bubble ${message.kind || ''}`}>{message.text}</div><small className="message-time">{message.time}</small>{message.kind === 'welcome' && <div className="suggestions"><p>Try asking me:</p>{quickQuestions.map((q) => <button key={q} onClick={() => sendMessage(q)}>{q}<span>→</span></button>)}</div>}{(message.kind === 'diagnostic' || message.kind === 'unavailable') && <Diagnostic scenario={scenario} status={status} saved={saved} actionFailed={actionFailed} onEdit={() => setShowEditor(true)} onReview={() => setShowConfirm(true)} onTalk={openHandoff} />}</div></div>)}{sent && <div className="typing" role="status"><span /> <span /> <span /> Copilot is checking your workspace…</div>}</div><div className="chat-footer"><div className={`voice-toast ${listening ? 'visible' : ''}`} role="status"><span className="listening-ring">◉</span>{listening ? 'Listening to your demo…' : 'Voice demo ready'}</div><div className="input-wrap"><textarea aria-label="Ask Cheerio Copilot" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder="Ask anything about your setup…" rows={1} /><button aria-label="Start voice demo" className="mic-button" onClick={startVoice}>♩</button><button aria-label="Send message" className="send-button" onClick={() => sendMessage()}>↑</button></div><div className="footer-note">Demo data only — no live account or external action. <button onClick={startVoice}>Try voice demo</button></div></div></section></div>}
    {showEditor && <Editor value={exampleValue} setValue={setExampleValue} saved={saved} onSave={() => { setSaved(true); setShowEditor(false) }} onClose={() => setShowEditor(false)} />}
    {showConfirm && <ConfirmModal failed={scenario === 'failed'} onClose={() => setShowConfirm(false)} onConfirm={confirmAction} />}
    {status === 'pending' && <div className="toast-success"><span>✓</span><div><b>Action simulated successfully</b><small>summer_offer_v2 is now Pending review — demo only.</small></div><button onClick={() => setStatus('rejected')}>×</button></div>}
    {actionFailed && <div className="toast-failure"><span>!</span><div><b>Simulated action failed</b><small>Your saved example value is still here. You can retry or ask a person.</small></div><button onClick={() => setActionFailed(false)}>×</button></div>}
    {hasDiagnostic && (status === 'pending' || scenario !== 'normal' || actionFailed) && <div className="support-float"><span>?</span><div><b>Need more help?</b><small>Our human support team is here.</small></div><button onClick={openHandoff}>Talk to a person →</button></div>}
    {showHandoff && <Handoff scenario={scenario} status={status} saved={saved} actionFailed={actionFailed} prepared={handoffPrepared} onClose={() => setShowHandoff(false)} onPrepare={() => setHandoffPrepared(true)} />}
  </div>
}

function Stat({ label, value, change, icon }: { label: string; value: string; change: string; icon: string }) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong>{value}</strong><small><i>↗</i> {change}</small></div> }

function Diagnostic({ scenario, status, saved, actionFailed, onEdit, onReview, onTalk }: { scenario: Scenario; status: string; saved: boolean; actionFailed: boolean; onEdit: () => void; onReview: () => void; onTalk: () => void }) {
  if (scenario === 'unavailable') return <div className="diagnostic-card unavailable-card"><div className="diagnostic-head"><div><span className="eyebrow blue-label">GENERAL GUIDANCE</span><h3>Template status unavailable</h3></div><span className="status-pill unavailable">Unavailable</span></div><div className="diagnostic-body"><div className="reason neutral"><span className="info-icon">i</span><span><b>I can’t verify the current status</b><small>I won’t guess or present this as a real account response.</small></span></div><p>Make sure every variable has a realistic example, then check the template in your WhatsApp provider. If you still need help, a person can review it with you.</p></div><div className="diagnostic-actions"><button className="outline-button" onClick={onTalk}>Talk to a person <span>→</span></button></div><SourceCard type="guidance" /></div>
  return <div className="diagnostic-card"><div className="diagnostic-head"><div><span className="eyebrow purple">MOCK ACCOUNT DIAGNOSTIC</span><h3>summer_offer_v2</h3></div><span className={`status-pill ${status === 'pending' ? 'pending' : actionFailed ? 'failed' : 'rejected'}`}>{status === 'pending' ? 'Pending review — demo only' : actionFailed ? 'Action failed' : 'Rejected'}</span></div><div className="diagnostic-body"><div className={`reason ${actionFailed ? 'failure' : status === 'pending' ? 'success' : ''}`}><span className={actionFailed ? 'failure-icon' : status === 'pending' ? 'success-icon' : 'warning-icon'}>{actionFailed ? '!' : status === 'pending' ? '✓' : '!'}</span><span><b>{actionFailed ? 'We couldn’t complete the simulated repair' : status === 'pending' ? 'Resubmission simulated' : 'Example value missing for variable {{1}}'}</b><small>{actionFailed ? 'Nothing was submitted. Your saved work is preserved.' : status === 'pending' ? 'Your updated example value is ready for review.' : 'This is sample data, not a real Cheerio or Meta response.'}</small></span></div><p>{actionFailed ? 'The demo action hit an example failure. You can retry the same proposed action or escalate with the details already collected.' : status === 'pending' ? 'The prototype simulated the action — no real submission was made.' : 'Your message uses a variable, but the template is missing an example that shows what should go there. Adding one helps reviewers understand the message context.'}</p></div><div className="diagnostic-actions">{status !== 'pending' && !actionFailed && <button className="outline-button" onClick={onEdit}>Open template editor <span>→</span></button>}{saved && status !== 'pending' && <button className="primary-button" onClick={onReview}>{actionFailed ? 'Retry simulated action' : 'Review proposed action'} <span>→</span></button>}{(actionFailed || status === 'pending') && <button className="support-link" onClick={onTalk}>Talk to a person <span>→</span></button>}</div><SourceCard type="diagnostic" /></div>
}

function SourceCard({ type }: { type: 'guidance' | 'diagnostic' }) { return <div className="source-card"><span className="source-card-icon">{type === 'guidance' ? '▤' : '◉'}</span><span><b>{type === 'guidance' ? 'Template troubleshooting — demo help article' : 'Mock account diagnostics'}</b><small>{type === 'guidance' ? 'Help-center guidance · General advice' : 'Simulated workspace data · Not a live response'}</small></span><span className="source-arrow">↗</span></div> }

function Editor({ value, setValue, saved, onSave, onClose }: { value: string; setValue: (v: string) => void; saved: boolean; onSave: () => void; onClose: () => void }) { return <div className="modal-backdrop"><div aria-label="Template editor" aria-modal="true" role="dialog" className="editor-modal"><div className="modal-top"><div><span className="eyebrow purple">TEMPLATE EDITOR</span><h2>summer_offer_v2</h2></div><button aria-label="Close template editor" className="close-button" onClick={onClose}>×</button></div><div className="editor-tabs"><span className="active">Message body</span><span>Preview</span></div><label>Message body <span>Required</span></label><div className="message-editor">Hi {'{{1}}'}, <span className="highlight">get 20% off your next order with code SUMMER20.</span></div><label htmlFor="example-value">Example value for <code>{'{{1}}'}</code><span>Required</span></label><input id="example-value" autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. Priyansh" /><p className="field-help">Add a realistic example so reviewers can understand how the variable will look.</p><div className="preview-box"><span className="preview-label">PREVIEW</span><p>Hi <b>{value || 'your customer'}</b>, get 20% off your next order with code SUMMER20.</p></div><div className="modal-actions"><button className="outline-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={!value.trim()} onClick={onSave}>{saved ? 'Saved ✓' : 'Save changes'}</button></div></div></div> }

function ConfirmModal({ failed, onClose, onConfirm }: { failed: boolean; onClose: () => void; onConfirm: () => void }) { return <div className="modal-backdrop"><div aria-label="Review proposed action" aria-modal="true" role="dialog" className="confirm-modal"><button aria-label="Close confirmation" className="close-button" onClick={onClose}>×</button><span className="modal-icon">↻</span><h2>{failed ? 'Retry proposed action?' : 'Review proposed action'}</h2><p>{failed ? 'The previous simulated attempt failed. Retry the same repair with your saved example value?' : <>You’re about to simulate resubmitting <b>summer_offer_v2</b> for review with the new example value.</>}</p><div className="demo-warning"><b>Demo only</b><span>No real WhatsApp or Meta submission will be made.</span></div><div className="modal-actions"><button className="outline-button" onClick={onClose}>Go back</button><button autoFocus className="primary-button" onClick={onConfirm}>{failed ? 'Retry simulated action' : 'Confirm simulated action'}</button></div></div></div> }

function Handoff({ scenario, status, saved, actionFailed, prepared, onClose, onPrepare }: { scenario: Scenario; status: string; saved: boolean; actionFailed: boolean; prepared: boolean; onClose: () => void; onPrepare: () => void }) { const reason = scenario === 'unavailable' ? 'Template status could not be retrieved in the demo.' : actionFailed ? 'The simulated repair action failed.' : 'User requested human review after the simulated resolution.'; return <div className="modal-backdrop"><div aria-label="Human support handoff preview" aria-modal="true" role="dialog" className="handoff-modal"><div className="modal-top"><div><span className="eyebrow purple">HUMAN SUPPORT PREVIEW</span><h2>{prepared ? 'Demo handoff prepared' : 'Talk to a person'}</h2></div><button aria-label="Close handoff preview" className="close-button" onClick={onClose}>×</button></div>{prepared ? <div className="prepared-state"><span>✓</span><h3>Ready for a support teammate</h3><p>This prototype prepared the handoff details locally. No real support ticket was created.</p></div> : <><p className="handoff-intro">Here’s what we would share so you don’t have to repeat yourself.</p><div className="handoff-list"><div><b>Issue summary</b><span>WhatsApp template setup needs review</span></div><div><b>Template and status</b><span><code>summer_offer_v2</code> · {scenario === 'unavailable' ? 'Status unavailable' : status === 'pending' ? 'Pending review — demo only' : 'Rejected (mock)'}</span></div><div><b>Steps attempted</b><span>Checked the template guidance{scenario !== 'unavailable' ? '; reviewed the missing example value' : ''}{saved ? '; saved an example value' : ''}</span></div><div><b>Reason for escalation</b><span>{reason}</span></div></div><div className="demo-warning"><b>Demo only</b><span>Review this preview before simulating the handoff.</span></div><div className="modal-actions"><button className="outline-button" onClick={onClose}>Keep troubleshooting</button><button autoFocus className="primary-button" onClick={onPrepare}>Simulate handoff</button></div></>}</div></div> }

export default App
