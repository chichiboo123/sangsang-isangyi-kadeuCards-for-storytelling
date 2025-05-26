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

  const handleCardFlip = async (id: number) => {
    // 카드를 먼저 뒤집기
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );

    // 이미지 URL이 없는 경우에만 이미지 로드
    const cardToFlip = cards.find(card => card.id === id);
    if (cardToFlip && !cardToFlip.imageUrl) {
      try {
        // 빠른 이미지 로딩을 위해 즉시 실행
        const imageUrl = await getRandomImage();
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === id ? { ...card, imageUrl: imageUrl } : card
          )
        );
      } catch (error) {
        console.error('이미지 로딩 실패:', error);
      }
    }
  };

  const getRandomImage = async (): Promise<string> => {
    // 실물사진과 일러스트 중 랜덤 선택
    const useReal = Math.random() > 0.5;
    
    if (useReal) {
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/200/300?random=${randomId}&t=${Date.now()}`;
    } else {
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
    }
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
        <CardGenerator 
          onCardsGenerated={handleCardsGenerated}
          cards={cards}
          onCardFlip={handleCardFlip}
        />
        


        {showStorySection && (
          <div id="story-section" className="mt-16">
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