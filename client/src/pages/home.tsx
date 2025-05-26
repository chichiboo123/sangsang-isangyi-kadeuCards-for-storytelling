import { useState } from 'react';
import CardGenerator from '@/components/card-generator';
import StoryWriter from '@/components/story-writer';

interface CardData {
  id: number;
  color: string;
  imageUrl: string | null;
  flipped: boolean;
}

export default function Home() {
  const [flippedCards, setFlippedCards] = useState<CardData[]>([]);

  const handleCardsGenerated = (cards: CardData[]) => {
    setFlippedCards(cards);
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
        <StoryWriter flippedCards={flippedCards} />
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
