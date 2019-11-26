let hummus = window.require('hummus');
let fillForm = window.require('C:/Users/Amon/Documents/GitHub/dndtome/src/services/pdf-form-fill.js').fillForm;

module.exports.fillPdf = (sourcePDF, destinationPDF, data, log) => {

    var writer = hummus.createWriterToModify(sourcePDF, {
        modifiedFilePath: destinationPDF, 
        log: log
    });
    fillForm(writer, data);
    writer.end();
};