import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function TakeQuiz({ quiz, error }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Quiz Not Found</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <Link href="/" className="text-red-400 hover:text-red-300">
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
  }

  const currentQuestionData = quiz.questions[currentQuestion]
  const totalQuestions = quiz.questions.length
  const isLastQuestion = currentQuestion === totalQuestions - 1

  const handleAnswerChange = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionData.id]: answer
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = async () => {
    setIsSubmitting(true)
    
    // Convert answers object to array format expected by API
    const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer
    }))

    try {
      const response = await fetch(`/api/quizzes/${quiz.code}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: answersArray }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
        setShowResults(true)
      } else {
        alert('Error submitting quiz: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Something went wrong while submitting the quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 shadow-2xl rounded-lg p-6 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Quiz Results</h1>
              <h2 className="text-xl text-gray-300">{results.quizTitle}</h2>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-red-900 rounded-full mb-4">
                <span className="text-4xl font-bold text-red-300">
                  {results.percentage}%
                </span>
              </div>
              <p className="text-lg text-gray-300">
                You scored {results.score} out of {results.totalQuestions} questions correctly
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Detailed Results</h3>
              {results.results.map((result, index) => (
                <div key={result.questionId} className="border border-gray-600 bg-gray-700 rounded-md p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-md font-medium text-white">
                      Question {index + 1}
                    </h4>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      result.isCorrect 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {result.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{result.text}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-400">Your answer: </span>
                      <span className={result.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {result.userAnswer || 'No answer'}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div>
                        <span className="text-sm font-medium text-gray-400">Correct answer: </span>
                        <span className="text-green-400">{result.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/" className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
                Take Another Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 shadow-2xl rounded-lg p-6 border border-gray-700">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
              <span className="text-sm text-gray-400">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
            </div>
            
            {quiz.description && (
              <p className="text-gray-300 mb-4">{quiz.description}</p>
            )}

            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-medium text-white mb-6">
              {currentQuestionData.text}
            </h2>

            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <label key={index} className="flex items-center p-4 border border-gray-600 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQuestionData.id}`}
                    value={option}
                    checked={answers[currentQuestionData.id] === option}
                    onChange={() => handleAnswerChange(option)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
                  />
                  <span className="ml-3 text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="bg-gray-700 text-gray-300 px-6 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={submitQuiz}
                disabled={!answers[currentQuestionData.id] || isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!answers[currentQuestionData.id]}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { code } = params

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/quizzes/${code}`)
    
    if (!response.ok) {
      return {
        props: {
          error: 'Quiz not found'
        }
      }
    }

    const quiz = await response.json()

    return {
      props: {
        quiz
      }
    }
  } catch (error) {
    return {
      props: {
        error: 'Failed to load quiz'
      }
    }
  }
}
