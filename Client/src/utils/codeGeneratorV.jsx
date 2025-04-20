import React, { useState, useEffect } from 'react';
import '../styles/codeGenerator.css';

const CodeGenerator = () => {
  const [generatedCode, setGeneratedCode] = useState('');

  const generateCode = () => {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedCode(code);
  };

  useEffect(() => {
    generateCode();
  }, []);

  return (
    <div className="code-generator">
      <span className="verification-code">{generatedCode}</span>
      <button 
        type="button" 
        className="regenerate-button" 
        onClick={generateCode}
        aria-label="Regenerate verification code"
      ></button>
    </div>
  );
};

export default CodeGenerator;