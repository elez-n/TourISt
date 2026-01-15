import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import Home from "../../pages/Home";
import Objects from "../../pages/Objects";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {path: '', element: <Home /> },
      {path: '/objects', element: <Objects />}
    ]
  }
])