import logoBlack from '@/assets/PQTLogoBlack.png'
import logoWhite from '@/assets/PQTLogoWhite.png'
import clsx from 'clsx'

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'

export default function AppLogo({
  variant = systemTheme,
}: {
  variant?: string
}) {
  return (
    <span>
      <img src={variant === 'white' ? logoWhite : logoBlack} alt='app logo' />
    </span>
  )
}
