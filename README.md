# Gusto Go

A food delivery web app for **Sari-Sari Eats**: browse the menu, pick add-ons, manage your cart, check out and track your order. Works on iPhone, Android, tablets and desktop, in light and dark mode.

Built with React, Vite, Tailwind CSS and Firebase (Authentication + Cloud Firestore).

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Firebase web app values
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:5173 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check the code with ESLint |

## Features

- Email and password sign-up, sign-in, password reset and log out
- Menu with five categories: Burgers, Salads, Sides, Desserts, Drinks
- Food details with optional add-ons and live price
- Cart with quantities, add-ons, clear-cart confirmation and order summary
- Delivery location: detect it with the phone's GPS, or search for an address, with a map pin to confirm it (OpenStreetMap data via Nominatim and Photon, no API key needed)
- Checkout with card preview and validation (card details never leave the device)
- Orders saved to the Firestore `orders` collection, then a receipt with estimated delivery time and driver details
- Dark mode setting, remembered on the device

## Project structure

```
src/
  firebase.js        Firebase setup (reads values from .env)
  data/menu.js       Menu items, categories, delivery fee and time
  context/           Auth, cart, theme and toast state
  services/          Firebase auth and order helpers
  components/        Shared UI pieces
  pages/             One file per screen
public/images/       Food photos
```

## Firestore data

Each order in `orders` keeps the original fields (`date`, `order` receipt text) and adds `uid`, `email`, `address`, `location` (`lat`/`lng`, when a pin is set), `items`, `itemCount`, `subtotal`, `deliveryFee` and `total`.

## Hosting

This is a single-page app: configure your host to serve `index.html` for all routes (for example a rewrite of `**` to `/index.html` on Firebase Hosting).

## Local emulators (optional)

To develop against the Firebase Emulator Suite instead of the live project, create `.env.development.local` with:

```
VITE_USE_FIREBASE_EMULATORS=true
```

Ports default to 9099 (Auth) and 8080 (Firestore); override them with `VITE_AUTH_EMULATOR_PORT` and `VITE_FIRESTORE_EMULATOR_PORT`.
