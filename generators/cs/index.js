'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { Conflicter, Adapter } = require('henry-yo-merge');
const { TYPES } = require('../constants');
const { includes } = require('../utils');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.env.adapter = new Adapter();
        this.conflicter = new Conflicter(this.env.adapter, this.options.force);
    }

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

    writing() {
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
        this.fs.copy(this.templatePath('./package_react/'), this.destinationPath('./'), {
            globOptions: { dot: true },
        });
    }

    _syncPRODUCT() {
        this.fs.copy(this.templatePath('./product_react/'), this.destinationPath('./'), {
            globOptions: { dot: true },
        });
    }

    end() {
        this.log(`\t ${chalk.green('config sync of project has completed')}`);
    }
};
