const WATCHLIST_STORAGE_KEY = 'movie_watchlist';
const PREFERENCES_STORAGE_KEY = 'user_preferences';
const THEME_STORAGE_KEY = 'site_theme';
const LAST_SEARCH_STORAGE_KEY = 'last_search_query';
const RECENTLY_VIEWED_STORAGE_KEY = 'recently_viewed_movies';

// Function to get watchlist from local storage
export function getWatchlist() {
  const watchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY);
  return watchlist ? JSON.parse(watchlist) : [];
}

// Function to save watchlist to local storage
export function saveWatchlist(watchlist) {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
}

// Function to get user preferences from local storage
export function getPreferences() {
  const preferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
  return preferences ? JSON.parse(preferences) : {};
}

// Function to save user preferences to local storage
export function savePreferences(preferences) {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

// Function to get theme preference from local storage
export function getTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'light'; // Default to 'light' theme
}

// Function to save theme preference to local storage
export function saveTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

// Function to get last search query from local storage
export function getLastSearchQuery() {
  return localStorage.getItem(LAST_SEARCH_STORAGE_KEY) || '';
}

// Function to save last search query to local storage
export function saveLastSearchQuery(query) {
  localStorage.setItem(LAST_SEARCH_STORAGE_KEY, query);
}

// Function to get recently viewed movies from local storage
export function getRecentlyViewedMovies() {
  const recentlyViewed = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
  return recentlyViewed ? JSON.parse(recentlyViewed) : [];
}

// Function to save recently viewed movies to local storage
export function saveRecentlyViewedMovies(movies) {
  localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(movies));
}
