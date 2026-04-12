import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { quizData } from './quizData';
import ModuleSelection from './components/ModuleSelection';
import SectionSelection from './components/SectionSelection';
import QuizInterface from './components/QuizInterface';
import Results from './components/Results';
import quizAPI from './utils/api';

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

// ── Normalize a section to a consistent key format ────────────
// Always produces: "module{moduleId}_section{sectionId}"
const makeSectionKey = (moduleId, sectionId) =>
  `module${moduleId}_section${sectionId}`;

// ─────────────────────────────────────────────────────────────

function App() {
  const saved = loadState();

  const [currentView,     setCurrentView]     = useState(saved?.currentView     || 'modules');
  const [selectedModule,  setSelectedModule]  = useState(saved?.selectedModule  || null);
  const [selectedSection, setSelectedSection] = useState(saved?.selectedSection || null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers,         setAnswers]         = useState({});
  const [moduleAnswers,   setModuleAnswers]   = useState(saved?.moduleAnswers   || {});
  // FIX: store timeSpent in a ref for the debounced save to avoid
  // writing to localStorage every second, while still tracking it in state
  // for display/submission purposes.
  const [timeSpent,       setTimeSpent]       = useState(saved?.timeSpent       || 0);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [completedSectionsFromDB, setCompletedSectionsFromDB] = useState([]);

  // Ref to hold latest timeSpent without triggering save on every tick
  const timeSpentRef = useRef(timeSpent);
  useEffect(() => { timeSpentRef.current = timeSpent; }, [timeSpent]);

  // ── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (currentView === 'quiz') {
      interval = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentView]);

  // ── Auto-save to localStorage (debounced — not every second) ─
  // Only saves when view/module/section/answers change, not on every timer tick.
  useEffect(() => {
    if (!selectedModule) return;
    const timeout = setTimeout(() => {
      saveState({
        currentView,
        selectedModule,
        selectedSection,
        moduleAnswers,
        timeSpent: timeSpentRef.current,
      });
    }, 1000); // debounce: write at most once per second
    return () => clearTimeout(timeout);
  }, [currentView, selectedModule, selectedSection, moduleAnswers]);

  // ── Load module progress from DB ─────────────────────────────
  // FIX: wrapped in useCallback so it can be safely listed as a dep
  const loadModuleProgress = useCallback(async () => {
    if (!selectedModule) return;
    try {
      setLoading(true);
      setError(null);
      const response = await quizAPI.getModuleProgress(selectedModule);

      if (response.success && response.data) {
        const completedSections = response.data
          .filter(section => section.completed)
          .map(section => section.sectionId);

        setCompletedSectionsFromDB(completedSections);

        // FIX: section.answers from the backend is a plain object, not a Map.
        // Use Object.entries() instead of .forEach(value, key).
        const loadedAnswers = {};
        response.data.forEach(section => {
          if (section.answers && typeof section.answers === 'object') {
            const sectionKey = makeSectionKey(selectedModule, section.sectionId);
            loadedAnswers[sectionKey] = Object.entries(section.answers).reduce(
              (acc, [key, value]) => { acc[key] = value; return acc; },
              {}
            );
          }
        });

        setModuleAnswers(prev => ({ ...prev, ...loadedAnswers }));
      }
    } catch (err) {
      console.error('Error loading module progress:', err);
      setError('Failed to load progress. Your answers are saved locally.');
    } finally {
      setLoading(false);
    }
  }, [selectedModule]);

  // FIX: loadModuleProgress is now a stable dep via useCallback
  useEffect(() => {
    if (selectedModule && currentView === 'sections') {
      loadModuleProgress();
    }
  }, [selectedModule, currentView, loadModuleProgress]);

  // ── Handlers ────────────────────────────────────────────────

  const handleModuleSelect = (moduleId) => {
    // FIX: use the already-loaded `saved` for same-module resume instead of
    // calling loadState() again mid-handler (avoids stale reads).
    const existingAnswers = saved?.selectedModule === moduleId
      ? (saved?.moduleAnswers || {})
      : {};
    const existingTime = saved?.selectedModule === moduleId
      ? (saved?.timeSpent || 0)
      : 0;

    setSelectedModule(moduleId);
    setCurrentView('sections');
    setAnswers({});
    setModuleAnswers(existingAnswers);
    setTimeSpent(existingTime);
    setCompletedSectionsFromDB([]);
    setError(null);
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    setCurrentView('quiz');
    setCurrentQuestion(0);
    setAnswers({});
    setError(null);
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

  const calculateSectionScore = (questions, answerMap) => {
    let correct = 0;
    questions.forEach(q => {
      if (answerMap[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const handleFinishSection = async (finalAnswers = answers) => {
    try {
      setLoading(true);
      setError(null);

      const questions = getCurrentQuestions();
      const score = calculateSectionScore(questions, finalAnswers);

      await quizAPI.saveSectionProgress(
        selectedModule,
        selectedSection,
        finalAnswers,
        score,
        timeSpent,
        true
      );

      // FIX: use consistent key format via makeSectionKey helper
      const sectionKey = makeSectionKey(selectedModule, selectedSection);
      const updatedModuleAnswers = {
        ...moduleAnswers,
        [sectionKey]: { ...finalAnswers },
      };

      setModuleAnswers(updatedModuleAnswers);

      const module = quizData.modules.find(m => m.id === selectedModule);
      // FIX: use actual section count from data, not hardcoded 4
      const totalSections = module?.sections?.length ?? 0;

      // FIX: count completed sections from BOTH local state AND DB,
      // deduplicated, so resuming users correctly reach the results view.
      const localCompletedIds = Object.keys(updatedModuleAnswers)
        .filter(key => key.startsWith(`module${selectedModule}_`))
        .map(key => key.split('_section')[1]);

      const dbCompletedIds = completedSectionsFromDB.map(String);

      const allCompletedIds = [
        ...new Set([...localCompletedIds, ...dbCompletedIds])
      ];

      if (totalSections > 0 && allCompletedIds.length >= totalSections) {
        // Calculate total score across all sections
        let totalScore = 0;
        let totalQuestions = 0;

        module.sections.forEach(section => {
          const key = makeSectionKey(selectedModule, section.id);
          const sectionAnswers = updatedModuleAnswers[key] || {};
          section.questions.forEach(q => {
            totalQuestions++;
            if (sectionAnswers[q.id] === q.correctAnswer) totalScore++;
          });
        });

        await quizAPI.saveModuleProgress(
          selectedModule,
          module.sections.map(s => s.id),
          totalScore,
          timeSpent,
          true
        );

        setCurrentView('results');
      } else {
        setCurrentView('sections');
      }

      setAnswers({});
    } catch (err) {
      console.error('Error saving section progress:', err);
      // FIX: use state-based error display instead of alert()
      setError('Failed to save progress. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSections = () => {
    setCurrentView('sections');
    setCurrentQuestion(0);
    setAnswers({});
    setError(null);
  };

  const handleBackToModules = () => {
    setCurrentView('modules');
    setSelectedModule(null);
    setSelectedSection(null);
    setAnswers({});
    setModuleAnswers({});
    setCompletedSectionsFromDB([]);
    setTimeSpent(0);
    setError(null);
    // NOTE: localStorage NOT cleared — user can resume this module
  };

  const handleModuleComplete = () => {
    clearState();
    setCurrentView('modules');
    setSelectedModule(null);
    setSelectedSection(null);
    setAnswers({});
    setModuleAnswers({});
    setTimeSpent(0);
    setCompletedSectionsFromDB([]);
    setError(null);
  };

  const getCurrentQuestions = () => {
    if (!selectedModule || !selectedSection) return [];
    const module = quizData.modules.find(m => m.id === selectedModule);
    if (!module) return [];
    const section = module.sections.find(s => s.id === selectedSection);
    return section ? section.questions : [];
  };

  // ── Derive consistent completed section keys for SectionSelection ─
  // FIX: both local-state and DB IDs are normalized through makeSectionKey
  // so the child component always receives keys in the same format.
  const completedSectionKeys = [
    ...new Set([
      ...Object.keys(moduleAnswers).filter(k =>
        k.startsWith(`module${selectedModule}_`)
      ),
      ...completedSectionsFromDB.map(id =>
        makeSectionKey(selectedModule, id)
      ),
    ])
  ];

  // ── Derive actual total sections from data (not hardcoded) ───
  const currentModule = quizData.modules.find(m => m.id === selectedModule);
  const totalSections = currentModule?.sections?.length ?? 4;

  // ── Loading screen ───────────────────────────────────────────
  if (loading && currentView === 'sections') {
    return (
      <div className="quiz-app">
        <div className="stars-background"></div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#fff',
          fontSize: '1.5rem'
        }}>
          Loading progress...
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-app">
      <div className="stars-background"></div>

      {/* FIX: inline error banner instead of alert() */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#c0392b',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '8px',
          zIndex: 9999,
          fontSize: '0.95rem',
          maxWidth: '90vw',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '12px',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {currentView === 'modules' && (
        <ModuleSelection
          modules={quizData.modules}
          onSelectModule={handleModuleSelect}
        />
      )}

      {currentView === 'sections' && (
        <SectionSelection
          module={currentModule}
          onSelectSection={handleSectionSelect}
          onBack={handleBackToModules}
          // FIX: consistent key format, deduplicated
          completedSections={completedSectionKeys}
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
          moduleTitle={currentModule?.title}
          sectionNumber={selectedSection}
          // FIX: use actual section count from data
          totalSections={totalSections}
          onSectionReviewComplete={() => {}}
        />
      )}

      {currentView === 'results' && (
        <Results
          module={currentModule}
          moduleAnswers={moduleAnswers}
          onBackToModules={handleModuleComplete}
          timeSpent={timeSpent}
        />
      )}

      {loading && currentView !== 'sections' && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          padding: '20px 40px',
          borderRadius: '10px',
          color: '#fff',
          zIndex: 9999,
        }}>
          Saving progress...
        </div>
      )}
    </div>
  );
}

export default App;