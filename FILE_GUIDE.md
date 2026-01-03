# DayFlow - Complete File Structure & Documentation

## 📋 Directory Structure

```
dayflow/
│
├── index.html                           # Employee/HR Profile Page (Main dashboard)
├── login.html                           # Login Page (Entry point)
├── signup.html                          # HR: Add New Employee Page
├── admin_profile.html                   # HR: Admin Dashboard
├── hr_salary_dashboard.html             # HR: Salary Management Dashboard
├── test.html                            # Testing: Role switcher (for development)
│
├── SETUP_GUIDE.md                       # Complete setup instructions
├── QUICK_START.md                       # Quick start guide
├── FILE_GUIDE.md                        # This file
├── README.md                            # Original documentation
│
├── css/
│   └── style.css                        # Main CSS (dark theme, shared styles)
│
├── js/
│   ├── profile.js                       # Profile page logic (edit, save, calculations)
│   ├── admin_profile.js                 # Admin dashboard logic
│   ├── hr_salary_dashboard.js           # Salary dashboard logic
│   ├── login.js                         # Login form handler
│   ├── signup.js                        # Employee registration handler
│   └── profile-modal.js                 # Modal utilities (temporary)
│
└── php/
    ├── config.php                       # Database connection configuration
    ├── db_schema.sql                    # Database schema (tables & sample data)
    │
    ├── login.php                        # POST /login - Authenticate user
    ├── signup.php                       # POST /signup - Register new employee
    ├── change_first_password.php        # POST /change_first_password - First login pwd change
    ├── change_password.php              # POST /change_password - Pwd change anytime
    ├── session_check.php                # GET /session_check - Verify session
    │
    ├── get_employee.php                 # GET /get_employee - Fetch employee data
    ├── update_employee.php              # POST /update_employee - Update with permissions
    │
    ├── get_salary_configuration.php     # GET /salary_config - Fetch salary data
    ├── save_salary_configuration.php    # POST /salary_config - Save salary data (HR only)
    ├── get_all_employees_salary.php     # GET /all_employees_salary - HR dashboard
    │
    ├── get_admin.php                    # GET /get_admin - Fetch admin data
    ├── update_admin.php                 # POST /update_admin - Update admin profile
    └── get_admin_activity.php           # GET /admin_activity - Activity logs
```

## 🗂️ File Descriptions

### Frontend Pages

#### `login.html` (200+ lines)
**Purpose:** User login interface
**Features:**
- Login ID/Email input field
- Password input with visibility toggle
- Remember me checkbox
- Error message display
- First-time password change modal
- Responsive design with dark theme
**External Scripts:** `js/login.js`

#### `index.html` (500+ lines)
**Purpose:** Employee/HR profile dashboard
**Features:**
- 5 tabs: Resume, Private Info, Salary Info, Security, Admin sections (HR only)
- Profile photo upload
- Role-based field permissions
- Salary component management
- Password change modal
- Logout button in navbar
**External Scripts:** `js/profile.js`

#### `signup.html` (350+ lines)
**Purpose:** HR adds new employee
**Features:**
- Employee information form
- Auto-generated Login ID display
- Auto-generated password display (Odoo@1234)
- Copy-to-clipboard buttons
- HR-only access restriction
- Submit with employee creation
**External Scripts:** `js/signup.js`

#### `admin_profile.html` (380+ lines)
**Purpose:** HR admin dashboard
**Features:**
- Admin profile overview
- Permissions management
- Activity logs
- Multiple tabs
- Employee management links
- Logout button
**External Scripts:** `js/admin_profile.js`

#### `hr_salary_dashboard.html` (150+ lines)
**Purpose:** HR salary management and viewing
**Features:**
- View all employees' salaries
- Search and filter
- Sort by department, salary
- Export to CSV
- Edit salary components
- Logout button
**External Scripts:** `js/hr_salary_dashboard.js`

#### `test.html` (Development only)
**Purpose:** Quick role switching for testing
**Features:**
- Select role (Employee/HR)
- Switch role and navigate
- For development/testing only

### Backend PHP Files

#### `config.php` (10-15 lines)
**Purpose:** Database configuration
**Contains:**
- MySQL connection details
- Server, username, password, database name
**Must be configured before use**

#### `db_schema.sql` (80+ lines)
**Purpose:** Database structure and initial data
**Creates:**
- `users` table (authentication)
- `employees` table (employee data)
- `salary_info` table (salary details)
- `security_info` table (security settings)
**Sample data for testing included**

#### Authentication Files

##### `login.php`
**Method:** POST
**Parameters:**
- `loginId` (string) - Login ID or Email
- `password` (string) - User password
**Returns:**
```json
{
  "success": true/false,
  "userId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userRole": "employee",
  "needs_password_change": true/false
}
```

##### `signup.php`
**Method:** POST
**Parameters:**
- `firstName`, `lastName`, `email`, `mobile`
- `dateOfJoining`, `department`, `jobPosition`
- `manager`, `company`, `loginId`, `defaultPassword`
**Returns:**
```json
{
  "success": true/false,
  "employeeId": 1,
  "loginId": "OIJODO20220001",
  "message": "Employee added successfully"
}
```

##### `change_first_password.php`
**Method:** POST
**Parameters:**
- `userId` (int)
- `newPassword` (string)
**Returns:**
```json
{
  "success": true/false,
  "message": "Password updated/Error message"
}
```

##### `change_password.php`
**Method:** POST
**Parameters:**
- `userId` (int)
- `currentPassword` (string)
- `newPassword` (string)
**Returns:**
```json
{
  "success": true/false,
  "message": "Password changed successfully/Error"
}
```

#### Employee Data Files

##### `get_employee.php`
**Method:** GET
**Parameters:**
- `id` (int) - Employee ID
**Returns:** Employee data in JSON format

##### `update_employee.php`
**Method:** POST
**Features:**
- Role-based field validation
- Employees can only edit certain fields
- HR can edit all fields
- Backend permission enforcement

#### Salary Files

##### `get_salary_configuration.php`
**Method:** GET
**Parameters:**
- `employee_id` (int)
**Returns:** Salary configuration data

##### `save_salary_configuration.php`
**Method:** POST
**Parameters:** Salary components, deductions, calculations
**Access:** HR only
**Features:**
- Validates HR role
- Calculates gross/net automatically
- Supports fixed and percentage types

##### `get_all_employees_salary.php`
**Method:** GET
**Features:**
- Returns all employees' salary data
- Joins with salary_configuration
- HR dashboard data source

### JavaScript Files

#### `js/login.js` (200+ lines)
**Functions:**
- `handleLogin(event)` - Login form submission
- `showPasswordChangeModal()` - Show first-time pwd change
- `handlePasswordChange(event)` - Submit new password
- `togglePasswordVisibility()` - Show/hide password
- `handleRememberMe()` - Save login ID to localStorage

#### `js/signup.js` (200+ lines)
**Functions:**
- `generateLoginId()` - Create OI format Login ID
- `copyToClipboard(elementId)` - Copy credentials
- `handleSignup(event)` - Submit new employee
- `showError/showSuccess()` - Display messages
- `logout()` - Logout user

#### `js/profile.js` (700+ lines)
**Key Functions:**
- `checkUserRole()` - Get user role
- `applyFieldPermissions()` - Enable/disable fields based on role
- `loadEmployeeData()` - Fetch employee from backend
- `calculateSalary()` - Auto-calculate gross/net
- `savePrivateInfo()` - Save personal data
- `saveSalaryConfigurationAdmin()` - Save salary (HR only)
- `changePassword()` - Update password
- `openPasswordChangeModal()` - Show pwd modal
- `logout()` - Logout user

**Permission Fields:**
- Employee editable: name, email, mobile, personal_email, dob, address, gender, marital_status
- HR editable: job_position, company, department, manager, date_of_joining, salary fields, bank details

#### `js/admin_profile.js` (280+ lines)
**Functions:**
- `loadAdminData()` - Fetch admin profile
- `setupTabListeners()` - Tab switching
- `loadActivityLog()` - Get activity logs
- `saveAdminData()` - Update profile
- `logout()` - Logout user

#### `js/hr_salary_dashboard.js` (300+ lines)
**Functions:**
- `loadEmployeesSalary()` - Fetch all employees
- `filterEmployees()` - Search/filter data
- `sortByColumn()` - Sort table
- `exportToCSV()` - Download as CSV
- `logout()` - Logout user

### Styling

#### `css/style.css` (500+ lines)
**Contains:**
- CSS variables: colors, fonts, spacing
- Dark theme styling
- Component styles: navbar, cards, forms, tables
- Animation and transitions
- Responsive design
- Button and input styles
- Modal styling
- Tab styling

**Color Scheme:**
- Background: #1a1a1a (dark)
- Primary: #e97f62 (orange)
- Text: #e0e0e0 (light gray)
- Border: #555 (medium gray)

## 🔄 User Flow

### Employee Flow:
```
login.html → Enter credentials → backend auth
  ↓ (First login)
Change password modal → confirm → backend update
  ↓ (Subsequent logins)
index.html (Profile dashboard) → View/Edit → Save (with permissions)
```

### HR Flow:
```
login.html → HR credentials → backend auth
  ↓
admin_profile.html (Dashboard) 
  ├→ signup.html (Add employee)
  ├→ hr_salary_dashboard.html (Manage salaries)
  └→ edit employee in admin_profile.html
```

## 🔐 Security Implementation

### Backend
- ✅ Bcrypt password hashing
- ✅ Prepared statements (SQL injection prevention)
- ✅ Role validation on every request
- ✅ Session management
- ✅ Input sanitization

### Frontend
- ✅ localStorage for role/userId
- ✅ Dynamic field disabling based on role
- ✅ Form validation before submission
- ✅ Error handling with user feedback
- ✅ Logout functionality

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('employee', 'hr', 'admin'),
    first_login BOOLEAN DEFAULT TRUE,
    employee_id INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Employees Table
```sql
CREATE TABLE employees (
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
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🧪 Testing Files

**test.html** - Development role switcher
- Not for production use
- Used to quickly test different roles
- Simulates role changes without login

## 📝 Documentation Files

1. **QUICK_START.md** - Start here! Quick setup guide
2. **SETUP_GUIDE.md** - Comprehensive setup instructions
3. **FILE_GUIDE.md** - This file (complete file reference)
4. **README.md** - Original project documentation

## ✅ Implementation Checklist

- [x] Login page with UI
- [x] Signup page for HR
- [x] Database schema with users table
- [x] Password hashing (bcrypt)
- [x] Session management
- [x] Role-based permissions
- [x] First-time password change
- [x] Password change in settings
- [x] Logout functionality
- [x] Auto-generated Login ID
- [x] Auto-generated password
- [x] Password visibility toggle
- [x] Remember me functionality
- [x] Error handling
- [x] Backend validation
- [x] Frontend validation

## 🚀 Getting Started

1. Read **QUICK_START.md** for fast setup
2. Update `php/config.php` with your DB credentials
3. Run `db_schema.sql` to create tables
4. Go to `http://localhost/dayflow/login.html`
5. Test with auto-generated credentials

---

**Last Updated:** 2024
**Status:** Complete and Ready for Use
