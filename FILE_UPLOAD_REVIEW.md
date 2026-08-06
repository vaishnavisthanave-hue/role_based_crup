# File Upload & Get Scenario Review

**Review date:** August 6, 2026  
**Project:** role_based_crup — Business media upload API

---

## Desired Scenario

| Requirement | Description |
|-------------|-------------|
| Upload types | Audio, image, video, and generic files |
| Optimization | Compress/optimize files after upload |
| Fast GET / view | Serve media in chunks for rapid loading (streaming) |
| Thumbnails | Generate thumbnails for image and video |
| Duplicate restriction | Block uploading the same file multiple times |

---

## Feature Verification Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Upload **image** | ✅ Partial | Supported via Multer |
| Upload **video** | ✅ Partial | Supported via Multer |
| Upload **audio** | ❌ Missing | Not in MIME filter |
| Upload **generic files** (PDF, DOC, etc.) | ❌ Missing | Not in MIME filter |
| **Optimize** uploaded files | ❌ Missing | No compression/resizing |
| **Chunked / streaming GET** | ❌ Missing | No Range support or media routes |
| **Thumbnail** generation | ❌ Missing | No thumbnail fields or logic |
| **Duplicate upload** restriction | ⚠️ Partial | Images only, on create |

---

## What Is Implemented

### 1. Upload Middleware (`src/middleware/upload.js`)

- Uses **Multer** with disk storage
- Saves files to `src/uploads/`
- Filename: `Date.now() + extension`
- Max file size: **100 MB**
- Allowed MIME types:
  - **Images:** jpeg, jpg, png, gif, webp
  - **Videos:** mp4, webm, mov, avi, mkv

### 2. Business Routes (`src/routes/businessRoutes.js`)

| Method | Route | Upload fields |
|--------|-------|---------------|
| POST | `/business` | `image`, `video` (max 1 each) |
| PUT | `/business/:id` | `image`, `video` (max 1 each) |

### 3. Business Model (`src/models/business.js`)

| Field | Type | Purpose |
|-------|------|---------|
| `image` | STRING | Stored image filename |
| `video` | STRING | Stored video filename |
| `fileHash` | STRING | SHA-256 hash for duplicate detection |

### 4. Duplicate Detection (`src/controllers/BusinessController.js`)

- **Create:** SHA-256 hash computed for **image only**
- If hash exists in DB → reject with `"This image has already been uploaded."`
- Uploaded duplicate file is deleted from disk
- **Update:** Compares new image hash with old image hash; silently ignores if same

### 5. GET Endpoints

| Method | Route | Returns |
|--------|-------|---------|
| GET | `/business` | All businesses (JSON) |
| GET | `/business/mybusiness` | Current user's businesses |
| GET | `/business/:id` | Single business (JSON) |

GET responses return **metadata only** (title, description, filenames). They do **not** serve file bytes.

---

## What Is Missing

### 1. Audio & Generic File Upload

- No audio MIME types in filter (`audio/mpeg`, `audio/wav`, etc.)
- No generic file types (`application/pdf`, `application/msword`, etc.)
- No `audio` or `file` fields in model or routes

### 2. File Optimization

- No libraries installed (`sharp`, `ffmpeg`, `imagemin`, etc.)
- Files stored as-is with no resize, compress, or transcode step

### 3. Chunked / Streaming GET

- No static file serving in `app.js` (`express.static`)
- No dedicated media download route (e.g. `/media/:filename`)
- No HTTP **Range** header support for video/audio streaming
- No progressive/chunk-based delivery

### 4. Thumbnails

- No thumbnail fields in model (`imageThumbnail`, `videoThumbnail`)
- No thumbnail generation on upload
- No thumbnail GET endpoint

### 5. Complete Duplicate Restriction

| Case | Handled? |
|------|----------|
| Same image on create | ✅ Yes |
| Same video on create | ❌ No |
| Same file on update | ⚠️ Partial (image only) |
| Per-user vs global scope | Global only (all users share hash) |
| Audio / file duplicates | ❌ N/A (not supported) |

**Note:** There is unreliable logic comparing image vs video **file size** (not content hash).

---

## Current Flow

```
Client POST /business
    │
    ▼
Multer (image + video only)
    │
    ▼
Save raw file → src/uploads/
    │
    ├── Image? → SHA256 hash → duplicate? → reject + delete
    │
    └── Video? → no hash check
    │
    ▼
Save metadata to DB (title, discription, image, video, fileHash)

Client GET /business/:id
    │
    ▼
Return JSON (filenames only)
    │
    └── No file streaming, no thumbnails
```

---

## Recommended Implementation Plan

### Phase 1 — Extend Upload Types

1. Add audio and generic file MIME types to `src/middleware/upload.js`
2. Add `audio`, `file` columns to Business model + migration
3. Update routes to accept new upload fields

### Phase 2 — Duplicate Detection (Complete)

1. Hash **all** file types on create and update
2. Store separate hashes or a JSON map (`fileHashes`)
3. Decide scope: global vs per-user duplicate check
4. Remove file-size comparison logic

### Phase 3 — File Optimization

1. **Images:** use `sharp` — resize, compress, convert to WebP
2. **Video/audio:** use `ffmpeg` — transcode, lower bitrate
3. Run optimization after upload, before final storage

### Phase 4 — Thumbnails

1. **Images:** generate resized thumbnail with `sharp`
2. **Videos:** extract frame with `ffmpeg`
3. Add `imageThumbnail`, `videoThumbnail` to model
4. Expose `GET /business/:id/thumbnail` or serve via static path

### Phase 5 — Streaming GET

1. Add `express.static` or dedicated media controller
2. Implement HTTP **Range** requests for video/audio
3. Optional: HLS/DASH for large videos

### Suggested Dependencies

```json
{
  "sharp": "^0.33.x",
  "fluent-ffmpeg": "^2.1.x"
}
```

(System must have `ffmpeg` installed for video/audio processing.)

---

## Key Files

| File | Role |
|------|------|
| `src/middleware/upload.js` | Multer config, MIME filter, storage |
| `src/controllers/BusinessController.js` | Create/update logic, hash check |
| `src/routes/businessRoutes.js` | Upload routes |
| `src/models/business.js` | image, video, fileHash fields |
| `app.js` | No static/media serving yet |
| `src/database/migrations/20260806045901-add-image-video-to-business.js` | image, video, fileHash columns |

---

## Bottom Line

The project has **basic image + video upload** with **partial duplicate detection for images on create only**. It does **not** yet support audio/generic files, optimization, chunked streaming, thumbnails, or full duplicate protection across all media types.

---

*Generated from codebase review of upload middleware, BusinessController, routes, model, migrations, and app.js.*
