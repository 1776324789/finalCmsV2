const setting = require('../../setting')
const CryptoJS = require('./crypto-js.min');
// Base32 编码表
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function generateTOTP() {
    try {
        // 解码Base32密钥
        const keyBytes = base32Decode(setting.secretKey);


        const key = CryptoJS.lib.WordArray.create(keyBytes);

        // 计算时间步数
        const time = Math.floor(Date.now() / 1000);
        const counter = Math.floor(time / 30);

        // 将计数器转换为8字节大端序
        const counterHex = counter.toString(16).padStart(16, '0');
        const counterBytes = CryptoJS.enc.Hex.parse(counterHex);

        // 计算HMAC-SHA1
        const hmac = CryptoJS.HmacSHA1(counterBytes, key);
        const hmacHex = hmac.toString(CryptoJS.enc.Hex);

        // 动态截断
        const offset = parseInt(hmacHex.substr(-1), 16);
        const truncated = hmacHex.substr(offset * 2, 8);
        const code = (parseInt(truncated, 16) & 0x7fffffff) % 1000000;

        return code.toString().padStart(6, '0')
    } catch (error) {
        return null
    }
}

function base32Decode(encoded) {
    encoded = encoded.toUpperCase().replace(/=+$/, '');
    let bits = '';
    for (let i = 0; i < encoded.length; i++) {
        const char = encoded[i];
        const index = BASE32_CHARS.indexOf(char);
        if (index === -1) continue;
        bits += index.toString(2).padStart(5, '0');
    }

    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        if (i + 8 <= bits.length) {
            bytes.push(parseInt(bits.substr(i, 8), 2));
        }
    }
    return new Uint8Array(bytes);
}
function verifyTOTP(key) {
    let res = generateTOTP()
    if (res == null) return { code: 400 }
    if (res == key) return { code: 200 }
    else return { code: 401 }
}
module.exports = verifyTOTP;