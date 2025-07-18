async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://localhost:8612/login", {  
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        console.log("Raw Response:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Login API Response:", result);  // Debugging output

        if (result.success) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", result.username);
            localStorage.setItem("userid", result.userid);
            console.log("UserID Stored:", localStorage.getItem("userid"));
            window.location.href = "head.html";
        } else {
            document.getElementById("login-error").textContent = result.message;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

async function signup() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        document.getElementById("signup-error").textContent = "Passwords do not match!";
        return;
    }

    const response = await fetch("http://localhost:8612/signup", {  // Updated URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
    } else {
        document.getElementById("signup-error").textContent = result.message;
    }
}
