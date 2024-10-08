import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

languages.python = {
  ...languages.python,
  'operator': /[=:]/
};

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={code => highlight(code, languages.python, 'python')}
        padding={16}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: 'transparent',
          minHeight: '300px',
        }}
        textareaClassName="focus:outline-none"
      />
    </div>
  );
};