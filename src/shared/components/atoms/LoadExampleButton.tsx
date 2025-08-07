import ActionButton from "./ActionButton"

type LoadExampleButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  icon?: string;
  customColor?: string;
};

function LoadExampleButton({
  onClick,
  children,
  className,
  ariaLabel,
  icon,
  customColor,
}: LoadExampleButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      aria-label={ariaLabel}
      icon={icon}
      customColor={customColor}
      className={className}
    >
      {children}
    </ActionButton>
  )
}

export default LoadExampleButton
