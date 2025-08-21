const { User } = require('../models');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            username, 
            email, 
            password: hashed, 
            role: 'user'        
        });
        res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};