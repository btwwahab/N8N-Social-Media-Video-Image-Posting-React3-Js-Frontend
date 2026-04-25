# 📋 N8N Workflow Integration Guide

## Overview

This frontend integrates with your n8n **Workflow 7** for AI-powered social media automation. The workflow uses two webhooks to generate content and publish to multiple platforms.

---

## 🔄 Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW 7 - FLOW                            │
└─────────────────────────────────────────────────────────────────┘

PART 1: Content Generation
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Webhook7   │────▶│  AI Agent7  │────▶│ Post Format7 │
│  (POST)     │     │  (Gemini)   │     │  (Code)      │
└─────────────┘     └─────────────┘     └──────────────┘
                            │
                    ┌───────▼───────┐
                    │ Gemini Chat   │
                    │  Model7       │
                    └───────────────┘
        │
        ▼
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│ Generate     │────▶│ Convert Binary   │────▶│ Return      │
│ Image7       │     │ to Base64        │     │ Generated   │
│ (Imagen 4.0) │     │                  │     │ Post7       │
└──────────────┘     └──────────────────┘     └─────────────┘


PART 2: Multi-Platform Publishing
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Confirm      │────▶│ Code JS13    │────▶│ Platform     │
│ Webhook7     │     │ (Split       │     │ Filter20     │
│              │     │  platforms)  │     │ (Switch)     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                        ┌─────────────────────────┼──────────────┐
                        │                         │              │
                   [Facebook]               [Instagram]      [LinkedIn]
                        │                         │              │
        ┌───────────────▼────────┐    ┌──────────▼───────┐    ┌▼─────────┐
        │ Download Image         │    │ Set Instagram    │    │ Get      │
        │ for Facebook           │    │ Parameters7      │    │ Linkdin7 │
        └───────────┬────────────┘    └──────────┬───────┘    └┬─────────┘
                    │                            │              │
        ┌───────────▼────────┐    ┌──────────────▼───────┐    │
        │ Upload Photo       │    │ Get data Instagram7  │    │
        │ to Facebook        │    │ (Create container)   │    │
        └───────────┬────────┘    └──────────┬───────────┘    │
                    │                        │                 │
                    │             ┌──────────▼───────┐         │
                    │             │ Wait for Media   │         │
                    │             │ Processing7      │         │
                    │             │ (10 seconds)     │         │
                    │             └──────────┬───────┘         │
                    │                        │                 │
                    │             ┌──────────▼───────┐         │
                    │             │ Post to          │         │
                    │             │ Instagaram7      │         │
                    │             └──────────┬───────┘         │
                    │                        │          ┌──────▼───────┐
                    │                        │          │ Download     │
                    │                        │          │ Image URL    │
                    │                        │          └──────┬───────┘
                    │                        │                 │
                    │                        │          ┌──────▼───────┐
                    │                        │          │ Register     │
                    │                        │          │ LinkedIn     │
                    │                        │          │ Upload       │
                    │                        │          └──────┬───────┘
                    │                        │                 │
                    │                        │          ┌──────▼───────┐
                    │                        │          │ Merge Binary │
                    │                        │          │ with Upload  │
                    │                        │          │ Info         │
                    │                        │          └──────┬───────┘
                    │                        │                 │
                    │                        │          ┌──────▼───────┐
                    │                        │          │ Upload Image │
                    │                        │          │ to LinkedIn  │
                    │                        │          └──────┬───────┘
                    │                        │                 │
                    │                        │          ┌──────▼───────┐
                    │                        │          │ Post to      │
                    │                        │          │ LinkedIn7    │
                    │                        │          └──────┬───────┘
                    └────────────────────────┴──────────────────┘
                                             │
                                 ┌───────────▼───────────┐
                                 │ Collect Platform      │
                                 │ Results (Aggregate)   │
                                 └───────────┬───────────┘
                                             │
                                 ┌───────────▼───────────┐
                                 │ Build Response        │
                                 │ (Code - Format JSON)  │
                                 └───────────┬───────────┘
                                             │
                                 ┌───────────▼───────────┐
                                 │ Send Response         │
                                 │ (Respond to Webhook)  │
                                 └───────────────────────┘
```

---

## 📝 Webhook 1: Generate Post

**Node:** `Webhook7`  
**Webhook ID:** `36549d14-0976-4efb-b91c-314fbae8df65`  
**Path:** `/webhook/36549d14-0976-4efb-b91c-314fbae8df65`  
**Method:** `POST`  
**Response Mode:** `responseNode` (Returns via Return Generated Post7)

### Request Body

```json
{
  "topic": "Building AI-powered automation systems"
}
```

### Processing Steps

1. **AI Agent7** (Google Gemini Chat Model):
   - Uses custom system prompt for Abdul Wahab's professional voice
   - Generates engaging caption (under 250 words)
   - Includes 3-6 relevant hashtags
   - Optimized for LinkedIn, Facebook, and Instagram

2. **Post Formating7** (Code Node):
   - Escapes newlines for JSON (`\n` → `\\n`)
   - Prepares text for API transmission

3. **Generate Image7** (Google Gemini Imagen 4.0):
   - Creates professional, minimalistic image
   - Based on caption theme (no text overlay)
   - Modern aesthetic suitable for all platforms

4. **Convert Binary to Base70** (Code Node):
   - Converts image binary to base64 string
   - Merges caption and image data

5. **Return Generated Post7** (Respond to Webhook):
   - Returns JSON response to frontend

### Response Body

```json
{
  "generatedPost": "Building intelligent systems isn't just about code — it's about solving real business problems at scale 💼🤖\n\nOver the last project, we integrated LLM-driven automation with our Laravel & React.js platform, reducing manual workflows by 40% and increasing user engagement by 30% 🚀📈\n\n#FullStack #AIEngineering #BusinessGrowth #Automation #TechLeadership",
  "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
  "confirmUrl": "https://abwahab12.app.n8n.cloud/webhook/confirm-post",
  "message": "Post and image generated successfully. Send POST to confirmUrl with {platforms, post, imageBase64} to publish."
}
```

---

## 🚀 Webhook 2: Confirm Post (Publish)

**Node:** `Confirm Webhook7`  
**Webhook ID:** `278e3182-5c96-4842-952b-6e67ab9f8885`  
**Path:** `/webhook/confirm-post`  
**Method:** `POST`  
**Response Mode:** `responseNode` (Returns via Send Response)

### Request Body

```json
{
  "platforms": ["linkedin", "facebook", "instagram"],
  "post": "Your post caption with emojis and #Hashtags 🚀",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123456/image.jpg"
}
```

**Required Fields:**
- `platforms` (array): One or more of `["linkedin", "facebook", "instagram"]`
- `post` (string): Final caption text
- `imageUrl` (string): Public URL of the image (uploaded to Cloudinary by frontend)

### Processing Steps

1. **Code in JavaScript13**:
   - Splits platforms array into separate items
   - Creates parallel execution paths

2. **Platform Filter20** (Switch Node):
   - Routes to appropriate publishing branch per platform

#### Facebook Branch

3. **Download Image for Facebook**:
   - Downloads image from Cloudinary URL as binary

4. **Upload Photo to Facebook** (HTTP Request):
   - Posts to Facebook Graph API v22.0
   - Page ID: `779014315304764`
   - Endpoint: `/photos` with `message` and `source` (binary)
   - Requires `pages_manage_posts` permission

#### Instagram Branch

5. **Set Instagram Parameters7**:
   - Sets Instagram Business Account ID: `17841452500837606`
   - Prepares caption and imageUrl

6. **Get data Instagram7** (Facebook Graph API):
   - Creates Instagram media container
   - Endpoint: `/{account_id}/media`
   - Returns `creation_id`

7. **Wait for Media Processing7** (Wait Node):
   - 10-second delay for Instagram processing
   - Required for media container to be ready

8. **Post to Instagaram7** (Facebook Graph API):
   - Publishes container to Instagram
   - Endpoint: `/{account_id}/media_publish`
   - Uses `creation_id` from previous step

#### LinkedIn Branch

9. **Get data Linkdin7** (HTTP Request):
   - Fetches LinkedIn user info
   - Endpoint: `/v2/userinfo`
   - Returns `sub` (person URN)

10. **Download Image from URL**:
    - Downloads image binary from Cloudinary

11. **Register LinkedIn Image Upload** (HTTP Request):
    - Registers asset with LinkedIn
    - Endpoint: `/v2/assets?action=registerUpload`
    - Returns upload URL and asset URN

12. **Merge Binary with Upload Info** (Code Node):
    - Combines image binary with upload metadata

13. **Upload Image to LinkedIn** (HTTP Request):
    - Uploads image to LinkedIn CDN
    - PUT request with `Content-Type: application/octet-stream`

14. **Post to LinkedIn7** (HTTP Request):
    - Creates UGC post
    - Endpoint: `/v2/ugcPosts`
    - Links uploaded image asset
    - Posts to `PUBLIC` visibility

#### Final Aggregation

15. **Collect Platform Results** (Aggregate Node):
    - Gathers all platform responses
    - Waits for all branches to complete

16. **Build Response** (Code Node):
    - Formats unified response with per-platform status
    - Handles success/error for each platform

17. **Send Response** (Respond to Webhook):
    - Returns detailed results to frontend

### Response Body

#### Success (All Platforms)

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
      "details": {
        "id": "urn:li:share:7134567890123456789",
        "response": { /* Full LinkedIn API response */ }
      }
    },
    {
      "platform": "facebook",
      "status": "success",
      "message": "Successfully posted to facebook",
      "details": {
        "id": "779014315304764_123456789012345",
        "response": { /* Full Facebook API response */ }
      }
    },
    {
      "platform": "instagram",
      "status": "success",
      "message": "Successfully posted to instagram",
      "details": {
        "id": "17984562301234567",
        "response": { /* Full Instagram API response */ }
      }
    }
  ]
}
```

#### Partial Success (Some Failed)

```json
{
  "status": "partial_success",
  "message": "Some posts failed to publish",
  "totalPlatforms": 3,
  "successCount": 2,
  "errorCount": 1,
  "platforms": [
    {
      "platform": "linkedin",
      "status": "success",
      "message": "Successfully posted to linkedin",
      "details": { /* ... */ }
    },
    {
      "platform": "facebook",
      "status": "error",
      "message": "Failed to post to facebook",
      "details": {
        "message": "Invalid OAuth access token",
        "type": "OAuthException",
        "code": 190
      }
    },
    {
      "platform": "instagram",
      "status": "success",
      "message": "Successfully posted to instagram",
      "details": { /* ... */ }
    }
  ]
}
```

---

## 🔧 Frontend Integration

### Environment Variables

Update your `.env` file:

```bash
# Replace YOUR_N8N_INSTANCE with your actual instance (e.g., abwahab12)
VITE_N8N_WEBHOOK_GENERATE_POST=https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/36549d14-0976-4efb-b91c-314fbae8df65
VITE_N8N_WEBHOOK_CONFIRM_POST=https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/confirm-post

# Cloudinary for image hosting (required)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Dashboard Component Features

The updated Dashboard now handles:

✅ **Per-platform status tracking**  
✅ **Detailed error messages from Build Response node**  
✅ **Partial success notifications (warning toast)**  
✅ **Platform-specific result display**  
✅ **Real-time publishing indicators**

### Response Handling

```javascript
const result = await response.json();

// Store detailed platform results
setPlatformResults(result.platforms); // Array of per-platform details

// Update status for each platform
result.platforms.forEach(platformResult => {
  // platformResult.status: "success" or "error"
  // platformResult.message: Human-readable message
  // platformResult.details: Full API response or error info
});

// Show appropriate notification
if (result.status === 'success') {
  showNotification('success', result.message);
} else {
  showNotification('warning', 'Partial success - check details');
}
```

---

## 🐛 Troubleshooting

### Issue: "No post content generated"
**Cause:** AI Agent7 or Google Gemini API issue  
**Solution:**
- Check Google Gemini API credentials in n8n
- Verify API quota is not exceeded
- Check n8n execution logs for AI Agent7 node

### Issue: "Image generation failed"
**Cause:** Google Gemini Imagen 4.0 issue  
**Solution:**
- Verify Gemini API has Imagen access enabled
- Check prompt is not violating content policies
- Ensure image model ID is `models/imagen-4.0-generate-001`

### Issue: "LinkedIn post failed"
**Cause:** OAuth token expired or invalid  
**Solution:**
- Re-authenticate LinkedIn OAuth in n8n credentials
- Verify person URN in "Get data Linkdin7" response
- Check image upload completed successfully

### Issue: "Instagram timeout"
**Cause:** Media container not ready in 10 seconds  
**Solution:**
- Increase wait time in "Wait for Media Processing7"
- Verify image URL is publicly accessible
- Check Instagram Business Account ID is correct

### Issue: "Facebook permission error"
**Cause:** Missing required permissions  
**Solution:**
- Verify Facebook Graph API token has:
  - `pages_manage_posts`
  - `pages_read_engagement`
- Check Page ID `779014315304764` is correct
- Re-authenticate if needed

### Issue: "Partial success - some platforms failed"
**Expected Behavior:** Frontend shows detailed per-platform status  
**Action:**
- Check platform-specific error details in UI
- Review n8n execution log for failed branch
- Fix credentials/IDs for failed platform
- Retry publishing

---

## 📊 Performance Metrics

| Step | Average Time |
|------|-------------|
| AI Caption Generation | 10-15 seconds |
| Image Generation (Imagen 4.0) | 10-15 seconds |
| **Total Generation** | **20-30 seconds** |
| Cloudinary Upload | 2-5 seconds |
| Facebook Publishing | 5-10 seconds |
| Instagram Publishing | 20-25 seconds (includes 10s wait) |
| LinkedIn Publishing | 10-15 seconds |
| **Total Publishing (3 platforms)** | **25-30 seconds** |

---

## 🔒 Security Checklist

- [ ] N8N webhooks have CORS enabled (`*` or specific origin)
- [ ] Cloudinary upload preset restricts file types to images
- [ ] LinkedIn OAuth token has minimal required scopes
- [ ] Facebook Graph API token has page-specific access
- [ ] Instagram Business Account is linked to Facebook Page
- [ ] Environment variables are not committed to Git (`.env` in `.gitignore`)
- [ ] N8N instance is secured with authentication

---

## 📞 Support Resources

**N8N Documentation:** https://docs.n8n.io  
**LinkedIn API v2:** https://learn.microsoft.com/en-us/linkedin/  
**Facebook Graph API:** https://developers.facebook.com/docs/graph-api  
**Instagram API:** https://developers.facebook.com/docs/instagram-api  
**Google Gemini:** https://ai.google.dev/gemini-api/docs  

---

**Last Updated:** November 15, 2025  
**Workflow Version:** 7  
**Frontend Version:** 1.0.0
