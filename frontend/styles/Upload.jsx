import { useState, useRef } from 'react';
import { AppHeader, BottomNav } from '../components/Layout.jsx';
import { Card, CardBody, Button, Alert } from '../components/UI.jsx';
import { api } from '../api';
import '../styles/global.css';

export default function Upload() {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/') && f.type !== 'application/pdf') {
      setError('이미지 또는 PDF 파일만 업로드 가능합니다.');
      return;
    }
    setFile(f);
    setError('');
    setResult(null);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/upload', form);
      setResult(res.data.file);
      setFile(null); setPreview(null);
    } catch {
      setError('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: 'var(--color-bg-subtle)', minHeight: '100vh' }}>
      <AppHeader title="처방전 업로드" />

      <main className="page-content page-container" style={{ maxWidth: 560 }}>
        {/* Info Card */}
        <Card className="mb-6" style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)' }}>
          <CardBody size="sm">
            <div className="flex gap-3">
              <span style={{ fontSize: 20 }}>ℹ️</span>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--teal-800)' }}>
                  처방전 안내
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--teal-700)', marginTop: 4, lineHeight: 1.6 }}>
                  처방전 이미지(JPG, PNG) 또는 PDF를 업로드해주세요. 개인정보는 안전하게 암호화 처리됩니다.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Upload Area */}
        <Card className="mb-4">
          <CardBody>
            {result ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>✅</div>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-success-text)' }}>
                  업로드 완료!
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                  처방전이 안전하게 저장되었습니다
                </p>
                <Button variant="secondary" size="sm"
                  style={{ marginTop: 'var(--space-6)' }}
                  onClick={() => { setResult(null); }}
                >
                  다시 업로드
                </Button>
              </div>
            ) : (
              <>
                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => !file && inputRef.current?.click()}
                  style={{
                    border: `2px dashed ${file ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-8) var(--space-6)',
                    textAlign: 'center', cursor: file ? 'default' : 'pointer',
                    background: file ? 'var(--teal-50)' : 'var(--color-bg-subtle)',
                    transition: 'all var(--transition-base)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {preview ? (
                    <img src={preview} alt="미리보기"
                      style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 'var(--radius-lg)', margin: '0 auto' }}
                    />
                  ) : file ? (
                    <div>
                      <div style={{ fontSize: 40, marginBottom: 'var(--space-2)' }}>📄</div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-primary)' }}>
                        {file.name}
                      </p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 48, marginBottom: 'var(--space-3)' }}>📎</div>
                      <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                        파일을 여기에 드래그하거나 클릭하세요
                      </p>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                        JPG, PNG, PDF 지원 · 최대 10MB
                      </p>
                    </div>
                  )}
                </div>

                <input ref={inputRef} type="file" accept="image/*,.pdf" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />

                {error && <Alert type="danger" className="mb-4">⚠️ {error}</Alert>}

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  {file && (
                    <Button variant="ghost" full onClick={() => { setFile(null); setPreview(null); }}>
                      취소
                    </Button>
                  )}
                  <Button
                    variant={file ? 'primary' : 'secondary'}
                    full loading={uploading}
                    disabled={!file}
                    onClick={file ? handleUpload : () => inputRef.current?.click()}
                  >
                    {file ? '처방전 업로드' : '파일 선택'}
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
