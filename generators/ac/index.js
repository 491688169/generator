const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const Generator = require('yeoman-generator');

const { TYPES } = require('../constants');

class AC extends Generator {
    async initializing() {
        const done = this.async();
        this.type = TYPES.PROD_REACT.value;
        let keywords = undefined;
        try {
            keywords = (await this.fs.readJSON('./package.json')).keywords;
        } catch (error) {
            this.log(`${chalk.red(error)}`);
        }
        if (!keywords) return process.exit();
        const TYPES_KEYS = Object.keys(TYPES);
        for (let i = 0; i < TYPES_KEYS.length; i++) {
            const generatorType = TYPES[TYPES_KEYS[i]];
            if (includes(keywords, generatorType.keywords)) {
                this.type = generatorType.value;
                // break or continue 都会退出 generator command process
                return done(); // 退出当前生命周期函数，进入下一个
            }
        }
    }

    async prompting() {
        this.answer = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'what is your component name?',
                validate: input => {
                    if (input === '') return 'component name is required.';
                    return true;
                },
            },
        ]);

        this.answer = { name: this.answer.name.replace(/\s+/g, '') };
    }

    async writing() {
        const componentName = await this._checkIfExist();
        switch (this.type) {
            case TYPES.PKG_REACT.value:
                this._generatorPKG(componentName);
                break;
            case TYPES.PROD_REACT.value:
                this._generatorPROD(componentName);
                break;
            default:
                this._generatorPROD(componentName);
                break;
        }
    }

    _generatorPKG(componentName) {
        this.fs.copyTpl(
            this.templatePath('./package_react/index.tsx'),
            this.destinationPath(`./src/${componentName}/index.tsx`),
            { componentName: initialCapital(componentName) }
        );

        this.fs.write(this.destinationPath(`./src/${componentName}/index.scss`), '');
        this.fs.append(
            this.destinationPath(`./src/index.ts`),
            `export { default as ${initialCapital(
                componentName
            )} } from './${componentName}/index';`
        );
        this.fs.copyTpl(
            this.templatePath('./package_react/stories.tsx'),
            this.destinationPath(`./stories/${componentName}.stories.tsx`),
            { componentName: initialCapital(componentName) }
        );
    }

    _generatorPROD(componentName) {
        this.fs.copy(
            this.templatePath('./product_react/static/'),
            this.destinationPath(`./src/pages/${componentName}`)
        );

        this.fs.copyTpl(
            this.templatePath('./product_react/dynamic/index.js'),
            this.destinationPath(`./src/pages/${componentName}/index.js`),
            { componentName }
        );
    }

    _checkIfExist() {
        const {
            answer: { name },
        } = this;

        const capitalComponentName = initialCapital(name);

        let filePath = path.join(this.destinationPath(), 'src/pages', capitalComponentName);

        switch (this.type) {
            case TYPES.PKG_REACT.value:
                filePath = path.join(this.destinationPath(), 'src', name);
                break;
            case TYPES.PROD_REACT.value:
                // filePath = path.join(this.destinationPath(), 'src/pages', name);
                break;
            default:
                // filePath = path.join(this.destinationPath(), 'src/pages', name);
                break;
        }

        return new Promise(resolve => {
            fs.access(filePath, fs.constants.F_OK, err => {
                if (!err) {
                    this.log(
                        `\t ${chalk.red(
                            'this component ' + capitalComponentName + ' has been existed!'
                        )}`
                    );
                    return process.exit();
                } else {
                    resolve(capitalComponentName);
                }
            });
        });
    }

    end() {
        this.log(
            `\t ${chalk.green('component ' + initialCapital(this.answer.name) + ' is finished')}`
        );
    }
}

module.exports = AC;

function initialCapital(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

function includes(arr1, arr2) {
    return arr2.every(val => arr1.includes(val));
}
