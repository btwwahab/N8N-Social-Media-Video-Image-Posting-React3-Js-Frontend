# Cloudinary Setup Instructions

## 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

## 2. Get Your Credentials

### Cloud Name
1. Log in to your Cloudinary dashboard
2. Your **Cloud Name** is displayed at the top of the dashboard
3. Copy it (e.g., `dcxyz1234`)

### Upload Preset (Unsigned)
1. Go to **Settings** → **Upload** in your Cloudinary dashboard
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Signing Mode**: Select `Unsigned`
   - **Preset name**: Enter a name (e.g., `n8n-social-posts`)
   - **Folder**: (optional) e.g., `social-media-posts`
   - **Upload limits**: Configure as needed
5. Click **Save**
6. Copy the preset name

## 3. Update Your .env File

Open `/var/www/html/n8n-automation/.env` and update:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

Replace:
- `your_cloud_name_here` with your actual Cloud Name
- `your_upload_preset_here` with your unsigned upload preset name

## 4. Restart Your Dev Server

```bash
npm run dev
```

## How It Works

1. When you click "Publish", the app uploads the base64 image to Cloudinary
2. Cloudinary returns a secure HTTPS URL
3. Only the URL is sent to the n8n webhook (not the base64 data)
4. n8n receives: `{ "platforms": [...], "post": "...", "imageUrl": "https://res.cloudinary.com/..." }`

## Benefits

✅ **Faster**: Sending URLs is much faster than base64 data
✅ **Reliable**: No size limits or encoding issues
✅ **Scalable**: Images stored on Cloudinary CDN
✅ **Permanent**: Images remain accessible even after publishing
