# Liquor Permit Backend API

This directory contains the backend API for the Liquor Permit Management System.

## Setup Instructions

### 1. Create Table in Business Permit Database
The liquor permit table is added to the existing business permit database (`eplms_business_permit_db`).

Run the SQL script:
```bash
mysql -u root -p eplms_business_permit_db < create_table.sql
```

Or manually execute in phpMyAdmin/MySQL:
- Select the `eplms_business_permit_db` database
- Open `create_table.sql`
- Copy and execute the SQL commands

### 2. Configure Database Connection
Edit `db.php` and update the database credentials if needed:
```php
$username = "root";        // Your MySQL username
$password = "";            // Your MySQL password
$dbname = "eplms_business_permit_db";  // Uses existing business permit database
```

### 3. File Upload Directory
The system will automatically create the `uploads/` directory when the first file is uploaded.
Ensure the backend has write permissions:
```bash
chmod 777 uploads/
```

## API Endpoints

### 1. Submit Application
**Endpoint:** `POST /backend/liquor_permit/submit.php`

**Description:** Submit a new liquor permit application

**Form Data:**
- `applicant_id` (required)
- `application_type` (NEW, RENEWAL, AMENDMENT)
- `business_name` (required)
- `business_address` (required)
- `business_email`
- `business_phone`
- `business_type`
- `business_nature`
- `owner_first_name` (required)
- `owner_last_name` (required)
- `owner_middle_name`
- `owner_address`
- `id_type`
- `id_number`
- `date_of_birth` (required, must be 18+)
- `citizenship`
- `barangay_clearance_id`
- Files: `barangay_clearance_id_copy`, `owner_valid_id`, `renewal_permit_copy`, `previous_permit_copy`

**Response:**
```json
{
  "success": true,
  "message": "Liquor permit application submitted successfully!",
  "data": {
    "permit_id": 1,
    "applicant_id": "USER001",
    "application_type": "NEW",
    "business_name": "Sample Business",
    "status": "PENDING"
  }
}
```

### 2. Check Existing Permit
**Endpoint:** `GET /backend/liquor_permit/check.php?permit_number=xxx`

**Description:** Check if a liquor permit exists

**Response:**
```json
{
  "success": true,
  "message": "Permit found",
  "data": { ... }
}
```

### 3. Admin Fetch All Permits
**Endpoint:** `GET /backend/liquor_permit/admin_fetch.php`

**Query Parameters:**
- `status` - Filter by status (PENDING, APPROVED, REJECTED, ALL)
- `search` - Search term
- `sort_by` - Sort option (latest, oldest, name_asc, name_desc, business_name_asc)

**Response:**
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [...],
  "counts": {
    "total": 10,
    "pending": 5,
    "approved": 3,
    "rejected": 2
  }
}
```

## Database Schema

### liquor_permit_applications
Main table storing all liquor permit applications.

**Key Fields:**
- `permit_id` - Auto-increment primary key
- `applicant_id` - Reference to user
- `application_type` - NEW, RENEWAL, or AMENDMENT
- `business_name` - Name of business
- `owner_first_name`, `owner_last_name` - Owner details
- `date_of_birth` - Must be 18+ years old
- `status` - PENDING, APPROVED, REJECTED
- `created_at`, `updated_at` - Timestamps

### liquor_permit_comments
Table for admin comments/notes on applications.

## File Upload
- **Allowed types:** PDF, JPG, JPEG, PNG, GIF
- **Max size:** 10MB per file
- **Storage:** `backend/liquor_permit/uploads/`
- **Naming:** `{applicant_id}_{field_name}_{unique_id}.{ext}`

## Security Notes
- All inputs are sanitized and validated
- File uploads are validated for type and size
- Age verification (18+ required)
- SQL injection protection via prepared statements
- CORS headers configured for cross-origin requests
