var Book = function (title, time, type) {
    if (this instanceof Book) {
        this.title = title;
        this.time = time;
        this.type = type;
    } else {
        return new Book(title, time, type);
    }
};

var book = Book('JavascriptDesignPattern','2014','js');

console.log(book.title);