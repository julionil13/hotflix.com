import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-black text-[#f40088]">HOTFLIX</div>
            <p className="text-gray-400 text-sm">
              Premium streaming platform for exclusive sensual content. Sophisticated, secure, and discreet.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/models" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Models
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/subscription" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/my-account" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  My List
                </Link>
              </li>
              <li>
                <Link href="/purchase-history" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Purchase History
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#f40088] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Hotflix. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">18+ Adult Content • Secure & Discreet</p>
        </div>
      </div>
    </footer>
  )
}
