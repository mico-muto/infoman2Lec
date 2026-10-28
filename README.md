# infoman2Lec

## Supabase Auth setup

The sign-in page uses Supabase Auth with the project's URL and publishable key configured in `index.html`. In the Supabase dashboard, enable the Email provider and set the Site URL under **Authentication → URL Configuration** to the URL where this page is served. Add that exact local or deployed page URL to the allowed redirect URLs; sign-up requests redirect to the page's current URL.

For local testing, open a terminal in the project folder, run `python -m http.server 8000`, and leave that terminal running while using the app. Open `http://localhost:8000/index.html`. Opening `index.html` directly as a `file://` URL may prevent the Supabase client module from loading, and confirmation links to localhost fail whenever the local server is stopped. In Supabase **Authentication → URL Configuration**, set the local Site URL to `http://localhost:8000` and allow `http://localhost:8000/**`. Localhost only works on the same computer; deploy the site and allow its HTTPS URL to confirm email on another device.

Supabase's default email service is for testing and restricts recipients; configure valid custom SMTP for general delivery. The sign-in page supports confirmation resend, reset-password requests, and password recovery links, but it cannot fix mail-provider or dashboard URL configuration errors.

The admin dashboard is still separate from Supabase Auth and uses its own `/api/...` endpoints.