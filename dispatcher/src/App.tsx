import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { PrivateLayout } from "./layouts/PrivateLayout";
import { EventsPage } from "./pages/EventsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import AxiosRefreshInterceptor from "./interceptors/refreshInterceptor";

export const App: React.FC = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: "always",
                refetchOnReconnect: "always",
                refetchOnWindowFocus: "always",
                optimisticResults: true,
            },
        },
    });

    useEffect(() => {
        AxiosRefreshInterceptor.createAxiosRefreshInterceptor();

        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
        }

        localStorage.theme = "dark";
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    wireframe: true,
                    colorTextBase: "#ffffff",
                    colorTextSecondary: "#ffffff",
                    colorTextDescription: "#ffffff",
                    colorLink: "#38bdf8",
                    colorBgBase: "#0f172a",
                    colorPrimary: "#1677FF",
                    colorInfo: "#2e65fe",
                },
                algorithm: theme.darkAlgorithm,
            }}
        >
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
        </ConfigProvider>
    );
};

export default App;
