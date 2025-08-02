function StatCard({ children, className = '' }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 border border-gray-200 ${className}`}>
      <div className='flex items-center justify-between'>
        {children}
      </div>
    </div>
  )
}

export default StatCard;
