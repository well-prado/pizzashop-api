import { env } from './env'

function createApi() {
  const baseURL = env.DESKREE_API_URL

  async function request(endpoint: any, options?: any) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Deskree-Admin': env.DESKREE_ADMIN_TOKEN,
        'Access-Control-Allow-Origin': 'https://www.globaldesk.com.br',
        'Access-Control-Allow-Credentials': 'true',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.json()
  }

  return {
    get: (url: any, options?: any) =>
      request(url, { ...options, method: 'GET' }),
    delete: (url: any, options?: any) =>
      request(url, { ...options, method: 'DELETE' }),
    post: (url: any, options?: any) =>
      request(url, { ...options, method: 'POST' }),
    put: (url: any, options?: any) =>
      request(url, { ...options, method: 'PUT' }),
    patch: (url: any, options?: any) =>
      request(url, { ...options, method: 'PATCH' }),
  }
}

export const api = createApi()
