# Anonymous Review App

A secure and anonymous messaging application built with Next.js, designed to facilitate honest feedback and confessions. Users can sign up, receive a unique profile link, and receive anonymous messages from others.

## 🚀 Features

- **Anonymous Messaging:** Users can send messages anonymously to anyone with a profile.
- **User Dashboard:** View, manage, and delete received messages.
- **Message Controls:** Toggle to accept or reject new messages instantly.
- **AI Suggestions:** Integrated with Groq AI (Llama 3.1) to suggest engaging questions or feedback prompts.
- **Secure Authentication:** Robust sign-up and sign-in flow using NextAuth.js with email verification (OTP).
- **Responsive Design:** Modern UI built with Tailwind CSS, fully responsive for mobile and desktop.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Email Service:** [Resend](https://resend.com/) & [React Email](https://react.email/)
- **AI Integration:** [Groq SDK](https://groq.com/) (Llama 3.1-8b-instant)
- **Validation:** [Zod](https://zod.dev/)

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_nextauth_secret
GROQ_API_KEY=your_groq_api_key
```

## 📦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/anonymous-review.git
   cd anonymous-review
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the variables listed above.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and database connection logic.
- `src/model`: Mongoose schemas (User, Message).
- `src/schemas`: Zod validation schemas.
- `src/helpers`: Helper functions (e.g., email sending).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

Link: https://anonymousreview.vercel.app/
