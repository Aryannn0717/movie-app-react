import { Inter } from "next/font/google"
import Link from "next/link"
import { Home, Bookmark, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Movie Explorer",
  description: "Browse, review, and track your favorite movies",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
              MovieExplorer
            </Link>

            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>

              <Link href="/watchlist">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Watchlist</span>
                </Button>
              </Link>

              <Link href="/auth">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MovieExplorer. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
