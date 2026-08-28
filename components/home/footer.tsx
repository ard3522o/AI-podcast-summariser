import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-gray-900 to-emerald-900/10">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg gradient-emerald">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg gradient-emerald-text">
                  Podcasto
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered podcast processing that transforms your content into
                engagement gold.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/projects"
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/upload"
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    Upload
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              {new Date().getFullYear()} Podcasto. This is a demo project.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
