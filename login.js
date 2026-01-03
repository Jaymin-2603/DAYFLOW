// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const loginIdOrEmail = document.getElementById('loginId').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!loginIdOrEmail || !password) {
        showError('Please enter both Login ID/Email and Password');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    
    // Clear previous errors
    document.getElementById('errorMessage').style.display = 'none';
    
    // Send login request to backend
    fetch('php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            loginId: loginIdOrEmail,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store user info in localStorage
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userName', data.userName);
            localStorage.setItem('userEmail', data.userEmail);
            localStorage.setItem('userRole', data.userRole);
            
            // Check if user needs to change password
            if (data.needs_password_change) {
                // Show password change modal
                showPasswordChangeModal();
            } else {
                // Redirect to dashboard
                window.location.href = 'index.html';
            }
        } else {
            showError(data.message || 'Invalid Login ID/Email or Password');
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
 * Show password change modal for first-time login
 */
function showPasswordChangeModal() {
    document.getElementById('changePasswordModal').style.display = 'flex';
    document.getElementById('firstPasswordInput').focus();
}

/**
 * Close password change modal
 */
function closePasswordChangeModal() {
    document.getElementById('changePasswordModal').style.display = 'none';
}

/**
 * Handle first-time password change
 */
function handlePasswordChange(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('firstPasswordInput').value.trim();
    const confirmPassword = document.getElementById('confirmPasswordInput').value.trim();
    
    if (!newPassword || !confirmPassword) {
        showModalError('Please enter and confirm your new password');
        return;
    }
    
    if (newPassword.length < 6) {
        showModalError('Password must be at least 6 characters long');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showModalError('Passwords do not match');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    
    // Send password change request
    const userId = localStorage.getItem('userId');
    
    fetch('php/change_first_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            userId: userId,
            newPassword: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closePasswordChangeModal();
            // Redirect to dashboard
            window.location.href = 'index.html';
        } else {
            showModalError(data.message || 'Failed to update password');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showModalError('An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
}

/**
 * Show error message in login form
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

/**
 * Show error message in password change modal
 */
function showModalError(message) {
    const errorDiv = document.getElementById('modalErrorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * Handle forgot password link click
 */
function handleForgotPassword() {
    const email = prompt('Enter your registered email address:');
    if (email && email.trim()) {
        // In a real application, you would send a password reset email
        alert('Password reset link sent to ' + email);
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = event.target.closest('button');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

/**
 * Toggle first password visibility
 */
function toggleFirstPasswordVisibility() {
    const passwordInput = document.getElementById('firstPasswordInput');
    const toggleBtn = event.target.closest('button');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

/**
 * Toggle confirm password visibility
 */
function toggleConfirmPasswordVisibility() {
    const passwordInput = document.getElementById('confirmPasswordInput');
    const toggleBtn = event.target.closest('button');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

/**
 * Handle remember me checkbox
 */
function handleRememberMe() {
    const rememberMe = document.getElementById('rememberMe').checked;
    if (rememberMe) {
        const loginId = document.getElementById('loginId').value.trim();
        if (loginId) {
            localStorage.setItem('rememberedLoginId', loginId);
        }
    } else {
        localStorage.removeItem('rememberedLoginId');
    }
}

// Load remembered login ID on page load
window.addEventListener('DOMContentLoaded', function() {
    const rememberedLoginId = localStorage.getItem('rememberedLoginId');
    if (rememberedLoginId) {
        document.getElementById('loginId').value = rememberedLoginId;
        document.getElementById('rememberMe').checked = true;
    }
});
