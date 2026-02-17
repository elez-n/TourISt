import { Outlet } from 'react-router-dom'
import './App.css'
import UserInitializer from './components/login/UserInitializer';
import { useState } from 'react';

function App() {
  const [initialized, setInitialized] = useState(false);

  return (
    <>
      <UserInitializer onInitialized={() => setInitialized(true)} />
      {initialized && <Outlet />}
    </>
  );
}


export default App
