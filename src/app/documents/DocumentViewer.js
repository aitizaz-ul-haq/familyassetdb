"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function DocumentViewer({ fileUrl, fileType, label }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const isPDF = fileType === 'pdf';
  const isImage = ['jpeg', 'jpg', 'png'].includes(fileType);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        color: 'white',
      }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{label}</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isPDF && (
            <>
              <button
                onClick={() => setScale(scale - 0.2)}
                disabled={scale <= 0.5}
                style={{
                  background: '#7FC6A4',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Zoom Out
              </button>
              <span>{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(scale + 0.2)}
                disabled={scale >= 2}
                style={{
                  background: '#7FC6A4',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Zoom In
              </button>
            </>
          )}
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#2196F3',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
            }}
          >
            Open Original
          </a>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#ef5350',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
        borderRadius: '8px',
        padding: '1rem',
      }}>
        {isImage && (
          <img
            src={fileUrl}
            alt={label}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )}

        {isPDF && (
          <>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div style={{ padding: '2rem', color: '#666' }}>
                  Loading PDF...
                </div>
              }
              error={
                <div style={{ padding: '2rem', color: '#c62828' }}>
                  Failed to load PDF. <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3' }}>Open in new tab</a>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>

            {numPages && (
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                color: '#333',
              }}>
                <button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber <= 1}
                  style={{
                    background: '#7FC6A4',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Previous
                </button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={pageNumber >= numPages}
                  style={{
                    background: '#7FC6A4',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {!isImage && !isPDF && (
          <div style={{ padding: '2rem', color: '#666', textAlign: 'center' }}>
            <p>Preview not available for this file type.</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#2196F3',
                marginTop: '1rem',
                display: 'inline-block',
              }}
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
