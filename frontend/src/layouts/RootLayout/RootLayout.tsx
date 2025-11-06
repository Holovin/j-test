import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useHeader } from '@/contexts/useHeader';
import Header from '@/components/Header/Header';

function RootLayout() {
  const { isLoading, meta, setMeta } = useHeader();

  useEffect(() => {
    setMeta(['first load', 'demo']);
  }, [setMeta]);

  return (
    <>
      <Header title={'Instapoke'} isLoading={isLoading} meta={meta} />
      <Outlet />
    </>
  );
}

export default RootLayout;
