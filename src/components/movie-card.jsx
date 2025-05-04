"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { isInWatchlist, isWatched } from "../utils/local-storage"
import MovieDetailModal from "./movie-detail-modal"

// Helper function for star ratings
const renderStars = (rating) => {
  if (!rating || rating === "N/A") return null

  const numericRating = Number.parseFloat(rating) / 2
  const fullStars = Math.floor(numericRating)
  const hasHalfStar = numericRating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <Star className="w-4 h-4 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  )
}

export default function MovieCard({ movie }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check if movie is in watchlist or watched
  const inWatchlist = isInWatchlist(movie.imdbID)
  const alreadyWatched = isWatched(movie.imdbID)

  return (
    <>
      <div className="relative group">
        <div
          className="cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md h-full">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"}
              alt={movie.Title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 line-clamp-1 text-white">{movie.Title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span>{movie.Year}</span>
                {movie.Runtime && movie.Runtime !== "N/A" && <span>• {movie.Runtime}</span>}
              </div>
              {renderStars(movie.imdbRating || movie.Rating)}
            </div>
          </div>
        </div>

        {/* Status indicators */}
        {inWatchlist && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Watchlist</div>
        )}

        {alreadyWatched && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Watched</div>
        )}
      </div>

      {/* Movie Detail Modal */}
      <MovieDetailModal movie={movie} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
