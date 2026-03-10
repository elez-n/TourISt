import { Outlet } from 'react-router-dom'
import './App.css'
import UserInitializer from './components/login/UserInitializer';
import { useState } from 'react';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from "sonner";

function App() {
  const [initialized, setInitialized] = useState(false);

  return (
    <>
      <Toaster position="top-right" richColors />

      <ScrollToTop />
      <UserInitializer onInitialized={() => setInitialized(true)} />
      {initialized && <Outlet />}
    </>
  );
}

export default App;