const cf = {
    API_BASE: ''
};

async function apiRequest(endpoint, options = {}) {
    const url = cf.API_BASE + endpoint;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

const API = {
    async init() {
        return apiRequest('/init', { method: 'POST' });
    },

    async login(password) {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        });
    },

    async getProjects(params = {}) {
        const query = new URLSearchParams(params).toString();
        return apiRequest('/projects' + (query ? `?${query}` : ''));
    },

    async createProject(project) {
        return apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(project),
        });
    },

    async updateProject(id, project) {
        return apiRequest(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
        });
    },

    async deleteProject(id) {
        return apiRequest(`/projects/${id}`, { method: 'DELETE' });
    },

    async getCustomers() {
        return apiRequest('/customers');
    },

    async createCustomer(customer) {
        return apiRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(customer),
        });
    },

    async updateCustomer(customerNo, customer) {
        return apiRequest(`/customers/${customerNo}`, {
            method: 'PUT',
            body: JSON.stringify(customer),
        });
    },

    async deleteCustomer(customerNo) {
        return apiRequest(`/customers/${customerNo}`, { method: 'DELETE' });
    },

    async getDeposits() {
        return apiRequest('/deposits');
    },

    async createDeposit(deposit) {
        return apiRequest('/deposits', {
            method: 'POST',
            body: JSON.stringify(deposit),
        });
    },

    async updateDeposit(id, deposit) {
        return apiRequest(`/deposits/${id}`, {
            method: 'PUT',
            body: JSON.stringify(deposit),
        });
    },

    async deleteDeposit(id) {
        return apiRequest(`/deposits/${id}`, { method: 'DELETE' });
    },

    async getTasks(params = {}) {
        const query = new URLSearchParams(params).toString();
        return apiRequest('/tasks' + (query ? `?${query}` : ''));
    },

    async createTask(task) {
        return apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
        });
    },

    async updateTask(id, task) {
        return apiRequest(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(task),
        });
    },

    async deleteTask(id) {
        return apiRequest(`/tasks/${id}`, { method: 'DELETE' });
    },

    async toggleTask(id) {
        return apiRequest(`/tasks/${id}/toggle`, { method: 'PUT' });
    },

    async getOptions() {
        return apiRequest('/options');
    },

    async updateOption(key, value) {
        return apiRequest('/options', {
            method: 'PUT',
            body: JSON.stringify({ key, value }),
        });
    },
};
