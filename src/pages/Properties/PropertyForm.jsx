import { useState, useRef } from 'react';
import { useData } from '../../hooks/useData';
import { useUpload } from '../../hooks/useUpload';
import { ImagePlus, X, Loader2 } from 'lucide-react';

const PropertyForm = ({ onClose, existingProperty }) => {
  const { addProperty, updateProperty } = useData();
  const { uploadFile, uploading } = useUpload();
  const isEditing = !!existingProperty;

  // --- FIX: Unpack JSON data for editing ---
  let initialExtra = {};
  try {
    if (existingProperty?.description && existingProperty.description.startsWith('{')) {
      initialExtra = JSON.parse(existingProperty.description);
    }
  } catch (e) {
    initialExtra = {};
  }

  const [formData, setFormData] = useState({
    title: existingProperty?.title || existingProperty?.name || '',
    type: existingProperty?.type || 'residential',
    location: initialExtra.location || existingProperty?.location || '',
    size: initialExtra.size || existingProperty?.size || '',
    price: existingProperty?.price || '',
    status: existingProperty?.status || 'available',
    titleStatus: initialExtra.titleStatus || existingProperty?.titleStatus || 'Deed of Assignment',
    description: initialExtra.text || existingProperty?.description || '',
  });

  const [images, setImages] = useState(
    (existingProperty?.images || []).map(url => ({ url, name: 'Photo', isExisting: true }))
  );
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const result = await uploadFile(file);
        setImages(prev => [...prev, { url: result.url, name: file.name, isExisting: false }]);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
    e.target.value = '';
  };

  const removeImage = (url) => setImages(prev => prev.filter(img => img.url !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        propertyId: existingProperty?.propertyId || `PROP-${Date.now()}`,
        name: formData.title,
        type: formData.type === 'residential' ? 'house' : formData.type,
        price: Number(formData.price),
        status: formData.status,
        imageUrl: images[0]?.url || '',
        // Store all UI-specific fields in the description string
        description: JSON.stringify({
          text: formData.description,
          location: formData.location,
          size: formData.size,
          titleStatus: formData.titleStatus
        })
      };

      if (isEditing) {
        await updateProperty(existingProperty._id, payload);
      } else {
        await addProperty(payload);
      }
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label className="form-label">Property Images</label>
        <div className="img-upload-zone" onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
          {uploading ? <Loader2 className="spin" /> : <span>Click to add photos</span>}
        </div>
        <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={handleImageSelect} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {images.map(img => (
            <div key={img.url} style={{ position: 'relative' }}>
              <img src={img.url} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
              <button type="button" onClick={() => removeImage(img.url)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', border: 'none', width: '18px', height: '18px', fontSize: '10px' }}>X</button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Property Title</label>
        <input required name="title" className="form-control" value={formData.title} onChange={handleChange} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
            <option value="land">Land</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Location</label>
        <input required name="location" className="form-control" value={formData.location} onChange={handleChange} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Size</label>
          <input required name="size" className="form-control" value={formData.size} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Price (₦)</label>
          <input required type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Title Status</label>
        <select name="titleStatus" className="form-control" value={formData.titleStatus} onChange={handleChange}>
          <option value="Deed of Assignment">Deed of Assignment</option>
          <option value="C of O">C of O</option>
          <option value="Governor's Consent">Governor's Consent</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Asset'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;