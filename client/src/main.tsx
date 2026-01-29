
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/Routes.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

const theme = createTheme({
  palette: {
    background: {
      default: "#f4f6f8", 
      paper: "#ffffff",  
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
);
