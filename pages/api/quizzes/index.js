import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create a new quiz
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const { title, description, questions } = req.body

      // Validate input
      if (!title || !questions || questions.length === 0) {
        return res.status(400).json({ error: 'Title and questions are required' })
      }

      // Generate unique code
      const code = nanoid(8).toUpperCase()

      // Create quiz with questions
      const quiz = await prisma.quiz.create({
        data: {
          title,
          description,
          code,
          creatorId: session.user.id,
          questions: {
            create: questions.map((question, index) => ({
              text: question.text,
              options: question.options,
              correctAnswer: question.correctAnswer,
              order: index + 1
            }))
          }
        },
        include: {
          questions: true
        }
      })

      res.status(201).json({ 
        quiz, 
        code,
        message: 'Quiz created successfully' 
      })
    } catch (error) {
      console.error('Error creating quiz:', error)
      res.status(500).json({ error: 'Failed to create quiz' })
    }
  } else if (req.method === 'GET') {
    // Get quizzes for the authenticated user
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const quizzes = await prisma.quiz.findMany({
        where: {
          creatorId: session.user.id
        },
        include: {
          questions: true,
          _count: {
            select: { questions: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      res.status(200).json(quizzes)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      res.status(500).json({ error: 'Failed to fetch quizzes' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
