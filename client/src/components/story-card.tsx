import { useState } from 'react';
import { motion } from 'framer-motion';

interface StoryCardProps {
  id: number;
  backgroundColor: string;
  emoji: string;
  onFlip: (id: number) => void;
  imageUrl: string | null;
  isFlipped: boolean;
  isLoading?: boolean;
}

export default function StoryCard({
  id,
  backgroundColor,
  emoji,
  onFlip,
  imageUrl,
  isFlipped,
  isLoading = false
}: StoryCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (!isFlipped) {
      onFlip(id);
    }
  };

  const adjustBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  return (
    <div className="card-item group cursor-pointer" onClick={handleCardClick}>
      <div className="relative w-full aspect-[3/4] perspective-1000">
        <motion.div
          className={`card-inner absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'flipped' : ''
          }`}
          whileHover={!isFlipped ? { rotateY: 5, rotateX: 5 } : {}}
          transition={{ duration: 0.2 }}
        >
          {/* Card Back */}
          <div
            className="card-face card-back absolute inset-0 w-full h-full rounded-2xl shadow-lg backface-hidden flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${backgroundColor}, ${adjustBrightness(backgroundColor, -10)})`
            }}
          >
            <div className="text-center flex items-center justify-center w-full h-full">
              <img 
                src="data:image/png;base64,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" 
                alt="Little Prince Character" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          {/* Card Front */}
          <div className="card-face card-front absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg backface-hidden rotate-y-180 overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-2xl mb-2 animate-spin">🔄</div>
                  <div className="text-xs font-noto">이미지 로딩중...</div>
                </div>
              </div>
            ) : imageUrl && !imageError ? (
              <img
                src={imageUrl}
                className="w-full h-full object-cover rounded-2xl"
                alt="Random story card image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-2xl mb-2">❌</div>
                  <div className="text-xs font-noto">
                    이미지 로딩 실패
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
