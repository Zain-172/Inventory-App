import { useState, useEffect } from 'react'
import './App.css'

const API = "http://localhost:5000/counter";

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setCount(data.counter));
  }, []);

  const incrementCounter = () => {
    fetch(`${API}/increment`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setCount(data.counter));
  };

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button className='bg-black' onClick={incrementCounter}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
