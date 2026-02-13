# Product Requirements Document (PRD) - CarouselGen

## 1. Overview
**Product Name:** CarouselGen
**Problem:** Content creators struggle to create engaging, consistent Instagram carousels quickly on mobile. Existing tools are complex desktop design apps or expensive agencies.
**Solution:** A minimal, mobile-first web app that generates clean, ready-to-post carousels from a simple text idea or audio input, using AI for content structuring and a standardized design system for consistency.

## 2. Target Audience
- Instagram content creators / influencers.
- Small business owners managing their own social media.
- Educators/Coaches sharing informational content.

## 3. Scope (MVP vs Future)
### MVP (v1) - *Current Focus*
- **Authentication:** Login with Instagram via Clerk (OAuth).
- **Input:** Textarea for idea text + Audio recording placeholder button.
- **Generation:** "Refine with AI" (mock) divides text into 5-10 slides.
- **Editor:** Mobile-friendly vertical list of editable cards (slides).
  - Each card has auto-resizing text area.
  - Footer with user avatar, handle, and branding "@raphaieu".
  - "Attach Image" button per card (upload).
- **Export:**
  - Watermark "@raphaieu" on preview.
  - Payment Flow: Email input + Pix QR Code (Mock/Transparency).
  - Post-payment: Remove watermark, Generate ZIP, Save to S3 (7 days), Email link via Resend.
- **History:** Log generations in Supabase.

### Future (v2)
- Real AI integration (OpenAI/Anthropic).
- Direct publishing to Instagram API.
- Multiple themes/templates.
- Analytics.
- Subscription model.

## 4. User Flows
### Creation Flow
1.  **Login**: User logs in with Instagram.
2.  **Dashboard**: Sees "New Post" input. Types idea: "5 tips for productivity".
3.  **Generate**: Clicks "Refine". App shows 5 cards with drafted content.
4.  **Edit**: User tweaks text on Card 3, uploads an image to Card 1.
5.  **Preview**: Scrolls through the carousel preview.
6.  **Checkout**: Clicks "Receive Images". Enters email. Pays PIX.
7.  **Receive**: Sees "Payment Confirmed". Receives email with ZIP download.

## 5. Monetization
- **Model**: Pay-per-pack or Pay-per-generation (MVP).
- **Pricing**: Fixed fee (e.g., R$ 9,90) per generated pack / download.
- **Payment Gateway**: Mercado Pago (Pix).

## 6. Non-Functional Requirements
- **Mobile-First**: UI must work perfectly on smartphones.
- **Speed**: Preview updates instantly.
- **Simplicity**: No complex design controls (fonts, colors fixed to "Clean" style).
- **Privacy**: User images stored temporarily (7 days).

## 7. Success Metrics
- **Conversion Rate**: % of users who click "Receive Images" after generating.
- **Retention**: % of returning users.
