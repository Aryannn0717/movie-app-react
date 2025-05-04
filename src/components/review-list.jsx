"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Star } from "lucide-react"

export default function ReviewList({ movieId }) {
  const [reviews, setReviews] = useState([])

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem(`movieReviews_${movieId}`) || "[]")
    setReviews(savedReviews)
  }, [movieId])

  // Save to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem(`movieReviews_${movieId}`, JSON.stringify(reviews))
  }, [reviews, movieId])

  const handleVote = (reviewId, voteType) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          // If user already voted this way, remove the vote
          if (voteType === "up" && review.userVote === "up") {
            return { ...review, upvotes: review.upvotes - 1, userVote: null }
          } else if (voteType === "down" && review.userVote === "down") {
            return { ...review, downvotes: review.downvotes - 1, userVote: null }
          }

          // If user voted the opposite way, remove that vote and add new one
          if (voteType === "up" && review.userVote === "down") {
            return {
              ...review,
              upvotes: review.upvotes + 1,
              downvotes: review.downvotes - 1,
              userVote: "up",
            }
          } else if (voteType === "down" && review.userVote === "up") {
            return {
              ...review,
              upvotes: review.upvotes - 1,
              downvotes: review.downvotes + 1,
              userVote: "down",
            }
          }

          // If user hasn't voted yet
          if (voteType === "up") {
            return { ...review, upvotes: review.upvotes + 1, userVote: "up" }
          } else {
            return { ...review, downvotes: review.downvotes + 1, userVote: "down" }
          }
        }
        return review
      }),
    )
  }

  if (reviews.length === 0) {
    return <div className="text-center py-4 text-gray-500">No reviews yet. Be the first to review this movie!</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">User Reviews</h3>

      {reviews
        .sort((a, b) => b.upvotes - a.upvotes)
        .map((review) => (
          <div key={review.id} className="bg-gray-50 p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.username}</span>
                  <span className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(review.id, "up")}
                  className={`flex items-center gap-1 ${review.userVote === "up" ? "text-green-600" : "text-gray-500"} hover:text-green-600 transition-colors`}
                  aria-label="Upvote review"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.upvotes}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, "down")}
                  className={`flex items-center gap-1 ${review.userVote === "down" ? "text-red-600" : "text-gray-500"} hover:text-red-600 transition-colors`}
                  aria-label="Downvote review"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{review.downvotes}</span>
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{review.comment}</p>
          </div>
        ))}
    </div>
  )
}
