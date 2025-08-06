import Home from "@/features/home/components/organisms/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from "./pages/NotFound"
import Cities from "@/features/city/components/organisms/Cities"
import CityDetail from "@/features/city/components/molecules/CityDetail"
import RouteManagementPage from "@/features/route/pages/RouteManagementPage"
import AppLayout from "./pages/AppLayout"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="cities" element={<Cities />} />
          <Route path="cities/:id" element={<CityDetail />} />
          <Route path="routes" element={<RouteManagementPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default AppRoutes
