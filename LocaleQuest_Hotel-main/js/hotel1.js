document.addEventListener("DOMContentLoaded", function () {
    fetchHotels();
});

// Fetch hotels from MongoDB
async function fetchHotels() {
    try {
        const response = await fetch("http://localhost:5500/api/hotels");
        const hotels = await response.json();

        let hotelList = document.getElementById("hotel-list");
        hotelList.innerHTML = ""; // Clear existing content

        hotels.forEach(hotel => {
            let hotelCard = document.createElement("div");
            hotelCard.classList.add("hotel-card");

            hotelCard.innerHTML = `
                <img src="${hotel.image}" alt="${hotel.name}">
                <h3>${hotel.name}</h3>
                <p>Location: ${hotel.location}</p>
                <a href="hotels.html?id=${hotel._id}" class="view-details">View Details</a>
            `;

            hotelList.appendChild(hotelCard);
        });

    } catch (error) {
        console.error("Error fetching hotels:", error);
    }
}

// Search Filter Function
function filterHotels() {
    let searchValue = document.getElementById("search").value.toLowerCase().trim();
    
    let hotelCards = document.querySelectorAll(".hotel-card");
    hotelCards.forEach(card => {
        let name = card.querySelector("h3").innerText.toLowerCase();
        let location = card.querySelector("p").innerText.toLowerCase();

        if (name.includes(searchValue) || location.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
