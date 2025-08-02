function StatIcon({ children, className = '' }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${className}`}>
      <span className='text-2xl'>{children}</span>
    </div>
  )
}

export default StatIcon
