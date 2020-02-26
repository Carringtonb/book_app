DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    image_URL VARCHAR(255),,
    ISBN13 NUMERIC(13)
);

INSERT INTO books (title, author, description, image_URL)
VALUES('catcher in the rye', 'jd salinger', 'emo ass book', 'https://pictures.abebooks.com/isbn/9780316769174-us.jpg')