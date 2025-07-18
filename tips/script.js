document.getElementById("searchButton").addEventListener("click", async () => {
  const place = document.getElementById("placeInput").value.trim();

  if (place === "") {
    alert("Please enter a place!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/places`);
    const data = await response.json();

    const tipsContainer = document.getElementById("tipsList");
    tipsContainer.innerHTML = ""; // Clear previous results

    // Find the place in the fetched data
    const placeData = data.find(item => item.place.toLowerCase() === place.toLowerCase());

    if (placeData && placeData.tips) {
      placeData.tips.forEach((tip) => {
        const listItem = document.createElement("li");
        listItem.textContent = tip;
        tipsContainer.appendChild(listItem);
      });
    } else {
      tipsContainer.innerHTML = "<p>No tips available for this place.</p>";
    }
  } catch (error) {
    console.error("Error fetching tips:", error);
  }
});
