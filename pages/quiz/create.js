import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CreateQuiz() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a quiz title');
      setLoading(false);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Please enter question ${i + 1}`);
        setLoading(false);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        setError(`Please fill all options for question ${i + 1}`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create quiz');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-black shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-red-500">
                Brainiacs
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-red-400 transition-colors">
                Dashboard
              </Link>
              <span className="text-gray-300">Create Quiz</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Create New Quiz</h1>
            <p className="text-gray-400 mt-2">Create an engaging quiz with multiple-choice questions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quiz Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter quiz title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter quiz description"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Add Question
                </button>
              </div>

              {questions.map((q, questionIndex) => (
                <div key={questionIndex} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Question {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Question *
                      </label>
                      <textarea
                        value={q.question}
                        onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter your question"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Answer Options *
                      </label>
                      <div className="space-y-2">
                        {q.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={q.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Select the radio button next to the correct answer
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}