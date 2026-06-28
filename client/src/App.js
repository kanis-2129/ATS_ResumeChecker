
import './App.css';
import Home from "./pages/home"
import Results from "./pages/results"
import { BrowserRouter,Routes,Route } from 'react-router-dom';

function App() {
  return (
    <div>
     
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/result' element={<Results/>}></Route>
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
