import axios from 'axios';

export function getUserStats() {
    return axios.get('/api/dashboard/stats')
    .then(response => {
        return response.data})
    .catch((error) => { throw error; });
}