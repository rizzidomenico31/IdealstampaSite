import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../services/api';
import Modal from './Modal';
import PasswordField, { isPasswordValid } from './PasswordField';

const ROLE_LABELS = {
    superadmin: { label: 'Super Admin', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    admin: { label: 'Admin', cls: 'bg-slate-100 text-slate-700 border-slate-200' }
};

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminUsers() {
    const { admin: currentAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [resetTarget, setResetTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await usersApi.list();
            setUsers(res.admins);
        } catch (err) {
            setError(err.message || 'Errore caricamento utenti');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const isSelf = (u) => currentAdmin?.id === u.id;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Utenti Admin</h1>
                    <p className="text-slate-500 text-sm mt-1">Gestisci gli account che possono accedere al pannello.</p>
                </div>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-medium rounded-lg shadow-md shadow-teal-500/20 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuovo utente
                </button>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <Th>Username</Th>
                                <Th>Ruolo</Th>
                                <Th>Stato</Th>
                                <Th>Ultimo accesso</Th>
                                <Th>Creato</Th>
                                <Th className="text-right">Azioni</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Caricamento...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Nessun utente</td></tr>
                            ) : users.map(u => {
                                const role = ROLE_LABELS[u.role] || ROLE_LABELS.admin;
                                return (
                                    <tr key={u.id} className="hover:bg-slate-50">
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center text-sm font-semibold">
                                                    {u.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{u.username}</div>
                                                    {isSelf(u) && <div className="text-xs text-teal-600">(tu)</div>}
                                                </div>
                                            </div>
                                        </Td>
                                        <Td>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${role.cls}`}>
                                                {role.label}
                                            </span>
                                        </Td>
                                        <Td>
                                            {u.active ? (
                                                <span className="inline-flex items-center gap-1.5 text-emerald-700 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    Attivo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-slate-500 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                                                    Disattivato
                                                </span>
                                            )}
                                        </Td>
                                        <Td className="text-sm text-slate-600">{formatDate(u.lastLoginAt)}</Td>
                                        <Td className="text-sm text-slate-600">{formatDate(u.createdAt)}</Td>
                                        <Td className="text-right whitespace-nowrap">
                                            <button onClick={() => setEditTarget(u)} className="text-sm text-teal-600 hover:text-teal-700 font-medium px-2">Modifica</button>
                                            <button onClick={() => setResetTarget(u)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium px-2">Reset password</button>
                                            <button
                                                onClick={() => setDeleteTarget(u)}
                                                disabled={isSelf(u)}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium px-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={isSelf(u) ? 'Non puoi eliminare te stesso' : ''}
                                            >
                                                Elimina
                                            </button>
                                        </Td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateUserModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => { setCreateOpen(false); load(); }}
            />
            <EditUserModal
                user={editTarget}
                isSelf={editTarget ? isSelf(editTarget) : false}
                onClose={() => setEditTarget(null)}
                onUpdated={() => { setEditTarget(null); load(); }}
            />
            <ResetPasswordModal
                user={resetTarget}
                onClose={() => setResetTarget(null)}
                onDone={() => { setResetTarget(null); load(); }}
            />
            <DeleteUserModal
                user={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onDeleted={() => { setDeleteTarget(null); load(); }}
            />
        </div>
    );
}

const Th = ({ children, className = '' }) => (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>{children}</th>
);
const Td = ({ children, className = '' }) => (
    <td className={`px-4 py-3 ${className}`}>{children}</td>
);

// ───────────────────────────── Create
function CreateUserModal({ open, onClose, onCreated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) { setUsername(''); setPassword(''); setRole('admin'); setError(''); }
    }, [open]);

    const canSubmit = username.length >= 3 && isPasswordValid(password) && !submitting;

    const submit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        setError('');
        try {
            await usersApi.create({ username, password, role });
            onCreated();
        } catch (err) {
            setError(err.message || 'Errore nella creazione');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Nuovo utente admin" size="lg">
            <form onSubmit={submit} className="space-y-4">
                <Field label="Username">
                    <input
                        type="text" value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        autoFocus required minLength={3} maxLength={50}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                </Field>
                <Field label="Ruolo">
                    <select
                        value={role} onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                    >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                    </select>
                </Field>
                <PasswordField value={password} onChange={setPassword} label="Password" />

                {error && <ErrorBox>{error}</ErrorBox>}

                <FormActions onCancel={onClose} disabled={!canSubmit} loading={submitting} submitLabel="Crea utente" />
            </form>
        </Modal>
    );
}

// ───────────────────────────── Edit
function EditUserModal({ user, isSelf, onClose, onUpdated }) {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('admin');
    const [active, setActive] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setRole(user.role);
            setActive(user.active);
            setError('');
        }
    }, [user]);

    if (!user) return null;

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        const patch = {};
        if (username !== user.username) patch.username = username;
        if (role !== user.role) patch.role = role;
        if (active !== user.active) patch.active = active;
        try {
            await usersApi.update(user.id, patch);
            onUpdated();
        } catch (err) {
            setError(err.message || 'Errore aggiornamento');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={Boolean(user)} onClose={onClose} title={`Modifica "${user.username}"`} size="lg">
            <form onSubmit={submit} className="space-y-4">
                <Field label="Username">
                    <input
                        type="text" value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        required minLength={3} maxLength={50}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                </Field>
                <Field label="Ruolo">
                    <select
                        value={role} onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                    >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                    </select>
                </Field>

                <label className={`flex items-center gap-3 p-3 rounded-lg border ${active ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'} ${isSelf ? 'opacity-60' : ''}`}>
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        disabled={isSelf}
                        className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <div className="text-sm">
                        <div className="font-medium text-slate-800">Account attivo</div>
                        <div className="text-slate-500 text-xs">
                            {isSelf ? 'Non puoi disattivare il tuo stesso account' : 'Disattivando l\'account l\'utente non potrà più accedere'}
                        </div>
                    </div>
                </label>

                {error && <ErrorBox>{error}</ErrorBox>}

                <FormActions onCancel={onClose} loading={submitting} submitLabel="Salva modifiche" />
            </form>
        </Modal>
    );
}

// ───────────────────────────── Reset password
function ResetPasswordModal({ user, onClose, onDone }) {
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { if (user) { setPassword(''); setError(''); } }, [user]);

    if (!user) return null;

    const canSubmit = isPasswordValid(password) && !submitting;

    const submit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        setError('');
        try {
            await usersApi.resetPassword(user.id, password);
            onDone();
        } catch (err) {
            setError(err.message || 'Errore nel reset');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={Boolean(user)} onClose={onClose} title={`Reset password di "${user.username}"`} size="lg">
            <form onSubmit={submit} className="space-y-4">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    L'utente dovrà usare la nuova password al prossimo accesso. Eventuali tentativi falliti e blocchi verranno azzerati.
                </div>
                <PasswordField value={password} onChange={setPassword} label="Nuova password" />

                {error && <ErrorBox>{error}</ErrorBox>}

                <FormActions
                    onCancel={onClose}
                    disabled={!canSubmit}
                    loading={submitting}
                    submitLabel="Imposta nuova password"
                    submitVariant="indigo"
                />
            </form>
        </Modal>
    );
}

// ───────────────────────────── Delete
function DeleteUserModal({ user, onClose, onDeleted }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!user) return null;

    const confirm = async () => {
        setSubmitting(true);
        setError('');
        try {
            await usersApi.remove(user.id);
            onDeleted();
        } catch (err) {
            setError(err.message || 'Errore eliminazione');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={Boolean(user)} onClose={onClose} title="Conferma eliminazione" size="md">
            <div className="space-y-4">
                <p className="text-slate-700">
                    Stai per eliminare l'utente <strong className="text-slate-900">{user.username}</strong>.
                    Questa operazione è irreversibile.
                </p>
                {error && <ErrorBox>{error}</ErrorBox>}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button" onClick={onClose}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition disabled:opacity-60"
                    >
                        Annulla
                    </button>
                    <button
                        type="button" onClick={confirm} disabled={submitting}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-60 inline-flex items-center gap-2"
                    >
                        {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        Elimina utente
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ───────────────────────────── helpers UI
function Field({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

function ErrorBox({ children }) {
    return (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {children}
        </div>
    );
}

function FormActions({ onCancel, loading, disabled, submitLabel, submitVariant = 'teal' }) {
    const variants = {
        teal: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-teal-500/20',
        indigo: 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 shadow-indigo-500/20'
    };
    return (
        <div className="flex justify-end gap-2 pt-2">
            <button
                type="button" onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition disabled:opacity-60"
            >
                Annulla
            </button>
            <button
                type="submit" disabled={disabled || loading}
                className={`px-4 py-2 rounded-lg text-white font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 ${variants[submitVariant]}`}
            >
                {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {submitLabel}
            </button>
        </div>
    );
}
