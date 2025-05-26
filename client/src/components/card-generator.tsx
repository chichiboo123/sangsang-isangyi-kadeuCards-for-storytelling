import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getShuffledPastelColors } from '@/lib/pastel-colors';

interface CardData {
  id: number;
  color: string;
  imageUrl: string | null;
  flipped: boolean;
}

interface CardGeneratorProps {
  onCardsGenerated: (cards: CardData[]) => void;
  cards?: CardData[];
  onCardFlip?: (id: number) => void;
}

export default function CardGenerator({ onCardsGenerated, cards = [], onCardFlip }: CardGeneratorProps) {
  const [cardCount, setCardCount] = useState(2);
  const [useRealPhotos, setUseRealPhotos] = useState(true);
  const [useIllustrations, setUseIllustrations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getPicsumImage = (): string => {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/200/300?random=${randomId}&t=${Date.now()}`;
  };

  const getIllustrationImage = (): string => {
    const illustrations = [
      '/src/assets/illustration1.png',
      '/src/assets/illustration2.png', 
      '/src/assets/illustration3.png',
      '/src/assets/illustration4.png',
      '/src/assets/illustration5.png',
      '/src/assets/illustration6.png',
      '/src/assets/illustration7.png',
      '/src/assets/illustration8.png',
      '/src/assets/illustration9.png',
      '/src/assets/illustration10.png',
      '/src/assets/illustration11.png',
      '/src/assets/illustration12.png',
      '/src/assets/illustration13.png',
      '/src/assets/illustration14.png',
      '/src/assets/illustration15.png'
    ];
    const randomIndex = Math.floor(Math.random() * illustrations.length);
    return `${illustrations[randomIndex]}?t=${Date.now()}`;
  };

  const getRandomImage = async (): Promise<string> => {
    if (!useRealPhotos && !useIllustrations) {
      throw new Error('이미지 타입을 최소 하나는 선택해주세요.');
    }

    if (useRealPhotos && useIllustrations) {
      const useReal = Math.random() > 0.5;
      return useReal ? getPicsumImage() : getIllustrationImage();
    } else if (useRealPhotos) {
      return getPicsumImage();
    } else {
      return getIllustrationImage();
    }
  };

  const generateCards = async () => {
    if (cardCount < 1 || cardCount > 20) {
      toast({
        title: "오류",
        description: "카드 개수는 1-20 사이로 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!useRealPhotos && !useIllustrations) {
      toast({
        title: "오류",
        description: "이미지 타입을 최소 하나는 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const shuffledColors = getShuffledPastelColors();
    const newCards: CardData[] = [];
    
    try {
      for (let i = 0; i < cardCount; i++) {
        const imageUrl = await getRandomImage();
        newCards.push({
          id: i,
          color: shuffledColors[i % shuffledColors.length],
          imageUrl: imageUrl,
          flipped: false
        });
      }

      onCardsGenerated(newCards);
      
      toast({
        title: "성공",
        description: `${cardCount}장의 카드가 생성되었습니다!`
      });
    } catch (error) {
      console.error('카드 생성 중 오류:', error);
      toast({
        title: "오류", 
        description: "카드 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  function adjustBrightness(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-do-hyeon text-center text-gray-800 mb-8">
          카드 개수 입력
        </h2>
        
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="cardCount" className="text-lg font-noto text-gray-700">
              카드 개수:
            </label>
            <input
              id="cardCount"
              type="number"
              min="1"
              max="20"
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-noto focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col items-center space-y-3">
            <p className="text-lg font-noto text-gray-700">이미지 종류 선택</p>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRealPhotos}
                  onChange={(e) => setUseRealPhotos(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="font-noto text-gray-700">실물사진</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useIllustrations}
                  onChange={(e) => setUseIllustrations(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="font-noto text-gray-700">일러스트</span>
              </label>
            </div>
          </div>

          <button
            onClick={generateCards}
            disabled={isGenerating || cardCount < 1 || cardCount > 20}
            className={`
              px-8 py-3 rounded-full font-noto text-lg font-medium transition-all duration-200
              ${isGenerating 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            {isGenerating ? '생성 중...' : '카드 만들기'}
          </button>
        </div>
      </div>

      {/* Card Display Section */}
      {cards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
          {cards.map((card) => (
            <div key={card.id} className="relative">
              <div
                onClick={() => onCardFlip && onCardFlip(card.id)}
                className="w-[200px] h-[300px] rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 transform-gpu shadow-lg"
                style={{
                  background: card.flipped ? '#ffffff' : `linear-gradient(135deg, ${card.color}, ${adjustBrightness(card.color, -10)})`
                }}
              >
                {card.flipped ? (
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        className="w-full h-full object-cover rounded-2xl"
                        alt="Story card"
                        onError={(e) => {
                          console.error('Image failed to load:', card.imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-2xl mb-2">❌</div>
                          <div className="text-xs font-noto">이미지 없음</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-2xl">
                    <div className="text-xs font-noto text-gray-700 opacity-70">클릭해서 뒤집기</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}