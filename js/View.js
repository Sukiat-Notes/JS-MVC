/**
 * The View manages the visual representation of the application (the UI).
 * It interacts directly with the DOM, listens to user events, and displays data provided by the Model.
 * The View doesn't know about the Model directly; it communicates via the Controller using event bindings.
 */
class View {
    constructor() {
        // ==========================================
        // UI ELEMENT CACHING
        // ==========================================

        // The root element containing the application
        this.app = document.querySelector('body');

        // The container holding the list of contacts
        this.contactList = document.getElementById('contact-list');

        // The empty state container shown when there are no contacts
        this.emptyState = document.getElementById('empty-state');

        // Search
        this.searchInput = document.getElementById('search-input');

        // Modal Elements
        this.modalOverlay = document.getElementById('contact-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.contactForm = document.getElementById('contact-form');

        // Form Inputs
        // Cache the form inputs so we can easily read/write their values
        this.inputId = document.getElementById('contact-id');
        this.inputName = document.getElementById('contact-name');
        this.inputEmail = document.getElementById('contact-email');
        this.inputPhone = document.getElementById('contact-phone');

        // Buttons
        this.addContactBtn = document.getElementById('add-contact-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.cancelBtn = document.getElementById('cancel-btn');


        // ==========================================
        // EVENT LISTENERS (UI purely)
        // ==========================================
        // These listeners handle visual changes like opening/closing the modal.

        // Open modal to add a new contact
        this.addContactBtn.addEventListener('click', () => {
            this.openModal('Add Contact');
            this._resetForm();
        });

        // Close modal via 'X' button
        this.closeModalBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal via Cancel button
        this.cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal by clicking outside the modal content (on the overlay)
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });
    }

    // ==========================================
    // UI HELPER METHODS
    // ==========================================

    /**
     * Opens the modal overlay and sets its title string.
     * @param {string} titleString - "Add Contact" or "Edit Contact"
     */
    openModal(titleString) {
        this.modalTitle.textContent = titleString;
        this.modalOverlay.classList.add('active'); // Add animation/display class
        this.inputName.focus(); // Focus the first input for better UX
    }

    /**
     * Closes the modal by removing the 'active' class.
     */
    closeModal() {
        this.modalOverlay.classList.remove('active');
        this._resetForm(); // Clear the form when closing
    }

    /**
     * Internal helper to clear all form input fields.
     */
    _resetForm() {
        this.inputId.value = '';
        this.inputName.value = '';
        this.inputEmail.value = '';
        this.inputPhone.value = '';
    }

    /**
     * Safely creates a DOM element with optional classes.
     * Prevents XSS attacks by not using innerHTML for text content where possible.
     * 
     * @param {string} tag - HTML tag name (e.g., 'div', 'span').
     * @param {string} classes - Optional space-separated class names.
     * @returns {HTMLElement} The created DOM node.
     */
    createElement(tag, classes) {
        const element = document.createElement(tag);
        if (classes) {
            // Split by space and add multiple classes efficiently
            element.classList.add(...classes.split(' '));
        }
        return element;
    }

    /**
     * Helper to get the initials from a full name to display in the avatar circle.
     * @param {string} name 
     * @returns {string} 1 or 2 uppercase letters.
     */
    _getInitials(name) {
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }

    // ==========================================
    // CORE RENDER METHOD
    // ==========================================

    /**
     * Displays a list of contacts on the screen.
     * It clears the existing list and loops through the contacts data to recreate the DOM elements.
     * 
     * @param {Array} contacts - The array of contact objects to render.
     */
    displayContacts(contacts) {
        // Clear the current list entirely
        this.contactList.innerHTML = '';

        // Handle the empty state UI
        if (contacts.length === 0) {
            // No contacts, show empty state message, hide the unordered list
            this.contactList.classList.add('hidden');
            this.emptyState.classList.remove('hidden');
        } else {
            // Contacts exist, hide empty state, show the unordered list
            this.contactList.classList.remove('hidden');
            this.emptyState.classList.add('hidden');

            // Iterate over each contact object in the array to build its DOM representation
            contacts.forEach((contact) => {
                // Outer container for a single contact: <li class="contact-item">...</li>
                const li = this.createElement('li', 'contact-item');
                li.id = contact.id; // Assign ID to the DOM element for easier access later

                // Left Section: Avatar + Details
                const contactInfo = this.createElement('div', 'contact-info');

                // Avatar Circle
                const avatar = this.createElement('div', 'contact-avatar');
                avatar.textContent = this._getInitials(contact.name);

                // Text Details Container
                const details = this.createElement('div', 'contact-details');

                // Name Text
                const name = this.createElement('h3');
                name.textContent = contact.name;

                // Email Text with Icon
                const email = this.createElement('p');
                email.innerHTML = `<i class='bx bx-envelope'></i> ${contact.email}`;

                // Phone Text with Icon
                const phone = this.createElement('p');
                phone.innerHTML = `<i class='bx bx-phone'></i> ${contact.phone}`;

                // Append text nodes to details container
                details.append(name, email, phone);
                // Append avatar and details to contactInfo container
                contactInfo.append(avatar, details);

                // Right Section: Action Buttons (Edit/Delete)
                const actions = this.createElement('div', 'contact-actions');

                // Edit Button
                const editBtn = this.createElement('button', 'icon-btn edit');
                editBtn.innerHTML = "<i class='bx bx-edit-alt'></i>";
                editBtn.setAttribute('data-id', contact.id); // Store ID in data attribute

                // Delete Button
                const deleteBtn = this.createElement('button', 'icon-btn delete');
                deleteBtn.innerHTML = "<i class='bx bx-trash'></i>";
                deleteBtn.setAttribute('data-id', contact.id); // Store ID in data attribute

                // Append buttons to actions container
                actions.append(editBtn, deleteBtn);

                // Assemble the complete contact List Item component
                li.append(contactInfo, actions);

                // Add the completed item to the unordered list on the page
                this.contactList.append(li);
            });
        }
    }


    // ==========================================
    // BINDING EVENTS TO CONTROLLER
    // ==========================================

    /**
     * Binds the 'Add Contact' or 'Edit Contact' event to the Controller.
     * It listens for the form submit event, prevents default page reload,
     * extracts data, and calls the appropriate handler based on presence of ID.
     * 
     * @param {Function} handler - The Controller's function to execute when saving.
     */
    bindSaveContact(handler) {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop HTML form from submitting to server

            // Extract values from input fields
            const id = this.inputId.value; // Empty string if adding, populated if editing
            const name = this.inputName.value;
            const email = this.inputEmail.value;
            const phone = this.inputPhone.value;

            // Only proceed if required fields have data
            if (name && email && phone) {
                // Pass the data to the Controller
                handler(id, name, email, phone);
                // Close modal and reset form after saving
                this.closeModal();
            }
        });
    }

    /**
     * Binds the 'Delete' event.
     * Since buttons are recreated dynamically on render, we attach a single listener
     * to the parent list container (Event Delegation).
     * 
     * @param {Function} handler - The Controller's function to execute when deleting.
     */
    bindDeleteContact(handler) {
        this.contactList.addEventListener('click', (e) => {
            // Find if the clicked element or its parent is the delete button
            const deleteBtn = e.target.closest('.delete');

            // If the delete button was indeed clicked
            if (deleteBtn) {
                // Grab the ID stored in the data attribute
                const id = deleteBtn.getAttribute('data-id');
                // Call the controller's logic
                handler(id);
            }
        });
    }

    /**
     * Binds the 'Edit' event to populate the form.
     * Uses Event Delegation similar to delete.
     * 
     * @param {Function} handler - A function that fetches the contact and returns it.
     */
    bindEditContact(handler) {
        this.contactList.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit');

            if (editBtn) {
                const id = editBtn.getAttribute('data-id');

                // Get the current contact data via the provided handler
                const contact = handler(id);

                // If contact exists, populate the modal fields with current data
                if (contact) {
                    this.inputId.value = contact.id;
                    this.inputName.value = contact.name;
                    this.inputEmail.value = contact.email;
                    this.inputPhone.value = contact.phone;

                    // Show modal set to Edit Mode
                    this.openModal('Edit Contact');
                }
            }
        });
    }

    /**
     * Binds the Search input 'keyup' event for filtering contacts.
     * @param {Function} handler - The Controller's search logic.
     */
    bindSearchContact(handler) {
        this.searchInput.addEventListener('input', (e) => {
            // Get text, make lowercase for case-insensitive search
            const searchTerm = e.target.value.toLowerCase().trim();
            handler(searchTerm);
        });
    }
}
