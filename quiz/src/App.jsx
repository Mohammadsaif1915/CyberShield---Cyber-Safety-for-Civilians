import React, { useState, useEffect } from 'react';
import "./App.css";
import { quizData } from './quizData';
import ModuleSelection from './components/ModuleSelection';
import SectionSelection from './components/SectionSelection';
import QuizInterface from './components/QuizInterface';
import Results from './components/Results';

function App() {
  const [currentView, setCurrentView] = useState('modules'); // modules, sections, quiz, results
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [moduleAnswers, setModuleAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let interval;
    if (currentView === 'quiz') {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentView]);

  const handleModuleSelect = (moduleId) => {
    setSelectedModule(moduleId);
    setCurrentView('sections');
    setAnswers({});
    setTimeSpent(0);
    setModuleAnswers({});
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    setCurrentView('quiz');
    setCurrentQuestion(0);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    const questions = getCurrentQuestions();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishSection = () => {
    const sectionKey = `module${selectedModule}_section${selectedSection}`;

    // Build the updated moduleAnswers with the current section included
    const updatedModuleAnswers = {
      ...moduleAnswers,
      [sectionKey]: { ...answers }
    };

    setModuleAnswers(updatedModuleAnswers);

    // Get total number of sections for this module
    const module = quizData.modules.find(m => m.id === selectedModule);
    const totalSections = module ? module.sections.length : 4;

    // Count how many unique sections are now completed
    const completedCount = Object.keys(updatedModuleAnswers).filter(key =>
      key.startsWith(`module${selectedModule}`)
    ).length;

    if (completedCount >= totalSections) {
      // All sections done — pass the fully updated answers to Results via state
      setCurrentView('results');
    } else {
      setCurrentView('sections');
    }
    setAnswers({});
  };

  const handleBackToSections = () => {
    setCurrentView('sections');
    setCurrentQuestion(0);
  };

  const handleBackToModules = () => {
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
          onBackToModules={handleBackToModules}
          timeSpent={timeSpent}
        />
      )}
    </div>
  );
}

export default App;