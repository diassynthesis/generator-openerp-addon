'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('addon_name', { type: String, required: true });
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('OpenERP Addon') + ' generator!'
    ));
    this.log(chalk.yellow('!!!有些基础代码和文件，可能项目经理已经帮你建好了，注意不要覆盖'));


    var prompts = [];

    prompts.push({
      name: 'addon_name',
      message: 'Addon 名称',
      default: this.addon_name
    });

    prompts.push({
      type: 'confirm',
      name: 'npm_install',
      message: '是否执行 `npm install`？',
      default: false
    });

    this.prompt(prompts, function (props) {
      this.addon_name = props.addon_name;

      this.npm_install = props.npm_install;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('__init__.py'),
        this.destinationPath('__init__.py')
      );

      this.fs.copyTpl(
        this.templatePath('__openerp__.py'),
        this.destinationPath('__openerp__.py'),
        this
      );
    },

    frontend: function () {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        this
      );
    }
  },

  install: function () {
    if (this.npm_install) {
      this.installDependencies({
        npm: this.npm_install,
        bower: false
      });
    }
  }
});