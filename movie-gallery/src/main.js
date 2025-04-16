import './style.css';
import { getWatchlist, saveWatchlist, getPreferences, savePreferences } from './storage.js';

// TMDb API Key (replace with your actual API key)
const TMDB_API_KEY = '850dac749c0cef3ceb43f4a2a9ce4d5f';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// OMDb API Key (replace with your actual API key)
const OMDB_API_KEY = ' f315b07a';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Function to handle setting user preferences
function setupPreferences() {
  const preferencesButton = document.querySelector('#set-preferences');
  preferencesButton.addEventListener('click', () => {
    const preferences = prompt('Enter your favorite genres, actors, or directors (comma-separated):');
    if (preferences) {
      const preferencesArray = preferences.split(',').map(pref => pref.trim());
      savePreferences({ preferences: preferencesArray });
      alert('Preferences saved successfully!');
    }
  });
}

// Function to handle search functionality
function setupSearch() {
  const searchButton = document.querySelector('#search-button');
  const searchInput = document.querySelector('#search-input');
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert('Please enter a search term.');
      return;
    }
    const results = await searchMovies(query);
    displayMovies(results, '#trending-content');
  });
}

// Function to handle input event for search bar
function setupSearchInputEvent() {
  const searchInput = document.querySelector('#search-input');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
      searchInput.style.borderColor = '#3498db';
    } else {
      searchInput.style.borderColor = '#ddd';
    }
  });
}

// Function to handle keypress event for Enter key in search bar
function setupSearchKeypressEvent() {
  const searchInput = document.querySelector('#search-input');
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchButton = document.querySelector('#search-button');
      searchButton.click(); // Trigger the search button click event
    }
  });
}

// Function to search movies using TMDb API
async function searchMovies(query) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching search results:', error);
    alert('Failed to load search results. Please try again later.');
    return [];
  }
}

// Function to load trending content using TMDb API
async function loadTrendingContent() {
  const trendingContent = document.querySelector('#trending-content');
  trendingContent.innerHTML = '<p>Loading trending content...</p>';
  try {
    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayMovies(data.results, '#trending-content');
  } catch (error) {
    console.error('Error fetching trending content:', error);
    trendingContent.innerHTML = '<p>Failed to load trending content. Please try again later.</p>';
  }
}

// Function to display movies in a given container
function displayMovies(movies, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (!movies.length) {
    container.innerHTML = '<p>No movies found.</p>';
    return;
  }

  container.innerHTML = movies
    .map(movie => createMovieCard(movie))
    .join('');

  // Add event listeners for detailed view
  const movieCards = container.querySelectorAll('.movie-card');
  movieCards.forEach(card => {
    card.addEventListener('click', () => {
      const movieId = card.dataset.id;
      loadMovieDetails(movieId);
    });
  });

  setupCardHoverEffect();
  setupCardDoubleClickEvent();
}

// Function to create HTML for a movie card
function createMovieCard(movie) {
  const posterPath = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year';

  return `
    <div class="movie-card" data-id="${movie.id}">
      <img src="${posterPath}" alt="${movie.title} poster" />
      <h3>${movie.title}</h3>
      <p>${releaseYear}</p>
      <p>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
      <button class="watchlist-btn" onclick="addToWatchlist(${JSON.stringify(movie)})">Add to Watchlist</button>
      <button class="share-btn" onclick="shareRecommendation(${JSON.stringify(movie)})">Share</button>
    </div>
  `;
}

// Function to load detailed movie information using OMDb API
async function loadMovieDetails(movieId) {
  try {
    // Fetch movie details from TMDb API
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error(`TMDb API error! status: ${response.status}`);
    }
    const movieData = await response.json();

    // Check if imdb_id is available
    if (!movieData.imdb_id) {
      throw new Error('IMDB ID not found for this movie.');
    }

    // Fetch additional details from OMDb API using imdb_id
    const omdbResponse = await fetch(`${OMDB_BASE_URL}?i=${movieData.imdb_id}&apikey=${OMDB_API_KEY.trim()}`);
    if (!omdbResponse.ok) {
      throw new Error(`OMDb API error! status: ${omdbResponse.status}`);
    }
    const omdbData = await omdbResponse.json();

    // Fetch trailers from TMDb API
    const trailersResponse = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
    if (!trailersResponse.ok) {
      throw new Error(`Failed to fetch trailers. Status: ${trailersResponse.status}`);
    }
    const trailersData = await trailersResponse.json();
    const trailer = trailersData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    // Display detailed movie information with trailer
    displayMovieDetails({ ...movieData, ...omdbData, trailer });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    alert(`Failed to load movie details. ${error.message}`);
  }
}

// Function to display detailed movie information
function displayMovieDetails(movie) {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="movie-details">
      <img src="${movie.Poster || 'https://via.placeholder.com/500x750?text=No+Poster'}" alt="${movie.Title} poster" />
      <h2>${movie.Title}</h2>
      <p><strong>Release Date:</strong> ${movie.Released || 'N/A'}</p>
      <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
      <p><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
      <p><strong>Actors:</strong> ${movie.Actors || 'N/A'}</p>
      <p><strong>Plot:</strong> ${movie.Plot || 'N/A'}</p>
      <p><strong>IMDB Rating:</strong> ⭐ ${movie.imdbRating || 'N/A'}</p>
      ${movie.trailer ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${movie.trailer.key}" frameborder="0" allowfullscreen></iframe>` : ''}
      <button id="back-button">Back</button>
    </div>
  `;

  // Add event listener for back button
  const backButton = document.querySelector('#back-button');
  backButton.addEventListener('click', () => {
    initializeApp();
  });
}

// Function to load watchlist content
function loadWatchlistContent() {
  const watchlistContent = document.querySelector('#watchlist-content');
  const watchlist = getWatchlist();

  if (!watchlist.length) {
    watchlistContent.innerHTML = '<p>Your watchlist is empty.</p>';
    return;
  }

  displayMovies(watchlist, '#watchlist-content');
}

// Function to handle click event for clearing the watchlist
function setupClearWatchlistEvent() {
  const watchlistContent = document.querySelector('#watchlist-content');
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear Watchlist';
  clearButton.style.marginTop = '20px';
  clearButton.style.backgroundColor = '#e74c3c';
  clearButton.style.color = '#fff';
  clearButton.style.border = 'none';
  clearButton.style.padding = '10px 20px';
  clearButton.style.borderRadius = '5px';
  clearButton.style.cursor = 'pointer';
  clearButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your watchlist?')) {
      saveWatchlist([]);
      loadWatchlistContent();
    }
  });
  watchlistContent.parentElement.appendChild(clearButton);
}

// Function to load personalized suggestions based on user preferences
async function loadPersonalizedSuggestions() {
  const preferences = getPreferences();
  const genres = preferences.preferences || [];
  const suggestionsContent = document.querySelector('#suggestions-content');
  suggestionsContent.innerHTML = '<p>Loading personalized suggestions...</p>';

  if (!genres.length) {
    suggestionsContent.innerHTML = '<p>No preferences set. Please set your preferences to get personalized suggestions.</p>';
    return;
  }

  try {
    const genreQuery = genres.join(',');
    const response = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${encodeURIComponent(genreQuery)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayMovies(data.results, '#suggestions-content');
  } catch (error) {
    console.error('Error fetching personalized suggestions:', error);
    suggestionsContent.innerHTML = '<p>Failed to load personalized suggestions. Please try again later.</p>';
  }
}

// Function to add a movie to the watchlist
function addToWatchlist(movie) {
  const watchlist = getWatchlist();
  if (watchlist.some(item => item.id === movie.id)) {
    alert('This movie is already in your watchlist.');
    return;
  }
  watchlist.push(movie);
  saveWatchlist(watchlist);
  alert(`"${movie.title}" has been added to your watchlist.`);
  loadWatchlistContent();
}

// Function to share a movie recommendation
function shareRecommendation(movie) {
  const shareText = `Check out this movie: ${movie.title} (${movie.release_date}) - ${movie.overview}`;
  navigator.clipboard.writeText(shareText).then(() => {
    alert('Movie recommendation copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy recommendation:', err);
    alert('Failed to copy recommendation. Please try again.');
  });
}

// Function to handle hover effect on movie cards
function setupCardHoverEffect() {
  const movieCards = document.querySelectorAll('.movie-card');
  movieCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
    });
  });
}

// Function to handle double-click event for movie cards
function setupCardDoubleClickEvent() {
  const movieCards = document.querySelectorAll('.movie-card');
  movieCards.forEach(card => {
    card.addEventListener('dblclick', () => {
      alert(`You double-clicked on "${card.querySelector('h3').textContent}"`);
    });
  });
}

// Initialize the app
function initializeApp() {
  document.querySelector('#app').innerHTML = `
    <section id="preferences">
      <h1>Set Your Preferences</h1>
      <p>Select your favorite genres, actors, or directors to get personalized recommendations.</p>
      <button id="set-preferences">Set Preferences</button>
    </section>
    <section id="suggestions">
      <h2>Personalized Suggestions</h2>
      <div id="suggestions-content"></div>
    </section>
    <section id="search">
      <h2>Search for Movies and TV Shows</h2>
      <input type="text" placeholder="Search by title, genre, or actor" id="search-input" />
      <button id="search-button">Search</button>
    </section>
    <section id="trending">
      <h2>Trending Content</h2>
      <div id="trending-content"></div>
    </section>
    <section id="watchlist">
      <h2>Your Watchlist</h2>
      <div id="watchlist-content"></div>
    </section>
  `;

  setupPreferences();
  setupSearch();
  setupSearchInputEvent();
  setupSearchKeypressEvent();
  loadPersonalizedSuggestions();
  loadTrendingContent();
  loadWatchlistContent();
  setupClearWatchlistEvent();
  setupCardHoverEffect();
  setupCardDoubleClickEvent();
}

initializeApp();
