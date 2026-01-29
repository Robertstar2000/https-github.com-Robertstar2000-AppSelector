import express from 'express';
import { db } from './db';
import { authRouter } from './auth';

const app = express();
const PORT = process.env.PORT || 3105;

app.use(express.json());

// Health Check
app.get('/health', async (req, res) => {
    try {
        // Simple query to verify DB connection
        await db.get('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

// Auth Routes
app.use('/auth', authRouter);

// API Routes Placeholder
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Enterprise Foundation Backend' });
});

// App Management Routes
app.get('/api/apps', async (req, res) => {
    try {
        const apps = await db.all('SELECT * FROM apps ORDER BY sort_order ASC');
        res.json(apps);
    } catch (error) {
        console.error('Error fetching apps:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/apps', async (req, res) => {
    const { id, name, description, iconName, status, type, url, owner, sourceUrl, backendPort, aiModel } = req.body;
    try {
        await db.run(
            `INSERT INTO apps (id, name, description, icon_name, status, type, url, owner, source_url, backend_port, ai_model) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, description, iconName, status, type, url, owner, sourceUrl, backendPort, aiModel]
        );
        res.status(201).json({ message: 'App created' });
    } catch (error) {
        console.error('Error creating app:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/apps/reorder', async (req, res) => {
    const { order } = req.body; // Array of app IDs in new order
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Invalid data' });

    try {
        await db.transaction(async () => {
            for (let i = 0; i < order.length; i++) {
                await db.run('UPDATE apps SET sort_order = ? WHERE id = ?', [i, order[i]]);
            }
        });
        res.json({ message: 'Order updated' });
    } catch (error) {
        console.error('Error reordering apps:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/apps/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, iconName, status, type, url, owner, sourceUrl, backendPort, aiModel } = req.body;
    try {
        await db.run(
            `UPDATE apps SET name=?, description=?, icon_name=?, status=?, type=?, url=?, owner=?, source_url=?, backend_port=?, ai_model=? WHERE id=?`,
            [name, description, iconName, status, type, url, owner, sourceUrl, backendPort, aiModel, id]
        );
        res.json({ message: 'App updated' });
    } catch (error) {
        console.error('Error updating app:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/apps/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM apps WHERE id = ?', [id]);
        res.json({ message: 'App deleted' });
    } catch (error) {
        console.error('Error deleting app:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database Dialect: ${process.env.POSTGRES_HOST ? 'Postgres' : 'SQLite'}`);
});
