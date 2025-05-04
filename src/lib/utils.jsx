/**
 * Combines multiple class names into a single string
 * This is a utility function commonly used with Tailwind CSS
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }
  