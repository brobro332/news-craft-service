import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { apiAxios } from "../utils/Api";
import bgImage from "../assets/quiz-bg.png";
import { io, Socket } from "socket.io-client";

interface UserQuizPageProps {
  session: any;
}

interface Question {
  id: string;
  content: string;
  options: string[];
  answer: string;
}

interface Ranking {
  nickname: string;
  score: number;
  rank: number;
}

const UserQuizPage: React.FC<UserQuizPageProps> = ({ session }) => {
  const userId = localStorage.getItem("userId");
  const quizId = session.quiz.id;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(
    session.currentQuestionIndex || 0
  );
  const [questionStartTime, setQuestionStartTime] = useState(
    session.questionStartTime || 0
  );
  const [perQuestionTime, setPerQuestionTime] = useState(
    session.perQuestionTime || 10
  );
  const [timeLeft, setTimeLeft] = useState(perQuestionTime);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);

  const socketRef = useRef<Socket | null>(null);

  const ordinal = (n: number) => {
    const suffix = ["TH", "ST", "ND", "RD"];
    const v = n % 100;
    return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const res = await apiAxios(`/quizzes/${quizId}/questions`);
        setQuestions(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000/quiz-sessions");

    socketRef.current.emit("join", { sessionId: session.id, userId: userId });

    socketRef.current.on("update", (data) => {
      setCurrentIndex(data.currentQuestionIndex);
      setQuestionStartTime(data.questionStartTime);
      setPerQuestionTime(data.perQuestionTime);
      setSelectedOption(null);
      setHasSubmitted(false);
      setFeedbackMessage("");
      setShowResult(false);
      setCorrectAnswer(null);
    });

    socketRef.current.on("questionResult", (data) => {
      setCorrectAnswer(data.correctAnswer);
      setRankings(data.rankings);
      setShowResult(true);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [session.id, userId]);

  useEffect(() => {
    if (!questionStartTime) {
      setTimeLeft(perQuestionTime);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - questionStartTime) / 1000;
      const remaining = Math.max(perQuestionTime - elapsed, 0);
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [questionStartTime, perQuestionTime]);

  const handleSubmit = async () => {
    if (!selectedOption || hasSubmitted || showResult) return;

    try {
      const participantRes = await apiAxios(
        `/quiz-sessions/${session.id}/participants/user-id/${userId}`,
        { method: "GET" }
      );

      socketRef.current?.emit("submit", {
        quizSessionId: session.id,
        questionId: questions[currentIndex].id,
        participantId: participantRes.id,
        selectedOption: selectedOption,
      });

      setHasSubmitted(true);
      setFeedbackMessage("✅ Submitted!");
    } catch (err) {
      setFeedbackMessage("❌ Submission failed. Please try again.");
    }
  };

  if (loading)
    return (
      <Layout bgImage={bgImage}>
        <div className="flex flex-col items-center justify-center h-full text-gray-700 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl font-medium">Loading question...</div>
        </div>
      </Layout>
    );

  const currentQuestion = questions[currentIndex];

  return (
    <Layout bgImage={bgImage}>
      <div className="font-jua flex flex-col justify-center items-center min-h-screen px-4 space-y-6">
        <h1
          className="font-bungee text-4xl font-extrabold mb-4 px-8 py-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-lg border border-white/20"
          style={{ textShadow: `2px 2px 0 #fff` }}
        >
          QUESTION
        </h1>

        {showResult ? (
          <div className="bg-white rounded-xl p-6 border shadow max-w-xl w-full space-y-6 animate-fade-in">
            <p className="text-xl font-bold text-green-700">
              <span className="font-bungee">✅ ANSWER</span>
              <span>&nbsp;&nbsp;{correctAnswer}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {rankings.map((r) => {
                return (
                  <li
                    key={r.nickname}
                    className="font-bungee flex justify-between text-lg font-semibold border-b border-gray-300 pb-2 last:border-none"
                  >
                    <span>
                      {ordinal(r.rank)}
                      <span className="font-jua">&nbsp;&nbsp;{r.nickname}</span>
                    </span>
                    <span>{r.score} POINTS</span>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              Please wait for the next step.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border shadow max-w-xl w-full space-y-6">
            <p className="text-gray-600 text-sm">
              {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-gray-700 text-base mt-4">
              <strong className="text-lg">{currentQuestion.content}</strong>
            </p>
            <ul className="mt-4 grid gap-2">
              {currentQuestion.options.map((option, idx) => (
                <li
                  key={idx}
                  className={`px-4 py-2 rounded-md border cursor-pointer transition ${
                    selectedOption === option
                      ? "bg-blue-200 border-blue-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  } ${
                    hasSubmitted && option === selectedOption
                      ? "opacity-60"
                      : ""
                  }`}
                  onClick={() =>
                    !hasSubmitted && !showResult && setSelectedOption(option)
                  }
                >
                  {option}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="font-bungee text-sm text-gray-500">
                {Math.floor(timeLeft)}
              </span>
              <div className="relative w-3/4 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${(timeLeft / perQuestionTime) * 100}%` }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || hasSubmitted || showResult}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                Submit
              </button>
            </div>
            {feedbackMessage && (
              <div className="text-sm text-center text-green-600 mt-2">
                {feedbackMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserQuizPage;
