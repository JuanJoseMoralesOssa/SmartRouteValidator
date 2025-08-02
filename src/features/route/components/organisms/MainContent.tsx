import TableSection from "../molecules/TableSection"
import VisualizationSection from "../molecules/VisualizationSection"

function MainContent() {
  return (
    <main className='space-y-8'>
      <VisualizationSection />
      <TableSection />
    </main>
  )
}

export default MainContent
