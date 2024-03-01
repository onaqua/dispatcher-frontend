import axios from "axios";
import React from "react";
import { OpenAPI } from "../services/core/OpenAPI";

export interface RefreshProviderProps {
    children?: React.ReactNode;
}

export const RefreshProvider: React.FC<RefreshProviderProps> = ({
    children,
}) => {
    let isRefreshing: boolean = false;

    const createInteceptor = (): boolean => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response.status !== 401) {
                    return Promise.reject(error);
                }

                axios.interceptors.response.eject(interceptor);

                if (!isRefreshing) {
                    isRefreshing = true;

                    try {
                        await axios.post(
                            `${OpenAPI.BASE}/authorization/refresh`,
                            {},
                            {
                                withCredentials: true,
                            }
                        );

                        isRefreshing = false;
                    } catch {
                        isRefreshing = false;

                        return Promise.reject(error);
                    } finally {
                        createInteceptor();
                    }
                }

                while (isRefreshing) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                return axios(error.response.config);
            }
        );

        console.log("RefreshProvider: created interceptor");

        return true;
    };

    if (createInteceptor()) {
        return children;
    }
};

export default RefreshProvider;
