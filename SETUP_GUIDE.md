# DayFlow - Employee Management System

A complete employee management system with role-based access control, salary management, and authentication.

## Features

### 1. Authentication System
- **Login Page** - Employees and HR can login with Login ID or Email
- **Auto-generated Credentials** - Login ID format: OI + initials + year + serial (e.g., OIJODO20220001)
- **First-time Password Change** - New employees must change password on first login
- **Password Management** - Change password anytime in security settings
- **Remember Me** - Stay logged in option

### 2. Employee Profile Management
- **Personal Information** - Name, Email, Mobile, Address, DOB, Gender, etc.
- **Employment Details** - Job Position, Department, Manager, Company
- **Profile Picture Upload** - Upload and manage profile photos
- **Resume Upload** - Store and manage resumes
- **Salary Structure** - View salary breakdown (Employees: read-only, HR: editable)
- **Bank Details** - Account number, IFSC, PAN, UAN

### 3. Role-Based Access Control
- **Employee Role**
  - Can view and edit: Name, Email, Mobile, Personal Email, DOB, Address, Gender, Marital Status
  - Can view (read-only): Job Position, Department, Manager, Company, Salary Structure
  - Can upload: Profile Picture, Resume
  - Can change: Password (after first login)

- **HR Role**
  - Can view and edit: All employee information
  - Can manage: All employee records
  - Can access: HR Dashboard with salary summaries
  - Can add: New employees to system
  - Can export: Salary data to CSV

### 4. Salary Management
- **Salary Components** - Basic, HRA, Standard Allowance, Performance Bonus, Leave Travel Allowance, Fixed Allowance
- **Deductions** - PF, Professional Tax, Income Tax
- **Auto-calculations** - Gross, Deductions, Net salary
- **Currency Types** - Fixed amount or Percentage-based

### 5. Admin Dashboard
- **Salary Dashboard** - View all employees' salaries
- **Search & Filter** - Find employees by name, department, salary range
- **Export to CSV** - Download salary data for reporting
- **Activity Logs** - Track admin activities

## Installation

### Prerequisites
- XAMPP or similar local server
- MySQL Database
- Modern Web Browser

### Step 1: Database Setup

1. Open XAMPP Control Panel and start Apache & MySQL
2. Open phpMyAdmin at `http://localhost/phpmyadmin`
3. Create a new database named `dayflow`
4. Run the SQL script:
   ```bash
   cd c:\xampp\htdocs\dayflow\php
   mysql -u root -p dayflow < db_schema.sql
   ```

Or manually run the SQL from `php/db_schema.sql` in phpMyAdmin.

### Step 2: Configure Database Connection

Edit `php/config.php`:
```php
$servername = "localhost";
$username = "root";
$password = "";  // Your MySQL password
$database = "dayflow";
```

### Step 3: Access the Application

1. Navigate to `http://localhost/dayflow/login.html`
2. Login with default credentials (see Testing section)

## File Structure

```
dayflow/
├── index.html                    # Employee/HR profile page
├── login.html                    # Login page
├── signup.html                   # HR: Add new employee
├── admin_profile.html            # HR: Admin dashboard
├── hr_salary_dashboard.html      # HR: Salary management
├── test.html                     # Testing page (role switching)
├── README.md                     # This file
├── css/
│   └── style.css                # Main styling
├── js/
│   ├── profile.js               # Profile page logic
│   ├── admin_profile.js         # Admin dashboard logic
│   ├── hr_salary_dashboard.js   # Salary dashboard logic
│   ├── login.js                 # Login form handling
│   └── signup.js                # Employee signup logic
└── php/
    ├── config.php               # Database configuration
    ├── db_schema.sql            # Database schema
    ├── login.php                # Authentication
    ├── signup.php               # Employee registration
    ├── change_first_password.php # First-time password change
    ├── change_password.php      # Password change in settings
    ├── get_employee.php         # Fetch employee data
    ├── update_employee.php      # Update employee data (with permissions)
    ├── get_salary_configuration.php
    ├── save_salary_configuration.php
    ├── get_all_employees_salary.php
    └── session_check.php        # Verify session
```

## Usage

### For Employees

1. **Login**
   - Go to `http://localhost/dayflow/login.html`
   - Enter Login ID or Email and password
   - On first login, you'll be prompted to change password
   - Click "Sign In"

2. **View/Edit Profile**
   - Navigate through tabs: Resume, Private Info, Salary Info, Security
   - Edit personal information (name, email, address, etc.)
   - Upload profile photo and resume
   - View salary structure (read-only)
   - Change password in Security tab

### For HR

1. **Add New Employee**
   - Go to `http://localhost/dayflow/signup.html` (HR only)
   - Fill in employee details
   - Auto-generated Login ID and Password (Odoo@1234) will be displayed
   - Share these credentials with the new employee
   - Click "Add Employee"

2. **Manage Employees**
   - Go to `http://localhost/dayflow/admin_profile.html`
   - View all employee information
   - Edit any employee details
   - View activity logs

3. **Salary Management**
   - Go to `http://localhost/dayflow/hr_salary_dashboard.html`
   - View all employees' salary details
   - Search, filter, and sort by department, salary range, etc.
   - Edit salary components for any employee
   - Export salary data to CSV

## Testing

### Test Roles
Access `http://localhost/dayflow/test.html` to quickly switch roles for testing:
- Select role (Employee/HR)
- Click "Switch Role"
- Navigate to `index.html`

### Sample Users
Default test employee:
- Login ID: `test_employee`
- Email: `employee@test.com`
- Password: (use `Odoo@1234` for first login)

HR User:
- Login ID: `test_hr`
- Email: `hr@test.com`
- Password: (use `Odoo@1234` for first login)

## Password Policy

- **Default Password**: `Odoo@1234`
- **Minimum Length**: 6 characters
- **First Login**: Mandatory password change required
- **Periodic Change**: Can change password anytime in Security tab

## Database Schema

### Users Table
- `id` - User ID
- `login_id` - Unique login identifier (OI format)
- `email` - Email address
- `password_hash` - Bcrypt encrypted password
- `role` - Employee or HR
- `first_login` - Flag for first-time login
- `employee_id` - Foreign key to employees table

### Employees Table
- `id` - Employee ID
- `name` - Full name
- `job_position` - Job title
- `email` - Work email
- `mobile` - Phone number
- `company` - Company name
- `department` - Department
- `manager` - Manager name
- `date_of_birth` - DOB
- `date_of_joining` - Joining date
- `personal_email` - Personal email
- `residing_address` - Address
- `nationality` - Nationality
- `gender` - Gender
- `marital_status` - Marital status
- `profile_photo` - Profile image (BLOB)
- `resume_file_path` - Resume file path

### Salary Configuration Table
- `id` - Configuration ID
- `employee_id` - Foreign key
- `monthly_wage` - Monthly salary
- `yearly_wage` - Annual salary
- `[salary_components]` - 6 salary components with type
- `[deductions]` - PF, Tax, Professional Tax
- `calculated_gross` - Gross salary
- `calculated_net` - Net salary

## API Endpoints

### Authentication
- `POST /php/login.php` - Login user
- `POST /php/signup.php` - Register new employee (HR only)
- `POST /php/change_first_password.php` - Change password (first login)
- `POST /php/change_password.php` - Change password (anytime)
- `GET /php/session_check.php` - Verify session status

### Employee Management
- `GET /php/get_employee.php` - Fetch employee data
- `POST /php/update_employee.php` - Update employee data (with permissions)
- `GET /php/get_all_employees_salary.php` - Fetch all employees' salary (HR only)

### Salary Management
- `GET /php/get_salary_configuration.php` - Fetch salary configuration
- `POST /php/save_salary_configuration.php` - Save salary configuration (HR only)

## Security Features

1. **Password Hashing** - Using PHP's `password_hash()` with bcrypt
2. **Prepared Statements** - SQL injection prevention
3. **Role-Based Access** - Frontend and backend validation
4. **Session Management** - Server-side session handling
5. **Data Validation** - Input validation and sanitization
6. **Permissions Enforcement** - Both UI and backend level

## Troubleshooting

### Login Not Working
1. Check database connection in `php/config.php`
2. Ensure MySQL is running
3. Verify users table has sample data
4. Check browser console for errors (F12)

### Changes Not Saving
1. Check browser console for error messages
2. Verify you have permission to edit that field
3. Check database server is running
4. Look at PHP error logs

### Images Not Uploading
1. Ensure `uploads/` directory exists and is writable
2. Check file size limits in `php.ini`
3. Verify MIME type is image format

### HR Dashboard Not Showing Employees
1. Check HR role is set correctly in localStorage
2. Verify employees exist in database
3. Check MySQL for data in employees table
4. Look for SQL errors in browser console

## Future Enhancements

- Two-factor authentication
- Email notifications
- Attendance tracking
- Leave management
- Performance reviews
- Document management
- Advanced reporting
- Mobile app support

## Support

For issues or questions, check:
1. Browser console (F12) for JavaScript errors
2. `php/` directory for PHP error logs
3. Database connection in `php/config.php`

## License

Internal Use Only - DayFlow Employee Management System
