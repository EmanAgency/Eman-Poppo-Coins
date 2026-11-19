# EC Live Group — four-app coin website v7

This is the complete static website source for the existing Eman-Poppo-Coins repository, with the latest header, four logo tabs and currency choices. It is not an APK.

## Publish to emancoins.com from your phone

1. Extract this ZIP.
2. In EmanAgency/Eman-Poppo-Coins, upload the CONTENTS of this folder to the repository root, preserving the assets folder. Upload files, not the ZIP itself. Keep your existing working config.js if you have changed its Supabase configuration since the earlier backup.
3. Commit the files and wait for GitHub Pages to publish. Keep CNAME containing emancoins.com. No domain/DNS changes are required.
4. Refresh emancoins.com. The review link is hosted separately and does not automatically update your domain.

No database migration is required. Do not rerun the old supabase.sql just for this update.

## Prices and payment choices

- All four catalogs show USD prices.
- Comet Live uses the supplied Comet app logo and the same rate as Eman Live: 7,000 coins = US$1.00.
- Eman and Comet accept whole quantities from 1,000 to 7,000,000 coins. First-recharge bonuses are excluded from the quoted regular rate.
- Poppo retains its original 80 packages: 21,000 coins for TT$20, then 14,000 more coins and TT$14 more per tier. USD prices use the existing fixed merchant rate of US$1 = TT$7.
- Glow retains the supplied PDF's 80 tiers: 70,000 coins for TT$8 through 5,600,000 coins for TT$640. Their USD display uses the same merchant conversion.
- Pay in USD, TTD or Crypto (USDT). The catalog USD price remains visible when the payment currency changes.
- The selected payable amount is calculated from the complete unrounded order, then rounded to two decimals. USDT is quoted at one USDT per US dollar for this shop. This is a merchant quote, not a live market exchange feed.

## How orders work

Poppo Crypto (USDT): existing BEP20, TRC20 and ERC20 wallet addresses/QRs, receipt upload, Submit Order, My Order lookup and the existing admin dashboard are retained. Website records retain the existing price_ttd field and network names to stay compatible with the current database. The public confirmation and lookup show USD.

Poppo USD or TTD: a WhatsApp order link replaces the crypto receipt form and includes the app, name/ID, coins, USD price and selected payable amount. The seller must confirm actual payment instructions before the buyer pays. These orders are handled on WhatsApp and are not automatically added to the website dashboard.

Glow, Eman and Comet: WhatsApp order links include the correct app, recipient ID, USD price, selected currency and amount. Confirm payment details (including the USDT network for crypto) before paying. These orders do not get a website order number.

No USD card processor, PayPal account or bank account was invented or connected. No payment is charged automatically; the seller reviews payments and delivers coins manually.

## Other preserved details

EC Live Group / Trinidad and Tobago is the top header. Buy Coins, My Order and Contact are directly below it, then the four clickable logos. Horizontal swiping remains available. Each app keeps its own form values when switching. Poppo Sell Points remains in the Poppo panel below its checkout, now showing the USD equivalent first.

Contact: eclivegroup@gmail.com; WhatsApp +1-868-387-6714.

## Validation

- Browser checked: four clickable app tabs, Comet USD/TTD calculations, Poppo TTD selection hides the crypto form and shows the WhatsApp request, and Eman values remain independent of Comet's quick amounts.
- Calculation checks: all 80 original Poppo and Glow price tiers preserved, Eman/Comet parity, USD/TTD/USDT amounts, full-order rounding and invalid input rejection.
- JavaScript syntax, unique HTML IDs, four panel/selector connections and local asset references checked.

Real payment processing, a receipt upload and a production database insert were not performed. Existing Supabase policies and server availability still determine whether Poppo receipt submission succeeds.
