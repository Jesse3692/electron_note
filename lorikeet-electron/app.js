'use strict';

const osenv = require('osenv');
const fs = require('fs');
const async = require('async');
const path = require('path');

function getUserHomeFolder() {
    return osenv.home();
}

function getFilesInFolder(folderPath, cb) {
    fs.readdir(folderPath, cb);
}

function inspectAndDescribeFile(filePath, cb) {
    let result = {
        file: path.basename(filePath),
        path: filePath, type: ''
    }

    fs.stat(filePath, (err, stat) => {
        if (err) {
            cb(err)
        } else {
            if (stat.isFile()) {
                result.type = 'file';
            }
            if (stat.isDirectory()) {
                result.type = 'directory'
            }
            cb(err, result)
        }
    });
}

// 使用async模块调用异步函数并收集结果
function inspectAndDescribeFiles(folderPath, files, cb) {
    async.map(files, (file, asyncCb) => {
        let resolvedFilePath = path.resolve(folderPath, file);
        inspectAndDescribeFile(resolvedFilePath, asyncCb);
    }, cb)
}

// 显示文件列表信息
function displayFiles(err, files) {
    if (err) {
        return alert('Sorry, we could not display your files');
    }
    files.forEach((file) => {
        console.log(file,)
    })
}
function main() {
    let folderPath = getUserHomeFolder();
    getFilesInFolder(folderPath, (err, files) => {
        if (err) {
            return alert('Sorry, we could not load your home folder')
        }
        inspectAndDescribeFiles(folderPath, files, displayFiles);
    })
}

main();