const jwt = require("jsonwebtoken")//token验证组件
const setting = require("../../setting")
const verifyDate = setting.verifyDate
const crypto = require('crypto'); //加密组件
const fs = require("fs")
const path = require("path")
const basePath = process.cwd();

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

// 用户信息、密匙、token
const secretKey = crypto.randomBytes(32).toString('hex');//加密组件
// 验证token
const verifyToken = (token) => {
    if (global["tokenPool"].has(token)) {
        let tokenBody = global["tokenPool"].get(token)
        if (tokenBody.date + verifyDate < Date.now()) {
            global["tokenPool"].delete(token)
            return 401
        } else {
            tokenBody.date = Date.now()
            return 200
        }
    } else {
        return 404
    }
}

const removeToken = (token) => {
    global["tokenPool"].delete(token)
}

// 生成token
const createToken = (user) => {
    // 生成令牌
    let token = jwt.sign({
        account: user.account
    }, secretKey, {});
    global["tokenPool"].set(token, {
        token: token,
        date: Date.now(),
        user: user
    })
    return token
}

// 验证用户
const verifyUser = (account, password) => {
    let result = false
    getUserInfo().forEach(user => {
        if (user.account == account && user.password == password) {
            user.password = ""
            user.token = createToken(user)
            result = user
        }
    })
    return result
}


// 通过token获取用户权限
const getPremission = (token) => {
    let premission = getPremissionInfo()
    let roles = getRoleInfo()

    let userPremission = []


    getUserInfo().forEach(user => {
        if (user.account == global["tokenPool"].get(token).user.account) {
            roles.forEach(role => {
                if (user.role.includes(role.id)) {
                    role.premission.forEach(item => {
                        if (!userPremission.includes(item)) userPremission.push(item)
                    })
                }
            })
            return
        }
    })
    let result = []
    premission.forEach(item => {
        if (userPremission.includes(item.name) && item.able == true) {
            result.push(item)
        }
    })
    return result
}


const getUserInfo = () => {
    return JSON.parse(decrypt(fs.readFileSync(path.join(basePath, 'IDE', 'userInfo'), 'utf-8')))
}
const getPremissionInfo = () => {
    return JSON.parse(decrypt(fs.readFileSync(path.join(basePath, 'IDE', 'premission'), 'utf-8')))
}
const getRoleInfo = () => {
    return JSON.parse(decrypt(fs.readFileSync(path.join(basePath, 'IDE', 'role'), 'utf-8')))
}
const setUserInfo = (value) => { fs.writeFileSync(path.join(basePath, 'IDE', 'userInfo'), encrypt(value)) }
const setPremissionInfo = (value) => { fs.writeFileSync(path.join(basePath, 'IDE', 'premission'), encrypt(value)) }
const setRoleInfo = (value) => { fs.writeFileSync(path.join(basePath, 'IDE', 'role'), encrypt(value)) }

module.exports = { verifyUser, removeToken, verifyToken, getPremission, getUserInfo, getPremissionInfo, getRoleInfo, setUserInfo, setPremissionInfo, setRoleInfo }
