# Signup Page Troubleshooting Guide

## 🔧 Issue: "Unexpected token '<'" JSON Parse Error

### What This Means
The server is returning HTML error instead of JSON. This happens when:
1. Database connection fails
2. PHP syntax error occurs
3. Missing database tables
4. MySQL not running

---

## ✅ Step-by-Step Diagnostic

### Step 1: Test Database Connection
Visit: `http://localhost/dayflow/php/test_connection.php`

**Expected Response:**
```json
{
  "success": true,
  "database": "dayflow",
  "connection_status": "Connected",
  "users_table_exists": true,
  "employees_table_exists": true,
  "user_count": 0,
  "php_version": "7.x.x"
}
```

**If you see this, database is working!** → Go to Step 2

**If you see error**, check:
- [ ] MySQL is running (XAMPP Control Panel)
- [ ] Database "dayflow" exists
- [ ] Tables were created (run db_schema.sql)
- [ ] Credentials in php/config.php are correct

---

### Step 2: Check Browser Console
Press `F12` in your browser → Console tab

**Look for:**
- JavaScript errors
- Network errors (404, 500, etc)
- What the server actually returned

**To see the actual response:**
1. Open Console
2. Go to Network tab
3. Fill signup form and submit
4. Click on "signup.php" request
5. Go to Response tab to see what was returned

---

### Step 3: Verify Database Tables

Open phpMyAdmin: `http://localhost/phpmyadmin`

**Check these tables exist:**
- [ ] `dayflow`.`users` - Has columns: id, login_id, email, password_hash, role, first_login, employee_id
- [ ] `dayflow`.`employees` - Has columns: id, name, job_position, email, mobile, etc.

**If tables missing:**
1. Select database "dayflow"
2. Go to SQL tab
3. Paste content from `php/db_schema.sql`
4. Click Go

---

### Step 4: Check Config.php Credentials

Open `c:\xampp\htdocs\dayflow\php\config.php`:

```php
define('DB_HOST', 'localhost');  // Usually localhost
define('DB_USER', 'root');       // Your MySQL user
define('DB_PASS', '');           // Your MySQL password (empty by default)
define('DB_NAME', 'dayflow');    // Database name
```

**To find your MySQL credentials:**
1. Open phpMyAdmin
2. If you can login, credentials are correct
3. Default is usually: User=root, Password=empty, Host=localhost

---

## 🐛 Common Issues & Solutions

### Issue 1: "Access denied for user 'root'@'localhost'"
**Cause:** MySQL password is wrong or user doesn't exist
**Solution:**
1. Update DB_PASS in config.php with correct password
2. Or check phpMyAdmin to see actual credentials

### Issue 2: "Unknown database 'dayflow'"
**Cause:** Database doesn't exist
**Solution:**
1. Open phpMyAdmin
2. Click "New" to create database
3. Name it "dayflow"
4. Run db_schema.sql

### Issue 3: "Table 'dayflow.users' doesn't exist"
**Cause:** Tables weren't created
**Solution:**
1. Run db_schema.sql from phpMyAdmin
2. Or manually create tables in phpMyAdmin SQL tab

### Issue 4: JSON parse error even with tables
**Cause:** Possible PHP syntax error in signup.php
**Solution:**
1. Check browser console Network tab
2. Look at Response of failed signup.php request
3. Copy error message
4. Check signup.php around that line

### Issue 5: "Are you sure you want to logout?" - works everywhere else but signup fails
**Cause:** signup.php returning HTML error before JSON
**Solution:**
1. Check MySQL connection with test_connection.php
2. Verify tables exist
3. Check php/config.php credentials

---

## 🔍 Debug Checklist

Before adding employee, verify:

- [ ] XAMPP Apache is running (green)
- [ ] XAMPP MySQL is running (green)
- [ ] Can access `http://localhost/dayflow/login.html`
- [ ] Can login as HR user
- [ ] Can see HR dashboard
- [ ] Test connection shows "Connected"
- [ ] Both users and employees tables exist in phpMyAdmin
- [ ] config.php has correct DB credentials
- [ ] Browser console shows no JavaScript errors

---

## 📝 Step-by-Step: How to Fix

### Quick Fix (Most Likely to Work):

1. **Verify MySQL is running**
   - Open XAMPP Control Panel
   - Check MySQL is running (should be green/checked)
   - If not, click Start

2. **Test connection**
   - Go to `http://localhost/dayflow/php/test_connection.php`
   - Should show "Connected: true"

3. **Verify tables**
   - Go to `http://localhost/phpmyadmin`
   - Select "dayflow" database
   - Should see "users" and "employees" tables

4. **Try signup again**
   - Go to `http://localhost/dayflow/signup.html`
   - Fill form and submit
   - Should work!

### If Still Not Working:

1. **Check exact error**
   - Open DevTools (F12)
   - Go to Network tab
   - Click signup
   - Click "signup.php" request
   - Look at Response tab - copy the error

2. **Report the error**
   - Create new issue with error message
   - Include output of test_connection.php
   - Include MySQL error from Response tab

---

## 🧪 Test Without Form

To test if signup.php works at all:

1. Open any text editor
2. Create test file `test_signup.php`:
```php
<?php
header('Content-Type: application/json');
include 'php/config.php';

// Simple test
if ($conn) {
    echo json_encode(['success' => true, 'message' => 'Connection works']);
} else {
    echo json_encode(['success' => false, 'message' => 'Connection failed']);
}
?>
```
3. Save to `c:\xampp\htdocs\dayflow\test_signup.php`
4. Visit `http://localhost/dayflow/test_signup.php`
5. Should show: `{"success":true,"message":"Connection works"}`

---

## 📞 If You Need Help

**Check these files:**
- `php/test_connection.php` - Shows connection status
- `php/config.php` - Check credentials
- Browser Network tab - See actual response
- `php/db_schema.sql` - Run this if tables missing

**Common fixes:**
1. Restart MySQL (XAMPP Control Panel)
2. Run db_schema.sql from phpMyAdmin
3. Clear browser cache (Ctrl + Shift + Delete)
4. Check php/config.php has correct credentials

---

**The improved error handling in signup.js will now show you exactly what the server is returning!**

Go to signup page and try again - you should see a better error message now. 🚀
