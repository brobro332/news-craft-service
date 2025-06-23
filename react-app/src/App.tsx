import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizCreatePage from "./pages/QuizCreatePage";
import { AnimatePresence, motion } from "framer-motion";
import ShareUrlPage from "./pages/ShareUrlPage";
import NicknameInputPage from "./pages/NicknameInputPage";
import SessionPage from "./pages/SessionPage";
import { useEffect } from "react";

const pageVariants = {
  initial: { opacity: 0, x: 100 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -100 },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.4,
};

function App() {
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      const uuid = crypto.randomUUID(); // 브라우저 내장 UUID 생성기
      localStorage.setItem("userId", uuid);
    }
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/create"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <QuizCreatePage />
            </motion.div>
          }
        />
        <Route
          path="/share/:sessionUrl"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ShareUrlPage />
            </motion.div>
          }
        />
        <Route path="/nickname/:sessionUrl" element={<NicknameInputPage />} />
        <Route path="/session/:sessionId" element={<SessionPage />} />
        {/*
          <Route path="/quiz/:sessionId" element={<UserQuizPage />} />
          <Route path="/host/:sessionId" element={<HostQuizPage />} />
          <Route
            path="/result/:sessionId/question/:questionId"
            element={<QuestionResultPage />}
          />
          <Route path="/result/:sessionId/final" element={<FinalResultPage />} />
        */}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
