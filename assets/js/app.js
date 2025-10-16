// Platform detection
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gridiron Intel Landing Page Loaded');
    
    // Detect user's platform
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) {
        console.log('Android device detected');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        console.log('iOS device detected');
    } else if (userAgent.includes('linux')) {
        console.log('Linux system detected');
    } else if (userAgent.includes('windows')) {
        console.log('Windows system detected');
    }
});// Add to your app.js or create auth.js

// API Configuration
const API_URL = 'https://api.gridironintel.com'; // Replace with your actual API URL
// For testing: const API_URL = 'http://localhost:8000';

// Login Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    clearForms();
}

// Tab Switching
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(f => {
        f.classList.remove('active');
    });
    
    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('signupForm').classList.add('active');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.querySelector('.btn-text').style.display = 'none';
    loginBtn.querySelector('.btn-loader').style.display = 'inline';
    
    // Hide previous messages
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('loginSuccess').style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                remember_me: rememberMe
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store tokens
            localStorage.setItem('access_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('refresh_token', data.refresh_token);
            }
            
            // Store user info
            localStorage.setItem('user_info', JSON.stringify(data.user_info));
            
            // Show success message
            const successMsg = document.getElementById('loginSuccess');
            successMsg.textContent = `Welcome back, ${data.user_info.name}! Redirecting...`;
            successMsg.style.display = 'block';
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = data.redirect_url || 'https://app.gridironintel.com';
            }, 2000);
            
        } else {
            // Show error
            const errorMsg = document.getElementById('loginError');
            errorMsg.textContent = data.detail || 'Login failed. Please try again.';
            errorMsg.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        const errorMsg = document.getElementById('loginError');
        errorMsg.textContent = 'Connection error. Please check your internet and try again.';
        errorMsg.style.display = 'block';
    } finally {
        // Reset button
        loginBtn.disabled = false;
        loginBtn.querySelector('.btn-text').style.display = 'inline';
        loginBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const schoolName = document.getElementById('schoolName').value;
    const teamName = document.getElementById('teamName').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        const errorMsg = document.getElementById('signupError');
        errorMsg.textContent = 'Passwords do not match!';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Show loading
    const signupBtn = document.getElementById('signupBtn');
    signupBtn.disabled = true;
    signupBtn.querySelector('.btn-text').style.display = 'none';
    signupBtn.querySelector('.btn-loader').style.display = 'inline';
    
    // Hide previous messages
    document.getElementById('signupError').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/api/auth/signup/coach`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                school_name: schoolName,
                team_name: teamName,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token
            localStorage.setItem('access_token', data.access_token);
            
            // Show success
            const successMsg = document.getElementById('signupSuccess');
            successMsg.textContent = 'Account created successfully! Redirecting to setup...';
            successMsg.style.display = 'block';
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = data.redirect_url || 'https://app.gridironintel.com/coach/onboarding';
            }, 2000);
            
        } else {
            const errorMsg = document.getElementById('signupError');
            errorMsg.textContent = data.detail || 'Signup failed. Please try again.';
            errorMsg.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        const errorMsg = document.getElementById('signupError');
        errorMsg.textContent = 'Connection error. Please check your internet and try again.';
        errorMsg.style.display = 'block';
    } finally {
        // Reset button
        signupBtn.disabled = false;
        signupBtn.querySelector('.btn-text').style.display = 'inline';
        signupBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('access_token');
    
    if (token) {
        // Validate token
        fetch(`${API_URL}/api/auth/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                // Update UI to show logged in state
                updateUIForLoggedInUser(data);
            } else {
                // Clear invalid token
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_info');
            }
        })
        .catch(error => {
            console.error('Token validation error:', error);
        });
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(userData) {
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = navLinks.querySelector('.btn-nav');
    
    if (loginBtn) {
        loginBtn.innerHTML = `
            <i class="fas fa-user"></i> 
            ${userData.email.split('@')[0]}
        `;
        loginBtn.onclick = () => {
            window.location.href = userData.role.includes('coach') 
                ? 'https://app.gridironintel.com/coach/dashboard'
                : 'https://app.gridironintel.com/player/dashboard';
        };
        
        // Add logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-nav-secondary';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.onclick = handleLogout;
        navLinks.appendChild(logoutBtn);
    }
}

// Handle Logout
function handleLogout() {
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    
    // Reload page
    window.location.reload();
}

// Clear forms
function clearForms() {
    document.querySelectorAll('input').forEach(input => {
        if (input.type !== 'checkbox') {
            input.value = '';
        } else {
            input.checked = false;
        }
    });
    
    // Hide all messages
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.style.display = 'none';
    });
}

// Forgot Password
function showForgotPassword() {
    const email = prompt('Enter your email address:');
    
    if (email) {
        fetch(`${API_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            alert('If an account exists with this email, you will receive password reset instructions.');
        })
        .catch(error => {
            alert('Error sending reset email. Please try again.');
        });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});
