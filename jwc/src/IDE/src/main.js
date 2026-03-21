const fs = require("fs")
const path = require("path")
const basePath = process.cwd();
// fetch-json-native.js
// const http = require('http');
// const targetList = {
//     "name": "教学动态",
//     "enName": "",
//     "template": "singleListPage",
//     "nodeTemplate": "baseArticle",
//     "type": "1",
//     "index": 0,
//     "note": "",
//     "parentId": "l_lxouzku4",
//     "cover": "",
//     "id": "l_lxov2rft",
//     "nodeId": [
//         {
//             "id": "n_mc2q7s28",
//             "date": "2025-05-30 09:51:46",
//             "top": {
//                 "untop": true
//             },
//             "clicks": 0,
//             "publish": {
//                 "publish": true
//             }
//         },
//         {
//             "id": "n_mc2qbsev",
//             "date": "2025-05-29 09:54:23",
//             "top": {
//                 "untop": true
//             },
//             "clicks": 0,
//             "publish": {
//                 "publish": true
//             }
//         }
//     ],
//     "listId": [],
//     "delFlag": 0,
//     "list": [],
//     "node": []
// }
// const url = 'http://jwc.jxuspt.edu.cn/resource_json/list/';
// const targetPath = path.join(basePath, 'Front')
// for (var a = 0; a < 1000; a++) {
//     http.get(url + a + '.json', (res) => {
//         let data = '';

//         // 接收数据块
//         res.on('data', (chunk) => {
//             data += chunk;
//         });

//         // 接收完成
//         res.on('end', () => {
//             try {
//                 const json = JSON.parse(data);
//                 if (json.columnID == 55) {
//                     let node = {}
//                     let id = "n_" + (Date.now() + a).toString(36)
//                     node.title = json.newstitle
//                     node.clicks = 0
//                     node.date = formatReleaseTime(json.releasetime)
//                     node.link = ""
//                     node.top = { untop: true }
//                     node.publish = { publish: true }
//                     node.note = ""
//                     node.cover = json.focusPicture
//                     node.type = "3"
//                     node.parentId = "l_lxov2rft"
//                     node.id = id
//                     node.idrealClicks = 0

//                     fs.writeFileSync(path.join(targetPath, 'node', id + ".json"), JSON.stringify(node))

//                     let listNode = {}
//                     listNode.id = id
//                     listNode.date = formatReleaseTime(json.releasetime)
//                     listNode.top = { untop: true }
//                     listNode.clicks = 0
//                     listNode.publish = { publish: true }
//                     targetList.nodeId.push(listNode)
//                     fs.writeFileSync(path.join(targetPath, "l_lxov2rft.json"), JSON.stringify(targetList))
//                     let contentNode = {}
//                     contentNode.content = json.content
//                     fs.writeFileSync(path.join(targetPath, 'content', id + ".json"), JSON.stringify(contentNode))
//                 }
//             } catch (err) {
//             }
//         });
//     }).on('error', (err) => {
//         console.error('请求失败:', err.message);
//     });
// }
// {
//     "title": "江西软件职业技术大学学生转班级申请（审批）表2024版",
//     "clicks": 0,
//     "date": "2025-06-19 09:46:49",
//     "link": "",
//     "top": {
//         "untop": true
//     },
//     "publish": {
//         "publish": true
//     },
//     "note": "",
//     "cover": "",
//     "type": "3",
//     "parentId": "l_lxov2cg3",
//     "fileName": "66ea80b8b7608793b5731847.pdf",
//     "file": "/data/upload/file/1750297625083.pdf",
//     "id": "n_mc2q0kfy"
// }
// function formatReleaseTime(releasetime) {
//     const pad = (num) => String(num).padStart(2, '0');

//     const year = releasetime.year;
//     const month = pad(releasetime.monthValue);
//     const day = pad(releasetime.dayOfMonth);
//     const hour = pad(releasetime.hour);
//     const minute = pad(releasetime.minute);
//     const second = pad(releasetime.second);

//     return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
// }





const crypto = require('crypto'); //加密组件
const setting = require('../setting')

//加载密匙
const key = fs.readFileSync(path.join(basePath, 'IDE', 'key'))

const iv = fs.readFileSync(path.join(basePath, 'IDE', 'iv'))

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

global["userInfo"] = JSON.parse(decrypt(fs.readFileSync(path.join(basePath, "IDE", "userInfo"), "utf-8")))
global["tokenPool"] = new Map()

// 代理后台数据接口
require("./apps/BackExpress")

//data文件监听及更新
require("./threads/DataUpdater")

//是否开启前端文件的编译
if (setting.ifFront) {
    require("./apps/FrontExpress")
}