import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import AppHeader from '../components/AppHeader';
import BottomTab from '../components/BottomTab';
import theme from '../styles/theme';
import { API_BASE } from '../config';

const samplePrescription = {
  type: '건강보험',
  issueDate: '2026-03-23',
  validDays: 7,
  patientName: '백○례',
  patientIdMasked: '381201-2******',
  diseaseCode: 'H2511 / H5220',
  doctorName: '조상현',
  doctorLicense: '78560',
  hospitalName: '세종우리성모안과',
  hospitalPhone: '044-864-3370',
  hospitalFax: '044-864-3394',
  pharmacyNote: '사용기간 내 약국에 제출해야 합니다.',
  medicines: [
    {
      code: '649401314',
      name: '[이연]아루엔점안액(히알우론산나트륨)',
      dose: '1.0000',
      timesPerDay: '1.0',
      days: '1',
      usage: '수시로 점안',
    },
    {
      code: '6501002',
      name: '[이연]듀티브이점안액0.1%(플루오로메톨론)',
      dose: '1.0000',
      timesPerDay: '1.0',
      days: '1',
      usage: '1일 4회 점안',
    },
  ],
};

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        border: '1px solid #E9EEF5',
        borderRadius: 18,
        padding: 16,
        background: '#fff',
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: theme.colors.text,
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  border: '1px solid #E1E8F0',
  borderRadius: 14,
  padding: '12px 14px',
  fontSize: 14,
  outline: 'none',
  color: '#111827',
  background: '#FCFDFE',
  boxSizing: 'border-box',
};

export default function PrescriptionPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState('');
  const [ocrReady, setOcrReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(samplePrescription);

  const summaryText = useMemo(() => {
    return `${form.patientName || '-'} / ${form.hospitalName || '-'} / 약 ${form.medicines.length}건`;
  }, [form]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOcrReady(true);
    setMessage('처방전 이미지가 업로드되었습니다.');
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMedicineChange = (index, key, value) => {
    setForm((prev) => {
      const next = [...prev.medicines];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      return {
        ...prev,
        medicines: next,
      };
    });
  };

  const addMedicineRow = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        {
          code: '',
          name: '',
          dose: '',
          timesPerDay: '',
          days: '',
          usage: '',
        },
      ],
    }));
  };

  const removeMedicineRow = (index) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitPrescription = async () => {
    if (!form.patientName?.trim()) {
      alert('환자명을 입력하세요.');
      return;
    }

    if (!form.hospitalName?.trim()) {
      alert('병원명을 입력하세요.');
      return;
    }

    const validMedicines = form.medicines.filter((item) => item.name?.trim());
    if (validMedicines.length === 0) {
      alert('약품을 1개 이상 입력하세요.');
      return;
    }

    try {
      setSubmitting(true);
      setMessage('');

      const { value: token } = await Preferences.get({ key: 'token' });

      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const payload = {
        patientName: form.patientName,
        patientIdMasked: form.patientIdMasked,
        hospitalName: form.hospitalName,
        hospitalPhone: form.hospitalPhone,
        doctorName: form.doctorName,
        doctorLicense: form.doctorLicense,
        diseaseCode: form.diseaseCode,
        issueDate: form.issueDate,
        validDays: form.validDays,
        type: form.type,
        pharmacyNote: form.pharmacyNote,
        medicines: validMedicines,
        previewUrl,
      };

      console.log('처방전 접수 payload:', payload);

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prescription: payload,
          pharmacyName: form.hospitalName,
          orderType: 'prescription',
        }),
      });

      const data = await res.json();
      console.log('처방전 접수 응답:', data);

      if (!res.ok || !data.success) {
        alert(data.message || '처방전 접수에 실패했습니다.');
        setMessage(data.message || '처방전 접수 실패');
        return;
      }

      alert('처방전이 접수되었습니다.');
      setMessage('처방전 접수 완료');
      navigate('/orders');
    } catch (error) {
      console.error('처방전 접수 오류:', error);
      alert(`처방전 접수 오류: ${error.message}`);
      setMessage(`처방전 접수 오류: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background,
        maxWidth: theme.layout.maxWidth,
        margin: '0 auto',
        paddingBottom: theme.layout.bottomTabHeight,
      }}
    >
      <AppHeader title="처방전" />

      <div
        style={{
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
            borderRadius: 24,
            padding: 20,
            color: '#fff',
            boxShadow: theme.shadow.card,
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 8 }}>
            처방전 등록
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            사진 업로드 후 접수
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.95 }}>
            처방전 사진을 올리고 내용을 확인한 뒤 주문으로 접수합니다.
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 16,
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 16,
                padding: '14px 16px',
                background: '#fff',
                color: '#2F80ED',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              처방전 사진 업로드
            </button>

            <button
              onClick={() => {
                setPreviewUrl('');
                setOcrReady(false);
                setMessage('샘플 데이터로 초기화했습니다.');
                setForm(samplePrescription);
              }}
              style={{
                flex: 1,
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: 16,
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              샘플로 초기화
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 24,
            border: '1px solid #E7ECF3',
            boxShadow: theme.shadow.soft,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 18px',
              borderBottom: '1px solid #EEF2F7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                업로드 이미지
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: theme.colors.subtext,
                  marginTop: 4,
                }}
              >
                {previewUrl
                  ? '업로드된 처방전 이미지'
                  : '아직 업로드된 이미지 없음'}
              </div>
            </div>

            <div
              style={{
                background: ocrReady ? '#ECFDF3' : '#F4F6F8',
                color: ocrReady ? '#027A48' : '#667085',
                borderRadius: 999,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {ocrReady ? '업로드 완료' : '업로드 대기'}
            </div>
          </div>

          <div style={{ padding: 16, background: '#F8FAFD' }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="처방전 미리보기"
                style={{
                  width: '100%',
                  borderRadius: 18,
                  display: 'block',
                  objectFit: 'contain',
                  maxHeight: 640,
                  background: '#fff',
                  border: '1px solid #E6ECF3',
                }}
              />
            ) : (
              <div
                style={{
                  minHeight: 280,
                  borderRadius: 18,
                  border: '1px dashed #D7E0EB',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: theme.colors.subtext,
                  textAlign: 'center',
                  padding: 20,
                }}
              >
                <div style={{ fontSize: 42, marginBottom: 10 }}>📄</div>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  처방전 이미지를 업로드하세요
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  업로드 후 내용을 확인하고 바로 접수할 수 있습니다.
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 28,
            boxShadow: theme.shadow.soft,
            overflow: 'hidden',
            border: '1px solid #E7ECF3',
          }}
        >
          <div
            style={{
              padding: '22px 22px 16px',
              borderBottom: '1px solid #EEF2F7',
              background:
                'linear-gradient(180deg, rgba(47,128,237,0.06) 0%, rgba(255,255,255,1) 100%)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: theme.colors.subtext,
                    marginBottom: 8,
                  }}
                >
                  접수 정보
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: theme.colors.text,
                  }}
                >
                  처 방 전
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: theme.colors.subtext,
                  }}
                >
                  {summaryText}
                </div>
              </div>

              <div
                style={{
                  background: '#F4F8FD',
                  border: '1px solid #E1EAF5',
                  borderRadius: 18,
                  padding: '12px 14px',
                  minWidth: 150,
                }}
              >
                <div style={{ fontSize: 12, color: theme.colors.subtext }}>
                  보험유형
                </div>
                <input
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  style={{
                    marginTop: 6,
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 16,
                    fontWeight: 800,
                    color: theme.colors.primary,
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <SectionCard title="환자 정보">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.colors.subtext,
                        marginBottom: 6,
                      }}
                    >
                      성명
                    </div>
                    <input
                      value={form.patientName}
                      onChange={(e) =>
                        handleChange('patientName', e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.colors.subtext,
                        marginBottom: 6,
                      }}
                    >
                      주민등록번호
                    </div>
                    <input
                      value={form.patientIdMasked}
                      onChange={(e) =>
                        handleChange('patientIdMasked', e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="발행 정보">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.colors.subtext,
                        marginBottom: 6,
                      }}
                    >
                      교부일자
                    </div>
                    <input
                      value={form.issueDate}
                      onChange={(e) =>
                        handleChange('issueDate', e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.colors.subtext,
                        marginBottom: 6,
                      }}
                    >
                      사용기한(일)
                    </div>
                    <input
                      value={form.validDays}
                      onChange={(e) =>
                        handleChange('validDays', e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>
              </SectionCard>
            </div>

            <SectionCard title="의료기관 정보">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: 180 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.subtext,
                      marginBottom: 6,
                    }}
                  >
                    요양기관명
                  </div>
                  <input
                    value={form.hospitalName}
                    onChange={(e) =>
                      handleChange('hospitalName', e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 140 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.subtext,
                      marginBottom: 6,
                    }}
                  >
                    전화번호
                  </div>
                  <input
                    value={form.hospitalPhone}
                    onChange={(e) =>
                      handleChange('hospitalPhone', e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 140 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.subtext,
                      marginBottom: 6,
                    }}
                  >
                    팩스번호
                  </div>
                  <input
                    value={form.hospitalFax}
                    onChange={(e) =>
                      handleChange('hospitalFax', e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginTop: 14,
                }}
              >
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.subtext,
                      marginBottom: 6,
                    }}
                  >
                    처방의
                  </div>
                  <input
                    value={form.doctorName}
                    onChange={(e) => handleChange('doctorName', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 120 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.subtext,
                      marginBottom: 6,
                    }}
                  >
                    면허번호
                  </div>
                  <input
                    value={form.doctorLicense}
                    onChange={(e) =>
                      handleChange('doctorLicense', e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 2, minWidth: 180 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.subtext,
                      marginBottom: 6,
                    }}
                  >
                    진단코드
                  </div>
                  <input
                    value={form.diseaseCode}
                    onChange={(e) =>
                      handleChange('diseaseCode', e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            </SectionCard>

            <div
              style={{
                border: '1px solid #E9EEF5',
                borderRadius: 18,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  fontSize: 14,
                  fontWeight: 800,
                  color: theme.colors.text,
                  borderBottom: '1px solid #EEF2F7',
                  background: '#FAFCFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <span>약품 내역</span>
                <button
                  onClick={addMedicineRow}
                  style={{
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 12px',
                    background: '#EEF6FF',
                    color: theme.colors.primary,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  + 약품 추가
                </button>
              </div>

              <div
                style={{
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {form.medicines.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #EDF2F7',
                      borderRadius: 16,
                      padding: 14,
                      background: '#FCFDFE',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                        gap: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: theme.colors.subtext,
                        }}
                      >
                        약품 #{idx + 1}
                      </div>
                      <button
                        onClick={() => removeMedicineRow(idx)}
                        style={{
                          border: 'none',
                          borderRadius: 10,
                          padding: '8px 10px',
                          background: '#FFF1F3',
                          color: '#D92D20',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        삭제
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            color: theme.colors.subtext,
                            marginBottom: 6,
                          }}
                        >
                          약품명
                        </div>
                        <input
                          value={item.name}
                          onChange={(e) =>
                            handleMedicineChange(idx, 'name', e.target.value)
                          }
                          style={inputStyle}
                        />
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr 1.4fr 1fr',
                          gap: 10,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.colors.subtext,
                              marginBottom: 6,
                            }}
                          >
                            코드
                          </div>
                          <input
                            value={item.code}
                            onChange={(e) =>
                              handleMedicineChange(idx, 'code', e.target.value)
                            }
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.colors.subtext,
                              marginBottom: 6,
                            }}
                          >
                            1회 투약량
                          </div>
                          <input
                            value={item.dose}
                            onChange={(e) =>
                              handleMedicineChange(idx, 'dose', e.target.value)
                            }
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.colors.subtext,
                              marginBottom: 6,
                            }}
                          >
                            1일 횟수
                          </div>
                          <input
                            value={item.timesPerDay}
                            onChange={(e) =>
                              handleMedicineChange(
                                idx,
                                'timesPerDay',
                                e.target.value,
                              )
                            }
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.colors.subtext,
                              marginBottom: 6,
                            }}
                          >
                            용법
                          </div>
                          <input
                            value={item.usage}
                            onChange={(e) =>
                              handleMedicineChange(idx, 'usage', e.target.value)
                            }
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.colors.subtext,
                              marginBottom: 6,
                            }}
                          >
                            총 일수
                          </div>
                          <input
                            value={item.days}
                            onChange={(e) =>
                              handleMedicineChange(idx, 'days', e.target.value)
                            }
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SectionCard title="복약 / 제출 안내">
              <textarea
                value={form.pharmacyNote}
                onChange={(e) => handleChange('pharmacyNote', e.target.value)}
                style={{
                  width: '100%',
                  minHeight: 110,
                  border: '1px solid #E1E8F0',
                  borderRadius: 14,
                  padding: 14,
                  fontSize: 14,
                  outline: 'none',
                  resize: 'vertical',
                  color: theme.colors.text,
                  background: '#FCFDFE',
                  boxSizing: 'border-box',
                }}
              />
            </SectionCard>

            <div
              style={{
                background: '#F8FAFD',
                border: '1px solid #E6ECF3',
                borderRadius: 16,
                padding: 14,
                fontSize: 14,
                color: theme.colors.subtext,
              }}
            >
              {message || '처방전 정보를 확인한 뒤 접수하기를 눌러주세요.'}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSubmitPrescription}
                disabled={submitting}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: 16,
                  padding: '15px 16px',
                  background: submitting
                    ? '#93C5FD'
                    : 'linear-gradient(135deg, #2F80ED, #56CCF2)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? '접수 중...' : '처방전 접수하기'}
              </button>

              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  flex: 1,
                  border: '1px solid #DCE5EF',
                  borderRadius: 16,
                  padding: '15px 16px',
                  background: '#fff',
                  color: theme.colors.text,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                이미지 다시 업로드
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomTab />
    </div>
  );
}
