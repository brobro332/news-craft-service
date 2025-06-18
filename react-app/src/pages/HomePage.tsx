import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/create");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-green-800 drop-shadow">
        Quiz-stream
      </h1>
      <p className="text-gray-700 text-lg md:text-xl mb-10">
        라이브 퀴즈로 함께 학습하고 즐기세요!
      </p>
      <button
        onClick={handleCreateClick}
        className="bg-green-600 text-white text-lg px-8 py-4 rounded-2xl shadow-md hover:bg-green-700 transition-all"
      >
        퀴즈 만들기
      </button>
    </div>
  );
};

export default HomePage;
