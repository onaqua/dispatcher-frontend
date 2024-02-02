import { QueryClient, QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { PrivateLayout } from "./layouts/PrivateLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { EventsPage } from "./pages/EventsPage";
export const App: React.FC = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: true,
                refetchOnWindowFocus: true,
                refetchOnMount: false,
                refetchOnReconnect: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={<PrivateLayout element={<HomePage />} />}
                    />
                    <Route
                        path="/events-logs"
                        element={<PrivateLayout element={<EventsPage />} />}
                    />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
