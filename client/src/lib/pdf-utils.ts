declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export interface CardData {
  id: number;
  color: string;
  imageUrl: string | null;
  flipped: boolean;
}

export async function generatePDF(storyText: string, flippedCards: CardData[]): Promise<void> {
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Use helvetica which has better unicode support
    pdf.setFont('helvetica', 'normal');
    
    pdf.setFontSize(20);
    pdf.text('상상 이상의 카드 - 나만의 이야기', 105, 20, { align: 'center' });
    
    // Add date
    pdf.setFontSize(12);
    pdf.text(`작성일: ${new Date().toLocaleDateString('ko-KR')}`, 105, 30, { align: 'center' });

    let yPosition = 50;

    // Add flipped cards section
    if (flippedCards.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('NotoSansKR', 'normal');
      pdf.text('뽑은 카드들:', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.text(`총 ${flippedCards.length}장의 카드를 뽑았습니다.`, 20, yPosition);
      yPosition += 20;

      // Add card images if available
      for (let i = 0; i < flippedCards.length; i++) {
        const card = flippedCards[i];
        if (card.imageUrl) {
          try {
            // Create a temporary image element to load the image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = card.imageUrl!;
            });

            // Create canvas to convert image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            
            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            
            // Check if we need a new page
            if (yPosition > 200) {
              pdf.addPage();
              yPosition = 20;
            }
            
            // Add image to PDF
            pdf.addImage(imgData, 'JPEG', 20, yPosition, 40, 30);
            yPosition += 35;
          } catch (error) {
            console.warn(`Failed to add image ${i + 1} to PDF:`, error);
          }
        }
      }
      
      yPosition += 10;
    }

    // Add story
    pdf.setFontSize(16);
    pdf.setFont('NotoSansKR', 'normal');
    pdf.text('내가 쓴 이야기:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    
    // Split text into lines for proper PDF formatting
    const lines = pdf.splitTextToSize(storyText, 170);
    lines.forEach((line: string) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 7;
    });

    // Add footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont('NotoSansKR', 'normal');
      pdf.text('created by. 교육뮤지컬 꿈꾸는 치수쌤', 105, 285, { align: 'center' });
    }

    pdf.save(`상상이상의카드_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '-')}.pdf`);
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    throw new Error('PDF 생성 중 오류가 발생했습니다.');
  }
}

export function downloadTxtFile(storyText: string): void {
  const blob = new Blob([storyText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `상상이상의카드_이야기_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
