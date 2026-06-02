import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import AnimatorPage from './pages/AnimatorPage';
import TutorPage from './pages/TutorPage';
import BuilderPage from './pages/BuilderPage';
import QuizPage from './pages/QuizPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-bg-primary">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"         element={<Home />}         />
              <Route path="/animator" element={<AnimatorPage />} />
              <Route path="/tutor"    element={<TutorPage />}    />
              <Route path="/builder"  element={<BuilderPage />}  />
              <Route path="/quiz"     element={<QuizPage />}     />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
