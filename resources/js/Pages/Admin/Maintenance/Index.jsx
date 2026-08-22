import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const PriorityBadge = ({ priority }) => {
    const styles = {
        emergency: 'bg-red-100 text-red-700 border-red-200',
        high: 'bg-orange-50 text-orange-700 border-orange-100',
        medium: 'bg-amber-50 text-amber-700 border-amber-100',
        low: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return <span className={`text-xs px-3 py-1 rounded-full font-bold border capitalize ${styles[priority] ?? styles.low}`}>{priority}</span>;
};

function PhotoModal({ photos, onClose }) {
    const [activeIdx, setActiveIdx] = useState(0);

    if (!photos || photos.length === 0) return null;

    const activeUrl = `/storage/${photos[activeIdx]}`;
    const isVideo = /\.(mp4|mov)$/i.test(photos[activeIdx]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold tracking-tight">Maintenance Photos</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{photos.length} file{photos.length > 1 ? 's' : ''} attached</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg transition-colors">✕</button>
                </div>

                {/* Main viewer */}
                <div className="relative bg-gray-50 flex items-center justify-center" style={{ minHeight: '380px' }}>
                    {isVideo ? (
                        <video src={activeUrl} controls className="max-h-[480px] max-w-full" />
                    ) : (
                        <img
                            src={activeUrl}
                            alt={`Photo ${activeIdx + 1}`}
                            className="max-h-[480px] max-w-full object-contain"
                        />
                    )}

                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveIdx(i => (i - 1 + photos.length) % photos.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center font-bold hover:bg-white transition-colors"
                            >←</button>
                            <button
                                onClick={() => setActiveIdx(i => (i + 1) % photos.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center font-bold hover:bg-white transition-colors"
                            >→</button>
                            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                {activeIdx + 1} / {photos.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {photos.length > 1 && (
                    <div className="flex gap-2 px-6 py-3 overflow-x-auto border-t border-gray-50">
                        {photos.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIdx(i)}
                                className={`flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${activeIdx === i ? 'border-black shadow-md' : 'border-transparent opacity-50 hover:opacity-80'}`}
                            >
                                {/\.(mp4|mov)$/i.test(p) ? (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">▶</div>
                                ) : (
                                    <img src={`/storage/${p}`} alt="" className="w-full h-full object-cover" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Download button */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                    <a
                        href={activeUrl}
                        download
                        className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        ↓ Download File
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function MaintenanceIndex({ requests, flash }) {
    const [expandedId, setExpandedId] = useState(null);
    const [photoModal, setPhotoModal] = useState(null); // photos array or null

    const updateStatus = (id, status) => {
        router.patch(route('admin.maintenance.status', id), { status });
    };

    return (
        <AdminLayout title="Maintenance Requests">
            <Head title="Maintenance | Admin">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Photo Modal */}
            {photoModal && <PhotoModal photos={photoModal} onClose={() => setPhotoModal(null)} />}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Maintenance Requests</h2>
                    <p className="text-gray-500 text-sm mt-1">{requests.length} total requests</p>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-5 py-4 rounded-xl text-sm font-medium">
                    ✓ {flash.success}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                    <div className="text-4xl mb-4">◈</div>
                    <h3 className="font-bold text-lg mb-2">No maintenance requests</h3>
                    <p className="text-gray-400 text-sm">Requests submitted through the website will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req) => {
                        const isExpanded = expandedId === req.id;
                        const photos = req.photos || [];

                        return (
                            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div
                                    className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                        req.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                                        req.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {req.tenant_name?.charAt(0) ?? '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold tracking-tight">{req.tenant_name}</div>
                                        <div className="text-sm text-gray-400 truncate">{req.tenant_email}</div>
                                    </div>
                                    <div className="hidden sm:block text-sm text-gray-500 flex-shrink-0">
                                        Unit <span className="font-bold text-gray-700">{req.apartment_unit}</span>
                                    </div>
                                    {/* Photos badge */}
                                    {photos.length > 0 && (
                                        <button
                                            onClick={e => { e.stopPropagation(); setPhotoModal(photos); }}
                                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all border border-gray-200 hover:border-black"
                                        >
                                            🖼 {photos.length} Photo{photos.length > 1 ? 's' : ''}
                                        </button>
                                    )}
                                    <div className="flex-shrink-0">
                                        <PriorityBadge priority={req.priority} />
                                    </div>
                                    <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-bold border ${
                                        req.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        req.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-green-50 text-green-700 border-green-100'
                                    }`}>
                                        {req.status.replace('_', ' ')}
                                    </span>
                                    <div className="flex-shrink-0 text-xs text-gray-400 hidden md:block">
                                        {new Date(req.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <span className="text-gray-300 flex-shrink-0 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        ▼
                                    </span>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-50 px-6 py-6 bg-gray-50/50">
                                        <div className="grid md:grid-cols-3 gap-4 mb-5">
                                            <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</div>
                                                <div className="text-sm font-medium">{req.tenant_phone}</div>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Unit</div>
                                                <div className="text-sm font-medium">{req.apartment_unit}</div>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Priority</div>
                                                <div className="text-sm font-medium capitalize">{req.priority}</div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5">
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Issue Description</div>
                                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{req.issue_description}</div>
                                        </div>

                                        {/* Photos in expanded view */}
                                        {photos.length > 0 && (
                                            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attached Photos / Videos</div>
                                                    <button
                                                        onClick={() => setPhotoModal(photos)}
                                                        className="text-xs font-bold text-black underline underline-offset-2 hover:opacity-70 transition-opacity"
                                                    >
                                                        View full screen →
                                                    </button>
                                                </div>
                                                <div className="flex gap-3 overflow-x-auto pb-1">
                                                    {photos.map((p, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => { setPhotoModal(photos); }}
                                                            className="flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border border-gray-200 hover:border-black transition-colors relative group"
                                                        >
                                                            {/\.(mp4|mov)$/i.test(p) ? (
                                                                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                                                                    <span className="text-2xl">▶</span>
                                                                    <span className="text-xs mt-1">Video</span>
                                                                </div>
                                                            ) : (
                                                                <img src={`/storage/${p}`} alt="" className="w-full h-full object-cover" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest self-center mr-2">Update Status:</span>
                                            {['pending', 'in_progress', 'resolved'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(req.id, s)}
                                                    className={`text-xs px-4 py-2 rounded-full font-bold border transition-all capitalize ${
                                                        req.status === s
                                                            ? 'bg-black text-white border-black'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                                                    }`}
                                                >
                                                    {s.replace('_', ' ')}
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
