import { Outlet } from 'react-router-dom'
import './App.css'
import UserInitializer from './components/login/UserInitializer';
import { useState } from 'react';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [initialized, setInitialized] = useState(false);

  return (
    <>
      <ScrollToTop />
      <UserInitializer onInitialized={() => setInitialized(true)} />
      {initialized && <Outlet />}
    </>
  );
}


export default App
