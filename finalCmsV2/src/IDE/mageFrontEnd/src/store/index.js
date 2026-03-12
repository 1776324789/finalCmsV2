import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { verifyToken, getMenuData } from '@/request/login'
export const useDataStore = defineStore('dataStore', () => {
    const userData = ref(null)
    const menuData = ref([])
    const website = ref([])
    const targetSite = ref(null)
    async function init() {
        if (window.sessionStorage.getItem("token") == null) return
        let res = await verifyToken({ token: window.sessionStorage.getItem("token") })
        if (res.code == 200) {
            userData.value = res.data
            await loadMenuData()
        }
    }
    async function loadMenuData() {
        let res = await getMenuData()
        if (res.code == 200) {
            website.value = res.data
            formatWebMenu()
        }
    }

    function formatWebMenu() {
        website.value.forEach(web => {
            web.menuTemp = web.menu
            web.menu = []
            const menuMap = new Map()

            web.menuTemp.forEach(menu => {
                menuMap.set(menu.id, menu)
                if (menu.parentId == null)
                    web.menu.push(menu)
            })
            web.menuTemp.forEach(menu => {
                if (menu.parentId != null) {
                    if (menuMap.get(menu.parentId).child == null) menuMap.get(menu.parentId).child = [menu]
                    else menuMap.get(menu.parentId).child.push(menu)
                }
            })
        })
    }

    return {
        targetSite,
        website,
        init,
        userData,
        menuData
    }
})
