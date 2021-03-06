const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const { readAllFile } = require('../utils');

class LG extends Generator {
    async prompting() {
        this.answer = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'what is your package name?',
                validate: input => {
                    if (input === '') return 'package name is required.';
                    return true;
                },
            },
            {
                type: 'list',
                name: 'type',
                message: 'for a package or a product?',
                choices: ['package', 'product'],
            },
        ]);
    }

    copyDirectory() {
        const {
            answer: { name, type },
        } = this;
        let fullname;
        let templatePath;
        switch (type) {
            case 'package':
                fullname = `fe_${name}_pkg`;
                templatePath = './package_react/';
                break;
            case 'product':
                fullname = `fe_${name}`;
                templatePath = './product_react/';
                break;
            default:
                fullname = `fe_${name}`;
                templatePath = './product_react/';
                break;
        }
        this.fullname = fullname;
        const ifExist = fs.existsSync(`${fullname}`);
        if (ifExist) {
            this.log(`${chalk.red(fullname + ' ' + type + ' 已存在')}`);
            return process.exit();
        }
        this.log(`${type} name is ${fullname}`);

        mkdirp.sync(`${fullname}`);

        const projectRootPath = this.templatePath(templatePath);

        const { match, unMatch } = readAllFile(projectRootPath, /\.ejs$/);

        match.forEach(template => {
            const destinationPath = path.relative(projectRootPath, template);
            const relativeDestinationFile = destinationPath.replace(/(.ejs)$/, '');
            const pathData = path.parse(relativeDestinationFile);
            if (pathData.name[0] === '_') {
                console.log();

                this.fs.copy(
                    template,
                    this.destinationPath(
                        `./${fullname}/${path.format({
                            ...pathData,
                            base: pathData.name.substring(1) + '.ejs',
                            ext: '.ejs',
                            name: pathData.name.substring(1),
                        })}`
                    )
                );
            } else {
                this.fs.copyTpl(
                    template,
                    this.destinationPath(`./${fullname}/${relativeDestinationFile}`),
                    { name }
                );
            }
        });

        if (unMatch && unMatch.length > 0) {
            this.fs.copy(unMatch, this.destinationPath(`./${fullname}`), {
                globOptions: { dot: true },
            });
        }
    }

    install() {
        this.destinationRoot(`./${this.fullname}`);
        this.npmInstall();
    }

    end() {
        this._entryDesc();
    }

    _entryDesc() {
        const {
            answer: { type },
        } = this;
        switch (type) {
            case 'package':
                this._entryLog('npm run storybook');
                break;
            case 'product':
                this._entryLog('node bin dev');
                break;
            default:
                this._entryLog('node bin dev');
                break;
        }
    }

    _entryLog(startCommand) {
        this.log(`
            \n
                ${chalk.green(`cd ${this.fullname}`)}
                ${chalk.green(startCommand)}
            \n
        `);
        // TODO: 可能涉及进程相关知识，需要进一步处理
        // execSync(`cd ${this.fullname}`, function(error, stdout, stderr) {
        //     console.log('error', error);
        //     if (error) {
        //         return process.exit();
        //     }
        //     this.log(`
        //     \n
        //         ${chalk.green('Please go on!')}
        //         ${chalk.green(startCommand)}
        //     \n
        //     `);
        // });
    }
}

module.exports = LG;
