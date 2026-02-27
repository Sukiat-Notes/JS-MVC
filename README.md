# Modern Contact Manager (Vanilla JS MVC)

A modern, responsive Contact Management application built with Vanilla HTML, CSS, and JavaScript. It implements a clean Model-View-Controller (MVC) architecture and saves your data locally using your browser's `localStorage`.

## Features
- Full CRUD operations (Create, Read, Update, Delete contacts).
- Live search filtering by name, email, or phone.
- Data persistence across page reloads via `localStorage`.
- Modern Glassmorphism UI with micro-animations.
- Fully responsive design.
- No external JavaScript libraries or frameworks required.

---

## How to Compile / Build

Since this project is built entirely with **Vanilla Web Technologies** (standard HTML, standard CSS, and standard JavaScript), **there is no compilation or build step required.** The browser natively understands and executes all the code in this repository.

## How to Run the Application

You have two primary ways to run this application locally:

### Method 1: Open the HTML File Directly (Simplest)
1. Navigate to the project folder on your computer.
2. Double-click the `index.html` file.
3. It will open in your default web browser, and the application will be fully functional.

### Method 2: Use a Local Development Server (Recommended for Development)
If you want to make changes to the code and see them update automatically, using a local server is best. If you are using Visual Studio Code (VS Code):

1. Open this project folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions marketplace.
3. Right-click on `index.html` in your file explorer.
4. Select **"Open with Live Server"**.
5. Your default browser will open automatically (usually to `http://127.0.0.1:5500/index.html`), and the page will auto-refresh whenever you save code changes.

---

## Architecture Overview

This application adheres to the **MVC Design Pattern**:

1.  **Model (`js/Model.js`)**: Manages the application data. It defines the structure of a contact, handles all logic for adding, editing, deleting, and searching, and is entirely responsible for saving to and loading from the browser's `localStorage`.
2.  **View (`js/View.js`)**: Manages the visual interface. It caches DOM elements securely, listens for user events (like button clicks or form submissions), and updates the screen dynamically when the Controller provides new data.
3.  **Controller (`js/Controller.js`)**: Acts as the centralized brain. It connects the Model and the View. When a user interacts with the View, the View tells the Controller. The Controller updates the Model, and when the Model changes, the Controller tells the View to update the screen.
