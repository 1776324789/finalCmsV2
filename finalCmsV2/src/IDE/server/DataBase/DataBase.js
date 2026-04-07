import SystemController from "./SystemController.js"
import WebsiteController from "./WebsiteController.js"

const DB = () => {
    return {
        SystemController,
        WebsiteController
    }
}

export default DB()