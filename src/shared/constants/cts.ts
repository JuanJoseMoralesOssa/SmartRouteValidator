import { City } from "../types/entities/City"

export const DEFAULT_CITY: City = {
  color: '',
  name: '',
  svgType: ''
}

export const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#AED6F1', '#F1948A', '#D2B4DE'
] as const
