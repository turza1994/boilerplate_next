import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Next.js Boilerplate
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Production-ready frontend with JWT authentication
        </p>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </Link>
          
          <Link
            href="/dashboard"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </Link>
        </div>
        
        <div className="mt-8 border-t pt-8">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Features</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ Next.js 15 with App Router</li>
            <li>✅ TypeScript with strict mode</li>
            <li>✅ JWT authentication & token refresh</li>
            <li>✅ React Hook Form + Zod validation</li>
            <li>✅ Tailwind CSS styling</li>
            <li>✅ Protected routes</li>
            <li>✅ API client with error handling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
