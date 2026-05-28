import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import API from "../../../services/api";

import "./Chatbot.css";

import ExerciseQuiz from "../../../components/exercise/ExerciseQuiz";
import Quiz from "../../../components/quiz/Quiz";

export default function Chatbot() {

  const [messages, setMessages] =
    useState([]);

  // ======================================
  // USER
  // ======================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const userId =
    user?.id;

  // ======================================
  // QUIZ STATE
  // ======================================

  const [showQuiz, setShowQuiz] =
    useState(
      !!localStorage.getItem(
        `activeQuiz_${userId}`
      )
    );

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ======================================
  // LIMITER
  // ======================================

  const [pretestScore,
    setPretestScore] =
    useState(0);

  const [exerciseScore,
    setExerciseScore] =
    useState(0);

  const bottomRef =
    useRef(null);

  const getToken = () =>
    localStorage.getItem(
      "accessToken"
    );

  // ======================================
  // FORMAT TEXT
  // ======================================

  const formatText = (text) => {

    if (!text) return "";

    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      )
      .replace(
        /\n/g,
        "<br/>"
      );
  };

  // ======================================
  // FETCH LIMITER
  // ======================================

  const fetchLimiter =
    useCallback(async () => {

      try {

        const res =
          await API.get(
            "/quiz/limiter",
            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }
          );

        setPretestScore(
          res.data.pretestScore
        );

        setExerciseScore(
          res.data.exerciseScore
        );

      } catch (err) {

        console.error(
          "LIMITER ERROR:",
          err.response?.data ||
          err.message
        );
      }

    }, []);

  // ======================================
  // LOAD HISTORY
  // ======================================

  const fetchHistory =
    useCallback(async () => {

      try {

        const res =
          await API.get(
            "/bot/chat-history",
            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }
          );

        const formatted =
          res.data.data.map((msg) => {

            // =========================
            // EXERCISE
            // =========================

            if (msg.exercise_data) {

              return {
                id: msg.id,
                sender: "bot",
                type: "exercise",
                exercise:
                  msg.exercise_data,
              };
            }

            // =========================
            // TEXT
            // =========================

            return {
              id: msg.id,

              sender:
                msg.sender === "ai"
                  ? "bot"
                  : "user",

              type: "text",

              text:
                formatText(
                  msg.message || ""
                ),
            };
          });

        setMessages(
          formatted
        );

      } catch (err) {

        console.error(
          "LOAD HISTORY ERROR:",
          err.response?.data ||
          err.message
        );
      }

    }, []);

  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {

    fetchHistory();

    fetchLimiter();

  }, [
    fetchHistory,
    fetchLimiter
  ]);

  // ======================================
  // AUTO SCROLL
  // ======================================

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages, loading]);

  // ======================================
  // SEND MESSAGE
  // ======================================

  const sendMessage =
    async () => {

      if (!input.trim())
        return;

      const currentInput =
        input;

      setInput("");

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          type: "text",
          text: currentInput,
        },
      ]);

      setLoading(true);

      try {

        const res =
          await API.post(
            "/bot/chat",
            {
              message:
                currentInput,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }
          );

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "text",
            text:
              formatText(
                res.data.reply
              ),
          },
        ]);

      } catch (err) {

        console.error(
          "CHAT ERROR:",
          err.response?.data ||
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================
  // GENERATE EXERCISE
  // ======================================

  const generateExercise =
    async () => {

      if (
        exerciseScore > 0 &&
        exerciseScore < 80
      ) {

        alert(
          "Anda harus membaca overview kembali sebelum mengerjakan exercise lagi."
        );

        return;
      }

      setLoading(true);

      try {

        await API.post(
          "/exercise/generate",
          {},
          {
            headers: {
              Authorization:
                `Bearer ${getToken()}`
            }
          }
        );

        await fetchHistory();

        await fetchLimiter();

      } catch (err) {

        console.error(
          "GENERATE EXERCISE ERROR:",
          err.response?.data ||
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================
  // GENERATE OVERVIEW
  // ======================================

  const generateOverview =
    async () => {

      setLoading(true);

      try {

        const res =
          await API.post(
            "/bot/overview",
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }
          );

        if (
          exerciseScore > 0 &&
          exerciseScore < 80
        ) {

          setExerciseScore(0);
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "text",
            text:
              formatText(
                res.data.reply
              ),
          },
        ]);

      } catch (err) {

        console.error(
          "OVERVIEW ERROR:",
          err.response?.data ||
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================
  // OPEN QUIZ
  // ======================================

  const openQuiz =
    async () => {

      try {

        const res =
          await API.get(
            "/quiz/limiter",
            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }
          );

        const latestExerciseScore =
          res.data.exerciseScore;

        setExerciseScore(
          latestExerciseScore
        );

        if (
          latestExerciseScore < 80
        ) {

          alert(
            "Selesaikan exercise dengan nilai minimal 80 terlebih dahulu."
          );

          return;
        }

        setShowQuiz(true);

      } catch (err) {

        console.error(
          "OPEN QUIZ ERROR:",
          err.response?.data ||
          err.message
        );
      }
    };

  // ======================================
  // RENDER
  // ======================================

  return (

    <div className="chatbot-container">

      {/* HEADER */}

      <div className="chatbot-header">

        <div className="chatbot-title">
          Powered by HyperCLOVA
        </div>

        <div className="chatbot-actions">

          {/* EXERCISE */}

          <button
            className="btn-exercise"
            onClick={generateExercise}
            disabled={
              exerciseScore > 0 &&
              exerciseScore < 80
            }
          >
            Exercise
          </button>

          {/* OVERVIEW */}

          <button
            className="btn-overview"
            onClick={generateOverview}
          >
            Overview
          </button>

          {/* QUIZ */}

          <button
            className="btn-exercise"
            onClick={openQuiz}
          >
            Quiz
          </button>

        </div>

      </div>

      {/* MESSAGES */}

      <div className="chatbot-messages">

        {messages.map((msg, i) => (

          <div key={i}>

            {msg.type ===
            "exercise" ? (

              <ExerciseQuiz
                quiz={msg.exercise}
              />

            ) : (

              <div
                className={`
                  chatbot-message
                  ${msg.sender}
                `}
                dangerouslySetInnerHTML={{
                  __html: msg.text,
                }}
              />

            )}

          </div>

        ))}

        {/* QUIZ */}

        {showQuiz && (

          <div
            style={{
              marginTop: "20px",
              width: "100%",
            }}
          >

            <Quiz />

          </div>

        )}

        {/* LOADING */}

        {loading && (

          <div className="chatbot-message bot typing">
            Thinking...
          </div>

        )}

        <div ref={bottomRef} />

      </div>

      {/* INPUT */}

      <div className="chatbot-input-wrapper">

        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className="btn-send"
          onClick={sendMessage}
        >
          ➤
        </button>

      </div>

    </div>
  );
}