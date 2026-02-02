import { Outlet } from 'react-router-dom'
import './App.css'
import UserInitializer from './components/login/UserInitializer';

function App() {
  
   return (
    <>
      <UserInitializer />
      <Outlet />
    </>
  );
}

export default App
