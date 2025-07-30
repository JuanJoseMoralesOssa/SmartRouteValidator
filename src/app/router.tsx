import Home from "@/features/home/components/organisms/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from "./pages/NotFound"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* {/* <Route path="/routes" element={<Routes />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  )
}

export default AppRoutes
