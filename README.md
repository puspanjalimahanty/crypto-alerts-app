Crypto Alerts App

Overview:
Crypto Alerts App is a real-time cryptocurrency alert system where users can set price alerts for different coins. When a coin’s price crosses the set target, the user gets notified. The app includes a frontend built with React and a backend built with Node.js, Express, and MongoDB, with real-time communication via Socket.IO.

Features

Add new alerts for any cryptocurrency.

Delete existing alerts.

Real-time notifications when price targets are met.

User-friendly interface.

Persistent alerts using MongoDB.

Tech Stack

Frontend: React, Redux Toolkit, Axios

Backend: Node.js, Express, Socket.IO, MongoDB

Realtime: Socket.IO

Deployment: Frontend on Vercel, Backend on Render

App Flow

User opens the app and connects to the backend.

User adds a new alert specifying coin, target price, and type (above/below).

Backend stores alert in MongoDB and monitors coin prices.

When coin price meets the alert condition, a notification is triggered for the user.

User can delete alerts anytime.

Challenges Faced & Solutions

Handling real-time notifications: Implemented Socket.IO for instant updates.

Managing persistent alerts: Alerts are stored in MongoDB to survive server restarts.

Frontend-backend communication: Configured CORS and API endpoints for smooth integration.

User-friendly UI: Styled React components for clear alert management and interaction.
