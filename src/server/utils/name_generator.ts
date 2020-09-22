const ADJECTIVES = ['Alegre', 'Glamoroso', 'Afectivo', 'Ambicioso', 'Comprensivo', 'Corajudo', 'Empático', 'Exuberante', 'Generoso', 'Inventivo', 'Folosófico', 'Sensible', 'Empåtico', 'Eufórico'];
// const ADJECTIVES = ['Happy', 'Glamurous', 'Affectionate', 'Ambitious', 'Compassionate', 'Courageous', 'Empathetic', 'Exuberant', 'Generous', 'Inventive', 'Philosofical', 'Sensible', 'Sympathetic', 'Witty'];
const THINGS = [
  '🐞',
  '🐠',
  '🐢',
  '🐦',
  '🐨',
  '🐬',
  '🐭',
  '🐮',
  '🐯',
  '🐰',
  '🐱',
  '🐲',
  '🐵',
  '🐶',
  '🐷',
  '🐸',
  '🐹',
  '🐻'
];

export function generateName() {
  return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${THINGS[Math.floor(Math.random() * THINGS.length)]}`
}