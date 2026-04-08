import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

// PASTE YOUR 200 QUESTIONS HERE (I left 5 as a template)
const allQuizData = [
  { id: 1, question: "Who is the author of 'The Lekki Headmaster'?", options: ["A) Wole Soyinka", "B) Kabir Alabi Garba", "C) Chinua Achebe", "D) Akeem Lasisi"], answer: 1 },
  { id: 2, question: "What is the full name of the protagonist?", options: ["A) Jeremi Amos", "B) Mr. Ope Wande", "C) Adebepo Adewale", "D) Funso Daniels"], answer: 2 },
  { id: 3, question: "What nickname do the students affectionately call the principal?", options: ["A) Oga Tisa", "B) Principoo", "C) Lekki Boss", "D) Mr. Wala"], answer: 1 },
  { id: 4, question: "What chronic ailment did the Managing Director suffer from?", options: ["A) Migraines", "B) Asthma", "C) Peppery pain in her buttocks", "D) High blood pressure"], answer: 2 },
  { id: 5, question: "How much was the new maximum loan limit set by the Stardom Board?", options: ["A) N100,000", "B) N250,000", "C) N500,000", "D) N2 million"], answer: 1 }
];

// Helper Function: Shuffles the array so users get random questions
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function App() {
  const [screen, setScreen] = useState("login"); 
  const [name, setName] = useState("");
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attemptResult, setAttemptResult] = useState(0);

  // 1. On Load: Check if name is locked in localStorage for 15 days
  useEffect(() => {
    const lockedData = JSON.parse(localStorage.getItem("utme_username_lock"));
    if (lockedData) {
      const now = new Date().getTime();
      if (now < lockedData.expiry) {
        setName(lockedData.name);
        setIsNameLocked(true);
      } else {
        localStorage.removeItem("utme_username_lock");
      }
    }
  }, []);

  // 2. Timer Countdown Logic
  useEffect(() => {
    if (screen !== "quiz") return;
    if (timeLeft <= 0) {
      handleEndQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, screen]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startQuiz = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return alert("Please enter your name!");
    
    // Lock Name for 15 Days
    if (!isNameLocked) {
      const expiryTime = new Date().getTime() + (15 * 24 * 60 * 60 * 1000);
      localStorage.setItem("utme_username_lock", JSON.stringify({ name: trimmedName, expiry: expiryTime }));
      setIsNameLocked(true);
    }

    // Shuffle and pick requested amount of questions
    const requestedAmount = Math.min(Math.max(Number(numQuestions), 5), allQuizData.length);
    const shuffled = shuffleArray(allQuizData).slice(0, requestedAmount);
    
    setActiveQuestions(shuffled);
    setCurrentQ(0);
    setScore(0);
    setSelectedOpt(null);
    setTimeLeft(requestedAmount * 45); // Automatically gives 45 seconds per question
    setScreen("quiz");
  };

  const nextQuestion = () => {
    let newScore = score;
    if (selectedOpt === activeQuestions[currentQ].answer) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      handleEndQuiz(newScore);
    }
  };

  const handleEndQuiz = async (finalScore = score) => {
    setScreen("result");
    setScore(finalScore);
    
    const percentage = Number(((finalScore / activeQuestions.length) * 100).toFixed(2));
    setAttemptResult(percentage);
    
    setLoading(true);
    try {
      const userName = name.trim();
      
      // Check if user exists in leaderboard
      const { data: existingUser } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("name", userName)
        .single();

      if (existingUser) {
        const oldAvg = existingUser.average_percentage || 0;
        const oldAttempts = existingUser.total_attempts || 0;
        
        // Calculate new cumulative average
        const newAvg = ((oldAvg * oldAttempts) + percentage) / (oldAttempts + 1);
        
        await supabase
          .from("leaderboard")
          .update({
            average_percentage: Number(newAvg.toFixed(2)),
            total_attempts: oldAttempts + 1,
            last_attempt: new Date().toISOString()
          })
          .eq("name", userName);
      } else {
        await supabase
          .from("leaderboard")
          .insert({
            name: userName,
            average_percentage: percentage,
            total_attempts: 1,
            last_attempt: new Date().toISOString()
          });
      }
    } catch (e) {
      console.error("Error saving to global leaderboard: ", e);
    }
    setLoading(false);
  };

  const fetchLeaderboard = async () => {
    setScreen("leaderboard");
    setLoading(true);
    try {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .order("average_percentage", { ascending: false })
        .limit(50);
      
      setLeaderboard(data || []);
    } catch (e) {
      console.error("Error fetching leaderboard: ", e);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {screen === "login" && (
        <>
          <h1>UTME Mock Exam</h1>
          <h2>The Lekki Headmaster</h2>
          
          {isNameLocked ? (
             <p style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "0.9rem" }}>
               🔒 Your name is locked to this device for 15 days to prevent cheating.
             </p>
          ) : (
            <p>Enter your real name. It will be locked for 15 days!</p>
          )}

          <input 
            type="text" 
            placeholder="Enter your full name..." 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={isNameLocked}
          />

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ fontWeight: "600", color: "#333" }}>Select Number of Questions:</label>
            <input 
              type="number" 
              min="5" 
              max={allQuizData.length} 
              value={numQuestions} 
              onChange={(e) => setNumQuestions(e.target.value)}
            />
            <small style={{ color: "#888" }}>Max available: {allQuizData.length} (Randomized)</small>
          </div>

          <button onClick={startQuiz}>Start Exam</button>
          <button className="btn-secondary" onClick={fetchLeaderboard}>View Global Leaderboard</button>
        </>
      )}

      {screen === "quiz" && activeQuestions.length > 0 && (
        <>
          <div className="header">
            <span>Question {currentQ + 1} of {activeQuestions.length}</span>
            <span className="timer">⏱ {formatTime(timeLeft)}</span>
          </div>
          <div className="question">{activeQuestions[currentQ].question}</div>
          <div className="options">
            {activeQuestions[currentQ].options.map((opt, i) => (
              <div key={i} className={`option ${selectedOpt === i ? "selected" : ""}`} onClick={() => setSelectedOpt(i)}>
                {opt}
              </div>
            ))}
          </div>
          <button style={{ marginTop: "20px" }} disabled={selectedOpt === null} onClick={nextQuestion}>
            {currentQ === activeQuestions.length - 1 ? "Submit Exam" : "Next Question"}
          </button>
        </>
      )}

      {screen === "result" && (
        <>
          <h1>Exam Completed!</h1>
          <div className="score-display">{attemptResult}%</div>
          <p>You scored {score} out of {activeQuestions.length}.</p>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            {loading ? "Saving to global database..." : "Your average has been updated globally!"}
          </p>
          <button onClick={fetchLeaderboard} disabled={loading}>View Global Leaderboard</button>
          <button className="btn-secondary" onClick={() => setScreen("login")}>Take Another Batch</button>
        </>
      )}

      {screen === "leaderboard" && (
        <>
          <h1>🌍 Global Ranking</h1>
          <p style={{fontSize: "0.85rem", color: "#666"}}>Ranked by Cumulative Average Percentage</p>
          {loading ? <p>Loading scores from cloud...</p> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Rank</th><th>Name</th><th>Avg %</th><th>Attempts</th></tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td>#{index + 1}</td>
                      <td>{entry.name}</td>
                      <td style={{ color: "#00c853", fontWeight: "bold" }}>{entry.average_percentage}%</td>
                      <td style={{ textAlign: "center" }}>{entry.total_attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button onClick={() => setScreen("login")}>Back to Home</button>
        </>
      )}
    </div>
  );
}
