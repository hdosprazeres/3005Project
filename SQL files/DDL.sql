CREATE TABLE public.books
(
    isbn numeric(13,0) NOT NULL,
    title character varying(50) COLLATE pg_catalog."default",
    author character varying(25) COLLATE pg_catalog."default",
    nb_of_pages numeric(4,0),
    summary character varying(1000) COLLATE pg_catalog."default",
    publisher character varying(20) COLLATE pg_catalog."default",
    price numeric(10,2),
    genre character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT books_pkey PRIMARY KEY (isbn)
)

CREATE TABLE public.cart
(
    item_nb integer NOT NULL DEFAULT nextval('cart_item_nb_seq'::regclass),
    email character varying(20) COLLATE pg_catalog."default" NOT NULL,
    qty numeric(2,0) NOT NULL DEFAULT 1,
    isbn numeric(13,0) NOT NULL,
    CONSTRAINT cart_pkey PRIMARY KEY (email, isbn),
    CONSTRAINT cart_email_fkey FOREIGN KEY (email)
        REFERENCES public.users (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT cart_isbn_fkey FOREIGN KEY (isbn)
        REFERENCES public.books (isbn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT cart_qty_check CHECK (qty > 0::numeric)
)

CREATE TABLE public.inventory
(
    isbn numeric(13,0) NOT NULL,
    qty_in_stock numeric(3,0),
    CONSTRAINT inventory_pkey PRIMARY KEY (isbn),
    CONSTRAINT inventory_qty_in_stock_check CHECK (qty_in_stock > 10::numeric)
)

CREATE TABLE public.order_details
(
    order_id integer NOT NULL,
    isbn numeric(13,0),
    item_nb integer NOT NULL,
    qty integer NOT NULL,
    amount_paid numeric(6,2),
    CONSTRAINT order_details_pkey PRIMARY KEY (order_id, item_nb),
    CONSTRAINT order_details_isbn_fkey FOREIGN KEY (isbn)
        REFERENCES public.inventory (isbn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.placed_by (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT order_details_qty_check CHECK (qty > 0)
)


CREATE TABLE public.orders
(
    order_id integer NOT NULL DEFAULT nextval('orders_order_id_seq'::regclass),
    date_of_purchase timestamp without time zone NOT NULL DEFAULT CURRENT_DATE,
    shipping_address character varying(20) COLLATE pg_catalog."default" NOT NULL,
    method_of_payment character varying(15) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
)

CREATE TABLE public.phone_numbers
(
    email character varying(20) COLLATE pg_catalog."default" NOT NULL,
    phonenumber numeric(7,0) NOT NULL,
    CONSTRAINT phone_numbers_pkey PRIMARY KEY (email, phonenumber),
    CONSTRAINT email FOREIGN KEY (email)
        REFERENCES public.users (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

CREATE TABLE public.placed_by
(
    order_id integer NOT NULL,
    email character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT placed_by_pkey PRIMARY KEY (order_id),
    CONSTRAINT placed_by_email_fkey FOREIGN KEY (email)
        REFERENCES public.users (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT placed_by_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.orders (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE public.published_by
(
    isbn numeric(13,0) NOT NULL,
    publisher_email character varying(20) COLLATE pg_catalog."default" NOT NULL,
    cut integer DEFAULT 10,
    CONSTRAINT published_by_pkey PRIMARY KEY (isbn, publisher_email),
    CONSTRAINT published_by_isbn_fkey FOREIGN KEY (isbn)
        REFERENCES public.books (isbn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT published_by_publisher_email_fkey FOREIGN KEY (publisher_email)
        REFERENCES public.publishers (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT published_by_cut_check CHECK (cut >= 5 AND cut <= 25)
)

CREATE TABLE public.publishers
(
    email character varying(20) COLLATE pg_catalog."default" NOT NULL,
    publisher_name character varying(20) COLLATE pg_catalog."default",
    address character varying(25) COLLATE pg_catalog."default",
    bank_account numeric NOT NULL,
    CONSTRAINT publishers_pkey PRIMARY KEY (email),
    CONSTRAINT bankcheck CHECK (length(bank_account::character(255)) = 10)
)

CREATE TABLE public.users
(
    first_name character varying(20) COLLATE pg_catalog."default",
    last_name character varying(20) COLLATE pg_catalog."default",
    email character varying(20) COLLATE pg_catalog."default" NOT NULL,
    billing_address character varying(20) COLLATE pg_catalog."default",
    password character varying(8) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (email)
)

INSERT INTO public.publishers(
	email, publisher_name, address, bank_account)
	VALUES ('oreilly@gmail.com', 'WeRock', 'winchestertonfieldville', 4932059484);

INSERT INTO public.users(
	first_name, last_name, email, billing_address)
	VALUES ('Justin', 'Biba', 'JB19@gmail.com', 'Where money is');

INSERT INTO public.users(
	first_name, last_name, email, billing_address)
	VALUES ('Samuel', 'Jackson', 'mudafucka@gmail.com', 'I take whatever role');

INSERT INTO public.users(
	first_name, last_name, email, billing_address)
	VALUES ('John', 'Mclane', 'yipee@gmail.com', 'Where terrorists are');

INSERT INTO public.users(
	first_name, last_name, email, billing_address)
	VALUES ('admin', 'admin', 'admin', 'admin');

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)
values(9781593275846,'Eloquent JavaScript, Second Edition',472,'JavaScript lies at the heart of almost every modern web application, from social apps to the newest browser-based games. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.','oreilly@gmail.com',14.79,'Non-Fiction Computer';

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)

values(9781449331818,'Learning JavaScript Design Patterns',254,'With Learning JavaScript Design Patterns, you\'ll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.','oreilly@gmail.com',23.92,'Non-Fiction Computer';

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)

values(9781449365035,'Speaking JavaScript',460,'Like it or not, JavaScript is everywhere these days-from browser to server to mobile-and now you, too, need to learn the language or dive deeper than you have. This concise book guides you into and through JavaScript, written by a veteran programmer who once found himself in the same position.','oreilly@gmail.com',28.56,'Non-Fiction Computer';

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)

values(9781491950296,'Programming JavaScript Applications',254,'Take advantage of JavaScript\'s power to build robust web-scale or enterprise applications that are easy to extend and maintain. By applying the design patterns outlined in this practical book, experienced JavaScript developers will learn how to write flexible and resilient code that\'s easier-yes, easier-to work with as your code base grows.','oreilly@gmail.com',19.85,'Non-Fiction Computer';

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)

values(9781593277574,'Understanding ECMAScript 6',352,'ECMAScript 6 represents the biggest update to the core of JavaScript in the history of the language. In Understanding ECMAScript 6, expert developer Nicholas C. Zakas provides a complete guide to the object types, syntax, and other exciting changes that ECMAScript 6 brings to JavaScript.','oreilly@gmail.com',28.45,'Non-Fiction Computer';

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)

values(9781491904244,'You Don\'t Know JS',278,'No matter how much experience you have with JavaScript, odds are you don’t fully understand the language. As part of the "You Don’t Know JS" series, this compact guide focuses on new features available in ECMAScript 6 (ES6), the latest version of the standard upon which JavaScript is built.','oreilly@gmail.com',14.84,'Non-Fiction Computer';

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)

values(9781449325862,'Git Pocket Guide',234,'This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git experience.','oreilly@gmail.com',25.39,'Non-Fiction Computer';

insert into table books(isbn,title,author,nb_of_pages,summary,publisher,price,genre)

values(9781449337711,'Designing Evolvable Web APIs with ASP.NET',538,'Design and build Web APIs for a broad range of clients—including browsers and mobile devices—that can adapt to change over time. This practical, hands-on guide takes you through the theory and tools you need to build evolvable HTTP services with Microsoft’s ASP.NET Web API framework. In the process, you’ll learn how design and implement a real-world Web API.','oreilly@gmail.com',9.518,'Non-Fiction Computer';