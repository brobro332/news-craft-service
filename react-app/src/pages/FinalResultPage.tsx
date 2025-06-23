import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { apiAxios } from "../utils/Api";
import bgImage from "../assets/result-bg.png";

interface Ranking {
  nickname: string;
  score: number;
  rank: number;
}

const FinalResultPage = () => {
  const { sessionId } = useParams();
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  const ordinal = (n: number) => {
    const suffix = ["TH", "ST", "ND", "RD"];
    const v = n % 100;
    return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  };

  useEffect(() => {
    async function fetchFinalRankings() {
      try {
        setLoading(true);
        const res: any[] = await apiAxios(`/quiz-sessions/${sessionId}/scores`);
        const sorted = res.sort((a: any, b: any) => b.point - a.point);

        let rank = 1;
        let lastScore: number | null = null;
        const rankings = sorted.map((item: any, idx: number) => {
          if (lastScore !== item.point) {
            rank = idx + 1;
            lastScore = item.point;
          }

          return {
            nickname: item.participant.nickname,
            score: item.point,
            rank,
          };
        });

        setRankings(rankings);
      } finally {
        setLoading(false);
      }
    }
    fetchFinalRankings();
  }, [sessionId]);

  if (loading)
    return (
      <Layout bgImage={bgImage}>
        <div className="text-center mt-20 text-lg">
          최종 결과 불러오는 중...
        </div>
      </Layout>
    );

  if (rankings.length === 0)
    return (
      <Layout bgImage={bgImage}>
        <div className="text-center mt-20 text-lg">최종 결과가 없습니다.</div>
      </Layout>
    );

  return (
    <Layout bgImage={bgImage}>
      <div className="font-jua min-h-screen flex flex-col items-center justify-center px-4 space-y-8 text-center">
        <h1
          className="font-bungee text-4xl font-extrabold mb-2 px-8 py-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-lg border border-white/20"
          style={{ textShadow: `2px 2px 0 #fff` }}
        >
          RESULT
        </h1>

        <ul className="bg-white bg-opacity-80 rounded-xl shadow-md max-w-md w-full p-6 space-y-4">
          {rankings.map((r) => (
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
          ))}
        </ul>
        <p className="text-sm font-semibold text-black bg-white px-4 py-1 rounded-md shadow-inner inline-block">
          Thanks for joining the quiz!
        </p>
      </div>
    </Layout>
  );
};

export default FinalResultPage;
