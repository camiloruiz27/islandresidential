import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const InputField = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-bold mb-2 tracking-wide text-gray-700">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);

const inputClass = "w-full border border-gray-200 focus:border-black focus:ring-0 px-4 py-3 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors outline-none";

export default function Edit({ apartment }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: apartment.title,
        description: apartment.description,
        location: apartment.location || '',
        price: apartment.price,
        bedrooms: apartment.bedrooms,
        bathrooms: apartment.bathrooms,
        status: apartment.status,
        has_parking: Boolean(apartment.has_parking),
        images_to_keep: apartment.images || [],
        images: [],
    });

    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        // Combine with existing newly uploaded files if user clicks upload multiple times
        const allNewFiles = [...data.images, ...files];
        setData('images', allNewFiles);
        
        const previews = allNewFiles.map(file => URL.createObjectURL(file));
        setNewImagePreviews(previews);
        // Reset input so the same files can be selected again if needed
        e.target.value = '';
    };

    const removeExistingImage = (indexToRemove) => {
        setData('images_to_keep', data.images_to_keep.filter((_, idx) => idx !== indexToRemove));
    };

    const removeNewImage = (indexToRemove) => {
        const updatedFiles = data.images.filter((_, idx) => idx !== indexToRemove);
        setData('images', updatedFiles);
        setNewImagePreviews(updatedFiles.map(file => URL.createObjectURL(file)));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.apartments.update', apartment.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Edit Apartment">
            <Head title="Edit Apartment - Admin" />

            <div className="flex items-center gap-4 mb-8">
                <Link href={route('admin.apartments.index')} className="text-gray-400 hover:text-black transition-colors text-sm font-bold">
                    ← Back
                </Link>
                <h2 className="text-2xl font-bold tracking-tight">Edit: {apartment.title}</h2>
            </div>

            <form onSubmit={submit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50">Listing Details</h3>

                            <InputField label="Title *" error={errors.title}>
                                <input type="text" className={inputClass} value={data.title} onChange={e => setData('title', e.target.value)} required />
                            </InputField>

                            <InputField label="Description *" error={errors.description}>
                                <textarea className={inputClass} rows={5} value={data.description} onChange={e => setData('description', e.target.value)} required />
                            </InputField>

                            <InputField label="Location" error={errors.location}>
                                <input type="text" className={inputClass} value={data.location} onChange={e => setData('location', e.target.value)} />
                            </InputField>
                        </div>

                        {/* Photos */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50 mb-5">Photos</h3>

                            {data.images_to_keep.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Photos</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {data.images_to_keep.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(i)}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    ✕
                                                </button>
                                                {i === 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center font-bold">Cover</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-black transition-colors cursor-pointer" onClick={() => document.getElementById('photo-input').click()}>
                                <div className="text-2xl mb-2">📸</div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Upload new photos to add to this apartment</p>
                                <p className="text-xs text-gray-400">JPG, PNG up to 10MB each</p>
                                <input id="photo-input" type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
                            </div>
                            
                            {newImagePreviews.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Newly Added Photos</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {newImagePreviews.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 ring-2 ring-black group">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    ✕
                                                </button>
                                                {(i === 0 && data.images_to_keep.length === 0) && <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center font-bold">New Cover</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50">Pricing & Details</h3>

                            <InputField label="Monthly Rent ($) *" error={errors.price}>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input type="number" min="0" step="0.01" className={inputClass + ' pl-8'} value={data.price} onChange={e => setData('price', e.target.value)} required />
                                </div>
                            </InputField>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Bedrooms" error={errors.bedrooms}>
                                    <input type="number" min="0" className={inputClass} value={data.bedrooms} onChange={e => setData('bedrooms', e.target.value)} />
                                </InputField>
                                <InputField label="Bathrooms" error={errors.bathrooms}>
                                    <input type="number" min="0" className={inputClass} value={data.bathrooms} onChange={e => setData('bathrooms', e.target.value)} />
                                </InputField>
                            </div>

                            <InputField label="Status *" error={errors.status}>
                                <select className={inputClass} value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="available">Available</option>
                                    <option value="rented">Rented</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </InputField>

                            <label className="flex items-center gap-3 cursor-pointer mt-4">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                    checked={data.has_parking}
                                    onChange={e => setData('has_parking', e.target.checked)}
                                />
                                <span className="text-sm font-bold text-gray-700">Has Parking</span>
                            </label>
                        </div>

                        <button type="submit" disabled={processing} className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
                            {processing ? 'Saving...' : '✓ Save Changes'}
                        </button>

                        <Link href={route('admin.apartments.index')} className="block w-full text-center border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-sm hover:border-black hover:text-black transition-colors">
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
