import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { code } = req.query

  if (req.method === 'GET') {
    try {
      const quiz = await prisma.quiz.findUnique({
        where: {
          code: code
        },
        include: {
          questions: {
            orderBy: {
              order: 'asc'
            }
          },
          creator: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' })
      }

      // Remove correct answers from questions for quiz takers
      const questionsWithoutAnswers = quiz.questions.map(question => ({
        id: question.id,
        text: question.text,
        options: question.options,
        order: question.order
      }))

      res.status(200).json({
        ...quiz,
        questions: questionsWithoutAnswers
      })
    } catch (error) {
      console.error('Error fetching quiz:', error)
      res.status(500).json({ error: 'Failed to fetch quiz' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
