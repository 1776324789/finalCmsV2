const fs = require("fs")
const path = require("path")
const basePath = process.cwd();
const crypto = require('crypto'); //加密组件


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

module.exports = { encrypt, decrypt }