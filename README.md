# 🔐 Secure Authentication Backend (Node.js + MongoDB + Express.js)

This is a complete authentication backend built using **Node.js**, **Express**, and **MongoDB**
with advanced features like email verification, JWT-based login, password reset, and route protection. 
It also includes **Zod for schema validation** and a centralized **error handling system**.

---

## 🚀 Features

- ✅ User registration with secure password hashing (bcrypt)
- 📧 Email verification via tokenized links (crypto)
- 🔐 JWT-based login with HTTP-only cookie
- 🔄 Forgot & Reset password with secure tokens
- 🛡️ Route protection middleware using JWT
- 🧑 Get current user profile `/getMe`
- 🚪 Logout with token clear
- 📦 Environment variables with `.env`
- 🧪 Postman collection for testing
- 🧱 Modular MVC folder structure
- 🧹 Centralized error handling for cleaner code
- 🔍 Zod validation for input schema

---

## 🧠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (with Mongoose ODM)
- **Auth:** JWT, bcrypt, crypto
- **Validation:** Zod
- **Mail:** Nodemailer
- **Testing:** Postman
- **Structure:** MVC + Middleware

---

## 🗂️ Folder Structure

project-root/
│
├── config/ # DB & mail setup
├── controllers/ # Auth/business logic
├── middlewares/ # protect, validate, error handlers
├── models/ # Mongoose schemas
├── routes/ # Route declarations
├── utils/ # Mail/sendToken helpers
├── validators/ # Zod schemas
├── User.postman_collection.json
├── .env.example
└── index.js

## 🧪 Postman Setup

> Use the provided `User.postman_collection.json` to test all flows:

**1. Register** → receives email with verification link  
**2. Verify Email** → activates the account  
**3. Login** → returns JWT cookie  
**4. Forgot Password** → mail with reset link  
**5. Reset Password**  
**6. Access `/getMe` route**  
**7. Logout**

Use Postman environments for `BASE_URL`, `JWT_TOKEN`, etc.

## 🔄 In Progress

- [ ] Access + Refresh token flow
- [ ] Google OAuth 2.0 (OpenID Connect)
- [ ] JWKS URI & ID token validation
- [ ] Response format standardization


## NOTE :- to use nodemailer read the docs and to test mail use Mailtrap


## 📌 Also Implemented In Other Projects

- ✅ PostgreSQL + Prisma ORM setup
- ✅ SQL & NoSQL experience
- ✅ JWT, cookies, and mail with security in mind
- ✅ Schema validation (Mongoose + Zod)


## 🧑‍💻 Author

**Mizan Mulani**  
GitHub: [Mizan-ux](https://github.com/Mizan-ux)

---

## 🤝 Contributing

Pull requests welcome. Please open issues for any discussion before major changes.

---

## 📜 License

MIT
