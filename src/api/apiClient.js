const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://loansphere-backend.onrender.com/api';

// Timeout in ms — 30s to allow Render free-tier cold starts to wake up
const REQUEST_TIMEOUT_MS = 30000;

const fetchWithTimeout = (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
};

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData = null;
        try {
            errorData = await response.json();
        } catch {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData?.error || errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
};

const request = async (method, endpoint, data) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (data !== undefined) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetchWithTimeout(url, options);
        return handleResponse(response);
    } catch (err) {
        // AbortError means our timeout fired
        if (err.name === 'AbortError') {
            console.error(`[apiClient] Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s: ${method} ${url}`);
            throw new Error('Request timed out. The server may be starting up — please try again in a moment.');
        }
        // TypeError: Failed to fetch → network issue, CORS block, or server not running
        if (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch')) {
            console.error(`[apiClient] Network/CORS error: ${method} ${url}`, err);
            throw new Error('Unable to reach the server. Check your connection or try again shortly.');
        }
        // Re-throw all other errors (HTTP 4xx/5xx already formatted above)
        throw err;
    }
};

export const apiClient = {
    get:    (endpoint)        => request('GET',    endpoint),
    post:   (endpoint, data)  => request('POST',   endpoint, data),
    put:    (endpoint, data)  => request('PUT',    endpoint, data),
    delete: (endpoint)        => request('DELETE', endpoint),
    patch:  (endpoint, data)  => request('PATCH',  endpoint, data),
};

