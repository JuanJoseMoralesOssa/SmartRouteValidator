import { ButtonHTMLAttributes } from 'react'

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger'
  customColor?: string
  icon?: string
  children: React.ReactNode
}

const ActionButton = ({
  variant = 'primary',
  customColor,
  icon,
  children,
  className = '',
  ...props
}: ActionButtonProps) => {
  const baseClasses = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md'

  const variantClasses = {
    primary: customColor
      ? 'focus:ring-gray-500'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  }

  const buttonStyle = customColor ? {
    backgroundColor: customColor,
    filter: 'brightness(1)',
  } : {}

  const handleMouseEnter = customColor ? (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.filter = 'brightness(0.9)'
  } : undefined

  const handleMouseLeave = customColor ? (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.filter = 'brightness(1)'
  } : undefined

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {icon && <span className='mr-2'>{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

export default ActionButton
