const path = require('path');
const fs = require('fs');

const Generator = require('yeoman-generator');

const { TYPES } = require('../constants');

class AC extends Generator {
    async initializing() {
        this.log('initializing');
        const { async: done } = this;
        const { keywords } = await this.fs.readJSON('./package.json');
        this.log('keywords', keywords);
        if (!keywords) done();
        if (includes(keywords, TYPES.PKG_REACT.keywords)) {
            this.type = TYPES.PKG_REACT.value;
            this.log('this.type ', this.type);
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
    }

    async writing() {
        const componentName = await this._checkIfExist();

        if (this.type === TYPES.PKG_REACT.value) {
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
    }

    _checkIfExist() {
        if (this.type === TYPES.PKG_REACT.value) {
            const {
                answer: { name },
                async: done,
            } = this;

            const filePath = path.join(this.destinationPath(), 'src', name);

            return new Promise(resolve => {
                fs.access(filePath, fs.constants.F_OK, err => {
                    if (!err) {
                        this.log('this component has been existed!');
                        done();
                    } else {
                        this.log('start creating revelant files...');
                        resolve(name);
                    }
                });
            });
        }
    }
}

module.exports = AC;

function initialCapital(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

function includes(arr1, arr2) {
    return arr2.every(val => arr1.includes(val));
}
