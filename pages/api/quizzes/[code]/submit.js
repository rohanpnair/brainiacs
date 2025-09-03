import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { code } = req.query

  if (req.method === 'POST') {
    try {
      const { answers } = req.body // Array of {questionId, selectedAnswer}

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Answers are required' })
      }

      // Get quiz with correct answers
      const quiz = await prisma.quiz.findUnique({
        where: {
          code: code
        },
        include: {
          questions: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' })
      }

      // Calculate score
      let score = 0
      const totalQuestions = quiz.questions.length
      const results = []

      quiz.questions.forEach(question => {
        const userAnswer = answers.find(a => a.questionId === question.id)
        const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer
        
        if (isCorrect) {
          score++
        }

        results.push({
          questionId: question.id,
          text: question.text,
          userAnswer: userAnswer?.selectedAnswer || null,
          correctAnswer: question.correctAnswer,
          isCorrect
        })
      })

      const percentage = Math.round((score / totalQuestions) * 100)

      res.status(200).json({
        score,
        totalQuestions,
        percentage,
        results,
        quizTitle: quiz.title
      })
    } catch (error) {
      console.error('Error submitting quiz:', error)
      res.status(500).json({ error: 'Failed to submit quiz' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
