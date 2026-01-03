# DayFlow - Quick Setup Instructions

## What's New

A complete **Login & Authentication System** has been added to DayFlow with:

✅ **User Authentication**
- Login page with email/Login ID support
- Auto-generated Login IDs (format: OI + initials + year + serial)
- Default password: `Odoo@1234`
- First-time password change requirement
- Password management in settings

✅ **Employee Registration (HR Only)**
- Dedicated signup page for HR to add employees
- Auto-generated unique credentials
- Employee data stored in database
- User accounts automatically created

✅ **Security Features**
- Password hashing with bcrypt
- Session management
- Role-based access control
- Logout functionality across all pages

## Step-by-Step Setup

### 1. Update Database

Run the updated SQL schema to add the `users` table:

**Option A: Using MySQL Command**
```bash
mysql -u root -p dayflow < c:\xampp\htdocs\dayflow\php\db_schema.sql
```

**Option B: Using phpMyAdmin**
1. Go to `http://localhost/phpmyadmin`
2. Open the `dayflow` database
3. Go to **SQL** tab
4. Paste the content from `php/db_schema.sql`
5. Click **Go**

**Option C: Manual SQL**
```sql
-- Add users table (if not exists)
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
```

### 2. Create Initial Users (Optional - for Testing)

Add test users to the database:

```sql
-- Insert HR user
INSERT INTO users (login_id, email, password_hash, role, first_login) 
VALUES ('OIJODO20220001', 'hr@dayflow.com', '$2y$10$YOUR_HASHED_PASSWORD', 'hr', FALSE);

-- Insert Employee user
INSERT INTO users (login_id, email, password_hash, role, first_login, employee_id) 
VALUES ('OIJODO20220002', 'thoughtful.sandpiper@company.com', '$2y$10$YOUR_HASHED_PASSWORD', 'employee', FALSE, 1);
```

To generate a bcrypt hash, you can use:
- PHP: `password_hash('Odoo@1234', PASSWORD_BCRYPT)`
- Or use an online bcrypt generator

### 3. Verify Database Connection

Edit `php/config.php` and ensure:
```php
$servername = "localhost";
$username = "root";
$password = "";           // Your MySQL password
$database = "dayflow";
```

### 4. Access the Application

#### For Employees:
1. Go to `http://localhost/dayflow/login.html`
2. Enter Login ID or Email + Password
3. On first login, change your password
4. Access profile at `http://localhost/dayflow/index.html`

#### For HR:
1. Go to `http://localhost/dayflow/login.html`
2. Login with HR credentials
3. Add new employees: `http://localhost/dayflow/signup.html`
4. Manage employees: `http://localhost/dayflow/admin_profile.html`
5. Salary management: `http://localhost/dayflow/hr_salary_dashboard.html`

## File Changes Summary

### New Files Created:
```
login.html                          # Login page
signup.html                         # HR: Add employee page
js/login.js                         # Login form handler
js/signup.js                        # Signup form handler
php/login.php                       # Authentication endpoint
php/signup.php                      # Employee registration endpoint
php/change_first_password.php       # First-time password change
php/change_password.php             # Password change in settings
php/session_check.php               # Session validation
SETUP_GUIDE.md                      # Complete setup guide
```

### Files Updated:
```
index.html                          # Added logout button + password change modal
admin_profile.html                  # Updated navbar with links
hr_salary_dashboard.html            # Updated navbar with links
js/profile.js                       # Added password change functions
php/db_schema.sql                   # Added users table
```

## Login ID Format

**Format:** OI + First 2 letters + Last 2 letters + Year + Serial Number

**Examples:**
- John Doe, joined 2022 → `OIJODO20220001`
- Sarah Smith, joined 2023 → `OISAS20230001`
- Mike Johnson, joined 2024 → `OIMJO20240001`

## Testing the System

### Quick Test Flow:

1. **Test Employee Login**
   - Visit `http://localhost/dayflow/login.html`
   - Use generated Login ID from signup
   - Default password: `Odoo@1234`
   - Change password on first login
   - Access profile
   - Change password again in Security tab

2. **Test HR Features**
   - Login as HR
   - Click "Add Employee" in navbar
   - Fill employee details
   - Share generated Login ID with employee
   - Go to Dashboard (admin_profile.html)
   - Go to Salary Management (hr_salary_dashboard.html)

3. **Test Permissions**
   - Employee: Can only edit personal info, salary is read-only
   - HR: Can edit everything and add/manage employees

## Important Files

**Database:**
- `php/config.php` - Database configuration
- `php/db_schema.sql` - Database schema

**Authentication:**
- `php/login.php` - Login handler
- `php/signup.php` - Employee registration
- `php/change_first_password.php` - First-time password change
- `php/change_password.php` - Password change anytime

**Frontend:**
- `login.html` - Login UI
- `signup.html` - Add employee UI
- `js/login.js` - Login logic
- `js/signup.js` - Signup logic

## Troubleshooting

### "Cannot connect to database"
- Check `php/config.php` credentials
- Ensure MySQL is running
- Verify `dayflow` database exists

### "Invalid Login ID or Password"
- Ensure users table has been created
- Check if user exists in database
- Verify password hash is correct

### "First-time password change not showing"
- Check browser console (F12) for errors
- Verify `first_login` flag is TRUE in database
- Clear browser cache and try again

### "Cannot add new employee"
- Check you're logged in as HR
- Verify employees table exists
- Check browser console for validation errors

## Next Steps

1. ✅ Set up database with users table
2. ✅ Update database connection in config.php
3. ✅ Create initial test users (optional)
4. ✅ Test login/signup flow
5. ✅ Test employee permissions
6. ✅ Test HR dashboard

## Features By Role

### Employee Features:
- ✅ Login with auto-generated credentials
- ✅ Change password on first login
- ✅ Edit personal information only
- ✅ View salary structure (read-only)
- ✅ Upload profile picture
- ✅ Change password anytime
- ✅ Logout

### HR Features:
- ✅ Login with HR credentials
- ✅ Add new employees (auto-generates credentials)
- ✅ Edit all employee information
- ✅ View all employees' salaries
- ✅ Export salary data to CSV
- ✅ Change password anytime
- ✅ Logout

## Security Notes

- Passwords are hashed using bcrypt (PHP's password_hash())
- SQL uses prepared statements to prevent injection
- Session validation on every request
- Frontend UI enforces role-based permissions
- Backend validates all requests

## Support Resources

- `SETUP_GUIDE.md` - Complete setup guide
- `test.html` - Quick role switching for testing
- Browser console (F12) - JavaScript errors
- MySQL error logs - Database issues
- `php/` directory - PHP error logs

---

**Happy Testing! 🚀**
