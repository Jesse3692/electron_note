# electron_note
node.js;electron;javascript

全局安装electron

首先配置npm源，然后配置electron源

```ini
registry=https://registry.npm.taobao.org
# Electron Mirror of China
ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
```

进行electron的安装`npm install -g electron`

启动electron应用，进入对应的应用目录下：`electron .`

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

## lorikeet-electron

lorikeet是一款文件浏览器，它具备以下功能：

- 用户浏览文件夹和查找文件
- 用户可以使用默认的应用程序打开文件

### 实现启动界面

#### 在工具条中展示用户个人文件夹信息 

`f23d3890eb5c3de49e5e98daa475346b1437a77b`

实现该功能可分为三部分内容：

- html负责构建工具条和用户个人文件夹信息
- css负责布局工具条和用户个人文件夹展示上的布局以及样式
- JavaScript负责找到用户个人文件夹信息并在UI上展示出来

需要安装的模块：

- `npm install osenv --save`

显示个人文件夹信息的三种方法：

1. 通过引用js文件中的函数
2. 使用osenv模块
3. 使用os模块

*注意：electron5.0之后的版本需要设置：nodeIntegration*

#### 显示用户个人文件夹中的文件和文件夹

- 获取到用户个人文件夹中的文件和文件夹列表信息
- 对每个文件或者文件夹，判断它是文件还是文件夹
- 将文件或文件夹列表信息显示到界面上，并用对应的图标区分出来

需要安装的模块：

- `npm install async --save`

使用模块 `fs`中的方法`fs.readdir(folderPath, cb);`获取文件列表

`b57df577412fe176e3b9d8cc2bff3bed46affac0`



接下来的任务是：

- 使用 `fs.stat`函数
- 使用`async`模块来处理调用一系列异步函数的情况并收集它们的结果
- 将结果列表传递给另外一个函数将它们显示出来

使用 `stat.isFile()`和 `stat.isDirectory()` 判断是否为文件或者文件夹

*注意：这里的async模块，还需要在项目的根路径下再安装一次，不然程序会找不到async模块*

`62576e1e8b3875548a59d33ea5231dd7d3047366`



在应用中显示文件和文件夹：

`021c91cd442ab222d1522e7b110e37e2016154d5`

```js
// 显示文件列表信息
function displayFile(file) {
    const mainArea = document.getElementById('main-area');
    const template = document.querySelector('#item-template');
    let clone = document.importNode(template.content, true);
    clone.querySelector('img').src = `images/${file.type}.svg`;
    clone.querySelector('.filename').innerText = file.file;
    mainArea.appendChild(clone);
}
```

![image-20201018113239981](https://i.loli.net/2020/10/18/hzVwBxYH1KZPTqL.png)

### 浏览文件夹

#### 重构代码

现在打开 `app.js`你会发现代码看起来有些混乱了，那么就该进行重构了，以免后面越来越难以维护。

`app.js`的拆分：

- `app.js`作为前端代码的主入口仍然保留。
- `fileSystem.js`负责处理对用户计算机中的文件和文件夹进行操作
- `userInterface.js`负责处理页面上的交互