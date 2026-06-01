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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        location: '',
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        status: 'available',
        has_parking: false,
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.apartments.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="New Apartment">
            <Head title="New Apartment - Admin" />

            <div className="flex items-center gap-4 mb-8">
                <Link href={route('admin.apartments.index')} className="text-gray-400 hover:text-black transition-colors text-sm font-bold">
                    ← Back
                </Link>
                <h2 className="text-2xl font-bold tracking-tight">Create New Apartment</h2>
            </div>

            <form onSubmit={submit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main fields */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50">Listing Details</h3>

                            <InputField label="Title *" error={errors.title}>
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="e.g. Modern 2BR Downtown Halifax"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                            </InputField>

                            <InputField label="Description *" error={errors.description}>
                                <textarea
                                    className={inputClass}
                                    rows={5}
                                    placeholder="Describe the apartment, amenities, neighbourhood..."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    required
                                />
                            </InputField>

                            <InputField label="Location" error={errors.location}>
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="e.g. Sydney, Cape Breton"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                />
                            </InputField>
                        </div>

                        {/* Photo upload */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50 mb-5">Photos</h3>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-black transition-colors cursor-pointer" onClick={() => document.getElementById('photo-input').click()}>
                                <div className="text-3xl mb-2">📸</div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Click to upload photos</p>
                                <p className="text-xs text-gray-400">JPG, PNG up to 10MB each. First image will be the cover.</p>
                                <input
                                    id="photo-input"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImages}
                                />
                            </div>
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                            {i === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center font-bold">
                                                    Cover
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50">Pricing & Details</h3>

                            <InputField label="Monthly Rent ($) *" error={errors.price}>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={inputClass + ' pl-8'}
                                        placeholder="1200"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                            </InputField>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Bedrooms *" error={errors.bedrooms}>
                                    <input
                                        type="number"
                                        min="0"
                                        className={inputClass}
                                        value={data.bedrooms}
                                        onChange={e => setData('bedrooms', e.target.value)}
                                        required
                                    />
                                </InputField>
                                <InputField label="Bathrooms *" error={errors.bathrooms}>
                                    <input
                                        type="number"
                                        min="0"
                                        className={inputClass}
                                        value={data.bathrooms}
                                        onChange={e => setData('bathrooms', e.target.value)}
                                        required
                                    />
                                </InputField>
                            </div>

                            <InputField label="Status *" error={errors.status}>
                                <select
                                    className={inputClass}
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    required
                                >
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Publishing...' : '+ Publish Apartment'}
                        </button>

                        <Link
                            href={route('admin.apartments.index')}
                            className="block w-full text-center border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-sm hover:border-black hover:text-black transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
