// Initialize Supabase client
const supabaseUrl = 'https://xgdmlrnhazfgutlyrbwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG1scm5oYXpmZ3V0bHlyYnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMzg4OTEsImV4cCI6MjA1MTgxNDg5MX0.yFFcEazsR-pUPdWExcN7rAjI5xU5d_GMsB8RDQeC998';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Show loading state
function showLoading(form) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.innerHTML = 'Loading...';
}

// Hide loading state
function hideLoading(form, originalText = 'Submit') {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = false;
    button.innerHTML = originalText;
}

// Sign Up function
async function signUp(email, password, username) {
    const form = document.getElementById('signupForm');
    showLoading(form);

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) throw error;

        alert('Registration successful! Please check your email to verify your account.');
        window.location.href = 'signin.html';
        return { data, error: null };
    } catch (error) {
        hideLoading(form, 'Create Account');
        alert(error.message);
        return { data: null, error: error.message };
    }
}

// Sign In function
async function signIn(email, password) {
    const form = document.getElementById('signinForm');
    showLoading(form);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        window.location.href = 'dashboard.html';
        return { data, error: null };
    } catch (error) {
        hideLoading(form, 'Sign In');
        alert(error.message);
        return { data: null, error: error.message };
    }
}

// Sign Out function
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        window.location.href = 'index.html';
        return { error: null };
    } catch (error) {
        alert(error.message);
        return { error: error.message };
    }
}

// Reset Password function
async function resetPassword(email) {
    const form = document.getElementById('resetForm');
    showLoading(form);

    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });

        if (error) throw error;
        
        alert('Password reset instructions have been sent to your email.');
        hideLoading(form, 'Send Reset Link');
        return { data, error: null };
    } catch (error) {
        hideLoading(form, 'Send Reset Link');
        alert(error.message);
        return { data: null, error: error.message };
    }
}

// Check if user is authenticated
async function checkAuth() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        // If no session exists and we're on a protected page, redirect to sign in
        if (!session && window.location.pathname.includes('dashboard')) {
            window.location.href = 'signin.html';
            return false;
        }

        // If session exists and we're on auth pages, redirect to dashboard
        if (session && (
            window.location.pathname.includes('signin.html') ||
            window.location.pathname.includes('signup.html')
        )) {
            window.location.href = 'dashboard.html';
            return true;
        }

        return !!session;
    } catch (error) {
        console.error('Error checking auth status:', error.message);
        return false;
    }
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuth();
    
    // Update UI based on auth state
    const authButtons = document.querySelectorAll('[data-auth-required]');
    authButtons.forEach(button => {
        button.style.display = isAuthenticated ? 'block' : 'none';
    });

    // Add sign out button event listener if it exists
    const signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }
});

// Export functions for use in other files
window.yaGlobAuth = {
    signUp,
    signIn,
    signOut,
    resetPassword,
    checkAuth
};
