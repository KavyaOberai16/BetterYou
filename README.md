BetterYou 🌱

BetterYou is a full-stack hobby and self-improvement tracker that helps users stay consistent with their interests while maintaining a healthy mindset. Users can log their daily progress, track moods, maintain streaks, and receive personalized YouTube recommendations based on their selected hobby and mood.

✨ Features
🎯 Track hobbies and daily progress
📝 Write daily logs/journal entries
😊 Mood tracking system with emoji selection
🔥 Streak tracker inspired by LeetCode/GitHub activity grids
🎥 Personalized YouTube video recommendations using YouTube Data API
📚 View previous records and progress history
🎨 Responsive and interactive UI
🛠️ Tech Stack
Frontend
HTML
CSS
Bootstrap
EJS
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
APIs
YouTube Data API v3
📌 How It Works
User selects a hobby
User writes a daily log and selects their mood
The application stores the log in MongoDB
Based on the selected mood and hobby:
mood keywords are generated
hobby keywords are generated
These keywords are combined into a search query
Relevant YouTube videos are fetched dynamically using the YouTube API
🚀 Installation

Clone the repository:

git clone  https://github.com/KavyaOberai16/BetterYou

Move into the project folder:

cd BetterYou

Install dependencies:

npm install

Create a .env file and add:

YOUTUBE_TOKEN=YOUR_API_KEY

Start the server:

node app.js
📷 Future Improvements
User authentication
AI-based recommendations
Better analytics and progress insights
Community features
Dark mode
Personalized dashboards
💡 Learning Outcomes

This project helped me understand:

RESTful routing
API integration
Backend development with Express
MongoDB data handling
Dynamic rendering with EJS
Full-stack project structure
UI/UX design fundamentals

Link to the website:- https://betteryou-l9ju.onrender.com/
