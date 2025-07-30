import { Route } from "@/shared/types/entities/Route";

export interface RouteFormProps {
    onSave: (route: Partial<Route>) => void
}
