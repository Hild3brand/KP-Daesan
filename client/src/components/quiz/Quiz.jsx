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

  const [currentQuestion,
  setCurrentQuestion] =
  useState(0);
  

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

        setCurrentQuestion(0);
        setAnswers({});
        setSubmitted(false);
        setScore(0);

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

      } catch (err) {
        console.error(
          "SUBMIT QUIZ ERROR:",
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

  const question =
  questions[currentQuestion];

  const progress =
  ((currentQuestion + 1)
    / questions.length) * 100;

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

    <div className="quiz-header">

      <div className="quiz-counter">

        {currentQuestion + 1}
        /
        {questions.length}

      </div>

    </div>

    <div className="quiz-progress">

      <div
        className="quiz-progress-fill"
        style={{
          width: `${progress}%`
        }}
      />

    </div>

    <div className="quiz-question">

      <div className="question-text">

        {question.question_text}

      </div>

      <div className="quiz-options">

        {question.options?.map((opt) => (

          <button
            key={opt.option_key}
            onClick={() =>
              selectAnswer(
                question.id,
                opt.option_key
              )
            }
            className={
              answers[question.id] ===
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

        ))}

      </div>

    </div>

    <div className="exercise-navigation">

      <button
        type="button"
        disabled={
          currentQuestion === 0
        }
        onClick={() =>
          setCurrentQuestion(
            prev => prev - 1
          )
        }
      >
        Previous
      </button>

      {currentQuestion ===
      questions.length - 1 ? (

        <button
          className="submit-btn"
          onClick={submitQuiz}
        >
          Finish Quiz
        </button>

      ) : (

        <button
          type="button"
          onClick={() =>
            setCurrentQuestion(
              prev => prev + 1
            )
          }
        >
          Next →
        </button>

      )}

    </div>

  </div>

  );
}