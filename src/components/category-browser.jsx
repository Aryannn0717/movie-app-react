"use client"
import { useState, useEffect } from "react"
import MovieCard from "./movie-card"

export default function CategoryBrowser({ category }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = "http://www.omdbapi.com/?apikey=dc2ddb66"

  useEffect(() => {
    const fetchMoviesByCategory = async () => {
      try {
        setLoading(true)
        setError(null)

        // First fetch a broad selection of movies
        const response = await fetch(`${API_URL}&s=movie&type=movie&page=1`)
        const data = await response.json()

        if (data.Response === "True") {
          // Get full details for each movie to have more data to work with
          const detailedMovies = await Promise.all(
            data.Search.map(async (movie) => {
              const detailsResponse = await fetch(`${API_URL}&i=${movie.imdbID}&plot=short`)
              return detailsResponse.json()
            }),
          )

          // Filter out movies without ratings
          const ratedMovies = detailedMovies.filter((movie) => movie.imdbRating && movie.imdbRating !== "N/A")

          // Apply different sorting algorithms based on category
          const sortedMovies = [...ratedMovies]

          switch (category.toLowerCase()) {
            case "popular":
              // Sort by IMDB rating * number of votes (approximation of popularity)
              sortedMovies.sort((a, b) => {
                const aVotes = Number.parseInt(a.imdbVotes?.replace(/,/g, "") || "0")
                const bVotes = Number.parseInt(b.imdbVotes?.replace(/,/g, "") || "0")
                const aScore = Number.parseFloat(a.imdbRating || "0") * aVotes
                const bScore = Number.parseFloat(b.imdbRating || "0") * bVotes
                return bScore - aScore
              })
              break

            case "now playing":
              // Sort by year (newest first) as a proxy for "now playing"
              sortedMovies.sort((a, b) => {
                const aYear = Number.parseInt(a.Year) || 0
                const bYear = Number.parseInt(b.Year) || 0
                return bYear - aYear
              })
              break

            case "top rated":
              // Pure IMDB rating sort (minimum 1000 votes to avoid outliers)
              sortedMovies.sort((a, b) => {
                const aVotes = Number.parseInt(a.imdbVotes?.replace(/,/g, "") || "0")
                const bVotes = Number.parseInt(b.imdbVotes?.replace(/,/g, "") || "0")
                const aRating = aVotes > 1000 ? Number.parseFloat(a.imdbRating || "0") : 0
                const bRating = bVotes > 1000 ? Number.parseFloat(b.imdbRating || "0") : 0
                return bRating - aRating
              })
              break
          }

          setMovies(sortedMovies.slice(0, 12)) // Show top 12 results
        } else {
          setError(data.Error || "No movies found")
          setMovies([])
        }
      } catch (err) {
        setError("Failed to fetch movies. Please try again.")
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchMoviesByCategory()
  }, [category, API_URL])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading {category} movies...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">{error}</div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No movies found in this category</div>
      )}
    </div>
  )
}
