// 定义Bridge类的实现
const Bridge = new class BridgeImpl {
  // 构造函数
  constructor() {
    this.data = {}
    this.eventMap = new Map()
  }

  addEventListener(event, callback) {
    if (this.eventMap.has(event)) {
      this.eventMap.get(event).push(callback)
    } else {
      this.eventMap.set(event, [callback])
    }
  }

  dispatchEvent(event, data) {
    if (this.eventMap.has(event)) {
      this.eventMap.get(event).forEach(callback => callback(data))
    }
  }

  // 设置数据
  set(key, data) {
    this.data[key] = data
    window.sessionStorage.setItem(key, JSON.stringify(data))
  }

  // 获取数据
  get(key) {
    let res = this.data[key]
    if (res == null) {
      res = JSON.parse(window.sessionStorage.getItem(key))
    }
    return res
  }

  // 删除数据
  del(key) {
    delete this.data[key]
    window.sessionStorage.removeItem(key)
  }
}