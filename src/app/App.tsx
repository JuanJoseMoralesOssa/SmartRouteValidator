import AppRoutes from './router'
import { ToastContainer } from '@/shared/components/molecules/ToastContainer'
import { ConfirmModal } from '@/shared/components/atoms/ConfirmModal'

function App() {
    return (
        <>
            <AppRoutes />
            <ToastContainer />
            <ConfirmModal />
        </>
    )
}

export default App
