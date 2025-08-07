import { CitySvgEnum } from "@/features/city/enums/CitySvgEnum";
import { City } from "../entities/City";

export const mockCities: City[] = [
  { name: 'New York', color: '#FF5733', svgType: CitySvgEnum.Classic, icon: '🗽' },
  { name: 'Los Angeles', color: '#33FF57', svgType: CitySvgEnum.Domed, icon: '🌴' },
  { name: 'Chicago', color: '#5733FF', svgType: CitySvgEnum.Futuristic, icon: '🌆' },
  { name: 'Houston', color: '#FF33A1', svgType: CitySvgEnum.Skyline, icon: '🏙️' },
  { name: 'Phoenix', color: '#33A1FF', svgType: CitySvgEnum.Classic, icon: '🌵' },
];
