document.addEventListener("DOMContentLoaded", function () {
    loadHotelDetails();
});

// Function to get hotel ID from URL
function getHotelIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// Function to load hotel details
async function loadHotelDetails() {
    const hotelId = getHotelIdFromURL();

    if (!hotelId) {
        document.getElementById("hotel-details").innerHTML = "<p>Hotel not found.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5500/api/hotels/${hotelId}`);
        const hotel = await response.json();

        document.getElementById("hotel-details").innerHTML = `
            <div class="hotel-info">
                <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image">
                <h1>${hotel.name}</h1>
                <p><strong>Location:</strong> ${hotel.location}</p>
                <p>${hotel.description || "No description available."}</p>
                <h3>Amenities</h3>
                <ol>${hotel.amenities ? hotel.amenities.map(a => `<li>${a}</li>`).join("") : "<li>No amenities listed.</li>"}</ol>
                <p><strong>Available Rooms:</strong> ${hotel.availableRooms}</p>
            </div>
        `;

        initMap(hotel.lat, hotel.lng);
        document.getElementById("book-now").href = `booking.html?id=${hotelId}`;
    } catch (error) {
        console.error("Error fetching hotel details:", error);
    }
}

// Function to initialize Google Maps
function initMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById("google-map"), {
        center: { lat: lat, lng: lng },
        zoom: 15
    });

    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: "Hotel Location"
    });
}

// Check availability
document.getElementById("availability-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const hotelId = getHotelIdFromURL();
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;

    try {
        const response = await fetch(`http://localhost:5500/api/hotels/${hotelId}/availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkin, checkout, adults, children })
        });

        const data = await response.json();
        const statusDiv = document.getElementById("availability-status");

        if (!statusDiv) {
            const div = document.createElement("div");
            div.id = "availability-status";
            document.querySelector(".availability-form").appendChild(div);
        }

        if (data.available) {
            statusDiv.innerHTML = `<p class="text-success">Rooms are available!</p>`;
            document.getElementById("book-now").style.display = "block"; // Show Book Now button
        } else {
            statusDiv.innerHTML = `<p class="text-danger">No rooms available for selected dates.</p>`;
            document.getElementById("book-now").style.display = "none"; // Hide Book Now button
        }
    } catch (error) {
        console.error("Error checking availability:", error);
    }
});

// Booking functionality
document.getElementById("book-now").addEventListener("click", async function () {
    const hotelId = getHotelIdFromURL();

    try {
        const response = await fetch(`http://localhost:5500/api/hotels/${hotelId}/book`, {
            method: "POST"
        });

        const data = await response.json();

        if (data.success) {
            alert("Booking successful! Room reserved.");
            location.reload(); // Refresh page to update availability
        } else {
            alert("No rooms available!");
        }
    } catch (error) {
        console.error("Error booking hotel:", error);
    }
});
