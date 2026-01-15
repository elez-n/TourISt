
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "leaflet/dist/leaflet.css";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: "#f4f6f8", // svijetlo siva (profi)
      paper: "#ffffff",  // kartice ostaju bijele
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
