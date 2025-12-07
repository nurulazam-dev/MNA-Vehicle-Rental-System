# MNA-Vehicle-Rental-system

`A Vehicle Rental Management System (Backend) app`

---

Live Link: https://mna-vehicle-rental.vercel.app/

## Technology Stack

- **Node.js** ()
- **TypeScript** ()
- **Express.js** ()
- **PostgreSQL** ()
- **Bcrypt.js** ()
- **JsonWebToken** ()

---

## Credentials:

- Admin Credentials:
  | Field | Credentials |
  |----------|-------|
  | email | admin@gmail.com |
  | password | A123456 |

- Customer Credentials:
  | Field | Credentials |
  |----------|-------|
  | email | customer@gmail.com |
  | password | U123456 |

---

## Core Features

- **1. Authentication & Authorization**
- Login / Logout
- JWT-based authentication
- Password hashing (bcrypt)

- **2. Role-based access control:**

### _Admin:_

An admin can access the full (vehicles, users, bookings) system. For example:

- Manage vehicles with CRUD operation.
- Manage users (READ, DELETE, and UPDATE(Customer & Own profile details. Like name, email, phone, newRole)).
- Manage bookings (CREATE, READ, DELETE, and UPDATE(Customer & Own booking)).

### _Customer/User:_

An customer/user can access the own profile and bookings. For example:

- create account as a customer.
- update own profile details. Like name, email, phone, etc.
- Can booking vehicles and update own booking.

---

## Setup & usage instructions

1. Clone the repository
   ```bash
   git clone https://github.com/nurulazam-dev/MNA-Vehicle-Rental-System.git
   cd MNA-Vehicle-Rental-System.git
   ```
2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables in (`.env`) file
   ```bash
   // port
   PORT=5000
   // DB connection_String
   DB_CONNECT_URL=.................
   // jwt_secret_key
   JWT_SECRET=".............."
   ```

````

4. Run the development server
```bash
npm run dev
````

5. Open your browser and navigate to `http://localhost:5000/`

---
