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
                    createInteceptor();

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
                    }
                }

                while (isRefreshing) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                createInteceptor();

                return axios(error.response.config);
            }
        );

        console.log("return true");

        return true;
    };

    if (createInteceptor()) {
        return children;
    }
};

export default RefreshProvider;
