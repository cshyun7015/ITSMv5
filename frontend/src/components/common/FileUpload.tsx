import React, { useRef } from 'react';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function FileUpload({ files, onChange }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onChange([...files, ...selectedFiles]);
    }
  };

  const removeFile = (idx: number) => {
    const newFiles = [...files];
    newFiles.splice(idx, 1);
    onChange(newFiles);
  };

  return (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px dashed #555', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
      <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>Attachments</label>
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />
      
      <button 
        type="button" 
        onClick={() => fileInputRef.current?.click()}
        style={{ padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff', cursor: 'pointer', marginBottom: '1rem' }}
      >
        Select Files
      </button>

      {files.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {files.map((file, idx) => (
            <li key={idx} style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              <button 
                type="button" 
                onClick={() => removeFile(idx)} 
                style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
