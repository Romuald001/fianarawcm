const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import des routes
const userRoutes = require('./routes/UserRoutes');
const toiletRoutes = require('./routes/ToiletRoutes');

// routes
app.use('/api/users', userRoutes);
app.use('/api/toilets', toiletRoutes);

// 1) Test explicite de connexion
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connecté avec succès');

        // 2) Synchronisation des modèles -> tables
        await sequelize.sync({ force : true});
        console.log('🗂️  Modèles synchronisés');

        // 3) Lancement serveur
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
    } catch (err) {
        console.error('❌ Échec connexion/sync MySQL:', err.message);
        process.exit(1);
    }
})();