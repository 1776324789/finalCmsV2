// 代理后台数据接口
import FrontExpress from './server/FrontServer.js'
import BackEndServer from './server/backEndServer/BackEndServer.js'
import DBController from './DBController/DBController.js'

const DB = DBController()
FrontExpress(DB)
BackEndServer(DB)