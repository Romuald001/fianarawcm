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
        const { name, description, lat, lng, isFree, isAccessible, cleanLiness } = req.body;
        const t = await Toilet.create({
            name, description, lat, lng, isFree, isAccessible, cleanLiness,
            status: 'pending', createdBy: req.user.id
        });
        res.status(201).json(t);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};