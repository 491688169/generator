'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');
const { Conflicter, Adapter } = require('henry-yo-merge');
const { TYPES } = require('../constants');
const { includes, readAllFile } = require('../utils');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.env.adapter = new Adapter();
        this.conflicter = new Conflicter(this.env.adapter, this.options.force);
    }

    async initializing() {
        const done = this.async();
        this.type = TYPES.PRODUCT_REACT.value;
        let keywords;
        try {
            this.packageJSON = await this.fs.readJSON('./package.json');
            keywords = this.packageJSON.keywords;
        } catch (error) {
            this.log(`${chalk.red(error)}`);
        }
        if (!keywords) return process.exit();
        const TYPES_KEYS = Object.keys(TYPES);
        for (let i = 0; i < TYPES_KEYS.length; i++) {
            const generatorType = TYPES[TYPES_KEYS[i]];
            if (includes(keywords, generatorType.keywords)) {
                this.type = generatorType.value;
                // Break or continue 都会退出 generator command process
                return done(); // 退出当前生命周期函数，进入下一个
            }
        }
    }

    writing() {
        this._syncConfigFiles();
    }

    _syncConfigFiles() {
        switch (this.type) {
            case TYPES.PKG_REACT.value:
                this._syncPKG();
                break;
            case TYPES.PRODUCT_REACT.value:
                this._syncPRODUCT();
                break;
            default:
                this._syncPRODUCT();
                break;
        }
    }

    _syncPKG() {
        const projectRootPath = this.templatePath('./package_react');
        this._syncEJSFile(projectRootPath);
    }

    _syncPRODUCT() {
        const projectRootPath = this.templatePath('./product_react');
        this._syncEJSFile(projectRootPath);
    }

    _syncEJSFile(projectRootPath) {
        const { match, unMatch } = readAllFile(projectRootPath, /\.ejs$/);

        match.forEach(template => {
            const destinationPath = path.relative(projectRootPath, template);
            const relativeDestinationFile = destinationPath.replace(/(.ejs)$/, '');
            const regexName = /^fe_(.+?)((_pkg)?)$/g;
            regexName.test(this.packageJSON.name);
            const name = RegExp.$1 || '';
            this.fs.copyTpl(template, this.destinationPath(`./${relativeDestinationFile}`), {
                name,
            });
        });

        if (unMatch && unMatch.length > 0) {
            this.fs.copy(unMatch, this.destinationPath('./'), {
                globOptions: { dot: true },
            });
        }
    }

    end() {
        this.log(`\t ${chalk.green('config sync of project has completed')}`);
    }
};
