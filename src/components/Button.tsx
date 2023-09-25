interface ButtonProps {
  disabled?: boolean
  children?: React.ReactNode
  onClick: () => void
  primary?: boolean
  secondary?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  disabled = false,
  children,
  onClick,
  primary = true,
  secondary = false,
}) => {
  return (
    <div>
      {primary && (
        <button
          type="button"
          className={`px-12 py-3 ${
            disabled
              ? 'bg-gray-400 cursor-not-allowed  text-black'
              : 'bg-sky-500 hover:bg-sky-700 text-white'
          } rounded-2xl`}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
      {secondary && (
        <button
          type="button"
          className="px-12 py-3 bg-sky-500 hover:bg-sky-700 rounded-2xl text-white"
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </div>
  )
}
