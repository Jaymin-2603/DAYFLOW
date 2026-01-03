// Profile Page JavaScript

let currentEmployeeId = 1;
let currentTab = 'resume';
let userRole = 'hr'; // 'employee' or 'hr'
let isEditMode = {
    resume: false,
    privateInfo: false,
    salaryInfo: false,
    security: false
};

// Fields that ONLY employees can edit (editable by employees)
const employeeEditableFields = [
    'name', 'email', 'mobile', 'personalEmail',
    'dateOfBirth', 'residingAddress', 'nationality', 'gender', 'maritalStatus'
];

// Fields that ONLY HR can edit (disabled for employees)
const hrOnlyFields = [
    'jobPosition', 'company', 'department', 'manager', 'dateOfJoining',
    'accountNumber', 'bankName', 'ifscCode', 'panNo', 'uanNo', 'empCode',
    // Salary fields (all read-only for employees)
    'monthlyWage', 'yearlyWage', 'workingDays', 'breakTime',
    'basicSalary', 'basicSalaryType', 'hraAmount', 'hraType',
    'standardAllowance', 'standardAllowanceType', 'performanceBonus', 'performanceBonusType',
    'leaveTravelAllowance', 'leaveTravelType', 'fixedAllowance', 'fixedAllowanceType',
    'pfEmployeePercent', 'pfEmployerPercent', 'professionalTax', 'incomeTaxPercent'
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkUserRole();
    applyFieldPermissions();
    loadEmployeeData();
    setupTabListeners();
    setupFormListeners();
});

// Check user role from session/localStorage
function checkUserRole() {
    // Get role from localStorage or session
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || 'employee';
    userRole = role.toLowerCase();
    console.log('User Role:', userRole);
}

// Apply field permissions based on user role
function applyFieldPermissions() {
    console.log('Applying permissions for role:', userRole);
    
    if (userRole === 'hr') {
        // HR can edit ALL fields
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.disabled = false;
            field.style.opacity = '1';
            field.style.cursor = 'auto';
            field.style.backgroundColor = '';
        });
        
        // Show all save buttons for HR
        document.getElementById('savePrivateInfo').style.display = 'block';
        document.getElementById('saveSalaryInfoAdmin').style.display = 'block';
        
        // Show Salary Info tab for HR (fully editable)
        const salaryTab = document.getElementById('salaryInfoTab');
        if (salaryTab) {
            salaryTab.style.display = 'inline-block';
            console.log('Salary tab displayed for HR (fully editable)');
        }
        
        // Setup salary calculations for HR
        setupSalaryCalculations();
        return;
    }
    
    // For EMPLOYEES: Only enable personal info fields
    console.log('Setting up employee permissions...');
    
    // Enable only employee editable fields
    employeeEditableFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.disabled = false;
            field.style.opacity = '1';
            field.style.cursor = 'auto';
            field.style.backgroundColor = '';
            console.log('Enabled:', fieldId);
        }
    });
    
    // Disable all HR-only fields for employees
    hrOnlyFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.disabled = true;
            field.style.opacity = '0.5';
            field.style.cursor = 'not-allowed';
            field.style.backgroundColor = '#2a2a2a';
        }
    });
    
    // Show Salary Info tab for employees (read-only view only)
    const salaryTab = document.getElementById('salaryInfoTab');
    if (salaryTab) {
        salaryTab.style.display = 'inline-block';
        console.log('Salary tab displayed for Employee (read-only)');
    }
    
    // Hide salary save button for employees
    const saveSalaryBtn = document.getElementById('saveSalaryInfoAdmin');
    if (saveSalaryBtn) {
        saveSalaryBtn.style.display = 'none';
    }
    
    // Show personal info save button only
    const savePrivateInfoBtn = document.getElementById('savePrivateInfo');
    if (savePrivateInfoBtn) {
        savePrivateInfoBtn.style.display = 'block';
    }
}

// Load employee data from backend
async function loadEmployeeData() {
    try {
        const response = await fetch(`php/get_employee.php?id=${currentEmployeeId}`);
        const result = await response.json();
        
        if (result.success) {
            populateEmployeeData(result.data);
            // If HR, load salary configuration too
            if (userRole === 'hr') {
                loadSalaryConfiguration();
            }
        } else {
            showAlert('Error loading employee data', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error loading employee data', 'error');
    }
}

// Load salary configuration for admin
async function loadSalaryConfiguration() {
    try {
        const response = await fetch(`php/get_salary_configuration.php?id=${currentEmployeeId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            populateSalaryConfiguration(result.data);
            // Recalculate totals
            calculateSalary();
        }
    } catch (error) {
        console.error('Error loading salary configuration:', error);
    }
}

// Populate salary configuration in the form
function populateSalaryConfiguration(data) {
    document.getElementById('monthlyWage').value = data.monthly_wage || '';
    document.getElementById('workingDays').value = data.working_days || '5';
    document.getElementById('breakTime').value = data.break_time || '';
    
    // Salary Components
    document.getElementById('basicSalary').value = data.basic_salary || '';
    document.getElementById('basicSalaryType').value = data.basic_salary_type || 'fixed';
    
    document.getElementById('hraAmount').value = data.hra || '';
    document.getElementById('hraType').value = data.hra_type || 'fixed';
    
    document.getElementById('standardAllowance').value = data.standard_allowance || '';
    document.getElementById('standardAllowanceType').value = data.standard_allowance_type || 'fixed';
    
    document.getElementById('performanceBonus').value = data.performance_bonus || '';
    document.getElementById('performanceBonusType').value = data.performance_bonus_type || 'fixed';
    
    document.getElementById('leaveTravelAllowance').value = data.leave_travel_allowance || '';
    document.getElementById('leaveTravelType').value = data.leave_travel_type || 'fixed';
    
    document.getElementById('fixedAllowance').value = data.fixed_allowance || '';
    document.getElementById('fixedAllowanceType').value = data.fixed_allowance_type || 'fixed';
    
    // PF and Tax
    document.getElementById('pfEmployeePercent').value = data.pf_employee_percent || '';
    document.getElementById('pfEmployerPercent').value = data.pf_employer_percent || '';
    document.getElementById('professionalTax').value = data.professional_tax || '';
    document.getElementById('incomeTaxPercent').value = data.income_tax_percent || '';
}

// Populate employee data in the form
function populateEmployeeData(data) {
    // Basic Info
    document.getElementById('name').value = data.name || '';
    document.getElementById('jobPosition').value = data.job_position || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('mobile').value = data.mobile || '';
    
    // Company Info
    document.getElementById('company').value = data.company || '';
    document.getElementById('department').value = data.department || '';
    document.getElementById('manager').value = data.manager || '';
    
    // Private Info
    document.getElementById('dateOfBirth').value = data.date_of_birth || '';
    document.getElementById('residingAddress').value = data.residing_address || '';
    document.getElementById('nationality').value = data.nationality || '';
    document.getElementById('personalEmail').value = data.personal_email || '';
    document.getElementById('gender').value = data.gender || '';
    document.getElementById('maritalStatus').value = data.marital_status || '';
    document.getElementById('dateOfJoining').value = data.date_of_joining || '';
    
    // Salary Info
    document.getElementById('accountNumber').value = data.account_number || '';
    document.getElementById('bankName').value = data.bank_name || '';
    document.getElementById('ifscCode').value = data.ifsc_code || '';
    document.getElementById('panNo').value = data.pan_no || '';
    document.getElementById('uanNo').value = data.uan_no || '';
    document.getElementById('empCode').value = data.emp_code || '';
}

// Setup tab listeners
function setupTabListeners() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Content`).classList.add('active');
    
    currentTab = tabName;
}

// Setup form listeners
function setupFormListeners() {
    // Private Info Save
    const savePrivateInfoBtn = document.getElementById('savePrivateInfo');
    if (savePrivateInfoBtn) {
        savePrivateInfoBtn.addEventListener('click', savePrivateInfo);
    }
    
    // Salary Info Save (Admin only)
    const saveSalaryInfoAdminBtn = document.getElementById('saveSalaryInfoAdmin');
    if (saveSalaryInfoAdminBtn) {
        saveSalaryInfoAdminBtn.addEventListener('click', saveSalaryConfigurationAdmin);
    }
    
    // Resume Upload
    const resumeUploadArea = document.getElementById('resumeUploadArea');
    if (resumeUploadArea) {
        resumeUploadArea.addEventListener('click', function() {
            document.getElementById('resumeFile').click();
        });
        
        resumeUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#e97f62';
            this.style.backgroundColor = '#252525';
        });
        
        resumeUploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = '#444';
            this.style.backgroundColor = 'transparent';
        });
        
        resumeUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleResumeUpload(files[0]);
            }
        });
    }
    
    const resumeFile = document.getElementById('resumeFile');
    if (resumeFile) {
        resumeFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleResumeUpload(this.files[0]);
            }
        });
    }
    
    // Profile photo upload
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.addEventListener('click', function() {
            document.getElementById('profilePhotoFile').click();
        });
    }
    
    const profilePhotoFile = document.getElementById('profilePhotoFile');
    if (profilePhotoFile) {
        profilePhotoFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                handlePhotoUpload(this.files[0]);
            }
        });
    }
}

// Save private info
async function savePrivateInfo() {
    // Employees can only save personal info fields
    if (userRole !== 'hr') {
        // For employees: only allow editable fields
        const editableFieldsOnly = {
            employee_id: currentEmployeeId,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            date_of_birth: document.getElementById('dateOfBirth').value,
            residing_address: document.getElementById('residingAddress').value,
            nationality: document.getElementById('nationality').value,
            personal_email: document.getElementById('personalEmail').value,
            gender: document.getElementById('gender').value,
            marital_status: document.getElementById('maritalStatus').value,
            // Employee cannot change these
            job_position: document.getElementById('jobPosition').value || '',
            company: document.getElementById('company').value || '',
            department: document.getElementById('department').value || '',
            manager: document.getElementById('manager').value || '',
            date_of_joining: document.getElementById('dateOfJoining').value || ''
        };
        
        try {
            const response = await fetch('php/update_employee.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Role': 'employee'
                },
                body: JSON.stringify(editableFieldsOnly)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('Personal information updated successfully', 'success');
            } else {
                showAlert(result.message || 'Error updating profile', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error updating profile', 'error');
        }
        return;
    }
    
    // HR can update all fields
    const data = {
        employee_id: currentEmployeeId,
        name: document.getElementById('name').value,
        job_position: document.getElementById('jobPosition').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        company: document.getElementById('company').value,
        department: document.getElementById('department').value,
        manager: document.getElementById('manager').value,
        date_of_birth: document.getElementById('dateOfBirth').value,
        residing_address: document.getElementById('residingAddress').value,
        nationality: document.getElementById('nationality').value,
        personal_email: document.getElementById('personalEmail').value,
        gender: document.getElementById('gender').value,
        marital_status: document.getElementById('maritalStatus').value,
        date_of_joining: document.getElementById('dateOfJoining').value
    };
    
    try {
        const response = await fetch('php/update_employee.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Role': 'hr'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Profile updated successfully', 'success');
        } else {
            showAlert(result.message || 'Error updating profile', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error updating profile', 'error');
    }
}

// Save salary info
async function saveSalaryInfo() {
    // Only HR can save salary info
    if (userRole !== 'hr') {
        showAlert('Error: Only HR can modify salary information', 'error');
        return;
    }
    
    const data = {
        employee_id: currentEmployeeId,
        account_number: document.getElementById('accountNumber').value,
        bank_name: document.getElementById('bankName').value,
        ifsc_code: document.getElementById('ifscCode').value,
        pan_no: document.getElementById('panNo').value,
        uan_no: document.getElementById('uanNo').value,
        emp_code: document.getElementById('empCode').value
    };
    
    try {
        const response = await fetch('php/update_salary_info.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Salary info updated successfully', 'success');
        } else {
            showAlert(result.message || 'Error updating salary info', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error updating salary info', 'error');
    }
}

// Handle resume upload
function handleResumeUpload(file) {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const fileName = file.name;
        const uploadArea = document.getElementById('resumeUploadArea');
        uploadArea.innerHTML = `
            <div style="padding: 1rem;">
                <i class="fas fa-file-pdf" style="font-size: 2rem; color: #e97f62; margin-bottom: 0.5rem;"></i>
                <p style="color: #999;">${fileName}</p>
                <small style="color: #666;">File ready to upload</small>
            </div>
        `;
        showAlert('Resume uploaded successfully', 'success');
    } else {
        showAlert('Please upload a PDF file', 'error');
    }
}

// Handle profile photo upload
function handlePhotoUpload(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePhoto = document.querySelector('.profile-photo');
            profilePhoto.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            showAlert('Profile photo updated successfully', 'success');
        };
        reader.readAsDataURL(file);
    } else {
        showAlert('Please upload an image file', 'error');
    }
}

// Setup salary calculations and listeners
function setupSalaryCalculations() {
    const salaryFields = [
        'monthlyWage', 'basicSalary', 'hraAmount', 'standardAllowance', 
        'performanceBonus', 'leaveTravelAllowance', 'fixedAllowance',
        'pfEmployeePercent', 'pfEmployerPercent', 'professionalTax', 'incomeTaxPercent'
    ];
    
    salaryFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', calculateSalary);
            field.addEventListener('change', calculateSalary);
        }
    });
}

// Calculate salary components and summary
function calculateSalary() {
    const monthlyWage = parseFloat(document.getElementById('monthlyWage').value) || 0;
    
    // Set yearly wage
    document.getElementById('yearlyWage').value = monthlyWage * 12;
    
    // Calculate salary components
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const hra = parseFloat(document.getElementById('hraAmount').value) || 0;
    const standardAllowance = parseFloat(document.getElementById('standardAllowance').value) || 0;
    const performanceBonus = parseFloat(document.getElementById('performanceBonus').value) || 0;
    const leaveTravelAllowance = parseFloat(document.getElementById('leaveTravelAllowance').value) || 0;
    const fixedAllowance = parseFloat(document.getElementById('fixedAllowance').value) || 0;
    
    // Calculate gross salary (sum of all components)
    const grossSalary = basicSalary + hra + standardAllowance + performanceBonus + leaveTravelAllowance + fixedAllowance;
    
    // Calculate PF contributions
    const pfEmployeePercent = parseFloat(document.getElementById('pfEmployeePercent').value) || 0;
    const pfEmployerPercent = parseFloat(document.getElementById('pfEmployerPercent').value) || 0;
    const pfEmployeeAmount = (grossSalary * pfEmployeePercent) / 100;
    const pfEmployerAmount = (grossSalary * pfEmployerPercent) / 100;
    
    document.getElementById('pfEmployeeAmount').textContent = pfEmployeeAmount.toFixed(2);
    document.getElementById('pfEmployerAmount').textContent = pfEmployerAmount.toFixed(2);
    
    // Calculate tax deductions
    const professionalTax = parseFloat(document.getElementById('professionalTax').value) || 0;
    const incomeTaxPercent = parseFloat(document.getElementById('incomeTaxPercent').value) || 0;
    const incomeTaxAmount = (grossSalary * incomeTaxPercent) / 100;
    
    document.getElementById('incomeTaxAmount').textContent = incomeTaxAmount.toFixed(2);
    
    // Calculate total deductions
    const totalDeductions = pfEmployeeAmount + professionalTax + incomeTaxAmount;
    
    // Calculate net salary
    const netSalary = grossSalary - totalDeductions;
    
    // Update summary
    document.getElementById('grossSalary').textContent = grossSalary.toFixed(2);
    document.getElementById('totalDeductions').textContent = totalDeductions.toFixed(2);
    document.getElementById('netSalary').textContent = netSalary.toFixed(2);
}

// Save salary configuration (Admin only)
async function saveSalaryConfigurationAdmin() {
    if (userRole !== 'hr') {
        showAlert('Error: Only HR can configure salary information', 'error');
        return;
    }
    
    const grossSalary = parseFloat(document.getElementById('grossSalary').textContent) || 0;
    const monthlyWage = parseFloat(document.getElementById('monthlyWage').value) || 0;
    
    // Validation: Gross salary should not exceed monthly wage
    if (grossSalary > monthlyWage * 1.1) {
        showAlert('Error: Total salary components cannot exceed the defined wage', 'error');
        return;
    }
    
    const data = {
        employee_id: currentEmployeeId,
        monthly_wage: monthlyWage,
        yearly_wage: monthlyWage * 12,
        working_days: document.getElementById('workingDays').value,
        break_time: document.getElementById('breakTime').value,
        basic_salary: document.getElementById('basicSalary').value,
        basic_salary_type: document.getElementById('basicSalaryType').value,
        hra: document.getElementById('hraAmount').value,
        hra_type: document.getElementById('hraType').value,
        standard_allowance: document.getElementById('standardAllowance').value,
        standard_allowance_type: document.getElementById('standardAllowanceType').value,
        performance_bonus: document.getElementById('performanceBonus').value,
        performance_bonus_type: document.getElementById('performanceBonusType').value,
        leave_travel_allowance: document.getElementById('leaveTravelAllowance').value,
        leave_travel_type: document.getElementById('leaveTravelType').value,
        fixed_allowance: document.getElementById('fixedAllowance').value,
        fixed_allowance_type: document.getElementById('fixedAllowanceType').value,
        pf_employee_percent: document.getElementById('pfEmployeePercent').value,
        pf_employer_percent: document.getElementById('pfEmployerPercent').value,
        professional_tax: document.getElementById('professionalTax').value,
        income_tax_percent: document.getElementById('incomeTaxPercent').value,
        gross_salary: grossSalary,
        net_salary: parseFloat(document.getElementById('netSalary').textContent) || 0
    };
    
    try {
        const response = await fetch('php/save_salary_configuration.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Salary configuration saved successfully', 'success');
        } else {
            showAlert(result.message || 'Error saving salary configuration', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error saving salary configuration', 'error');
    }
}
function showAlert(message, type) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type}`;
    alertContainer.textContent = message;
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '9999';
    alertContainer.style.maxWidth = '400px';
    
    document.body.appendChild(alertContainer);
    
    setTimeout(() => {
        alertContainer.style.opacity = '0';
        alertContainer.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            alertContainer.remove();
        }, 300);
    }, 3000);
}

// Toggle 2FA
function toggle2FA() {
    const toggle = document.getElementById('twoFactorToggle');
    const status = toggle.checked;
    showAlert(`2FA has been ${status ? 'enabled' : 'disabled'}`, 'success');
}
// Change Password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert('Please fill in all password fields', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword === currentPassword) {
        showAlert('New password must be different from current password', 'error');
        return;
    }
    
    // Send change password request
    const userId = localStorage.getItem('userId') || 1;
    
    fetch('php/change_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            userId: userId,
            currentPassword: currentPassword,
            newPassword: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Password changed successfully', 'success');
            // Clear form
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        } else {
            showAlert(data.message || 'Error changing password', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error changing password', 'error');
    });
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
}

// Open password change modal
function openPasswordChangeModal() {
    document.getElementById("passwordChangeModal").style.display = "flex";
    document.getElementById("currentPassword").focus();
}

// Close password change modal
function closePasswordChangeModal() {
    document.getElementById("passwordChangeModal").style.display = "none";
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
}
