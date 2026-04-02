import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import BottomTab from '../components/BottomTab';
import MenuListItem from '../components/MenuListItem';
import theme from '../styles/theme';

export default function MenuPage() {
  const navigate = useNavigate();

  const goInfo = (title) => {
    navigate('/info', { state: { title } });
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
      <AppHeader title="메뉴" />

      <div style={{ padding: 18 }}>
        <MenuListItem
          title="이벤트"
          subtitle="진행 중인 혜택과 프로모션"
          onClick={() => goInfo('이벤트')}
        />
        <MenuListItem
          title="주문내역"
          subtitle="배송 및 결제 내역 확인"
          onClick={() => navigate('/orders')}
        />
        <MenuListItem
          title="포인트 충전 및 사용내역"
          subtitle="포인트 충전, 사용 기록 확인"
          onClick={() => goInfo('포인트 충전 및 사용내역')}
        />
        <MenuListItem
          title="마이페이지"
          subtitle="내 정보 및 서비스 설정"
          onClick={() => navigate('/mypage')}
        />
      </div>

      <BottomTab />
    </div>
  );
}
