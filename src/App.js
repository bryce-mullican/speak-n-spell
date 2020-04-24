import React, { useState, useEffect, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./App.css";

function App() {
  const words = ["dad", "mom", "four", "hello"];
  const [input, setInput] = useState("");
  const [word, setWord] = useState("");
  const [speech, setSpeech] = useState("");
  const [letters, setLetters] = useState("");
  const [display, setDisplay] = useState("");
  const [score, setScore] = useState(0)
  const keyboard = useRef();
  const [help, setHelp] = useState(false)

  const getVoice = selected => {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(voice => voice.name === selected);
    return voice !== undefined ? voice : voices[0];
  };

  useEffect(() => {
    const word = words[Math.floor(Math.random() * words.length)];
    const letterSpans = word.toUpperCase().split('').map((letter,idx) => <span key={idx}>{letter}</span>);
    setLetters(letterSpans);
    setDisplay();
    setWord(word);
  }, []);

  // const onend = func => {
  //   this.utterance.onend = func;
  // };

  // const onerror = func => {
  //   this.utterance.onerror = func;
  // };

  const speak = word => {
    let utterance = new window.SpeechSynthesisUtterance(word);
    utterance.default = false;
    // utterance.voice = voices.filter(voice => {
    //   return voice.name === "Google US English";
    // })[0];
    let selected = getVoice("Google US English");
    utterance.voice = selected;
    // utterance.text = word.replace(/\n/g, "");
    utterance.lang = "en-US";
    utterance.pitch = 0.8;
    utterance.rate = 1;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const newWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    const letterSpans = word.toUpperCase().split('').map((letter,idx) => <span key={idx}>{letter}</span>);
    const wordSpans = word.toUpperCase().split('').map((letter,idx) => <span key={idx}></span>);
    setHelp(false);
    setLetters(letterSpans);
    setDisplay(wordSpans);    
    setWord(word);
    setInput("");
    keyboard.current.clearInput();
    speak(word);
  };

  const onChange = input => {
    const letterSpans = input.split('').map((letter,idx) => <span key={idx}>{letter}</span>);
    setDisplay(letterSpans);
    setInput(input);
    setSpeech(input.toLowerCase());
  };

  const playWord = () => {
    speak(word);
  };
  
  const onKeyPress = button => {
    if (button === "{enter}") {
      speak(speech);

      if (input.toLowerCase() === word) {
        setScore(score + 1);
        newWord();
      }
    }
    if (button === "{shift}") {
      playWord();
    }
  };

  const showHelp = () => {
    setHelp(!help);
  }

  return (
    <div className="App">
      <div className="header">Score: {score} <button className="help" onClick={showHelp}>Help</button></div>
      <div className="input">
        <div className={help ? 'letters help' : 'letters'}><div className="letter-wrap">{letters}</div></div>
        <div className="word">
          <div className="letter-wrap" style={{width: (word.length * 170) + (word.length * 10)}}>{display}</div></div>
      </div>
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        onChange={onChange}
        onKeyPress={onKeyPress}
        display={{
          "{bksp}": "Delete Letter",
          "{enter}": "Check",
          "{shift}": "Play Word"
        }}
        layout={{
          default: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M",
            "{bksp} {enter}",
            "{shift}"
          ]
        }}
      />
    </div>
  );
}

export default App;
