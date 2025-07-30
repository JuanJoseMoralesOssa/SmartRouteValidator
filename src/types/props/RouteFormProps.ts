import { Route } from "../Route"

export interface RouteFormProps {
    onSave: (route: Partial<Route>) => void
}
