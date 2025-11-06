import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Routes } from '../../routes/paths.ts';
import './Header.css';

interface HeaderProps {
  title?: string;
  isLoading: boolean;
  meta: string[];
}

function Header({ title, meta, isLoading }: HeaderProps) {
  const loadingTickIntervalRef = useRef<number | null>(null);
  const loadingEndDelayRef = useRef<number | null>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tracker = trackerRef.current;
    if (!tracker) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        setIsFixed(!entry.isIntersecting);
      }
    }, { threshold: 0 });

    observer.observe(tracker);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setIsVisible(true);

      loadingTickIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return 95;
          }

          return prev + 5;
        });
      }, 100);
    } else {
      setProgress(100);
      loadingEndDelayRef.current = setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      if (loadingEndDelayRef.current !== null) {
        clearTimeout(loadingEndDelayRef.current);
        loadingEndDelayRef.current = null;
      }

      if (loadingTickIntervalRef.current !== null) {
        clearInterval(loadingTickIntervalRef.current);
        loadingTickIntervalRef.current = null;
      }
    };
  }, [isLoading]);

  return (
    <>
      <div ref={trackerRef} style={{ position: 'absolute', top: 0, height: '32px', width: '1px' }} />
      <header className={classNames('header', { 'header_fixed': isFixed })}>
        {isVisible && (
          <div className="header__progress-bar">
            <div
              className="header__progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <NavLink to={Routes.root()} className='header__main'>
          { title }
        </NavLink>

        <nav className='header__nav'>
          <NavLink to={Routes.images()} className={({ isActive }) => classNames('header__nav-link', { 'header__nav-link_active': isActive })}>Images (VirtualGrid)</NavLink>

          <a href={Routes.docs()} className='header__nav-link' target="_blank" rel="noopener noreferrer">Swagger ↗</a>
        </nav>

        <div className='header__meta'>
          { meta.map((line => <p className='header__meta-line' key={line}>{line}</p>)) }
        </div>
      </header>
    </>
  );
}

export default Header;
