let hummus = window.require('hummus');
const {remote} = window.require('electron')
//let fillForm = window.require('C:/Users/Amon/Documents/GitHub/dndtome/src/services/pdf-form-fill.js').fillForm;
let fillForm = window.require(remote.app.getAppPath() + '/src/services/pdf-form-fill.js').fillForm;

module.exports.fillPdf = (sourcePDF, destinationPDF, data, log) => {

    var writer = hummus.createWriterToModify(sourcePDF, {
        modifiedFilePath: destinationPDF,
        log: log
    });
    fillForm(writer, data);
    writer.end();
};