const Generator = require('yeoman-generator');

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
        this.log(`package name is ${fullname}`);
        this.fs.copy(this.templatePath(templatePath), this.destinationPath(`./${fullname}`), {
            globOptions: { dot: true },
        });
    }

    install() {
        this.destinationRoot(`./${this.fullname}`);
        // this.npmInstall();
    }
}

module.exports = LG;
