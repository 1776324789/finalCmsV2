import { defineStore } from 'pinia'
import { ref } from 'vue'
import { verifyToken, getMenuData } from '@/request/login'


export const useSystemStore = defineStore('systemData', () => {
    const userData = ref(null)
    const menuData = ref([])
    const userFunctionData = ref([])
    const targetSite = ref(null)
    const eventMap = ref({})


    async function init() {
        if (window.sessionStorage.getItem("token") == null) return
        let res = await verifyToken({ token: window.sessionStorage.getItem("token") })

        if (res.code == 200) {
            userData.value = res.data
            await loadMenuData()
  
            return true
        } else return false


    }

    async function loadMenuData() {
        let res = await getMenuData()
        if (res.code == 200) {
            userFunctionData.value = res.data
        }
    }





    function addEvent(eventName, callback) {
        if (!eventMap.value[eventName])
            eventMap.value[eventName] = []
        eventMap.value[eventName].push(callback)
    }

    function dispatch(eventName, ...args) {
        eventMap.value[eventName].forEach(item => {
            item(...args)
        })
    }

    function removeEvent(eventName, callback) {
        eventMap.value[eventName] = eventMap.value[eventName].filter(item => item != callback)
    }

    return {
        targetSite,
        userFunctionData,
        userData,
        menuData,
        init,
        addEvent,
        removeEvent,
        dispatch,

    }
})
