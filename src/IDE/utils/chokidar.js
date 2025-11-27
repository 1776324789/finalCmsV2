const chokidar = require("chokidar");

/**
 * 监听文件夹变化（新增 / 删除 / 修改）
 * @param {string} dirPath
 * @param {object} callbacks  {onAdd, onDelete, onChange}
 */
function watchDirectory(dirPath, callbacks = {}) {
    const { onAdd, onDelete, onChange } = callbacks;

    const watcher = chokidar.watch(dirPath, {
        persistent: true,
        ignoreInitial: true,     // 不触发初始事件
        ignored: /(^|[\/\\])\../ // 忽略隐藏文件
    });

    watcher
        .on("add", (path) => onAdd && onAdd(path))
        .on("unlink", (path) => onDelete && onDelete(path))
        .on("change", (path) => onChange && onChange(path));

    console.log("📁 chokidar 正在监听:", dirPath);
    return watcher;
}

module.exports = watchDirectory;
