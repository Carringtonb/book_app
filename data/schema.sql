DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    image_URL TEXT,
    ISBN13 NUMERIC(13),
    bookshelf VARCHAR(255)
);

INSERT INTO books (title, author, description, image_URL, ISBN13)
VALUES('catcher in the rye', 'jd salinger', 'emo ass book', 'https://pictures.abebooks.com/isbn/9780316769174-us.jpg', '1827493847582')