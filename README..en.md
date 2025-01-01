
# Languages [![fa](https://img.shields.io/badge/lang-fa-red.svg)](https://github.com/Zarshenas/Chekad/blob/main/README.md)
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
