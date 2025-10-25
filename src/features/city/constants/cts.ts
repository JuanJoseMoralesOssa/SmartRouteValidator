import ClassicCitySVG from "@/shared/components/atoms/svgs/ClassicCitySVG"
import DomedCitySVG from "@/shared/components/atoms/svgs/DomedCitySVG"
import FuturisticCitySVG from "@/shared/components/atoms/svgs/FuturisticCitySVG"
import SkylineSVG from "@/shared/components/atoms/svgs/SkylineSVG"
import { CitySvgEnum } from "../enums/CitySvgEnum"

export const CITY_SVG_TYPES = [
  { value: CitySvgEnum.Classic, label: 'Classic city', component: ClassicCitySVG },
  { value: CitySvgEnum.Domed, label: 'Domed city', component: DomedCitySVG },
  { value: CitySvgEnum.Futuristic, label: 'Futuristic city', component: FuturisticCitySVG },
  { value: CitySvgEnum.Skyline, label: 'Modern skyline', component: SkylineSVG },
] as const


// Íconos predefinidos para ciudades
export const DEFAULT_ICONS = [
  { value: '🏙️', label: 'General city' },
  { value: '🌆', label: 'Sunset city' },
  { value: '🌃', label: 'Night city' },
  { value: '🏢', label: 'Corporate buildings' },
  { value: '🗼', label: 'Tower/Monument' },
  { value: '🏰', label: 'Castle/Historical city' },
  { value: '🌉', label: 'City with Bridge' },
  { value: '🏛️', label: 'Classic city' },
  { value: '🕌', label: 'Arab city' },
  { value: '⛩️', label: 'Asian city' },
  { value: '🏖️', label: 'Coastal city' },
  { value: '⛰️', label: 'Mountain city' },
] as const
