import { useNavigate } from "react-router-dom";
import bgImage from "../assets/home-bg.png";
import Layout from "../components/Layout";

const HomePage = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/create");
  };

  return (
    <Layout bgImage={bgImage}>
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h1
          className="font-bungee flex items-center justify-center text-5xl font-extrabold mb-6  px-8 py-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-lg border border-white/20"
          style={{ textShadow: `2px 2px 0 #1f2937` }}
        >
          <span className="text-green-800">Q</span>
          <span className="text-red-500">S</span>
          <span className="text-yellow-500">T</span>
          <span className="text-blue-500">R</span>
        </h1>
        <button
          onClick={handleCreateClick}
          className="font-bungee bg-green-500 text-white text-lg px-8 py-4 rounded-xl shadow-[4px_4px_0_0_#3b873e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          START
        </button>
      </div>
    </Layout>
  );
};

export default HomePage;
