import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

function FileModal({ files, onClose }) {
    if (!files || files.length === 0) return null;

    const isImage = (name) => /\.(jpg|jpeg|png)$/i.test(name || '');
    const isPdf = (name) => /\.pdf$/i.test(name || '');
    const icon = (name) => {
        if (isImage(name)) return '🖼';
        if (isPdf(name)) return '📄';
        return '📎';
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold tracking-tight">Attached Documents</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{files.length} file{files.length > 1 ? 's' : ''} uploaded</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg transition-colors">✕</button>
                </div>

                {/* File list */}
                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-gray-300 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                {icon(file.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate">{file.name || `File ${i + 1}`}</div>
                                <div className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest font-medium">{file.type}</div>
                            </div>
                            <a
                                href={`/admin/files/rental?path=${encodeURIComponent(file.path)}`}
                                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                            >
                                ↓ Download
                            </a>
                        </div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">Files are stored securely and only accessible to authorized admins.</p>
                </div>
            </div>
        </div>
    );
}

export default function ApplicationsIndex({ applications, flash }) {
    const [expandedId, setExpandedId] = useState(null);
    const [fileModal, setFileModal] = useState(null); // files array or null

    const formatValue = (value) => {
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (Array.isArray(value) || (value && typeof value === 'object')) {
            return JSON.stringify(value, null, 2);
        }

        return String(value || '—');
    };

    const isComplexValue = (value) => Array.isArray(value) || (value && typeof value === 'object');

    const updateStatus = (id, status) => {
        router.patch(route('admin.applications.status', id), { status });
    };

    return (
        <AdminLayout title="Rental Applications">
            <Head title="Applications | Admin">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* File Modal */}
            {fileModal && <FileModal files={fileModal} onClose={() => setFileModal(null)} />}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Rental Applications</h2>
                    <p className="text-gray-500 text-sm mt-1">{applications.length} total submissions</p>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-5 py-4 rounded-xl text-sm font-medium">
                    ✓ {flash.success}
                </div>
            )}

            {applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                    <div className="text-4xl mb-4">◻</div>
                    <h3 className="font-bold text-lg mb-2">No applications yet</h3>
                    <p className="text-gray-400 text-sm">Applications submitted through the website will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map((app) => {
                        const isExpanded = expandedId === app.id;
                        const appData = app.application_data || {};
                        const files = app.files || [];

                        return (
                            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                {/* Row */}
                                <div
                                    className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {app.applicant_name?.charAt(0) ?? '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold tracking-tight">{app.applicant_name}</div>
                                        <div className="text-sm text-gray-400 truncate">{app.applicant_email} · {app.applicant_phone}</div>
                                    </div>
                                    {appData.property_title && (
                                        <div className="hidden md:block text-sm text-gray-500 min-w-0 flex-shrink-0 max-w-[200px] truncate">
                                            <span className="text-xs text-gray-300 uppercase tracking-widest font-bold mr-2">For:</span>
                                            {appData.property_title}
                                        </div>
                                    )}

                                    {/* Files badge */}
                                    {files.length > 0 && (
                                        <button
                                            onClick={e => { e.stopPropagation(); setFileModal(files); }}
                                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all border border-gray-200 hover:border-black"
                                        >
                                            📎 {files.length} File{files.length > 1 ? 's' : ''}
                                        </button>
                                    )}

                                    <div className="flex-shrink-0 text-xs text-gray-400">
                                        {new Date(app.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-bold border ${
                                        app.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                        {app.status}
                                    </span>
                                    <span className="text-gray-300 flex-shrink-0 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        ▼
                                    </span>
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-50 px-6 py-6 bg-gray-50/50">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {Object.entries(appData).filter(([k]) => !k.includes('_path') && !k.includes('_paths')).map(([key, value]) => (
                                                <div key={key} className="bg-white rounded-xl p-4 border border-gray-100">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                        {key.replace(/_/g, ' ')}
                                                    </div>
                                                    {isComplexValue(value) ? (
                                                        <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-mono">
                                                            {formatValue(value)}
                                                        </pre>
                                                    ) : (
                                                        <div className="text-sm font-medium text-gray-800">
                                                            {formatValue(value)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Files section in expanded view */}
                                        {files.length > 0 && (
                                            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Uploaded Documents</div>
                                                    <button
                                                        onClick={() => setFileModal(files)}
                                                        className="text-xs font-bold text-black underline underline-offset-2 hover:opacity-70 transition-opacity"
                                                    >
                                                        View all →
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {files.map((file, i) => (
                                                        <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <span className="text-lg flex-shrink-0">
                                                                    {/\.pdf$/i.test(file.name) ? '📄' : /\.(jpg|jpeg|png)$/i.test(file.name) ? '🖼' : '📎'}
                                                                </span>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-medium truncate">{file.name}</div>
                                                                    <div className="text-xs text-gray-400 uppercase tracking-widest">{file.type}</div>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={`/admin/files/rental?path=${encodeURIComponent(file.path)}`}
                                                                className="flex-shrink-0 text-xs font-bold text-black hover:underline"
                                                            >
                                                                ↓ Download
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest self-center mr-2">Update Status:</span>
                                            {['pending', 'approved', 'rejected'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(app.id, s)}
                                                    className={`text-xs px-4 py-2 rounded-full font-bold border transition-all capitalize ${
                                                        app.status === s
                                                            ? 'bg-black text-white border-black'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}
