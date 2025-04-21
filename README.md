
# JamsrPay Setup Template

This template helps you quickly set up and configure JamsrPay.

## Prerequisites

Before setting up JamsrPay, ensure you have the following:

- Node.js
- PostgreSQL database

## Installation

   ```sh
   pnpm install
   # or
   npm install
   ```

 **Set up the database**
   Ensure you have PostgreSQL running and create a new database "JamsrPay"

   ```sh
   pnpm db:push
   ```

**Configure Environment Variables**
   Create a `.env` file in the project root and add the necessary values:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/JamsrPay
   SECRET_KEY="your-secret-key"
   ```
Create Webhook on JamsrPay https://sandbox.jamsrpay.com

**Start the development server**

   ```sh
   pnpm dev
   ```

   The server should be running at `http://localhost:3000`


**Ngrok Setup (For Local Webhook Testing)**

If you need to test webhooks locally, install and run ngrok: https://ngrok.com/downloads/mac-os

Start ngrok to expose your local server:


  ```sh
ngrok http 3000
   ```

**Test Coin**

https://nileex.io/join/getJoinPage

## Support

For any issues, visit the JamsrPay GitHub repository or contact support.
