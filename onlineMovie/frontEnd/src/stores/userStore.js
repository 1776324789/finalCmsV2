
import { defineStore } from 'pinia'
import { ref } from 'vue'

const DefaultUser = ref([{
    user: "大菠萝",
    queryName: ["刘军", "大菠萝"]
},
{
    user: "刘老师",
    queryName: ["刘敏", "刘老师", "冷冰凝爱雨梦翠霜"]
},
{
    user: "周董",
    queryName: ["周鸿浩", "周董"]
},
{
    user: "苗苗",
    queryName: ["万云凤", "苗苗", "凤", "四凤"]
}])
export const useUserStore = defineStore('userData', () => {
    let ws = null
    const user = ref(null)
    const systemInfo = ref(null)
    const wsFunctionMap = {
        logout: (data) => {
            console.log(data);

            ws.close()
            user.value = null
        },
        systemInfo: (data) => {
            systemInfo.value = data
            // console.log(data);
        }
    }
    function login(username) {
        DefaultUser.value.forEach(item => {
            if (item.queryName.includes(username)) {
                user.value = item.user
                initWebSocket()
            }
        })
    }


    function initWebSocket() {
        ws = new WebSocket("ws://localhost:3000")

        ws.onopen = () => {
            console.log('WebSocket connected')
            console.log('initUserData')
            ws.send(JSON.stringify({
                type: "login",
                data: user.value
            }))
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            // console.log(data);

            if (wsFunctionMap[data.type])
                wsFunctionMap[data.type](data.data)
        }

        ws.onclose = () => {
            setTimeout(() => {
                initWebSocket()
            }, 3000)
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }
    }
    function logout() {

    }
    function watchMovie(movie) {
        systemInfo.value.watchMovie = movie
    }
    return {
        DefaultUser,
        watchMovie,
        systemInfo,
        user,
        login
    }
})
