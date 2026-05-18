# 🚀 AI Social Automation Hub (React + Vite Frontend)

A modern React (Vite) frontend that connects to **n8n** webhooks to:

- Generate AI social media content (caption + **image or video**) using your n8n workflow
- Preview and customize the generated caption
- Publish to multiple platforms (**LinkedIn, Facebook, Instagram**) via a second n8n webhook
- Upload media to **Cloudinary** first, then send only a public media URL to n8n

This repository is the **frontend UI** for the automation system.

---

## Table of Contents

- [What this project does](#what-this-project-does)
- [Architecture (end-to-end)](#architecture-end-to-end)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [n8n workflow setup](#n8n-workflow-setup)
- [Cloudinary setup](#cloudinary-setup)
- [Run / build / deploy](#run--build--deploy)
- [How to use the app](#how-to-use-the-app)
- [API / Webhook contracts](#api--webhook-contracts)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Credits](#credits)

---

## What this project does

This frontend provides a single dashboard experience:

1. **Enter a topic** (optionally include the word “video” to request video generation).
2. Click **Generate** to call your **n8n “Generate Post” webhook**.
3. The workflow returns:
   - `generatedPost` (caption text)
   - `mediaType` (`image` or `video`)
   - `imageBase64` or `videoBase64`
4. The UI shows a **preview** (caption + image/video).
5. Select one or more platforms.
6. Click **Publish**:
   - Media is uploaded to **Cloudinary**
   - The app calls the **n8n “Confirm Post” webhook** with `platforms`, `post` and a public `imageUrl`/`videoUrl`
7. The workflow posts to platforms and returns **per-platform results** (success/error + details), which the UI displays.

---

## Architecture (end-to-end)

**Frontend (this repo)**
- React UI, manages topic input, preview, platform selection, and status display
- Uploads base64 media to Cloudinary to obtain a public URL
- Calls n8n webhooks for generation and publishing

**n8n (your backend automation)**
- Webhook 1: generates caption + media
- Webhook 2: publishes to selected platforms and returns structured status

**Cloudinary (media hosting)**
- Stores images/videos so social platform APIs can fetch them via HTTPS URLs

---

## Prerequisites

- **Node.js** (LTS recommended)
- **npm**
- An **n8n instance** (cloud or self-hosted)
- A **Cloudinary** account (free tier works)
- Valid credentials configured in n8n for:
  - LinkedIn
  - Facebook Pages
  - Instagram Business
  - (and any AI services used in your workflow, e.g., Gemini)

---

## Quick start

```bash
# 1) Install dependencies
npm install

# 2) Create local env file
cp .env.example .env

# 3) Edit .env with your real values
# (see "Environment variables" section)

# 4) Run the dev server
npm run dev
```

Vite will print a local URL (commonly `http://localhost:5173`).

---

## Environment variables

Create a `.env` file in the project root (you can start from `.env.example`).

Required variables used by the app:

- **n8n webhooks**
  - `VITE_N8N_WEBHOOK_GENERATE_POST` — Webhook #1 (generate caption + media)
  - `VITE_N8N_WEBHOOK_CONFIRM_POST` — Webhook #2 (publish)

- **Cloudinary**
  - `VITE_CLOUDINARY_CLOUD_NAME`
  - `VITE_CLOUDINARY_UPLOAD_PRESET`

There are also auth-related variables in `.env.example`:

- `VITE_APP_ADMIN_USERNAME`
- `VITE_APP_ADMIN_EMAIL`
- `VITE_APP_ADMIN_PASSWORD`
- `VITE_APP_JWT_SECRET`
- `VITE_APP_SESSION_TIMEOUT`

> Note: This repo includes auth configuration variables, but the exact auth implementation depends on your app components. Keep secrets out of git and rotate them if exposed.

Example (do not commit real secrets):

```env
VITE_N8N_WEBHOOK_GENERATE_POST=https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/36549d14-0976-4efb-b91c-314fbae8df65
VITE_N8N_WEBHOOK_CONFIRM_POST=https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/confirm-post

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

---

## n8n workflow setup

This project expects an n8n workflow similar to what’s documented in:

- `N8N_WORKFLOW_GUIDE.md`
- `n8n-social-media-image-posting.json` (example workflow export)

### Webhook 1 (Generate Post)

- Method: `POST`
- Uses the env var: `VITE_N8N_WEBHOOK_GENERATE_POST`

### Webhook 2 (Confirm / Publish)

- Method: `POST`
- Uses the env var: `VITE_N8N_WEBHOOK_CONFIRM_POST`

### CORS

If your n8n instance is on a different domain than your frontend, ensure CORS is enabled appropriately for the webhooks.

---

## Cloudinary setup

Follow the step-by-step guide:

- `CLOUDINARY_SETUP.md`

High level:

1. Create Cloudinary account
2. Create an **unsigned upload preset**
3. Put `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` into `.env`

The frontend uploads media to:

- Images: `https://api.cloudinary.com/v1_1/<cloudName>/image/upload`
- Videos: `https://api.cloudinary.com/v1_1/<cloudName>/video/upload`

Then it sends only the resulting `secure_url` to your n8n Confirm webhook.

---

## Run / build / deploy

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

Deploy the built output (`dist/`) to your preferred static host (Vercel, Netlify, Cloudflare Pages, S3, etc.).

---

## How to use the app

1. Start the app.
2. Login (if your UI/auth flow requires it).
3. In the dashboard:
   - Enter a topic (tip: include “video” to request a video)
   - Click **Generate Post**
4. Review/edit the generated caption.
5. Choose platforms (LinkedIn/Facebook/Instagram).
6. Click **Publish**.
7. Watch per-platform results:
   - success / error
   - detailed error messages (if provided by n8n)

---

## API / Webhook contracts

### 1) Generate Post webhook

**Request**

```json
{ "topic": "Building AI-powered automation systems" }
```

**Response (expected)**

```json
{
  "generatedPost": "...",
  "mediaType": "image",
  "imageBase64": "...",
  "videoBase64": "",
  "confirmUrl": "https://<your-n8n>/webhook/confirm-post",
  "message": "Post and image generated successfully"
}
```

> The frontend reads `generatedPost` (or falls back to `captionText`) and detects `mediaType`.

### 2) Confirm / Publish webhook

**Request (image)**

```json
{
  "platforms": ["linkedin", "facebook"],
  "post": "Your caption text...",
  "imageUrl": "https://res.cloudinary.com/.../image/upload/..."
}
```

**Request (video)**

```json
{
  "platforms": ["linkedin"],
  "post": "Your caption text...",
  "videoUrl": "https://res.cloudinary.com/.../video/upload/..."
}
```

**Response (expected structured result)**

```json
{
  "status": "success",
  "message": "All posts published successfully",
  "totalPlatforms": 3,
  "successCount": 3,
  "errorCount": 0,
  "platforms": [
    {
      "platform": "linkedin",
      "status": "success",
      "message": "Successfully posted to linkedin",
      "details": { "id": "..." }
    }
  ]
}
```

The UI shows detailed cards for each `platforms[]` entry.

---

## Project structure

Typical layout (may evolve):

- `src/` — React application source
  - `components/` — UI components (Dashboard, Preview, platform selector, etc.)
- `public/` — static assets
- `.env.example` — environment variables template
- `N8N_WORKFLOW_GUIDE.md` — detailed workflow documentation
- `CLOUDINARY_SETUP.md` — Cloudinary setup
- `QUICK_REFERENCE.md` — quick guide to responses/UI

---

## Troubleshooting

Common issues:

### 1) Generate webhook returns non-JSON or empty response
- Verify `VITE_N8N_WEBHOOK_GENERATE_POST`
- Check n8n execution logs
- Ensure the webhook response node returns JSON

### 2) Publish fails for one platform (partial success)
- This is expected behavior.
- The UI will show platform-specific errors returned by n8n.
- Fix the credential/scopes/IDs in the failing platform branch, then retry.

### 3) Cloudinary upload fails
- Ensure `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` exist
- Ensure your preset is **unsigned** (or update the app for signed uploads)
- Ensure file size/type limits allow your media

### 4) Instagram publishing timing out
- Increase the wait time in n8n’s Instagram branch

More details: see `N8N_WORKFLOW_GUIDE.md`.

---

## Security notes

- Do **not** commit `.env`.
- Lock down your Cloudinary unsigned preset:
  - restrict allowed formats
  - set upload limits
  - optionally set a target folder
- Secure your n8n instance:
  - authentication enabled
  - restrict webhook access/origins
  - rotate platform tokens regularly

---

## Credits

- Built with **React + Vite**
- Styling with **Tailwind CSS**
- Automation orchestration with **n8n**
- Media hosting via **Cloudinary**

---

## Docs included in this repo

- `N8N_WORKFLOW_GUIDE.md` — workflow architecture, webhook payloads, and troubleshooting
- `CLOUDINARY_SETUP.md` — Cloudinary account/preset setup
- `QUICK_REFERENCE.md` — response structure and UI behavior quick card
- `UPDATE_SUMMARY.md` — notes about recent frontend workflow-response handling updates
