import React, { useState, useEffect, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./App.css";

function App() {
  const words = ["dad", "mom", "cat", "dog"];
  const [input, setInput] = useState("Type what you hear");
  const [word, setWord] = useState("");
  const [speech, setSpeech] = useState("");
  const keyboard = useRef();

  const getVoice = selected => {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(voice => voice.name === selected);
    return voice !== undefined ? voice : voices[0];
  };

  useEffect(() => {
    setWord(words[Math.floor(Math.random() * words.length)]);
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
    setWord(word);
    setInput("");
    keyboard.current.clearInput();
    speak(word);
  };

  const onChange = input => {
    setInput(input);
    setSpeech(input.toLowerCase());
  };

  const onKeyPress = button => {
    if (button === "{enter}") {
      speak(speech);

      if (input.toLowerCase() === word) {
        newWord();
      }
    }
  };

  const playWord = () => {
    speak(word);
  };

  return (
    <div className="App">
      <div className="input">{input}</div>
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        onChange={onChange}
        onKeyPress={onKeyPress}
        display={{
          "{bksp}": "Delete Letter",
          "{enter}": "Check"
        }}
        layout={{
          default: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M",
            "{bksp} {enter}"
          ]
        }}
      />
      <div className="word" onClick={playWord}>
        Play Word
      </div>
    </div>
  );
}

export default App;
