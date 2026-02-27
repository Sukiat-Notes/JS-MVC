/**
 * The Controller bridges the Model and the View.
 * It translates user interactions from the View into actions on the Model,
 * and passes the updated data or state back to the View for rendering.
 */
class Controller {
    /**
     * @param {Model} model - The application Model instance.
     * @param {View} view - The application View instance.
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // ==========================================
        // INIT DATA FLOW (Model -> View)
        // ==========================================

        // Define what happens when the Model's data changes.
        // We tell the Model: "Whenever the contacts array changes, call this Controller method."
        // We use arrow function to preserve `this` context binding to the Controller.
        this.model.bindContactListChanged(this.onContactListChanged);

        // ==========================================
        // INIT EVENT BINDINGS (View -> Controller -> Model)
        // ==========================================

        // Tell the View: "When user submits the form, execute handleSaveContact."
        this.view.bindSaveContact(this.handleSaveContact);

        // Tell the View: "When user clicks delete icon, execute handleDeleteContact."
        this.view.bindDeleteContact(this.handleDeleteContact);

        // Tell the View: "When user clicks edit icon, get data via handleEditContact."
        this.view.bindEditContact(this.handleGetContact);

        // Tell the View: "When user types in search bar, execute handleSearchContact."
        this.view.bindSearchContact(this.handleSearchContact);

        // ==========================================
        // INITIAL RENDER
        // ==========================================
        // Force an initial render to display contacts loaded from LocalStorage on page load.
        this.onContactListChanged(this.model.contacts);
    }

    /**
     * Callback triggered by the Model when contacts are updated (added/edited/deleted).
     * It instructs the View to re-render the list with the fresh data.
     * 
     * @param {Array} contacts - The latest contacts array from the Model.
     */
    onContactListChanged = (contacts) => {
        // Pass data to View to update DOM
        this.view.displayContacts(contacts);
    };

    /**
     * Handler attached to View's form submission.
     * Checks if ID is present. If yes -> Edit, If no -> Add.
     * 
     * @param {string} id - Contact ID (empty if creating new).
     * @param {string} name - Contact Name.
     * @param {string} email - Contact Email.
     * @param {string} phone - Contact Phone.
     */
    handleSaveContact = (id, name, email, phone) => {
        if (id) {
            // Edit existing
            this.model.editContact(id, name, email, phone);
        } else {
            // Create new
            this.model.addContact(name, email, phone);
        }

        // After save, clear the search input visually to show full list again
        this.view.searchInput.value = '';
    };

    /**
     * Handler attached to View's delete button click.
     * 
     * @param {string} id - The ID of contact to remove.
     */
    handleDeleteContact = (id) => {
        // Optionally add a small confirmation dialogue before deleting
        if (confirm('Are you sure you want to delete this contact?')) {
            this.model.deleteContact(id);
        }
    };

    /**
     * Handler invoked when View needs contact data to populate the edit form.
     * 
     * @param {string} id - The ID of contact to lookup.
     * @returns {Object} The contact data object.
     */
    handleGetContact = (id) => {
        // Fetch specific contact data from Model
        return this.model.getContactById(id);
    };

    /**
     * Handler for live search filtering.
     * 
     * @param {string} searchTerm - Lowercase text from search input.
     */
    handleSearchContact = (searchTerm) => {
        // Filter the model's array directly based on name, email, or phone
        const filteredContacts = this.model.contacts.filter(contact => {
            return contact.name.toLowerCase().includes(searchTerm) ||
                contact.email.toLowerCase().includes(searchTerm) ||
                contact.phone.includes(searchTerm);
        });

        // Tell View to render only the filtered results (bypassing normal render cycle)
        // We don't save this to Model, it's just a temporary View state.
        this.view.displayContacts(filteredContacts);
    };
}
