import TableHeaderCell from "../atoms/TableHeadRow"

function TableHead() {
  return (
    <thead className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
      <tr>
        {<TableHeaderCell>
          <span className='text-lg'>🏙️</span>
          <span>Origin</span>
        </TableHeaderCell>}
        <TableHeaderCell>
          <span className='text-lg'>🎯</span>
          <span>Destination</span>
        </TableHeaderCell>
        <TableHeaderCell>
          <span className='text-lg'>💰</span>
          <span>Cost</span>
        </TableHeaderCell>
        {/* <TableHeaderCell>
          <span className='text-lg'>✈️</span>
          <span>Tipo de Ruta</span>
        </TableHeaderCell> */}
        {/* <th className='px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[160px]'>
          <div className='flex items-center space-x-2'>
            <span className='text-lg'>🛑</span>
            <span>Escalas</span>
          </div>
        </th> */}
        <th className='px-6 py-5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[180px]'>
          <div className='flex items-center justify-end space-x-2'>
            <span className='text-lg'>⚙️</span>
            <span>Actions</span>
          </div>
        </th>
      </tr>
    </thead>
  )
}

export default TableHead
