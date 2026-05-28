import {
  useState,
  useEffect,
} from "react";

import API from "../../services/api";

import "./Quiz.css";

export default function Quiz() {

  // =====================================
  // STATES
  // =====================================

  const [questions,
    setQuestions] =
    useState([]);

  const [answers,
    setAnswers] =
    useState({});

  const [loading,
    setLoading] =
    useState(true);

  const [submitted,
    setSubmitted] =
    useState(false);

  const [score,
    setScore] =
    useState(0);

  const [sessionId,
    setSessionId] =
    useState(null);

// =====================================
// STORAGE KEY
// =====================================

const token =
  localStorage.getItem("token");

const storageKey =
  token
    ? `activeQuiz_${token}`
    : "activeQuiz_guest";

  // =====================================
  // LOAD QUIZ
  // =====================================

  useEffect(() => {

    loadQuiz();

  }, []);

  // =====================================
  // LOAD QUIZ FUNCTION
  // =====================================

  const loadQuiz =
    async () => {

      try {

        setLoading(true);

        // =============================
        // CHECK LOCAL STORAGE
        // =============================

        const savedQuiz =
          localStorage.getItem(
            storageKey
          );

        if (savedQuiz) {

          const parsed =
            JSON.parse(savedQuiz);

          setQuestions(
            parsed.questions || []
          );

          setSessionId(
            parsed.sessionId || null
          );

          setAnswers(
            parsed.answers || {}
          );

          setSubmitted(
            parsed.submitted || false
          );

          setScore(
            parsed.score || 0
          );

          setLoading(false);

          return;
        }

        // =============================
        // FETCH QUIZ FROM API
        // =============================

        const res =
          await API.post(
            "/quiz/start"
          );

        console.log(
          "QUIZ RESPONSE:",
          res.data
        );

        const quizData = {

          sessionId:
            res.data.sessionId,

          questions:
            res.data.questions || [],

          answers: {},

          submitted: false,

          score: 0,
        };

        // =============================
        // SET STATE
        // =============================

        setQuestions(
          quizData.questions
        );

        setSessionId(
          quizData.sessionId
        );

        // =============================
        // SAVE STORAGE
        // =============================

        localStorage.setItem(
          storageKey,
          JSON.stringify(
            quizData
          )
        );

      } catch (err) {

        console.error(
          "FETCH QUIZ ERROR:",
          err.response?.data ||
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================
  // SELECT ANSWER
  // =====================================

  const selectAnswer =
    (questionId, option) => {

      const updatedAnswers = {
        ...answers,
        [questionId]: option
      };

      setAnswers(
        updatedAnswers
      );

      // =============================
      // UPDATE STORAGE
      // =============================

      const savedQuiz =
        JSON.parse(
          localStorage.getItem(
            storageKey
          )
        );

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...savedQuiz,
          answers:
            updatedAnswers,
        })
      );
    };

  // =====================================
  // SUBMIT QUIZ
  // =====================================

  const submitQuiz =
    async () => {

      try {

        if (!sessionId) {

          alert(
            "Session quiz tidak ditemukan."
          );

          return;
        }

        if (
          Object.keys(
            answers
          ).length === 0
        ) {

          alert(
            "Jawab minimal 1 soal."
          );

          return;
        }

        const res =
          await API.post(
            "/quiz/submit",
            {
              sessionId,
              answers,
            }
          );

        console.log(
          "SUBMIT RESPONSE:",
          res.data
        );

        setScore(
          res.data.score
        );

        setSubmitted(true);

        // =============================
        // UPDATE STORAGE
        // =============================

        const savedQuiz =
          JSON.parse(
            localStorage.getItem(
              storageKey
            )
          );

        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...savedQuiz,
            submitted: true,
            score:
              res.data.score,
          })
        );

      } catch (err) {

        console.error(
          "SUBMIT ERROR:",
          err.response?.data ||
          err.message
        );
      }
    };

  // =====================================
  // RESET QUIZ
  // =====================================

  const resetQuiz =
    () => {

      localStorage.removeItem(
        storageKey
      );

      window.location.reload();
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="quiz-container">
        Loading...
      </div>
    );
  }

  // =====================================
  // EMPTY
  // =====================================

  if (!questions.length) {

    return (
      <div className="quiz-container">
        Quiz kosong
      </div>
    );
  }

  // =====================================
  // RESULT
  // =====================================

  if (submitted) {

    return (

      <div className="quiz-container">

        <h1 className="quiz-title">
          Quiz Finished
        </h1>

        <div className="quiz-score">

          Score:
          {" "}

          <strong>
            {score}
          </strong>

        </div>

        <button
          className="submit-btn"
          onClick={resetQuiz}
          style={{
            marginTop: "20px"
          }}
        >
          Restart Quiz
        </button>

      </div>
    );
  }

  // =====================================
  // RENDER
  // =====================================

  return (

    <div className="quiz-container">

      <h1 className="quiz-title">
        Quiz
      </h1>

      {questions.map((q, index) => {

        return (

          <div
            key={q.id}
            className="quiz-question"
          >

            <div className="question-text">

              {index + 1}.
              {" "}

              {q.question_text}

            </div>

            <div className="quiz-options">

              {q.options?.map((opt) => {

                return (

                  <button
                    key={opt.option_key}
                    onClick={() =>
                      selectAnswer(
                        q.id,
                        opt.option_key
                      )
                    }
                    className={
                      answers[q.id] ===
                      opt.option_key
                        ? "quiz-option active"
                        : "quiz-option"
                    }
                  >

                    <strong>
                      {opt.option_key}
                    </strong>

                    {" - "}

                    {opt.option_text}

                  </button>

                );
              })}

            </div>

          </div>

        );
      })}

      <button
        className="submit-btn"
        onClick={submitQuiz}
      >
        Finish Quiz
      </button>

    </div>

  );
}