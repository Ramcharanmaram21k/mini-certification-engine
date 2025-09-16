# mini-certification-engine

<img width="2752" height="1520" alt="image" src="https://github.com/user-attachments/assets/e3f13812-adf8-4ac8-8f9f-3c6c5eb6a64b" />

<img width="2748" height="1530" alt="image" src="https://github.com/user-attachments/assets/6dac7e19-9f61-468f-b559-91c4c336d030" />

<img width="1900" height="1242" alt="image" src="https://github.com/user-attachments/assets/3f643b61-2596-4fe0-a7eb-980b14cfc25b" />




Features
	•	User Authentication: Secure registration, login, and profile management with JWT tokens
	•	Interactive Quizzes: Dynamic quiz system with multiple-choice questions and real-time feedback
	•	Results Tracking: Persistent storage and retrieval of quiz attempts and scores
	•	Certificate Generation: Automatic certificate creation for passing quiz attempts
	•	Responsive Frontend: Clean, modern UI built with React and TypeScript
	•	Serverless Backend: Express API optimized for serverless deployment on Vercel
	•	RESTful API: Well-structured endpoints for all application functionality



Prerequisites
	•	Node.js 18+ (recommended: Node.js 20)
	•	npm (or yarn/pnpm)
	•	Git
Installation
	1.	Clone the repository
 git clone https://github.com/your-username/mini-certification-engine.git
cd mini-certification-engine


Install backend dependencies
cd backend
npm install

Install Frontend dependencies
cd ../frontend
npm install


API Endpoints
Authentication
	•	`POST /api/auth/register` - User registration
	•	`POST /api/auth/login` - User login
	•	`GET /api/auth/me` - Get user profile (requires auth)
Quizzes
	•	`GET /api/quizzes/:quizId` - Get quiz questions
	•	`POST /api/quizzes/:quizId/submit` - Submit quiz answers
Results
	•	`GET /api/results/:attemptId` - Get quiz attempt results
Certificates
	•	`POST /api/certificates` - Generate certificate for passing attempt
