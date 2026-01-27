import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import Home from "../../pages/Home";
import Objects from "../../pages/Objects";
import Login from "@/pages/Login";
import Signup from "@/pages/Singup";
import ObjectDetailsPage from "@/pages/ObjectDetails";
import AddObject from "@/pages/AddObject";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: '/objects', element: <Objects /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/objects/:id', element: <ObjectDetailsPage /> },
      { path: '/add-object', element: <AddObject />}


    ]
  }
])