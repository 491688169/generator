function initialCapital(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

function includes(arr1, arr2) {
    return arr2.every(val => arr1.includes(val));
}

/*
 * 读取指定文件夹下的全部文件，可通过正则进行过滤，返回文件路径数组
 * @param root 指定文件夹路径
 * [@param] reg 对文件的过滤正则表达式,可选参数
 * [@param] negative 对 reg.test(root) 结果是否取反
 *
 * */

function readAllFile(root, reg, negative) {
    let resultArr = [];
    const thisFn = arguments.callee;
    if (fs.existsSync(root)) {
        const stat = fs.lstatSync(root);
        if (stat.isDirectory()) {
            const files = fs.readdirSync(root);
            files.forEach(function(file) {
                const t = thisFn(root + '/' + file, reg, negative);
                resultArr = resultArr.concat(t);
            });
        } else {
            if (reg !== undefined) {
                if (typeof reg.test == 'function') {
                    if (negative) {
                        if (!reg.test(root)) {
                            resultArr.push(root);
                        }
                    } else {
                        if (reg.test(root)) {
                            resultArr.push(root);
                        }
                    }
                }
            } else {
                resultArr.push(root);
            }
        }
    }

    return resultArr;
}
/**
 * 另外一种写法待完善
 */
// function readAllFile(root, reg, negative) {
//     return (function fn() {
//         const files = fs.readdirSync(root);
//         files.forEach(function(filename) {
//             const fileDir = path.join(root, filename);
//             const stats = fs.statSync(fileDir);
//             const isFile = stats.isFile();
//             const isDir = stats.isDirectory();
//             if (isFile) {
//                 if (reg !== undefined) {
//                     if (typeof reg.test == 'function') {
//                         if (negative) {
//                             if (!reg.test(root)) {
//                                 resultArr.push(root);
//                             }
//                         } else {
//                             if (reg.test(root)) {
//                                 resultArr.push(root);
//                             }
//                         }
//                     }
//                 } else {
//                     resultArr.push(root);
//                 }
//             }
//             if (isDir) {
//                 fn(fileDir);
//             }
//         });
//     })();
// }

module.exports = {
    initialCapital,
    includes,
    readAllFile,
};
