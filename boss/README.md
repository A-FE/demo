### 文件夹说明
```
|--build/ webpack配置文件
|--config/ webpack配置文件
|--dist/ 打包后的文件
|--src/  项目源码
 ||--assets  资源文件夹
    |||--css/
        ||||--main.less 全局样式文件
    |||--js/
        ||||--utils.js 工具类js 
 ||--components/  公共组件        
 ||--pages/ 页面文件夹
   
 ||--router/ 路由文件
 ||--App.vue 页面入口
 ||--tools.js 页面入口
|--static 静态资源文件夹(不需要用webpack处理的)
|--package.json 项目配置文件，（开发依赖，命令行快捷命令）
|--.editorconfig 编辑器配置，统一编码风格
|--.postcsssrc.js postcss配置，兼容哪些浏览器
|--.gitignore git忽略文件名单
```

### 开发过程中跨域
window系统：打开 C:\Windows\System32\drivers\etc\host ,在最后面增加两行代码,就可以指定dns地址,不需要开启charles
```angular2html
123.56.135.63 bosstest.huizhaofang.com
123.56.135.63 boss.huizhaofang.com
```

### 开始开发
```angular2html
# 安装依赖
npm install
# 启动项目
npm run dev
# 项目打包
npm run build
# 提交代码到github
./commit.sh

```

### 主要开发技术
* [vue-cli](https://github.com/vuejs/vue-cli) vue脚手架工具
* webpack  自动化构建工具
* [vue.js](https://vuefe.cn/v2/guide/) MVVM框架
* [vue-router](http://router.vuejs.org/zh-cn/index.html) vue路由
* [vuex](http://vuex.vuejs.org/en/intro.html) vue状态(数据)管理
* [element-ui](http://element.eleme.io/#/zh-CN/component/installation) 饿了么UI框架
* [iview](https://www.iviewui.com/docs/guide/introduce) 与element-ui类似,服务于 PC 界面的中后台UI框架
* [animate.css](http://www.dowebok.com/demo/2014/98/) css动画库
* [axios](https://github.com/mzabriskie/axios) ajax请求

