-- Ancillary Permit Applications Table
-- Database: eplms_building_permit_system
-- Stores all ancillary permit types in one table with common + type-specific fields

USE `eplms_building_permit_system`;

CREATE TABLE IF NOT EXISTS `ancillary_permit_applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permit_type` enum('demolition','electrical','electronics','excavation','fencing','mechanical','occupancy','plumbing','signage') NOT NULL,
  `status` enum('Pending','Approved','Rejected','Under Review') DEFAULT 'Pending',

  -- Applicant Information (common)
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `middle_initial` varchar(20) DEFAULT NULL,
  `contact_number` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `owner_address` varchar(255) NOT NULL,
  `property_address` varchar(255) NOT NULL,
  `building_permit_number` varchar(50) DEFAULT NULL,
  `barangay_clearance` varchar(50) DEFAULT NULL,
  `authorization_spa` varchar(100) DEFAULT NULL,
  `tct_or_tax_dec` varchar(50) DEFAULT NULL,

  -- Professional Information (common)
  `professional_name` varchar(150) NOT NULL,
  `professional_role` varchar(100) DEFAULT NULL,
  `prc_id` varchar(20) NOT NULL,
  `ptr_number` varchar(50) NOT NULL,
  `prc_expiry` date NOT NULL,

  -- Type-specific fields (JSON)
  `type_specific_data` longtext DEFAULT NULL CHECK (json_valid(`type_specific_data`)),

  -- Project description
  `project_description` text DEFAULT NULL,

  -- File uploads
  `document_plans_path` varchar(500) DEFAULT NULL,
  `document_id_path` varchar(500) DEFAULT NULL,
  `signature_file_path` varchar(500) DEFAULT NULL,

  -- Declaration
  `remarks` text DEFAULT NULL,
  `date_submitted` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),

  PRIMARY KEY (`id`),
  KEY `idx_permit_type` (`permit_type`),
  KEY `idx_status` (`status`),
  KEY `idx_date_submitted` (`date_submitted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
