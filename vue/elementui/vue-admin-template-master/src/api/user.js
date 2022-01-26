import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function muis() {
  return request({
    url: 'https://api.uomg.com/api/radnd.music?sort=%E7%83%AD%E6%AD%8C%E6%A6%9C&format=json',
    method: 'get'
  })
}