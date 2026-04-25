# Frontend Setup Instructions

## Prerequisites
- Node.js 18+ and npm/yarn

## Setup Steps

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` if needed (default points to localhost:8000):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Run development server:
```bash
npm run dev
# or
yarn dev
```

The app will be available at http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── doctors/
│   │   ├── appointments/
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── card.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
├── store/
│   ├── authStore.ts
│   └── appointmentStore.ts
└── types/
    └── index.ts
```

## Features Implemented

- User authentication (login/register)
- JWT token management with auto-refresh
- Doctor listing with search/filter
- Appointment booking
- Appointment management
- Responsive design with Tailwind CSS
- Type-safe with TypeScript
- State management with Zustand
- Form validation with Zod

## Build for Production

```bash
npm run build
npm start
```
