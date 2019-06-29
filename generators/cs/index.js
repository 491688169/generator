'use strict';
const Generator = require('yeoman-generator');
const { Conflicter, Adapter } = require('yeoman-merge-ui');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.env.adapter = new Adapter();
        this.conflicter = new Conflicter(this.env.adapter, this.options.force);
    }

    writing() {
        this.fs.copy(this.templatePath('dummyfile.txt'), this.destinationPath('dummyfile.txt'));
    }
};
