import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const StatusBadge = ({ status }) => {
    const styles = {
        available: 'bg-green-50 text-green-700 border-green-100',
        rented: 'bg-blue-50 text-blue-700 border-blue-100',
        hidden: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return (
        <span className={`text-xs px-3 py-1 rounded-full font-bold border capitalize ${styles[status] ?? styles.hidden}`}>
            {status}
        </span>
    );
};

export default function Index({ apartments, flash }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this apartment?')) {
            router.delete(route('admin.apartments.destroy', id));
        }
    };

    return (
        <AdminLayout title="Apartments">
            <Head title="Apartments - Admin" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Apartments</h2>
                    <p className="text-gray-500 text-sm mt-1">{apartments.length} total listings</p>
                </div>
                <Link
                    href={route('admin.apartments.create')}
                    className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                    <span>+</span> New Apartment
                </Link>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-5 py-4 rounded-xl text-sm font-medium">
                    ✓ {flash.success}
                </div>
            )}

            {apartments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                    <div className="text-4xl mb-4">⊞</div>
                    <h3 className="font-bold text-lg mb-2">No apartments yet</h3>
                    <p className="text-gray-400 text-sm mb-6">Create your first listing to get started.</p>
                    <Link href={route('admin.apartments.create')} className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-bold">
                        + New Apartment
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Property</th>
                                <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-4 py-4 hidden md:table-cell">Location</th>
                                <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-4 py-4 hidden lg:table-cell">Details</th>
                                <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Price</th>
                                <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Status</th>
                                <th className="text-right text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {apartments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                {apt.images && apt.images.length > 0 ? (
                                                    <img src={apt.images[0]} alt={apt.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm tracking-tight">{apt.title}</div>
                                                <div className="text-gray-400 text-xs mt-0.5 truncate max-w-[180px]">{apt.description?.substring(0, 60)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{apt.location || '—'}</td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        <div className="flex gap-3 text-xs font-bold text-gray-600">
                                            <span>{apt.bedrooms} beds</span>
                                            <span className="text-gray-200">|</span>
                                            <span>{apt.bathrooms} baths</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-bold">${Number(apt.price).toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">/mo</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={apt.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route('admin.apartments.edit', apt.id)}
                                                className="text-xs font-bold px-3 py-2 rounded-lg border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(apt.id)}
                                                className="text-xs font-bold px-3 py-2 rounded-lg border border-gray-200 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
