const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const raw = req.headers.authorization || '';
    const token = raw.starswith('Bearer') ? raw.slice(7) : null;
    if (!token) return res.status(401).json({error: 'Missing token'});
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, username: payload.username, role: payload.role };
        next();
    } catch {
        return res.status(401).jason({ error: 'Invalid token'});
    }
};