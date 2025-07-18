document.addEventListener('DOMContentLoaded', function () {
    const searchIcon = document.querySelector('label[for="search-box"] i');
    const searchInput = document.getElementById('search-box');
  
    searchIcon.addEventListener('click', function () {
      const searchTerm = searchInput.value.trim();
      if (searchTerm !== '') {
        // Perform search action, e.g., redirect to search results page
        window.location.href = `search-results.html?query=${searchTerm}`;
      }
    });
  });
  
  function showVegRestaurants() {
    const vegRestaurants = document.querySelector('.veg-restaurants');
    if (vegRestaurants.style.display === 'none') {
      vegRestaurants.style.display = 'block';
    } else {
      vegRestaurants.style.display = 'none';
    }
  }
  