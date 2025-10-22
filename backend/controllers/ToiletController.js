const { Toilet , User } = require('../models');
const { Op } = require('sequelize');

// Public: les listes seulement approuver
exports.listApproved = async (req, res) => {
    try {
        const toilets = await Toilet.findAll({
            where: { status: 'approved'},
            include: { model: User, attributes: ['id', 'username'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(toilets);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Auth ( user, moderator, admin ): creer -> pending
exports.createdPending = async (req, res) => {
    try{
        const { name, description, lat, lng, isFree, isAccessible, cleanliness } = req.body;
        const t = await Toilet.create({
            name, description, lat, lng, isFree, isAccessible, cleanliness,
            status: 'pending', createdBy: req.user.id
        });
        res.status(201).json(t);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Admin/mod: voir pending
exports.listPending = async (req, res) => {
    try {
        const q = await Toilet.findAll({
            where: {status: 'pending'},
            include: {model: User, attributes: ['id', 'username'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(q);
    } catch (e) {
        res.status(500).json({ error: e.message});
    }
};

// Admin/mod: approuver
exports.approve = async (req, res) => {
    try {
        const t = await Toilet.findByPk(req.params.id);
        if (!t) return res.status(404).json({ error: 'Not found'});
        t.status = 'approved';
        await t.save();
        res.json(t);
    } catch (e) {
        res.status(500).json({ error: e.message});
    }
};

// Admin/mod: rejeter
exports.reject = async (req, res) => {
    try {
        const t = await Toilet.findByPk(req.params.id);
        if (!t) return res.status(404).json({ error: 'not found'});
        t.status = 'rejected';
        await t.save();
        res.json(t);
    } catch (e) {
        res.status(500).json({ error: e.message});
    }
};

