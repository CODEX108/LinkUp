## Prerequisites

- Node.js (v14 or later)
- Bun (latest version) or you can use npm or what works for you
- Git

## Getting Started

Follow these steps to set up the project:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/laribright/slack-clone.git
   cd slack-clone
   ```

2. **Install Dependencies:**

   ```bash
   bun install
   ```

3. **Set Up Environment Variables:**

   - Rename the `.env.example` file to `.env.local` and fill in the required environment variables.

   ```bash
   mv .env.example .env.local
   ```

4. **Run the Development Server:**

   ```bash
   bun dev
   ```

   Your app should now be running on [http://localhost:3000](http://localhost:3000).

## Course Structure

This course is divided into multiple modules, each covering different aspects of building the Slack clone. The modules include:

- Setting up Next.js and TypeScript
- Configuring Supabase (RPC, Storage, SQL, Role Level Security)
- Styling with Tailwind CSS and Shadcn UI
- Implementing Authentication (Google Auth, GitHub Auth, Email Auth with Magic Link)
- Managing state with Zustand and React Hook Form
- Real-time communication with Socket.IO
- Handling file uploads with Uploadthing and Supbase Storage
- Advanced Next.js features and middleware