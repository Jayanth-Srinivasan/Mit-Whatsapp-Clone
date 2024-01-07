import Chat from "./components/Chat";
import Login from "./components/Login";
import {Routes, Route} from 'react-router-dom'


function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <>
    <Routes>
      {
        !user ? <Route path='/' element={<Login/>}/> : <Route path='/' element={<Chat user={user} />}/>
      }
    </Routes>
    </>
  );
}

export default App;
