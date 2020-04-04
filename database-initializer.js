const fs = require('fs')

const Books = {
    "books": [
    {
        "isbn": "9781593275846",
        "title": "Eloquent JavaScript, Second Edition",
        "author": "Marijn Haverbeke",
        "pages": 472,
        "description": "JavaScript lies at the heart of almost every modern web application, from social apps to the newest browser-based games. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.",
    },
    {
        "isbn": "9781449331818",
        "title": "Learning JavaScript Design Patterns",
        "author": "Addy Osmani",
        "pages": 254,
        "description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.",
    },
    {
        "isbn": "9781449365035",
        "title": "Speaking JavaScript",
        "author": "Axel Rauschmayer",
        "pages": 460,
        "description": "Like it or not, JavaScript is everywhere these days-from browser to server to mobile-and now you, too, need to learn the language or dive deeper than you have. This concise book guides you into and through JavaScript, written by a veteran programmer who once found himself in the same position.",
    },
    {
        "isbn": "9781491950296",
        "title": "Programming JavaScript Applications",
        "author": "Eric Elliott",
        "pages": 254,
        "description": "Take advantage of JavaScript's power to build robust web-scale or enterprise applications that are easy to extend and maintain. By applying the design patterns outlined in this practical book, experienced JavaScript developers will learn how to write flexible and resilient code that's easier-yes, easier-to work with as your code base grows.",
    },
    {
        "isbn": "9781593277574",
        "title": "Understanding ECMAScript 6",
        "author": "Nicholas C. Zakas",
        "pages": 352,
        "description": "ECMAScript 6 represents the biggest update to the core of JavaScript in the history of the language. In Understanding ECMAScript 6, expert developer Nicholas C. Zakas provides a complete guide to the object types, syntax, and other exciting changes that ECMAScript 6 brings to JavaScript.",
    },
    {
        "isbn": "9781491904244",
        "title": "You Don't Know JS",
        "author": "Kyle Simpson",
        "pages": 278,
        "description": "No matter how much experience you have with JavaScript, odds are you don’t fully understand the language. As part of the \"You Don’t Know JS\" series, this compact guide focuses on new features available in ECMAScript 6 (ES6), the latest version of the standard upon which JavaScript is built.",
    },
    {
        "isbn": "9781449325862",
        "title": "Git Pocket Guide",
        "author": "Richard E. Silverman",
        "pages": 234,
        "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git experience.",
    },
    {
        "isbn": "9781449337711",
        "title": "Designing Evolvable Web APIs with ASP.NET",
        "author": "Glenn Block, et al.",
        "pages": 538,
        "description": "Design and build Web APIs for a broad range of clients—including browsers and mobile devices—that can adapt to change over time. This practical, hands-on guide takes you through the theory and tools you need to build evolvable HTTP services with Microsoft’s ASP.NET Web API framework. In the process, you’ll learn how design and implement a real-world Web API.",
    }
]
};

let sql_ddl = []


let book_array = Books.books;

function getRandomFloat() {
    return (Math.random() * (35.99 - 8.99) + 8.99).toPrecision(4);
}

book_array.forEach(q=>{

        q.description.replace('',"\'");
        sql_ddl.push(`insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre) values(${parseInt(q.isbn)},\'${q.title}\',${parseInt(q.pages)},\'${q.description}\','oreilly@gmail.com',${getRandomFloat()},'Non-Fiction Computer'`)

    })

fs.writeFileSync('insert_books.sql', sql_ddl.join(';') , 'utf-8');
