"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from "react-router-dom"
import Auth from "./components/Auth"
import Watchlist from "./components/watchlist"
import CategoryBrowser from "./components/category-browser"
import ReviewList from "./components/review-list"
import HomePage from "./components/home-page"
import {
  getWatchlist,
  addToWatchlist as addToWatchlistUtil,
  removeFromWatchlist as removeFromWatchlistUtil,
  addToWatched as addToWatchedUtil,
} from "./utils/local-storage"
import "./App.css"

// Wrapper component to get URL parameters
function MovieDetailWrapper({ onAddToWatchlist, onMarkAsWatched, onReview }) {
  const { id } = useParams()
  return (
    <>
      <movie-detail
        movieId={id}
        onAddToWatchlist={onAddToWatchlist}
        onMarkAsWatched={onMarkAsWatched}
        onReview={onReview}
      />
      <div className="mt-8">
        <ReviewList movieId={id} />
      </div>
    </>
  )
}

// Wrapper component to get URL parameters
function CategoryWrapper() {
  const { name } = useParams()
  return <CategoryBrowser category={name} />
}

function App() {
  const [user, setUser] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const handleLogout = () => {
    setUser(null)
  }

  // Add to watchlist with notification
  const addToWatchlist = (movie) => {
    const currentWatchlist = getWatchlist()
    if (!currentWatchlist.some((item) => item.imdbID === movie.imdbID)) {
      addToWatchlistUtil(movie)
      alert("Added to watchlist!")
    } else {
      alert("Movie is already in your watchlist!")
    }
  }

  // Mark movie as watched
  const markAsWatched = (movieId) => {
    const currentWatchlist = getWatchlist()
    const movie = currentWatchlist.find((m) => m.imdbID === movieId)

    if (movie) {
      addToWatchedUtil(movie)
      removeFromWatchlistUtil(movieId)
      alert("Marked as watched!")
    }
  }

  // Add a review
  const addReview = (movieId, reviewData) => {
    const currentReviews = JSON.parse(localStorage.getItem(`movieReviews_${movieId}`) || "[]")

    const newReview = {
      id: Date.now().toString(),
      movieId,
      username: user.email.split("@")[0],
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    }

    const updatedReviews = [...currentReviews, newReview]
    localStorage.setItem(`movieReviews_${movieId}`, JSON.stringify(updatedReviews))
    alert("Review submitted!")
  }

  // Common header component
  const AppHeader = () => (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-3xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
          Movie Explorer
        </Link>
        <nav className="flex space-x-4">
          <Link to="/watchlist" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
            My Watchlist
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
      >
        Logout
      </button>
    </header>
  )

  // Layout wrapper for authenticated pages
  const AuthenticatedLayout = ({ children }) => (
    <div className="app min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AppHeader />
        {children}
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            user ? (
              <AuthenticatedLayout>
                <HomePage />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Auth route */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <Auth onLogin={(userData) => setUser(userData)} />}
        />

        {/* Movie detail route */}
        <Route
          path="/movie/:id"
          element={
            user ? (
              <AuthenticatedLayout>
                <MovieDetailWrapper
                  onAddToWatchlist={addToWatchlist}
                  onMarkAsWatched={markAsWatched}
                  onReview={addReview}
                />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Watchlist route */}
        <Route
          path="/watchlist"
          element={
            user ? (
              <AuthenticatedLayout>
                <Watchlist />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Category route */}
        <Route
          path="/category/:name"
          element={
            user ? (
              <AuthenticatedLayout>
                <CategoryWrapper />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
