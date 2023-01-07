import React from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import flagPic from "../../images/americanflagpost.jpeg";
import "./Home.css";
import { Editor, EditorState, ContentState } from 'draft-js';

function Home() {
  const [mail, setMail] = useState([]);
  const mailCollection = collection(db, "mail");
  const [clicked, setClicked] = useState(false);

  //GET MAIL
  useEffect(() => {
    const getMail = async () => {
      const data = await getDocs(mailCollection);
      setMail(data.docs.map((doc, i) => ({ ...doc.data(), id: doc.id })));
      console.log(mail);
    };
    getMail();
  }, []);

  //CREATE MAIL

  // Initialize the state object
  const [state, setState] = useState({
    content: "",
    fromAddress: "",
    toAddress: "",
    paid: false,
    shipped: false,
  });

  // Function to handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const createMail = async () => {
    await addDoc(mailCollection, state);
    console.log(state);
  };
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data

    createMail();
  };

  function handleFlagClick() {
    setClicked(true);
  }

  //EDITOR
  // Use the useState hook to initialize the state object for the editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Use the useEffect hook to retrieve saved text from sessionStorage and restore it to the editor
  useEffect(() => {
    const savedText = sessionStorage.getItem('savedText');
    if (savedText) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(savedText)
        )
      );
    }
  }, []);

  // Use the useEffect hook to save the text in the editor to sessionStorage
  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const text = currentContent.getPlainText();
    sessionStorage.setItem('savedText', text);
  }, [editorState]);

  // Define an onChange handler for the editor

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentContent = newEditorState.getCurrentContent();
    const text = currentContent.getPlainText();
    console.log(text);
  };

  return (
    <>
      {clicked ? (
        <div>
            <Editor editorState={editorState} onChange={onChange} />
            <h1>Type Here</h1>
          <form className="mail-form" onSubmit={handleSubmit}>
            <label>
              Input 1:
              <input
              className="mail-content"
                type="text"
                name="content"
                placeholder="Content"
                value={state.content}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Input 2:
              <input
                type="text"
                name="fromAddress"
                placeholder="From Address"
                value={state.fromAddress}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Input 3:
              <input
                type="text"
                name="toAddress"
                placeholder="To Address"
                value={state.toAddress}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div className="home-div" onClick={handleFlagClick}>
            <h1 className="mail-it-header">Mail It Man</h1>
            <p>Click to start</p>
          <img  className="flagImg" src={flagPic} />
        </div>
      )}
    </>
  );
}
export default Home;
