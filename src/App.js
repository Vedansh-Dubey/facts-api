import AuthPage from "./pages/authPage/authPage";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import UserPage from "./pages/userPage/userPage";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/ApiDashboard" element={<UserPage />} />
      {/* Define other routes and their corresponding components */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;