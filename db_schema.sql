-- Create Database
CREATE DATABASE IF NOT EXISTS dayflow;
USE dayflow;

-- Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('employee', 'hr', 'admin') DEFAULT 'employee',
    first_login BOOLEAN DEFAULT TRUE,
    employee_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    job_position VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(20),
    company VARCHAR(100),
    department VARCHAR(100),
    manager VARCHAR(100),
    date_of_birth DATE,
    residing_address TEXT,
    nationality VARCHAR(50),
    personal_email VARCHAR(100),
    gender VARCHAR(20),
    marital_status VARCHAR(20),
    date_of_joining DATE,
    profile_photo LONGBLOB,
    resume_file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Salary Info Table
CREATE TABLE IF NOT EXISTS salary_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    account_number VARCHAR(50),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    pan_no VARCHAR(20),
    uan_no VARCHAR(20),
    emp_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Security Table
CREATE TABLE IF NOT EXISTS security_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    password_hash VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Insert Sample Employee Data
INSERT INTO employees (name, job_position, email, mobile, company, department, manager, date_of_birth, residing_address, nationality, personal_email, gender, marital_status, date_of_joining) 
VALUES (
    'Thoughtful Sandpiper',
    'Senior Developer',
    'thoughtful.sandpiper@company.com',
    '+91-9876543210',
    'TechFlow Solutions',
    'Engineering',
    'John Manager',
    '1990-05-15',
    '123 Tech Street, Silicon Valley, CA',
    'Indian',
    'personal@email.com',
    'Male',
    'Single',
    '2020-01-15'
);

-- Insert Sample Salary Info
INSERT INTO salary_info (employee_id, account_number, bank_name, ifsc_code, pan_no, uan_no, emp_code)
VALUES (1, '123456789012345', 'HDFC Bank', 'HDFC0001234', 'AAAPA1234P', 'UAN123456789', 'EMP001');

-- Insert Sample Security Info
INSERT INTO security_info (employee_id, password_hash, two_factor_enabled)
VALUES (1, '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890', FALSE);
