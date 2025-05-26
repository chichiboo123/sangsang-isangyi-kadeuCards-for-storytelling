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
  const [usedImages, setUsedImages] = useState(new Set<string>());
  const flippedCards = cards.filter(card => card.flipped);

  const handleCardFlip = async (id: number) => {
    const cardToFlip = cards.find(card => card.id === id);
    
    if (cardToFlip?.flipped) {
      // 이미 뒤집힌 카드를 클릭하면 다시 뒤집기
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === id ? { ...card, flipped: false } : card
        )
      );
    } else {
      // 카드를 먼저 뒤집기
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === id ? { ...card, flipped: true } : card
        )
      );

      // 이미지 URL이 없는 경우에만 이미지 로드
      if (cardToFlip && !cardToFlip.imageUrl) {
        try {
          // 중복 방지를 위해 usedImages Set 전달
          const imageUrl = await getRandomImage(usedImages);
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === id ? { ...card, imageUrl: imageUrl } : card
            )
          );
        } catch (error) {
          console.error('이미지 로딩 실패:', error);
        }
      }
    }
  };

  const getPicsumImage = (usedImages: Set<string>): string => {
    let randomId: number;
    let imageUrl: string;
    
    // 중복되지 않는 이미지 ID 찾기
    do {
      randomId = Math.floor(Math.random() * 1000);
      imageUrl = `https://picsum.photos/200/300?random=${randomId}`;
    } while (usedImages.has(imageUrl) && usedImages.size < 1000);
    
    usedImages.add(imageUrl);
    return `${imageUrl}&t=${Date.now()}`;
  };

  const getIllustrationImage = (usedImages: Set<string>): string => {
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
      '/src/assets/illustration15.png',
      '/src/assets/illustration16.png',
      '/src/assets/illustration17.png',
      '/src/assets/illustration18.png',
      '/src/assets/illustration19.png',
      '/src/assets/illustration20.png',
      '/src/assets/illustration21.png',
      '/src/assets/illustration22.png',
      '/src/assets/illustration23.png',
      '/src/assets/illustration24.png',
      '/src/assets/illustration25.png',
      '/src/assets/illustration26.png',
      '/src/assets/illustration27.png',
      '/src/assets/illustration28.png',
      '/src/assets/illustration29.png',
      '/src/assets/illustration30.png',
      '/src/assets/illustration31.png',
      '/src/assets/illustration32.png',
      '/src/assets/illustration33.png',
      '/src/assets/illustration34.png',
      '/src/assets/illustration35.png',
      '/src/assets/illustration36.png',
      '/src/assets/illustration37.png'
    ];
    
    // 사용되지 않은 일러스트만 필터링
    const availableIllustrations = illustrations.filter(img => !usedImages.has(img));
    
    // 사용 가능한 일러스트가 없다면 전체 목록에서 선택
    const sourceList = availableIllustrations.length > 0 ? availableIllustrations : illustrations;
    const randomIndex = Math.floor(Math.random() * sourceList.length);
    const selectedImage = sourceList[randomIndex];
    
    usedImages.add(selectedImage);
    return `${selectedImage}?t=${Date.now()}`;
  };

  const getRandomImage = async (usedImages: Set<string>): Promise<string> => {
    // 카드 생성기의 설정에 따라 이미지 타입 결정
    const useRealPhotos = document.querySelector('input[type="checkbox"]:nth-of-type(1)') as HTMLInputElement;
    const useIllustrations = document.querySelector('input[type="checkbox"]:nth-of-type(2)') as HTMLInputElement;
    
    const realPhotosChecked = useRealPhotos?.checked ?? true;
    const illustrationsChecked = useIllustrations?.checked ?? true;
    
    if (realPhotosChecked && illustrationsChecked) {
      // 둘 다 체크된 경우 랜덤 선택
      const useReal = Math.random() > 0.5;
      return useReal ? getPicsumImage(usedImages) : getIllustrationImage(usedImages);
    } else if (realPhotosChecked) {
      // 실물사진만 선택
      return getPicsumImage(usedImages);
    } else {
      // 일러스트만 선택
      return getIllustrationImage(usedImages);
    }
  };

  const handleCardsGenerated = (newCards: CardData[]) => {
    setCards(newCards);
    setShowStorySection(true);
    // 새로운 카드가 생성되면 사용된 이미지 목록 초기화
    setUsedImages(new Set<string>());
  };

  const resetCards = () => {
    const confirmed = window.confirm("모든 내용이 사라집니다. 처음 화면으로 이동하시겠습니까?");
    if (confirmed) {
      setCards([]);
      setShowStorySection(false);
      setUsedImages(new Set<string>());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRemoveCard = (id: number) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, flipped: false } : card
      )
    );
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
            <StoryWriter flippedCards={flippedCards} onRemoveCard={handleRemoveCard} />
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