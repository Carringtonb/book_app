'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

const PORT = process.env.PORT || 3001;

app.get('/', renderHomePage);
app.get('/newsearch', newSearch);
app.post('/searches', collectFormData);

function renderHomePage(request, response){
    response.render('./index.ejs');
}

function newSearch(request, response){
    response.render('./index.ejs');
}

function collectFormData(request, response){
    let formData = request.body.search;
    let nameOfBookOrAuthor = formData[0];
    let isAuthorOrTitle = formData[1];

    let url = `https://www.googleapis.com/books/v1/volumes?q=`;

    if(isAuthorOrTitle === 'title'){
        url += `+intitle:${nameOfBookOrAuthor}`;
    } else if (isAuthorOrTitle === 'author'){
        url += `+inauthor:${nameOfBookOrAuthor}`;
    }

    superagent.get(url)
        .then(results => {
            let resultsArray = results.body.items;
            const finalArray = resultsArray.map(book =>{
                new Book(book.volumeInfo);
            })
            response.render('./show.ejs', {books: finalArray});
        })
}

    function Book(obj){
        this.title = obj.title || 'no title available';
    }

    app.listen(PORT, () =>{
        console.log(`listening on ${PORT}`);
    })