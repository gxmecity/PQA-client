import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import logo from '@/assets/GXMECITY Logi Logo 2025.png'

interface Props {
  onCompleteAnimation: () => void
}

function StartGameScreen({ onCompleteAnimation }: Props) {
  useGSAP(() => {
    const tl = gsap.timeline({ paused: true })
    tl.to('.panels .panel:first-child, .panels .panel:last-child', {
      scaleY: 1,
      duration: 1,
    })
      .to(
        '.panels .panel:not(:first-child):not(:last-child)',
        { scaleY: 1 },
        '-=0.5'
      )
      .to('.panels .panel', {
        scaleY: 0,
        duration: 0.6,
        stagger: 0.05,
      })
      .to('.panels', {
        clipPath: 'circle(0%)',
        skewX: 0,
        duration: 2,
      })
      .to(
        '.page-main',
        {
          clipPath: 'circle(100%)',
          duration: 1.5,
        },
        '-=0.3'
      )
      .to('.brand-logo', {
        x: 0,
      })
      .to('.brand-name', {
        x: 0,
        display: 'inline-block',
        opacity: 1,
        duration: 1,
      })
      .to('.start-screen-main', {
        opacity: 0,
        duration: 1,
        onComplete: onCompleteAnimation,
      })

    tl.play()

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className=' h-screen overflow-hidden'>
      <ul className='panels'>
        <li className='panel'></li>
        <li className='panel'></li>
        <li className='panel'></li>
        <li className='panel'></li>
        <li className='panel'></li>
        <li className='panel'></li>
      </ul>
      <div className='start-screen-main'>
        <div>
          <div className=' flex items-center gap-4'>
            <div className=' w-[100px] translate-x-60 brand-logo pr-2'>
              <img src={logo} alt='Game city' />
            </div>
            <h1 className=' text-[80px] text-game-foreground brand-name -translate-x-10 opacity-0 '>
              GAMECITY
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartGameScreen
