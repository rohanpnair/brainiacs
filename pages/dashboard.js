import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchQuizzes()
    }
  }, [status, router])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes')
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data)
      } else {
        setError('Failed to fetch quizzes')
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-black shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-red-500">
                Brainiacs Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {session?.user?.name || session?.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Quizzes</h2>
            <Link
              href="/quiz/create"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Create New Quiz
            </Link>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No quizzes yet</h3>
              <p className="text-gray-400 mb-4">Get started by creating your first quiz</p>
              <Link
                href="/quiz/create"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Create Your First Quiz
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-gray-900 overflow-hidden shadow-lg rounded-lg border border-gray-800">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white truncate">
                        {quiz.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300">
                        {quiz._count.questions} questions
                      </span>
                    </div>
                    
                    {quiz.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Quiz Code</p>
                        <p className="font-mono text-lg font-semibold text-red-400">
                          {quiz.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-sm text-gray-300">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/quiz/${quiz.code}`}
                        className="flex-1 bg-red-600 text-white text-center px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                      >
                        Preview Quiz
                      </Link>
                      <button
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/quiz/${quiz.code}`)}
                        className="bg-gray-800 text-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}