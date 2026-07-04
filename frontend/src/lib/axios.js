import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Intercept 401 responses and silently refresh the access token, then replay
// the original request.  We must NOT retry certain auth endpoints:
//   - /auth/refresh-token  – retrying creates an infinite loop (it has no token either)
//   - /auth/login          – a 401 here means "wrong password"; the real message
//                            must reach the caller, not be swallowed by a failed refresh
//   - /auth/signup         – same reasoning as login
const NO_RETRY_PATHS = ["/auth/refresh-token", "/auth/login", "/auth/signup"];

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isNoRetryPath = NO_RETRY_PATHS.some((path) =>
            originalRequest.url?.includes(path)
        );

        const shouldRetry =
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isNoRetryPath;

        if (shouldRetry) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post("/auth/refresh-token");
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh itself failed — let the original error propagate
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;