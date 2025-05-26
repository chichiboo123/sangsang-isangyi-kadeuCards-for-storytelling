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

  useEffect(() => {
    generateCards();
  }, []);

  useEffect(() => {
    onCardsGenerated(cards.filter(card => card.flipped));
  }, [cards, onCardsGenerated]);

  const generateCards = () => {
    const count = parseInt(cardCount);
    if (!cardCount || count < 1 || count > 30) {
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
    // For now, using the Little Prince character as illustration
    // In the future, you can add more illustration images to this array
    const illustrations = [
      "data:image/png;base64,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"
    ];
    const randomIndex = Math.floor(Math.random() * illustrations.length);
    return illustrations[randomIndex];
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
