"use client"

import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-all duration-200 z-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  )
}
