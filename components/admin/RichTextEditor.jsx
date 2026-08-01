'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '240px', background: '#ffffff', color: '#666', display: 'grid', placeItems: 'center', borderRadius: '8px', border: '1px solid #ddd' }}>
      Loading Rich Text Editor...
    </div>
  ),
});

const modules = {
  toolbar: [
    [{ font: [] }, { header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'super' }, { script: 'sub' }],
    [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video', 'clean'],
  ],
};

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div className="journal-rich-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Write your article, essay, poem or story here...'}
      />
    </div>
  );
}
