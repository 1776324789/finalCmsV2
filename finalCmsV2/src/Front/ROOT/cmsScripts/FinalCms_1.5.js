//@Author LiuJun
(() => {
    const url = new URL(document.currentScript.src);
    const params = Object.fromEntries(url.searchParams.entries());
    const BaseCmsURL = window.location.origin + "/" + params.web
    const alwaysLoad = params.alwaysLoad == 'true'
    const listIndex = []
    const NodeIndexMap = {}
    const listIndexMap = {}

    init()
    function init() {
        initBaseStyle()
        if (alwaysLoad) {
            loadDataFromServer()
            return
        }

        fetch(BaseCmsURL + '/data/modifyInfo.json')
            .then(res => res.json())
            .then(json => {
                if (localStorage.getItem('modifyInfo') == null) {
                    localStorage.setItem('modifyInfo', json.updateTime)
                    loadDataFromServer()
                } else {
                    if (json.updateTime > localStorage.getItem('modifyInfo') * 1) {
                        localStorage.setItem('modifyInfo', json.updateTime)
                        loadDataFromServer()
                    } else {
                        JSON.parse(localStorage.getItem('CmsListData')).forEach(item => {
                            listIndex.push(item)
                        })
                        formatData()
                    }
                }
            })
    }

    function initBaseStyle() {
        const style = document.createElement('style')
        style.textContent = `
            cms-list, list-list, list-node, cms-node {
                display: block;
            }
        `
        document.head.appendChild(style)
    }

    function loadDataFromServer() {
        fetch(BaseCmsURL + '/data/listIndex.json')
            .then(res => res.json())
            .then(json => {
                json.forEach(item => {
                    listIndex.push(item)
                })
                localStorage.setItem('CmsListData', JSON.stringify(listIndex))
                formatData()
            })
    }

    function formatData() {
        const format = (list) => {
            listIndexMap[list.id] = list
            list.children.forEach(item => format(item))
            if (list.nodes)
                list.nodes.forEach(item => {
                    NodeIndexMap[item.id] = item
                })
        }
        listIndex.forEach(list => format(list))
        initComponents()
    }


    class BaseCmsElement extends HTMLElement {
        constructor() {
            super()
            this._data
        }

        loadDataId() {
            let dataId = null
            const urlParams = new URLSearchParams(window.location.search);
            const urlDataId = urlParams.get('dataId');
            if (urlDataId != null) {
                dataId = urlDataId
            }

            if (this.getAttribute("data") != null) {
                dataId = this.getAttribute("data")
            }
            return dataId
        }

        set data(val) {
            this._data = val
            this._render()
        }

        _render() {
            if (this._data == null) return
            this.render()
        }

        get data() {
            return this._data
        }

    }

    class CmsList extends BaseCmsElement {
        constructor() {
            super()
            this.data = null
        }

        connectedCallback() {
            if (NodeIndexMap[this.loadDataId()])
                this.data = listIndexMap[this.loadDataId()]
        }

        render() {
            findScopedElements(this, "LIST-NAME", ["CMS-LIST", "LIST-LIST"]).forEach(child => {
                child.data = this.data
            })

            findScopedElements(this, "LIST-INFO", ["CMS-LIST", "LIST-LIST"]).forEach(child => {
                child.data = this.data
            })

            findScopedElements(this, "LIST-LIST", ["CMS-LIST", "LIST-LIST"]).forEach(child => {
                this.data.children.forEach(item => {
                    const cloneElement = child.cloneNode(true)
                    child.parentNode.insertBefore(cloneElement, child)
                    cloneElement.data = item
                })
                child.parentNode.removeChild(child)
            })

            findScopedElements(this, "LIST-NODE", ["CMS-LIST", "LIST-LIST", "LIST-NODE"]).forEach(child => {
                this.data.nodes.forEach(item => {
                    const cloneElement = child.cloneNode(true)
                    child.parentNode.insertBefore(cloneElement, child)
                    cloneElement.data = item
                })
                child.parentNode.removeChild(child)
            })
        }
    }


    class ListList extends CmsList {
        constructor() {
            super()
        }
    }

    class ListName extends BaseCmsElement {
        constructor() {
            super()
        }
        render() {
            if (this.data) {
                this.textContent = this.data.name
            }
        }
    }

    class ListInfo extends BaseCmsElement {
        constructor() {
            super()
        }
        render() {
            if (this.data) {
                this.textContent = this.data.info
            }
        }
    }

    class CmsNode extends BaseCmsElement {
        constructor() {
            super()
            this.data = null
        }

        connectedCallback() {
            if (NodeIndexMap[this.loadDataId()])
                this.data = NodeIndexMap[this.loadDataId()]
        }

        render() {
            if (this.data == null) return
            findScopedElements(this, "NODE-TITLE", ["CMS-NODE"]).forEach(child => {
                child.data = this.data
            })
            findScopedElements(this, "NODE-INFO", ["CMS-NODE"]).forEach(child => {
                child.data = this.data
            })
            findScopedElements(this, "NODE-DATE", ["CMS-NODE"]).forEach(child => {
                child.data = this.data
            })
        }
    }
    class ListNode extends CmsNode {
        constructor() {
            super()
        }
    }
    class NodeDate extends BaseCmsElement {
        constructor() {
            super()
        }

        render() {
            if (!this.data || !this.data.date) return

            const format = this.getAttribute('format') || 'YYYY-MM-DD'

            this.textContent = this.formatDate(this.data.date, format)
        }
        // 👇 时间格式化函数
        formatDate(date, format) {
            const d = new Date(date)

            const pad = (n) => n.toString().padStart(2, '0')

            const map = {
                YY: d.getFullYear().toString().slice(-2),
                YYYY: d.getFullYear(),
                MM: pad(d.getMonth() + 1),
                DD: pad(d.getDate()),
                HH: pad(d.getHours()),
                mm: pad(d.getMinutes()),
                ss: pad(d.getSeconds())
            }

            return format.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, k => map[k])
        }
    }


    class NodeTitle extends BaseCmsElement {
        constructor() {
            super()
            this.data
        }
        render() {
            if (this.data) {
                this.textContent = this.data.title
            }
        }
    }

    class NodeInfo extends BaseCmsElement {
        constructor() {
            super()
        }
        render() {
            if (this.data) {
                this.textContent = this.data.info
            }
        }
    }


    function findScopedElements(rootEl, targetSelector, excludeSelectors = []) {
        const results = []

        const allTargets = rootEl.querySelectorAll(targetSelector)

        allTargets.forEach(el => {
            let parent = el.parentElement
            let shouldExclude = false

            while (parent && parent !== rootEl) {

                // ✅ 1. 排除指定标签（数组）
                if (excludeSelectors.length > 0) {
                    for (const selector of excludeSelectors) {
                        if (parent.matches(selector)) {
                            shouldExclude = true
                            break
                        }
                    }
                    if (shouldExclude) break
                }

                // ✅ 2. 排除“同类型父节点”（比如嵌套 a）
                if (parent.tagName === rootEl.tagName) {
                    shouldExclude = true
                    break
                }

                parent = parent.parentElement
            }

            if (!shouldExclude) {
                results.push(el)
            }
        })

        return results
    }





    function initComponents() {
        customElements.define('node-title', NodeTitle)
        customElements.define('node-info', NodeInfo)
        customElements.define('node-date', NodeDate)
        customElements.define('cms-node', CmsNode)
        customElements.define('list-name', ListName)
        customElements.define('list-info', ListInfo)
        customElements.define('list-list', ListList)
        customElements.define('list-node', ListNode)
        customElements.define('cms-list', CmsList)
    }

})()
