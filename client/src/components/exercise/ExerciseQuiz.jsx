import {
  useState,
  useEffect,
} from "react";

import API from "../../services/api";

import "./ExerciseQuiz.css";

export default function ExerciseQuiz({
  quiz,
}) {

  // ======================================
  // QUESTIONS
  // ======================================

  const questions =
    quiz?.questions ||
    quiz?.exercise_questions ||
    [];

  // ======================================
  // CURRENT STAGE
  // ======================================

  const currentStage =
    quiz?.stage_code ||
    "A1";

  const stageTitleMap = {
    R1: "Recognizing Hangul",
    R2: "Reading Basic Words",
    A1: "Using Expression",
    A2: "Daily Conversation",
    B1: "Intermediate Grammar",
    B2: "Advanced Conversation",
  };

  const currentStageTitle =
    stageTitleMap[currentStage] ||
    "Learning Stage";

  // ======================================
  // STATES
  // ======================================

  const [currentQuestion,
    setCurrentQuestion] =
    useState(0);

  const [answers,
    setAnswers] =
    useState({});

  const [feedback,
    setFeedback] =
    useState({});

  const [lockedQuestions,
    setLockedQuestions] =
    useState({});

  const [submitted,
    setSubmitted] =
    useState(false);

  const [score,
    setScore] =
    useState(0);

  const [finalFeedback,
    setFinalFeedback] =
    useState("");

  const [activeTab,
    setActiveTab] =
    useState("feedback");

  const [loadingFeedback,
    setLoadingFeedback] =
    useState(false);

  // ======================================
  // LOAD QUIZ
  // ======================================

  useEffect(() => {

    const isCompleted =
      String(
        quiz?.status || ""
      ).toLowerCase() ===
      "completed";

    setSubmitted(
      isCompleted
    );

    setFinalFeedback(
      quiz?.final_feedback || ""
    );

    const ans = {};
    const fb = {};
    const locked = {};

    // ======================================
    // COMPLETED QUIZ
    // ======================================

    if (
      isCompleted &&
      Array.isArray(
        questions
      )
    ) {

      questions.forEach(
        (q) => {

          if (
            q.answer_data
          ) {

            ans[q.id] =
              q.answer_data
                .user_answer;

            fb[q.id] = {
              is_correct:
                Boolean(
                  q.answer_data
                    .is_correct
                ),

              feedback:
                q.answer_data
                  .ai_feedback,

              correct_answer:
                q.correct_answer,

              mastery:
                q.mastery_if_correct,

              error_profile:
                q.error_profile_if_wrong,
            };

            locked[q.id] =
              true;
          }
        }
      );
    }

    // ======================================
    // PREVIOUS ANSWERS
    // ======================================

    if (
      quiz?.previous_answers &&
      Array.isArray(
        quiz.previous_answers
      )
    ) {

      quiz.previous_answers
        .forEach((item) => {

          ans[
            item.exercise_question_id
          ] =
            item.user_answer;

          fb[
            item.exercise_question_id
          ] = {
            is_correct:
              item.is_correct,

            feedback:
              item.ai_feedback,
          };

          locked[
            item.exercise_question_id
          ] = true;
        });
    }

    setAnswers(ans);

    setFeedback(fb);

    setLockedQuestions(
      locked
    );

    // ======================================
    // AUTO COUNT SCORE
    // ======================================

    const totalCorrect =
      Object.values(
        fb
      ).filter(
        (item) =>
          item?.is_correct
      ).length;

    setScore(
      totalCorrect
    );

  }, [quiz, questions]);

  // ======================================
  // EMPTY
  // ======================================

  if (!questions.length) {

    return (
      <div className="exercise-container">
        Quiz tidak tersedia
      </div>
    );
  }

  // ======================================
  // CURRENT QUESTION
  // ======================================

const question =
  questions[currentQuestion];

if (!question) {

  return (

    <div className="exercise-container">

      <h2>
        Quiz Finished
      </h2>

      <div className="final-feedback">

        <p>

          Score:
          {" "}

          <strong>
            {score}
            {" / "}
            {questions.length}
          </strong>

        </p>

        <div
          style={{
            whiteSpace: "pre-wrap"
          }}
        >
          {finalFeedback}
        </div>

      </div>

    </div>
  );
}

  const isLocked =
    lockedQuestions[
      question.id
    ] || submitted;

  const currentFeedback =
    feedback[
      question.id
    ];

  // ======================================
  // PROGRESS
  // ======================================

  const progress =
    ((currentQuestion + 1)
      / questions.length) * 100;

  // ======================================
  // HANDLE ANSWER
  // ======================================

  const handleAnswer =
    async (value) => {

      if (
        submitted ||
        isLocked
      ) return;

      if (!value) return;

      try {

        setLoadingFeedback(
          true
        );

        const res =
          await API.post(
            "/exercise/submit-answer",
            {
              exercise_session_id:
                quiz.id,

              exercise_question_id:
                question.id,

              user_answer:
                value,
            }
          );

        setAnswers((prev) => ({
          ...prev,
          [question.id]:
            value,
        }));

        const updatedFeedback = {
          ...feedback,
          [question.id]: {
            is_correct:
              res.data.is_correct,

            feedback:
              res.data.feedback,

            correct_answer:
              question.correct_answer,

            mastery:
              question.mastery_if_correct,

            error_profile:
              question.error_profile_if_wrong,
          }
        };

        setFeedback(
          updatedFeedback
        );

        // ======================================
        // UPDATE SCORE
        // ======================================

        const totalCorrect =
          Object.values(
            updatedFeedback
          ).filter(
            (item) =>
              item?.is_correct
          ).length;

        setScore(
          totalCorrect
        );

        // ======================================
        // LOCK QUESTION
        // ======================================

        setLockedQuestions(
          (prev) => ({
            ...prev,
            [question.id]:
              true,
          })
        );

      } catch (err) {

        console.error(
          "ANSWER ERROR:",
          err.response?.data ||
          err.message
        );

      } finally {

        setLoadingFeedback(
          false
        );
      }
    };

 // ======================================
// SUBMIT QUIZ
// ======================================

const submitQuiz =
  async () => {

    try {

      const res =
        await API.post(
          "/exercise/submit",
          {
            exercise_session_id:
              quiz.id,
          }
        );

      // ======================================
      // SET SUBMITTED
      // ======================================

      setSubmitted(true);

      // ======================================
      // FINAL FEEDBACK
      // ======================================

      setFinalFeedback(
        res.data.feedback
      );

      // ======================================
      // RELOAD SETELAH FEEDBACK TAMPIL
      // ======================================

      // setTimeout(() => {

      //   window.location.reload();

      // }, 1500);

    } catch (err) {

      console.error(
        "SUBMIT ERROR:",
        err.response?.data ||
        err.message
      );
    }
  };
  // ======================================
  // OPTION CLASS
  // ======================================

  const getOptionClass =
    (optKey) => {

      const selected =
        answers[
          question.id
        ] === optKey;

      if (
        currentFeedback
          ?.is_correct &&
        selected
      ) {

        return "correct";
      }

      if (
        !currentFeedback
          ?.is_correct &&
        selected
      ) {

        return "wrong";
      }

      return "";
    };

  // ======================================
  // PARAPHRASING OPTIONS
  // ======================================

  const paraphrasingOptions =
    question.options &&
    question.options.length > 0
      ? question.options
      : [
          {
            key: "A",
            text:
              question.correct_answer
          }
        ];

  // ======================================
  // RENDER
  // ======================================

  return (

    <div className="exercise-wrapper">

      <div className="exercise-container">

        {/* HEADER */}

        <div className="quiz-header">

          <div className="quiz-stage">
            Stage {currentStage} · {currentStageTitle}
          </div>

          <div className="quiz-counter">
            {currentQuestion + 1}
            /
            {questions.length}
          </div>

        </div>

        {/* PROGRESS */}

        <div className="quiz-progress">

          <div
            className="quiz-progress-fill"
            style={{
              width:
                `${progress}%`
            }}
          />

        </div>

        {/* STATUS */}

        <div className="exercise-status">

          {submitted ? (

            <span className="completed">
              Completed
            </span>

          ) : (

            <span className="ongoing">
              Ongoing
            </span>

          )}

        </div>

        {/* CONTEXT */}

        {question.context && (

          <div className="question-context-box">
            ✈️ {question.context}
          </div>

        )}

        {/* QUESTION */}

        <div className="exercise-question">

          {question.question ||
            question.question_text}

        </div>

        {/* LOADING */}

        {loadingFeedback && (

          <div className="feedback-loading">
            Generating feedback...
          </div>

        )}

        {/* MULTIPLE CHOICE */}

        {(question.type ===
          "multiple_choice" ||

          question.question_type ===
          "multiple_choice" ||

          question.question_type ===
          "mcq") && (

          <div className="exercise-options">

            {question.options?.map(
              (opt) => {

                const key =
                  opt.key ||
                  opt.option_key;

                return (

                  <button
                    key={opt.id || key}
                    type="button"
                    disabled={
                      isLocked ||
                      loadingFeedback
                    }
                    onClick={() =>
                      handleAnswer(
                        key
                      )
                    }
                    className={`
                      exercise-option
                      ${getOptionClass(
                        key
                      )}
                    `}
                  >

                    <strong>
                      {key}.
                    </strong>

                    {" "}

                    {
                      opt.text ||
                      opt.option_text
                    }

                  </button>
                );
              }
            )}

          </div>

        )}

        {/* TRUE FALSE */}

        {(question.type ===
          "true_false" ||

          question.question_type ===
          "true_false") && (

          <div className="exercise-options">

            {[
              {
                key: "True",
                text: "True"
              },
              {
                key: "False",
                text: "False"
              }
            ].map((opt) => (

              <button
                key={opt.key}
                type="button"
                disabled={
                  isLocked ||
                  loadingFeedback
                }
                onClick={() =>
                  handleAnswer(
                    opt.key
                  )
                }
                className={`
                  exercise-option
                  ${getOptionClass(
                    opt.key
                  )}
                `}
              >

                <strong>
                  {opt.key}
                </strong>

              </button>

            ))}

          </div>

        )}

        {/* ESSAY / FILL BLANK */}

        {(question.type ===
          "essay" ||

          question.type ===
          "fill_in_blank" ||

          question.question_type ===
          "essay" ||

          question.question_type ===
          "fill_in_blank" ||

          question.question_type ===
          "fill_blank") && (

          <div className="fill-blank-wrapper">

            <textarea
              disabled={
                isLocked ||
                loadingFeedback
              }
              value={
                answers[
                  question.id
                ] || ""
              }
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]:
                    e.target.value,
                }))
              }
              placeholder="Write your answer..."
              className="essay-input"
            />

            <button
              type="button"
              disabled={
                isLocked ||
                loadingFeedback
              }
              onClick={() =>
                handleAnswer(
                  answers[
                    question.id
                  ]
                )
              }
            >
              Submit Answer
            </button>

          </div>

        )}

        {/* PARAPHRASING */}

        {(question.type ===
          "paraphrasing_reason" ||

          question.question_type ===
          "paraphrasing_reason") && (

          <div className="exercise-options">

            {paraphrasingOptions.map(
              (opt) => {

                const key =
                  opt.key ||
                  opt.option_key;

                return (

                  <button
                    key={key}
                    type="button"
                    disabled={
                      isLocked ||
                      loadingFeedback
                    }
                    onClick={() =>
                      handleAnswer(
                        key
                      )
                    }
                    className={`
                      exercise-option
                      ${getOptionClass(
                        key
                      )}
                    `}
                  >

                    <strong>
                      {key}.
                    </strong>

                    {" "}

                    {
                      opt.text ||
                      opt.option_text
                    }

                  </button>
                );
              }
            )}

          </div>

        )}

        {/* FEEDBACK */}

        {currentFeedback && (

          <div className="feedback-wrapper">

            <div
              className={`
                feedback-banner
                ${currentFeedback
                  ?.is_correct
                    ? "correct-banner"
                    : "wrong-banner"}
              `}
            >

              {currentFeedback
                ?.is_correct
                  ? "✓ Benar! Jawaban kamu tepat."
                  : `Kurang tepat. Jawaban benar adalah ${question.correct_answer}.`
              }

            </div>

            <div className="feedback-tabs">

              <button
                className={
                  activeTab ===
                  "feedback"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "feedback"
                  )
                }
              >
                Penjelasan
              </button>

              <button
                className={
                  activeTab ===
                  "correct"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "correct"
                  )
                }
              >
                Kenapa benar
              </button>

              <button
                className={
                  activeTab ===
                  "wrong"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "wrong"
                  )
                }
              >
                Kenapa salah
              </button>

            </div>

            <div className="feedback-content">

              {/* PENJELASAN */}

              {activeTab ===
                "feedback" && (

                <div className="option-explanations">

                  {/* AI FEEDBACK */}

                  <div className="feedback-main">

                    {
                      currentFeedback
                        ?.feedback
                    }

                  </div>

                  {/* ERROR PROFILE */}

                  {currentFeedback
                    ?.error_profile && (

                    <div
                      className="error-profile-box"
                      style={{
                        marginTop: "18px",
                      }}
                    >

                      <h4>
                        Kesalahan yang ditemukan
                      </h4>

                      <div>
                        {
                          currentFeedback
                            ?.error_profile
                        }
                      </div>

                    </div>

                  )}

                  {/* EXPLANATION PER OPTION */}

                  {(question.type ===
                    "multiple_choice" ||

                    question.question_type ===
                    "multiple_choice" ||

                    question.question_type ===
                    "mcq") && (

                    <div
                      className="option-explanation-list"
                      style={{
                        marginTop: "20px",
                      }}
                    >

                      <h4>
                        Penjelasan Setiap Pilihan
                      </h4>

                      {question.options?.map(
                        (opt) => {

                          const key =
                            opt.key ||
                            opt.option_key;

                          const text =
                            opt.text ||
                            opt.option_text;

                          const isCorrect =
                            key ===
                            question.correct_answer;

                          return (

                            <div
                              key={key}
                              className={`
                                option-explanation-item
                                ${
                                  isCorrect
                                    ? "correct-option"
                                    : "wrong-option"
                                }
                              `}
                              style={{
                                padding: "14px",
                                borderRadius: "10px",
                                marginBottom: "12px",
                                border:
                                  isCorrect
                                    ? "1px solid #22c55e"
                                    : "1px solid #ef4444",
                                background:
                                  isCorrect
                                    ? "#f0fdf4"
                                    : "#fef2f2",
                              }}
                            >

                              <div
                                style={{
                                  fontWeight: "700",
                                  marginBottom: "8px",
                                }}
                              >

                                {key}.
                                {" "}
                                {text}

                              </div>

                              <div>

                                {isCorrect ? (

                                  <>
                                    ✓ Pilihan ini benar karena sesuai dengan konteks soal, tata bahasa, dan makna kalimat yang diminta.
                                  </>

                                ) : (

                                  <>
                                    ✗ Pilihan ini salah karena tidak sesuai dengan konteks atau struktur kalimat yang benar.
                                  </>

                                )}

                              </div>

                            </div>

                          );
                        }
                      )}

                    </div>

                  )}

                </div>

              )}

              {/* KENAPA BENAR */}

              {activeTab ===
                "correct" && (

                <div>

                  {
                    currentFeedback
                      ?.mastery ||

                    "Jawaban ini sesuai dengan konteks pertanyaan."
                  }

                </div>

              )}

              {/* KENAPA SALAH */}

              {activeTab ===
                "wrong" && (

                <div>

                  {
                    currentFeedback
                      ?.error_profile ||

                    "Pilihan lain tidak sesuai konteks."
                  }

                </div>

              )}

            </div>

          </div>

        )}

        {/* NAVIGATION */}

        <div className="exercise-navigation">

          <button
            type="button"
            className="secondary-btn"
            disabled={
              currentQuestion === 0
            }
            onClick={() =>
              setCurrentQuestion(
                (prev) => prev - 1
              )
            }
          >
            Previous
          </button>

          {currentQuestion ===
          questions.length - 1 ? (

            !submitted && (

              <button
                type="button"
                className="primary-btn"
                onClick={submitQuiz}
              >
                Finish Quiz
              </button>

            )

          ) : (

            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                setCurrentQuestion(
                  (prev) => prev + 1
                )
              }
            >
              Soal Berikutnya →
            </button>

          )}

        </div>

        {/* FINAL RESULT */}

        {submitted && (

          <div className="final-feedback">

            <h3>
              Final Result
            </h3>

            <p>

              Score:
              {" "}

              <strong>
                {score}
                {" / "}
                {questions.length}
              </strong>

            </p>

            <div
              style={{
                whiteSpace:
                  "pre-wrap"
              }}
            >
              {finalFeedback}
            </div>

          </div>

        )}

      </div>

    </div>
  );
}