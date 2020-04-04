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
    amount_paid numeric(10,2),
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
    date_of_purchase date NOT NULL DEFAULT CURRENT_DATE,
    shipping_address character varying(20) COLLATE pg_catalog."default" NOT NULL,
    method_of_payment character varying(15) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
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