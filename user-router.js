const express = require('express');
let userRouter = express.Router();

let pool = require('./server.js');

//Sets routes to be handled (/users and /users/:uid)
userRouter.get("/:uid",[fetchInfo,showPage]);

//pre-process the uid parameter to check whether or not exists in database. If it does, moves on to the showUser
//handler after checking if the user trying to access profile is logged in and trying to access their own profile.
userRouter.param("uid",  function(req, res, next, value){

    console.log("Finding user by email: " + value);

    pool.connect((err, client, done) => {
        if (err) console.log(err);
        client.query('SELECT * from users where email = $1', [value], (err, result) => {
            done();
            if (err) console.log(err);
            req.session.user = result.rows[0].email;
            req.session.loggedin = true;

            next()
        })
    })
});

function fetchInfo (req,res,next) {

    if (req.session.user !== 'admin') {

        pool.connect((err, client, done) => {
            if (err) console.log(err);
            let query = 'select distinct *\n' +
                'from orders\n' +
                'where order_id in (\n' +
                'select order_id\n' +
                'from placed_by\n' +
                `where email = \'${req.session.user}\')\n`;

            client.query(query, (err, result) => {
                done();
                if (err) console.log(err);
                if (result.rows.length > 0) {
                    req.session.orders = result.rows
                } else {
                    req.session.orders = [];

                }
                next()
            });
        });
    } else {

        pool.connect((err, client, done) => {
            if (err) console.log(err);

            client.query({
                text: "SELECT author,sum(order_details.amount_paid) AS total_author\n" +
                    "   FROM order_details natural join books\n" +
                    "  \tGROUP BY author",
                name: "sales_author"
            }, (err, result) => {
                if (err) console.log(err);
                req.session.total_author = result.rows
                console.log(req.session.total_author)

            });

            client.query({
                text: 'select sum(amount_paid*(1-(cut::numeric/100))::numeric(6,1)) as total_revenue\n' +

                ' from order_details join published_by using(isbn)',
                name: "total_sales"
            }, (err, result) => {
                if (err) console.log(err);
                console.log(result.rows[0])

                req.session.total_sales = result.rows[0]

            });

            client.query({
                text: "SELECT genre,sum(order_details.amount_paid) AS total_genre\n" +
                    "\n" +
                    "FROM order_details natural join books\n" +
                    "\n" +
                    "GROUP BY genre",
                name: "total_genre"
            }, (err, result) => {
                done();
                if (err) console.log(err);
                console.log(result.rows);
                req.session.total_genre = result.rows
                next()

            });
        });

    }

}

//Fetchs all users stored in database and passes it to user pug template.


function showPage(req,res,next){

    if (req.session.user !== 'admin'){

        res.status(200).render('pages/orders',{session:req.session,orders:req.session.orders})

    } else{
        res.status(200).render('pages/profile',{session:req.session})
    }

}



module.exports = userRouter;
