## Getting Started

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

What we are using 
Clerk.com for auth
Shadcn for UI components
PlanetScale for online database
Prisma ORM
Uploadthing.com for uploading images


To make changes in db schema

npx prisma generate 
npx prisma db push
npx prisma studio