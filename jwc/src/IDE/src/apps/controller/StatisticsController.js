BaseBackController = require("../BaseBackController")

class StatisticsController extends BaseBackController {
    constructor() {
        super()
    }

    initPost() {
        // 获取列表点击量数据
        this.post("/getClicksData", (req, res) => {
            res.send({
                code: 200,
                data: JSON.parse(this.fs.readFileSync(this.path.join(this.basePath, 'IDE', 'clicks.json'), 'utf-8'))
            });
            this.log.cmsAccess(req, res)
        })

        // 获取日点击量数据
        this.post("/getClickDateData", (req, res) => {
            res.send({
                code: 200,
                data: JSON.parse(this.fs.readFileSync(this.path.join(this.basePath, 'IDE', 'clicksDateData.json'), 'utf-8'))
            });
            this.log.cmsAccess(req, res)
        })
    }
}

module.exports = new StatisticsController()