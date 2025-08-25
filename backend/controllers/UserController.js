const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials'});

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role, }, process.env.JWT_SECRET, { expriresIn: '1d'});
        res.json({ token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};