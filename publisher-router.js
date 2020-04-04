const express = require('express');
let publisher = express.Router();
const jsStringify = require('js-stringify')

let pool = require('./server.js');


//Sets routes to be handled (/users and /users/:uid)

publisher.get("/:pid",func);
publisher.post("/",[queryParserA,addPublisher])
publisher.post("/edit",[queryParserB,editPublisher])
publisher.param("pid",function(req, res, next,value) {
    req.session.pubname = value;
    pool.connect((err, client, done) => {
        if (err) console.log(err);
        let query = `select * from publishers where email = '${value}'`
        client.query(query, (err, result) => {
            if (err) console.log(err);
            req.session.pub = result.rows[0]
                res.status(200).render('pages/pub_edit', {jsStringify,session: req.session,publishers:req.session.pub});

        })

    });


})

publisher.get("/",function(req, res, next) {

    pool.connect((err, client, done) => {
        if (err) console.log(err);
        let query = 'select * from publishers '

        client.query(query, (err, result) => {
            if (err) console.log(err);
            console.log(result.rows);

            if (req.session.loggedin && req.session.user === 'admin') {

                res.status(200).render('pages/publisher', {session: req.session,publishers:result.rows});

            }
        })

    });


})

function func(req,res,next){


}


function queryParserA(req, res, next){

    let values = [];

    const count = Object.values(req.body).reduce((pre, cur) => (cur === '') ? ++pre : pre, 0)
    console.log(req.body)
    console.log(count);
    if(count === 0 && Object.values(req.body).length > 0){

        for (let [key, value] of Object.entries(req.body)) {

            values.push(value)

        }

        req.sql_query = `INSERT INTO publishers(email,publisher_name,address,bank_account)
     VALUES('${values[0]}','${values[1]}','${values[2]}',${values[3]})`
        console.log(req.sql_query)
        next();
    }else{
        console.log("test")
        res.status(200).render('pages/publisher',{errormessage:'Fill out all fields',session:req.session})

    }


}
//Parses user profile page by checking if user is authorized and sends info to be display to be parsed by pug
//template
function addPublisher(req,res,next){

        pool.connect((err, client, done) => {
            if (err) console.log(err);
            client.query(req.sql_query, (err, result) => {
                done();
                if (err)  console.log(err);
                if (result !== undefined){

                    res.status(200).render("pages/publisher",{session:req.session});

                }else{

                    res.status(404).render("pages/publisher",{errormessage:err,session:req.session});
                }

            });
        });


}

function queryParserB(req, res, next){

    let bank_acc = JSON.parse(JSON.stringify(req.body)).bankacc;
    console.log(bank_acc);

    if(bank_acc.length === 10){

        req.sql_query = `update publishers set bank_account = ${bank_acc}::numeric(10) where email = '${req.session.pubname}'`;
        next();
    }else{
        res.status(404).render('pages/pub_edit', {errormessage:'Wrong format for bank account',session: req.session,publishers:req.session.pub});


    }


}
//Parses user profile page by checking if user is authorized and sends info to be display to be parsed by pug
//template
function editPublisher(req,res,next){
    console.log(req.session.pubname)
    console.log(req.sql_query)

    pool.connect((err, client, done) => {
        if (err) console.log(err);
        client.query(req.sql_query, (err, result) => {
            done();
            if (err)  console.log(err);
            if (result !== undefined){

                res.status(200).render("pages/publisher",{errormessage:"Record Updated",session:req.session});

            }else{

                res.status(404).render("pages/publisher",{errormessage:err,session:req.session});
            }

        });
    });


}
module.exports = publisher;
