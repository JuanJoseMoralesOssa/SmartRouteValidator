import { Route } from "../entities/Route";
import { newYork, losAngeles, chicago, houston } from "./MockCities";



export const mockRoutes: Route[] = [
  {
    originId: newYork.id,
    origin: newYork,
    destinyId: losAngeles.id,
    destiny: losAngeles,
    cost: 11,
  },
  {
    originId: newYork.id,
    origin: newYork,
    destinyId: losAngeles.id,
    destiny: losAngeles,
    cost: 11,
  },
  {
    originId: newYork.id,
    origin: newYork,
    destinyId: chicago.id,
    destiny: chicago,
    cost: 14,
  },
  {
    originId: newYork.id,
    origin: newYork,
    destinyId: chicago.id,
    destiny: chicago,
    cost: 13,
  },
  {
    originId: losAngeles.id,
    origin: losAngeles,
    destinyId: chicago.id,
    destiny: chicago,
    cost: 5,
  },
  {
    originId: chicago.id,
    origin: chicago,
    destinyId: losAngeles.id,
    destiny: losAngeles,
    cost: 6,
  },
  {
    originId: chicago.id,
    origin: chicago,
    destinyId: houston.id,
    destiny: houston,
    cost: 5,
  },
  {
    originId: chicago.id,
    origin: chicago,
    destinyId: houston.id,
    destiny: houston,
    cost: 5,
  },
  {
    originId: houston.id,
    origin: houston,
    destinyId: chicago.id,
    destiny: chicago,
    cost: 5,
  },
]
