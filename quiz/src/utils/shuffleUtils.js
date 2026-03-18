// Fisher-Yates shuffle algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Shuffle question options and return new question object with updated correctAnswer
export const shuffleQuestionOptions = (question) => {
  const correctAnswerText = question.options[question.correctAnswer];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
  
  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswerIndex,
    originalCorrectAnswer: correctAnswerText
  };
};

// Shuffle all questions in a section
export const shuffleSectionQuestions = (questions) => {
  return questions.map(q => shuffleQuestionOptions(q));
};