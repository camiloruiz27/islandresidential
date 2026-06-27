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
        cover_image_source: apartment.images?.length ? 'existing' : '',
        cover_image: apartment.images?.[0] || '',
        cover_new_index: null,
    });

    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        const allNewFiles = [...data.images, ...files];
        const previews = allNewFiles.map((file) => URL.createObjectURL(file));

        setData((current) => ({
            ...current,
            images: allNewFiles,
            cover_image_source: !current.cover_image && current.images_to_keep.length === 0 && allNewFiles.length > 0
                ? 'new'
                : current.cover_image_source,
            cover_image: !current.cover_image && current.images_to_keep.length === 0 && allNewFiles.length > 0
                ? ''
                : current.cover_image,
            cover_new_index: !current.cover_image && current.images_to_keep.length === 0 && allNewFiles.length > 0
                ? 0
                : current.cover_new_index,
        }));

        setNewImagePreviews(previews);
        e.target.value = '';
    };

    const removeExistingImage = (indexToRemove) => {
        const updatedExistingImages = data.images_to_keep.filter((_, idx) => idx !== indexToRemove);
        const removedImage = data.images_to_keep[indexToRemove];

        setData((current) => {
            const nextData = {
                ...current,
                images_to_keep: updatedExistingImages,
            };

            if (current.cover_image_source === 'existing' && current.cover_image === removedImage) {
                if (updatedExistingImages.length > 0) {
                    nextData.cover_image_source = 'existing';
                    nextData.cover_image = updatedExistingImages[0];
                    nextData.cover_new_index = null;
                } else if (current.images.length > 0) {
                    nextData.cover_image_source = 'new';
                    nextData.cover_image = '';
                    nextData.cover_new_index = 0;
                } else {
                    nextData.cover_image_source = '';
                    nextData.cover_image = '';
                    nextData.cover_new_index = null;
                }
            }

            return nextData;
        });
    };

    const removeNewImage = (indexToRemove) => {
        const updatedFiles = data.images.filter((_, idx) => idx !== indexToRemove);
        setNewImagePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));

        setData((current) => {
            const nextData = {
                ...current,
                images: updatedFiles,
            };

            if (current.cover_image_source === 'new') {
                if (current.cover_new_index === indexToRemove) {
                    if (current.images_to_keep.length > 0) {
                        nextData.cover_image_source = 'existing';
                        nextData.cover_image = current.images_to_keep[0];
                        nextData.cover_new_index = null;
                    } else if (updatedFiles.length > 0) {
                        nextData.cover_image_source = 'new';
                        nextData.cover_image = '';
                        nextData.cover_new_index = 0;
                    } else {
                        nextData.cover_image_source = '';
                        nextData.cover_image = '';
                        nextData.cover_new_index = null;
                    }
                } else if (typeof current.cover_new_index === 'number' && current.cover_new_index > indexToRemove) {
                    nextData.cover_new_index = current.cover_new_index - 1;
                }
            }

            return nextData;
        });
    };

    const setExistingCover = (image) => {
        setData((current) => ({
            ...current,
            cover_image_source: 'existing',
            cover_image: image,
            cover_new_index: null,
        }));
    };

    const setNewCover = (index) => {
        setData((current) => ({
            ...current,
            cover_image_source: 'new',
            cover_image: '',
            cover_new_index: index,
        }));
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
                    Back
                </Link>
                <h2 className="text-2xl font-bold tracking-tight">Edit: {apartment.title}</h2>
            </div>

            <form onSubmit={submit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50">Listing Details</h3>

                            <InputField label="Title *" error={errors.title}>
                                <input type="text" className={inputClass} value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                            </InputField>

                            <InputField label="Description *" error={errors.description}>
                                <textarea className={inputClass} rows={5} value={data.description} onChange={(e) => setData('description', e.target.value)} required />
                            </InputField>

                            <InputField label="Location" error={errors.location}>
                                <input type="text" className={inputClass} value={data.location} onChange={(e) => setData('location', e.target.value)} />
                            </InputField>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between gap-4 pb-3 border-b border-gray-50 mb-5">
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Photos</h3>
                                    <p className="text-xs text-gray-400 mt-2">Choose which image should be used as the cover.</p>
                                </div>
                            </div>

                            {data.images_to_keep.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Photos</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {data.images_to_keep.map((src, i) => (
                                            <div key={i} className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 group ${data.cover_image_source === 'existing' && data.cover_image === src ? 'ring-2 ring-black' : ''}`}>
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setExistingCover(src)}
                                                    className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${data.cover_image_source === 'existing' && data.cover_image === src ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-white'}`}
                                                >
                                                    {data.cover_image_source === 'existing' && data.cover_image === src ? 'Cover' : 'Set cover'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(i)}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    X
                                                </button>
                                                {data.cover_image_source === 'existing' && data.cover_image === src && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center font-bold">Cover</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-black transition-colors cursor-pointer" onClick={() => document.getElementById('photo-input').click()}>
                                <div className="text-2xl mb-2">Photo</div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Upload new photos to add to this apartment</p>
                                <p className="text-xs text-gray-400">JPG, PNG up to 10MB each</p>
                                <input id="photo-input" type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
                            </div>

                            {newImagePreviews.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Newly Added Photos</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {newImagePreviews.map((src, i) => (
                                            <div key={i} className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 group ${data.cover_image_source === 'new' && data.cover_new_index === i ? 'ring-2 ring-black' : 'ring-1 ring-gray-200'}`}>
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewCover(i)}
                                                    className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${data.cover_image_source === 'new' && data.cover_new_index === i ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-white'}`}
                                                >
                                                    {data.cover_image_source === 'new' && data.cover_new_index === i ? 'Cover' : 'Set cover'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    X
                                                </button>
                                                {data.cover_image_source === 'new' && data.cover_new_index === i && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center font-bold">Cover</div>
                                                )}
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
                                    <input type="number" min="0" step="0.01" className={inputClass + ' pl-8'} value={data.price} onChange={(e) => setData('price', e.target.value)} required />
                                </div>
                            </InputField>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Bedrooms" error={errors.bedrooms}>
                                    <input type="number" min="0" className={inputClass} value={data.bedrooms} onChange={(e) => setData('bedrooms', e.target.value)} />
                                </InputField>
                                <InputField label="Bathrooms" error={errors.bathrooms}>
                                    <input type="number" min="0" className={inputClass} value={data.bathrooms} onChange={(e) => setData('bathrooms', e.target.value)} />
                                </InputField>
                            </div>

                            <InputField label="Status *" error={errors.status}>
                                <select className={inputClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
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
                                    onChange={(e) => setData('has_parking', e.target.checked)}
                                />
                                <span className="text-sm font-bold text-gray-700">Has Parking</span>
                            </label>
                        </div>

                        <button type="submit" disabled={processing} className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
                            {processing ? 'Saving...' : 'Save Changes'}
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
