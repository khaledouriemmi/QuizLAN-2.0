# QuizLAN 2.0 🧠📡✨

**The ultimate local multiplayer quiz platform, now better than ever.**

A fast, lightweight, Kahoot-style quiz system designed to run entirely on your local network (LAN/Wi-Fi).
Includes a full Teacher interface and Student interface, real-time updates, and PIN-based game sessions.

## 🚀 What's New in v2.0?

We've packed this update with highly requested features to make your quizzes more engaging and customizable:

*   **🌗 Dark & Light Themes**: A stunning new UI that adapts to your preference. Toggle between a sleek dark mode and a clean, professional light mode instantly.
*   **✅ True or False Questions**: Diversify your quizzes with the new binary choice question type, perfect for quick checks of understanding.
*   **⏱️ Custom Timers**: You're in control! Set a specific time limit for *each* slide directly from the quiz creator.
*   **🏠 New Landing Page**: A beautiful, central hub to welcome users and direct them to the Teacher or Student portals.
*   **🛠️ Reliability Fixes**: We've squashed bugs related to answer submission, ensuring every student's vote is counted accurately and instantly.

---

## ✨ Core Features

### 👩‍🏫 Teacher Interface
*   **Create & Customize**: Build quizzes from scratch with multiple question types and custom timers.
*   **Live Game Management**: Start sessions, control slides, and skip questions on the fly.
*   **Real-Time Monitoring**: See student connections and responses as they happen.
*   **History**: Automatically saves your quiz sessions for future review.

### 👨‍🎓 Student Interface
*   **Easy Join**: Enter a generic PIN code to jump straight into the action.
*   **Instant Feedback**: Clean, responsive answering interface with immediate visual confirmation.
*   **Personalized**: Choose a fun avatar to represent yourself on the leaderboard.

### 🌐 Local Network Support
*   **100% Offline**: No internet? No problem. Runs entirely on your classroom or home Wi-Fi.
*   **Privacy First**: All data stays on your machine.

---

## 🧱 Tech Stack
*   **Backend**: Python, Flask
*   **Frontend**: HTML, CSS (Vanilla + Variables), JavaScript
*   **Data**: JSON-based quiz storage

## 🚀 Installation & Usage

### 1️⃣ Install Dependencies
```bash
pip install flask
# or
pip install -r requirements.txt
```

### 2️⃣ Run the Server
```bash
python app.py
```
*The server will start on port **3000**.*

### 3️⃣ Access the App
Open your browser and navigate to:
*   **Landing Page**: `http://<your-ip>:3000/`
*   **Teacher Hub**: `http://<your-ip>:3000/teacher`
*   **Student Join**: `http://<your-ip>:3000/student`

*Replace `<your-ip>` with your local IP address (e.g., `192.168.1.12`) to let others join!*

---

## 📸 Screenshots

*(Add your awesome new screenshots here!)*

---

## 📜 License
This project is open-source under the MIT License.
Users may copy, modify, or distribute the project freely.

## 🙌 Credits
QuizLAN was built as a robust local alternative to Kahoot, focused on speed, simplicity, and flexibility.
