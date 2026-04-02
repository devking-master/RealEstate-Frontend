import { useState, useRef } from 'react';
import { useData } from '../../hooks/useData';
import { useUpload } from '../../hooks/useUpload';
import { ImagePlus, X, Loader2 } from 'lucide-react';

const PropertyForm = ({ onClose, existingProperty }) => {
  const { addProperty, updateProperty } = useData();
  const { uploadFile, uploading } = useUpload();
  const isEditing = !!existingProperty;

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
    (existingProperty?.images || []).map(url => ({ url, isExisting: true }))
  );
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleImageSelect = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  for (const file of files) {
    try {
      const filePath = await uploadFile(file); // This now returns "uploads/filename.jpg"
      
      if (filePath) {
        // We add it to our list. 
        // The URL is just the path from the server
        setImages(prev => [...prev, { url: filePath, isExisting: false }]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }
  if (fileRef.current) fileRef.current.value = '';
};

  const removeImage = (urlToRemove) => {
    setImages(prev => prev.filter(img => img.url !== urlToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrls = images.map(img => img.url);
      const payload = {
        propertyId: existingProperty?.propertyId || `PROP-${Date.now()}`,
        name: formData.title,
        type: formData.type === 'residential' ? 'house' : formData.type,
        price: Number(formData.price),
        status: formData.status,
        imageUrl: imageUrls[0] || '',
        images: imageUrls, 
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
        <div 
          className="img-upload-zone" 
          onClick={() => fileRef.current?.click()} 
          style={{ border: '2px dashed var(--border-main)', padding: '30px', textAlign: 'center', cursor: 'pointer', borderRadius: '12px', background: 'var(--bg-subtle)' }}
        >
          {uploading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Loader2 className="spin" size={20} /> <span>Uploading...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <ImagePlus size={24} color="var(--brand-accent)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to add photos</span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={handleImageSelect} />
        
        <div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
  gap: '12px', 
  marginTop: '15px' 
}}>
  {images.map((img, idx) => {
    if (!img?.url) return null;
    
    // Construct the full URL for the <img> tag
    const fullUrl = img.url.startsWith('http') 
      ? img.url 
      : `http://localhost:5000/${img.url}`;
    
    return (
      <div key={idx} className="image-preview-wrapper" style={{ 
        position: 'relative', 
        aspectRatio: '1/1',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid var(--border-subtle)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={fullUrl} 
          alt="preview" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <button 
          type="button" 
          onClick={() => removeImage(img.url)} 
          style={{ 
            position: 'absolute', 
            top: '4px', 
            right: '4px', 
            background: 'rgba(239, 68, 68, 0.9)', 
            color: 'white', 
            borderRadius: '50%', 
            border: 'none', 
            width: '20px', 
            height: '20px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}
        >
          <X size={12} strokeWidth={3} />
        </button>
      </div>
    );
  })}
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
        <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
          {submitting ? 'Saving...' : 'Save Asset'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;