/**
 * The Model handles the data logic of the application.
 * It is responsible for managing the contacts data, state, and interacting with the browser's LocalStorage.
 * It enforces rules on data manipulation and notifies the Controller when the data changes.
 */
class Model {
    constructor() {
        // Initialize an array of contacts.
        // It tries to fetch existing contacts from LocalStorage or defaults to an empty array.
        // JSON.parse converts the JSON string back into a JavaScript array of objects.
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    /**
     * Internal method to persist the contacts array to LocalStorage.
     * This ensures data survives page reloads.
     * JSON.stringify converts the JavaScript array to a JSON string.
     * 
     * @param {Array} contacts - The array of contact objects to save.
     */
    _commit(contacts) {
        // Log the state change (optional, helpful for debugging)
        console.log('Model._commit: Saving contacts to LocalStorage', contacts);
        
        // Save to LocalStorage using the key 'contacts'
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        // Notify the controller that the state has changed
        // This triggers the onContactListChanged callback if it's bound.
        if (this.onContactListChanged) {
            this.onContactListChanged(contacts);
        }
    }

    /**
     * Binds a callback function to the Model's state change event.
     * When contacts change, this callback will be executed, usually telling the View to re-render.
     * 
     * @param {Function} callback - The function to call when contacts are updated.
     */
    bindContactListChanged(callback) {
        this.onContactListChanged = callback;
    }

    /**
     * Creates a new contact and adds it to the list.
     * 
     * @param {string} name - The Full Name of the contact.
     * @param {string} email - The Email Address of the contact.
     * @param {string} phone - The Phone Number of the contact.
     */
    addContact(name, email, phone) {
        // Create a new contact object with a unique timestamp-based ID
        const contact = {
            id: Date.now().toString(), // Generate a unique ID
            name: name,
            email: email,
            phone: phone
        };

        // Add the new contact to the end of the contacts array
        this.contacts.push(contact);
        
        // Save the updated list to LocalStorage and trigger view update
        this._commit(this.contacts);
    }

    /**
     * Updates an existing contact based on its ID.
     * 
     * @param {string} id - The ID of the contact to update.
     * @param {string} updatedName - The new Full Name.
     * @param {string} updatedEmail - The new Email Address.
     * @param {string} updatedPhone - The new Phone Number.
     */
    editContact(id, updatedName, updatedEmail, updatedPhone) {
        // Map through the array and replace the matching contact with updated values
        this.contacts = this.contacts.map((contact) =>
            contact.id === id ? { 
                id: contact.id, // Preserve the original ID
                name: updatedName, 
                email: updatedEmail, 
                phone: updatedPhone 
            } : contact // Return unchanged contact if ID doesn't match
        );

        // Save the updated list to LocalStorage and trigger view update
        this._commit(this.contacts);
    }

    /**
     * Deletes a contact from the list based on its ID.
     * 
     * @param {string} id - The ID of the contact to remove.
     */
    deleteContact(id) {
        // Filter out the contact with the matching ID, keeping only those that don't match
        this.contacts = this.contacts.filter((contact) => contact.id !== id);

        // Save the filtered list to LocalStorage and trigger view update
        this._commit(this.contacts);
    }

    /**
     * Returns a specific contact by its ID.
     * Useful for populate the edit modal with current data.
     * 
     * @param {string} id - The ID of the contact to find.
     * @returns {Object|undefined} The contact object or undefined if not found.
     */
    getContactById(id) {
        return this.contacts.find((contact) => contact.id === id);
    }
}
