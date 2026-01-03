// Open password change modal
function openPasswordChangeModal() {
    document.getElementById('passwordChangeModal').style.display = 'flex';
    document.getElementById('currentPassword').focus();
}

// Close password change modal
function closePasswordChangeModal() {
    document.getElementById('passwordChangeModal').style.display = 'none';
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}
