import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import './MainPage.css';

function MainPage() {
  const queryClient = useQueryClient();
  const [isCacheCleared, setIsCacheCleared] = useState(false);

  const resetCache = () => {
    queryClient.removeQueries();
    setIsCacheCleared(true);
  }

  return (
    <div className='main-page'>
      <div className='main-page__info'>
        Use header for navigation :)
      </div>

      <div className='main-page__info'>
        [Debug] Click to reset query cache:&nbsp;
        <button onClick={resetCache} disabled={isCacheCleared}>
          {isCacheCleared ? 'Cleared' : 'Reset'}
        </button>
      </div>
    </div>
  )
}

export default MainPage;
