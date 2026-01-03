// HR Salary Dashboard JavaScript

let allEmployees = [];
let filteredEmployees = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAllEmployeesSalary();
    setupSearchListener();
});

// Load all employees' salary data
async function loadAllEmployeesSalary() {
    try {
        const response = await fetch('php/get_all_employees_salary.php');
        const result = await response.json();
        
        if (result.success) {
            allEmployees = result.data;
            filteredEmployees = [...allEmployees];
            displaySalaryTable();
            updateSummaryCards();
        } else {
            showAlert('Error loading employee salary data', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error loading employee salary data', 'error');
    }
}

// Display salary table
function displaySalaryTable() {
    const tableBody = document.getElementById('salaryTableBody');
    
    if (filteredEmployees.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 2rem; text-align: center; color: #999;">
                    <i class="fas fa-inbox"></i> No employees found
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    filteredEmployees.forEach(employee => {
        const row = document.createElement('tr');
        row.style.cssText = 'border-bottom: 1px solid #444; hover-effect';
        row.onmouseover = function() { this.style.backgroundColor = '#1a1a1a'; };
        row.onmouseout = function() { this.style.backgroundColor = 'transparent'; };
        
        const grossSalary = parseFloat(employee.gross_salary) || 0;
        const totalDeductions = (parseFloat(employee.pf_employee_percent) || 0) + 
                               (parseFloat(employee.professional_tax) || 0) +
                               (parseFloat(employee.income_tax_percent) || 0);
        const netSalary = grossSalary - totalDeductions;
        
        row.innerHTML = `
            <td style="padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${employee.name.charAt(0)}
                    </div>
                    <strong>${employee.name}</strong>
                </div>
            </td>
            <td style="padding: 1rem;">${employee.department || 'N/A'}</td>
            <td style="padding: 1rem;">${employee.job_position || 'N/A'}</td>
            <td style="padding: 1rem; font-weight: 500;">₹${parseFloat(employee.monthly_wage || 0).toLocaleString('en-IN')}</td>
            <td style="padding: 1rem; color: #4ade80; font-weight: 500;">₹${grossSalary.toLocaleString('en-IN')}</td>
            <td style="padding: 1rem; color: #ef4444; font-weight: 500;">₹${totalDeductions.toLocaleString('en-IN')}</td>
            <td style="padding: 1rem; color: var(--primary-color); font-weight: bold;">₹${netSalary.toLocaleString('en-IN')}</td>
            <td style="padding: 1rem;">
                <button onclick="viewEmployeeSalary(${employee.id})" style="padding: 0.5rem 1rem; background-color: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                    <i class="fas fa-eye"></i> View
                </button>
                <button onclick="editEmployeeSalary(${employee.id})" style="padding: 0.5rem 1rem; background-color: #3b5998; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; margin-left: 0.5rem;">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// View employee salary details in modal
function viewEmployeeSalary(employeeId) {
    const employee = allEmployees.find(e => e.id === employeeId);
    if (!employee) return;
    
    document.getElementById('modalEmployeeName').textContent = `${employee.name} - Salary Details`;
    
    const modalContent = document.getElementById('salaryModalContent');
    
    const grossSalary = parseFloat(employee.gross_salary) || 0;
    const pfEmployeeAmount = (grossSalary * (parseFloat(employee.pf_employee_percent) || 0)) / 100;
    const pfEmployerAmount = (grossSalary * (parseFloat(employee.pf_employer_percent) || 0)) / 100;
    const incomeTaxAmount = (grossSalary * (parseFloat(employee.income_tax_percent) || 0)) / 100;
    const professionalTax = parseFloat(employee.professional_tax) || 0;
    const totalDeductions = pfEmployeeAmount + professionalTax + incomeTaxAmount;
    const netSalary = grossSalary - totalDeductions;
    
    modalContent.innerHTML = `
        <div>
            <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-weight: bold;">Wage & Components</h3>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem;">
                <p style="color: #999; font-size: 0.85rem;">Monthly Wage</p>
                <p style="font-size: 1.2rem; font-weight: bold;">₹${parseFloat(employee.monthly_wage || 0).toLocaleString('en-IN')}</p>
            </div>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem;">
                <p style="color: #999; font-size: 0.85rem;">Basic Salary</p>
                <p style="font-size: 1.2rem; font-weight: bold;">₹${parseFloat(employee.basic_salary || 0).toLocaleString('en-IN')}</p>
            </div>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem;">
                <p style="color: #999; font-size: 0.85rem;">HRA</p>
                <p style="font-size: 1.2rem; font-weight: bold;">₹${parseFloat(employee.hra || 0).toLocaleString('en-IN')}</p>
            </div>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px;">
                <p style="color: #999; font-size: 0.85rem;">Gross Salary</p>
                <p style="font-size: 1.5rem; font-weight: bold; color: #4ade80;">₹${grossSalary.toLocaleString('en-IN')}</p>
            </div>
        </div>
        
        <div>
            <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-weight: bold;">Deductions & Summary</h3>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem;">
                <p style="color: #999; font-size: 0.85rem;">PF (Employee)</p>
                <p style="font-size: 1.2rem; font-weight: bold; color: #ef4444;">₹${pfEmployeeAmount.toLocaleString('en-IN')}</p>
            </div>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem;">
                <p style="color: #999; font-size: 0.85rem;">Professional Tax</p>
                <p style="font-size: 1.2rem; font-weight: bold; color: #ef4444;">₹${professionalTax.toLocaleString('en-IN')}</p>
            </div>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem;">
                <p style="color: #999; font-size: 0.85rem;">Income Tax</p>
                <p style="font-size: 1.2rem; font-weight: bold; color: #ef4444;">₹${incomeTaxAmount.toLocaleString('en-IN')}</p>
            </div>
            <div style="background-color: #1a1a1a; padding: 1rem; border-radius: 6px; border-left: 3px solid var(--primary-color);">
                <p style="color: #999; font-size: 0.85rem;">Net Salary</p>
                <p style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">₹${netSalary.toLocaleString('en-IN')}</p>
            </div>
        </div>
    `;
    
    document.getElementById('salaryModal').style.display = 'block';
}

// Edit employee salary
function editEmployeeSalary(employeeId) {
    // Redirect to employee profile with edit mode
    localStorage.setItem('userRole', 'hr');
    localStorage.setItem('editEmployeeId', employeeId);
    window.location.href = `index.html?employeeId=${employeeId}&tab=salaryInfo`;
}

// Close salary modal
function closeSalaryModal() {
    document.getElementById('salaryModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('salaryModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Setup search listener
function setupSearchListener() {
    const searchInput = document.getElementById('searchEmployee');
    searchInput.addEventListener('input', filterSalaryData);
}

// Filter salary data
function filterSalaryData() {
    const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
    const department = document.getElementById('departmentFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Filter by search and department
    filteredEmployees = allEmployees.filter(employee => {
        const matchSearch = employee.name.toLowerCase().includes(searchTerm);
        const matchDept = !department || employee.department === department;
        return matchSearch && matchDept;
    });
    
    // Sort
    if (sortBy === 'name') {
        filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'salary_asc') {
        filteredEmployees.sort((a, b) => parseFloat(a.gross_salary || 0) - parseFloat(b.gross_salary || 0));
    } else if (sortBy === 'salary_desc') {
        filteredEmployees.sort((a, b) => parseFloat(b.gross_salary || 0) - parseFloat(a.gross_salary || 0));
    } else if (sortBy === 'department') {
        filteredEmployees.sort((a, b) => (a.department || '').localeCompare(b.department || ''));
    }
    
    displaySalaryTable();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchEmployee').value = '';
    document.getElementById('departmentFilter').value = '';
    document.getElementById('sortBy').value = 'name';
    filteredEmployees = [...allEmployees];
    displaySalaryTable();
}

// Update summary cards
function updateSummaryCards() {
    const totalEmployees = filteredEmployees.length;
    const totalPayroll = filteredEmployees.reduce((sum, emp) => sum + (parseFloat(emp.gross_salary) || 0), 0);
    const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
    
    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('totalPayroll').textContent = '₹' + totalPayroll.toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
    document.getElementById('averageSalary').textContent = '₹' + averageSalary.toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
}

// Export salary data as CSV
function exportSalaryData() {
    if (filteredEmployees.length === 0) {
        showAlert('No data to export', 'warning');
        return;
    }
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Employee Name,Department,Position,Monthly Wage,Gross Salary,Deductions,Net Salary\n';
    
    filteredEmployees.forEach(employee => {
        const grossSalary = parseFloat(employee.gross_salary) || 0;
        const totalDeductions = (parseFloat(employee.pf_employee_percent) || 0) + 
                               (parseFloat(employee.professional_tax) || 0) +
                               (parseFloat(employee.income_tax_percent) || 0);
        const netSalary = grossSalary - totalDeductions;
        
        csvContent += `"${employee.name}","${employee.department || 'N/A'}","${employee.job_position || 'N/A'}",${employee.monthly_wage || 0},${grossSalary},${totalDeductions},${netSalary}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `salary_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Salary data exported successfully', 'success');
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
