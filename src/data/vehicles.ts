import { Vehicle } from '../types';

export const VEHICLES: Vehicle[] = [
  {
    id: 'truk-kuning',
    name: 'Truk Kuning',
    role: 'Pengangkut Batu',
    colorName: 'Kuning Cerah',
    soundName: 'Brum-brum & Klakson',
    shortDesc: 'Truk bak terbuka yang kuat membawa batu dan balok kayu.',
    accentColor: '#F59E0B', // amber-500
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'truk-merah',
    name: 'Truk Merah',
    role: 'Pengangkut Pasir',
    colorName: 'Merah Berani',
    soundName: 'Ngeeeeng & Klakson',
    shortDesc: 'Truk tangguh dengan bak merah yang siap mengangkut timbunan pasir.',
    accentColor: '#EF4444', // red-500
    badgeBg: 'bg-red-100 text-red-900 border-red-300',
  },
  {
    id: 'ekskavator',
    name: 'Ekskavator Oranye',
    role: 'Pengeruk Tanah & Pasir',
    colorName: 'Oranye Hangat',
    soundName: 'Ngguung Hidrolik',
    shortDesc: 'Punya lengan pengeruk yang bisa turun, serok, dan angkat tinggi.',
    accentColor: '#F97316', // orange-500
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'truk-molen',
    name: 'Truk Molen',
    role: 'Pencampur Semen Berputar',
    colorName: 'Biru & Hijau Cerah',
    soundName: 'Wuuush-wuuush Berputar',
    shortDesc: 'Tabung besar berputar perlahan untuk mencampur bahan bangunan.',
    accentColor: '#0EA5E9', // sky-500
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
  },
];
