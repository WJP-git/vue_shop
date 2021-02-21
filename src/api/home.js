import Network from './axios'
export const getMenuList = () => Network.get('/menus');
// users
export const getUserList = (data) => Network.get('/users/', data);
export const putUserList = (path) => Network.put(path);
export const postUserList = (data) => Network.post('/users', data)
export const getUserId = (path) => Network.get(path)
export const putUserItem = (path, data) => Network.put(path, data)
export const delUserItem = (id) => Network.delete('/users/' + id)