export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  planet:
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune';
  icon?: string;
  color?: string;
  available: boolean;
}

export const solarSystemConfig: LifeEvent[] = [
  {
    id: 'high-school',
    title: 'High School',
    description: 'Graduated from SPŠSE a VOŠ Liberec.',
    date: '2019 - 2023',
    planet: 'mercury',
    color: '#b0a697',
    available: true
  },
  {
    id: 'university',
    title: 'University',
    description: 'Studying AI & Visualisation at Technical University of Liberec.',
    date: '2023 - Present',
    planet: 'venus',
    color: '#e3bb76',
    available: true
  },
  {
    id: 'freelance',
    title: 'Freelance',
    description: 'Working on various web projects and automation scripts.',
    date: '2020 - Present',
    planet: 'earth',
    color: '#4f7db3',
    available: true
  },
  {
    id: 'future',
    title: 'Future',
    description: 'Who knows what lies ahead?',
    date: 'Future',
    planet: 'mars',
    color: '#c1440e',
    available: false
  }
];
