
import React, { useState, useEffect } from 'react';
import Carousel from './components/Carousel';
import { MOCK_CARDS } from './constants';
import { supabase } from './supabase';
import { CardData } from './types';

// Define student profiles dictionary
let STUDENT_PROFILES: Record<number, { 
  name: string; 
  matriculation: string; 
  birthDate: string; 
  major: string;
  universityName: string;
  validUntil: string;
}> = {
  1: {
    name: 'DAVID ULRICH YOUMBI KONTCHIPO',
    matriculation: '100223045',
    birthDate: '12.04.2001',
    major: 'Informatik',
    universityName: 'Hochschule Ruhr West',
    validUntil: '01.03.2026 - 31.08.2026'
  },
  2: {
    name: 'MICHAEL JORDAN BOUDI',
    matriculation: '100118048',
    birthDate: '29.09.2000',
    major: 'Elektrotechnik',
    universityName: 'Uni Duisburg Essen',
    validUntil: '01.04.2026 - 30.09.2026'
  }
};

// Check if there is an env variable containing the profiles mapping as JSON
// This avoids committing real student names/details to public Git repositories (like GitHub)
const envProfiles = import.meta.env.VITE_STUDENT_PROFILES;
if (envProfiles) {
  try {
    STUDENT_PROFILES = JSON.parse(envProfiles);
  } catch (e) {
    console.error("Failed to parse VITE_STUDENT_PROFILES environment variable:", e);
  }
}

const getCardIdFromUrl = (): number => {
  if (typeof window !== 'undefined') {
    const queryParams = new URLSearchParams(window.location.search);
    const urlId = queryParams.get('id');
    if (urlId) {
      const parsed = parseInt(urlId, 10);
      if (!isNaN(parsed)) {
        // Save as the last active ID for PWA offline startup
        localStorage.setItem('last_active_card_id', parsed.toString());
        return parsed;
      }
    }
    // Fallback: Read the last active ID from localStorage
    const savedLastActive = localStorage.getItem('last_active_card_id');
    if (savedLastActive) {
      const parsed = parseInt(savedLastActive, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return parseInt(import.meta.env.VITE_CARD_ID || '1', 10);
};

const App: React.FC = () => {
  // Initialize state from localStorage if available, otherwise use MOCK_CARDS patched with profile
  const [cards, setCards] = useState<CardData[]>(() => {
    const cardId = getCardIdFromUrl();
    const savedCards = localStorage.getItem(`wallet_cards_cache_${cardId}`);
    if (savedCards) {
      return JSON.parse(savedCards);
    }

    // Fallback: Apply local profile info to MOCK_CARDS
    const profile = STUDENT_PROFILES[cardId] || STUDENT_PROFILES[1];
    return MOCK_CARDS.map((card, idx) => {
      const newCard = { ...card };
      newCard.universityName = profile.universityName;
      newCard.validUntil = profile.validUntil;
      
      if (idx === 0) {
        newCard.studentName = profile.name;
      } else if (idx === 1) {
        newCard.qrTitle = profile.name;
        newCard.fields = [
          { label: 'Geburstdatum', value: profile.birthDate },
          { label: 'Matrikel nummer', value: profile.matriculation, align: 'right' },
          { label: 'Studiengang', value: profile.major }
        ];
      }
      return newCard;
    });
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Synchronize theme state with DOM class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch dynamic data from Supabase
  useEffect(() => {
    const fetchSupabaseData = async () => {
      console.log('Fetching data from Supabase...');
      try {
        const cardId = getCardIdFromUrl();
        const profile = STUDENT_PROFILES[cardId] || STUDENT_PROFILES[1];

        // 1. Fetch paths from 'walletid' table for the specific cardId
        const { data: dbCards, error: dbError } = await supabase
          .from('walletid')
          .select('*')
          .eq('id', cardId);

        console.log('Supabase table data:', dbCards);

        if (dbError) throw dbError;
        if (!dbCards || dbCards.length === 0) {
          console.warn(`No card found in Supabase table with ID ${cardId}`);
          setSupabaseError(`Aucune carte trouvée avec l'ID ${cardId}`);
          return;
        }

        setSupabaseError(null);
        // 2. Map Supabase data to MOCK_CARDS
        const updatedCards = await Promise.all(MOCK_CARDS.map(async (mockCard, index) => {
          const dbCard = dbCards[0];
          if (!dbCard) return mockCard;

          const updatedCard = { ...mockCard };

          console.log(`CARTE ${index + 1} - Génération URL Publique...`);

          // Apply profile info dynamically
          updatedCard.universityName = profile.universityName;
          updatedCard.validUntil = profile.validUntil;

          if (index === 0) {
            updatedCard.studentName = profile.name;
          } else if (index === 1) {
            updatedCard.qrTitle = profile.name;
            updatedCard.fields = [
              { label: 'Geburstdatum', value: profile.birthDate },
              { label: 'Matrikel nummer', value: profile.matriculation, align: 'right' },
              { label: 'Studiengang', value: profile.major }
            ];
          }

          // Carte 1 (Index 0) : QR Code
          if (index === 0 && dbCard.qr_path) {
            const { data } = supabase.storage.from('walletdata').getPublicUrl(dbCard.qr_path);
            if (data?.publicUrl) {
              updatedCard.qrImageUrl = data.publicUrl;
            }
          }

          // Carte 2 (Index 1) : Photo
          if (index === 1 && dbCard.photo_path) {
            const { data } = supabase.storage.from('walletdata').getPublicUrl(dbCard.photo_path);
            if (data?.publicUrl) {
              updatedCard.photoUrl = data.publicUrl;
            }
          }

          return updatedCard;
        }));

        setCards(updatedCards);
        // Save to localStorage for offline access
        localStorage.setItem(`wallet_cards_cache_${cardId}`, JSON.stringify(updatedCards));
      } catch (error: any) {
        console.error('Supabase Connection Error (Offline?):', error);
        // In case of error (likely offline), we keep the data from localStorage (already in state)
        if (cards.length > 0 && !cards[0].qrImageUrl) {
          setSupabaseError("Mode hors-ligne : utilisation des données locales.");
        }
      }
    };

    fetchSupabaseData();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#F1F3F5] dark:bg-[#121212] h-screen w-screen safe-area-top safe-area-bottom overflow-hidden select-none theme-transition">
      {/* Top Status Area */}
      <div className="h-14 flex items-center justify-between px-8 pt-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1E1E1E] shadow-sm flex items-center justify-center border border-gray-100 dark:border-white/5 theme-transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 dark:text-slate-200">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Mobile</span>
            <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none theme-transition">Wallet</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1E1E1E] shadow-sm flex items-center justify-center border border-gray-100 dark:border-white/5 text-slate-700 dark:text-amber-400 active:scale-95 transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <button className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1E1E1E] shadow-sm flex items-center justify-center border border-gray-100 dark:border-white/5 text-slate-400 active:scale-95 transition-all theme-transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full h-full min-h-0">
        <Carousel
          cards={cards}
          onIndexChange={(index) => setActiveIndex(index)}
        />
      </div>
      {/* Footer Navigation & Dots */}
      <div className="h-24 flex flex-col items-center justify-start gap-3 px-8 shrink-0">
        {/* Pagination Dots */}
        <div className="flex gap-2 items-center">
          {cards.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex
                ? 'w-6 bg-slate-900 dark:bg-slate-100 shadow-md'
                : 'w-1.5 bg-slate-300 dark:bg-slate-800'
                }`}
            />
          ))}
        </div>

        {/* Helper Text */}
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mt-1 theme-transition">
          Swipe
        </p>

        {/* Home Indicator bar for PWA feel */}
        <div className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 opacity-50 theme-transition"></div>
      </div>
    </div>
  );
};

export default App;

