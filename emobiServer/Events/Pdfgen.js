const Events = require('./Events-mongo.js');
const pdfMakePrinter = require('pdfmake/src/printer');
const fs = require('fs');
const Invoices = require('../PurchaseOrders/PurchaseOrderModel.js');

function generatePdf(docDefinition, callback) {
  try {
    const fontDescriptors = {
      Roboto: {
  		normal: 'fonts/Roboto-Regular.ttf',
  		bold: 'fonts/Roboto-Medium.ttf',
  		italics: 'fonts/Roboto-Italic.ttf',
  		bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  	}
  };
    const printer = new pdfMakePrinter(fontDescriptors);
    const doc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      // let result = chunks
      const result = Buffer.concat(chunks);
      // callback(result.toString('base64'))
      callback('data:application/pdf;base64,' + result.toString('base64'));
    });

    doc.end();

  } catch(err) {
    throw(err);
  }
};

function createPdfDoc(InvoiceArray) {
  let pdfDoc = {}
  pdfDoc.content = []
  InvoiceArray.forEach((element) => {
    let header = {
      text: '\n\nInvoice ID:' + element._id,
      style: 'header'
    }
    pdfDoc.content.push(header)
    element.contents.forEach((element) => {
      if (element.guest_spot) {
        pdfDoc.content.push({text: 'Guest Spot'})
      } else {
        pdfDoc.content.push({ul: [
          'RSVP: ' + element.f_name + element.l_name,
          'email: ' + element.email,
          'DOB: ' + element.dob,
          'Phone: '+ element.phone,
          'Gender: '+ element.gender
        ]})
      }
    })
  })
  return pdfDoc
}

function PDFgen(req, res, error) {
  Invoices.find({eventId: req.params.eventId}).then((resultsArray) => {
    // console.log(resultsArray);
    let pdfDoc = createPdfDoc(resultsArray)
    // res.send(pdfDoc)
    generatePdf(pdfDoc, (response) => {
      // res.setHeader('Content-Type', 'application/pdf')
      res.send(response)
    })
  })
  // let pdfDoc = {
  //   content: ['Hello World']
  // }
  //   generatePdf(pdfDoc, (response) => {
  //     res.setHeader('Content-Type', 'application/pdf')
  //     res.send(response)
  //   })
  }
module.exports = PDFgen
