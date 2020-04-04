

//Build an object containing keys/values representing question ids and selected answers respectively
//POST it to the /quiz route on the server
//Show alert and redirect to the URL the server tells us to when response comes back
function submit(){

    let obj = {book:book_info,isbn:book_info.isbn,email:user_info}

    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState===4 && this.status === 200){
            alert("Added to cart")
        }
    };
    req.open("POST", '/cart');
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(obj));
}

function remove(){

    let obj = {book:book_info,isbn:book_info.isbn}

    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState===4 && this.status === 200){
            alert("Removed from catalogue")
        }
    };
    req.open("POST", '/remove');
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(obj));
}

function placeOrder(){

    console.log(book_info);
    console.log(user_info);

    let obj = {book:book_info,isbn:book_info.isbn,email:user_info}

    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState===4 && this.status === 200){
            console.log(JSON.parse(req.responseText))
        }
    };
    req.open("POST", '/placeorder');
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(obj));
}