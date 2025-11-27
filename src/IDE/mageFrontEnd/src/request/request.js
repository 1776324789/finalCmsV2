import axios from 'axios'
let baseURL
if (window.location.href.indexOf('localhost') !== -1) {
    baseURL = 'http://localhost:7439/'
} else {
    baseURL = "https://bbs.jxuspt.com/server/"
}

const instance = axios.create({
    baseURL: baseURL,
    timeout: 150000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
})

// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        let token = window.sessionStorage.getItem('token')
        if (token) {
            config.headers.token = token
        }
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response.data
    },
    function (error) {
        // 对响应错误做点什么
        if (
            error.code === 'ECONNABORTED' ||
            error.message.indexOf('timeout') !== -1
        ) {
            // 请求超时处理
            console.error('请求超时')
            return {
                code: 408,
                message: '请求超时',
            }
        } else if (
            error.code == 'ERR_NETWORK' ||
            error.message === 'Network Error'
        ) {
            // 网络错误处理
            console.error('网络错误')
            return {
                code: 404,
                message: '网络错误',
            }
        } else {
            // 其他错误处理
            console.error(error.code)
            return {
                code: error.code,
                message: '程序内部错误！',
            }
            // return Promise.reject(error)
        }
    }
)



const instanceWithoutToken = axios.create({
    baseURL: baseURL,
    timeout: 150000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
})

// 添加请求拦截器
instanceWithoutToken.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instanceWithoutToken.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response.data
    },
    function (error) {
        // 对响应错误做点什么
        if (
            error.code === 'ECONNABORTED' ||
            error.message.indexOf('timeout') !== -1
        ) {
            // 请求超时处理
            console.error('请求超时')
            return {
                code: 408,
                message: '请求超时',
            }
        } else if (
            error.code == 'ERR_NETWORK' ||
            error.message === 'Network Error'
        ) {
            // 网络错误处理
            console.error('网络错误')
            return {
                code: 404,
                message: '网络错误',
            }
        } else {
            // 其他错误处理
            console.error(error.code)
            return {
                code: error.code,
                message: '程序内部错误！',
            }
            // return Promise.reject(error)
        }
    }
)



const instanceUrlencoded = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
})


const instanceFile = axios.create({
    baseURL: baseURL,
    timeout: 5 * 60 * 1000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

// 添加请求拦截器
instanceFile.interceptors.request.use(
    function (config) {
        let token = window.sessionStorage.getItem('token')
        if (token) {
            config.headers.token = token
        }
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instanceFile.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response.data
    },
    function (error) {
        // 对响应错误做点什么
        if (
            error.code === 'ECONNABORTED' ||
            error.message.indexOf('timeout') !== -1
        ) {
            // 请求超时处理
            console.error('请求超时')
            return {
                code: 408,
                message: '请求超时',
            }
        } else if (
            error.code == 'ERR_NETWORK' ||
            error.message === 'Network Error'
        ) {
            // 网络错误处理
            console.error('网络错误')
            return {
                code: 404,
                message: '网络错误',
            }
        } else {
            // 其他错误处理
            console.error(error.code)
            return {
                code: error.code,
                message: '程序内部错误！',
            }
            // return Promise.reject(error)
        }
    }
)


const instanceDownload = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    responseType: 'blob'
})

// 添加请求拦截器
instanceDownload.interceptors.request.use(
    function (config) {
        let token = window.sessionStorage.getItem('token')
        if (token) {
            config.headers.token = token
        }
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instanceDownload.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response
    },
    function (error) {
        // 对响应错误做点什么
        if (
            error.code === 'ECONNABORTED' ||
            error.message.indexOf('timeout') !== -1
        ) {
            // 请求超时处理
            console.error('请求超时')
            return {
                code: 408,
                message: '请求超时',
            }
        } else if (
            error.code == 'ERR_NETWORK' ||
            error.message === 'Network Error'
        ) {
            // 网络错误处理
            console.error('网络错误')
            return {
                code: 404,
                message: '网络错误',
            }
        } else {
            // 其他错误处理
            console.error(error.code)
            return {
                code: error.code,
                message: '程序内部错误！',
            }
            // return Promise.reject(error)
        }
    }
)

export { instance, instanceWithoutToken, instanceFile, instanceDownload, baseURL }
