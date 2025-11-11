# Backend API Specification: Relocate Tree

## Overview
This document specifies the backend API endpoint required for the "Relocate a Tree" feature on the GreenEye Foundation website.

## Purpose
Allow users to submit requests for tree relocation services. The GreenEye Foundation team will review these requests, assess the situation, and initiate crowd-funded relocation projects through their global volunteer network.

---

## API Endpoint

### POST `/api/relocate-tree`

**Description:** Submit a tree relocation request with tree details, location, optional photo, and contact information.

**Content-Type:** `multipart/form-data` (required for photo upload)

---

## Request Parameters

### Form Fields

| Field Name | Type | Required | Max Length | Description |
|------------|------|----------|------------|-------------|
| `location` | String | Yes | 500 chars | Tree's current location (address or coordinates) |
| `firstName` | String | Yes | 100 chars | Reporter's first name |
| `lastName` | String | Yes | 100 chars | Reporter's last name |
| `email` | String | Yes | 255 chars | Reporter's email address (for notifications) |
| `phone` | String | Yes | 20 chars | Reporter's phone number |
| `reason` | String | Yes | - | Reason for relocation (enum: see below) |
| `urgency` | String | Yes | - | Urgency level (enum: see below) |
| `additionalNotes` | String | No | 2000 chars | Additional information about the tree or situation |
| `photo` | File | No | 20 MB | Photo of the tree (JPEG, PNG, WebP) |

### Enum Values

**reason:**
- `development` - Development/Construction
- `government` - Government Project
- `private` - Private Property Owner
- `safety` - Safety Concerns
- `disease` - Tree Health/Disease
- `other` - Other

**urgency:**
- `low` - Low - Planning ahead
- `medium` - Medium - Within 2 weeks
- `high` - High - Within a few days
- `critical` - Critical - Immediate action needed

---

## Request Example

```bash
curl -X POST https://api.greeneye.foundation/api/relocate-tree \
  -H "Content-Type: multipart/form-data" \
  -F "location=123 Main Street, New York, NY 10001" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john.doe@example.com" \
  -F "phone=+1 234 567 8900" \
  -F "reason=development" \
  -F "urgency=medium" \
  -F "additionalNotes=Large oak tree in danger due to construction project starting next month. Tree is approximately 50 years old and healthy." \
  -F "photo=@/path/to/tree-photo.jpg"
```

---

## Response Formats

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Request submitted successfully! Our team will contact you within 24 hours.",
  "data": {
    "requestId": "RT-2025-000123",
    "submittedAt": "2025-11-10T14:30:00Z",
    "estimatedResponseTime": "2025-11-11T14:30:00Z"
  }
}
```

### Error Responses

#### Validation Error (400 Bad Request)

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "email": "Invalid email format",
    "phone": "Phone number is required"
  }
}
```

#### File Size Error (413 Payload Too Large)

```json
{
  "success": false,
  "error": "File Too Large",
  "message": "Photo file size must be less than 20MB"
}
```

#### Unsupported Media Type (415)

```json
{
  "success": false,
  "error": "Unsupported File Type",
  "message": "Only JPEG, PNG, and WebP images are allowed"
}
```

#### Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Server Error",
  "message": "Failed to process request. Please try again later."
}
```

---

## Backend Processing Requirements

### 1. Data Validation
- Validate all required fields are present
- Validate email format (RFC 5322 standard)
- Validate phone number format
- Validate enum values for `reason` and `urgency`
- Check `additionalNotes` length (max 2000 characters)
- Check `location` length (max 500 characters)
- Sanitize all text inputs to prevent XSS attacks

### 2. Photo Processing
- Validate file type (accept only: image/jpeg, image/png, image/webp)
- Validate file size (max 20 MB)
- Generate unique filename (e.g., `relocate-tree-{timestamp}-{uuid}.jpg`)
- Store photo in cloud storage (e.g., AWS S3, Cloudinary)
- Optionally: Compress/optimize image for storage
- Store photo URL in database

### 3. Database Storage

**Suggested Schema: `relocate_tree_requests` table**

```sql
CREATE TABLE relocate_tree_requests (
  id VARCHAR(50) PRIMARY KEY,           -- e.g., RT-2025-000123
  location VARCHAR(500) NOT NULL,
  photo_url VARCHAR(1000),              -- URL to stored photo
  photo_name VARCHAR(255),              -- Original filename
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  reason ENUM('development', 'government', 'private', 'safety', 'disease', 'other') NOT NULL,
  urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  additional_notes TEXT,
  status ENUM('pending', 'reviewed', 'approved', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewer_id VARCHAR(50) NULL,        -- Admin who reviewed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_urgency (urgency),
  INDEX idx_submitted_at (submitted_at)
);
```

### 4. Email Notifications

**Immediate Email to User:**
- Subject: "Tree Relocation Request Received - Request #RT-2025-000123"
- Body should include:
  - Confirmation that request was received
  - Request ID for reference
  - Expected response time (24 hours)
  - Summary of submitted information
  - Contact information for questions
  - Link to track request status (optional)

**Example Email Template:**

```
Subject: Tree Relocation Request Received - Request #RT-2025-000123

Dear [firstName] [lastName],

Thank you for submitting a tree relocation request to GreenEye Foundation!

REQUEST DETAILS:
Request ID: RT-2025-000123
Submitted: November 10, 2025 at 2:30 PM
Location: [location]
Urgency: [urgency level]

WHAT'S NEXT:
Our team will review your request and contact you within 24 hours at:
- Email: [email]
- Phone: [phone]

We will assess the situation and provide you with:
- Professional evaluation of the tree relocation feasibility
- Estimated costs and timeline
- Crowd-funding campaign details
- Next steps for proceeding

If you have any immediate questions, please reply to this email or call us at +1-800-GREENEYE.

Thank you for helping us save trees!

Best regards,
The GreenEye Foundation Team

---
Track your request: https://greeneye.foundation/track-request/RT-2025-000123
```

**Internal Notification to Team:**
- Send email to team inbox (e.g., relocate@greeneye.foundation)
- Include all request details
- Include link to photo if uploaded
- Flag high/critical urgency requests
- Provide admin dashboard link to review request

### 5. Security Requirements
- Implement rate limiting (max 5 requests per email per day)
- Sanitize all inputs to prevent SQL injection
- Escape HTML to prevent XSS attacks
- Validate file uploads (type, size, malware scanning)
- Use HTTPS only
- Implement CSRF protection
- Store photos in secure cloud storage with signed URLs
- Log all requests for audit trail

### 6. Optional Features

**IP Geolocation:**
- Capture user's IP address
- Use geolocation service to determine country/region
- Store for analytics and volunteer assignment

**Duplicate Detection:**
- Check for duplicate requests based on:
  - Same location within 50 meters
  - Same email within 24 hours
- Prompt user if potential duplicate found

**Status Tracking:**
- Provide unique tracking URL
- Allow users to check request status without login
- Send email updates when status changes

**Admin Dashboard:**
- List all requests with filters (status, urgency, date)
- View request details and photos
- Update request status
- Assign to volunteers
- Add internal notes
- Generate reports

---

## Error Handling

The API should handle the following error scenarios:

1. **Missing Required Fields:** Return 400 with specific field errors
2. **Invalid Email Format:** Return 400 with validation error
3. **File Too Large:** Return 413 with size limit message
4. **Invalid File Type:** Return 415 with accepted types
5. **Rate Limit Exceeded:** Return 429 with retry-after header
6. **Database Error:** Return 500 with generic error message (log details internally)
7. **Email Service Error:** Return 500 but still save request to database
8. **Storage Service Error:** Return 500 with photo upload failure message

---

## Performance Considerations

1. **Async Processing:**
   - Save request to database immediately
   - Process photo upload asynchronously
   - Send emails asynchronously
   - Return success response quickly (< 2 seconds)

2. **File Upload Optimization:**
   - Stream large files instead of loading into memory
   - Use multipart upload for large files
   - Implement upload progress tracking (optional)

3. **Database Indexing:**
   - Index on `email`, `status`, `urgency`, `submitted_at`
   - Use pagination for admin dashboard

4. **Caching:**
   - Cache country/region data from IP geolocation
   - Cache email templates

---

## Testing Checklist

- [ ] Test successful submission with all fields
- [ ] Test successful submission with minimal fields (no photo, no notes)
- [ ] Test with invalid email format
- [ ] Test with missing required fields
- [ ] Test with file larger than 20MB
- [ ] Test with invalid file type (e.g., .txt, .exe)
- [ ] Test with special characters in text fields
- [ ] Test with very long location/notes (boundary testing)
- [ ] Test rate limiting (multiple requests from same email)
- [ ] Test email delivery (user and internal)
- [ ] Test database persistence
- [ ] Test photo storage and URL generation
- [ ] Verify security: SQL injection, XSS, CSRF
- [ ] Test error responses for all error scenarios
- [ ] Load testing (concurrent requests)

---

## Environment Variables

The backend should use the following environment variables:

```bash
# API Configuration
API_BASE_URL=https://api.greeneye.foundation
API_RATE_LIMIT_MAX=5
API_RATE_LIMIT_WINDOW=86400  # 24 hours in seconds

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=greeneye_db
DB_USER=greeneye_user
DB_PASSWORD=<secure-password>

# Cloud Storage (AWS S3 / Cloudinary / etc.)
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
STORAGE_BUCKET=greeneye-relocate-trees
STORAGE_REGION=us-east-1

# Email Service (SendGrid / AWS SES / etc.)
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=<sendgrid-api-key>
EMAIL_FROM=noreply@greeneye.foundation
EMAIL_FROM_NAME=GreenEye Foundation
EMAIL_TEAM_INBOX=relocate@greeneye.foundation

# Security
JWT_SECRET=<jwt-secret>
CSRF_SECRET=<csrf-secret>
ALLOWED_ORIGINS=https://greeneye.foundation,https://www.greeneye.foundation

# Optional: Third-party Services
GEOLOCATION_API_KEY=<ip-geolocation-api-key>
MALWARE_SCAN_API_KEY=<malware-scan-api-key>
```

---

## Deployment Notes

1. **Load Balancing:** Ensure API can handle multiple concurrent uploads
2. **File Size Limits:** Configure web server (Nginx/Apache) to allow 20MB uploads
3. **Timeouts:** Set reasonable timeouts for file uploads (e.g., 60 seconds)
4. **Monitoring:** Track request volume, error rates, and response times
5. **Backup:** Regular database backups and photo storage backups
6. **CDN:** Serve photos through CDN for faster access

---

## Future Enhancements

1. **User Authentication:** Allow registered users to track all their requests
2. **Payment Integration:** Add crowd-funding payment processing
3. **Volunteer Portal:** Allow volunteers to claim and manage relocations
4. **Progress Updates:** Send periodic updates to users
5. **Photo Gallery:** Display before/after photos of relocated trees
6. **Mobile App:** Native mobile app integration
7. **SMS Notifications:** Send SMS updates for high-urgency requests
8. **Multi-language Support:** Translate emails and notifications
9. **Tree Species Detection:** Use AI to identify tree species from photo
10. **Cost Estimation:** Auto-calculate estimated relocation cost based on tree size/location

---

## Contact

For questions about this API specification, please contact:
- Technical Lead: tech@greeneye.foundation
- Product Manager: product@greeneye.foundation

---

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Author:** GreenEye Foundation Development Team
