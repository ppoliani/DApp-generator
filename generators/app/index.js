'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const rimraf = require('rimraf');

const installDirs = [
  'src/js',
  'src/solidity'
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
  }

  install() {
    this._yarnInstall();
    process.chdir(this.destinationPath(this._projectName));
    this._gitInit();
  }

  _yarnInstall() {
    installDirs.forEach(dir => {
      this.log(yosay(`Executing yarn in ${this._projectName}/${dir}`));
      process.chdir(this.destinationPath(`${this._projectName}/${dir}`));
      this.spawnCommandSync('yarn', [], {});
    });
  }

  _gitInit() {
    this.log('Removing old .git...');
    rimraf(`.git`, error => {
      if(error) {
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
