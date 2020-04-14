const express = require('express');
let catalogue = express.Router();
let pool = require('./server.js');
const bodyParser = require('body-parser');
catalogue.use(bodyParser.urlencoded({ extended: false }));
catalogue.use(bodyParser.json());


//Sets routes to be handled (/users and /users/:uid)
catalogue.get("/",[queryParser,loadBooks]);
catalogue.post("/",[queryParserA,addBook]);


//Fetchs all users stored in database and passes it to user pug template.

function queryParser(req, res, next){

    const count = Object.values(req.query).reduce((pre, cur) => (cur === '') ? ++pre : pre, 0)
    req.sql_query = `SELECT * from books`;

    if(count < 4 && Object.values(req.query).length > 0){
        req.sql_query += ` where `;

        let i = 1;
        let j = 4 - count;

        for (let [key, value] of Object.entries(req.query)) {

            if (value !== ''){

                if (i<j){
                    if(key !== 'isbn'){

                        req.sql_query += `LOWER(${key}) like %${value.toLowerCase()}% and `
                    }else{
                        req.sql_query += `${key}::varchar(255) like '%${value.toLowerCase()}%' and `
                    }
                }else{

                    if(key !== 'isbn'){

                        req.sql_query += `LOWER(${key}) like '%${value.toLowerCase()}%'`
                    }else{
                        req.sql_query += `${key}::varchar(255) like '%${value.toLowerCase()}%'`
                    }

                }

            }
            i++
        }

        console.log(req.sql_query)

    }

    next();
}


function loadBooks(req,res,next){

    pool.connect((err, client, done) => {
        if (err) console.log(err);
        client.query(req.sql_query, (err, result) => {
            done();
            if (err)  console.log(err);
            if (result !== undefined){

                res.status(200).render('pages/catalogue',{session:req.session,books:result.rows});

            }else{
                res.status(200).render('pages/catalogue',{session:req.session,books:[]});
            }

        });
    });

}

function queryParserA(req, res, next){


    const count = Object.values(req.body).reduce((pre, cur) => (cur === '') ? ++pre : pre, 0)
    let values = [];
    console.log(req.body)
    console.log(count);
    if(count === 0 && Object.values(req.body).length > 0){

        for (let [key, value] of Object.entries(req.body)) {

            values.push(value)

        }

        console.log(values)

    }else{
        res.status(200).render('pages/add_book',{errormessage:'Fill out all fields',session:req.session})
    }
    req.sql_query = `INSERT INTO BOOKS(ISBN,TITLE,AUTHOR,NB_of_pages,SUMMARY,publisher,PRICE,GENRE)
     VALUES(${values[0]},'${values[1]}','${values[2]}',${values[3]},'${values[4]}',
     '${values[5]}',${values[6]},'${values[7]}')`;

    console.log(req.sql_query)

    next();
}

function addBook(req,res,next){

    pool.connect((err, client, done) => {
        if (err) console.log(err);
        client.query(req.sql_query, (err, result) => {
            done();
            if (err)  console.log(err);
            console.log(result)
            if (result.name !== 'error'){

                res.status(200).render('pages/add_book',{session:req.session});

            }else{
                if(result.rowCount === 0){

                    res.status(404).render('pages/add_book',{errormessage:'no such publisher',session:req.session});

                }else{
                    res.status(404).render('pages/add_book',{errormessage:err,session:req.session});

                }
            }

        });
    });

}


module.exports = catalogue;
