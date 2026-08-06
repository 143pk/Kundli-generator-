import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  bannerId?: number;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ bannerId = 1, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous contents
    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = '728';
    iframe.height = '90';
    iframe.style.border = '0';
    iframe.style.margin = '0 auto';
    iframe.style.display = 'block';
    iframe.style.maxWidth = '100%';
    iframe.title = `Advertisement Banner #${bannerId}`;

    const adHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '4b1b9d605a12c38864a9d825b1c23827',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/4b1b9d605a12c38864a9d825b1c23827/invoke.js"></script>
        </body>
      </html>
    `;

    containerRef.current.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(adHtml);
        doc.close();
      }
    } catch (e) {
      console.warn('Ad script initialization fallback:', e);
    }
  }, [bannerId]);

  return (
    <div className={`my-4 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900/60 p-2 border border-slate-800/80 shadow-sm ${className}`}>
      <span className="mb-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
        Advertisement #{bannerId}
      </span>
      <div ref={containerRef} className="w-full min-h-[90px] flex items-center justify-center" />
    </div>
  );
};
