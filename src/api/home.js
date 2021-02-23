import Network from './axios'
export const getMenuList = () => Network.get('/menus');
// users
export const getUserList = (data) => Network.get('/users/', data);
export const putUserList = (path) => Network.put(path);
export const postUserList = (data) => Network.post('/users', data)
export const getUserId = (path) => Network.get(path)
export const putUserItem = (path, data) => Network.put(path, data)
export const delUserItem = (id) => Network.delete('/users/' + id)
export const getRole = () => Network.get('roles')
export const putRoleItem = (id, data) => Network.put(`users/${id}/role`, data)

// power
// power-->Rights 
export const getRightsList = () => Network.get('rights/list')
// power-->Roles 
export const getRolesList = () => Network.get('roles')
export const postRolesList = (data) => Network.post('roles', data)
export const getRolesItem = (id) => Network.get(`roles/${id}`)
export const putRolesItem = (id, data) => Network.put(`roles/${id}`, data)
// 删除一级菜单
export const delRolesItem = (id) => Network.delete(`roles/${id}`)
// 删除三级菜单
export const delRolesLevelMenu = (roleId, rightId) => Network.delete(`roles/${roleId}/rights/${rightId}`)
// 点击分配权限按钮显示分配权限
export const getAssignPermiss = () => Network.get('rights/tree')
export const postAssignPermiss = (id, data) => Network.post(`roles/${id}/rights/`, data)


// goods-->cate
export const getCateList = (obj) => Network.get('categories', obj)
export const postCateItem = (data) => Network.post('categories', data)