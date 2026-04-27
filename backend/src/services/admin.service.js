const database = require('../config/database');
const { isPasswordStrong, PASSWORD_MIN } = require('../validators/auth.validator');

class ServiceError extends Error {
    constructor(message, status = 400, code = 'BAD_REQUEST') {
        super(message);
        this.status = status;
        this.code = code;
        this.expose = true;
    }
}

function getModel() {
    if (!database.isEnabled()) {
        throw new ServiceError('Database non configurato', 503, 'DB_DISABLED');
    }
    return require('../models/admin.model');
}

async function listAdmins() {
    const Admin = getModel();
    const admins = await Admin.find().sort({ createdAt: -1 });
    return admins.map(a => a.toSafeJSON());
}

async function findOrThrow(id) {
    const Admin = getModel();
    const admin = await Admin.findById(id).select('+passwordHash');
    if (!admin) throw new ServiceError('Utente non trovato', 404, 'NOT_FOUND');
    return admin;
}

async function createAdmin({ username, password, role = 'admin' }) {
    const Admin = getModel();

    if (!isPasswordStrong(password)) {
        throw new ServiceError(
            `La password non rispetta i requisiti (min ${PASSWORD_MIN} caratteri, maiuscole, minuscole, numeri, carattere speciale)`,
            400,
            'WEAK_PASSWORD'
        );
    }

    const existing = await Admin.findOne({ username: username.toLowerCase() });
    if (existing) {
        throw new ServiceError('Username già in uso', 409, 'DUPLICATE_USERNAME');
    }

    const passwordHash = await Admin.hashPassword(password);
    const admin = await Admin.create({
        username: username.toLowerCase().trim(),
        passwordHash,
        role
    });
    return admin.toSafeJSON();
}

async function countSuperadmins(excludeId = null) {
    const Admin = getModel();
    const filter = { role: 'superadmin', active: true };
    if (excludeId) filter._id = { $ne: excludeId };
    return Admin.countDocuments(filter);
}

async function updateAdmin(id, { username, role, active }, currentAdminId) {
    const admin = await findOrThrow(id);

    const isSelf = admin._id.toString() === currentAdminId.toString();

    if (username !== undefined && username !== admin.username) {
        const Admin = getModel();
        const taken = await Admin.findOne({ username: username.toLowerCase(), _id: { $ne: admin._id } });
        if (taken) throw new ServiceError('Username già in uso', 409, 'DUPLICATE_USERNAME');
        admin.username = username.toLowerCase().trim();
    }

    if (role !== undefined && role !== admin.role) {
        // Non rimuovere l'ultimo superadmin attivo
        if (admin.role === 'superadmin' && role !== 'superadmin') {
            const others = await countSuperadmins(admin._id);
            if (others === 0) {
                throw new ServiceError(
                    'Impossibile rimuovere il ruolo superadmin: deve esistere almeno un superadmin attivo',
                    400,
                    'LAST_SUPERADMIN'
                );
            }
        }
        admin.role = role;
    }

    if (active !== undefined && active !== admin.active) {
        if (isSelf && !active) {
            throw new ServiceError('Non puoi disattivare il tuo stesso account', 400, 'SELF_DEACTIVATE');
        }
        if (admin.role === 'superadmin' && !active) {
            const others = await countSuperadmins(admin._id);
            if (others === 0) {
                throw new ServiceError(
                    'Impossibile disattivare l\'ultimo superadmin attivo',
                    400,
                    'LAST_SUPERADMIN'
                );
            }
        }
        admin.active = active;
        // Reset blocco quando si riattiva
        if (active) {
            admin.failedAttempts = 0;
            admin.lockUntil = null;
        }
    }

    await admin.save();
    return admin.toSafeJSON();
}

async function resetPassword(id, newPassword) {
    const Admin = getModel();
    if (!isPasswordStrong(newPassword)) {
        throw new ServiceError(
            `La password non rispetta i requisiti (min ${PASSWORD_MIN} caratteri, maiuscole, minuscole, numeri, carattere speciale)`,
            400,
            'WEAK_PASSWORD'
        );
    }

    const admin = await findOrThrow(id);
    admin.passwordHash = await Admin.hashPassword(newPassword);
    admin.failedAttempts = 0;
    admin.lockUntil = null;
    await admin.save();
    return admin.toSafeJSON();
}

async function deleteAdmin(id, currentAdminId) {
    const admin = await findOrThrow(id);

    if (admin._id.toString() === currentAdminId.toString()) {
        throw new ServiceError('Non puoi eliminare il tuo stesso account', 400, 'SELF_DELETE');
    }

    if (admin.role === 'superadmin') {
        const others = await countSuperadmins(admin._id);
        if (others === 0) {
            throw new ServiceError(
                'Impossibile eliminare l\'ultimo superadmin attivo',
                400,
                'LAST_SUPERADMIN'
            );
        }
    }

    await admin.deleteOne();
    return { id: admin._id.toString() };
}

module.exports = {
    listAdmins,
    createAdmin,
    updateAdmin,
    resetPassword,
    deleteAdmin,
    ServiceError
};
