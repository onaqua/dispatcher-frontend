import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AxiosRefreshInterceptor from "./interceptors/refreshInterceptor";
import { PrivateLayout } from "./layouts/PrivateLayout";
import { EventsPage } from "./pages/EventsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { setTheme } from "./store/reducers/themeSlice";
import { RootState } from "./store/store";

export const App: React.FC = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: "always",
                refetchOnReconnect: "always",
                refetchOnWindowFocus: false,
                optimisticResults: true,
            },
        },
    });

    const dispatch = useDispatch();

    const currentTheme = useSelector(
        (root: RootState) => root.themes.currentTheme
    );

    useEffect(() => {
        AxiosRefreshInterceptor.createAxiosRefreshInterceptor();
        dispatch(setTheme("light"));
    }, []);

    return (
        <ConfigProvider theme={currentTheme}>
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
