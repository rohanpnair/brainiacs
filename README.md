# QuizMaster - Interactive Quiz Application

A full-stack Next.js application for creating and taking interactive quizzes with secure sharing via unique codes.

## Features

### Quiz Creator Features
- **Authentication**: Secure user registration and login with NextAuth.js
- **Quiz Creation**: Multi-step form to create quizzes with multiple-choice questions
- **Unique Code Generation**: Each quiz gets a unique, shareable code
- **Dashboard**: View and manage all created quizzes
- **Real-time Preview**: Preview quizzes before sharing

### Quiz Taker Features
- **Code-based Access**: Enter quiz codes to access quizzes instantly
- **Interactive Interface**: Clean, step-by-step question navigation
- **Progress Tracking**: Visual progress bar and question counter
- **Instant Results**: Detailed score breakdown with correct/incorrect answers
- **No Account Required**: Take quizzes without creating an account

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Styling**: Tailwind CSS with custom components
- **Deployment**: Vercel-ready

## Project Structure

```
brainiacs/
├── pages/                    # Next.js pages
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth.js authentication
│   │   └── quizzes/        # Quiz CRUD operations
│   ├── auth/               # Authentication pages
│   ├── quiz/               # Quiz-related pages
│   │   ├── create.js       # Quiz creation form
│   │   └── [code].js       # Dynamic quiz taking page
│   ├── dashboard.js        # User dashboard
│   ├── index.js           # Home page
│   └── _app.js            # App wrapper with SessionProvider
├── prisma/                 # Database schema and migrations
├── lib/                   # Utility functions
├── styles/                # Global styles
└── public/                # Static assets
```

## Database Schema

### Users Table
- User authentication and profile information
- Links to created quizzes

### Quizzes Table
- Quiz metadata (title, description, unique code)
- Creator relationship

### Questions Table
- Question text and multiple-choice options
- Correct answer storage
- Quiz relationship and ordering

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brainiacs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Creating a Quiz

1. Sign up or log in to your account
2. Navigate to "Create Quiz" from the dashboard
3. Fill in quiz title and description
4. Add questions with multiple-choice options
5. Select the correct answer for each question
6. Submit to generate a unique quiz code

### Taking a Quiz

1. Go to the home page
2. Enter the quiz code provided by the quiz creator
3. Answer questions one by one
4. View detailed results at the end

### Managing Quizzes

- View all your created quizzes in the dashboard
- Copy shareable links
- Preview quizzes before sharing

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Quizzes
- `GET /api/quizzes` - Get user's quizzes
- `POST /api/quizzes` - Create new quiz
- `GET /api/quizzes/[code]` - Get quiz by code (for taking)
- `POST /api/quizzes/[code]/submit` - Submit quiz answers

## Security Features

- Protected quiz creation (authentication required)
- Secure session management with NextAuth.js
- Quiz codes for controlled access
- Input validation and sanitization
- CSRF protection

## Deployment

The application is ready for deployment on Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

For other platforms, build the application:
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
