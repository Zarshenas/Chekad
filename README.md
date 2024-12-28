# پلتفرم چکاد

این مخزن شامل کد منبع پلتفرم **چکاد** است، بستری برای حرفه‌ای‌های خلاق (طراحان، عکاسان، نویسندگان) جهت نمایش آثار، ارتباط با مشتریان و تعامل با دیگر حرفه‌ای‌ها.

## ویژگی‌ها

- احراز هویت و مجوزدهی کاربران با JWT
- مدیریت پروفایل: ویرایش پروفایل با بیوگرافی، عکس، و تخصص‌ها
- مدیریت پروژه‌ها: آپلود پروژه‌ها با توضیحات، دسته‌بندی و فایل‌های پشتیبان (مانند PDF)
- امکانات اجتماعی: دنبال کردن کاربران، گذاشتن نظر روی پست‌ها

---

## تکنولوژی‌های استفاده شده

- **فریم‌ورک**: [Next.js](https://nextjs.org/)
- **دیتابیس**: [MongoDB](https://www.mongodb.com/)
- **احراز هویت**: JWT (JSON Web Tokens)
- **سایر موارد**: bcrypt برای هش کردن رمز عبور

---

## پیش‌نیازها

اطمینان حاصل کنید که موارد زیر نصب شده‌اند:

- [Node.js](https://nodejs.org/) (نسخه ۱۶ یا بالاتر)
- [MongoDB](https://www.mongodb.com/)
- پکیج منیجر [npm](https://www.npmjs.com/)

---

## نصب

مراحل زیر را برای راه‌اندازی و اجرای پروژه به صورت محلی دنبال کنید:

۱. ریپازیتوری را کلون کنید:
   ```bash
   git clone https://github.com/yourusername/chakad.git
   cd chakad
   ```

۲. دپندنسی ها را نصب کنید:
   ```bash
   npm install
   # یا
   yarn install
   ```

۳. تنظیم envirement variables:
   - یک فایل `.env.local` در ریشه پروژه ایجاد کنید.
   - متغیرهای زیر را اضافه کنید:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```

۴. سرور را اجرا کنید:
   ```bash
   npm run dev
   # یا
   yarn dev
   ```

   اپلیکیشن در [http://localhost:3000](http://localhost:3000) قابل دسترسی خواهد بود.

---

## ساختار پروژه

```plaintext
├── app             # صفحات Next.js و مسیرهای API
├── utils           # توابع کمکی و ابزارها
├── models          # مدل‌های Mongoose
├── public          # فایل‌های استاتیک (تصاویر و غیره)
├── .env.local      # متغیرهای محیطی
```

---

## اجرای تست‌ها

برای اجرای تست‌ها، از این دستور استفاده کنید:
```bash
npm run test
# یا
yarn test
```

---

## پروداکشن

برای استقرار پروژه:

۱. اپلیکیشن را بیلد کنید:
   ```bash
   npm run build
   # یا
   yarn build
   ```

۲. سرور تولیدی را اجرا کنید:
   ```bash
   npm start
   # یا
   yarn start
   ```

---

# Chakad Platform

This repository hosts the source code for **Chakad**, a platform designed for creative professionals (designers, photographers, writers) to showcase their work, connect with clients, and interact with other professionals.

## Features

- User authentication and authorization with JWT.
- Profile management: Edit profile with bio, photo, and skills.
- Project management: Upload projects with descriptions, categories, and supporting files (e.g., PDFs).
- Social features: Follow users, comment on posts.

---

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: JWT (JSON Web Tokens)
- **Others**: bcrypt for password hashing

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or above)
- [MongoDB](https://www.mongodb.com/)
- A package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

Follow these steps to set up and run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chakad.git
   cd chakad
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following variables:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```plaintext
├── pages           # Next.js pages and API routes
├── utils           # Utility functions and helpers
├── models          # Mongoose models for MongoDB collections
├── public          # Static assets (images, etc.)
├── .env.local      # Environment variables
```

---

## Running Tests

To run the tests, use:
```bash
npm run test
# or
yarn test
```

---

## Deployment

To deploy the project:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.
