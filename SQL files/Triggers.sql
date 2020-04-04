CREATE TRIGGER check_pub
    BEFORE INSERT
    ON public.books
    FOR EACH ROW
    EXECUTE PROCEDURE public.check_pub();

CREATE TRIGGER insert_published_by
    AFTER INSERT
    ON public.books
    FOR EACH ROW
    EXECUTE PROCEDURE public.insert_published_by();

CREATE TRIGGER newbook
    AFTER INSERT
    ON public.books
    FOR EACH ROW
    EXECUTE PROCEDURE public.inv_update_newbook();

CREATE TRIGGER restock_trigger
    AFTER UPDATE 
    ON public.inventory
    FOR EACH ROW
    WHEN ((new.qty_in_stock < (10)::numeric))
    EXECUTE PROCEDURE public.restock();

CREATE TRIGGER new_order_trigger
    AFTER INSERT
    ON public.order_details
    FOR EACH ROW
    EXECUTE PROCEDURE public.inv_update_neworder();