# Project architecture decisions

- `AdminLayout` accepts `fullBleed` for workspace-style screens so dense tools can use the full viewport without changing ordinary admin pages.
- Conversation tags remain stored on linked negotiations because the current CRM already uses that field as the shared source of truth.