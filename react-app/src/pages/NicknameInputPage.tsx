import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import bgImage from "../assets/wait-bg.png";
import { apiAxios } from "../utils/Api";

const NicknameInputPage = () => {
  const userId = localStorage.getItem("userId");

  const { sessionUrl } = useParams();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    async function fetchSession() {
      const sessionRes = await apiAxios(`/quiz-sessions/url/${sessionUrl}`, {
        method: "GET",
      });
      setQuizTitle(sessionRes.quiz.title);
    }
    fetchSession();
  }, [sessionUrl]);

  const handleJoin = async () => {
    if (!nickname.trim()) {
      alert("Please enter a nickname.");
      return;
    }

    try {
      setIsLoading(true);

      const sessionRes = await apiAxios(`/quiz-sessions/url/${sessionUrl}`, {
        method: "GET",
      });
      const sessionId = sessionRes.id;

      await apiAxios(`/quiz-sessions/${sessionId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { userId, nickname },
      });

      navigate(`/session/${sessionId}`);
    } catch (err) {
      setIsLoading(false);
      alert("Failed to join the session.");
    }
  };

  return (
    <Layout bgImage={bgImage}>
      <div className="font-jua flex flex-col justify-center items-center min-h-screen px-4 text-center space-y-6">
        <h1
          className="font-bungee text-4xl font-extrabold mb-4 px-8 py-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-lg border border-white/20"
          style={{ textShadow: `2px 2px 0 #fff` }}
        >
          ENTER NICKNAME
        </h1>

        <p
          className="text-xl font-bold text-gray-900 bg-yellow-200 px-6 py-2 rounded-lg border border-yellow-300 shadow-lg tracking-wide inline-block"
          style={{ transform: "rotate(-2.5deg)" }}
        >
          {quizTitle}
        </p>

        <input
          type="text"
          placeholder="Your nickname"
          className="w-full max-w-xs px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <button
          onClick={handleJoin}
          disabled={isLoading}
          className={`font-bungee bg-yellow-400 text-white text-base px-7 py-3 rounded-xl shadow-[3px_3px_0_0_#d4a100] transition-all ${
            isLoading
              ? "opacity-60 cursor-not-allowed"
              : "active:shadow-none active:translate-x-1 active:translate-y-1"
          }`}
        >
          {isLoading ? "JOINING..." : "JOIN SESSION"}
        </button>
      </div>
    </Layout>
  );
};

export default NicknameInputPage;
