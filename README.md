# infoman2Lec

## Supabase Authentication

The sign-in page uses Supabase Auth for email/password sign-in, account creation, and password recovery. The client configuration is in `supabase-config.js`; its publishable key is intended for browser use. Never put a Supabase `service_role` or secret key in this static site.

In the Supabase dashboard, enable Email authentication and add the deployed site URL (and your local development URL) to **Authentication → URL Configuration → Redirect URLs**. Email confirmation and password recovery links return to `index.html`. Serve the project over HTTP, such as with VS Code Live Server; browser `file://` URLs are not supported for Auth redirects.

The dashboard checks for an authenticated session and supports sign-out. Its role switch remains a UI prototype only; protect any real database tables with Supabase Row Level Security policies. No database tables are connected yet.