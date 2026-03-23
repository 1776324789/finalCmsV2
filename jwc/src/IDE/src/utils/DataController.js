const fs = require("fs")
const path = require("path")
const setting = require("../../setting")
const basePath = process.cwd();
const dataTemplatePath = path.join(basePath, "Front", "template", 'data')
const dataDistPath = path.join(basePath, "Front", "dist", 'data')
//清除全部数据
const ClearData = () => {

    fs.readdirSync(path.join(dataTemplatePath, 'list')).forEach(item => {
        fs.unlinkSync(path.join(dataTemplatePath, "list", item))
    })

    fs.readdirSync(path.join(dataTemplatePath, 'node')).forEach(item => {
        fs.unlinkSync(path.join(dataTemplatePath, "node", item))
    })

    fs.readdirSync(path.join(dataTemplatePath, 'content')).forEach(item => {
        fs.unlinkSync(path.join(dataTemplatePath, "content", item))
    })

    fs.readdirSync(path.join(dataDistPath, 'list')).forEach(item => {
        fs.unlinkSync(path.join(dataDistPath, "list", item))
    })

    fs.readdirSync(path.join(dataDistPath, 'node')).forEach(item => {
        fs.unlinkSync(path.join(dataDistPath, "node", item))
    })

    fs.readdirSync(path.join(dataDistPath, 'content')).forEach(item => {
        fs.unlinkSync(path.join(dataDistPath, "content", item))
    })
}
//清除全部数据
const CreateData = (data) => {
    data.list.forEach(item => {
        fs.writeFileSync(path.join(dataTemplatePath, "list", item.id + ".json"), JSON.stringify(item))
        fs.writeFileSync(path.join(dataDistPath, "list", item.id + ".json"), JSON.stringify(item))
    })
    data.node.forEach(item => {
        fs.writeFileSync(path.join(dataTemplatePath, "node", item.id + ".json"), JSON.stringify(item))
        fs.writeFileSync(path.join(dataDistPath, "node", item.id + ".json"), JSON.stringify(item))
    })
    data.content.forEach(item => {
        let content = {}
        content["content"] = item.content
        fs.writeFileSync(path.join(dataTemplatePath, "content", item.id + ".json"), JSON.stringify(content))
        fs.writeFileSync(path.join(dataDistPath, "content", item.id + ".json"), JSON.stringify(content))
    })
}
const DataToSQL = () => {
    let idMap = new Map()
    let idIndex = 0
    fs.readdirSync(path.join(dataTemplatePath, 'content')).forEach(item => {
        idIndex++
        idMap.set(item.replace(".json", ""), idIndex)
    })
    fs.readdirSync(path.join(dataTemplatePath, 'list')).forEach(item => {
        idIndex++
        idMap.set(item.replace(".json", ""), idIndex)
    })
    fs.readdirSync(path.join(dataTemplatePath, 'node')).forEach(item => {
        idIndex++
        idMap.set(item.replace(".json", ""), idIndex)
    })
    let listSQL = "\nDROP TABLE IF EXISTS list;\n" +
        "CREATE TABLE list  (\n" +
        "  `id` int(11) NOT NULL AUTO_INCREMENT,\n" +
        "  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '名称',\n" +
        "  `enName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '英文名称',\n" +
        "  `template` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '列表页',\n" +
        "  `nodeTemplate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '内容页',\n" +
        "  `type` int(255) NULL DEFAULT NULL COMMENT '类型：1文章、2图片、3文件、4链接',\n" +
        "  `index` int(11) NULL DEFAULT NULL COMMENT '排序',\n" +
        "  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注、简介',\n" +
        "  `parentId` varchar(255) NULL DEFAULT NULL COMMENT '父Id 没有则为空',\n" +
        "  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面',\n" +
        "  `delFlag` int(11) NULL DEFAULT NULL ,\n" +
        "  PRIMARY KEY (`id`) USING BTREE\n" +
        ") ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;"


    let nodeSQL = "\nDROP TABLE IF EXISTS node;\n" +
        "CREATE TABLE node  (\n" +
        "  `id` int(11) NOT NULL AUTO_INCREMENT,\n" +
        "  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标题',\n" +
        "  `clicks` int(11) NULL DEFAULT NULL COMMENT '点击量',\n" +
        "  `date` datetime NULL DEFAULT NULL COMMENT '发布日期',\n" +
        "  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '链接',\n" +
        "  `top` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '是否置顶',\n" +
        "  `publish` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '是否发布',\n" +
        "  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注、简介',\n" +
        "  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面',\n" +
        "  `type` int(11) NULL DEFAULT NULL COMMENT '类型',\n" +
        "  `parentId` varchar(255) NULL DEFAULT NULL COMMENT '父Id（listId）',\n" +
        "  PRIMARY KEY (`id`) USING BTREE\n" +
        ") ENGINE = InnoDB AUTO_INCREMENT = 2875 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;"

    let contentSQL = "\nDROP TABLE IF EXISTS content;\n" +
        "CREATE TABLE content  (\n" +
        "  `id` varchar(11) NOT NULL,\n" +
        "  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',\n" +
        "  PRIMARY KEY (`id`) USING BTREE\n" +
        ") ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;"


    fs.readdirSync(path.join(dataTemplatePath, 'list')).forEach(item => {
        let data = JSON.parse(fs.readFileSync(path.join(dataTemplatePath, 'list', item), "utf-8"))
        let line = `INSERT INTO list
                    VALUES (${idMap.get(item.replace(".json", ""))}, '${data.name.replaceAll("'", "\\'")}',
                            '${data.enName.replaceAll("'", "\\'")}', '${data.template}', '${data.nodeTemplate}',
                            ${data.type}, ${data.index * 1}, '${data.note.replaceAll("'", "\\'")}',
                            ${data.parentId == "" ? "''" : idMap.get(data.parentId)}, '${data.cover}',
                            ${data.delFlag * 1});`
        listSQL += "\n" + line
    })
    fs.readdirSync(path.join(dataTemplatePath, 'node')).forEach(item => {
        let data = JSON.parse(fs.readFileSync(path.join(dataTemplatePath, 'node', item), "utf-8"))
        let line = `INSERT INTO node
                    VALUES (${idMap.get(item.replace(".json", ""))}, '${data.title.replaceAll("'", "\\'")}',
                            ${data.clicks}, '${data.date}', '${data.link}', '${data.top.top}', '${data.publish.publish}
                            ', '${data.note.replaceAll("'", "\\'")}', '${data.cover}', ${data.type},
                            ${data.parentId == "" ? "''" : idMap.get(data.parentId)});`
        nodeSQL += "\n" + line
    })
    fs.readdirSync(path.join(dataTemplatePath, 'content')).forEach(item => {
        let data = JSON.parse(fs.readFileSync(path.join(dataTemplatePath, 'content', item), "utf-8"))
        let line = `INSERT INTO content
                    VALUES (${idMap.get(item.replace(".json", ""))}, '${data.content.replaceAll("'", "\\'")}');`
        contentSQL += "\n" + line
    })
    fs.writeFileSync(path.join(basePath, 'IDE', 'resources', 'SQL.sql'), listSQL + nodeSQL + contentSQL)
}
module.exports = { ClearData, CreateData, DataToSQL }
