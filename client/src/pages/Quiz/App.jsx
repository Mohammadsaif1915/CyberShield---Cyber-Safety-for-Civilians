import React, { useState, useEffect } from 'react';
import "./App.css";
import { quizData } from './quizData';
import ModuleSelection from './components/ModuleSelection';
import SectionSelection from './components/SectionSelection';
import QuizInterface from './components/QuizInterface';
import Results from './components/Results';

// ── localStorage helpers ──────────────────────────────────────
const STORAGE_KEY = 'cybershield_quiz_state';

const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const clearState = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
};

// ─────────────────────────────────────────────────────────────

function App() {
  const saved = loadState();

  const [currentView,     setCurrentView]     = useState(saved?.currentView     || 'modules');
  const [selectedModule,  setSelectedModule]  = useState(saved?.selectedModule  || null);
  const [selectedSection, setSelectedSection] = useState(saved?.selectedSection || null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers,         setAnswers]         = useState({});
  const [moduleAnswers,   setModuleAnswers]   = useState(saved?.moduleAnswers   || {});
  const [timeSpent,       setTimeSpent]       = useState(saved?.timeSpent       || 0);

  // ── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (currentView === 'quiz') {
      interval = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentView]);

  // ── Auto-save to localStorage ────────────────────────────────
  useEffect(() => {
    if (selectedModule) {
      saveState({ currentView, selectedModule, selectedSection, moduleAnswers, timeSpent });
    }
  }, [currentView, selectedModule, selectedSection, moduleAnswers, timeSpent]);

  // ── Handlers ────────────────────────────────────────────────

  const handleModuleSelect = (moduleId) => {
    const existing = loadState();
    // Preserve progress if same module, else start fresh
    const existingAnswers = existing?.selectedModule === moduleId
      ? (existing?.moduleAnswers || {})
      : {};
    const existingTime = existing?.selectedModule === moduleId
      ? (existing?.timeSpent || 0)
      : 0;

    setSelectedModule(moduleId);
    setCurrentView('sections');
    setAnswers({});
    setModuleAnswers(existingAnswers);
    setTimeSpent(existingTime);
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    setCurrentView('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    const questions = getCurrentQuestions();
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
  };

  // ✅ FIX: shuffledQuestions passed from QuizInterface
  // answers[q.id] = selected option index (based on shuffled options)
  // We save a correctedAnswers map: questionId -> 1 if correct, 0 if wrong
  // Results.jsx needs to know which answers are correct
  const handleFinishSection = (shuffledQuestions = []) => {
    const sectionKey = `module${selectedModule}_section${selectedSection}`;

    // Build corrected answers: store user's answer against shuffled correctAnswer
    // so Results.jsx can correctly compute score
    let sectionData = { ...answers };

    // If shuffledQuestions provided, remap answers to store correctness info
    if (shuffledQuestions.length > 0) {
      sectionData = {};
      shuffledQuestions.forEach(q => {
        // Store the user's answer (index in shuffled options)
        // AND store the shuffled correctAnswer so Results can verify
        sectionData[q.id] = answers[q.id];
        // Also store what the correct answer WAS (in shuffled context)
        sectionData[`${q.id}_correct`] = q.correctAnswer;
      });
    }

    const updatedModuleAnswers = {
      ...moduleAnswers,
      [sectionKey]: sectionData
    };

    setModuleAnswers(updatedModuleAnswers);

    const module = quizData.modules.find(m => m.id === selectedModule);
    const totalSections = module ? module.sections.length : 4;

    const completedCount = Object.keys(updatedModuleAnswers).filter(key =>
      key.startsWith(`module${selectedModule}`)
    ).length;

    // Save immediately
    saveState({
      currentView: completedCount >= totalSections ? 'results' : 'sections',
      selectedModule,
      selectedSection,
      moduleAnswers: updatedModuleAnswers,
      timeSpent,
    });

    if (completedCount >= totalSections) {
      setCurrentView('results');
    } else {
      setCurrentView('sections');
    }

    setAnswers({});
  };

  const handleBackToSections = () => {
    setCurrentView('sections');
    setCurrentQuestion(0);
    setAnswers({});
  };

  // ✅ FIX: Back from SectionSelection — DO NOT clear state
  const handleBackToModules = () => {
    setCurrentView('modules');
    setSelectedModule(null);
    setSelectedSection(null);
    setAnswers({});
    setModuleAnswers({});
    setTimeSpent(0);
    // NOTE: localStorage NOT cleared — user can resume this module
  };

  // ✅ FIX: Back from Results — DO NOT clear state
  // User should still see "Completed" on sections if they come back
  const handleModuleComplete = () => {
    // Clear only this module's state from localStorage
    // so next time they start fresh, but history still in MongoDB
    clearState();
    setCurrentView('modules');
    setSelectedModule(null);
    setSelectedSection(null);
    setAnswers({});
    setModuleAnswers({});
    setTimeSpent(0);
  };

  const getCurrentQuestions = () => {
    if (!selectedModule || !selectedSection) return [];
    const module = quizData.modules.find(m => m.id === selectedModule);
    if (!module) return [];
    const section = module.sections.find(s => s.id === selectedSection);
    return section ? section.questions : [];
  };

  return (
    <div className="quiz-app">
      <div className="stars-background"></div>

      {currentView === 'modules' && (
        <ModuleSelection
          modules={quizData.modules}
          onSelectModule={handleModuleSelect}
        />
      )}

      {currentView === 'sections' && (
        <SectionSelection
          module={quizData.modules.find(m => m.id === selectedModule)}
          onSelectSection={handleSectionSelect}
          onBack={handleBackToModules}
          completedSections={Object.keys(moduleAnswers).filter(key =>
            key.startsWith(`module${selectedModule}`)
          )}
        />
      )}

      {currentView === 'quiz' && (
        <QuizInterface
          questions={getCurrentQuestions()}
          currentQuestion={currentQuestion}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          onPrev={handlePrevQuestion}
          onFinish={handleFinishSection}
          onBack={handleBackToSections}
          moduleTitle={quizData.modules.find(m => m.id === selectedModule)?.title}
          sectionNumber={selectedSection}
          totalSections={quizData.modules.find(m => m.id === selectedModule)?.sections?.length ?? 4}
          onSectionReviewComplete={() => {}}
        />
      )}

      {currentView === 'results' && (
        <Results
          module={quizData.modules.find(m => m.id === selectedModule)}
          moduleAnswers={moduleAnswers}
          onBackToModules={handleModuleComplete}
          timeSpent={timeSpent}
        />
      )}
    </div>
  );
}

export default App;