import { getBaseUrl } from '@/api';
import TagList from '@/components/TagList/TagList';
import './Image.css';

interface ImageProps {
  name: string;
  src: string;
  tags: string[];
  onTagClick?: (tag: string) => void;
}

function Image({ name, src, tags = [], onTagClick }: ImageProps) {
  return (
    <div className='image-card'>
      <img className='image-card__image' src={`${getBaseUrl()}${src}`} alt={name} />
      <div className='image-card__description'>
        {name}
        <TagList tags={tags} onTagClick={onTagClick} />
      </div>
    </div>
  );
}

export default Image;
