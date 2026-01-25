import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Governance Overrides & Email-First Sync Logic
// For this blueprint, we assume a simple user table: id, email, password_hash, role
// "Governance Overrides" likely refers to Admin privileges or forcing specific roles.

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        // Governance Override: First user is always admin? Or check specific domain?
        const role = email.endsWith('@tallmanequipment.com') ? 'admin' : 'user';

        await db.run('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, hash, role]);

        res.status(201).json({ message: 'User registered', role });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export const authRouter = router;
