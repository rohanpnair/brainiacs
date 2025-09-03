import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const [quizCode, setQuizCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleQuizAccess = async (e) => {
    e.preventDefault();
    if (!quizCode.trim()) {
      setError('Please enter a quiz code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/quizzes/${quizCode}`);
      if (response.ok) {
        router.push(`/quiz/${quizCode}`);
      } else {
        setError('Quiz not found. Please check the code and try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-red-500">
                Brainiacs
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-red-400 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/quiz/create" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    Create Quiz
                  </Link>
                </>
              ) : (
                <Link href="/auth/signin" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to <span className="text-red-500">Brainiacs</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Create engaging quizzes or test your knowledge with our interactive quiz platform. 
            Share quiz codes with friends and track your progress.
          </p>

          {/* Quiz Code Entry */}
          <div className="max-w-md mx-auto mb-16">
            <form onSubmit={handleQuizAccess} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter Quiz Code (e.g., ABC123XY)"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={8}
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Finding Quiz...' : 'Take Quiz'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Brainiacs?</h2>
            <p className="text-gray-300 text-lg">Everything you need for creating and taking quizzes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Easy Quiz Creation</h3>
                <p className="text-gray-300">Create custom quizzes with multiple-choice questions in minutes</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Share with Codes</h3>
                <p className="text-gray-300">Share your quizzes instantly with unique, easy-to-remember codes</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
                <p className="text-gray-300">Get detailed results and feedback immediately after completing quizzes</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            {session ? (
              <Link href="/quiz/create" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block">
                Create Your First Quiz
              </Link>
            ) : (
              <Link href="/auth/signin" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}