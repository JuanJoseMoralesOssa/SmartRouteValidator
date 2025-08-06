import ClassicCitySVG from "@/shared/components/atoms/svgs/ClassicCitySVG"
import DomedCitySVG from "@/shared/components/atoms/svgs/DomedCitySVG"
import FuturisticCitySVG from "@/shared/components/atoms/svgs/FuturisticCitySVG"
import SkylineSVG from "@/shared/components/atoms/svgs/SkylineSVG"
import { CitySvgEnum } from "../enums/CitySvgEnum"

export const CITY_SVG_TYPES = [
  { value: CitySvgEnum.Classic, label: 'Ciudad Clásica', component: ClassicCitySVG },
  { value: CitySvgEnum.Domed, label: 'Ciudad con Cúpulas', component: DomedCitySVG },
  { value: CitySvgEnum.Futuristic, label: 'Ciudad Futurista', component: FuturisticCitySVG },
  { value: CitySvgEnum.Skyline, label: 'Skyline Moderno', component: SkylineSVG },
] as const


// Íconos predefinidos para ciudades
export const DEFAULT_ICONS = [
  { value: '🏙️', label: 'Ciudad General' },
  { value: '🌆', label: 'Ciudad al Atardecer' },
  { value: '🌃', label: 'Ciudad Nocturna' },
  { value: '🏢', label: 'Edificios Corporativos' },
  { value: '🗼', label: 'Torre/Monumento' },
  { value: '🏰', label: 'Castillo/Ciudad Histórica' },
  { value: '🌉', label: 'Ciudad con Puente' },
  { value: '🏛️', label: 'Ciudad Clásica' },
  { value: '🕌', label: 'Ciudad Árabe' },
  { value: '⛩️', label: 'Ciudad Asiática' },
  { value: '🏖️', label: 'Ciudad Costera' },
  { value: '⛰️', label: 'Ciudad Montañosa' },
] as const
