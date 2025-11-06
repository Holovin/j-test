import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useHeader } from '../../contexts/useHeader.ts';
import Header from '../../components/Header/Header.tsx';

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
