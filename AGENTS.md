# Project architecture decisions

- `AdminLayout` accepts `fullBleed` for workspace-style screens so dense tools can use the full viewport without changing ordinary admin pages.
- Conversation tags remain stored on linked negotiations because the current CRM already uses that field as the shared source of truth.
- Scheduled WhatsApp messages use a durable database queue and are revalidated against the 24-hour window at dispatch time to prevent invalid sends.
- WhatsApp media uploads run through an authenticated server function so connector credentials and binary transport never reach the browser.
- Team groups use `team_groups` plus `team_group_members`; roles remain separate because groups organize people without granting permissions.