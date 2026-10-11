# VisitPass (web app)

The React frontend for VisitPass, a visitor management system for clinics and hospitals. Visitors register once and get a QR code. Security staff scan it to record entry and exit. Admins manage staff accounts and download daily reports.

The backend lives in [visitpass-api](https://github.com/sanchitpandey/visitpass-api).

## Features

- Visitor sign-up with phone OTP (Firebase Authentication), personal details and a selfie
- A QR code for each visitor, shown on their dashboard
- Security dashboard with a camera QR scanner that records entry or exit
- Admin dashboard to create staff accounts and download the daily visitor report as an Excel file
- Separate views and route guards for the three roles: admin, security, visitor

## Stack

React 19, React Router, Axios, Firebase Authentication, Create React App. Deployed on Vercel.

## How sign-in works

1. The visitor enters a phone number and Firebase sends an OTP.
2. After the OTP is confirmed, the app sends the Firebase ID token to the API.
3. If the visitor already has an account, the API returns its own JWT and the app stores it. If not, the app shows the registration form and submits it with the Firebase token.
4. Staff sign in with email and password.

The session logic is in `src/context/AuthContext.js` and the API client in `src/services/api.js`.

## Running locally

Requirements: Node.js 18 or later, and a running copy of [visitpass-api](https://github.com/sanchitpandey/visitpass-api).

```bash
git clone https://github.com/sanchitpandey/visitpass-react.git
cd visitpass-react
npm install
cp .env.example .env
npm start
```

The app runs at `http://localhost:3000`.

## Configuration

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Base URL of the API, for example `http://localhost:5000/api` |

The Firebase web configuration is in `src/firebase.js`. Replace it with your own project's values.

## Project structure

```
src/
  components/   Auth, Admin, Security and Visitor screens
  context/      AuthContext (session and OTP flow)
  pages/        Role dashboards
  services/     Axios API client
  utils/        Role helpers
```

## Known limitations

- Aadhaar numbers are only checked for format. There is no integration with an identity service.
- The QR scanner depends on the browser's BarcodeDetector API, so it does not work in every browser.
