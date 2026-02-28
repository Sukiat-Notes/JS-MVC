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
        this.model.bindContactListChanged(this.onContactListChanged);

        // ==========================================
        // INIT EVENT BINDINGS (View -> Controller -> Model)
        // ==========================================

        this.view.bindSaveContact(this.handleSaveContact);
        this.view.bindDeleteContact(this.handleDeleteContact);
        this.view.bindEditContact(this.handleGetContact);
        this.view.bindSearchContact(this.handleSearchContact);

        // ==========================================
        // INITIAL RENDER
        // ==========================================
        // Fetch contacts entirely asynchronously from the backend API.
        this.model.fetchContacts();
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
    handleSaveContact = async (id, name, email, phone) => {
        if (id) {
            await this.model.editContact(id, name, email, phone);
        } else {
            await this.model.addContact(name, email, phone);
        }

        // After save, clear the search input visually to show full list again
        this.view.searchInput.value = '';
    };

    /**
     * Handler attached to View's delete button click.
     * 
     * @param {string} id - The ID of contact to remove.
     */
    handleDeleteContact = async (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            await this.model.deleteContact(id);
        }
    };

    /**
     * Handler invoked when View needs contact data to populate the edit form.
     * 
     * @param {string} id - The ID of contact to lookup.
     * @returns {Object} The contact data object.
     */
    handleGetContact = (id) => {
        // Fetch specific contact data from Model (local state is fine here)
        return this.model.getContactById(id);
    };

    /**
     * Handler for live search filtering.
     * 
     * @param {string} searchTerm - Lowercase text from search input.
     */
    handleSearchContact = (searchTerm) => {
        const filteredContacts = this.model.contacts.filter(contact => {
            return contact.name.toLowerCase().includes(searchTerm) ||
                contact.email.toLowerCase().includes(searchTerm) ||
                contact.phone.includes(searchTerm);
        });

        this.view.displayContacts(filteredContacts);
    };
}
