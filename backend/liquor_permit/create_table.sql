-- Use existing business permit database
USE eplms_business_permit_db;

-- Create liquor permit applications table
CREATE TABLE IF NOT EXISTS liquor_permit_applications (
    permit_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id VARCHAR(50) NOT NULL,
    application_type ENUM('NEW', 'RENEWAL', 'AMENDMENT') DEFAULT 'NEW',
    existing_permit_number VARCHAR(100),
    
    -- Business Information
    business_name VARCHAR(255) NOT NULL,
    business_address TEXT NOT NULL,
    business_email VARCHAR(100),
    business_phone VARCHAR(20),
    business_type VARCHAR(100),
    business_nature VARCHAR(100),
    
    -- Owner Information
    owner_first_name VARCHAR(100) NOT NULL,
    owner_last_name VARCHAR(100) NOT NULL,
    owner_middle_name VARCHAR(100),
    owner_address TEXT,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    date_of_birth DATE NOT NULL,
    citizenship VARCHAR(50) DEFAULT 'FILIPINO',
    
    -- Barangay Clearance
    barangay_clearance_id VARCHAR(100),
    barangay_clearance_id_copy TEXT,
    
    -- Document Uploads
    owner_valid_id TEXT,
    renewal_permit_copy TEXT,
    previous_permit_copy TEXT,
    
    -- Application Type Specific Fields
    renewal_reason TEXT,
    amendment_type VARCHAR(100),
    amendment_details TEXT,
    amendment_reason TEXT,
    
    -- Declaration
    applicant_signature TEXT,
    declaration_agreed TINYINT(1) DEFAULT 0,
    
    -- Submission Details
    date_submitted DATE,
    time_submitted TIME,
    status VARCHAR(50) DEFAULT 'PENDING',
    permit_type VARCHAR(50) DEFAULT 'LIQUOR',
    
    -- System Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_applicant_id (applicant_id),
    INDEX idx_status (status),
    INDEX idx_application_type (application_type),
    INDEX idx_date_submitted (date_submitted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create comments/notes table for admin actions
CREATE TABLE IF NOT EXISTS liquor_permit_comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    permit_id INT NOT NULL,
    comment TEXT NOT NULL,
    comment_by VARCHAR(100),
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (permit_id) REFERENCES liquor_permit_applications(permit_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
