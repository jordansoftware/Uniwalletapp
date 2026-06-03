
import React, { useState } from 'react';
import { CardData } from '../types';
import IDCard from './IDCard';

interface CarouselProps {
  cards: CardData[];
  onIndexChange: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ cards, onIndexChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const [isSwiping, setIsSwiping] = useState(false);
  const [offset, setOffset] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {

    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    setOffset(-diff);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    setIsSwiping(false);
    if (touchStart === null) {
      setOffset(0);
      return;
    }

    const touchEndClientX = e.changedTouches[0].clientX;
    const distance = touchStart - touchEndClientX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < cards.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onIndexChange(next);
    } else if (isRightSwipe && currentIndex > 0) {
      const next = currentIndex - 1;
      setCurrentIndex(next);
      onIndexChange(next);
    }

    setOffset(0);
    setTouchStart(null);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex w-full h-full"
        style={{
          transform: `translateX(calc(-${currentIndex * 85}% + ${offset}px + 7.5%))`,
          transition: isSwiping ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className="w-[85%] flex-shrink-0 px-3 py-4 box-border h-full flex items-center justify-center"
          >
            <div
              className={`w-full h-full max-w-[400px] max-h-[600px] transition-all duration-500 ${idx !== currentIndex
                  ? 'scale-[0.85] opacity-40 blur-[1px] dark:blur-[2px]'
                  : 'scale-100 opacity-100 blur-0'
                }`}
            >
              <IDCard data={card} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
