CREATE FUNCTION public.check_pub()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
if exists(select publisher_name from publishers
where publisher_name = new.publisher)
then return new;
else 
return null;
end if;
END;
$BODY$;

CREATE FUNCTION public.insert_published_by()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
INSERT INTO published_by(isbn,publisher_email) values(new.isbn,new.publisher);
return null;
END;$BODY$;

CREATE FUNCTION public.inv_update_newbook()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
INSERT INTO inventory values(new.isbn,30);
return null;
END;$BODY$;

CREATE FUNCTION public.inv_update_neworder()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$begin

update inventory
set qty_in_stock = qty_in_stock - new.qty
where isbn = new.isbn;
return null;
end;$BODY$;

CREATE FUNCTION public.restock()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$begin

update inventory
set qty_in_stock = qty_in_stock + 15
where isbn = new.isbn;
return null;

end;$BODY$;