const readline = require("readline");

class Book {
  constructor(name, copies, author) {
    this.bookName = name;
    this.copies = copies;
    this.author = author;
  }
}

class Library {
  constructor() {
    this.books = {};
  }

  addBook(title, copies = 1, author = undefined) {
    let newBook = new Book(title, copies, author);

    let uniqueId = Object.entries(this.books).length + 1;

    this.books[uniqueId] = {
      bookName: newBook.bookName,
      copies: newBook.copies,
      author: newBook.author,
    };

    console.log(this.books);
  }

  viewBooks() {
    if (Object.keys(this.books).length === 0) {
      console.log("The library is empty.");
    } else {
      console.log("Books in the library:");
      console.log(Object.entries(this.books));
      Object.entries(this.books).forEach(([uniqueId, bookObj], indx) => {
        console.log(
          `Id:${uniqueId} ----- ${bookObj.bookName}, ${bookObj.copies} copies, ${bookObj.author} Author`
        );
      });
    }
  }

  borrowBook(user, bookId) {
    if (user.borrowedBooks.length >= 2) {
      console.log("You have reached your borrowing limit of 2 books.");
      return;
    }

    if (this.books[bookId] && this.books[bookId].copies > 0) {
      this.books[bookId].copies -= 1;
      user.addBookToUserCollection(bookId, this.books[bookId]);
      console.log(`You have borrowed "${this.books[bookId].bookName}".`);
      if (this.books[bookId].copies === 0) {
        delete this.books[bookId];
      }
    } else {
      console.log(
        `"${this.books[bookId].bookName}" is not available in the library.`
      );
    }
  }

  returnBook(user, title) {
    const bookIndex = user.borrowedBooks.indexOf(title);
    if (bookIndex > -1) {
      user.borrowedBooks.splice(bookIndex, 1);
      this.addBook(title);
      console.log(`You have returned "${title}".`);
    } else {
      console.log(`You have not borrowed "${title}".`);
    }
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.borrowedBooks = [];
  }

  viewBorrowedBooks() {
    if (this.borrowedBooks.length === 0) {
      console.log("You have no borrowed books.");
    } else {
      console.log("Your borrowed books:");
      this.borrowedBooks.forEach((book) =>
        console.log(`${book.bookUnuqieId}: ${book.description}`)
      );
    }
  }

  addBookToUserCollection(bookUnuqieId, bookObj) {
    this.borrowedBooks.push({
      bookUnuqieId,
      description: `${bookObj.bookName}, ${bookObj.author}`,
    });
    console.log("boorowedBook", this.borrowedBooks);
  }
}

function showMenu(rl, library, user) {
  console.log(
    "\n ************************************************************"
  );
  console.log("\nMenu:");
  console.log("1. View books in library");
  console.log("2. Borrow a book");
  console.log("3. Return a book");
  console.log("4. View my borrowed books");
  console.log("5. Exit");
  rl.question("Choose an option: ", (option) =>
    handleMenu(option, rl, library, user)
  );
  console.log("\n ");
}

function handleMenu(option, rl, library, user) {
  switch (option) {
    case "1":
      library.viewBooks();
      showMenu(rl, library, user);
      break;
    case "2":
      rl.question(
        "Enter the title of the book you want to borrow: ",
        (bookId) => {
          library.borrowBook(user, bookId);
          showMenu(rl, library, user);
        }
      );
      break;
    case "3":
      rl.question(
        "Enter the title of the book you want to return: ",
        (title) => {
          library.returnBook(user, title);
          showMenu(rl, library, user);
        }
      );
      break;
    case "4":
      user.viewBorrowedBooks();
      showMenu(rl, library, user);
      break;
    case "5":
      rl.close();
      break;
    default:
      console.log("Invalid option. Please choose again.");
      showMenu(rl, library, user);
      break;
  }
}

if (require.main === module) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const library = new Library();
  const user = new User("Alice");

  // Add some initial books to the library
  library.addBook("The Great Gatsby", 3, "chetan bhagat");
  library.addBook("1984", 2, "john maccallen");
  library.addBook("To Kill a Mockingbird", 1, "simon feck");
  library.addBook("1984", 2, "timon meccarthy");

  showMenu(rl, library, user);
}

module.exports = { Library, User, showMenu, handleMenu };
