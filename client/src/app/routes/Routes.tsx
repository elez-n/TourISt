import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import Home from "../../pages/Home";
import Objects from "../../pages/Objects";
import Login from "@/pages/Login";
import Signup from "@/pages/Singup";
import ObjectDetailsPage from "@/pages/ObjectDetails";
import AddObject from "@/pages/AddObject";
import ObjectsMap from "@/pages/ObjectsMap";
import Favorites from "@/pages/Favorites";
import CreateOfficerForm from "@/pages/CreateOfficer";
import SetPasswordPage from "@/pages/SetPassword";
import Users from "@/pages/Users";
import Reports from "@/pages/Reports";
import Statistics from "@/pages/Statistics";
import ProtectedRoute from "./ProtectedRoute";
import ContactPage from "@/pages/Contact";

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
      { path: '/kontakt', element: <ContactPage /> },
      {
        path: '/add-object', element:
          <ProtectedRoute roles={["Admin", "Officer"]}>
            <AddObject />
          </ProtectedRoute>
      },
      { path: '/map', element: <ObjectsMap /> },
      {
        path: '/favorites', element:
          <ProtectedRoute roles={["Admin", "Officer", "Visitor"]}>
            <Favorites />
          </ProtectedRoute>
      },
      {
        path: '/create-officer',
        element: <ProtectedRoute roles={["Admin"]}>
          <CreateOfficerForm />
        </ProtectedRoute>
      },
      { path: '/set-password', element: <SetPasswordPage /> },
      {
        path: '/users', element:
          <ProtectedRoute roles={["Admin"]}>
            <Users />
          </ProtectedRoute>
      },
      {
        path: '/reports', element:
          <ProtectedRoute roles={["Admin", "Officer"]}>
            <Reports />
          </ProtectedRoute>
      },
      {
        path: '/stats',
        element: <ProtectedRoute roles={["Admin", "Officer"]}>
          <Statistics />
        </ProtectedRoute>
      },







    ]
  }
])