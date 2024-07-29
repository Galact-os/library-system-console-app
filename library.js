const readline = require("readline");

class Library {
  constructor() {
    this.books = {};
  }

  addBook(title, copies = 1) {
    if (this.books[title]) {
      this.books[title] += copies;
    } else {
      this.books[title] = copies;
    }
  }

  viewBooks() {
    if (Object.keys(this.books).length === 0) {
      console.log("The library is empty.");
    } else {
      console.log("Books in the library:");
      for (let [title, copies] of Object.entries(this.books)) {
        console.log(`${title}: ${copies} copies`);
      }
    }
  }

  borrowBook(user, title) {
    if (user.borrowedBooks.length >= 2) {
      console.log("You have reached your borrowing limit of 2 books.");
      return;
    }

    if (this.books[title] && this.books[title] > 0) {
      this.books[title] -= 1;
      user.borrowedBooks.push(title);
      console.log(`You have borrowed "${title}".`);
      if (this.books[title] === 0) {
        delete this.books[title];
      }
    } else {
      console.log(`"${title}" is not available in the library.`);
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
      this.borrowedBooks.forEach((book) => console.log(book));
    }
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
        (title) => {
          library.borrowBook(user, title);
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
  library.addBook("The Great Gatsby", 3);
  library.addBook("1984", 2);
  library.addBook("To Kill a Mockingbird", 1);

  showMenu(rl, library, user);
}

module.exports = { Library, User, showMenu, handleMenu };
