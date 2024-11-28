import logoBlack from '@/assets/PQTLogoBlack.png'
import logoWhite from '@/assets/PQTLogoWhite.png'

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
      <img src={variant === 'dark' ? logoWhite : logoBlack} alt='app logo' />
    </span>
  )
}
