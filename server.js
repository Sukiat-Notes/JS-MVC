const http = require('http');
const mysql = require('mysql2');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'sa123',
    database: 'AntigravityMVC'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Keep connection alive or handle errors
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Successfully connected to MySQL database.');
    connection.release();
});

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 1. Handle CORS (Cross-Origin Resource Sharing)
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin for local dev
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 2. Parse URL and Route
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Helper to extract JSON body
    const getRequestBody = (req) => {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                } catch (error) {
                    reject(error);
                }
            });
            req.on('error', reject);
        });
    };

    // Helper to handle responses
    const sendResponse = (res, statusCode, data) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    // 3. API Routes for /api/contacts
    if (pathname === '/api/contacts') {

        // GET: Fetch all contacts
        if (req.method === 'GET') {
            pool.query('SELECT * FROM contacts', (err, results) => {
                if (err) {
                    return sendResponse(res, 500, { error: 'Database error fetching contacts' });
                }
                sendResponse(res, 200, results);
            });
        }

        // POST: Add a new contact
        else if (req.method === 'POST') {
            getRequestBody(req).then(data => {
                const { id, name, email, phone } = data; // the frontend generates an ID

                if (!id || !name || !email || !phone) {
                    return sendResponse(res, 400, { error: 'Missing required fields' });
                }

                const query = 'INSERT INTO contacts (id, name, email, phone) VALUES (?, ?, ?, ?)';
                pool.query(query, [id, name, email, phone], (err, results) => {
                    if (err) {
                        console.error('Insert error:', err);
                        return sendResponse(res, 500, { error: 'Error adding contact' });
                    }
                    sendResponse(res, 201, { message: 'Contact added successfully' });
                });
            }).catch(err => sendResponse(res, 400, { error: 'Invalid JSON body' }));
        }

        // Handle unsupported methods on /api/contacts
        else {
            sendResponse(res, 405, { error: 'Method not allowed' });
        }
    }

    // DELETE and PUT routes require an ID parameter.
    // E.g., /api/contacts/17234567890 (id is the timestamp string)
    else if (pathname.startsWith('/api/contacts/')) {
        const id = pathname.split('/').pop();

        if (!id) {
            return sendResponse(res, 400, { error: 'Contact ID required' });
        }

        // DELETE: Remove a contact by ID
        if (req.method === 'DELETE') {
            const query = 'DELETE FROM contacts WHERE id = ?';
            pool.query(query, [id], (err, results) => {
                if (err) {
                    console.error('Delete error:', err);
                    return sendResponse(res, 500, { error: 'Error deleting contact' });
                }
                if (results.affectedRows === 0) {
                    return sendResponse(res, 404, { error: 'Contact not found' });
                }
                sendResponse(res, 200, { message: 'Contact deleted successfully' });
            });
        }

        // PUT: Update a contact by ID
        else if (req.method === 'PUT') {
            getRequestBody(req).then(data => {
                const { name, email, phone } = data;

                if (!name || !email || !phone) {
                    return sendResponse(res, 400, { error: 'Missing required fields' });
                }

                const query = 'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?';
                pool.query(query, [name, email, phone, id], (err, results) => {
                    if (err) {
                        console.error('Update error:', err);
                        return sendResponse(res, 500, { error: 'Error updating contact' });
                    }
                    if (results.affectedRows === 0) {
                        return sendResponse(res, 404, { error: 'Contact not found' });
                    }
                    sendResponse(res, 200, { message: 'Contact updated successfully' });
                });
            }).catch(err => sendResponse(res, 400, { error: 'Invalid JSON body' }));
        }

        // Handle unsupported methods on specific contact
        else {
            sendResponse(res, 405, { error: 'Method not allowed' });
        }
    }

    // 404 Not Found for any other route
    else {
        sendResponse(res, 404, { error: 'Endpoint not found' });
    }
});

server.listen(PORT, () => {
    console.log(`Vanilla Node.js Server running on port ${PORT}`);
});
