"use client"

import { useState, useEffect } from "react"
import { Check, Trash2 } from "lucide-react"
import MovieCard from "./movie-card"
import {
  getWatchlist,
  getWatchedMovies,
  removeFromWatchlist,
  addToWatched,
  removeFromWatched,
} from "../utils/local-storage"

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [watchedMovies, setWatchedMovies] = useState([])
  const [activeTab, setActiveTab] = useState("watchlist")

  // Load data from localStorage on component mount
  useEffect(() => {
    setWatchlist(getWatchlist())
    setWatchedMovies(getWatchedMovies())
  }, [])

  const handleRemoveFromWatchlist = (movieId) => {
    removeFromWatchlist(movieId)
    setWatchlist(getWatchlist())
  }

  const handleMarkAsWatched = (movieId) => {
    const movie = watchlist.find((movie) => movie.imdbID === movieId)
    if (movie) {
      removeFromWatchlist(movieId)
      addToWatched(movie)
      setWatchlist(getWatchlist())
      setWatchedMovies(getWatchedMovies())
    }
  }

  const handleRemoveFromWatched = (movieId) => {
    removeFromWatched(movieId)
    setWatchedMovies(getWatchedMovies())
  }

  return (
    <div>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "watchlist" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
          onClick={() => setActiveTab("watchlist")}
        >
          Watchlist ({watchlist.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "watched" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
          onClick={() => setActiveTab("watched")}
        >
          Watched ({watchedMovies.length})
        </button>
      </div>

      {activeTab === "watchlist" && (
        <>
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {watchlist.map((movie) => (
                <div key={movie.imdbID} className="relative group">
                  <MovieCard movie={movie} />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsWatched(movie.imdbID)
                      }}
                      className="p-2 bg-green-500 text-white rounded-full mx-1"
                      title="Mark as watched"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromWatchlist(movie.imdbID)
                      }}
                      className="p-2 bg-red-500 text-white rounded-full mx-1"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Your watchlist is empty. Add movies to watch later!</div>
          )}
        </>
      )}

      {activeTab === "watched" && (
        <>
          {watchedMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {watchedMovies.map((movie) => (
                <div key={movie.imdbID} className="relative group">
                  <MovieCard movie={movie} />
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl">
                    Watched
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromWatched(movie.imdbID)
                      }}
                      className="p-2 bg-red-500 text-white rounded-full mx-1"
                      title="Remove from watched"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {movie.watchedDate && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                      Watched on: {new Date(movie.watchedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">You haven't marked any movies as watched yet.</div>
          )}
        </>
      )}
    </div>
  )
}
