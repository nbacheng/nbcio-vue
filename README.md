NBCIO Vue
====

基于ant-design-vue-jeecg的前端版本： 3.0.0（发布日期：2021-11-01）

Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 Ant Design Pro  Vue 版
nbcio-boot 的前端UI框架，采用前后端分离方案，提供强大代码生成器的低代码平台。
前端页面代码和后端功能代码一键生成，不需要写任何代码，保持jeecg一贯的强大！！

## 在线演示 ：  [http://www.nbcio.com:9888](http://www.nbcio.com:9888)

#### 前端技术
 
- 基础框架：[ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- Element UI 
- JavaScript框架：Vue
- Webpack
- node
- yarn
- eslint
- @vue/cli 3.2.1
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现



项目下载和运行
----

- 拉取项目代码
```bash
git clone https://gitee.com/nbacheng/nbcio-vue.git
cd  nbcio-vue
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他说明
----

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，其他 less 变量覆盖参考 [ant design](https://ant.design/docs/react/customize-theme-cn) 官方说明
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```



附属文档
----
- [Ant Design Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn)

- [报表 viser-vue](https://viserjs.github.io/demo.html#/viser/bar/basic-bar)

- [Vue](https://cn.vuejs.org/v2/guide)

- [路由/菜单说明](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/router/README.md)

- [ANTD 默认配置项](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/defaultSettings.js)

- 其他待补充...


备注
----

> @vue/cli 升级后，eslint 规则更新了。由于影响到全部 .vue 文件，需要逐个验证。既暂时关闭部分原本不验证的规则，后期维护时，在逐步修正这些 rules


Docker 镜像使用
----

 ``` 
# 1.修改前端项目的后台域名
    .env.development
    域名改成： http://nbcio-boot-system:8080/nbcio-boot
   
# 2.先进入打包前端项目
  yarn run build

# 3.构建镜像
  docker build -t nginx:nbcioboot .

# 4.启动镜像
  docker run --name nbcio-boot-nginx -p 80:80 -d nginx:nbcioboot

# 5.配置host

    # nbcioboot
    127.0.0.1   nbcio-boot-redis
    127.0.0.1   nbcio-boot-mysql
    127.0.0.1   nbcio-boot-system
  
# 6.访问前台项目
  http://localhost:9888
``` 

  系统效果
   ----
   
   ![输入图片说明](https://img-blog.csdnimg.cn/863a745945624a45acfe8e7856c6134e.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/898e102ca3d5452bb2d23d989be008ab.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/c63e81a73b0e40b8b3f21963e92199ec.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/83441ac37474453a94181be59e844469.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/45ef09d3626747858a750ada9a2206e3.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/e5443bd5d38442969a7c20895d563712.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/e5443bd5d38442969a7c20895d563712.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/e5443bd5d38442969a7c20895d563712.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/610bef9ed3ca4aa8a9d3e2e6ef242877.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/a2991f0d55a64a7b882194aea3f0f3a2.png "在这里输入图片标题")
	 
   ![输入图片说明](https://img-blog.csdnimg.cn/db30f76b9b2447a9a941a8541fb98587.png "在这里输入图片标题")
   
   ![输入图片说明](https://img-blog.csdnimg.cn/a0b16c3d30964d159de5bffb3e19f616.png "在这里输入图片标题")
   
   ![输入图片说明](https://img-blog.csdnimg.cn/5391fd45a1d74a2096844a543fa1fd8a.png "在这里输入图片标题")
   
   ![输入图片说明](https://img-blog.csdnimg.cn/259bc2e0306d4457b9ada1890ca9b1e9.png "在这里输入图片标题")

   ![输入图片说明](https://img-blog.csdnimg.cn/7be0ebce891f43718e603a7883fa0e66.png "在这里输入图片标题")    

## 捐赠 

如果觉得还不错，请作者喝杯咖啡吧！

![](https://oscimg.oschina.net/oscnet/up-58088c35672c874bd5a95c2327300d44dca.png)