import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const[name, setName] = useState("");
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build a Twitter Clone" },
    { id: 3, text: "Deploy the App" }
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          You clicked {count} times
        </p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>
          Hello, {name}!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
