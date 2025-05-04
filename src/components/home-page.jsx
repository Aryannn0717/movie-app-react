"use client"

import { useState } from "react"
import SearchBar from "./search-bar"
import CategoryBrowser from "./category-browser"
import MovieCard from "./movie-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

export default function HomePage() {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const API_URL = "http://www.omdbapi.com/?apikey=dc2ddb66"

  const handleSearch = async (query) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}&s=${query}`)
      const data = await response.json()

      if (data.Response === "True") {
        // Fetch detailed information for each movie
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            try {
              const detailResponse = await fetch(`${API_URL}&i=${movie.imdbID}&plot=full`)
              return await detailResponse.json()
            } catch (err) {
              console.error(`Error fetching details for ${movie.Title}:`, err)
              return movie // Return basic movie info if detailed fetch fails
            }
          }),
        )

        setSearchResults(detailedMovies)
      } else {
        setSearchResults([])
        setError(data.Error || "No movies found")
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.")
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar onSearch={handleSearch} />

      {searchResults.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {searchResults.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Searching movies...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">{error}</div>
      ) : null}

      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="now-playing">Now Playing</TabsTrigger>
          <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
        </TabsList>
        <TabsContent value="popular">
          <CategoryBrowser category="popular" />
        </TabsContent>
        <TabsContent value="now-playing">
          <CategoryBrowser category="now playing" />
        </TabsContent>
        <TabsContent value="top-rated">
          <CategoryBrowser category="top rated" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
