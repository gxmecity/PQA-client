import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar'

type Props = {
  value: number
  total: number
  color?: string
  sizeClassname?: string
}

export default function CircularProgress({
  value,
  total,
  color = '#000000',
  sizeClassname = 'size-40 text-2xl',
}: Props) {
  return (
    <AnimatedCircularProgressBar
      min={0}
      max={total}
      value={value}
      gaugePrimaryColor={color}
      gaugeSecondaryColor={`${color}1A`}
      className={sizeClassname}
    />
  )
}
