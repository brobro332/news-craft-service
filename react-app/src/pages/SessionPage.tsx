import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiAxios } from "../utils/Api";
import SessionWaitingPage from "./SessionWaitPage";
import HostQuestionPage from "./HostQuestionPage";
import UserQuestionPage from "./UserQuestionPage";
import { io, Socket } from "socket.io-client";
import FinalResultPage from "./FinalResultPage";

const SessionPage = () => {
  const userId = localStorage.getItem("userId");
  const { sessionId } = useParams();
  const [quizSession, setQuizSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionRes = await apiAxios(`/quiz-sessions/id/${sessionId}`);
        setQuizSession(sessionRes);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !userId) return;

    socketRef.current = io("/quiz-sessions", {
      path: "/socket.io",
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("join", { sessionId, userId });
    });

    socketRef.current.on("update", (data) => {
      setQuizSession((prev: any) => ({
        ...prev,
        currentQuestionIndex: data.currentQuestionIndex,
        questionStartTime: data.questionStartTime,
        perQuestionTime: data.perQuestionTime,
        status: data.status,
      }));
    });

    socketRef.current.on("participants", (nicknames: string[]) => {
      setParticipants(nicknames);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, userId]);

  const handleStartQuiz = async () => {
    await apiAxios(`/quiz-sessions/${quizSession.id}`, {
      method: "POST",
    });
  };

  if (loading) return <div>로딩 중...</div>;
  if (!quizSession) return <div>세션 없음</div>;

  const ownerId = quizSession.quiz.ownerId;

  switch (quizSession.status) {
    case "waiting":
      return (
        <SessionWaitingPage
          session={quizSession}
          isHost={userId === ownerId}
          onStartQuiz={handleStartQuiz}
          participants={participants}
        />
      );
    case "in_progress":
      return userId === ownerId ? (
        <HostQuestionPage session={quizSession} />
      ) : (
        <UserQuestionPage session={quizSession} />
      );
    case "finished":
      return <FinalResultPage />;
    default:
      return <div>알 수 없는 상태</div>;
  }
};

export default SessionPage;
