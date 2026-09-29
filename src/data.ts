export type Mode = 'night' | 'studio'

export type Paint = { id: string; name: string; hex: string; roughness: number }
export type Rim = { id: string; name: string; hex: string; roughness: number }
export type View = {
  id: string
  label: string
  position: [number, number, number]
  target: [number, number, number]
}

export const CAR = {
  brand: 'Julia Nascimento',
  model: 'V8 Berlinetta',
  year: '2026',
  price: 'R$ 2.890.000',
}

export const PAINTS: Paint[] = [
  { id: 'rosso', name: 'Rosso Vivo', hex: '#9e0f0c', roughness: 0.32 },
  { id: 'ambra', name: 'Âmbar', hex: '#d99a0b', roughness: 0.3 },
  { id: 'verde', name: 'Verde Inglês', hex: '#0d3526', roughness: 0.36 },
  { id: 'notte', name: 'Azul Noite', hex: '#0f1f45', roughness: 0.34 },
  { id: 'giz', name: 'Branco Giz', hex: '#e6e2d9', roughness: 0.4 },
  { id: 'grafite', name: 'Grafite', hex: '#4b4e53', roughness: 0.3 },
  { id: 'onix', name: 'Preto Ônix', hex: '#0a0a0b', roughness: 0.22 },
]

export const RIMS: Rim[] = [
  { id: 'prata', name: 'Prata diamantada', hex: '#c8ccd2', roughness: 0.2 },
  { id: 'grafite', name: 'Grafite fosco', hex: '#26282c', roughness: 0.55 },
  { id: 'bronze', name: 'Bronze', hex: '#8a6a3c', roughness: 0.3 },
]

// The model faces +Z; target sits around mid-body height.
export const VIEWS: View[] = [
  { id: 'hero', label: '3/4', position: [6.4, 1.9, 7.6], target: [0, 0.95, 0] },
  { id: 'front', label: 'Frente', position: [0, 1.25, 8.6], target: [0, 0.8, 0] },
  { id: 'side', label: 'Lateral', position: [9, 1.2, 0], target: [0, 0.8, 0] },
  { id: 'rear', label: 'Traseira', position: [-3.4, 1.6, -8], target: [0, 0.8, 0] },
  { id: 'wheel', label: 'Roda', position: [2.9, 0.65, 3.4], target: [0.8, 0.35, 1.3] },
  { id: 'top', label: 'Topo', position: [0.01, 11, 0.6], target: [0, 0, 0] },
]

export const SPECS = [
  { label: 'Potência', value: '570', unit: 'cv' },
  { label: '0–100 km/h', value: '3,4', unit: 's' },
  { label: 'Velocidade máx.', value: '325', unit: 'km/h' },
  { label: 'Motor', value: 'V8', unit: '4.5 L' },
]

export const SPEC_TABLE: [string, string][] = [
  ['Motor', 'V8 90°, 4.497 cm³, aspirado'],
  ['Potência', '570 cv a 9.000 rpm'],
  ['Torque', '540 Nm a 6.000 rpm'],
  ['Câmbio', 'Dupla embreagem, 7 marchas'],
  ['Tração', 'Traseira, diferencial eletrônico'],
  ['0–100 km/h', '3,4 s'],
  ['Velocidade máxima', '325 km/h'],
  ['Peso a seco', '1.380 kg'],
  ['Distribuição de peso', '42 / 58 (diant. / tras.)'],
  ['Freios', 'Carbono-cerâmica, 398 / 360 mm'],
]
