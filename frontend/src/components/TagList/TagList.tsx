import { useRef, useState, type MouseEvent } from 'react';
import './TagList.css';

interface TagListProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

function TagList({ tags = [], onTagClick }: TagListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setHasMoved(false);

    setStartX(e.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    e.preventDefault();
    setHasMoved(true);

    const x = e.pageX - containerRef.current!.offsetLeft;
    const moveTo = (x - startX) * 2;
    containerRef.current!.scrollLeft = scrollLeft - moveTo;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTagClick = (tag: string) => {
    if (hasMoved) {
      return;
    }

    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className='tag-list'>
      <div
        className='tag-list__container'
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {
          tags.map(tag =>
            <button
              className='tag-list__button'
              onClick={() => handleTagClick(tag)}
              key={tag}
            >
              {tag}
            </button>
          )
        }
      </div>
    </div>
  );
}

export default TagList;
