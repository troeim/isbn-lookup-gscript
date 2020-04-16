// by troeim - 16.4.2020
// only debugged for the errors that occured with the books that I was looking for.
// known bug: not all images show up in the Google Sheets, even though the links are there.

function myFunction() {
  
  var docID = 'YOUR_DOC_ID'; 
  var sheetName = 'YOUR_SHEET_NAME';
  
  var book = SpreadsheetApp.openById(docID);
  var sheet = book.getSheetByName(sheetName);
  var output = [];

  var lastRow = sheet.getRange(1, 1).getDataRegion(SpreadsheetApp.Dimension.ROWS).getLastRow(); //get last row

  for (var i = 2; i < lastRow+1; i++){ //iterate over column of isbn
    output = [];
    var isbn = sheet.getRange("A"+i).getValue(); //make sure your isbn numbers are in column A starting in row 2
    
    //Search book in Google API
    var myBook = getISBN(isbn);
    if (myBook != 0) {
      //Logger.log(myBook);
      if (myBook["imageLinks"]){var image = '=image("' + myBook["imageLinks"]["thumbnail"] + '",4,60,60)';sheet.setRowHeight(i,65);}
    var hyperlink = '=hyperlink("' + myBook["canonicalVolumeLink"] + '","See Book Online")';
    output.push([image, myBook.title, myBook.authors[0], myBook.pageCount, myBook.publishedDate, myBook.language ,hyperlink]);
      Logger.log(output);
    sheet.getRange(i,2,1,7).setValues(output); //write data to the row of the isbn number
    } 
    else {
      // Search Book in OPEN Library API (if not found in Google API)
      var myBook = getOpenISBN(isbn);
      Logger.log("myBook: " + myBook);
      try { 
      if (myBook != {}) {
        //Logger.log(myBook);
        try{ if (myBook.authors[0]["name"]){var author = myBook.authors[0]["name"]}} catch(e) {var author = "N/A";}
        try{ if (myBook.cover["medium"]){var image = '=image("' + myBook.cover["medium"] + '",1)';sheet.setRowHeight(i,65);}} catch (e) {var image = "";}
        try{ if (myBook["url"]){var hyperlink = '=hyperlink("' + myBook["url"] + '","See Book Online")'}} catch (e) {var image = "";}
        var lang = getLanguage(isbn);
        
        output.push([image, myBook.title, author, myBook.number_of_pages, myBook.publish_date, lang ,hyperlink]); 
        Logger.log(output);
        sheet.getRange(i,2,1,7).setValues(output); //write data to the row of the isbn number
      }} catch (e) {sheet.getRange(i,3,1,1).setValue("unknown");} //if it is not found in either Google or OpenLibrary, write unknown
      } 
  }
 }

//GET LANGUAGE IN OPENLIBRARY API (with details API call)
function getLanguage(isbn){
  
    try{
    var response = UrlFetchApp.fetch('https://openlibrary.org/api/books?bibkeys=ISBN:'+isbn+'&jscmd=details&format=json');
    var responseJSON = JSON.parse(response.getContentText());
      
    var lang = responseJSON["ISBN:"+isbn+""].details.languages[0].key;
    switch (lang)  {
        case "/languages/ger":
            lang = "de";
            break;
        case "/languages/fre":
            lang = "fr";
            break;
        case "/languages/eng":
            lang = "en";
            break;
        default:
            //lang = "";
            break;
    }
    return lang;
  } 
  catch(e) {return "N/A";}
}

//GET DATA IN OPENLIBRARY API (with data API call)
function getOpenISBN(isbn){
  try{
    var response = UrlFetchApp.fetch('https://openlibrary.org/api/books?bibkeys=ISBN:'+isbn+'&jscmd=data&format=json');
    var responseJSON = JSON.parse(response.getContentText());

    return responseJSON["ISBN:"+isbn+""];
  } 
  catch(e) {return 0;}
}

//GET DATA IN GOOGLE BOOKS API
function getISBN(isbn){
  try{
    
  var response = UrlFetchApp.fetch('https://www.googleapis.com/books/v1/volumes?q=+isbn:'+isbn);
  var responseJSON = JSON.parse(response.getContentText());
  
  Logger.log("ISBN: " + isbn);
  Logger.log("Title: " + responseJSON["items"][0]["volumeInfo"].title);
  Logger.log("Full: " + responseJSON["items"][0]["volumeInfo"]);
  
  return responseJSON["items"][0]["volumeInfo"];
  } 
  catch(e) {return 0;}
}
