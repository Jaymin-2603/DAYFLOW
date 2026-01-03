// Check if user is HR on page load
window.addEventListener('DOMContentLoaded', function() {
    const userRole = localStorage.getItem('userRole');
    
    // Redirect to login if not HR
    if (!userRole || userRole !== 'hr') {
        alert('You do not have permission to access this page. Only HR can add new employees.');
        window.location.href = 'index.html';
    }
});

/**
 * Generate Login ID in format: OI + 2 chars from first name + 2 chars from last name + year + serial
 * Example: OIJODO20220001
 */
function generateLoginId() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dateOfJoining = document.getElementById('dateOfJoining').value;
    
    const loginIdElement = document.getElementById('generatedLoginId');
    
    if (!firstName || !lastName || !dateOfJoining) {
        loginIdElement.textContent = 'OI________';
        return;
    }
    
    // Get first 2 characters from names (uppercase)
    const firstNameInitials = firstName.substring(0, 2).toUpperCase();
    const lastNameInitials = lastName.substring(0, 2).toUpperCase();
    
    // Get year from joining date
    const joiningDate = new Date(dateOfJoining);
    const year = joiningDate.getFullYear();
    
    // Generate serial number (for now, using a random 4-digit number)
    // In production, this should be fetched from database based on count of employees in that year
    const serial = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    
    const loginId = `OI${firstNameInitials}${lastNameInitials}${year}${serial}`;
    loginIdElement.textContent = loginId;
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target.closest('.copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/**
 * Handle signup form submission
 */
function handleSignup(event) {
    event.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const dateOfJoining = document.getElementById('dateOfJoining').value;
    const department = document.getElementById('department').value;
    const jobPosition = document.getElementById('jobPosition').value.trim();
    const manager = document.getElementById('manager').value.trim();
    const company = document.getElementById('company').value.trim();
    
    // Validate required fields
    if (!firstName || !lastName || !email || !mobile || !dateOfJoining || !department || !jobPosition) {
        showError('Please fill in all required fields');
        return;
    }
    
    // Get generated login ID
    const loginId = document.getElementById('generatedLoginId').textContent;
    const defaultPassword = 'Odoo@1234';
    
    // Disable submit button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Employee...';
    
    // Send to backend
    fetch('php/signup.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobile: mobile,
            dateOfJoining: dateOfJoining,
            department: department,
            jobPosition: jobPosition,
            manager: manager,
            company: company,
            loginId: loginId,
            defaultPassword: defaultPassword
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.success) {
                showSuccess('Employee added successfully! Login ID: ' + loginId);
                
                // Reset form
                document.getElementById('signupForm').reset();
                document.getElementById('generatedLoginId').textContent = 'OI________';
                
                // Redirect to index after 2 seconds
                setTimeout(() => {
                    window.location.href = 'admin_profile.html';
                }, 2000);
            } else {
                showError(data.message || 'Failed to add employee');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        } catch (e) {
            console.error('Invalid JSON response:', text);
            showError('Server error: ' + text.substring(0, 100));
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Scroll to message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Scroll to message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
}
