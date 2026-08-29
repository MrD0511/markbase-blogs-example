import {
  Info,
  TriangleAlert,
  CircleX,
  CircleCheck,
  Lightbulb,
} from 'lucide-react'

const calloutTypes = {
    info: {
        label: 'Info',
        icon: Info,
        styles: {
            container: 'border-l-4 border-blue-500 bg-blue-500/5 dark:bg-blue-500/10',
            icon: 'text-blue-600 dark:text-blue-400',
            label: 'text-blue-700 dark:text-blue-300',
            border: 'bg-gradient-to-r from-blue-500/20 to-transparent'
        }
    },
    warning: {
        label: 'Warning',
        icon: TriangleAlert,
        styles: {
            container: 'border-l-4 border-amber-500 bg-amber-500/5 dark:bg-amber-500/10',
            icon: 'text-amber-600 dark:text-amber-400',
            label: 'text-amber-700 dark:text-amber-300',
            border: 'bg-gradient-to-r from-amber-500/20 to-transparent'
        }
    },
    error: {
        label: 'Error',
        icon: CircleX,
        styles: {
            container: 'border-l-4 border-red-500 bg-red-500/5 dark:bg-red-500/10',
            icon: 'text-red-600 dark:text-red-400',
            label: 'text-red-700 dark:text-red-300',
            border: 'bg-gradient-to-r from-red-500/20 to-transparent'
        }
    },
    success: {
        label: 'Success',
        icon: CircleCheck,
        styles: {
            container: 'border-l-4 border-green-500 bg-green-500/5 dark:bg-green-500/10',
            icon: 'text-green-600 dark:text-green-400',
            label: 'text-green-700 dark:text-green-300',
            border: 'bg-gradient-to-r from-green-500/20 to-transparent'
        },
    },
    tip: {
        label: 'Tip',
        icon: Lightbulb,
        styles: {
            container: 'border-l-4 border-purple-500 bg-purple-500/5 dark:bg-purple-500/10',
            icon: 'text-purple-600 dark:text-purple-400',
            label: 'text-purple-700 dark:text-purple-300',
            border: 'bg-gradient-to-r from-purple-500/20 to-transparent'
        }
    }
} as const

type CalloutType = keyof typeof calloutTypes

interface CalloutProps {
  type?: CalloutType
  children: React.ReactNode
  title?: string
}

export function Callout({
  type = 'info',
  children,
  title
}: CalloutProps) {
  const config = calloutTypes[type] ?? calloutTypes.info
  const Icon = config.icon

  return (
    <aside
      className={`
        my-6
        rounded-lg
        overflow-hidden
        transition-all duration-300
        hover:shadow-md
        ${config.styles.container}
      `}
      role="complementary"
      aria-label={`${config.label}: ${title || ''}`}
    >
      {/* Gradient top accent */}
      <div className={`h-1 ${config.styles.border}`} />

      <div className="flex gap-4 px-4 pt-4">
        <div className="flex-shrink-0 pt-0.5">
          <Icon
            className={`w-5 h-5 ${config.styles.icon}`}
            aria-hidden="true"
          />
        </div>

        <div className="flex-1">
          <span
            className={`font-semibold text-sm uppercase tracking-wide ${config.styles.label}`}
          >
            {title || config.label}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 pl-12">
        <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-2">
          {children}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          aside {
            animation: slideInLeft 0.3s ease-out;
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-8px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>
    </aside>
  )
}