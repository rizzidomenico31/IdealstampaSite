const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
            index: true
        },
        passwordHash: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ['superadmin', 'admin'],
            default: 'admin',
            required: true
        },
        active: { type: Boolean, default: true },
        lastLoginAt: { type: Date },
        lastLoginIp: { type: String },
        failedAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null }
    },
    { timestamps: true, collection: 'admins' }
);

adminSchema.virtual('isLocked').get(function () {
    return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

adminSchema.methods.verifyPassword = function (plain) {
    if (!this.passwordHash) return Promise.resolve(false);
    return bcrypt.compare(plain, this.passwordHash);
};

adminSchema.statics.hashPassword = function (plain) {
    return bcrypt.hash(plain, config.auth.bcryptRounds);
};

adminSchema.methods.registerFailedAttempt = async function () {
    const max = config.auth.lockout.maxAttempts;
    const dur = config.auth.lockout.durationMs;

    this.failedAttempts = (this.failedAttempts || 0) + 1;
    if (this.failedAttempts >= max) {
        this.lockUntil = new Date(Date.now() + dur);
        this.failedAttempts = 0;
    }
    await this.save();
};

adminSchema.methods.registerSuccessfulLogin = async function (ip) {
    this.failedAttempts = 0;
    this.lockUntil = null;
    this.lastLoginAt = new Date();
    this.lastLoginIp = ip;
    await this.save();
};

adminSchema.methods.toSafeJSON = function () {
    return {
        id: this._id.toString(),
        username: this.username,
        role: this.role,
        active: this.active,
        lastLoginAt: this.lastLoginAt,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('Admin', adminSchema);
