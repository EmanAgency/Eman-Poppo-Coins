# Eman Agency — Secure Order System Setup

This package adds a real order backend using Supabase.

## What customers can do
1. Select a coin package.
2. Choose Bank Transfer, PayPal, or Binance/USDT BEP20.
3. Upload a payment receipt (max 5 MB).
4. Submit the order and receive an order number.
5. Check the order status using that order number.

## What you can do
Open `admin.html`, log in as the admin, see orders, open receipts, and change status.

## Setup

### 1. Create a Supabase project
Create a project at Supabase.

### 2. Run the database SQL
Open Supabase SQL Editor and run the complete contents of `supabase.sql`.

### 3. Create an admin login
In Supabase Authentication, create one email/password user for yourself.

### 4. Get project settings
Copy:
- Project URL
- anon/public key

Put them into `config.js`:
`window.EMAN_SUPABASE_URL = https://pvabwpqpjexedkwfthjm.supabase.co
`window.EMAN_SUPABASE_ANON_KEY = sb_publishable_SIexl_nQAIKcg-5s5QfA2g_QzJXeB-M

NEVER put the Supabase `service_role` key in the website.

### 5. Upload to GitHub Pages
Upload/replace:
- index.html
- style.css
- app.js
- config.js
- manifest.json
- usdt-bep20-qr.png
- admin.html
- admin.js
- supabase.sql
- README.md

### 6. Admin
After GitHub Pages deploys, open:
`https://emanagency.github.io/Eman-Poppo-Coins/admin.html`
(Use your actual GitHub Pages address if different.)

## Important
This is the next functional stage, but payment verification and Poppo coin delivery are still manual. The website does not automatically send coins to Poppo. You should verify each payment before marking an order Paid/Completed.

Before real launch, add stronger anti-spam/rate-limit controls, tighter row/storage policies, backups, terms/privacy pages, and verify compliance with Poppo Live's current rules.
