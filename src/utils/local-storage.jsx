// Watchlist functions
export const getWatchlist = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("movieWatchlist") || "[]")
}

export const getWatchedMovies = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("watchedMovies") || "[]")
}

export const addToWatchlist = (movie) => {
  const currentWatchlist = getWatchlist()
  if (!currentWatchlist.some((item) => item.imdbID === movie.imdbID)) {
    const updatedWatchlist = [...currentWatchlist, movie]
    localStorage.setItem("movieWatchlist", JSON.stringify(updatedWatchlist))
  }
}

export const removeFromWatchlist = (movieId) => {
  const currentWatchlist = getWatchlist()
  const updatedWatchlist = currentWatchlist.filter((m) => m.imdbID !== movieId)
  localStorage.setItem("movieWatchlist", JSON.stringify(updatedWatchlist))
}

export const addToWatched = (movie) => {
  const watchedMovies = getWatchedMovies()
  const movieWithDate = { ...movie, watchedDate: new Date().toISOString() }

  if (!watchedMovies.some((item) => item.imdbID === movie.imdbID)) {
    const updatedWatched = [...watchedMovies, movieWithDate]
    localStorage.setItem("watchedMovies", JSON.stringify(updatedWatched))
  }
}

export const removeFromWatched = (movieId) => {
  const watchedMovies = getWatchedMovies()
  const updatedWatched = watchedMovies.filter((m) => m.imdbID !== movieId)
  localStorage.setItem("watchedMovies", JSON.stringify(updatedWatched))
}

// Check if a movie is in watchlist
export const isInWatchlist = (movieId) => {
  const watchlist = getWatchlist()
  return watchlist.some((movie) => movie.imdbID === movieId)
}

// Check if a movie is in watched list
export const isWatched = (movieId) => {
  const watchedMovies = getWatchedMovies()
  return watchedMovies.some((movie) => movie.imdbID === movieId)
}

// User functions
export const getUser = () => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const setUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData))
}

export const clearUser = () => {
  localStorage.removeItem("user")
}

// Review functions
export const getMovieReviews = (movieId) => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(`movieReviews_${movieId}`) || "[]")
}

export const addReview = (movieId, review) => {
  const currentReviews = getMovieReviews(movieId)
  const updatedReviews = [...currentReviews, review]
  localStorage.setItem(`movieReviews_${movieId}`, JSON.stringify(updatedReviews))
}

// Clear all data (for testing/debugging)
export const clearAllMovieData = () => {
  localStorage.removeItem("movieWatchlist")
  localStorage.removeItem("watchedMovies")

  // Clear all reviews
  const allKeys = Object.keys(localStorage)
  const reviewKeys = allKeys.filter((key) => key.startsWith("movieReviews_"))
  reviewKeys.forEach((key) => localStorage.removeItem(key))
}
