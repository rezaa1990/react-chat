import './App.css';
import Chat from './components/chat';
import Login from './components/login';
import RegisterForm from './components/register';

function App() {
  return (
    <div className="App">
     <RegisterForm/>
     <Login/>
     <Chat/>
    </div>
  );
}

export default App;
