#!/usr/bin/env node
/**
 * Crea il primo utente admin.
 *
 * Uso:
 *   - Con variabili d'ambiente (consigliato):
 *       ADMIN_USERNAME=mario ADMIN_PASSWORD='Str0ngP@ss!' npm run seed:admin
 *   - Da dentro un container:
 *       docker-compose exec backend npm run seed:admin
 *
 * Se l'utente esiste già, lo script termina senza modificare nulla
 * (a meno di passare ADMIN_FORCE_RESET=true per resettare la password).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const database = require('../src/config/database');
const Admin = require('../src/models/admin.model');
const { isPasswordStrong, PASSWORD_MIN } = require('../src/validators/auth.validator');

async function run() {
    const username = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || '';
    const role = process.env.ADMIN_ROLE || 'superadmin';
    const force = String(process.env.ADMIN_FORCE_RESET || '').toLowerCase() === 'true';

    if (!username || username.length < 3) {
        console.error('❌ ADMIN_USERNAME mancante o troppo corto (min 3 caratteri)');
        process.exit(1);
    }
    if (!isPasswordStrong(password)) {
        console.error(`❌ ADMIN_PASSWORD non rispetta i requisiti di sicurezza:`);
        console.error(`   - almeno ${PASSWORD_MIN} caratteri`);
        console.error('   - almeno una maiuscola, una minuscola, una cifra e un carattere speciale');
        process.exit(1);
    }
    if (!config.mongo.uri) {
        console.error('❌ MONGO_URI non configurata');
        process.exit(1);
    }

    await database.connect();

    const existing = await Admin.findOne({ username });

    if (existing && !force) {
        console.log(`⚠️  Utente "${username}" già esistente. Usa ADMIN_FORCE_RESET=true per resettarne la password.`);
        await mongoose.disconnect();
        return;
    }

    const passwordHash = await Admin.hashPassword(password);

    if (existing && force) {
        existing.passwordHash = passwordHash;
        existing.role = role;
        existing.active = true;
        existing.failedAttempts = 0;
        existing.lockUntil = null;
        await existing.save();
        console.log(`✅ Password di "${username}" resettata (role: ${role})`);
    } else {
        await Admin.create({ username, passwordHash, role });
        console.log(`✅ Admin "${username}" creato (role: ${role})`);
    }

    await mongoose.disconnect();
}

run().catch(async err => {
    console.error('❌ Errore seed admin:', err);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
});
