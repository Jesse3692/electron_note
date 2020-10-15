# electron_note
node.js;electron;javascript

全局安装electron（最新的安装失败）

`npm install -g electron@^6.0.1`

## hello-world-electron

这个项目下有三个文件：

1. `index.html`，这个文件是应用显示的内容。
2. `main.js`，入口文件负责启动应用视窗、托盘菜单以及其他，除此之外还负责处理系统级别的事件。
3. `package.json`，配置文件。

`main.js` 文件的关键内容

```js
// 加载通过npm安装的electron模块
const electron = require('electron');
// 创建对electron应用对象的引用
const app = electron.app;
// 创建对Electron的Browser-Window类的引用
const BrowserWindow = electron.BrowserWindow;

// 监听所有视窗关闭的事件（mac不会触发）
if (process.platform !== 'darwin') app.quit();

// 创建一个新的应用窗口并将它赋值给mainWindow变量，以此来防止被Node.js进行垃圾回收的时候将视窗关闭 
mainWindow = new BrowserWindow();

// 将index.html加载进应用视窗中
mainWindow.loadURL(`file://${__dirname}/index.html`);

// 当应用关闭时，释放mainWindow变量对应用视窗的引用
mainWindow.on('closed', ()=>{mainWindow = null;});
```

