const WATCHLIST_STORAGE_KEY = 'movie_watchlist';
const PREFERENCES_STORAGE_KEY = 'user_preferences';

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
