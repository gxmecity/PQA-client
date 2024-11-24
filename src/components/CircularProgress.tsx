import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar'

type Props = {
  value: number
  total: number
}

export default function CircularProgress({ value, total }: Props) {
  return (
    <AnimatedCircularProgressBar
      min={0}
      max={total}
      value={value}
      gaugePrimaryColor='rgb(0 0 0)'
      gaugeSecondaryColor='rgba(0, 0, 0, 0.1)'
    />
  )
}
