
Query for retrieving the user's orders from the database.

select distinct *
from orders
where order_id in (
                select order_id
                from placed_by
                where email = \'${req.session.user}\')

*${req.session.user} in this case represents the user's email


Query for retrieving books in the database.(This is performed when preparing a book to be showed in detailed view)

SELECT * from books where isbn = $1

*$1 represents a book's isbn




Query for checking if a user exists in the database.

SELECT * from users where email = value

*value in this case represents the provided parameter in a request



Query for retrieving the total_sales by authoer from the database.

SELECT author,sum(order_details.amount_paid) AS total_author
                    FROM order_details natural join books
                    GROUP BY author


Query for retrieving the total revenue in the database.

select sum(amount_paid*(1-(cut::numeric/100))::numeric(6,1)) as total_revenue

from order_details join published_by using(isbn);


Query for retrieving the total sales by genre from the database.

SELECT genre,sum(order_details.amount_paid) AS total_genre
                    FROM order_details natural join books
                    GROUP BY genre

Query for inserting values into publishers table in the database.

INSERT INTO publishers(email,publisher_name,address,bank_account)
     VALUES('${values[0]}','${values[1]}','${values[2]}',${values[3]})

*each ${values[i]} corresponds to the information entered by the user in text boxes corresponding to each attribute

