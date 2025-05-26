import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generatePDF, downloadTxtFile } from '@/lib/pdf-utils';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const handleDownloadTxt = () => {
    if (!storyText.trim()) {
      toast({
        title: "알림",
        description: "먼저 이야기를 작성해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      downloadTxtFile(storyText);
      toast({
        title: "다운로드 완료",
        description: "TXT 파일이 다운로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPdf = async () => {
    if (!storyText.trim()) {
      toast({
        title: "알림",
        description: "먼저 이야기를 작성해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPdf(true);
    try {
      await generatePDF(storyText, flippedCards);
      toast({
        title: "다운로드 완료",
        description: "PDF 파일이 다운로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "PDF 생성 실패",
        description: error instanceof Error ? error.message : "PDF 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl md:text-3xl font-do-hyeon text-gray-800 mb-6 text-center">
        이야기 만들기
      </h2>
      
      <div className="mb-6">
        <Textarea
          placeholder="여기에 카드를 보고 떠오른 이야기를 적어보세요... 

어린왕자가 여행하는 동안 만난 사람들처럼, 각 카드가 들려주는 이야기를 상상해보세요. 🌟"
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          className="w-full h-64 md:h-80 p-4 border-2 border-purple-200 rounded-2xl resize-none font-noto text-gray-700 leading-relaxed focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
        <Button
          onClick={handleDownloadTxt}
          className="bg-gradient-to-r from-pastel-green to-pastel-yellow hover:from-pastel-yellow hover:to-pastel-green text-gray-800 font-noto font-bold py-3 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          📄 TXT 다운로드
        </Button>
        <Button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="bg-gradient-to-r from-pastel-purple to-pastel-sky hover:from-pastel-sky hover:to-pastel-purple text-gray-800 font-noto font-bold py-3 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? (
            <>
              <div className="animate-spin">🔄</div>
              PDF 생성중...
            </>
          ) : (
            <>
              🖼️ PDF 다운로드
            </>
          )}
        </Button>
      </div>

      {/* Go to Top Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-pastel-sky to-pastel-purple hover:from-pastel-purple hover:to-pastel-sky text-gray-800 font-noto font-bold py-3 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          처음으로
        </Button>
      </div>

      {flippedCards.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 font-noto">
            현재 {flippedCards.length}장의 카드가 PDF에 포함됩니다.
          </p>
        </div>
      )}
    </section>
  );
}
