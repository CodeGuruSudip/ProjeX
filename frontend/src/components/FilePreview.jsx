import React, { useState } from 'react';
import { FaFile, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAlt, FaDownload, FaEye } from 'react-icons/fa';

const FilePreview = ({ file, onDelete }) => {
  const [showPreview, setShowPreview] = useState(false);

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();

    const iconMap = {
      // Images
      jpg: <FaFileImage className="text-success" />,
      jpeg: <FaFileImage className="text-success" />,
      png: <FaFileImage className="text-success" />,
      gif: <FaFileImage className="text-success" />,
      svg: <FaFileImage className="text-success" />,
      webp: <FaFileImage className="text-success" />,

      // Documents
      pdf: <FaFilePdf className="text-danger" />,
      doc: <FaFileWord className="text-primary" />,
      docx: <FaFileWord className="text-primary" />,
      xls: <FaFileExcel className="text-success" />,
      xlsx: <FaFileExcel className="text-success" />,
      ppt: <FaFilePowerpoint className="text-warning" />,
      pptx: <FaFilePowerpoint className="text-warning" />,

      // Text files
      txt: <FaFileAlt className="text-secondary" />,
      md: <FaFileAlt className="text-secondary" />,
      json: <FaFileAlt className="text-secondary" />,
      xml: <FaFileAlt className="text-secondary" />,
      css: <FaFileAlt className="text-secondary" />,
      js: <FaFileAlt className="text-secondary" />,
      html: <FaFileAlt className="text-secondary" />,
    };

    return iconMap[extension] || <FaFile className="text-muted" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const extension = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${file.path.replace(/\\/g, '/')}`;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    if (isImage(file.filename)) {
      setShowPreview(true);
    } else {
      // For non-image files, just download
      handleDownload();
    }
  };

  return (
    <>
      <div className="file-preview-item">
        <div className="file-preview-icon">
          {getFileIcon(file.filename)}
        </div>

        <div className="file-preview-info">
          <div className="file-preview-name" title={file.filename}>
            {file.filename.length > 20
              ? `${file.filename.substring(0, 17)}...`
              : file.filename
            }
          </div>
          <div className="file-preview-size">
            {formatFileSize(file.size)}
          </div>
        </div>

        <div className="file-preview-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handlePreview}
            title={isImage(file.filename) ? "Preview" : "Download"}
          >
            {isImage(file.filename) ? <FaEye /> : <FaDownload />}
          </button>

          {onDelete && (
            <button
              className="btn btn-ghost btn-sm text-danger"
              onClick={() => onDelete(file)}
              title="Delete"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && isImage(file.filename) && (
        <div className="modal-backdrop" onClick={() => setShowPreview(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{file.filename}</h3>
              <button
                className="btn btn-ghost"
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <img
                src={`http://localhost:5000/${file.path.replace(/\\/g, '/')}`}
                alt={file.filename}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleDownload}>
                <FaDownload /> Download
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilePreview;