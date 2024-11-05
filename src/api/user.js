import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/login_check',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      email: data.email,
      password: data.password
    }
  });
}


export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
