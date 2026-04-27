

const MOCK_DELAY = 500; // ms

const mockData = {
    '/users/login': {
        token: 'mock-jwt-token',
        user: { id: 1, name: 'Demo User', email: 'demo@example.com', role: 'BORROWER' }
    },
    '/users/register': { message: 'User registered successfully' },
    '/loans': [
        { id: 1, lenderId: 101, amount: 5000, interestRate: 5.5, term: 12, status: 'AVAILABLE' },
        { id: 2, lenderId: 102, amount: 10000, interestRate: 4.2, term: 24, status: 'AVAILABLE' },
        { id: 3, lenderId: 103, amount: 2500, interestRate: 6.0, term: 6, status: 'AVAILABLE' }
    ],
    '/borrower/applications': [
        { id: 1, loanId: 1, status: 'PENDING', appliedDate: '2024-03-20' }
    ]
};

const simulateResponse = (data, status = 200) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (status >= 200 && status < 300) {
                resolve({
                    data,
                    status,
                    statusText: 'OK',
                    headers: {},
                    config: {}
                });
            } else {
                reject({
                    response: {
                        data: data || { message: 'Error occurred' },
                        status,
                        statusText: 'Error'
                    }
                });
            }
        }, MOCK_DELAY);
    });
};

const axiosMock = {
    get: (url, config) => {
        console.log(`[Mock Axios] GET ${url}`);
        const data = mockData[url] || [];
        return simulateResponse(data);
    },
    post: (url, data, config) => {
        console.log(`[Mock Axios] POST ${url}`, data);
        const responseData = mockData[url] || { message: 'Success', ...data };
        return simulateResponse(responseData, 201);
    },
    put: (url, data, config) => {
        console.log(`[Mock Axios] PUT ${url}`, data);
        return simulateResponse({ message: 'Updated successfully', ...data });
    },
    delete: (url, config) => {
        console.log(`[Mock Axios] DELETE ${url}`);
        return simulateResponse({ message: 'Deleted successfully' });
    },
    // Mock for axios.create()
    create: () => axiosMock,
    // Add generic interceptors for compatibility
    interceptors: {
        request: { use: () => {}, eject: () => {} },
        response: { use: () => {}, eject: () => {} }
    }
};

export default axiosMock;
