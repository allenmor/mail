import { Editor, EditorState, ContentState } from "draft-js";
import React, { useState, useEffect } from "react";

const TextEditor = ({ onTextChange, setFontSize, fontSize }) => {
  // Use the useState hook to initialize the state object for the editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Use the useEffect hook to retrieve saved text from sessionStorage and restore it to the editor
  useEffect(() => {
    // Get the saved text from sessionStorage
    const savedText = sessionStorage.getItem("savedText");
    // If there is saved text, create a new EditorState object with the saved text
    if (savedText) {
      setEditorState(
        EditorState.createWithContent(ContentState.createFromText(savedText))
      );
    }
  }, []);

  useEffect(() => {
    // Get the current content of the editor
    const currentContent = editorState.getCurrentContent();
    // Get the plain text representation of the content
    const text = currentContent.getPlainText();
    // Save the text to sessionStorage
    sessionStorage.setItem("savedText", text);
  }, [editorState]);

  const onChange = (newEditorState) => {
    // Update the editor state with the new editor state
    setEditorState(newEditorState);
    // Get the current content of the editor
    const currentContent = newEditorState.getCurrentContent();
    // Get the plain text representation of the content
    const text = currentContent.getPlainText();
    // Call the onTextChange function passed from the parent component
    onTextChange(text);
  };

  // Define an onChange handler for the select element
  const handleFontSizeChange = (event) => {
    // Update the font size state variable with the selected value
    setFontSize(event.target.value);
  };

    // Define an onClick handler for the arrow element
    const handleArrowClick = () => {
        console.log('arrow clicked');
      };

      
    
  return (
    <>
    <div style={{ fontSize: `16px` }} className="dropdowns">
      <label>
        Font size:
        <select value={fontSize} onChange={handleFontSizeChange}>
          <option value={10}>10</option>
          <option value={12}>12</option>
          <option value={14}>14</option>
          <option value={16}>16</option>
          <option value={18}>18</option>
          <option value={20}>20</option>
          <option value={22}>22</option>
          <option value={24}>24</option>
        </select>
      </label>
    </div>
      <Editor editorState={editorState} onChange={onChange} />
      <div style={{ fontSize: `16px` }} className="arrow-container" onClick={handleArrowClick}>
        <span className="arrow">➤</span>
      </div>
    </>
  );
};

export default TextEditor;
