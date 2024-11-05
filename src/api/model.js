import request from '@/utils/request'

export function fetchModels() {
  return request({
    url: '/models',
    method: 'get'
  })
}

export function createModel(data) {
  return request({
    url: '/models',
    method: 'post',
    data
  })
}

export function updateModel(id, data) {
  return request({
    url: `/models/${id}`,
    method: 'put',
    data,
    headers: {
      'Content-Type': 'application/ld+json',
      'Accept': 'application/ld+json'
  }
  })
}

export function deleteModel(id) {
  return request({
    url: `/models/${id}`,
    method: 'delete'
  })
}
