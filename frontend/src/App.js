// import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
// import Login from './Login';
// import Todo from './Todo';
import Login from './Login';
// import Todoo from './Todoo';
import Todo from './Todo';

function App() {
  return (
    <>
    {/* <div className="container">
    
      <Todo/>
    </div> */}
    <BrowserRouter>
       <Routes>
           <Route path='/' element={<Login/>}></Route>
           <Route path='/todos' element={<Todo/>}></Route>
       </Routes>   
    </BrowserRouter>
    </>
  );
}

export default App;
