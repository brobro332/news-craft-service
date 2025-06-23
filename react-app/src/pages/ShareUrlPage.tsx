import { useParams } from "react-router-dom";
import bgImage from "../assets/create-bg.png";
import Layout from "../components/Layout";

const ShareUrlPage = () => {
  const { sessionUrl } = useParams();

  const fullUrl = `${window.location.origin}/nickname/${sessionUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert("URL copied to clipboard!");
    } catch (err) {
      alert("Failed to copy the URL.");
    }
  };

  return (
    <Layout bgImage={bgImage}>
      <div className="font-jua flex flex-col justify-center items-center min-h-screen px-4 text-center space-y-6">
        <h1
          className="font-bungee text-4xl font-extrabold mb-4 px-8 py-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-lg border border-white/20"
          style={{ textShadow: `2px 2px 0 #fff` }}
        >
          QUIZ SESSION
        </h1>

        <div className="bg-white rounded-xl p-4 border shadow max-w-xl w-full">
          <input
            readOnly
            value={fullUrl}
            className="w-full p-3 rounded border text-sm"
          />
          <button
            onClick={handleCopy}
            className="font-bungee mt-3 px-6 py-2 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600"
          >
            COPY LINK
          </button>
        </div>

        <p className="text-sm font-semibold text-black bg-white px-4 py-1 rounded-md shadow-inner inline-block">
          Share this link with participants
        </p>
      </div>
    </Layout>
  );
};

export default ShareUrlPage;
