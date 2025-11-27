# LolaBot

A modern, embeddable AI chat widget built with Next.js, optimized for easy integration into any website.

## Features

- 💬 **Embeddable Widget**: Easy to add to any site with a simple script tag.
- 🌗 **Dark/Light Mode**: Auto-detects system preference or can be forced.
- 📱 **Responsive**: Works on mobile and desktop.
- 🖥️ **Maximize/Collapse**: Users can expand the chat to full screen or minimize it.
- 🔄 **Session Persistence**: Remembers user sessions across page reloads (anonymous or identified).
- 📁 **File Uploads**: Supports image and audio uploads.
- 🚀 **Docker Ready**: Easy deployment with Docker.

## Installation & Deployment

### 1. Prerequisites

- [Docker](https://www.docker.com/) installed.
- A [MongoDB](https://www.mongodb.com/) instance (local or Atlas).
- An S3-compatible storage (AWS S3, Cloudflare R2, MinIO) for file uploads.

### 2. Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Bot Info (Customizable)
NEXT_PUBLIC_BOT_TITLE=LolaBot
NEXT_PUBLIC_BOT_DESCRIPTION="Your AI Assistant"
NEXT_PUBLIC_BOT_SHORTNAME=Lola
NEXT_PUBLIC_BOT_SLUG=my-bot-slug

# Webhooks (Your AI Agent Backend)
WEBHOOK_OUTGOING_URL=https://your-n8n-or-backend.com/webhook

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=lolabot

# Storage (S3/R2)
STORAGE_PROVIDER=S3
S3_BUCKET=your-bucket
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.amazonaws.com
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# CORS (Optional)
EMBED_ALLOWED_ORIGINS=https://your-website.com,https://another-site.com
```

### 3. Running with Docker

Build and run the container:

```bash
# Build the image
docker build -t lolabot:latest .

# Run the container (replace env vars or pass --env-file)
docker run -d \
  -p 3000:3000 \
  --name lolabot \
  --env-file .env \
  lolabot:latest
```

The app will be available at `http://localhost:3000`.

## How to Embed

Add the following code to your website's HTML, just before the closing `</body>` tag:

```html
<script 
  src="https://your-lolabot-domain.com/embed/lolabot.js"
  data-bot-id="my-bot-slug"
  data-theme="light" 
></script>
```

### Configuration Options

| Attribute | Description | Default |
| :--- | :--- | :--- |
| `src` | **Required**. URL to the `lolabot.js` file on your deployment. | - |
| `data-bot-id` | **Required**. Must match `NEXT_PUBLIC_BOT_SLUG` set in env. | `lola-demo` |
| `data-user-id` | Optional. Unique ID for the user (e.g. from your auth system). | Anonymous |
| `data-theme` | Optional. `light` or `dark`. | Auto-detect |

### Identifying Users

If your website has logged-in users, pass their unique ID to persist their chat history across devices:

```html
<script 
  src="..."
  data-bot-id="my-bot-slug"
  data-user-id="USER_12345"
></script>
```

## Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run development server:
    ```bash
    npm run dev
    ```
3.  Open `http://localhost:3000`.
4.  Test the embed widget locally at `http://localhost:3000/test-embed.html`.

