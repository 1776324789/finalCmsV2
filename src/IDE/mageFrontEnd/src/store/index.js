import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useDataStore = defineStore('dataStore', () => {
    const userData = ref(null)

    const menuData = ref([
        {
            name: "数据统计",
            icon: "icon-database-line",
            target: 'dataAnalysis'
        },
        {
            name: "栏目管理",
            icon: "icon-archive-drawer-line",
            target: 'webController'
        },
        {
            name: "后台管理",
            icon: "icon-folder-settings-fill",
            open: false,
            child: [
                {
                    name: "用户管理",
                    icon: "icon-user-settings-line",
                    target: 'userMage'
                },
                {
                    name: "角色管理",
                    icon: "icon-user-2-fill",
                    target: 'roleMage'
                },
                {
                    name: "功能管理",
                    icon: "icon-function-fill",
                    target: 'functionMage'
                }]
        },
        {
            name: "站点管理",
            icon: "icon-archive-fill",
            open: false,
            child: [
                {
                    name: "数据传输",
                    icon: "icon-upload-cloud-2-fill",
                    target: 'dataTrans'
                },
                {
                    name: "文件管理",
                    icon: "icon-file-settings-fill",
                    target: 'fileMage'
                }]
        }
    ])


    return {
        menuData

    }
})
