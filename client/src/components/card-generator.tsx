import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StoryCard from './story-card';
import { getShuffledPastelColors } from '@/lib/pastel-colors';

interface CardData {
  id: number;
  color: string;
  imageUrl: string | null;
  flipped: boolean;
}

interface CardGeneratorProps {
  onCardsGenerated: (cards: CardData[]) => void;
}

export default function CardGenerator({ onCardsGenerated }: CardGeneratorProps) {
  const [cardCount, setCardCount] = useState('');
  const [useRealPhotos, setUseRealPhotos] = useState(true);
  const [useIllustrations, setUseIllustrations] = useState(true);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [loadingCards, setLoadingCards] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const emojis = ['🌸', '🌊', '🌿', '☀️', '🌙', '⭐', '🦋', '🌺', '🍃', '✨'];

  // Remove automatic card generation on load

  useEffect(() => {
    onCardsGenerated(cards.filter(card => card.flipped));
  }, [cards, onCardsGenerated]);

  const generateCards = () => {
    const count = parseInt(cardCount);
    if (!cardCount || count < 1 || count > 30) {
      toast({
        title: "오류",
        description: "카드 개수는 1-30 사이로 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    const shuffledColors = getShuffledPastelColors();
    const newCards: CardData[] = [];
    
    for (let i = 0; i < count; i++) {
      newCards.push({
        id: i,
        color: shuffledColors[i % shuffledColors.length],
        imageUrl: null,
        flipped: false
      });
    }

    setCards(newCards);
    setFlippedCards(new Set());
    setLoadingCards(new Set());
  };

  const getPicsumImage = (): string => {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/200/300?random=${randomId}&t=${Date.now()}`;
  };

  const getIllustrationImage = (): string => {
    const illustrations = [
      '/src/assets/illustration1.png',
      '/src/assets/illustration2.png',
      '/src/assets/illustration3.png'
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

  const flipCard = async (cardId: number) => {
    if (flippedCards.has(cardId)) return;

    setLoadingCards(prev => new Set(Array.from(prev).concat([cardId])));
    setFlippedCards(prev => new Set(Array.from(prev).concat([cardId])));

    try {
      const imageUrl = await getRandomImage();
      
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === cardId 
            ? { ...card, imageUrl, flipped: true }
            : card
        )
      );
    } catch (error) {
      console.error('Error loading image:', error);
      toast({
        title: "이미지 로딩 실패",
        description: error instanceof Error ? error.message : "이미지를 불러올 수 없습니다.",
        variant: "destructive"
      });
      
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === cardId 
            ? { ...card, imageUrl: null, flipped: true }
            : card
        )
      );
    } finally {
      setLoadingCards(prev => {
        const newArray = Array.from(prev);
        const filtered = newArray.filter(id => id !== cardId);
        return new Set(filtered);
      });
    }
  };

  const validateImageSelection = (realPhotos: boolean, illustrations: boolean) => {
    if (!realPhotos && !illustrations) {
      setUseRealPhotos(true);
      toast({
        title: "알림",
        description: "이미지 타입을 최소 하나는 선택해야 합니다.",
      });
    }
  };

  return (
    <>
      {/* Card Generator Section */}
      <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-do-hyeon text-gray-800 mb-4">카드 개수 입력</h2>
          
          {/* Card Count Input and Button */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <Input
              type="number"
              id="cardCount"
              min="1"
              max="30"
              value={cardCount}
              placeholder="1-30"
              onChange={(e) => setCardCount(e.target.value)}
              className="w-24 text-center font-noto font-medium text-lg border-2 border-purple-200 focus:border-blue-300"
            />
            <Button
              onClick={generateCards}
              className="bg-gradient-to-r from-pastel-green to-pastel-sky hover:from-pastel-sky hover:to-pastel-green text-gray-800 font-noto font-bold py-3 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              카드 만들기
            </Button>
          </div>

          {/* Image Type Selection */}
          <Card className="bg-pastel-yellow/30 border-none">
            <CardContent className="p-4">
              <h3 className="text-lg font-noto font-semibold text-gray-800 mb-3">이미지 출력 옵션</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="realPhotos"
                    checked={useRealPhotos}
                    onCheckedChange={(checked) => {
                      const newValue = checked as boolean;
                      setUseRealPhotos(newValue);
                      validateImageSelection(newValue, useIllustrations);
                    }}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="realPhotos" className="font-noto font-medium text-gray-700 cursor-pointer">
                    실물사진
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="illustrations"
                    checked={useIllustrations}
                    onCheckedChange={(checked) => {
                      const newValue = checked as boolean;
                      setUseIllustrations(newValue);
                      validateImageSelection(useRealPhotos, newValue);
                    }}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="illustrations" className="font-noto font-medium text-gray-700 cursor-pointer">
                    일러스트
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cards Container */}
      {cards.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 justify-items-center">
              {cards.map((card) => (
                <StoryCard
                  key={card.id}
                  id={card.id}
                  backgroundColor={card.color}
                  emoji={emojis[card.id % emojis.length]}
                  onFlip={flipCard}
                  imageUrl={card.imageUrl}
                  isFlipped={card.flipped}
                  isLoading={loadingCards.has(card.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
