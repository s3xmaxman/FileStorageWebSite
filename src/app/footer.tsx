import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-xl font-bold">
            FileDrive
          </Link>
        </div>
        <nav className="flex space-x-4">
          <Link href="/privacy" className="hover:text-gray-400">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-400">
            Terms of Service
          </Link>
          <Link href="/about" className="hover:text-gray-400">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}