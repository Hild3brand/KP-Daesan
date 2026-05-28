import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../../services/api";

import "./Pretest.css";

export default function Pretest() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // START STATE
  const [started, setStarted] = useState(false);

  // SUCCESS MODAL
  const [showResultModal, setShowResultModal] =
    useState(false);

  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    checkPretest();
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/pretest");

      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkPretest = async () => {
    try {
      const res = await API.get("/pretest/check");

      if (res.data.hasPretest) {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswer = (qid, value) => {
    setAnswers({
      ...answers,
      [qid]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post(
        "/pretest/submit",
        { answers }
      );

      setScore(res.data.score);

      setShowResultModal(true);

    } catch (err) {

      console.log(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // START SCREEN
  if (!started) {
    return (
      <div className="pretest-start">

        <div className="pretest-start-card">

          <h1>Pretest</h1>

          <p>
            Pretest ini digunakan untuk mengetahui
            kemampuan awal bahasa Korea kamu.
          </p>

          <p>
            Pastikan kamu menjawab seluruh soal
            dengan jujur.
          </p>

          <button
            className="pretest-start-btn"
            onClick={() => setStarted(true)}
          >
            Start Pretest
          </button>

        </div>

      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="pretest-container">

      {/* RESULT MODAL */}
      {showResultModal && (

        <div
          className="
            modal
            fade
            show
          "
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor:
              "rgba(0,0,0,0.5)",
            zIndex: 9999,
          }}
        >

          <div
            className="
              modal-dialog
              modal-dialog-centered
            "
          >

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Pretest Selesai
                </h5>

              </div>

              <div className="modal-body">

                <div
                  style={{
                    textAlign: "center",
                    width: "100%",
                  }}
                >

                  <p
                    style={{
                      marginBottom: "20px",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    Selamat, kamu telah menyelesaikan pretest.
                  </p>

                  <h3>
                    Score: {Math.floor(score)}
                  </h3>

              </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="
                    btn
                    btn-primary
                  "
                  onClick={() => {
                    window.location.href =
                      "/student/dashboard";
                  }}
                >
                  OK
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* LEFT = NUMBER */}
      <div className="pretest-right">

        <h4>Nomor Soal</h4>

        <div className="pretest-grid">
          {questions.map((item, index) => {
            const isAnswered =
              answers[item.id];

            const isActive =
              index === current;

            return (
              <div
                key={item.id}
                onClick={() => setCurrent(index)}
                className={`
                  pretest-number
                  ${isActive ? "active" : ""}
                  ${isAnswered ? "answered" : ""}
                `}
              >
                {index + 1}
              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT = QUESTION */}
      <div className="pretest-left">

        <h3>
          Soal {current + 1} dari{" "}
          {questions.length}
        </h3>

        <p className="pretest-question-title">
          {q.question}
        </p>

        {q.options.map((opt) => (
          <label
            key={opt.label}
            className={`
              pretest-option
              ${
                answers[q.id] === opt.label
                  ? "active"
                  : ""
              }
            `}
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt.label}
              checked={
                answers[q.id] === opt.label
              }
              onChange={() =>
                handleAnswer(
                  q.id,
                  opt.label
                )
              }
            />

            {" "}
            {opt.label}. {opt.text}
          </label>
        ))}

        <div className="pretest-nav">

          <button
            className="pretest-btn"
            disabled={current === 0}
            onClick={() =>
              setCurrent(current - 1)
            }
          >
            Previous
          </button>

          <button
            className="pretest-btn next"
            disabled={
              current ===
              questions.length - 1
            }
            onClick={() =>
              setCurrent(current + 1)
            }
          >
            Next
          </button>

          {current ===
            questions.length - 1 && (
            <button
              className="pretest-btn submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}

        </div>

      </div>

    </div>
  );
}