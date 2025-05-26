import { useState } from 'react';
import CardGenerator from '@/components/card-generator';
import StoryWriter from '@/components/story-writer';

function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

interface CardData {
  id: number;
  color: string;
  imageUrl: string | null;
  flipped: boolean;
}

export default function Home() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [showStorySection, setShowStorySection] = useState(false);
  const flippedCards = cards.filter(card => card.flipped);

  const handleCardFlip = (id: number) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );
  };

  const handleCardsGenerated = (newCards: CardData[]) => {
    setCards(newCards);
    setShowStorySection(true);
  };

  const resetCards = () => {
    const confirmed = window.confirm("모든 내용이 사라집니다. 처음 화면으로 이동하시겠습니까?");
    if (confirmed) {
      setCards([]);
      setShowStorySection(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-pastel-sky via-pastel-yellow to-pastel-purple min-h-screen font-noto">
      {/* Header */}
      <header className="text-center py-8 px-4">
        {/* Little Prince inspired stars decoration */}
        <div className="flex justify-center mb-4">
          <div className="text-2xl">⭐</div>
          <div className="text-lg mx-2">✨</div>
          <div className="text-xl">🌟</div>
          <div className="text-lg mx-2">✨</div>
          <div className="text-2xl">⭐</div>
        </div>

        <h1 className="text-4xl md:text-6xl font-do-hyeon text-gray-800 drop-shadow-lg mb-2">
          상상 이상의 카드
        </h1>
        <p className="text-xl md:text-2xl font-do-hyeon text-gray-700 drop-shadow-md">
          Cards for Storytelling
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-6xl">
        <CardGenerator onCardsGenerated={handleCardsGenerated} />
        
        {/* Card Display Section */}
        {cards.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-do-hyeon text-gray-800">생성된 카드들</h2>
              <button
                onClick={resetCards}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-noto transition-colors duration-200"
              >
                처음으로
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {cards.map((card) => (
                <div key={card.id} className="relative">
                  <div
                    onClick={() => handleCardFlip(card.id)}
                    className={`
                      w-full aspect-[3/4] rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 transform-gpu
                      ${card.flipped ? 'rotate-y-180' : ''}
                    `}
                    style={{
                      background: card.flipped ? '#ffffff' : `linear-gradient(135deg, ${card.color}, ${adjustBrightness(card.color, -10)})`
                    }}
                  >
                    {card.flipped ? (
                      <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            className="w-full h-full object-cover"
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
          </div>
        )}

        {showStorySection && (
          <div id="story-section">
            <StoryWriter flippedCards={flippedCards} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm mt-12 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-4">
            <p className="font-noto text-gray-600 mb-2">
              실물사진 출처:{' '}
              <a
                href="https://picsum.photos/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-purple-500 underline transition-colors duration-200"
              >
                https://picsum.photos/
              </a>
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="font-do-hyeon text-lg text-gray-700">
              created by.{' '}
              <a
                href="https://litt.ly/chichiboo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-blue-500 transition-colors duration-200 underline"
              >
                교육뮤지컬 꿈꾸는 치수쌤
              </a>
            </p>
          </div>
          
          {/* Little Prince inspired decoration */}
          <div className="mt-4 flex justify-center space-x-2 text-lg">
            <span>🌹</span>
            <span>🦊</span>
            <span>✈️</span>
            <span>🌍</span>
            <span>⭐</span>
          </div>
        </div>
      </footer>
    </div>
  );
}