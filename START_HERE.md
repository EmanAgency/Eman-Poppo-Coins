# Coin website update — Poppo, Glow and Eman Live

This ZIP updates the existing Eman-Poppo-Coins website. It is not an Android/iPhone app.

Upload the website files and the assets folder to the root of your existing Eman-Poppo-Coins GitHub repository, keeping the same paths. Do not add an extra outer folder. Keep your current working config.js if you changed its Supabase settings after this backup. Do not delete your existing files or run the old supabase.sql again for this update.

Open your existing website after GitHub Pages finishes publishing. If an older copy appears, refresh the page; the updated service worker removes the old cache-first shell.

Changes:
- The three app buttons now include their logos. Tap a button or swipe left/right to switch coin sections. Only the selected section takes up vertical space, and form entries stay in place when switching. Poppo Sell Points remains inside the Poppo section, below its coin checkout.
- Poppo, Glow Live and Eman Live have their supplied logos and separate sections.
- Poppo preserves the existing package prices, payment networks, receipt checkout, admin dashboard and order lookup.
- Glow packages follow your supplied PDF: 70,000 coins for TT$8, through 5,600,000 for TT$640 (80 packages).
- Eman accepts any whole amount from 1,000 to 7,000,000 coins, priced at 7,000 coins per USDT, rounding the full order to 2 decimal places. Quick choices include 1k, 5k, 10k and 15k. First-recharge bonuses are excluded.
- Glow and Eman orders open WhatsApp with the correct app, recipient ID, quantity and quoted amount. Confirm payment details there before the buyer pays. They do NOT enter the Poppo dashboard or receive a website order number.
- Contact email: eclivegroup@gmail.com. WhatsApp: +1-868-387-6714.
- App installation promotion is removed while the website is being reviewed.
- Choosing Bank Transfer hides the USDT wallet instead of leaving an unrelated network on screen.

No database migration is required for these new WhatsApp sections. No wallet addresses were changed. Payment receipt acceptance and coin delivery remain manual.

Checks completed: JavaScript parsing, all 80 Glow prices, Eman price rounding/input bounds, unique HTML IDs and asset references. A browser/device visual check and a real checkout/payment test have not been performed. Do not make a real payment just to test the layout.

GitHub upload from this chat was refused by the connection (403: Resource not accessible by integration), so emancoins.com was not changed by this work. A separate private review site, if linked in the reply, has Poppo checkout disabled and contains no account credentials.
