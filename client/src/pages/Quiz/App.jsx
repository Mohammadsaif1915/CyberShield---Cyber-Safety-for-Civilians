import React, { useState, useEffect } from 'react';
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
  const [loading,         setLoading]         = useState(false);
  const [completedSectionsFromDB, setCompletedSectionsFromDB] = useState([]);

  // ── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (currentView === 'quiz') {
      interval = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentView]);

  // Load completed sections when module is selected
  useEffect(() => {
    if (selectedModule && currentView === 'sections') {
      loadModuleProgress();
    }
  }, [selectedModule, currentView]);

  const loadModuleProgress = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getModuleProgress(selectedModule);
      
      if (response.success && response.data) {
        const completedSections = response.data
          .filter(section => section.completed)
          .map(section => section.sectionId);
        
        setCompletedSectionsFromDB(completedSections);
        
        // Load answers for completed sections
        const loadedAnswers = {};
        response.data.forEach(section => {
          if (section.answers) {
            const sectionKey = `module${selectedModule}_section${section.sectionId}`;
            const answersObj = {};
            section.answers.forEach((value, key) => {
              answersObj[key] = value;
            });
            loadedAnswers[sectionKey] = answersObj;
          }
        });
        setModuleAnswers(loadedAnswers);
      }
    } catch (error) {
      console.error('Error loading module progress:', error);
    } finally {
      setLoading(false);
    }
  };

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
    setCompletedSectionsFromDB([]);
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

  const calculateSectionScore = (questions, answers) => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinishSection = async (finalAnswers = answers) => {
    try {
      setLoading(true);
      
      // Calculate score
      const questions = getCurrentQuestions();
      const score = calculateSectionScore(questions, finalAnswers);
      
      // Save section progress to backend
      await quizAPI.saveSectionProgress(
        selectedModule,
        selectedSection,
        finalAnswers,
        score,
        timeSpent,
        true
      );

      // Save to local state
      const sectionKey = `module${selectedModule}_section${selectedSection}`;
      const updatedModuleAnswers = {
        ...moduleAnswers,
        [sectionKey]: { ...finalAnswers }
      };

      setModuleAnswers(updatedModuleAnswers);

      // Check if all sections completed
      const completedSections = Object.keys(updatedModuleAnswers).filter(key => 
        key.startsWith(`module${selectedModule}`)
      ).length;

      const module = quizData.modules.find(m => m.id === selectedModule);
      const totalSections = module?.sections?.length ?? 4;

      if (completedSections >= totalSections) {
        // Calculate total score for module
        let totalScore = 0;
        let totalQuestions = 0;

        module.sections.forEach(section => {
          const sectionKey = `module${selectedModule}_section${section.id}`;
          const sectionAnswers = updatedModuleAnswers[sectionKey] || {};
          
          section.questions.forEach(q => {
            totalQuestions++;
            if (sectionAnswers[q.id] === q.correctAnswer) {
              totalScore++;
            }
          });
        });

        // Save module completion
        await quizAPI.saveModuleProgress(
          selectedModule,
          module.sections.map(section => section.id),
          totalScore,
          timeSpent,
          true
        );

        setCurrentView('results');
      } else {
        setCurrentView('sections');
      }
      
      setAnswers({});
    } catch (error) {
      console.error('Error saving section progress:', error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setLoading(false);
    }
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
    setCompletedSectionsFromDB([]);
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
    setCompletedSectionsFromDB([]);
  };

  const getCurrentQuestions = () => {
    if (!selectedModule || !selectedSection) return [];
    const module = quizData.modules.find(m => m.id === selectedModule);
    if (!module) return [];
    const section = module.sections.find(s => s.id === selectedSection);
    return section ? section.questions : [];
  };

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
          completedSections={[
            ...Object.keys(moduleAnswers)
              .filter(key => key.startsWith(`module${selectedModule}`))
              .map(key => `module${selectedModule}_section${key.split('_section')[1]}`),
            ...completedSectionsFromDB.map(id => `module${selectedModule}_section${id}`)
          ]}
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
          totalSections={4}
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
          zIndex: 9999
        }}>
          Saving progress...
        </div>
      )}
    </div>
  );
};

export default App;