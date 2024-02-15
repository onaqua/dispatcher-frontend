import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ThemeConfig } from "antd";
import { theme } from "antd";

type ThemeState = {
    currentTheme: ThemeConfig;
};

const darkTheme: ThemeConfig = {
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
};

const lightTheme: ThemeConfig = {
    algorithm: theme.defaultAlgorithm,
};

const initialState: ThemeState = {
    currentTheme: lightTheme,
};

const themeSlice = createSlice({
    name: "themes",
    initialState: initialState,
    reducers: {
        setTheme(state, action: PayloadAction<"light" | "dark">) {
            if (action.payload === "light") {
                state.currentTheme.algorithm = lightTheme.algorithm;
                state.currentTheme.token = lightTheme.token;

                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
                localStorage.setItem("theme", "light");
            }

            if (action.payload === "dark") {
                state.currentTheme.algorithm = darkTheme.algorithm;
                state.currentTheme.token = darkTheme.token;

                document.documentElement.classList.remove("light");
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            }
        },
    },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
