import {ProxyOptions} from 'vite'
const proxy:Record<string, string | ProxyOptions>={
    '/api': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
  }
}
export default proxy