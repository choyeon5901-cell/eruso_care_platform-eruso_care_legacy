import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { AppHeader, BottomNav, SectionHeader } from '../components/Layout.jsx';
import { Card, CardBody, StatusBadge, Skeleton, EmptyState, Button } from '../components/UI.jsx';
import '../styles/global.css';

const QUICK_ACTIONS = [
  { icon: '🗺️', label: '약국 찾기',    path: '/map',    color: 'var(--teal-50)',    accent: 'var(--teal-600)' },
  { icon: '📄', label: '처방전 업로드', path: '/upload', color: 'var(--blue-100)',  accent: 'var(--blue-500)' },
  { icon: '📋', label: '내 주문',       path: '/orders', color: 'var(--amber-100)', accent: 'var(--amber-500)' },
  { icon: '💬', label: '고객센터',      path: '/support',color: 'var(--rose-100)',  accent: 'var(--rose-500)' },
];

const STATUS_STEPS = ['접수', '조제중', '완료'];

export default function Home() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    api.get('/orders')
      .then(r => setOrders(r.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const recentOrder = orders[0];
  const pendingCount = orders.filter(o => o.status !== '완료' && o.status !== '취소').length;

  return (
    <div style={{ background: 'var(--color-bg-subtle)', minHeight: '100vh' }}>
      <AppHeader />

      <main className="page-content page-container">
        {/* Greeting */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>안녕하세요 👋</p>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', letterSpacing: '-0.02em', marginTop: 4 }}>
            오늘도 건강한 하루 되세요
          </h2>
        </div>

        {/* Active Order Banner */}
        {recentOrder && recentOrder.status !== '완료' && (
          <Card className="mb-6" style={{ background: 'linear-gradient(135deg, var(--teal-600), var(--teal-800))', border: 'none' }}>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>진행 중인 주문</p>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: '#fff' }}>
                    {recentOrder.pharmacyName}
                  </p>
                </div>
                <span style={{ fontSize: 32 }}>💊</span>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-3)' }}>
                {STATUS_STEPS.map((step, i) => {
                  const idx = STATUS_STEPS.indexOf(recentOrder.status);
                  const filled = i <= idx;
                  return (
                    <div key={step} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: filled ? '#fff' : 'rgba(255,255,255,0.3)',
                      transition: 'background 0.3s',
                    }} />
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.8)' }}>
                  {recentOrder.status} 단계
                </span>
                <button
                  onClick={() => navigate('/orders')}
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: '#fff', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 'var(--radius-full)', padding: '4px 12px', cursor: 'pointer' }}
                >
                  자세히 보기 →
                </button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Quick Actions */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <SectionHeader title="바로가기" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
            {QUICK_ACTIONS.map(({ icon, label, path, color, accent }) => (
              <button key={path} onClick={() => navigate(path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
                  padding: 'var(--space-4) var(--space-2)',
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)', cursor: 'pointer',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)', lineHeight: 1.3, textAlign: 'center' }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <SectionHeader title="최근 주문" link="전체보기" onLinkClick={() => navigate('/orders')} />

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[1,2,3].map(i => (
                <Card key={i}>
                  <CardBody size="sm" style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Skeleton circle width={44} height={44} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <Skeleton className="skeleton-title" width="60%" height={18} />
                      <Skeleton className="skeleton-text" width="40%" height={14} />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon="📋"
              title="주문 내역이 없습니다"
              description="가까운 약국을 찾아 처방약을 예약해보세요"
              action={
                <Button variant="primary" size="sm" onClick={() => navigate('/map')}>
                  약국 찾기
                </Button>
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {orders.map(order => (
                <Card key={order.id} hover onClick={() => navigate(`/orders/${order.id}`)}>
                  <CardBody size="sm">
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                        background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                      }}>🏥</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.pharmacyName || '약국'}
                          </p>
                          <StatusBadge status={order.status} />
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 3 }}>
                          주문번호 #{order.id}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav pendingCount={pendingCount} />
    </div>
  );
}
