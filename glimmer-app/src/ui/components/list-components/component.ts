import Component, { tracked } from '@glimmer/component';

const util = require('util');
const fs = require('fs');
const replace = require('replace-in-file');
const fsString = fs.toString();
console.log('fsString', fsString);

export default class ListComponents extends Component {

  @tracked componentFiles = [];

  appFolder = '/Users/communications/workdir/radiumsoftware/frontend/app';

  didInsertElement() {
    this.getFiles();
  }

  getFiles() {
    fs.readdir(`${this.appFolder}/components`, (err, files) => {
      const componentJsFiles = files.filter(file => file.endsWith('.js'));
      this.componentFiles = componentJsFiles;
    })
  }

  convertToPod(jsFileName) {
    const folderName = this.cutJsEnding(jsFileName);
    const podPath = this.getPodPath(folderName);
    const originalTemplatePath = this.getOriginalTemplatePath(folderName);
    const originalComponentJsPath = this.getOriginalComponentJsPath(folderName);

    this.makeDir(podPath)
      .then(() => console.log('made a dir'))
      .catch(err => console.error('could not make a dir', err))
      .then(() => this.moveFile(originalTemplatePath, `${podPath}/template.hbs`))
      .then(() => console.log(`moved ${originalTemplatePath} to ${podPath}/template.hbs`))
      .catch(err => console.error('could not move template file', err))
      .then(() => this.moveFile(originalComponentJsPath, `${podPath}/component.js`))
      .then(() => console.log(`moved ${originalComponentJsPath} to ${podPath}/component.js`))
      .catch(err => console.error('could not move component file', err))
      .then(() => this.getFiles())
      .then(() => console.log('refreshed list after all operations'))
      .then(() => this.replaceImportStatements(folderName))
      .then(importStatements => console.log('import statements changed!', importStatements));
  }

  getPodPath = folderName => `${this.appFolder}/pods/components/${folderName}`;

  getOriginalTemplatePath = folderName => `${this.appFolder}/templates/components/${folderName}.hbs`;

  getOriginalComponentJsPath = folderName => `${this.appFolder}/components/${folderName}.js`;

  cutJsEnding = fileName => fileName.slice(0, -3);

  makeDir = util.promisify(fs.mkdir);

  moveFile = util.promisify(fs.rename);

  replaceImportStatements(folderName) {
    const from = `/components/${folderName}`;
    const to = `/pods/components/${folderName}/component`;
    const options = {
      from,
      to,
      files: `${this.appFolder}/**/*.js`
    }
    return replace(options);
  }
};
