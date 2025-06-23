import Layout from "../components/Layout";
import bgImage from "../assets/wait-bg.png";

interface SessionWaitingPageProps {
  session: {
    url: string;
  };
  isHost?: boolean;
  onStartQuiz?: () => void;
  participants?: string[];
}

const SessionWaitingPage = ({
  session,
  isHost = false,
  onStartQuiz,
  participants = [],
}: SessionWaitingPageProps) => {
  return (
    <Layout bgImage={bgImage}>
      <div className="font-jua flex flex-col justify-center items-center min-h-screen px-4 text-center space-y-6">
        <h1
          className="font-bungee text-4xl font-extrabold mb-4 px-8 py-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-lg border border-white/20"
          style={{ textShadow: `2px 2px 0 #fff` }}
        >
          WAITING ROOM
        </h1>

        <div className="bg-white rounded-xl p-6 border shadow max-w-xl w-full space-y-4">
          <div className="mt-4 text-left">
            <p className="font-semibold text-xl mb-4 border-b-2 border-yellow-400 pb-2">
              Participants
            </p>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {participants.length > 0 ? (
                participants.map((nickname) => (
                  <li
                    key={nickname}
                    className="flex items-center space-x-3 bg-yellow-50 rounded-md px-3 py-2 shadow-sm hover:bg-yellow-100 transition cursor-default select-none"
                  >
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full" />
                    <span className="text-gray-800 font-medium">
                      {nickname}
                    </span>
                  </li>
                ))
              ) : (
                <li className="italic text-gray-400 text-center">
                  No participants yet.
                </li>
              )}
            </ul>
          </div>
        </div>

        {isHost && onStartQuiz && (
          <button
            onClick={onStartQuiz}
            className={`font-bungee bg-yellow-400 text-white text-base px-7 py-3 rounded-xl shadow-[3px_3px_0_0_#d4a100] transition-all active:shadow-none active:translate-x-1 active:translate-y-1`}
          >
            START QUIZ
          </button>
        )}

        <p className="text-sm font-semibold text-black bg-white px-4 py-1 rounded-md shadow-inner inline-block">
          Please wait until the host starts the quiz
        </p>
      </div>
    </Layout>
  );
};

export default SessionWaitingPage;
