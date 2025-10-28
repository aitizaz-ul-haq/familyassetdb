# Family Asset Registry

A private family asset management system built with Next.js 14, MongoDB, and JavaScript.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.local` and update with your MongoDB connection string
   - Generate a secure JWT_SECRET (at least 64 characters)

3. **Create admin user**
   ```bash
   node scripts/createAdmin.js
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000/login`

## Default Credentials

After running the createAdmin script:
- Email: `admin@family.com`
- Password: `admin123`

**IMPORTANT: Change these credentials after first login!**

## Features

- **Authentication**: JWT-based with HTTP-only cookies
- **Two roles**: Admin (full access) and Viewer (read-only)
- **Asset Management**: Track land, houses, vehicles, business shares, etc.
- **People Management**: Track family members and ownership
- **Dispute Tracking**: Monitor assets in legal disputes
- **Document Attachments**: Store references to supporting documents
- **History Timeline**: Track all actions for each asset

## Tech Stack

- Next.js 14 (App Router)
- MongoDB with Mongoose
- JavaScript (no TypeScript)
- bcrypt for password hashing
- JWT for authentication

## Project Structure

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
