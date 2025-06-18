import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*
            <Route path="/create" element={<QuizCreatePage />} />
            <Route path="/share/:sessionId" element={<ShareUrlPage />} />
            <Route path="/waiting/:sessionId" element={<SessionWaitingPage />} />
            <Route path="/quiz/:sessionId" element={<UserQuizPage />} />
            <Route path="/host/:sessionId" element={<HostQuizPage />} />
            <Route
              path="/result/:sessionId/question/:questionId"
              element={<QuestionResultPage />}
            />
            <Route path="/result/:sessionId/final" element={<FinalResultPage />} />
          */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
