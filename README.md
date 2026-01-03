# DayFlow - Employee Profile Management System

A modern employee profile management system built with HTML, CSS (Tailwind), JavaScript, PHP, and MySQL.

## Features

- 👤 Complete employee profile management
- 📄 Resume upload and management
- 💰 Salary and bank information storage
- 🔒 Security settings and two-factor authentication
- 📱 Responsive design
- 🎨 Dark theme UI with modern design

## Project Structure

```
dayflow/
├── index.html              # Main profile page
├── css/
│   └── style.css          # Custom styles & Tailwind utilities
├── js/
│   └── profile.js         # Frontend JavaScript logic
├── php/
│   ├── config.php         # Database configuration
│   ├── get_employee.php   # API endpoint to fetch employee data
│   ├── update_employee.php # API endpoint to update employee data
│   ├── update_salary_info.php # API endpoint to update salary info
│   └── db_schema.sql      # Database schema and initial data
└── assets/                # Placeholder for images and files
```

## Setup Instructions

### Prerequisites
- PHP 7.0+
- MySQL 5.7+
- Local web server (XAMPP, WAMP, or LAMP)

### Step 1: Database Setup

1. Open phpMyAdmin or MySQL command line
2. Run the SQL commands from `php/db_schema.sql`:

```sql
-- Copy and paste the contents of php/db_schema.sql into MySQL
```

Or import directly:
```bash
mysql -u root -p < php/db_schema.sql
```

### Step 2: Configure Database Connection

Edit `php/config.php` and update the database credentials if needed:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'dayflow');
```

### Step 3: Place Files on Web Server

1. Copy the entire `dayflow` folder to your web server root:
   - XAMPP: `C:\xampp\htdocs\dayflow`
   - WAMP: `C:\wamp\www\dayflow`
   - LAMP: `/var/www/html/dayflow`

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost/dayflow/index.html
```

## API Endpoints

### Get Employee Data
```
GET php/get_employee.php?id=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Thoughtful Sandpiper",
    "job_position": "Senior Developer",
    "email": "thoughtful.sandpiper@company.com",
    ...
  }
}
```

### Update Employee Information
```
POST php/update_employee.php
Content-Type: application/json

{
  "employee_id": 1,
  "name": "John Doe",
  "job_position": "Developer",
  ...
}
```

### Update Salary Information
```
POST php/update_salary_info.php
Content-Type: application/json

{
  "employee_id": 1,
  "account_number": "123456789",
  "bank_name": "HDFC Bank",
  ...
}
```

## Database Schema

### Employees Table
- `id` - Primary key
- `name` - Employee name
- `job_position` - Job title
- `email` - Corporate email
- `mobile` - Mobile number
- `company` - Company name
- `department` - Department
- `manager` - Manager name
- `date_of_birth` - Date of birth
- `residing_address` - Address
- `nationality` - Nationality
- `personal_email` - Personal email
- `gender` - Gender
- `marital_status` - Marital status
- `date_of_joining` - Joining date
- `profile_photo` - Profile photo (BLOB)
- `resume_file_path` - Resume file path

### Salary Info Table
- `id` - Primary key
- `employee_id` - Foreign key to employees
- `account_number` - Bank account number
- `bank_name` - Bank name
- `ifsc_code` - IFSC code
- `pan_no` - PAN number
- `uan_no` - UAN number
- `emp_code` - Employee code

### Security Info Table
- `id` - Primary key
- `employee_id` - Foreign key to employees
- `password_hash` - Hashed password
- `two_factor_enabled` - 2FA status
- `last_login` - Last login timestamp

## Features Overview

### Resume Tab
- Upload PDF resumes
- Drag and drop support
- File validation

### Private Info Tab
- Store personal details
- Date of birth, address, nationality
- Gender and marital status
- Date of joining

### Salary Info Tab
- Bank account details
- PAN and UAN information
- Employee code storage

### Security Tab
- Two-factor authentication toggle
- Change password option
- View login activity
- Manage connected devices

## Customization

### Styling
- Colors are defined in CSS variables at the top of `css/style.css`
- Modify `--primary-color`, `--secondary-color`, etc. to change theme

### Database
- Edit `php/db_schema.sql` to add more fields
- Update corresponding HTML forms
- Modify JavaScript to handle new fields

## Future Enhancements

- [ ] File upload handling for profiles
- [ ] Password encryption
- [ ] Audit logging
- [ ] User authentication system
- [ ] Admin dashboard
- [ ] Attendance tracking
- [ ] Time-off management
- [ ] Export employee data

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `php/config.php`
- Ensure database exists

### API Not Found (404)
- Verify all PHP files are in the `php/` folder
- Check file paths in JavaScript

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure Tailwind CDN is loading
- Check browser console for errors

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please contact the development team.
