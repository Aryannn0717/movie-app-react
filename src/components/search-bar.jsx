"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md mx-auto mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search for movies"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <Search className="w-5 h-5 mr-1" />
        Search
      </button>
    </form>
  )
}
