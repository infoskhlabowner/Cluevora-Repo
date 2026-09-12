import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="w-full bg-white border border-[#E9EDC6] rounded-[24px] p-4 flex items-center justify-between shadow-sm mb-4 hover:bg-[#FDFBF7] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7D8F69]/20 flex items-center justify-center text-[#7D8F69]">
            <Download size={20} />
          </div>
          <div className="text-left">
            <p className="font-serif text-[#2D331F] font-bold text-sm">Install App</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#7D8F69]">Play offline</p>
          </div>
        </div>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="w-full bg-white border border-[#E9EDC6] rounded-[24px] p-4 flex items-center justify-between shadow-sm mb-4 hover:bg-[#FDFBF7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7D8F69]/20 flex items-center justify-center text-[#7D8F69]">
              <Download size={20} />
            </div>
            <div className="text-left">
              <p className="font-serif text-[#2D331F] font-bold text-sm">Install on iOS</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#7D8F69]">Add to Home Screen</p>
            </div>
          </div>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-xl border border-[#E9EDC6]">
              <h3 className="text-xl font-serif italic text-[#2D331F] mb-2">Install on iOS</h3>
              <p className="mt-2 text-sm text-[#434832] mb-6">
                1. Tap the <strong>Share</strong> button in the Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-full bg-[#2D331F] py-3 text-sm font-bold tracking-wide text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
