/**
 * The Model handles the data logic of the application.
 * It is responsible for managing the contacts data, state, and interacting with the backend API.
 * It enforces rules on data manipulation and notifies the Controller when the data changes.
 */
class Model {
    constructor() {
        // Initialize an empty array of contacts.
        this.contacts = [];
        this.apiUrl = 'http://localhost:3000/api/contacts';
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
     * Internal method to trigger the view update callback.
     */
    _commit() {
        if (this.onContactListChanged) {
            this.onContactListChanged(this.contacts);
        }
    }

    /**
     * Fetches all contacts from the backend API.
     */
    async fetchContacts() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data = await response.json();
            this.contacts = data;
            this._commit();
        } catch (error) {
            console.error('Model: Error fetching contacts:', error);
            // Optionally could trigger an error state in view
        }
    }

    /**
     * Creates a new contact and adds it to the list via the API.
     * 
     * @param {string} name - The Full Name of the contact.
     * @param {string} email - The Email Address of the contact.
     * @param {string} phone - The Phone Number of the contact.
     */
    async addContact(name, email, phone) {
        const contact = {
            id: Date.now().toString(), // Generate a unique ID (frontend generated for simplicity)
            name: name,
            email: email,
            phone: phone
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });

            if (!response.ok) throw new Error('Failed to add contact');

            // Add to local state after successful API call
            this.contacts.push(contact);
            this._commit();
        } catch (error) {
            console.error('Model: Error adding contact:', error);
        }
    }

    /**
     * Updates an existing contact via the API.
     * 
     * @param {string} id - The ID of the contact to update.
     * @param {string} updatedName - The new Full Name.
     * @param {string} updatedEmail - The new Email Address.
     * @param {string} updatedPhone - The new Phone Number.
     */
    async editContact(id, updatedName, updatedEmail, updatedPhone) {
        const updatedContact = {
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone
        };

        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedContact)
            });

            if (!response.ok) throw new Error('Failed to edit contact');

            // Update local state after successful API call
            this.contacts = this.contacts.map((contact) =>
                contact.id === id ? {
                    id: contact.id,
                    ...updatedContact
                } : contact
            );

            this._commit();
        } catch (error) {
            console.error('Model: Error editing contact:', error);
        }
    }

    /**
     * Deletes a contact via the API.
     * 
     * @param {string} id - The ID of the contact to remove.
     */
    async deleteContact(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete contact');

            // Remove from local state after successful API call
            this.contacts = this.contacts.filter((contact) => contact.id !== id);
            this._commit();
        } catch (error) {
            console.error('Model: Error deleting contact:', error);
        }
    }

    /**
     * Returns a specific contact by its ID from local state.
     * Useful for populating the edit modal with current data.
     * 
     * @param {string} id - The ID of the contact to find.
     * @returns {Object|undefined} The contact object or undefined if not found.
     */
    getContactById(id) {
        return this.contacts.find((contact) => contact.id === id);
    }
}
