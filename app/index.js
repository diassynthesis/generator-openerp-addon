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
    this.app_name = this.addon_name.replace('nt_', '');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('OpenERP Addon') + ' generator!'
    ));
    this.log(chalk.yellow('!!!Une partie du code sous-jacent et les fichiers, vous pourriez avoir à vous aider à construire le chef de projet, et faire attention à ne pas écraser'));


    var prompts = [];

    prompts.push({
      name: 'addon_name',
      message: 'Addon name',
      default: this.addon_name
    });

    prompts.push({
      type: 'confirm',
      name: 'npm_install',
      message: 'Que ce soit pour effectuer des `npm install`？',
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

      this.fs.copyTpl(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        this
      );

      this.fs.copyTpl(
        this.templatePath('web/src/**'),
        this.destinationPath('web/src'),
        this
      );

      this.fs.copyTpl(
        this.templatePath('web/sass/**'),
        this.destinationPath('web/sass'),
        this
      );

      this.fs.copyTpl(
        this.templatePath('rest/**'),
        this.destinationPath('rest'),
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
  },

  end: function () {
    this.spawnCommand('gulp', ['init']);
  }
});
