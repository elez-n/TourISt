
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/Routes.tsx';

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
    <RouterProvider router={router} />
  </ThemeProvider>
);
