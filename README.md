# YouTube Watch Party

A real-time YouTube Watch Party application that allows multiple users to watch YouTube videos together in sync. Built using React, Node.js, Express, MongoDB, and Socket.IO.

##  Live Demo

**Frontend:**  
https://youtube-watch-party-two-woad.vercel.app/

**Backend:**  
https://youtube-watch-party-api.onrender.com/

---

##  Features

-  Create a Watch Party Room
-  Join an Existing Room using Room Code
-  Real-time Participant List
-  Synchronized Video Playback
-  Synchronized Pause
-  Synchronized Seeking
-  Change YouTube Video for All Participants
-  Real-time Communication using Socket.IO
-  MongoDB Database Integration
-  Responsive and Clean User Interface

---

##  Tech Stack

### Frontend

- React
- Vite
- JavaScript (ES6+)
- HTML5
- CSS3
- Axios
- React Router DOM
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.IO
- CORS
- dotenv

---

##  Project Structure

```
youtube-watch-party/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

##  Installation

### 1. Clone Repository

```bash
git clone https://github.com/Anjali536/youtube-watch-party.git
```

```bash
cd youtube-watch-party
```

---

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

### Server (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

### Client (.env)

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

##  Run Locally

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

---

##  How It Works

1. User creates a watch party room.
2. A unique room code is generated.
3. Other participants join using the room code.
4. Host loads a YouTube video.
5. Socket.IO broadcasts events in real-time.
6. All participants stay synchronized during:
   - Play
   - Pause
   - Seek
   - Video Change
7. Participant list updates instantly whenever users join or leave.

---

##  Socket Events

| Event | Description |
|--------|-------------|
| join-room | Join an existing room |
| change-video | Change YouTube video |
| play-video | Play video for everyone |
| pause-video | Pause video for everyone |
| seek-video | Sync current playback position |
| participants-updated | Update participant list |

---
## Author

**Anjali Thakur**

- GitHub: https://github.com/Anjali536
- LinkedIn: www.linkedin.com/in/anjali-thakur-0bb16127b

---

## License

This project is developed as part of a technical assessment and is intended for learning and demonstration purposes.
