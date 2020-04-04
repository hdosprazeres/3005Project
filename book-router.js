const express = require('express');
let bookRouter = express.Router();
const jsStringify = require('js-stringify')

let pool = require('./server.js');

//Sets routes to be handled (/users and /users/:uid)
bookRouter.get("/:bid",bookDetail);


bookRouter.param("bid",  function(req, res, next, value){

    console.log("Finding book by ISBN: " + value);

    pool.connect((err, client, done) => {
        if (err) console.log(err);
        client.query('SELECT * from books where isbn = $1', [value], (err, result) => {
            done();
            if (err)  console.log(err);
            console.log(result.rows[0].title)
            console.log(req.session.user)
            res.status(200).render('pages/book',{jsStringify,session:req.session,book:result.rows[0]});
        });
    });

});


function bookDetail(req,res,next){

    console.log('test')

    if(req.book !== undefined){
        console.log('test')

        res.status(200).render('pages/book',{book:req.book});

    }
}


module.exports = bookRouter;
