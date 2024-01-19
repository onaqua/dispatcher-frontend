import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";

import "./App.css";
import { PrivateLayout } from "./layouts/PrivateLayout";
import { HomePage } from "./pages/HomePage";

export const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/login"
                    element={<PrivateLayout element={<HomePage />} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
