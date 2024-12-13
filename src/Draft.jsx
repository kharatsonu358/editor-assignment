import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    // Check localStorage for saved content and initialize editor state
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  // Handle before input to detect special cases like #, *, **, ***
  const handleBeforeInput = (inputChar) => {


    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();

    const block = currentContent.getBlockForKey(blockKey);
    const blockText = block.getText();


   
      if (blockText==="# ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "forward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
      return "handled";
    }

    if (blockText==="*** ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        "forward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
      return "handled";
    }

    if (blockText==="** ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        "forward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "RED"));
      return "handled";
    }
    if (blockText==="* ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "forward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
      return "handled";
    }

    
    

  }

  // Save content to localStorage
  const saveContent = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem("editorContent", JSON.stringify(convertToRaw(content)));
    alert("Content saved!");
  };

  
  const styleMap = {
    Header: {
      fontSize: "2em",       
      fontWeight: "bold",   
      margin: " 0.67em 0",    
      fontFamily: "inherit",  
      color: "inherit",
    },
    RED: {
      color: "red",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
    BOLD:
    {
      fontWeight: "bold",
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <h3>Demo Editor by Avinash Kharat</h3>
      <button onClick={saveContent}>Save</button>
      <div style={{ border: "1px solid #000", marginTop: "10px", padding: "10px" }}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
         
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default DraftEditor;
