# Wavessa Studio website (cafe, evening lounge and shop)

Static site for the Bangkok frequency cafe. It runs on GitHub Pages with no build step.

## Put it online
1. Push these files to the root of the repo's `main` branch.
2. On GitHub: Settings > Pages > Source: Deploy from a branch > `main` / root > Save.
3. It goes live at `https://<your-username>.github.io/<repo-name>/` in a minute or two.

## Change before launch
- Brand name: `const BRAND` near the bottom of `index.html`, plus the `<title>`.
- Contact: `const EMAIL` on the next line (it is `hello@example.com` now).
- Menu, session prices, device prices and clothing: the `MENU`, `SESSIONS`, `TIERS`, `DEV` and `WEAR` lists in the same script.

## How ordering works
There is no payment. The bag and the invite form open the visitor's email app with the order filled in.
A LINE Official Account link or a form service can replace this later.

## Rules kept in the copy
- Wellness wording only. No healing, treatment or pain claims (Thai Medical Device Act).
- No alcohol is shown or named (Alcoholic Beverage Control Act 2025 marketing ban). The evening menu shows alcohol-free drinks only.
- Device prices are targets in THB including 7% VAT. Devices are marked as in development.

## Pages (since 2026-11-08)
- `index.html` front door: two big halves, The Cafe and The Devices.
- `cafe.html` cafe and lounge: sessions, menu and Thai beans, locations, Circle, visit.
- `devices.html` devices: Mini Pod 3D, device finder, range, bundle, compare, the app (18+, coming soon to Android), clothing.
- Shared `site.css` and `site.js`. The bag is shared across pages in the browser.
- Location photos: save real photos as `img/loc-thonglor.jpg`, `img/loc-ari.jpg`, `img/loc-sathorn.jpg` and they replace the illustrations.
- App name: `const APP_NAME` in `site.js` (temporary).


## Stock photos and video

`img/photo/` (Unsplash) and `video/` (Pexels, mp4 with a poster jpg) are free-licence placeholders. Sources are in `credits.json`. Replace them with photos of the real Studio when you have them, keeping the same file names. Videos pause when off screen and show the still poster for visitors who turn motion off.
