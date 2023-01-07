import React from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import flagPic from "../../images/americanflagpost.jpeg";
import "./Home.css";
import { Editor, EditorState, ContentState } from "draft-js";
import TextEditor from "./TextEditor";

function Home() {
  const [mail, setMail] = useState([]);
  const mailCollection = collection(db, "mail");
  const [clicked, setClicked] = useState(false);

  //GET MAIL
  useEffect(() => {
    const getMail = async () => {
      const data = await getDocs(mailCollection);
      setMail(data.docs.map((doc, i) => ({ ...doc.data(), id: doc.id })));
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
  };
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data
    createMail();
  };

  //WHEN FLAG CLICKED ON
  function handleFlagClick() {
    setClicked(true);
    sessionStorage.setItem("clicked", true);
  }
  useEffect(() => {
    // Get the saved value of clicked from sessionStorage
    const savedClicked = sessionStorage.getItem("clicked");
    // If the value is saved in sessionStorage, set the clicked state to the saved value
    if (savedClicked) {
      setClicked(savedClicked);
    }
  }, []);

  // Use the useState hook to store the text typed in the TextEditor component
  const [text, setText] = useState("");
  // Define a function to update the text in the App component
  const handleTextChange = (newText) => {
    setText(newText);
  };
  //FONT SIZE
  const [fontSize, setFontSize] = useState(16)
  return (
    <>
      {clicked ? (
        <div>
          <div style={{ fontSize: `${fontSize}px` }}  className="text-editor-div">
            <TextEditor fontSize={fontSize} setFontSize={setFontSize} onTextChange={handleTextChange} />
          </div>
            <p>Number of characters: {text.length}</p>
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
          <img className="flagImg" src={flagPic} />
        </div>
      )}
    </>
  );
}
export default Home;
