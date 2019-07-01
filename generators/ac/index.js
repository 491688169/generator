const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const Generator = require('yeoman-generator');

const { TYPES } = require('../constants');
const { includes, initialCapital, readAllFile } = require('../utils');

class AC extends Generator {
    async initializing() {
        const done = this.async();
        this.type = TYPES.PRODUCT_REACT.value;
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
            {
                type: 'list',
                name: 'type',
                message: 'created in pages or components?',
                choices: ['pages', 'components'],
                default: 'pages',
            },
        ]);

        this.answer = { ...this.answer, name: this.answer.name.replace(/\s+/g, '') };
    }

    async writing() {
        const componentName = await this._checkIfExist();
        switch (this.type) {
            case TYPES.PKG_REACT.value:
                this._generatorPKGComponent(componentName);
                break;
            case TYPES.PRODUCT_REACT.value:
                this._generatorProductComponent(componentName);
                break;
            default:
                this._generatorProductComponent(componentName);
                break;
        }
    }

    _generatorPKGComponent(componentName) {
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

    _generatorProductComponent(componentName) {
        const files = readAllFile(this.templatePath('./product_react'), /\.ejs$/, true);
        this.fs.copy(files, this.destinationPath(`./src/${this.answer.type}/${componentName}`));
        this.fs.copyTpl(
            this.templatePath('./product_react/index.js.ejs'),
            this.destinationPath(`./src/${this.answer.type}/${componentName}/index.js`),
            { componentName }
        );
    }

    _checkIfExist() {
        const {
            answer: { name },
        } = this;

        const capitalComponentName = initialCapital(name);

        let filePath = path.join(
            this.destinationPath(),
            `src/${this.answer.type}`,
            capitalComponentName
        );

        switch (this.type) {
            case TYPES.PKG_REACT.value:
                filePath = path.join(this.destinationPath(), 'src', name);
                break;
            case TYPES.PRODUCT_REACT.value:
            default:
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
