# ProInfo API Documentation

## Overview

RESTful API endpoints for managing ProInfo.uz content including categories, products, media, directions, and FAQ.

**Base URL**: `http://localhost:3000/api`

**Authentication**: Cookie-based admin session.

Admin write endpoints (`POST`, `PUT`, `DELETE`, `PATCH`) require a valid session cookie obtained via `POST /api/admin/login`. The cookie is set automatically on successful login and cleared on `POST /api/admin/logout`.

Required env vars:
- `ADMIN_SESSION_SECRET` — signs session cookies (long random string in production)
- `ADMIN_SUPERADMIN` — `username:password:SuperAdmin` or use `ADMIN_USERS_JSON` for multiple users

Admin panel endpoints under `/api/admin/*` enforce the same cookie session and support role-based access (`SuperAdmin`, `Editor`).

---

## Common Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `lang` | Language | Response language: RU, UZ, EN | RU |
| `limit` | Integer | Items per page | 100 |
| `skip` | Integer | Number of items to skip (pagination) | 0 |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Resource retrieved",
  "data": { /* actual data */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## Categories API

### GET /api/categories

Get all categories with optional language filter.

**Query Parameters**:
- `lang`: Language (RU, UZ, EN)
- `limit`: Max categories to return
- `skip`: Pagination offset

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "rfid",
      "title": "RFID",
      "description": "RFID technology",
      "imageUrl": "/assets/img/category/rfid.jpg",
      "productCount": 3,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/categories

Create a new category.

**Body**:
```json
{
  "slug": "new-category",
  "title": "New Category",
  "description": "Category description",
  "imageUrl": "/path/to/image.jpg",
  "order": 0,
  "translations": {
    "RU": { "title": "Новая категория", "description": "Описание" },
    "UZ": { "title": "Yangi kategoriya", "description": "Tavsif" },
    "EN": { "title": "New Category", "description": "Description" }
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Category created",
  "data": { "id": "clx...", "slug": "new-category" }
}
```

### GET /api/categories/[slug]

Get a specific category by slug.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "slug": "rfid",
    "title": "RFID",
    "description": "RFID technology",
    "imageUrl": "/assets/img/category/rfid.jpg",
    "products": [
      { "id": "...", "slug": "rfid-reader" }
    ]
  }
}
```

### PUT /api/categories/[slug]

Update a category.

**Body**:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "imageUrl": "/new/image.jpg"
}
```

### DELETE /api/categories/[slug]

Delete a category (only if no products exist).

---

## Products API

### GET /api/products

Get all products with optional filtering.

**Query Parameters**:
- `lang`: Language
- `category`: Filter by category slug
- `limit`: Max products
- `skip`: Pagination offset

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "rfid-reader",
      "categorySlug": "rfid",
      "title": "RFID Reader",
      "description": "Professional RFID reader",
      "imageUrl": "/assets/img/product/rfid-reader.jpg",
      "price": 4500
    }
  ]
}
```

### POST /api/products

Create a new product.

**Body**:
```json
{
  "slug": "new-product",
  "categorySlug": "rfid",
  "title": "New Product",
  "description": "Product description",
  "price": 9999,
  "imageUrl": "/path/to/image.jpg",
  "translations": {
    "RU": { "title": "Новый продукт", "description": "Описание" },
    "UZ": { "title": "Yangi mahsulot", "description": "Tavsif" },
    "EN": { "title": "New Product", "description": "Description" }
  }
}
```

### GET /api/products/[slug]
### PUT /api/products/[slug]
### DELETE /api/products/[slug]

Similar to categories endpoints.

---

## Media API

Unified endpoint for posts, videos, photos, downloads.

### GET /api/media

Get media items by type.

**Query Parameters**:
- `type`: Media type - `post`, `video`, `photo`, `download`
- `tag`: Filter by tag slug
- `lang`: Language
- `limit`: Max items
- `skip`: Pagination offset

**Examples**:
```
GET /api/media?type=post&lang=EN
GET /api/media?type=blog&tag=automation&limit=10
GET /api/media?type=video&lang=RU&skip=10&limit=5
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "intro-to-rfid",
      "type": "post",
      "title": "Introduction to RFID",
      "description": "RFID technology overview",
      "excerpt": "Learn about...",
      "coverImageUrl": "/assets/img/blog/intro-to-rfid.jpg",
      "tags": ["rfid", "technology"],
      "publishedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "clx...",
      "slug": "rfid-demo",
      "type": "video",
      "title": "RFID Demo",
      "description": "Live demonstration",
      "videoUrl": "https://example.com/video.mp4",
      "coverImageUrl": "/assets/img/video/rfid-demo.jpg",
      "duration": 450,
      "tags": ["demo", "rfid"],
      "publishedAt": "2024-01-20T14:00:00Z"
    }
  ]
}
```

### GET /api/media/[slug]

Get a specific media item by slug.

**Response depends on media type**:

**Post Response**:
```json
{
  "id": "clx...",
  "slug": "article-slug",
  "type": "post",
  "title": "Title",
  "content": "<p>Full article HTML</p>",
  "excerpt": "Short excerpt",
  "tags": ["tag1", "tag2"],
  "publishedAt": "2024-01-15T10:00:00Z"
}
```

**Video Response**:
```json
{
  "id": "clx...",
  "slug": "video-slug",
  "type": "video",
  "title": "Title",
  "description": "Description",
  "videoUrl": "https://example.com/video.mp4",
  "duration": 450,
  "coverImageUrl": "/assets/img/video/slug.jpg",
  "tags": ["tag1"]
}
```

**Photo Album Response**:
```json
{
  "id": "clx...",
  "slug": "album-slug",
  "type": "photo",
  "title": "Album Title",
  "description": "Album description",
  "coverImageUrl": "/assets/img/gallery/album/cover.jpg",
  "items": [
    {
      "id": "clx...",
      "imageUrl": "/assets/img/gallery/album/photo-1.jpg",
      "caption": "Photo 1"
    }
  ],
  "tags": ["event", "2024"]
}
```

**Download Response**:
```json
{
  "id": "clx...",
  "slug": "guide-slug",
  "type": "download",
  "title": "Download Title",
  "description": "File description",
  "fileUrl": "/files/guide.pdf",
  "fileType": "PDF",
  "fileSizeKb": 2500,
  "tags": ["guide", "manual"]
}
```

---

## Directions API

### GET /api/directions

Get all service directions.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "e-commerce",
      "title": "E-commerce",
      "description": "E-commerce solutions",
      "imageUrl": "/assets/img/direction/e-commerce.jpg"
    }
  ]
}
```

### POST /api/directions

Create a new direction.

### GET /api/directions/[slug]
### DELETE /api/directions/[slug]

---

## FAQ API

### GET /api/faq

Get all FAQ items.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "what-is-rfid",
      "title": "What is RFID?",
      "content": "RFID stands for..."
    }
  ]
}
```

### POST /api/faq

Create a new FAQ.

**Body**:
```json
{
  "slug": "how-to-use",
  "title": "How to use the system?",
  "content": "Step 1: ... Step 2: ...",
  "translations": {
    "RU": { "title": "Как использовать?", "content": "..." },
    "UZ": { "title": "Qanday ishlatish?", "content": "..." },
    "EN": { "title": "How to use?", "content": "..." }
  }
}
```

### GET /api/faq/[slug]
### DELETE /api/faq/[slug]

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 400 | Bad Request | Missing/invalid request parameters |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate slug or constraint violation |
| 500 | Server Error | Database or server error |

---

## Usage Examples

### Get all categories in English
```bash
curl "http://localhost:3000/api/categories?lang=EN"
```

### Get RFID category with products
```bash
curl "http://localhost:3000/api/categories/rfid?lang=RU"
```

### Get blog posts
```bash
curl "http://localhost:3000/api/media?type=post&lang=EN&limit=10"
```

### Get RFID products
```bash
curl "http://localhost:3000/api/products?category=rfid&lang=RU"
```

### Get FAQ by slug
```bash
curl "http://localhost:3000/api/faq/what-is-rfid?lang=UZ"
```

---

## Next Steps

1. **Implement Authentication** - Add JWT/session auth for admin operations
2. **Add Validation** - Input validation and sanitization
3. **Add Rate Limiting** - Prevent abuse
4. **Implement Caching** - Cache frequently accessed data
5. **Add Logging** - Request/response logging for debugging
6. **Wire Frontend** - Update admin and support pages to use API
