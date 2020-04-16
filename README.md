# isbn-lookup-gscript
Looking up book titles, authors, etc from ISBN number in Google Sheets with gscript.
It's using the [Google Books API](https://developers.google.com/books) first and if it cannot find the title the [OpenLibrary API](https://openlibrary.org/dev/docs/api/books). 

## WHY?
I wanted to put some books online to give away, and I was lazy to type all the titles, authors and info by myself. So I downloaded an app that allows to scan barcodes to an excel file / google sheets and then I created a little script to look up those ISBN codes.

## What you need
A Google Sheet with the ISBN numbers you want to look up listed starting from A2, A3, A4, ... 

## How to?
- In your google sheet click on Tools > Script editor. A new window will open. 
- Copy paste the code from the [Code.gs](Code.gs) document in there.
- Click on Run > Run function > myfunction
- Go back to the Google sheet and it should be done.

- If there are any errors occuring, you will get a red flag on the top in the script editor. 
- You can use Logger.log("Hi"); to print any intermediary outputs and display them with CTRL + Enter after running the function.

## What is looked up
- Cover picture
- Title
- Author
- Number of Pages
- Publishing Year
- Language
- Info Link

## Bugs
I only debugged for the errors that occured with the books that I was looking for.
Known bug: not all images show up in the Google Sheets, even though the links are there.

*Have fun!*
