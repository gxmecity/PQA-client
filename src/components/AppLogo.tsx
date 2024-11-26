import logoBlack from '@/assets/PQTLogoBlack.png'
import logoWhite from '@/assets/PQTLogoWhite.png'
import clsx from 'clsx'

export default function AppLogo({ variant }: { variant?: 'white' | 'dark' }) {
  return (
    <span>
      <img
        className={clsx(variant === 'dark' ? 'block' : 'dark:hidden')}
        src={logoBlack}
      />
      <img
        src={logoWhite}
        className={clsx(
          !variant
            ? 'dark:block hidden'
            : variant === 'white'
              ? 'block'
              : 'hidden'
        )}
      />
    </span>
  )
}
