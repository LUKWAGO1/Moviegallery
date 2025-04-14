import './style.css';

// Function to handle setting user preferences
function setupPreferences() {
  const preferencesButton = document.querySelector('#set-preferences');
  preferencesButton.addEventListener('click', () => {
    alert('Preferences setup coming soon!');
  });
}

// Function to handle search functionality
function setupSearch() {
  const searchButton = document.querySelector('#search-button');
  const searchInput = document.querySelector('#search-input');
  searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query.trim() === '') {
      alert('Please enter a search term.');
      return;
    }
    alert(`Searching for: ${query}`);
    // API integration for search will go here
  });
}

// Function to load trending content
function loadTrendingContent() {
  const trendingContent = document.querySelector('#trending-content');
  trendingContent.innerHTML = '<p>Loading trending content...</p>';
  // Simulate API call
  setTimeout(() => {
    trendingContent.innerHTML = `
      <div>Trending Movie 1</div>
      <div>Trending Movie 2</div>
      <div>Trending Movie 3</div>
    `;
  }, 1000);
}

// Function to load watchlist content
function loadWatchlistContent() {
  const watchlistContent = document.querySelector('#watchlist-content');
  watchlistContent.innerHTML = '<p>Your watchlist is empty.</p>';
  // Logic to dynamically load watchlist items will go here
}

// Initialize the app
function initializeApp() {
  setupPreferences();
  setupSearch();
  loadTrendingContent();
  loadWatchlistContent();
}

initializeApp();
