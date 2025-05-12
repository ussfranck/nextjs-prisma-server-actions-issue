# Next.js Server Actions & Prisma Production Failure on Vercel

This repository demonstrates a production failure when using Next.js Server Actions (within the `app` router) with Prisma for fetching data on Vercel.  The application works correctly in local development, but encounters Prisma errors only in the Vercel production environment.

**The Problem:**

The application fetches data using Prisma within Next.js Server Actions.  While this works flawlessly in a local development environment, deployment to Vercel results in Prisma errors, specifically a "PrismaClientKnownRequestError" with a message like  "Error validating datasource `db`: the URL must start with the protocol `prisma:`".  This error suggests a problem with how the database connection URL is being handled in the Vercel environment, despite working locally.

This issue prevents the application from correctly fetching and displaying data in production.

**Code:**

The relevant code is as follows:

* **Server Actions (`actions/app.action.ts`):**

    ```typescript
    "use server"

    import prisma from "@/lib/prisma"

    export async function fetchAllRooms() {
      try {
        const rooms = await prisma.room.findMany()
        return { data: rooms }
      } catch (error) {
        return { error: "Failed to fetch rooms" }
      }
    }
    ```

* **Main Page (`/page.tsx`):**

    ```typescript
    "use client"

    import { useQuery } from "@tanstack/react-query"
    import { fetchAllRooms } from "@/actions/app.action"

    function Rooms() {
      const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
          const result = await fetchAllRooms()
          if (result.error) throw new Error(result.error)
          return result.data
        },
      })

      if (isLoading)
        return (
           //   loading component, check the src code
        )

      if (error) {
        //   error component, check the src code
      }

      return (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Rooms List:</h2>
          {data?.map((room) => (
            <div key={room.id} className="p-4 border rounded">
              {room.name}
            </div>
          ))}
        </div>
      )
    }

    export default function Home() {
      return (
        <main className="w-screen h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-8">Fetch All Rooms</h1>
          <Rooms />
        </main>
      )
    }
    ```

* **Room Details Page (`/rooms/[id]/page.tsx`):**
Refer to "/rooms[id]/page.tsx"

**How to Reproduce:**

1.  **Clone this repository:**

    ```bash
    git clone https://github.com/ussfranck/nextjs-prisma-server-actions-issue
    cd nextjs-prisma-server-actions-issue
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    # or npm install
    # or yarn install
    ```

3.  **Set up Prisma:**

    * Set up a PostgreSQL database (e.g., using Neon).
    * Configure the `.env` file with the PostgreSQL database connection URL.
    * Run Prisma migrations:

        ```bash
        npx prisma migrate dev
        ```

4.  **Run the Next.js application locally:**

    ```bash
    pnpm dev
    # or npm run dev
    # or yarn dev
    ```

    * Verify that the application works correctly and data is fetched from the database.  Navigate to the main page (`/`) and the room details page (`/rooms/some-room-id`).

5.  **Deploy to Vercel:**

    * Deploy the Next.js application to Vercel.
    * Ensure that the Vercel environment variables are correctly configured with the PostgreSQL database connection URL.

6.  **Access the application on Vercel:**

    * Open the deployed application on Vercel.
    * Attempt to access the main page (`/`) and the room details page (`/rooms/some-room-id`).

7.  **Observe the error:**

    * The application will display an error page in the browser.
    * The Vercel function logs will show a "PrismaClientKnownRequestError" with the message "Error validating datasource \`db\`: the URL must start with the protocol \`prisma:\`".
    * ![Vercel Error Log](https://github.com/ussfranck/nextjs-prisma-server-actions-issue/blob/main/Screenshot%202025-05-11%20153907.png?raw=true)

**Expected Behavior:**

The application should fetch data from the PostgreSQL database and display it correctly, both in local development and in the Vercel production environment.

**Actual Behavior:**

The application functions correctly in local development, but fails in the Vercel production environment with a Prisma error related to the database URL protocol.

**Environment:**

* Next.js version:  `15.3.2`
* Prisma version:  `^6.5.0` or `6.7.0` same effect.
* Node.js version:  `[Your Node.js version]`
* Operating System:  `Winddows 11 24H2` (for local development)
* Deployment Environment: `Vercel`

**Additional Information:**

* The database connection URL is a standard PostgreSQL connection string (e.g., `postgresql://user:password@host:port/database`).
* The issue seems to be related to how Vercel handles the database URL or how Prisma resolves it in the Vercel environment.
* The problem does *not* occur when running the application locally.
* Attempts to use \`?sslmode=require\` in the connection string do not resolve the issue.
* Using the  \`dataProxy\`  option in Prisma is not a solution.
* Adding a  \`vercel.json\`  with specific configurations does not resolve the issue.
* Clearing the Vercel build cache does not resolve the issue.
