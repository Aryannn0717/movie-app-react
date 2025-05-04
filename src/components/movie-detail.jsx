"use client"

import { useState, useEffect } from "react"
import { Modal } from "./ui/modal"
import { isInWatchlist, isWatched } from "../utils/local-storage"
import { Star, Plus, Check } from "lucide-react"

export default function MovieDetail({ movieId, onAddToWatchlist, onMarkAsWatched, onReview }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)

  const API_URL = "http://www.omdbapi.com/?apikey=dc2ddb66"

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}&i=${movieId}&plot=full`)
        const data = await response.json()

        if (data.Response === "True") {
          setMovie(data)
        } else {
          setError(data.Error || "Failed to load movie details")
        }
      } catch (err) {
        setError("An error occurred while fetching movie details")
      } finally {
        setLoading(false)
      }
    }

    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId, API_URL])

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    onReview(movieId, reviewForm)
    setReviewForm({ rating: 5, comment: "" })
    setShowReviewForm(false)
  }

  const formatRuntime = (runtime) => {
    if (!runtime || runtime === "N/A") return null

    const minutes = Number.parseInt(runtime.replace(/\D/g, ""), 10)
    if (isNaN(minutes)) return runtime

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}hr ${remainingMinutes}min`
    } else if (hours > 0) {
      return `${hours}hr`
    } else {
      return `${remainingMinutes}min`
    }
  }

  const renderStars = (rating) => {
    if (!rating || rating === "N/A") return null

    const numericRating = Number.parseFloat(rating) / 2
    const fullStars = Math.floor(numericRating)
    const hasHalfStar = numericRating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star className="w-5 h-5 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="ml-2 text-gray-400">{rating}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">{error}</div>
    )
  }

  if (!movie) return null

  const inWatchlist = isInWatchlist(movieId)
  const alreadyWatched = isWatched(movieId)

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Movie poster */}
        <div className="md:w-1/3 lg:w-1/4">
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"}
            alt={movie.Title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Movie details */}
        <div className="p-6 md:w-2/3 lg:w-3/4">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{movie.Year}</span>
                {movie.Runtime && movie.Runtime !== "N/A" && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {formatRuntime(movie.Runtime)}
                  </span>
                )}
                {movie.Rated && movie.Rated !== "N/A" && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">{movie.Rated}</span>
                )}
              </div>
              {renderStars(movie.imdbRating)}
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
              {!alreadyWatched && !inWatchlist && (
                <button
                  onClick={() => onAddToWatchlist(movie)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to Watchlist
                </button>
              )}

              {inWatchlist && (
                <button
                  onClick={() => onMarkAsWatched(movieId)}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark as Watched
                </button>
              )}

              {alreadyWatched && (
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-2 rounded">
                  <Check className="w-4 h-4" />
                  Watched
                </div>
              )}

              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors"
              >
                <Star className="w-4 h-4" />
                Write Review
              </button>
            </div>
          </div>

          {/* Movie info */}
          <div className="mt-6 space-y-4">
            {movie.Plot && movie.Plot !== "N/A" && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Plot</h2>
                <p className="text-gray-700">{movie.Plot}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {movie.Director && movie.Director !== "N/A" && (
                <div>
                  <h3 className="font-semibold text-gray-900">Director</h3>
                  <p className="text-gray-700">{movie.Director}</p>
                </div>
              )}

              {movie.Writer && movie.Writer !== "N/A" && (
                <div>
                  <h3 className="font-semibold text-gray-900">Writer</h3>
                  <p className="text-gray-700">{movie.Writer}</p>
                </div>
              )}

              {movie.Actors && movie.Actors !== "N/A" && (
                <div>
                  <h3 className="font-semibold text-gray-900">Cast</h3>
                  <p className="text-gray-700">{movie.Actors}</p>
                </div>
              )}

              {movie.Genre && movie.Genre !== "N/A" && (
                <div>
                  <h3 className="font-semibold text-gray-900">Genre</h3>
                  <p className="text-gray-700">{movie.Genre}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review form modal */}
      <Modal isOpen={showReviewForm} onClose={() => setShowReviewForm(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-2xl"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
