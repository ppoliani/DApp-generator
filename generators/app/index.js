'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const rimraf = require('rimraf');

const installDirs = [
  'src/js',
  'src/js/common',
  'src/js/common-api',
  'src/js/api',
  'src/solidity/reference'
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel');
  }

  prompting() {
    return this.prompt([
      this._askProjectName(),
    ])
      .then(answers => {
        this._projectName = answers.projectName;
      });
  }

  clone() {
    this.spawnCommandSync('git', [
      'clone',
      '--depth=1',
      '--branch=master',
      'git@github.com:ppoliani/DApp-starter.git',
      `${this._projectName}`
    ]);
    this.log('Project cloned successfully');
  }

  writing() {
    this.log('Copying templates...');
    this.fs.copyTpl(
      this.destinationPath(`./${this._projectName}/src/js/_package.json`),
      this.destinationPath(`./${this._projectName}/src/js/package.json`),
      {name: this._projectName}
    );
    rimraf(`./${this._projectName}/src/js/_package.json`, error => {
      if(error) {
        this.log('An error occurred while removing _package.json. Please remove it manually.');
      }
    });
  }

  install() {
    // this._yarnInstall();
    this._gitInit();
    this._clean();
  }

  _yarnInstall() {
    installDirs.forEach(dir => {
      this.log(yosay(`Executing yarn in ${this._projectName}/${dir}`));
      process.chdir(this.destinationPath(`${this._projectName}/${dir}`));
      this.spawnCommandSync('yarn', [], {});
    });
    process.chdir(this.destinationPath());
  }

  _gitInit() {
    this.log('Removing old .git...');
    rimraf(`./${this._projectName}/.git`, error => {
      if(error) {
        this.log('An error occurred while removing old .git/.');
        this.log(error);

        return this._clean(error);
      }
      this.log('Old .git removed');
      this.log('Git init...');
      this.spawnCommandSync('git', ['init']);
      this._gitInitialCommit();
    })
  }

  _gitInitialCommit() {
    this.log('Git initial commit...');
    this.spawnCommandSync('git', ['add', '.']);
    this.spawnCommandSync('git', ['commit', '-am', 'Initial Commit']);
  }

  _clean(err) {
    this.log(`Cleaning directory...`);
    rimraf(`../${this._projectName}`, error => {
      if(error) throw err;
      this.log('Clean Succeeded...');
    });
  }

  _askProjectName() {
    return {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of the project:'
    };
  }
};
