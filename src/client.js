import axios from 'axios';

const client = axios.create({
    baseURL: "http://127.0.0.1:5000",
    withCredentials: true
});

export default client;