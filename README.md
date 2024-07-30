# library-system-console-app

Execute command `node library.js` in the root directory of the project to run the app.

Design Decisions

The library system application is designed to be a simple console-based interface using Node.js and the readline module. It has two main classes:

    •	Library: Manages the collection of books, including adding, viewing, borrowing, and returning books.
    •	User: Manages the user’s borrowed books and provides methods to view them.

Separating the library and user responsibilities into distinct classes follows the single responsibility principle, making the application easier to maintain and expand. The menu handling logic is modular, allowing for easy addition of new features and options.

Assumptions

Several assumptions were made while developing this application:

    1.	Each book is uniquely identified by its title, with no duplicate titles.
    2.	Users have a borrowing limit of two books at any given time to ensure fair use of library resources.
    3.	Only one copy of a book can be borrowed by a user at any time, preventing duplicate entries in the user’s borrowed list.
    4.	The application assumes a console environment for user interaction.

Tests

The application includes Jest tests to check its functionality. These tests cover viewing books, borrowing books, returning books, and menu handling logic.
