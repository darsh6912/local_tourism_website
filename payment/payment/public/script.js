document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("pay-button").disabled = true;

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", validateForm);
    });
});

function showDetails(method) {
    if (!validateForm()) {
        alert("❌ Please fill all personal details before selecting a payment method.");
        return;
    }

    let details = document.getElementById("payment-details");
    let content = "";

    document.querySelectorAll(".payment-option").forEach(el => el.classList.remove("selected"));
    event.target.classList.add("selected");

    document.getElementById("selectedPaymentMethod").value = method;

    if (method === "card") {
        content = `
            <h3>💳 Card Payment</h3>
            <input type='text' id='cardNumber' placeholder='Card Number (16 digits)' required>
            <span id="cardError" class="error"></span>
            <input type='text' id='expiryDate' placeholder='MM/YY' required>
            <span id="expiryError" class="error"></span>
            <input type='password' id='cvv' placeholder='CVV (3 digits)' required>
            <span id="cvvError" class="error"></span>
        `;
    } else if (method === "netbanking") {
        content = `
            <h3>🏦 Net Banking</h3>
            <input type='text' id='bankName' placeholder='Bank Name' required>
            <span id="bankError" class="error"></span>
            <input type='text' id='userID' placeholder='User ID' required>
            <span id="userError" class="error"></span>
            <input type='password' id='password' placeholder='Password' required>
        `;
    } else if (method === "wallet") {
        content = `
            <h3>📱 Digital Wallet</h3>
            <input type='text' id='walletProvider' placeholder='Wallet Provider' required>
            <span id="walletError" class="error"></span>
            <input type='text' id='upiId' placeholder='UPI ID (e.g., user@upi)' required>
            <span id="upiError" class="error"></span>
            <input type='text' id='mobileNumber' placeholder='Registered Mobile Number (10 digits)' required>
            <span id="mobileError" class="error"></span>
            <input type='password' id='walletPassword' placeholder='Wallet Password' required>
        `;
    }

    details.innerHTML = content;
    details.style.display = "block";

    document.querySelectorAll("#payment-details input").forEach(input => {
        input.addEventListener("input", validateForm);
    });

    validateForm();
}

function validateForm() {
    let isValid = true;

    function showError(id, message) {
        let errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (message) isValid = false;
    }

    // Personal details validation
    const name = document.getElementById("name")?.value.trim();
    showError("nameError", /^[A-Za-z\s]{3,}$/.test(name) ? "" : "❌ Name must contain only alphabets (min 3 chars)!");

    const phone = document.getElementById("phone")?.value.trim();
    showError("phoneError", /^\d{10}$/.test(phone) ? "" : "❌ Enter a valid 10-digit phone number!");

    const email = document.getElementById("email")?.value.trim();
    showError("emailError", /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email) ? "" : "❌ Enter a valid Gmail address!");

    const date = document.getElementById("date")?.value.trim();
    const today = new Date().toISOString().split("T")[0];
    showError("dateError", date >= today ? "" : "❌ Date cannot be in the past!");

    // Get selected payment method
    const selectedMethod = document.getElementById("selectedPaymentMethod")?.value;

    if (selectedMethod === "card") {
        const cardNumber = document.getElementById("cardNumber")?.value.trim();
        showError("cardError", /^\d{16}$/.test(cardNumber) ? "" : "❌ Enter a valid 16-digit card number!");

        const expiryDate = document.getElementById("expiryDate")?.value.trim();
        showError("expiryError", /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate) ? "" : "❌ Format: MM/YY");

        const [month, year] = expiryDate.split("/");
        const expiryValid = new Date(`20${year}`, month) > new Date();
        showError("expiryError", expiryValid ? "" : "❌ Expiry date must be in the future!");

        const cvv = document.getElementById("cvv")?.value.trim();
        showError("cvvError", /^\d{3}$/.test(cvv) ? "" : "❌ CVV must be 3 digits!");
    } 

    else if (selectedMethod === "netbanking") {
        const bankName = document.getElementById("bankName")?.value.trim();
        showError("bankError", /^[A-Za-z\s]{3,}$/.test(bankName) ? "" : "❌ Enter a valid bank name!");

        const userID = document.getElementById("userID")?.value.trim();
        showError("userError", /^[a-zA-Z0-9]{4,}$/.test(userID) ? "" : "❌ User ID must be at least 4 characters!");
    } 

    else if (selectedMethod === "wallet") {
        const walletProvider = document.getElementById("walletProvider")?.value.trim();
        showError("walletError", /^[A-Za-z\s]{3,}$/.test(walletProvider) ? "" : "❌ Enter a valid wallet provider!");

        const upiId = document.getElementById("upiId")?.value.trim();
        showError("upiError", /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+$/.test(upiId) ? "" : "❌ Enter a valid UPI ID (e.g., user@upi)!");

        const mobileNumber = document.getElementById("mobileNumber")?.value.trim();
        showError("mobileError", /^\d{10}$/.test(mobileNumber) ? "" : "❌ Enter a valid 10-digit mobile number!");
    }

    document.getElementById("pay-button").disabled = !isValid;
    return isValid;
}

async function submitPayment() {
    if (!validateForm()) {
        alert("❌ Please fill all fields correctly!");
        return;
    }

    const paymentData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        date: document.getElementById("date").value,
        paymentMethod: document.getElementById("selectedPaymentMethod").value
    };

    try {
        const response = await fetch("http://localhost:8617/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData)
        });

        alert(response.ok ? "✅ Payment submitted successfully!" : "❌ Payment submission failed!");
    } catch (error) {
        alert("❌ Error submitting payment!");
    }
}

function resetForm() {
    location.reload();
}
