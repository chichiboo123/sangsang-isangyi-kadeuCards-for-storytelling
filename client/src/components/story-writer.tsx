import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { downloadTxtFile } from '@/lib/pdf-utils';

interface CardData {
  id: number;
  color: string;
  imageUrl: string | null;
  flipped: boolean;
}

interface StoryWriterProps {
  flippedCards: CardData[];
}

export default function StoryWriter({ flippedCards }: StoryWriterProps) {
  const [storyText, setStoryText] = useState('');
  const { toast } = useToast();

  const handleDownloadTxt = () => {
    if (!storyText.trim()) {
      toast({
        title: "오류",
        description: "이야기를 먼저 작성해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      downloadTxtFile(storyText);
      toast({
        title: "성공",
        description: "TXT 파일이 성공적으로 다운로드되었습니다!"
      });
    } catch (error) {
      console.error('TXT 다운로드 오류:', error);
      toast({
        title: "오류",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mt-8">
      <h2 className="text-3xl font-do-hyeon text-center text-gray-800 mb-8">
        이야기 만들기
      </h2>
      
      {flippedCards.length > 0 && (
        <div className="mb-6">
          <p className="text-lg font-noto text-gray-700 mb-4 text-center">
            뽑은 카드 {flippedCards.length}장을 보고 자유롭게 이야기를 써보세요!
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {flippedCards.map((card) => (
              <div
                key={card.id}
                className="w-16 h-16 rounded-lg shadow-lg overflow-hidden border-2 border-white"
                style={{ backgroundColor: card.color }}
              >
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    className="w-full h-full object-cover"
                    alt="Story card preview"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="story" className="block text-lg font-noto text-gray-700 mb-2">
            나만의 이야기
          </label>
          <Textarea
            id="story"
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="카드에서 영감을 받아 자유롭게 이야기를 써보세요..."
            className="min-h-[200px] p-4 text-base font-noto resize-none border-2 border-gray-200 focus:border-purple-500 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadTxt}
            disabled={!storyText.trim()}
            className={`
              px-6 py-3 rounded-lg font-noto transition-all duration-200
              ${!storyText.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-300 hover:bg-green-400 text-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            TXT 다운로드
          </button>
          
          <button
            onClick={() => {
              const confirmed = window.confirm("모든 내용이 사라집니다. 처음 화면으로 이동하시겠습니까?");
              if (confirmed) {
                window.location.reload();
              }
            }}
            className="px-6 py-3 rounded-lg font-noto bg-red-300 hover:bg-red-400 text-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            처음으로
          </button>
        </div>
      </div>
    </div>
  );
}