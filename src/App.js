// import './App.css';
import Home from "./components/Home";
import { 
  BrowserRouter as Router,
  Routes,
  Route
 } from 'react-router-dom';
import Play from "./components/quiz/Play";

function App() {
  return (
    <div className="App">
      
      <Router>
        <Routes>
          <Route path="/" exact element={<Home/>}/>
          <Route path="/play/quiz" exact element={<Play/>}/>
        </Routes>
        
      </Router>
    </div>
  );
}

export default App;
