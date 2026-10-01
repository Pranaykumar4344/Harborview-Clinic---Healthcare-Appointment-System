# Harborview Clinic — Healthcare Appointment System

SDC project: a two-module (Patient + Admin) appointment system that stores all data in the browser's Local Storage.

## Run
Open `index.html` in a browser. No server or install needed.

Admin login (Admin tab): `admin@harborview.com` / `admin123`. Patients sign up from the Patient tab.

## Structure
```
harborview-clinic/
├── index.html        Page markup (header, hero, doctors, appointments, admin view, popups)
├── css/
│   └── style.css     All styling (CSS Grid + Flexbox layout, light/dark theme)
└── js/               Loaded in this order
    ├── utils.js      DOM shortcut, HTML escaping, date helpers
    ├── storage.js    Local Storage read/write + sample data seeding
    ├── state.js      Shared state variables
    ├── auth.js       Patient signup/login, admin login, logout
    ├── patient.js    Doctors list, booking, reschedule, cancel, My appointments
    ├── admin.js      Dashboard, manage doctors, set appointment status
    └── main.js       start() decides which screen to show by role, then boots
```

## Local Storage keys
| Key | Holds |
|---|---|
| `hvc_users` | Registered accounts (name, email, password, role) |
| `hvc_session` | Currently logged-in user |
| `hvc_doctors` | Doctor list managed by the admin |
| `hvc_appts` | All appointments and their status |

View them in DevTools under Application → Local Storage.
