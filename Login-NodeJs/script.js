// Fix the typo here (from "registerFrom" to "registerForm")
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent the form from being submitted normally
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    const response = await fetch('/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    console.log(data);  // Check what data is returned from the server
    if (data.success) {
        alert("Registration successful!");
        console.log("Redirecting to login...");
        window.location.href = "login.html";  // Redirect to login page
    } else {
        alert("Error: " + data.message);
    }
});

// The second part for login seems fine, but just ensure the form ID is correct in your HTML as well
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log(data);  // Check what data is returned from the server
    if (data.success) {
        alert("Login successful!");
        console.log("Redirecting to welcome...");
        window.location.href = "welcome.html";  // Redirect to welcome page
    } else {
        alert("Error: " + data.message);
    }
});
