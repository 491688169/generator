// 基于html-webpack-plugin
// https://github.com/jantimon/html-webpack-plugin

const { execSync } = require('child_process');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const manifest = require('../src/static/manifest_custom.json');

const env = require('../env');

/* eslint-disable */
class HandleTemplate {
    apply(compiler) {
        compiler.hooks.compilation.tap('HandleTemplate', compilation => {
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                'HandleTemplate',
                (data, cb) => {
                    let { html } = data;
                    const reg4js = /<script\s+src="(\/static\/\S+)"><\/script>/g;
                    const reg4css = /<link\s+href="(\/static\/\S+)"\s+rel="stylesheet">/g;

                    html = html.replace(reg4js, (...args) => {
                        const originSource = String.prototype.split.call(args[1], '/').pop();
                        const resultSource = manifest[originSource];
                        copyFile(args[1], resultSource);
                        return `<script src="https://frontend-alioss.learnta.com/staSrc/${
                            env.PRODUCT
                        }/${env.TARGET}/${resultSource}"></script>`;
                    });

                    html = html.replace(reg4css, (...args) => {
                        const originSource = String.prototype.split.call(args[1], '/').pop();
                        const resultSource = manifest[originSource];
                        copyFile(args[1], resultSource);
                        return `<link href="https://frontend-alioss.learnta.com/staSrc/${
                            env.PRODUCT
                        }/${env.TARGET}/${resultSource}" rel="stylesheet" />`;
                    });

                    data.html = html;

                    cb(null, data);
                }
            );
        });
    }
}
/* eslint-disable */

function copyFile(filePath, targetFilename) {
    const fileToArr = filePath.split('/');
    fileToArr.pop();
    const dirPath = fileToArr.join('/');
    const ifExistDist = fs.existsSync(`dist${dirPath}`);
    if (!ifExistDist) {
        execSync(`mkdir -p dist${dirPath}`);
    }
    execSync(`cp src${filePath} dist${dirPath}/${targetFilename}`);
}

module.exports = HandleTemplate;
