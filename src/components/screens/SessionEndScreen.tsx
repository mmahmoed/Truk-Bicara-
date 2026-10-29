import React, { useEffect } from 'react';
import { Home, Moon, Sparkles, Heart, Compass, CheckCircle } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  onBackToHome: () => void;
  onSleepScreen: () => void;
  totalSessionMinutes: number;
}

export const SessionEndScreen: React.FC<Props> = ({
  onBackToHome,
  onSleepScreen,
  totalSessionMinutes,
}) => {
  useEffect(() => {
    soundEngine.stopAll();
    const timer = setTimeout(() => {
      soundEngine.speakIndonesian(
        'Hebat sekali! Sekarang ayo kita bermain dengan truk mainan sungguhan bersama Ayah dan Ibu!'
      );
    }, 300);

    return () => {
      clearTimeout(timer);
      soundEngine.stopAll();
    };
  }, []);

  const physicalActivities = [
    {
      title: 'Terowongan Kardus Ajaib',
      desc: 'Buka kedua sisi kotak kardus bekas, lalu ajak anak merangkak mendorong truk melewati terowongan sambil teriak "Masuk!" dan "Keluar!".',
    },
    {
      title: 'Jalanan Selotip di Lantai',
      desc: 'Tempel selotip kertas di lantai membentuk jalan raya lurus dan berkelok. Dorong truk bersama sambil bilang "Brum-brum... jalan!" dan "STOP!".',
    },
    {
      title: 'Bongkar Muat Balok Kayu',
      desc: 'Gunakan keranjang cucian atau kotak sepatu sebagai tempat bongkar muatan. Latih kata "Ambil!", "Masuk!", dan "Habis!".',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between py-6 px-4 md:px-8 max-w-5xl mx-auto w-full select-none">
      {/* Top Banner */}
      <div className="text-center space-y-2 mt-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-4 py-1.5 rounded-full text-xs md:text-sm font-black shadow-sm">
          <Heart className="w-4 h-4 text-rose-500 fill-current" />
          <span>Sesi Layar Selesai &bull; Waktu Interaksi: {totalSessionMinutes} Menit</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black font-['Fredoka'] text-amber-950">
          Hebat! Sekarang Ayo Bermain Truk Sungguhan!
        </h2>
        <p className="text-base md:text-xl text-slate-700 font-bold max-w-2xl mx-auto">
          Layar TV sudah selesai bertugas. Saat terbaik melatih bicara anak adalah melalui sentuhan fisik, gerak tubuh, dan tatap muka nyata.
        </p>
      </div>

      {/* Suggested Real-world Physical Play Activities */}
      <div className="my-6 space-y-3 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wider">
          <Compass className="w-5 h-5 text-amber-600" />
          <span>Ide Permainan Fisik di Rumah Setelah Ini:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {physicalActivities.map((act, idx) => (
            <div
              key={idx}
              className="bg-white border-3 border-amber-300 rounded-2xl p-4 shadow-md flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Ide #{idx + 1}
                </span>
                <h4 className="font-black text-base text-slate-900 mt-1.5">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {act.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Tanpa layar HP & TV</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls: Back to Home or Sleep Screen */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto w-full mb-3">
        <button
          onClick={() => {
            soundEngine.playPop();
            onSleepScreen();
          }}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-indigo-100 font-black text-lg border-4 border-indigo-700 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          title="Redupkan layar TV menjadi tenang"
        >
          <Moon className="w-5 h-5" />
          <span>REDUPKAN LAYAR TV (TIDUR)</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            onBackToHome();
          }}
          className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-lg font-['Fredoka'] border-4 border-amber-600 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <Home className="w-5 h-5" />
          <span>KEMBALI KE BERANDA</span>
        </button>
      </div>
    </div>
  );
};
