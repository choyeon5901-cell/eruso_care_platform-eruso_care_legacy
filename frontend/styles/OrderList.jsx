import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, BottomNav } from '../components/Layout.jsx';
import { Card, CardBody, StatusBadge, Skeleton, EmptyState, Button, StepProgress } from '../components/UI.jsx';
import { api } from '../api';
import '../styles/global.css';

const STEPS = ['접수', '조제중', '완료'];

function getStepIndex(status) {
  return STEPS.indexOf(status);
}

export default function OrderList() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('전체');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.reverse());
    } catch {}
    finally { setLoading(false); }
  };

  const FILTERS = ['전체', '진행중', '완료'];
  const filtered = orders.filter(o => {
    if (filter === '전체') return true;
    if (filter === '진행중') return o.status !== '완료' && o.status !== '취소';
    if (filter === '완료') return o.status === '완료';
    return true;
  });

  return (
    <div style={{ background: 'var(--color-bg-subtle)', minHeight: '100vh' }}>
      <AppHeader title="주문 내역" />

      <main className="page-content page-container">
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', overflowX: 'auto', paddingBottom: 2 }}>
          {FILTERS.map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px', border: '1.5px solid',
                borderColor: filter === f ? 'var(--color-primary)' : 'var(--color-border)',
                borderRadius: 'var(--radius-full)',
                background: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
                color: filter === f ? '#fff' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all var(--transition-base)',
              }}
            >{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[1,2,3].map(i => <OrderSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title="주문 내역이 없습니다"
            description="약국을 찾아 처방약을 예약해보세요"
            action={<Button variant="primary" size="sm" onClick={() => navigate('/map')}>약국 찾기</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} onClick={() => navigate(`/orders/${order.id}`)} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function OrderCard({ order, onClick }) {
  const stepIdx = getStepIndex(order.status);
  return (
    <Card hover onClick={onClick}>
      <CardBody>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-lg)',
              background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>🏥</div>
            <div>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
                {order.pharmacyName || '약국 정보 없음'}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                주문 #{order.id}
              </p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Step Progress */}
        {order.status !== '취소' && (
          <div style={{ padding: 'var(--space-3) var(--space-2)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <StepProgress steps={STEPS} currentStep={stepIdx} />
          </div>
        )}

        {order.status === '취소' && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-2)' }}>
            이 주문은 취소되었습니다.
          </p>
        )}
      </CardBody>
    </Card>
  );
}

function OrderSkeleton() {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton circle width={44} height={44} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton width={120} height={16} />
              <Skeleton width={80} height={12} />
            </div>
          </div>
          <Skeleton width={60} height={22} style={{ borderRadius: 999 }} />
        </div>
        <Skeleton height={52} className="skeleton-rect" />
      </CardBody>
    </Card>
  );
}
