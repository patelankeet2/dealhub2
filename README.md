# 🛍️ Deal Hub - Discount Aggregator Platform

**Deal Hub** is a role-based, full-stack web platform built with React and Firebase that allows users to browse and purchase limited-time deals, merchants to create and track offers, and admins to moderate users and deals. The system is designed to be responsive, scalable, and user-friendly across all devices.

---

## 🌐 Live Hosting

🔗 **Access the Live App:** https://dealhub-b48fa.web.app

> Hosted on Firebase with automatic deployment from the production build.

---

## 🚀 CI/CD with GitHub Actions + Firebase Hosting



### 🔄 Workflow Overview

#### ✅ PR Preview Deployments
- Every **pull request** (`pull_request`) triggers a workflow (`firebase-deploy-pr.yml`).
- The app is built (`npm ci && npm run build`).
- Firebase Hosting creates a **Preview Channel** and comments a unique preview URL in the PR.
- Reviewers can test changes before merging.

#### 🚀 Production Deployments
- Any **merge to the `main` branch** triggers another workflow (`firebase-deploy-live.yml`).
- The app is built and deployed to the **live site** (`channelId: live`) on Firebase Hosting.

### 🔑 Secrets
- `FIREBASE_SERVICE_ACCOUNT` → JSON service account key with **Firebase Hosting Admin** + **Service Account Token Creator** roles.
- `GITHUB_TOKEN` → Automatically provided by GitHub to post PR comments and trigger deployments.

### ✅ Deployment Steps
1. Create a **feature branch** → push → open a PR.
2. GitHub Actions builds the app and deploys to a **Preview Channel**.
3. Preview URL is shown in the PR.
4. Merge PR into **main**.
5. GitHub Actions builds again and deploys to the **production site**.

### 🛠 Rollback
- All deployments are visible in the **Firebase Console → Hosting**.
- Rollback can be done by selecting a previous deployment version.

---


## 📁 Project Structure

```plaintext
patelankeet2-dealhub2/
├── README.md                   # Project documentation
├── TESTING_REFLECTION.md       # Reflection notes for testing
├── firebase.json               # Firebase deployment config
├── .firebaserc                 # Firebase project alias config
├── package.json                # Node dependencies & scripts
├── public/                     # Static assets
│   ├── index.html              # App HTML entry point
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO rules
├── src/                        # Application source
│   ├── App.js                  # Main App entry
│   ├── App.css                 # Global styles
│   ├── App.test.js             # React testing config
│   ├── CHANGELOG.md            # Project version history
│   ├── firebaseConfig.js       # Firebase initialization
│   ├── index.js                # ReactDOM entry point
│   ├── index.css               # Base CSS
│   ├── reportWebVitals.js      # Performance metrics
│   ├── setupTests.js           # Test setup file
│   ├── context/                # Global contexts
│   │   └── AuthContext.js      # Auth state context
│   ├── components/             # Reusable UI + features
│   │   ├── AdminDashboard.{js,css}
│   │   ├── AdminEarnings.{js,css}
│   │   ├── AdminManageCategory.{js,css}
│   │   ├── AdminManageDeals.{js,css}
│   │   ├── AdminManageUsers.{js,css}
│   │   ├── AdminProfile.{js,css}
│   │   ├── AnalyticsPage.{js,css}
│   │   ├── CartPage.{js,css}
│   │   ├── CreateDeal.{js,css}
│   │   ├── CustomerForgotPassword.js
│   │   ├── CustomerProfilePage.{js,css}
│   │   ├── DealDetailsPage.{js,css}
│   │   ├── DealsPage.{js,css}
│   │   ├── EditDealPage.js
│   │   ├── FeedbackPage.{js,css}
│   │   ├── LandingPage.{js,css}
│   │   ├── Login.{js,css}
│   │   ├── MerchantCustomersPage.{js,css}
│   │   ├── MerchantDashboard.{js,css}
│   │   ├── MerchantDealsPage.{js,css}
│   │   ├── MerchantForgotPassword.{js,css}
│   │   ├── MerchantLogin.{js,css}
│   │   ├── MerchantRegister.{js,css}
│   │   ├── Navbar.{js,css,test.js}
│   │   ├── OrderTrackingPage.{js,css}
│   │   ├── PaymentPage.{js,css}
│   │   ├── ProtectedRoute.js
│   │   ├── Register.js
│   │   └── Settings.{js,css}
│   └── pages/                  # Page-level components
│       ├── NotFound.js
│       └── NotFound.css
├── .firebase/                  # Firebase cache
│   └── hosting.YnVpbGQ.cache
└── .github/                    # GitHub workflows
    └── workflows/
        ├── firebase-deploy-live.yml  # Live deploy pipeline
        ├── firebase-deploy-pr.yml    # PR preview deploy pipeline
        ├── owasp-lite.yml            # Security scan
        └── tests.yml                 # Unit test workflow


## 🚀 Features by User Role

### 👥 Customer
- 🔐 Register/Login
- 🔎 Browse, filter, and search deals
- 🛒 Cart & secure checkout
- 📜 Order tracking & purchase history
- 💬 Rate and review deals
- 👤 View and update profile with avatar URL

### 🧑‍💼 Merchant
- 🔐 Login with email and driving license
- 🧾 Create, edit, and delete deals
- 📊 Track deal stats and earnings
- 🔎 Search deals and customer list
- ⚙️ Manage profile & update settings

### 🛡️ Admin
- 🔐 Secure admin login
- ✅ Approve/reject merchant registrations & deals
- 🧑‍💻 Manage all user accounts
- 📊 View global analytics
- 🗂️ Moderate platform content

---

## 🧑‍💻 Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| Frontend      | React, React Router, Bootstrap |
| Auth/Backend  | Firebase Auth, Firestore DB, Firebase Hosting |
| Styling       | CSS, Bootstrap (custom styling) |
| Storage       | Firebase Storage for images   |
| State Mgmt    | React Context API             |
| Deployment    | Firebase CLI, GitHub Actions CI/CD |

---

## 📦 Getting Started

### ✅ Prerequisites
- Node.js and npm installed
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project created and configured

### 🔧 Installation

```bash
git clone https://github.com/patelankeet2/deal-hub
cd dealhub
npm install

🚀 Local Development
npm start

🔥 Firebase Deployment
firebase login
firebase init hosting
firebase deploy

📈 Contribution Overview

📍 Ankeet Patel: Merchant Dashboard, Deal Management, Analytics, Routing, Navbar, Auth Logic, CI/CD Automation, Owasp Testing, Jest Unit testing & Automated deployment.

📍 Mazhar: Admin dashboard, user moderation, and approvals

📍 Samika: Customer experience, feedback, cart, and checkout flow

All members contributed to App.js and routing logic.

📍 Harpreet, Ankeet & Mazhar: Worker together in Studio-4 to complete CI/CD pipelines, OWASP Testing, Jest Unit Testing & Automated Deployment.


🧪 Testing Strategy

✅ Manual UI and UX testing across roles

✅ Browser compatibility testing (Chrome, Firefox)

✅ Firebase Emulator tests (Auth + Firestore)

✅ Real-time validation & error handling

✅ Code reviewed and merged via pull requests

✅ Automated unit tests via tests.yml

✅ Security checks via OWASP Lite workflow (owasp-lite.yml)

📌 Version History

Check CHANGELOG.md for full release notes and tracked changes.

📄 License

This project is released under the MIT License.

🙌 Acknowledgements

Thanks to Otago Polytechnic and our mentors for guidance throughout Studio 3 & 4.

Made with 💻 using React, Firebase, GitHub Actions & Team Collaboration
