# Technical Specification (SPEC) - CarouselGen

## 1. Architecture
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel (recommended)

### Data Flow
`User Input` -> `Client App` -> `Server Actions` -> `External APIs`
- **Auth**: Clerk (handle session).
- **DB**: Supabase (store user meta/history).
- **Storage**: AWS S3 (store generated images/ZIPs).
- **Email**: Resend (delivery).
- **Payments**: Mercado Pago (transaction).

## 2. Database Schema (Supabase)
### Table: `generations`
| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Unique ID |
| `user_id` | text | Clerk User ID |
| `email` | text | User email for delivery |
| `status` | text | 'pending', 'paid', 'completed' |
| `zip_url` | text | S3 Presigned URL (optional) |
| `created_at` | timestamp | Creation time |
| `expires_at` | timestamp | S3 expiry (7 days later) |

## 3. API Routes & Server Actions
- `GET /api/auth/webhook`: Sync Clerk users to Supabase (optional for MVP if relying on client).
- `POST /api/generate`: (Mock) Accepts text, returns array of slide objects `{ title, content }`.
- `POST /api/checkout`: Initiates Mercado Pago payment.
- `POST /api/webhook/payment`: MP Webhook to confirm payment.
- `POST /api/deliver`: (Internal) Triggered after payment to generate ZIP, upload S3, send Resend email.

## 4. Integration Details
### Auth (Clerk)
- Use standard `<SignIn />` and `<UserButton />`.
- Middleware protects `/dashboard`.

### Storage (AWS S3)
- Bucket: `carouselgen-assets`
- Paths: `temp/{userId}/{genId}/`
- Lifecycle Rule: Delete after 7 days.

### Email (Resend)
- Template: Simple HTML with "Download your Carousel" button.

### Payment (Mercado Pago)
- Use "Pix Checkout Transparente".
- For placeholder: Simple mock dialog that sets `status='paid'`.

## 5. Security Considerations
- **Environment Variables**: Store all keys in `.env.local` (local) and Vercel envs.
- **Rogue Uploads**: Validate file types (images only) and size limits (5MB) in server actions.
- **Access Control**: Users can only access their own generation data.

## 6. Directory Structure
```
app/
  page.tsx (Landing)
  dashboard/
    page.tsx (Main Tool)
  api/
    generate/
    checkout/
components/
  ui/ (shadcn)
  EditableCard.tsx
  PreviewCarousel.tsx
  PaymentDialog.tsx
lib/
  supabase.ts
  s3.ts
  resend.ts
  utils.ts
types/
  index.ts
docs/
  PRD.md
  SPEC.md
```
