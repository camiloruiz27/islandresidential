import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const StatCard = ({ label, value, sub, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
                {icon}
            </div>
        </div>
        <div className="text-3xl font-bold tracking-tighter mb-1">{value}</div>
        <div className="text-gray-500 text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
);

function SettingsWidget({ settings }) {
    const normalizeEmails = (emails = ['']) => {
        const values = Array.isArray(emails) ? emails.filter(email => typeof email === 'string') : [];
        return values.length > 0 ? values : [''];
    };

    const { data, setData, post, processing, errors } = useForm({
        maintenance_emails: normalizeEmails(settings?.maintenance_emails),
        rental_emails: normalizeEmails(settings?.rental_emails),
    });

    const [saved, setSaved] = useState(false);

    const updateEmail = (field, index, value) => {
        setData(field, data[field].map((email, currentIndex) => (
            currentIndex === index ? value : email
        )));
    };

    const addEmail = (field) => {
        if (data[field].length >= 4) {
            return;
        }

        setData(field, [...data[field], '']);
    };

    const removeEmail = (field, index) => {
        const nextValues = data[field].filter((_, currentIndex) => currentIndex !== index);
        setData(field, nextValues.length > 0 ? nextValues : ['']);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <div>
                    <h3 className="font-bold tracking-tight">Notification Settings</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Configure where form submissions are sent</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">⚙</div>
            </div>

            <form onSubmit={submit} className="p-6 space-y-5">
                {saved && (
                    <div className="bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl">
                        ✓ Settings saved successfully
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">
                                Maintenance Request Emails
                            </label>
                            <p className="text-xs text-gray-400 pl-1">Notifications from the maintenance form will be sent to these recipients</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => addEmail('maintenance_emails')}
                            disabled={data.maintenance_emails.length >= 4}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Email
                        </button>
                    </div>
                    <div className="text-[11px] uppercase tracking-widest text-gray-300 pl-1">{data.maintenance_emails.length}/4 recipients</div>
                    <div className="space-y-3">
                        {data.maintenance_emails.map((email, index) => (
                            <div key={`maintenance-${index}`}>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                                        <input
                                            type="email"
                                            className={`w-full pl-8 pr-4 py-3.5 rounded-xl border bg-gray-50 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors ${errors[`maintenance_emails.${index}`] || errors.maintenance_emails ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                            value={email}
                                            onChange={e => updateEmail('maintenance_emails', index, e.target.value)}
                                            placeholder="rent@islandresidential.ca"
                                            required={index === 0}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeEmail('maintenance_emails', index)}
                                        disabled={data.maintenance_emails.length === 1}
                                        className="px-3 py-3 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Remove
                                    </button>
                                </div>
                                {(errors[`maintenance_emails.${index}`] || (index === 0 && errors.maintenance_emails)) && (
                                    <p className="text-red-500 text-xs mt-1.5 pl-1">
                                        {errors[`maintenance_emails.${index}`] ?? errors.maintenance_emails}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">
                                Rental Application Emails
                            </label>
                            <p className="text-xs text-gray-400 pl-1">Rental application submissions will go to these recipients</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => addEmail('rental_emails')}
                            disabled={data.rental_emails.length >= 4}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Email
                        </button>
                    </div>
                    <div className="text-[11px] uppercase tracking-widest text-gray-300 pl-1">{data.rental_emails.length}/4 recipients</div>
                    <div className="space-y-3">
                        {data.rental_emails.map((email, index) => (
                            <div key={`rental-${index}`}>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                                        <input
                                            type="email"
                                            className={`w-full pl-8 pr-4 py-3.5 rounded-xl border bg-gray-50 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors ${errors[`rental_emails.${index}`] || errors.rental_emails ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                            value={email}
                                            onChange={e => updateEmail('rental_emails', index, e.target.value)}
                                            placeholder="rentals@example.com"
                                            required={index === 0}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeEmail('rental_emails', index)}
                                        disabled={data.rental_emails.length === 1}
                                        className="px-3 py-3 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Remove
                                    </button>
                                </div>
                                {(errors[`rental_emails.${index}`] || (index === 0 && errors.rental_emails)) && (
                                    <p className="text-red-500 text-xs mt-1.5 pl-1">
                                        {errors[`rental_emails.${index}`] ?? errors.rental_emails}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full group relative px-6 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-[0.15em] overflow-hidden rounded-xl disabled:opacity-50 hover:bg-gray-800 transition-colors"
                    >
                        {processing ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Dashboard({ stats, recentApplications, recentMaintenance, settings, flash }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard - Island Residential" />

            {/* Flash message */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-100 text-green-700 text-sm font-bold px-5 py-4 rounded-xl">
                    ✓ {flash.success}
                </div>
            )}

            {/* Welcome header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-1">Welcome back 👋</h2>
                <p className="text-gray-500">Here's what's happening across your properties today.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard
                    label="Total Apartments"
                    value={stats.total_apartments}
                    icon="⊞"
                    color="bg-black text-white"
                />
                <StatCard
                    label="Available Now"
                    value={stats.available_apartments}
                    sub="Ready to rent"
                    icon="✓"
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    label="Pending Applications"
                    value={stats.pending_applications}
                    sub="Need review"
                    icon="◻"
                    color="bg-amber-50 text-amber-600"
                />
                <StatCard
                    label="Maintenance Requests"
                    value={stats.pending_maintenance}
                    sub="Open tickets"
                    icon="◈"
                    color="bg-red-50 text-red-600"
                />
            </div>

            {/* Quick actions */}
            <div className="mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={route('admin.apartments.create')}
                        className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                    >
                        <span>+</span> New Apartment
                    </Link>
                    <Link
                        href={route('admin.applications.index')}
                        className="inline-flex items-center gap-2 bg-white text-black border border-gray-200 px-5 py-3 rounded-xl text-sm font-bold hover:border-black transition-colors"
                    >
                        View Applications
                    </Link>
                    <Link
                        href={route('admin.maintenance.index')}
                        className="inline-flex items-center gap-2 bg-white text-black border border-gray-200 px-5 py-3 rounded-xl text-sm font-bold hover:border-black transition-colors"
                    >
                        View Maintenance
                    </Link>
                </div>
            </div>

            {/* Recent tables + Settings */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Applications */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-50">
                        <h3 className="font-bold tracking-tight">Recent Applications</h3>
                        <Link href={route('admin.applications.index')} className="text-xs text-gray-400 hover:text-black font-bold tracking-wider uppercase transition-colors">
                            View All →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentApplications && recentApplications.length > 0 ? recentApplications.map((app) => (
                            <div key={app.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                                    {app.applicant_name?.charAt(0) ?? '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{app.applicant_name}</div>
                                    <div className="text-xs text-gray-400 truncate">{app.applicant_email}</div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0 ${
                                    app.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                    app.status === 'approved' ? 'bg-green-50 text-green-700' :
                                    'bg-red-50 text-red-700'
                                }`}>
                                    {app.status}
                                </span>
                            </div>
                        )) : (
                            <div className="px-6 py-12 text-center text-gray-400 text-sm">No applications yet</div>
                        )}
                    </div>
                </div>

                {/* Recent Maintenance */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-50">
                        <h3 className="font-bold tracking-tight">Recent Maintenance</h3>
                        <Link href={route('admin.maintenance.index')} className="text-xs text-gray-400 hover:text-black font-bold tracking-wider uppercase transition-colors">
                            View All →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentMaintenance && recentMaintenance.length > 0 ? recentMaintenance.map((req) => (
                            <div key={req.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                                    {req.tenant_name?.charAt(0) ?? '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{req.tenant_name}</div>
                                    <div className="text-xs text-gray-400 truncate">Unit {req.apartment_unit}</div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0 ${
                                    req.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                                    req.priority === 'high' ? 'bg-orange-50 text-orange-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    {req.priority}
                                </span>
                            </div>
                        )) : (
                            <div className="px-6 py-12 text-center text-gray-400 text-sm">No maintenance requests</div>
                        )}
                    </div>
                </div>

                {/* Settings Widget */}
                <SettingsWidget settings={settings} />
            </div>
        </AdminLayout>
    );
}
