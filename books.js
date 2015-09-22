//books.js

// Toggle depending on local vs web host
// var host = "http://localhost:2000/";
var host = "http://theadamcooper.com:2000/";
var library = {Alice_in_Wonderland:"aliceInWonderland.txt" , Peter_Pan:"peter.txt" , Aesops_Fables:"aesop.txt" , Jungle_Book:"jungle.txt" , Andersens_Fairy_Tales:"andersen.txt"};
var http = require("http");
var fs = require("fs");
var server = http.createServer(function(req,res) {

  var requrl = req.url;

  // Split the URL into the components between the slashes.
  var urlArr = requrl.split("/");
  console.log(urlArr);

  // Get stylesheet for book pages.
  if (urlArr[2] === "style.css") {
    fs.readFile("style.css" , function(err,data) {
      var style = data.toString();
      res.end(style);
    });
  } else if (library[urlArr[1]]) { // If the title requested is present...

    fs.readFile("sindex.html" , function(err,data1) { // ...read from it.

      fs.readFile( library[urlArr[1]] , function(err,data2) {
        // Read the page requested and incorporate it into the webpage to be returned.
        var paginatedFile = paginate(data2.toString() , urlArr[2]); 
        var result = data1.toString().replace("REPLACE", paginatedFile);

        // Include a link to the previous page.
        result = parseInt(urlArr[2]) - 1 >= 1 ? result.replace("pBack", host + urlArr[1] + "/" + (parseInt(urlArr[2]) - 1)+" ") : result.replace("pBack","");

        // Calculate the total number of pages. 
        var book = data2.toString();
        var lines = book.split("\n");
        var totalPages = Math.floor(lines.length / 22) + 1;

        // If we are not on the last page, include a link to the next page.
        result = parseInt(urlArr[2]) < totalPages ? result.replace("pNext", host + urlArr[1] + "/" + (parseInt(urlArr[2]) + 1)) : result.replace("pNext","");
        
        // Include the current page number.
        result = result.replace("ii", urlArr[2]);

        // Include the book title on the webpage to be returned.
        title = urlArr[1].replace(/_/g, " ");
        result = result.replace("TITLE", title);

        // Composition of webpage is complete & ready to be returned.
        res.end(result);
      });
    });
  }

  // Favicon
  else if (urlArr[1] === "favicon.ico") {
    fs.readFile("favicon.ico", function(err, data) {
      var icon = data.toString();
      res.end(data);
    });

  // Splash page
  } else if (urlArr[1] === "index.html") {
    fs.readFile("index.html", function(err, data) {
      var splash = data.toString();
      res.end(splash);
    });

  // Splash page CSS
  } else if (urlArr[1] === "splash.css") {
    fs.readFile("splash.css", function(err, data) {
      var splashStyle = data.toString();
      res.end(splashStyle);
    });
  }

  });
// server.listen(80);
server.listen(2000);

// Composes any requested page (pg) of the text (book). Pages are 22 lines long.
var paginate = function(book , pg) {
  var pages = [];
  var lines = book.split("\n");
  var startLine = (pg-1) * 22;
  for (i=startLine ; i < startLine +22; i++){
    pages.push(lines[i]);
  }
  return pages.join("</br>");
};
