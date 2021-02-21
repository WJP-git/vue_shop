import Network from './axios'
export const login = (data) => Network.post('/login', data)