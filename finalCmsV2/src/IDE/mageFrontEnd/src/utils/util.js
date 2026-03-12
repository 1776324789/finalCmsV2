function getMaxZIndex() {
    let maxZIndex = 0; // 初始化最大zIndex为0
    const elements = document.querySelectorAll('*'); // 选择页面中的所有元素

    elements.forEach((element) => {
        const zIndex = window.getComputedStyle(element).zIndex; // 获取元素的z-index样式

        if (!isNaN(zIndex)) { // 检查z-index是否为有效数字
            maxZIndex = Math.max(maxZIndex, parseInt(zIndex, 10)); // 更新最大zIndex
        }
    });

    return maxZIndex;
}

export {
    getMaxZIndex
}
