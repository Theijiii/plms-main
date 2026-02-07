-- Insert sample licensed professionals into professional_registrations table
-- These professionals can be assigned to building permit applications
INSERT INTO `professional_registrations` (
    `registration_id`,
    `first_name`, 
    `middle_initial`, 
    `last_name`, 
    `suffix`, 
    `birth_date`, 
    `contact_number`, 
    `email`, 
    `prc_license`, 
    `prc_expiry`, 
    `ptr_number`, 
    `tin`,
    `profession`, 
    `role_in_project`, 
    `status`
) VALUES
-- Additional registrations for project assignments
('REG-2024-001', 'DANIEL', 'R', 'HERNANDEZ', NULL, '1984-04-10', '09351234585', 'daniel.hernandez@email.com', 'ARCH-011223', '2026-11-30', 'PTR-2024-019', '123-456-789', 'Architect', 'Design Architect', 'approved'),
('REG-2024-002', 'PATRICIA', 'M', 'NAVARRO', NULL, '1990-08-05', '09361234586', 'patricia.navarro@email.com', 'CE-044556', '2025-06-15', 'PTR-2024-020', '234-567-890', 'Civil Engineer', 'Structural Engineer', 'approved'),
('REG-2024-003', 'LEONARDO', 'S', 'TOLENTINO', 'III', '1982-12-20', '09371234587', 'leonardo.tolentino@email.com', 'EE-055667', '2026-12-31', 'PTR-2024-021', '345-678-901', 'Electrical Engineer', 'Design Engineer', 'approved'),
('REG-2024-004', 'VICTORIA', 'L', 'PASCUAL', NULL, '1988-06-18', '09381234588', 'victoria.pascual@email.com', 'ME-066778', '2025-10-30', 'PTR-2024-022', '456-789-012', 'Master Electrician', 'Installation Engineer', 'approved'),
('REG-2024-005', 'GREGORIO', 'N', 'AGUILAR', NULL, '1981-10-12', '09391234589', 'gregorio.aguilar@email.com', 'MEC-077889', '2026-08-31', 'PTR-2024-023', '567-890-123', 'Mechanical Engineer', 'HVAC Engineer', 'approved');

