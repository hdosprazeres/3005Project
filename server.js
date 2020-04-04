const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const jsStringify = require('js-stringify')

let user_cart = [];

// const { Pool, Client } = require('pg');
// const connectionString = 'postgressql://postgres:Alface123@localhost:5432/postgres';

const {Pool} = require('pg');

let config = {
	user: 'postgres',
	password: 'Alface123',
	database: 'postgres',
	host: 'localhost',
	port: 5432,
	max: 10,                    // max number of clients in the pool
	idleTimeoutMillis: 30000,   // how long a client is allowed to remain idle
	ssl: false
};

const pool = new Pool(config);
module.exports = pool;

const app = express();

app.use(session({
	secret: 'hello there',
	store: new (require('connect-pg-simple')(session))(
		{
		pool: pool,
			tableName:'session'
		}),
	rolling: true,
	resave: false,
	cookie: { maxAge: 120000}
}));

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let catRouter = require ('./cat-router');
let bookRouter = require('./book-router');
let userRouter = require('./user-router');
let pubRouter = require('./publisher-router');

app.use("/catalogue",catRouter);
app.use("/book",bookRouter);
app.use("/users",userRouter);
app.use("/publishers",pubRouter);

app.get("/cart",function(req, res, next) {
	console.log(user_cart);
	if (req.session.loggedin){
		res.status(200).render('pages/cart', {jsStringify,session: req.session, books: user_cart});


	}else{

		res.status(404).render("pages/index",{errormessage: 'You have to be logged in',session:req.session});

	}
});

app.post("/cart",function(req, res, next) {
	console.log(user_cart)
	let in_list = false;
	if (user_cart.length>0){

		user_cart.forEach(b=>{

			if(b.title === req.body.book.title){
				console.log(b.title + " already in list, updating qty.");
				b.qty += 1;
				in_list = true;
			}

		});

	}
	if (!in_list){
		req.body.book.qty = 1;
		user_cart.push(req.body.book);
		console.log(" book not in list, pushing book.");

	}
	res.status(200).send()

});

app.get('/', function(req, res, next) {
	console.log(req.session);
	res.render("pages/index",{session:req.session});

});

app.get('/logout', function(req, res, next) {
	req.session.loggedin = false;
	req.session.user = undefined
	user_cart = []
	res.render("pages/index",{session:req.session});

});

app.post('/login', function(req, res, next) {

	console.log(req.body)
	pool.connect((err, client, done) => {
		if (err) console.log(err);
		let query = 'select *\n' +
			'from users';

		query += ` where email= '${req.body.email}' and password = '${req.body.password}'`;

		console.log(query)
		client.query(query, (err, result) => {
			done();
			if (err)  console.log(err);
			console.log(result.rows)
			if (result.rows.length > 0 && result.rows[0].email === req.body.email && result.rows[0].password === req.body.password){
				req.session.loggedin = true;
				console.log(result.rows[0].email)
				req.session.user = result.rows[0].email
				res.status(200).render('pages/index',{session:req.session});

			}else{

				res.status(404).render('pages/index',{errormessage: 'wrong username or password',session:req.session});

			}

		});
	});

});

app.get("/addbook",function(req, res, next) {

	if (req.session.loggedin && req.session.user === 'admin') {

		res.status(200).render('pages/add_book', {session: req.session});

	}

})

app.post("/remove",function(req, res, next) {

	req.sql_query = `delete from books where isbn = ${req.body.book.isbn}`

	pool.connect((err, client, done) => {
		if (err) console.log(err);
		client.query(req.sql_query, (err, result) => {
			done();
			if (err)  console.log(err);
			if (result !== undefined){

				res.status(200).render("pages/index",{session:req.session});

			}else{

				res.status(404).render(`pages/book/${req.body.book.isbn}`,{errormessage:err,session:req.session});
			}

		});
	});

});

app.post("/placeorder",[addOrder,placedBy,addDetails])


function addOrder(req, res, next) {

	let shipping = JSON.parse(JSON.stringify(req.body)).shipping
	let method = JSON.parse(JSON.stringify(req.body)).method


	pool.connect((err, client, done) => {
		if (err) console.log(err);
		const queryText = `INSERT INTO orders(shipping_address,method_of_payment) VALUES(
			'${shipping}','${method}') returning order_id`

		client.query(queryText, (err, result) => {
			if (err) console.log(err);
			req.session.order_id = result.rows[0].order_id;

			done();
			next()

		});
	})


}

function placedBy(req, res, next) {


	pool.connect((err, client, done) => {
		if (err) console.log(err);
		const queryText = `INSERT INTO placed_by(order_id,email) VALUES(
			${req.session.order_id},'${req.session.user}')`

		client.query(queryText, (err, result) => {
			if (err) console.log(err);
			done();
			next()

		});
	})


}


function addDetails(req, res, next) {

	for (let i = 0; i < user_cart.length; i++) {

		pool.connect((err, client, done) => {
			if (err) console.log(err);


			const orderDetailText = 'INSERT INTO order_details(order_id, isbn, item_nb, qty, amount_paid)' +
				` VALUES (${req.session.order_id}, $1, $2, $3, $4)`;

			client.query(orderDetailText, [user_cart[i].isbn, i + 1, user_cart[i].qty, parseFloat(user_cart[i].price) * parseInt(user_cart[i].qty) ], (err, result) => {
				if (err) console.log("hello", err);
				done();
			})

		});
	}

	res.status(200).render("pages/index",{errormessage:"Order Placed",session:req.session})


}

app.listen(3000);
console.log("Server listening on port 3000");


