import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface CarouselProps {
  children: ReactNode[];
  itemWidth?: number;
  className?: string;
  showDots?: boolean;
  label?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, itemWidth = 260, className = '', showDots = true, label = 'Services' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState([0]);
  const [activePage, setActivePage] = useState(0);
  const [position, setPosition] = useState(0);
  const { pauseAnimations } = useAccessibility();

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const measure = () => {
      const card = element.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(element).gap) || 20;
      const stride = (card?.getBoundingClientRect().width || itemWidth) + gap;
      const visibleCards = Math.max(1, Math.floor((element.clientWidth + gap - 8) / stride));
      const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
      const offsets = [0];
      for (let offset = stride * visibleCards; offset < maxScroll - 1; offset += stride * visibleCards) offsets.push(offset);
      if (maxScroll > 1) offsets.push(maxScroll);
      setPages(offsets);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [children.length, itemWidth]);

  useEffect(() => {
    setActivePage(pages.reduce((nearest, offset, index) => Math.abs(offset - position) < Math.abs(pages[nearest] - position) ? index : nearest, 0));
  }, [pages, position]);

  const goTo = (page: number) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollRef.current?.scrollTo({ left: pages[Math.max(0, Math.min(page, pages.length - 1))], behavior: pauseAnimations || reduced ? 'instant' : 'smooth' });
  };

  return (
    <div className={`relative ${className}`} role="region" aria-label={label} aria-roledescription="carousel">
      <div ref={scrollRef} onScroll={event => setPosition(event.currentTarget.scrollLeft)}
        className="flex items-stretch gap-5 overflow-x-auto py-3 px-1 no-scrollbar"
        tabIndex={0} aria-label={`${label} cards, use left and right arrow keys to browse`}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(activePage + (event.key === 'ArrowRight' ? 1 : -1)); }
        }}>
        {children}
      </div>
      {pages.length > 1 && <>
        <button onClick={() => goTo(activePage - 1)} disabled={position < 1} aria-label="Previous slide" className="carousel-arrow left-0 -translate-x-3"><ChevronLeft size={20} /></button>
        <button onClick={() => goTo(activePage + 1)} disabled={position >= pages[pages.length - 1] - 1} aria-label="Next slide" className="carousel-arrow right-0 translate-x-3"><ChevronRight size={20} /></button>
      </>}
      {showDots && pages.length > 1 && <div className="flex items-center justify-center flex-wrap mt-3">
        {pages.map((offset, index) => <button key={offset} onClick={() => goTo(index)} aria-label={`Go to page ${index + 1}`} aria-current={activePage === index ? 'page' : undefined} className="h-8 w-8 flex items-center justify-center">
          <span className={`h-2 rounded-full ${activePage === index ? 'w-6 bg-gov-blue' : 'w-2 bg-slate-300'}`} />
        </button>)}
      </div>}
    </div>
  );
};
