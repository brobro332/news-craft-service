import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
          <Route path="/" element={<HomePage />} />
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
    </BrowserRouter>
  );
}

export default App;
