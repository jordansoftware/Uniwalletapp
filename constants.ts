import { CardData } from './types';

export const MOCK_CARDS: CardData[] = [
  {
    id: '1',
    universityName: 'Universität',
    studentName: 'Name Vorname',
    validUntil: '00.00.0000 - 00.00.0000',
    qrTitle: 'DEUTSCHLANDTICKET',
    qrValue: '',
    fields: [
      { label: 'Geltungsbereich', value: 'Deutschlandweit' },
      { label: 'Klasse', value: '2. Klasse', align: 'right' },
      { label: 'Partner', value: 'RUHR BAHN' }
    ],
    accentColor: '#0065BD' // TUM Blue
  },
  {
    id: '2',
    universityName: 'Hochschule',
    studentName: 'STUDIERENDENAUSWEIS',
    validUntil: '00.00.0000 - 00.00.0000',
    qrTitle: 'Name Vorname',
    qrValue: 'https://example.com/id/placeholder',
    fields: [
      { label: 'Geburstdatum', value: '00.00.0000' },
      { label: 'Matrikel nummer', value: '00000000', align: 'right' },
      { label: 'Studiengang', value: 'Studiengang' }
    ],
    accentColor: '#00883A' // LMU Green
  },

];
