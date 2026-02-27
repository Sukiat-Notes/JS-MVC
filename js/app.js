/**
 * Entry point for the Vanilla JS MVC Application.
 * 
 * We use an event listener for DOMContentLoaded to assure that the 
 * script doesn't execute until the full HTML document has been parsed 
 * and loaded by the browser. This prevents errors where the View tries
 * to access DOM elements that don't exist yet.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantiate the Model (deals with data and localstorage)
    const appModel = new Model();

    // 2. Instantiate the View (deals with DOM and UI interactions)
    const appView = new View();

    // 3. Instantiate the Controller, connecting Model and View
    // The Controller immediately runs an initial render fetching data from Model and passing to View.
    const appController = new Controller(appModel, appView);

    // Optional debug log
    console.log('MVC App successfully initialized.');
});
