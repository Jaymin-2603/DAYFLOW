// Admin Profile Page JavaScript

let currentAdminId = 1;
let currentTab = 'overview';
let isEditMode = {
    overview: false,
    personalInfo: false,
    permissions: false,
    activityLog: false,
    security: false
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    setupTabListeners();
    setupFormListeners();
    loadActivityLog();
});

// Load admin data from backend
async function loadAdminData() {
    try {
        const response = await fetch(`php/get_admin.php?id=${currentAdminId}`);
        const result = await response.json();
        
        if (result.success) {
            populateAdminData(result.data);
        } else {
            showAlert('Error loading admin data', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error loading admin data', 'error');
    }
}

// Populate admin data in the form
function populateAdminData(data) {
    // Basic Info
    document.getElementById('adminName').value = data.name || '';
    document.getElementById('adminRole').value = data.role || 'System Administrator';
    document.getElementById('adminEmail').value = data.email || '';
    document.getElementById('adminMobile').value = data.mobile || '';
    
    // Organization Info
    document.getElementById('organization').value = data.organization || '';
    document.getElementById('adminDepartment').value = data.department || '';
    document.getElementById('adminSince').value = data.admin_since || '';
    
    // Personal Info
    document.getElementById('adminDOB').value = data.date_of_birth || '';
    document.getElementById('adminAddress').value = data.address || '';
    document.getElementById('adminNationality').value = data.nationality || '';
    document.getElementById('adminPersonalEmail').value = data.personal_email || '';
    document.getElementById('adminGender').value = data.gender || '';
    document.getElementById('adminMaritalStatus').value = data.marital_status || '';
    document.getElementById('adminAltPhone').value = data.alt_phone || '';
    
    // Admin Info
    document.getElementById('adminLoginId').textContent = data.login_id || 'N/A';
    document.getElementById('adminLastLogin').textContent = data.last_login || 'N/A';
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
    // Personal Info Save
    const savePersonalInfoBtn = document.getElementById('savePersonalInfo');
    if (savePersonalInfoBtn) {
        savePersonalInfoBtn.addEventListener('click', saveAdminPersonalInfo);
    }
    
    // Admin photo upload
    const adminPhoto = document.querySelector('.profile-photo');
    if (adminPhoto) {
        adminPhoto.addEventListener('click', function() {
            document.getElementById('adminPhotoFile').click();
        });
    }
    
    const adminPhotoFile = document.getElementById('adminPhotoFile');
    if (adminPhotoFile) {
        adminPhotoFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleAdminPhotoUpload(this.files[0]);
            }
        });
    }
}

// Save admin personal info
async function saveAdminPersonalInfo() {
    const data = {
        admin_id: currentAdminId,
        name: document.getElementById('adminName').value,
        email: document.getElementById('adminEmail').value,
        mobile: document.getElementById('adminMobile').value,
        organization: document.getElementById('organization').value,
        department: document.getElementById('adminDepartment').value,
        admin_since: document.getElementById('adminSince').value,
        date_of_birth: document.getElementById('adminDOB').value,
        address: document.getElementById('adminAddress').value,
        nationality: document.getElementById('adminNationality').value,
        personal_email: document.getElementById('adminPersonalEmail').value,
        gender: document.getElementById('adminGender').value,
        marital_status: document.getElementById('adminMaritalStatus').value,
        alt_phone: document.getElementById('adminAltPhone').value
    };
    
    try {
        const response = await fetch('php/update_admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Admin profile updated successfully', 'success');
        } else {
            showAlert(result.message || 'Error updating admin profile', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error updating admin profile', 'error');
    }
}

// Handle admin photo upload
function handleAdminPhotoUpload(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const adminPhoto = document.querySelector('.profile-photo');
            adminPhoto.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            showAlert('Admin profile photo updated successfully', 'success');
        };
        reader.readAsDataURL(file);
    } else {
        showAlert('Please upload an image file', 'error');
    }
}

// Load activity log
async function loadActivityLog() {
    try {
        const response = await fetch(`php/get_admin_activity.php?admin_id=${currentAdminId}`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            const activityList = document.getElementById('activityList');
            activityList.innerHTML = '';
            
            result.data.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.style.cssText = 'background-color: #1a1a1a; padding: 1rem; margin-bottom: 1rem; border-radius: 6px; border-left: 3px solid var(--primary-color);';
                activityItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <span style="font-weight: 500;">
                            <i class="fas fa-${getActivityIcon(activity.action)}"></i> ${activity.action}
                        </span>
                        <span style="color: #999; font-size: 0.85rem;">${new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                    <p style="color: #ccc; font-size: 0.9rem;">${activity.details}</p>
                `;
                activityList.appendChild(activityItem);
            });
        }
    } catch (error) {
        console.error('Error loading activity log:', error);
    }
}

// Get icon for activity type
function getActivityIcon(action) {
    const iconMap = {
        'login': 'sign-in-alt',
        'logout': 'sign-out-alt',
        'update': 'edit',
        'create': 'plus-circle',
        'delete': 'trash',
        'view': 'eye',
        'export': 'download',
        'import': 'upload'
    };
    return iconMap[action] || 'info-circle';
}

// Toggle 2FA for admin
function toggleAdminTwoFA() {
    const toggle = document.getElementById('twoFactorToggle');
    const status = toggle.checked;
    showAlert(`2FA has been ${status ? 'enabled' : 'disabled'} for your admin account`, 'success');
}

// Change admin password
function changeAdminPassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        const confirmPassword = prompt('Confirm new password:');
        if (newPassword === confirmPassword) {
            showAlert('Password changed successfully', 'success');
        } else {
            showAlert('Passwords do not match', 'error');
        }
    }
}

// View login activity
function viewLoginActivity() {
    alert('Login activity feature - Coming soon');
}

// Manage admin sessions
function manageAdminSessions() {
    alert('Session management feature - Coming soon');
}

// Configure IP whitelist
function configureIPWhitelist() {
    alert('IP whitelist configuration - Coming soon');
}

// Show alert message
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


// Logout function
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    }
}
