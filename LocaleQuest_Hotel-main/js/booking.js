document.addEventListener("DOMContentLoaded", function () {
    loadBookingDetails();
});

// Function to get hotel ID from URL
function getHotelIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// Function to load booking details
async function loadBookingDetails() {
    const hotelId = getHotelIdFromURL();

    if (!hotelId) {
        document.getElementById("booking-details").innerHTML = "<p>Hotel not found.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5500/api/hotels/${hotelId}`);
        const hotel = await response.json();

        // Inject hotel details into the page
        document.getElementById("booking-details").innerHTML = `
            <h2>${hotel.name}</h2>
            <p><strong>Location:</strong> ${hotel.location}</p>
            <p><strong>Rooms Available:</strong> <span id="rooms-available">${hotel.roomsAvailable}</span></p>
            <label>Check-in:</label>
            <input type="date" id="checkin" required>
            <label>Check-out:</label>
            <input type="date" id="checkout" required>
            <label>Adults:</label>
            <input type="number" id="adults" min="1" value="1">
            <label>Children:</label>
            <input type="number" id="children" min="0" value="0">
            <button id="check-availability" class="btn btn-primary mt-3">Check Availability</button>
            <p id="availability-status"></p>
            <button id="confirm-booking" class="btn btn-success mt-3" style="display:none;">Confirm Booking</button>
        `;

        // Attach event listener for checking availability
        document.getElementById("check-availability").addEventListener("click", () => checkAvailability(hotel));
    } catch (error) {
        console.error("Error loading booking details:", error);
    }
}
// Function to check room availability
async function checkAvailability(hotel) {
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const adults = parseInt(document.getElementById("adults").value);

    if (!checkin || !checkout) {
        alert("Please select check-in and check-out dates.");
        return;
    }

    const requiredRooms = Math.ceil(adults / 4); // 1 room per 4 adults

    console.log("Hotel Data:", hotel); // Debugging - Check hotel details
    console.log("Rooms Available:", hotel.roomsAvailable, "Required Rooms:", requiredRooms); // Debugging

    if (!hotel.roomsAvailable || hotel.roomsAvailable < requiredRooms) {
        document.getElementById("availability-status").innerHTML = 
            `<p class="text-danger">Not enough rooms available! (${requiredRooms} room(s) required)</p>`;
        document.getElementById("confirm-booking").style.display = "none";
    } else {
        document.getElementById("availability-status").innerHTML = 
            `<p class="text-success">Rooms available! (${requiredRooms} room(s) required)</p>`;
        document.getElementById("confirm-booking").style.display = "block";

        document.getElementById("confirm-booking").onclick = () => bookHotel(hotel._id, requiredRooms);
    }
}


// Function to book a hotel room
async function bookHotel(hotelId, requiredRooms) {
    try {
        const response = await fetch(`http://localhost:5500/api/hotels/${hotelId}/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomsToBook: requiredRooms })
        });

        const data = await response.json();

        if (data.success) {
            alert(`Booking confirmed! You have booked ${requiredRooms} room(s).`);
            document.getElementById("rooms-available").textContent -= requiredRooms;
            location.reload();
        } else {
            alert("Navigating to confirmation page");
        }
    } catch (error) {
        console.error("Error booking hotel:", error);
    }
}

/*document.addEventListener("DOMContentLoaded", async function () {
    loadBookingDetails();
});

// Function to get hotel ID from URL
function getHotelIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// Function to load hotel details for booking
async function loadBookingDetails() {
    const hotelId = getHotelIdFromURL();

    if (!hotelId) {
        document.getElementById("booking-details").innerHTML = "<p>Invalid hotel selection.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5500/api/hotels/${hotelId}`);
        const hotel = await response.json();

        document.getElementById("booking-details").innerHTML = `
            <h2>${hotel.name}</h2>
            <img src="${hotel.image}" alt="${hotel.name}" class="hotel-img">
            <p><strong>Location:</strong> ${hotel.location}</p>
            <p>${hotel.description}</p>
            <p><strong>Amenities:</strong> ${hotel.amenities.join(", ")}</p>
            <p><strong>Rooms Available:</strong> <span id="rooms-available">${hotel.roomsAvailable}</span></p>
        `;
    } catch (error) {
        console.error("Error loading hotel details:", error);
    }
}

// Handle booking confirmation
document.getElementById("confirm-booking").addEventListener("click", async () => {
    const hotelId = getHotelIdFromURL();
    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;
    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;

    if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out dates.");
        return;
    }

    try {
        // Check room availability before booking
        const checkResponse = await fetch(`http://localhost:5500/api/hotels/${hotelId}/availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkin: checkIn, checkout: checkOut, adults, children })
        });

        const checkData = await checkResponse.json();
        if (!checkData.available) {
            alert("No rooms available for the selected dates.");
            return;
        }

        // Proceed with booking
        const response = await fetch(`http://localhost:5500/api/hotels/${hotelId}/book`, {
            method: "POST"
        });

        const data = await response.json();

        if (data.success) {
            alert("Booking successful! Your room is reserved.");
            document.getElementById("rooms-available").textContent = parseInt(document.getElementById("rooms-available").textContent) - 1;
        } else {
            alert("Booking failed. No rooms available.");
        }
    } catch (error) {
        console.error("Error processing booking:", error);
    }
});
*/