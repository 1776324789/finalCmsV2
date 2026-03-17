
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'


export const useUserStore = defineStore('userData', () => {
    const isConnected = ref(false)

    const DefaultUser = ref([{
        user: "大菠萝",
        queryName: ["刘军", "大菠萝", "军少"]
    },
    {
        user: "刘老师",
        queryName: ["刘敏", "刘老师", "冷冰凝爱雨梦翠霜", "敏姐姐"]
    },
    {
        user: "周董",
        queryName: ["周鸿浩", "周董"]
    },
    {
        user: "苗苗",
        queryName: ["万云凤", "苗苗", "凤", "四凤", "凤姐姐"]
    },
    {
        user: "蕙",
        queryName: ["蕙", "周雯蕙", "周老师", "周姐姐"]
    }])
    let ws = null
    const user = ref(null)
    onMounted(() => {
        console.log(localStorage.getItem("user"));

        user.value = localStorage.getItem("user")
        if (user.value)
            initWebSocket()
    })
    const systemInfo = ref({
        onlineUser: []
    })

    const wsFunctionMap = {
        logout: () => {
            ws.close()
            user.value = null
        },
        systemInfo: (data) => {
            systemInfo.value = data
        }
    }



    function login(username) {
        DefaultUser.value.forEach(item => {
            if (item.queryName.includes(username)) {
                user.value = item.user
                localStorage.setItem("user", item.user)
                initWebSocket()
            }
        })
    }


    function initWebSocket() {
        ws = new WebSocket("ws://localhost:3000")

        ws.onopen = () => {
            isConnected.value = true
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
            isConnected.value = false
            setTimeout(() => {
                initWebSocket()
            }, 3000)
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }
    }
    function logout() {
        ws.send(JSON.stringify({
            type: "logout",
            data: user.value
        }))
        localStorage.setItem("user", null)
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
