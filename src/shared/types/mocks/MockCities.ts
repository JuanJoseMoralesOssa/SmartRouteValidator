import { CitySvgEnum } from "@/features/city/enums/CitySvgEnum";
import { City } from "../entities/City";

export const mockCities: City[] = [
  { id: 1, name: 'New York', color: '#FF5733', svgType: CitySvgEnum.Classic, icon: '🗽' },
  { id: 2, name: 'Los Angeles', color: '#33FF57', svgType: CitySvgEnum.Domed, icon: '🌴' },
  { id: 3, name: 'Chicago', color: '#5733FF', svgType: CitySvgEnum.Futuristic, icon: '🌆' },
  { id: 4, name: 'Houston', color: '#FF33A1', svgType: CitySvgEnum.Skyline, icon: '🏙️' },
  { id: 5, name: 'Phoenix', color: '#33A1FF', svgType: CitySvgEnum.Classic, icon: '🌵' },
];

export const newYork = mockCities[0];
export const losAngeles = mockCities[1];
export const chicago = mockCities[2];
export const houston = mockCities[3];
export const phoenix = mockCities[4];
