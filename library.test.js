const { Library, User, showMenu, handleMenu } = require("./library");
const readline = require("readline");

jest.mock("readline");

describe("Library System", () => {
  let library;
  let user;
  let rl;

  beforeEach(() => {
    library = new Library();
    user = new User("Alice");
    library.addBook("The Great Gatsby", 3);
    library.addBook("1984", 2);
    library.addBook("To Kill a Mockingbird", 1);

    console.log = jest.fn(); // Mock console.log

    rl = {
      question: jest.fn(),
      close: jest.fn(),
    };

    readline.createInterface.mockReturnValue(rl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should view books in the library", () => {
    library.viewBooks();
    expect(console.log).toHaveBeenCalledWith("Books in the library:");
    expect(console.log).toHaveBeenCalledWith("The Great Gatsby: 3 copies");
    expect(console.log).toHaveBeenCalledWith("1984: 2 copies");
    expect(console.log).toHaveBeenCalledWith("To Kill a Mockingbird: 1 copies");
  });

  test("should show an empty library", () => {
    const emptyLibrary = new Library();
    emptyLibrary.viewBooks();
    expect(console.log).toHaveBeenCalledWith("The library is empty.");
  });

  test("should borrow a book from the library", () => {
    library.borrowBook(user, "1984");
    expect(console.log).toHaveBeenCalledWith('You have borrowed "1984".');
    user.viewBorrowedBooks();
    expect(console.log).toHaveBeenCalledWith("Your borrowed books:");
    expect(console.log).toHaveBeenCalledWith("1984");
    library.viewBooks();
    expect(console.log).toHaveBeenCalledWith("Books in the library:");
    expect(console.log).toHaveBeenCalledWith("The Great Gatsby: 3 copies");
    expect(console.log).toHaveBeenCalledWith("1984: 1 copies");
    expect(console.log).toHaveBeenCalledWith("To Kill a Mockingbird: 1 copies");
  });

  test("should not borrow more than 2 books", () => {
    library.borrowBook(user, "1984");
    library.borrowBook(user, "The Great Gatsby");
    library.borrowBook(user, "To Kill a Mockingbird");
    expect(console.log).toHaveBeenCalledWith(
      "You have reached your borrowing limit of 2 books."
    );
  });

  test("should return a borrowed book to the library", () => {
    library.borrowBook(user, "1984");
    library.returnBook(user, "1984");
    expect(console.log).toHaveBeenCalledWith('You have returned "1984".');
    user.viewBorrowedBooks();
    expect(console.log).toHaveBeenCalledWith("You have no borrowed books.");
    library.viewBooks();
    expect(console.log).toHaveBeenCalledWith("Books in the library:");
    expect(console.log).toHaveBeenCalledWith("The Great Gatsby: 3 copies");
    expect(console.log).toHaveBeenCalledWith("1984: 2 copies");
    expect(console.log).toHaveBeenCalledWith("To Kill a Mockingbird: 1 copies");
  });

  test("should not return a book that was not borrowed", () => {
    library.returnBook(user, "1984");
    expect(console.log).toHaveBeenCalledWith('You have not borrowed "1984".');
  });

  test("should not borrow a non-existing book", () => {
    library.borrowBook(user, "Non-existing Book");
    expect(console.log).toHaveBeenCalledWith(
      '"Non-existing Book" is not available in the library.'
    );
  });

  test("should handle menu options correctly", () => {
    // Mock the responses for the readline questions
    rl.question
      .mockImplementationOnce((query, callback) => callback("1"))
      .mockImplementationOnce((query, callback) => callback("2"))
      .mockImplementationOnce((query, callback) => callback("3"))
      .mockImplementationOnce((query, callback) => callback("4"))
      .mockImplementationOnce((query, callback) => callback("5"));

    handleMenu("1", rl, library, user);
    expect(console.log).toHaveBeenCalledWith("Books in the library:");

    handleMenu("2", rl, library, user);
    expect(rl.question).toHaveBeenCalledWith(
      "Enter the title of the book you want to borrow: ",
      expect.any(Function)
    );

    handleMenu("3", rl, library, user);
    expect(rl.question).toHaveBeenCalledWith(
      "Enter the title of the book you want to return: ",
      expect.any(Function)
    );

    handleMenu("4", rl, library, user);
    expect(console.log).toHaveBeenCalledWith("You have no borrowed books.");

    handleMenu("5", rl, library, user);
    expect(rl.close).toHaveBeenCalled();
  });
});
