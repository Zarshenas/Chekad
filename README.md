# زبان ها [![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Zarshenas/Chekad/blob/main/README.en.md)

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