-- Create database if not exists
CREATE DATABASE IF NOT EXISTS eplms_building_permit_db;
USE eplms_building_permit_db;

-- Professional Registration table
CREATE TABLE IF NOT EXISTS professional_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(20) NOT NULL UNIQUE,
    user_id INT DEFAULT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_initial VARCHAR(10) DEFAULT NULL,
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(20) DEFAULT NULL,
    birth_date DATE NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    
    -- Professional Credentials
    prc_license VARCHAR(50) NOT NULL,
    prc_expiry DATE NOT NULL,
    ptr_number VARCHAR(50) NOT NULL,
    tin VARCHAR(50) NOT NULL,
    
    -- Specialization
    profession VARCHAR(100) NOT NULL,
    role_in_project VARCHAR(100) NOT NULL,
    
    -- File uploads (stored as file paths)
    prc_id_file VARCHAR(500) DEFAULT NULL,
    ptr_file VARCHAR(500) DEFAULT NULL,
    signature_file VARCHAR(500) DEFAULT NULL,
    
    -- Status tracking
    status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
    remarks TEXT DEFAULT NULL,
    
    -- Timestamps
    date_submitted DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_registration_id (registration_id),
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_prc_license (prc_license)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
