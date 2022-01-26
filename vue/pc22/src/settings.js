module.exports = {
    /**
     * @type {boolean} true | false
     * @description 是否显示设置
     */
    showSettings: true,

    /**
     * @type {boolean} true | false
     * @description 是否显示标签页
     */
    tagsView: true,

    /**
     * @type {boolean} true | false
     * @description 是否显示logo
     */
    sidebarLogo: true,

    /**
     * @type {boolean} true | false
     * @description 是否只保持一个子菜单的展开
     */
    uniqueOpened: true,

    /**
     * @type {boolean} true | false
     * @description 是否显示面包屑
     */
    showCrumbs: true,

    /**
     * @type {boolean} true | false
     * @description 是否显示全屏按钮
     */
    showFullScreen: true,

    /**
     * @type {boolean} true | false
     * @description 是否显示刷新按钮
     */
    showRefresh: true,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production'
}