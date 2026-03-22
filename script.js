// ===========================
// SCHOOL MANAGEMENT SYSTEM
// Main Application JavaScript
// ===========================

// Global State Management
const AppState = {
    currentPage: 'dashboard',
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    students: [
        { id: 1, rollNo: '001', name: 'John Smith', class: '10A', email: 'john@example.com', phone: '555-0101', status: 'active' },
        { id: 2, rollNo: '002', name: 'Sarah Johnson', class: '10A', email: 'sarah@example.com', phone: '555-0102', status: 'active' },
        { id: 3, rollNo: '003', name: 'Michael Brown', class: '10B', email: 'michael@example.com', phone: '555-0103', status: 'inactive' },
    ],
    teachers: [
        { id: 1, teacherId: 'T001', name: 'Dr. Emily Wilson', department: 'Science', email: 'emily@school.com', phone: '555-1001', qualification: 'M.Sc Physics' },
        { id: 2, teacherId: 'T002', name: 'Prof. James Davis', department: 'Mathematics', email: 'james@school.com', phone: '555-1002', qualification: 'M.Tech' },
        { id: 3, teacherId: 'T003', name: 'Ms. Lisa Anderson', department: 'English', email: 'lisa@school.com', phone: '555-1003', qualification: 'M.A English' },
    ],
    classes: [
        { id: 1, name: '10A', standard: '10', teacher: 'Dr. Emily Wilson', totalStudents: 42, room: 'Block A, Room 101', shift: 'Morning (8:00 AM - 2:00 PM)' },
        { id: 2, name: '10B', standard: '10', teacher: 'Prof. James Davis', totalStudents: 38, room: 'Block A, Room 102', shift: 'Morning (8:00 AM - 2:00 PM)' },
        { id: 3, name: '9A', standard: '9', teacher: 'Ms. Lisa Anderson', totalStudents: 40, room: 'Block B, Room 201', shift: 'Morning (8:00 AM - 2:00 PM)' },
    ],
    departments: [
        { id: 1, name: 'Science', head: 'Dr. Emily Wilson', totalTeachers: 5, subjects: 'Physics, Chemistry, Biology', email: 'science@school.com', phone: '555-2001' },
        { id: 2, name: 'Mathematics', head: 'Prof. James Davis', totalTeachers: 4, subjects: 'Algebra, Geometry, Calculus', email: 'math@school.com', phone: '555-2002' },
        { id: 3, name: 'English', head: 'Ms. Lisa Anderson', totalTeachers: 3, subjects: 'English Literature, Grammar', email: 'english@school.com', phone: '555-2003' },
    ],
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function requireAuthentication() {
    if (!isAuthenticated()) {
        navigateToPage('login');
        showToast('Please log in to continue.', 'info');
        return false;
    }
    return true;
}

function initializeApp() {
    setupEventListeners();
    applyTheme();
    initializeCharts();

    updateSidebarFooter();
    renderClassCards();
    renderDepartmentCards();

    if (!isAuthenticated()) {
        navigateToPage('login');
    } else {
        setupPageNavigation();
    }
}

function updateSidebarFooter() {
    const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
    const userProfile = document.getElementById('sidebarUserProfile');

    if (!sidebarLogoutBtn || !userProfile) return;

    if (isAuthenticated()) {
        sidebarLogoutBtn.style.display = 'inline-flex';
        userProfile.style.opacity = '1';
    } else {
        sidebarLogoutBtn.style.display = 'none';
        userProfile.style.opacity = '0.5';
    }

    loadProfilePicture();
}

function loadProfilePicture() {
    const profilePic = localStorage.getItem('sidebarProfilePic');
    const avatar = document.getElementById('sidebarUserAvatar');
    if (avatar && profilePic) {
        avatar.src = profilePic;
    }
}

function handleProfilePicUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        const avatar = document.getElementById('sidebarUserAvatar');
        if (avatar) {
            avatar.src = dataUrl;
        }
        localStorage.setItem('sidebarProfilePic', dataUrl);
        showToast('Profile picture uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

// ===========================
// EVENT LISTENERS SETUP
// ===========================

function setupEventListeners() {
    // Sidebar Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Sidebar Footer Logout
    const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', handleLogout);
    }

    // Sidebar Toggle (Mobile)
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Notification Button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }

    // Modal Controls
    setupModalControls();

    // Button Event Listeners
    setupButtonListeners();

    // Search and Filter
    setupSearchAndFilters();

    // Attendance Controls
    setupAttendanceControls();

    // Profile picture upload
    const profilePicInput = document.getElementById('profilePicInput');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', handleProfilePicUpload);
    }

    // Settings
    setupSettingsControls();
}

function setupPageNavigation() {
    const currentPage = localStorage.getItem('currentPage') || 'dashboard';
    navigateToPage(currentPage);
}

// ===========================
// NAVIGATION FUNCTIONS
// ===========================

function handleNavigation(e) {
    e.preventDefault();
    const page = this.getAttribute('data-page');
    navigateToPage(page);
}

function navigateToPage(page) {
    if (page !== 'login' && !isAuthenticated()) {
        page = 'login';
        showToast('Login required to access this page.', 'info');
    }

    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(p => p.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(page);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    const titleMap = {
        'dashboard': 'Dashboard',
        'students': 'Student Management',
        'teachers': 'Teacher Management',
        'classes': 'Class Management',
        'attendance': 'Attendance Management',
        'grades': 'Grades Management',
        'timetable': 'Timetable',
        'events': 'Events Management',
        'finance': 'Finance Management',
        'library': 'Library Management',
        'notices': 'Notices & Announcements',
        'settings': 'Settings',
        'login': 'Login',
        'departments': 'Department Management'
    };
    if (pageTitle) {
        pageTitle.textContent = titleMap[page] || 'Dashboard';
    }

    // Store current page
    localStorage.setItem('currentPage', page);
    AppState.currentPage = page;

    if (page === 'classes') {
        renderClassCards();
    }

    if (page === 'departments') {
        renderDepartmentCards();
    }

    // Close mobile sidebar
    closeSidebar();
}

// SIDEBAR CONTROLS

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('active');
}

// THEME TOGGLE
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateThemeIcon();
}

function applyTheme() {
    if (AppState.isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// ===========================
// LOGOUT FUNCTION
// ===========================

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.setItem('isAuthenticated', 'false');
        showToast('Logged out successfully!', 'success');
        updateSidebarFooter();
        navigateToPage('login');
    }
}

function handleLogin() {
    // Login without credentials for quick demo mode
    localStorage.setItem('isAuthenticated', 'true');
    showToast('Login successful! (No credentials required)', 'success');
    updateSidebarFooter();
    navigateToPage('dashboard');
}

// ===========================
// NOTIFICATIONS
// ===========================

function showNotifications() {
    alert('You have 3 new notifications:\n\n1. New student enrolled\n2. Grades uploaded for Class 10A\n3. Attendance marked for today');
}

// ===========================
// MODAL CONTROLS
// ===========================

function setupModalControls() {
    const modal = document.getElementById('formModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (closeModal) {
        closeModal.addEventListener('click', () => closeFormModal());
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeFormModal());
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', handleFormSubmit);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeFormModal();
            }
        });
    }
}

function openFormModal(title, formType, recordId = null) {
    const modal = document.getElementById('formModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('dynamicForm');

    if (modalTitle) {
        modalTitle.textContent = title;
    }

    if (!form) return;

    form.dataset.formType = formType;
    form.dataset.recordId = recordId || '';

    // build dynamic form fields
    if (formType === 'class') {
        form.innerHTML = `
            <div class="form-group">
                <label>Class Name</label>
                <input type="text" id="className" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Standard</label>
                <input type="text" id="classStandard" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Class Teacher</label>
                <input type="text" id="classTeacher" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Total Students</label>
                <input type="number" id="classStudents" class="form-control" min="1" required>
            </div>
            <div class="form-group">
                <label>Room</label>
                <input type="text" id="classRoom" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Shift</label>
                <input type="text" id="classShift" class="form-control" required>
            </div>
        `;

        if (recordId) {
            const classItem = AppState.classes.find(item => item.id === Number(recordId));
            if (classItem) {
                document.getElementById('className').value = classItem.name;
                document.getElementById('classStandard').value = classItem.standard;
                document.getElementById('classTeacher').value = classItem.teacher;
                document.getElementById('classStudents').value = classItem.totalStudents;
                document.getElementById('classRoom').value = classItem.room;
                document.getElementById('classShift').value = classItem.shift;
            }
        }
    } else if (formType === 'department') {
        form.innerHTML = `
            <div class="form-group">
                <label>Department Name</label>
                <input type="text" id="deptName" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Department Head</label>
                <input type="text" id="deptHead" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Total Teachers</label>
                <input type="number" id="deptTeachers" class="form-control" min="1" required>
            </div>
            <div class="form-group">
                <label>Subjects</label>
                <input type="text" id="deptSubjects" class="form-control" placeholder="e.g., Physics, Chemistry" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="deptEmail" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="deptPhone" class="form-control" required>
            </div>
        `;

        if (recordId) {
            const deptItem = AppState.departments.find(item => item.id === Number(recordId));
            if (deptItem) {
                document.getElementById('deptName').value = deptItem.name;
                document.getElementById('deptHead').value = deptItem.head;
                document.getElementById('deptTeachers').value = deptItem.totalTeachers;
                document.getElementById('deptSubjects').value = deptItem.subjects;
                document.getElementById('deptEmail').value = deptItem.email;
                document.getElementById('deptPhone').value = deptItem.phone;
            }
        }
    } else {
        // keep existing static fields for other forms
        form.innerHTML = `
            <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Class</label>
                <select class="form-control" required>
                    <option value="">Select Class</option>
                    <option value="10A">Class 10A</option>
                    <option value="10B">Class 10B</option>
                    <option value="9A">Class 9A</option>
                </select>
            </div>
        `;
    }

    if (modal) {
        modal.classList.add('active');
    }
}

function closeFormModal() {
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleFormSubmit(event) {
    if (event) {
        event.preventDefault();
    }

    const form = document.getElementById('dynamicForm');
    if (!form) {
        showToast('Form not found.', 'error');
        return;
    }

    const formType = form.dataset.formType;
    const recordId = form.dataset.recordId;

    if (!form.checkValidity()) {
        showToast('Please fill all required fields!', 'error');
        return;
    }

    if (formType === 'class') {
        const classObject = {
            id: recordId ? Number(recordId) : Date.now(),
            name: document.getElementById('className').value.trim(),
            standard: document.getElementById('classStandard').value.trim(),
            teacher: document.getElementById('classTeacher').value.trim(),
            totalStudents: Number(document.getElementById('classStudents').value.trim()),
            room: document.getElementById('classRoom').value.trim(),
            shift: document.getElementById('classShift').value.trim(),
        };

        if (recordId) {
            const index = AppState.classes.findIndex(item => item.id === Number(recordId));
            if (index >= 0) {
                AppState.classes[index] = classObject;
                showToast('Class updated successfully!', 'success');
            }
        } else {
            AppState.classes.push(classObject);
            showToast('Class added successfully!', 'success');
        }

        renderClassCards();
        closeFormModal();
        return;
    }

    if (formType === 'department') {
        const deptObject = {
            id: recordId ? Number(recordId) : Date.now(),
            name: document.getElementById('deptName').value.trim(),
            head: document.getElementById('deptHead').value.trim(),
            totalTeachers: Number(document.getElementById('deptTeachers').value.trim()),
            subjects: document.getElementById('deptSubjects').value.trim(),
            email: document.getElementById('deptEmail').value.trim(),
            phone: document.getElementById('deptPhone').value.trim(),
        };

        if (recordId) {
            const index = AppState.departments.findIndex(item => item.id === Number(recordId));
            if (index >= 0) {
                AppState.departments[index] = deptObject;
                showToast('Department updated successfully!', 'success');
            }
        } else {
            AppState.departments.push(deptObject);
            showToast('Department added successfully!', 'success');
        }

        renderDepartmentCards();
        closeFormModal();
        return;
    }

    showToast('Data submitted successfully!', 'success');
    closeFormModal();
    form.reset();
}


// ===========================
// BUTTON EVENT LISTENERS
// ===========================

function setupButtonListeners() {
    // Students
    const addStudentBtn = document.getElementById('addStudentBtn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => openFormModal('Add New Student', 'student'));
    }

    // Teachers
    const addTeacherBtn = document.getElementById('addTeacherBtn');
    if (addTeacherBtn) {
        addTeacherBtn.addEventListener('click', () => openFormModal('Add New Teacher', 'teacher'));
    }

    // Classes
    const addClassBtn = document.getElementById('addClassBtn');
    if (addClassBtn) {
        addClassBtn.addEventListener('click', () => openFormModal('Add New Class', 'class'));
    }

    // Departments
    const addDepartmentBtn = document.getElementById('addDepartmentBtn');
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener('click', () => openFormModal('Add New Department', 'department'));
    }

    // Grades
    const addGradeBtn = document.getElementById('addGradeBtn');
    if (addGradeBtn) {
        addGradeBtn.addEventListener('click', () => openFormModal('Add Grades', 'grade'));
    }

    // Events
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => openFormModal('Add Event', 'event'));
    }

    // Finance
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', () => openFormModal('Add Transaction', 'transaction'));
    }

    // Library
    const addBookBtn = document.getElementById('addBookBtn');
    if (addBookBtn) {
        addBookBtn.addEventListener('click', () => openFormModal('Add Book', 'book'));
    }

    // Notices
    const addNoticeBtn = document.getElementById('addNoticeBtn');
    if (addNoticeBtn) {
        addNoticeBtn.addEventListener('click', () => openFormModal('Add Notice', 'notice'));
    }

    // Login submit
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', handleLogin);
    }

    // Class card actions (view/edit) via delegation
    const classesGrid = document.getElementById('classesGrid');
    if (classesGrid) {
        classesGrid.addEventListener('click', handleClassCardAction);
    }

    // Department card actions (view/edit) via delegation
    const departmentsGrid = document.getElementById('departmentsGrid');
    if (departmentsGrid) {
        departmentsGrid.addEventListener('click', handleDepartmentCardAction);
    }

    // Edit and Delete buttons
    setupTableActions();
}

function setupTableActions() {
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');

    editButtons.forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

function renderClassCards() {
    const classesGrid = document.getElementById('classesGrid');
    if (!classesGrid) return;

    classesGrid.innerHTML = '';

    AppState.classes.forEach(classItem => {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.dataset.classId = classItem.id;

        card.innerHTML = `
            <div class="class-header">
                <h3>Class ${classItem.name}</h3>
                <span class="class-badge">Standard ${classItem.standard}</span>
            </div>
            <div class="class-body">
                <div class="class-info">
                    <p><i class="fas fa-user-tie"></i> <strong>Class Teacher:</strong> ${classItem.teacher}</p>
                    <p><i class="fas fa-users"></i> <strong>Total Students:</strong> ${classItem.totalStudents}</p>
                    <p><i class="fas fa-door-open"></i> <strong>Room:</strong> ${classItem.room}</p>
                    <p><i class="fas fa-clock"></i> <strong>Shift:</strong> ${classItem.shift}</p>
                </div>
                <div class="class-actions">
                    <button class="btn btn-small btn-primary" data-action="view" data-id="${classItem.id}">View Details</button>
                    <button class="btn btn-small btn-secondary" data-action="edit" data-id="${classItem.id}">Edit</button>
                </div>
            </div>
        `;

        classesGrid.appendChild(card);
    });
}

function handleClassCardAction(e) {
    const actionBtn = e.target.closest('button[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const classId = parseInt(actionBtn.dataset.id, 10);
    const classItem = AppState.classes.find(item => item.id === classId);

    if (!classItem) {
        showToast('Class not found', 'error');
        return;
    }

    if (action === 'view') {
        alert(`Class ${classItem.name} details:\n\nTeacher: ${classItem.teacher}\nStudents: ${classItem.totalStudents}\nRoom: ${classItem.room}\nShift: ${classItem.shift}`);
    } else if (action === 'edit') {
        openFormModal(`Edit Class ${classItem.name}`, 'class', classId);
    }
}

function renderDepartmentCards() {
    const departmentsGrid = document.getElementById('departmentsGrid');
    if (!departmentsGrid) return;

    departmentsGrid.innerHTML = '';

    AppState.departments.forEach(dept => {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.dataset.deptId = dept.id;

        card.innerHTML = `
            <div class="class-header">
                <h3>${dept.name} Department</h3>
                <span class="class-badge">Head Dept</span>
            </div>
            <div class="class-body">
                <div class="class-info">
                    <p><i class="fas fa-user-tie"></i> <strong>Department Head:</strong> ${dept.head}</p>
                    <p><i class="fas fa-users"></i> <strong>Total Teachers:</strong> ${dept.totalTeachers}</p>
                    <p><i class="fas fa-book"></i> <strong>Subjects:</strong> ${dept.subjects}</p>
                    <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${dept.email}</p>
                    <p><i class="fas fa-phone"></i> <strong>Phone:</strong> ${dept.phone}</p>
                </div>
                <div class="class-actions">
                    <button class="btn btn-small btn-primary" data-action="viewdept" data-id="${dept.id}">View Details</button>
                    <button class="btn btn-small btn-secondary" data-action="editdept" data-id="${dept.id}">Edit</button>
                </div>
            </div>
        `;

        departmentsGrid.appendChild(card);
    });
}

function handleDepartmentCardAction(e) {
    const actionBtn = e.target.closest('button[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const deptId = parseInt(actionBtn.dataset.id, 10);
    const deptItem = AppState.departments.find(item => item.id === deptId);

    if (!deptItem) {
        showToast('Department not found', 'error');
        return;
    }

    if (action === 'viewdept') {
        alert(`${deptItem.name} Department Details:\n\nHead: ${deptItem.head}\nTeachers: ${deptItem.totalTeachers}\nSubjects: ${deptItem.subjects}\nEmail: ${deptItem.email}\nPhone: ${deptItem.phone}`);
    } else if (action === 'editdept') {
        openFormModal(`Edit ${deptItem.name} Department`, 'department', deptId);
    }
}


function handleEdit(e) {
    e.preventDefault();
    showToast('Edit functionality would open the record for editing', 'info');
}

function handleDelete(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this record?')) {
        e.target.closest('tr').remove();
        showToast('Record deleted successfully!', 'success');
    }
}

// ===========================
// SEARCH AND FILTER
// ===========================

function setupSearchAndFilters() {
    // Student Search
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', filterStudents);
    }

    // Teacher Search
    const teacherSearch = document.getElementById('teacherSearch');
    if (teacherSearch) {
        teacherSearch.addEventListener('input', filterTeachers);
    }

    // Class Filter
    const classFilter = document.getElementById('classFilter');
    if (classFilter) {
        classFilter.addEventListener('change', filterStudents);
    }

    // Status Filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterStudents);
    }

    // Department Filter
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterTeachers);
    }

    // Grade Filters
    const gradeClassFilter = document.getElementById('gradeClassFilter');
    if (gradeClassFilter) {
        gradeClassFilter.addEventListener('change', filterGrades);
    }

    const examFilter = document.getElementById('examFilter');
    if (examFilter) {
        examFilter.addEventListener('change', filterGrades);
    }

    // Book Search
    const bookSearch = document.getElementById('bookSearch');
    if (bookSearch) {
        bookSearch.addEventListener('input', filterBooks);
    }

    // Category Filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterBooks);
    }
}

function filterStudents() {
    const searchTerm = (document.getElementById('studentSearch')?.value || '').toLowerCase();
    const classFilter = document.getElementById('classFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    const rows = document.querySelectorAll('#studentsTableBody tr');
    
    rows.forEach(row => {
        const name = row.cells[1]?.textContent.toLowerCase() || '';
        const rowClass = row.cells[2]?.textContent || '';
        const status = row.cells[5]?.textContent.toLowerCase() || '';
        
        const matchesSearch = name.includes(searchTerm);
        const matchesClass = !classFilter || rowClass === classFilter;
        const matchesStatus = !statusFilter || status.includes(statusFilter);
        
        row.style.display = matchesSearch && matchesClass && matchesStatus ? '' : 'none';
    });
}

function filterTeachers() {
    const searchTerm = (document.getElementById('teacherSearch')?.value || '').toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter')?.value || '';
    
    const rows = document.querySelectorAll('#teachersTableBody tr');
    
    rows.forEach(row => {
        const name = row.cells[1]?.textContent.toLowerCase() || '';
        const department = row.cells[2]?.textContent || '';
        
        const matchesSearch = name.includes(searchTerm);
        const matchesDepartment = !departmentFilter || department === departmentFilter;
        
        row.style.display = matchesSearch && matchesDepartment ? '' : 'none';
    });
}

function filterGrades() {
    const classFilter = document.getElementById('gradeClassFilter')?.value || '';
    const examFilter = document.getElementById('examFilter')?.value || '';
    
    const rows = document.querySelectorAll('#gradesTableBody tr');
    
    rows.forEach(row => {
        const rowClass = row.cells[2]?.textContent || '';
        const exam = row.cells[4]?.textContent || '';
        
        const matchesClass = !classFilter || rowClass === classFilter;
        const matchesExam = !examFilter || exam.toLowerCase().includes(examFilter.toLowerCase());
        
        row.style.display = matchesClass && matchesExam ? '' : 'none';
    });
}

function filterBooks() {
    const searchTerm = (document.getElementById('bookSearch')?.value || '').toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    
    const rows = document.querySelectorAll('#libraryTableBody tr');
    
    rows.forEach(row => {
        const title = row.cells[1]?.textContent.toLowerCase() || '';
        const category = row.cells[3]?.textContent || '';
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = !categoryFilter || category.toLowerCase() === categoryFilter.toLowerCase();
        
        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

// ===========================
// ATTENDANCE CONTROLS
// ===========================

function setupAttendanceControls() {
    const attendanceDate = document.getElementById('attendanceDate');
    if (attendanceDate) {
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        attendanceDate.value = today;
    }

    // Attendance save button
    const saveButtons = document.querySelectorAll('.attendance-actions .btn-primary');
    saveButtons.forEach(btn => {
        if (btn.textContent.includes('Save')) {
            btn.addEventListener('click', saveAttendance);
        }
    });

    // Reset button
    const resetButtons = document.querySelectorAll('.attendance-actions .btn-secondary');
    resetButtons.forEach(btn => {
        if (btn.textContent.includes('Reset')) {
            btn.addEventListener('click', resetAttendance);
        }
    });
}

function saveAttendance() {
    const date = document.getElementById('attendanceDate')?.value;
    const classSelected = document.getElementById('attendanceClass')?.value;
    
    if (!date || !classSelected) {
        showToast('Please select date and class!', 'error');
        return;
    }
    
    showToast(`Attendance saved for ${classSelected} on ${date}!`, 'success');
}

function resetAttendance() {
    const selects = document.querySelectorAll('.attendance-status');
    selects.forEach(select => {
        select.value = 'present';
    });
    
    const inputs = document.querySelectorAll('.attendance-table-section input');
    inputs.forEach(input => {
        input.value = '';
    });
    
    showToast('Attendance form reset!', 'info');
}

// ===========================
// SETTINGS CONTROLS
// ===========================

function setupSettingsControls() {
    const saveButtons = document.querySelectorAll('.settings-actions .btn-primary');
    saveButtons.forEach(btn => {
        if (btn.textContent.includes('Save')) {
            btn.addEventListener('click', saveSettings);
        }
    });

    const cancelButtons = document.querySelectorAll('.settings-actions .btn-secondary');
    cancelButtons.forEach(btn => {
        if (btn.textContent.includes('Cancel')) {
            btn.addEventListener('click', resetSettings);
        }
    });
}

function saveSettings() {
    showToast('Settings saved successfully!', 'success');
}

function resetSettings() {
    showToast('Settings reset!', 'info');
}

// ===========================
// CHARTS INITIALIZATION
// ===========================

function initializeCharts() {
    const attendanceChart = document.getElementById('attendanceChart');
    const gradesChart = document.getElementById('gradesChart');

    if (attendanceChart) {
        drawAttendanceChart(attendanceChart);
    }

    if (gradesChart) {
        drawGradesChart(gradesChart);
    }
}

function drawAttendanceChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Simple bar chart for attendance
    const data = [
        { label: 'Mon', value: 95, color: '#667eea' },
        { label: 'Tue', value: 92, color: '#764ba2' },
        { label: 'Wed', value: 88, color: '#f093fb' },
        { label: 'Thu', value: 94, color: '#f5576c' },
        { label: 'Fri', value: 90, color: '#4facfe' }
    ];

    const barWidth = width / (data.length * 2);
    const maxValue = 100;
    const scale = height / maxValue;

    ctx.clearRect(0, 0, width, height);

    data.forEach((item, index) => {
        const x = (index * 2 + 1) * barWidth;
        const barHeight = item.value * scale;
        const y = height - barHeight;

        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);

        // Draw label
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth * 0.4, height + 15);

        // Draw value
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(item.value + '%', x + barWidth * 0.4, y - 5);
    });
}

function drawGradesChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Simple pie chart for grades
    const data = [
        { label: 'A+', value: 15, color: '#10b981' },
        { label: 'A', value: 25, color: '#3b82f6' },
        { label: 'B', value: 35, color: '#f59e0b' },
        { label: 'C', value: 20, color: '#ef4444' },
        { label: 'D', value: 5, color: '#8b5cf6' }
    ];

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    let currentAngle = -Math.PI / 2;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    ctx.clearRect(0, 0, width, height);

    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * Math.PI * 2;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, labelX, labelY);

        currentAngle += sliceAngle;
    });

    // Draw legend
    let legendY = height - 60;
    data.forEach((item, index) => {
        ctx.fillStyle = item.color;
        ctx.fillRect(20, legendY + (index * 15), 12, 12);
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${item.label}: ${item.value}%`, 40, legendY + (index * 15) + 10);
    });
}

// ===========================
// TOAST NOTIFICATION
// ===========================

function showToast(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        // Change icon and color based on type
        const icon = toast.querySelector('i');
        if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            toast.style.backgroundColor = '#ef4444';
        } else if (type === 'info') {
            icon.className = 'fas fa-info-circle';
            toast.style.backgroundColor = '#3b82f6';
        } else {
            icon.className = 'fas fa-check-circle';
            toast.style.backgroundColor = '#10b981';
        }

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ===========================
// KEYBOARD SHORTCUTS
// ===========================

document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closeFormModal();
    }

    // Quick navigation with Ctrl + number
    if (e.ctrlKey) {
        const pages = ['dashboard', 'students', 'teachers', 'classes', 'attendance', 'grades', 'timetable', 'events', 'finance', 'library', 'notices', 'settings'];
        const pageNum = parseInt(e.key) - 1;
        if (pageNum >= 0 && pageNum < pages.length) {
            navigateToPage(pages[pageNum]);
        }
    }
});

// ===========================
// RESPONSIVE ADJUSTMENTS
// ===========================

window.addEventListener('resize', function() {
    // Redraw charts on resize
    const attendanceChart = document.getElementById('attendanceChart');
    const gradesChart = document.getElementById('gradesChart');

    if (attendanceChart) {
        drawAttendanceChart(attendanceChart);
    }

    if (gradesChart) {
        drawGradesChart(gradesChart);
    }
});

// ===========================
// LOCAL STORAGE MANAGEMENT
// ===========================

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// ===========================
// EXPORT FUNCTIONS (for future use)
// ===========================

function exportToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        cols.forEach(col => {
            csvRow.push('"' + col.textContent.trim() + '"');
        });
        csv.push(csvRow.join(','));
    });

    downloadCSV(csv.join('\n'), filename);
}

function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// ===========================
// PRINT FUNCTIONALITY
// ===========================

function printPage() {
    window.print();
}

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search functions
const debouncedFilterStudents = debounce(filterStudents, 300);
const debouncedFilterTeachers = debounce(filterTeachers, 300);
const debouncedFilterBooks = debounce(filterBooks, 300);

// ===========================
// FORM VALIDATION
// ===========================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
}

// ===========================
// ACCESSIBILITY ENHANCEMENTS
// ===========================

// Add ARIA labels and roles
document.addEventListener('DOMContentLoaded', function() {
    // Add role to main sections
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.setAttribute('role', 'navigation');

    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.setAttribute('role', 'main');

    // Add aria-labels to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
});

// ===========================
// INITIALIZATION COMPLETE
// ===========================

console.log('School Management System initialized successfully!');
