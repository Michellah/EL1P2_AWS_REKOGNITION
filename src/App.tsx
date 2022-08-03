import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Second from "./components/Second";

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={ <Main/> }/>
        <Route path='/Second' element={ <Second/> }/>
      </Routes>
    </Router>
  );
}

export default App;
