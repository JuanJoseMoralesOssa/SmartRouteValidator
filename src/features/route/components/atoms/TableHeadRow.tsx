function TableHeaderCell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <th className='px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px]'>
      <div className='flex items-center space-x-2'>
        {children}
      </div>
    </th>
  )
}

export default TableHeaderCell
