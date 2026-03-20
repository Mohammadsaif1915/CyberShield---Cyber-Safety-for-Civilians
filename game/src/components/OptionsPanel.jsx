import React from "react";

/**
 * Renders answer options as clickable buttons.
 * Props:
 *  - options: string[]
 *  - selectedAnswer: number | null
 *  - correctIndex: number
 *  - onSelect: (index) => void
 *  - disabled: boolean (true after answer selected)
 */
export default function OptionsPanel({
  options,
  selectedAnswer,
  correctIndex,
  onSelect,
  disabled,
}) {
  const getButtonStyle = (index) => {
    if (selectedAnswer === null) return "option-btn"; // no answer yet

    if (index === correctIndex) return "option-btn correct";   // always highlight correct
    if (index === selectedAnswer) return "option-btn wrong";   // user's wrong pick
    return "option-btn dimmed";
  };

  return (
    <div className="options-panel">
      {options.map((option, index) => (
        <button
          key={index}
          className={getButtonStyle(index)}
          onClick={() => !disabled && onSelect(index)}
          disabled={disabled}
        >
          <span className="option-letter">
            {String.fromCharCode(65 + index)}.
          </span>
          {option}
        </button>
      ))}
    </div>
  );
}