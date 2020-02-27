'use strict'

//////////////////////////////LIBRARIES////////////////////////////////////

require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
require('ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));



/////////////////////////////MIDDLE WARE/////////////////////////////////

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(methodOverride('_method'));

////////////////////////////////////////ROUTES ///////////////////////////////

const PORT = process.env.PORT || 3001;

app.get('/', renderHomePage);
app.get('/newsearch', newSearch);
app.post('/searches', collectFormData);
app.get('/books/:book_id', displayOneBook);
app.put('/books/:book_id', updateOneBook);
app.get('*', (request, response) => {
  response.status(404).send('this page does not exist')
})

//////////////////////////////////////////////FUNCTIONS/////////////////////////////

function displayOneBook(request, response){
    let id = request.params.book_id;
    let sql = 'SELECT * FROM books WHERE id=$1;';
    let safeValues = [id];

    client.query(sql, safeValues)
        .then(results =>{
            response.render('./pages/books/detail.ejs', {database: results.rows});
            // console.log(results.rows[0]);
        })
    // console.log(request.params.book_id);
}

function updateOneBook(request, response){
    console.log(request.params.book_id);
    let {title, authors, description, image, isbn} = request.body;
    let id = request.params.book_id;

    let sql = 'UPDATE books SET title=$1, authors=$2, description=$3, image=$4, isbn=$5 WHERE id=$6;';

    let safeValues = [title, authors, description, image, isbn];

    client.query(sql, safeValues)
        .then(() => {
            response.redirect('/');
        })
}


function renderHomePage(request, response){
     let sql = 'SELECT * FROM books;';

  client.query(sql)
    .then(results => {
      let books = results.rows;
      console.log(books, 'hi tedward');
    response.render('pages/index.ejs', {bookArray: books});
    });
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
            response.render('./pages/searches/show.ejs', {books: finalArray});
        })
}
    // CONSTRUCTOR FUNCTION FOR BOOKS
    function Book(obj){
        this.title = obj.title || 'no title available';
        this.authors = obj.authors[0] || 'no author available';
        this.description = obj.description || 'no description'
        this.image = (obj.imageLinks) ? obj.imageLinks.thumbnail.replace('http:', 'https:') : 'https://i.imgur.com/J5LVHEL.jpg';
        this.isbn = obj.industryIdentifiers[0].identifier || 'null'
        // this.bookshelf = obj.categories[0] || 'no bookshelf available';
    }

    function addBooks(request, response){
        let {title, authors, description, image, isbn} = finalArray;
    console.log(title, 'title');
        let sql = 'INSERT INTO books (title, authors, description, image_URL, ISBN13) VALUES ($1, $2, $3, $4, $5);';
        let safeValues = [title, authors, description, image_URL, ISBN13];

        client.query(sql, safeValues)
            .then(()=> {
                response.redirect('/');
            })
    }

    function getAllBooks(request, response){
  // go to the database, get all the tasks, and render them to the index.ejs page
      response.render('./pages/searches/show.ejs', {taskArray: tasks})
    }

    //BUTTON FOR SHOW.EJS
    // $('detail').click(function(){
        
    // }


    client.connect()
        .then(()=>{
    app.listen(PORT, () =>{
        console.log(`listening on ${PORT}`);
    })
        })
    // .catch(console.error(error));