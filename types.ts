
export interface CardData {
  id: string;
  universityName: string;
  studentName: string;
  validUntil: string;
  qrTitle: string;
  qrValue: string;
  photoUrl?: string;
  qrImageUrl?: string;
  fields: {
    label: string;
    value: string;
    align?: 'left' | 'right';
  }[];
  accentColor: string;
}

export type SwipeDirection = 'left' | 'right' | null;
