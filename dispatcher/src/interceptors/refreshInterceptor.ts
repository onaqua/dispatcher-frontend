import axios from "axios";
import { OpenAPI } from "../services/core/OpenAPI";

class AxiosRefreshInterceptor {
    private static isRefreshing: boolean = false;

    public static createAxiosRefreshInterceptor() {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response.status !== 401) {
                    return Promise.reject(error);
                }

                axios.interceptors.response.eject(interceptor);

                if (!this.isRefreshing) {
                    this.isRefreshing = true;

                    try {
                        await axios.post(
                            `${OpenAPI.BASE}/authorization/refresh`,
                            {},
                            {
                                withCredentials: true,
                            }
                        );

                        this.isRefreshing = false;
                    } catch {
                        this.isRefreshing = false;

                        return Promise.reject(error);
                    }
                }

                while (this.isRefreshing) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                this.createAxiosRefreshInterceptor();

                return axios(error.response.config);
            }
        );
    }
}

export default AxiosRefreshInterceptor;
