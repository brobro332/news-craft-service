import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizCreatePage from "./pages/QuizCreatePage";
import { AnimatePresence, motion } from "framer-motion";
import ShareUrlPage from "./pages/ShareUrlPage";

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
        {/*
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
    </AnimatePresence>
  );
}

export default App;
