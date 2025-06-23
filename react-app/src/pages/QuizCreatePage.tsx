import { useState } from "react";
import bgImage from "../assets/create-bg.png";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { apiAxios } from "../utils/Api";

interface Question {
  content: string;
  options: string[];
  answer: string | null;
}

const QuizCreatePage = () => {
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { content: "", options: ["", "", "", ""], answer: null },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "text") updated[index].content = value;
    setQuestions(updated);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = ["", "", "", ""];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answer = value;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { content: "", options: ["", "", "", ""], answer: null },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return;
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (
      !quizTitle.trim() ||
      questions.some(
        (q) =>
          !q.content.trim() ||
          q.options.some((o) => !o.trim()) ||
          q.answer === null
      )
    ) {
      alert("Please fill in all fields or select the correct answer.");
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId");

      const quizRes = await apiAxios("/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { title: quizTitle, ownerId: userId },
      });

      const quizId = quizRes.id;

      await Promise.all(
        questions.map((q) =>
          apiAxios(`/quizzes/${quizId}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: q,
          })
        )
      );

      const sessionRes = await apiAxios(`/quizzes/${quizId}/quiz-sessions`, {
        method: "POST",
      });

      const sessionUrl = sessionRes.url;

      navigate(`/share/${sessionUrl}`);
    } catch (err) {
      alert("An error occurred while creating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout bgImage={bgImage}>
      <div className="font-jua flex flex-col justify-center items-center min-h-screen px-4 max-w-5xl mx-auto text-center space-y-5">
        <h1
          className="font-bungee text-4xl font-extrabold mb-2 px-8 py-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-lg border border-white/20"
          style={{ textShadow: `2px 2px 0 #fff` }}
        >
          QUIZ
        </h1>

        <input
          type="text"
          placeholder="Enter a title"
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />

        <div className="flex overflow-x-auto space-x-4 pb-3 snap-x w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="min-w-[300px] snap-start bg-white/80 rounded-xl p-4 shadow-md border border-gray-300 hover:shadow-lg transition-all"
            >
              <div className="font-bungee mb-2 text-left text-sm text-gray-800">
                QUESTION {qIndex + 1}
              </div>

              <textarea
                placeholder="Enter a question"
                className="w-full mb-3 px-3 py-1.5 rounded-md border border-gray-300 resize-none text-sm"
                value={q.content}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "text", e.target.value)
                }
              />

              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center mb-1.5">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    className="mr-2 accent-red-500"
                    checked={q.answer === opt}
                    onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-300 text-sm"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                  />
                </div>
              ))}

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 mt-2 rounded-md border border-red-300 shadow hover:bg-red-200 hover:shadow-md transition duration-200"
                >
                  - Remove a question
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-yellow-200 text-gray-800 font-bold px-5 py-2.5 rounded-lg shadow-lg border border-yellow-300 hover:bg-yellow-300 hover:shadow-xl transform hover:-translate-y-1 hover:rotate-1 transition-all duration-200"
          style={{ rotate: "-2deg" }}
        >
          + Add a question
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`font-bungee bg-red-500 text-white text-base px-7 py-3 rounded-xl shadow-[3px_3px_0_0_#b91c1c] transition-all ${
            isLoading
              ? "opacity-60 cursor-not-allowed"
              : "active:shadow-none active:translate-x-1 active:translate-y-1"
          }`}
        >
          {isLoading ? "CREATING..." : "CREATE QUIZ"}
        </button>
      </div>
    </Layout>
  );
};

export default QuizCreatePage;
