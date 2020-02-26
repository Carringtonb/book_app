'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));


const PORT = process.env.PORT || 3001;

app.get('/', renderHomePage);
app.get('/newsearch', newSearch);
app.post('/searches', collectFormData);
// app.post('/newsearch', addBooks);
app.get('*', (request, response) => {
  response.status(404).send('this page does not exist')
})

function renderHomePage(request, response){
// console.log('i am broken pls halp')
    response.render('./pages/searches/show.ejs');
}

function newSearch(request, response){
    response.render('./pages/index.ejs');
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
                return new Book(book.volumeInfo);
            })
                console.log(finalArray, 'looking for isbn');
            // resultsArray.forEach(result => {
            // })
            response.render('./pages/searches/show.ejs', {books: finalArray});
        })
}

    function Book(obj){
        this.title = obj.title || 'no title available';
        this.authors = obj.authors || 'no author available';
        this.description = obj.description || 'no description'
        this.image = (obj.imageLinks) ? obj.imageLinks.thumbnail.replace('http:', 'https:') : 'https://i.imgur.com/J5LVHEL.jpg';
        this.isbn = obj.industryIdentifiers[0].identifier || 'null';
    }

    // function addBooks(request, response){
    //     let {title, authors, description, image, isbn} = finalArray;

    //     let sql = 'INSERT INTO books ('title, authors, description, image_URL, isbn13') VALUES ($1, $2, $3, $4, $5);';
    //     let safeValues = [title, authors, description, image_URL, isbn13];

    //     client.query(sql, safeValues)
    //         .then(()=> {
    //             response.redirect('/');
    //         })
    // }

    function getAllBooks(request, response){
  // go to the database, get all the tasks, and render them to the index.ejs page

  let sql = 'SELECT * FROM books;';

  client.query(sql)
    .then(results => {
      let tasks = results.rows;
      response.render('./pages/searches/show.ejs', {taskArray: tasks})
    })
}

    client.connect()
        .then(()=>{
    app.listen(PORT, () =>{
        console.log(`listening on ${PORT}`);
    })
        })
    // .catch(console.error(error));