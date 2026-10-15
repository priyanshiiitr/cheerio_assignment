# Cheerio Setup Copilot

Clickable React + TypeScript + Vite prototype for a Cheerio embedded support assistant.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Demo flow

1. Click **Ask Cheerio Copilot** on the overview dashboard.
2. Choose **My WhatsApp template was rejected**, or type the full sample question.
3. Open the template editor, change the example value, and save.
4. Review and confirm the simulated resubmission.
5. See the honest **Pending review — demo only** outcome and human-support prompt.

Use **Demo controls** in the top navigation to switch between:

- **Normal resolution** — edit the missing example value and simulate a successful resubmission.
- **Status unavailable** — see a no-guessing response with general help-center guidance and escalation.
- **Action failed** — preserve the saved value, show a failure state, retry the simulated action, or prepare a human-support handoff.

The support handoff preview shows the issue summary, template and status, attempted steps, and escalation reason. **Simulate handoff** only prepares a local demo state; it does not create a real ticket.

The voice button is also simulated: it shows a listening state, transcript, and response without requesting microphone permissions.

## Prototype limitations

This is a frontend-only demonstration using React state and local mock data. It has no backend, database, authentication, live Cheerio or Meta API, LLM, real account diagnostics, real message sending, or real ticket creation. Any diagnostic and action outcome shown in the UI is explicitly demo data.
