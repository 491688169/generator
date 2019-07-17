const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

let result = {};

async function handleStaticSrc(dir) {
    const filesArr = fs.readdirSync(dir);
    return new Promise(async resolveOuter => {
        // eslint-disable-next-line
        await Promise.all(
            filesArr.map(file => {
                return new Promise(async resolve => {
                    const filePath = path.join(dir, file);
                    if (fs.statSync(filePath).isDirectory()) {
                        handleStaticSrc(filePath);
                        return false;
                    }
                    const singleResult = await generateMD5(filePath, file, dir);
                    result = { ...result, ...singleResult };
                    return resolve(result);
                });
            })
        );
        fs.writeFileSync('src/static/manifest_custom.json', JSON.stringify(result));
        resolveOuter();
    });
}

function generateMD5(filePath, file) {
    return new Promise(resolve => {
        const md5sum = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath);

        stream.on('data', chunk => {
            md5sum.update(chunk);
        });

        stream.on('end', () => {
            const md5 = md5sum.digest('hex');
            const fileSplitArr = file.split('.');
            fileSplitArr.splice(fileSplitArr.length - 1, 0, md5);
            const resultFilename = fileSplitArr.join('.');
            resolve({ [file]: resultFilename });
        });
    });
}

module.exports = handleStaticSrc;
