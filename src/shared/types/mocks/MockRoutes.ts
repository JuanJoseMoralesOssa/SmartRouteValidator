import { Route } from "../entities/Route";
import { mockCities } from "./MockCities";

export const mockRoutes: Route[] = [
  {
    origin: mockCities[0],
    destiny: mockCities[1],
    cost: 11,
  },
  {
    origin: mockCities[0],
    destiny: mockCities[1],
    cost: 11,
  },
  {
    origin: mockCities[0],
    destiny: mockCities[2],
    cost: 14,
  },
  {
    origin: mockCities[0],
    destiny: mockCities[2],
    cost: 13,
  },
  {
    origin: mockCities[1],
    destiny: mockCities[2],
    cost: 5,
  },
  {
    origin: mockCities[2],
    destiny: mockCities[1],
    cost: 6,
  },
  {
    origin: mockCities[2],
    destiny: mockCities[3],
    cost: 5,
  },
  {
    origin: mockCities[2],
    destiny: mockCities[3],
    cost: 5,
  },
  {
    origin: mockCities[3],
    destiny: mockCities[2],
    cost: 5,
  },
]
