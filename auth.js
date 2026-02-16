// Authentication Logic

// Show signup form
function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

// Show login form
function showLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success message
        showMessage('success', 'Login successful! Redirecting...');
        
        // Redirect to heatmap
        setTimeout(() => {
            window.location.href = 'heatmap.html';
        }, 1000);
    } else {
        showMessage('error', 'Invalid email or password');
    }
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const favoriteCrypto = document.getElementById('favorite-crypto').value;
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showMessage('error', 'Email already registered');
        return;
    }
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        showMessage('error', 'Username already taken');
        return;
    }
    
    // Create new user
    const newUser = {
        username,
        email,
        password,
        favoriteCrypto,
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Show success message
    showMessage('success', 'Account created! Redirecting...');
    
    // Redirect to heatmap
    setTimeout(() => {
        window.location.href = 'heatmap.html';
    }, 1000);
}

// Show message
function showMessage(type, text) {
    // Remove existing messages
    const existing = document.querySelector('.success-message, .error-message');
    if (existing) {
        existing.remove();
    }
    
    // Create message element
    const message = document.createElement('div');
    message.className = type === 'success' ? 'success-message' : 'error-message';
    message.textContent = text;
    
    // Insert at top of active form
    const activeForm = document.querySelector('.auth-form:not(.hidden)');
    activeForm.insertBefore(message, activeForm.firstChild);
    
    // Auto-remove error messages after 3 seconds
    if (type === 'error') {
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // User is logged in, show option to go to heatmap
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = 'You are already logged in. <a href="heatmap.html" style="color: #00d4ff; text-decoration: underline;">Go to Heatmap</a>';
        
        const activeForm = document.querySelector('.auth-form:not(.hidden)');
        if (activeForm) {
            activeForm.insertBefore(message, activeForm.firstChild);
        }
    }
});
