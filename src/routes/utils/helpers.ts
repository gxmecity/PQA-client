import { APPS } from './constraints'

export const getApp = () => {
  const subdomain = getSubDomain(window.location.hostname)

  const main = APPS.find((app) => app.main)

  if (!main) throw new Error('Must have main app')

  if (subdomain === '') return main.app

  const app = APPS.find((app) => subdomain === app.subDomain)

  if (!app) return main.app
  return app.app
}

export const getSubDomain = (location: string) => {
  const locationParts = location.split('.')

  let sliceTil = -2

  //for localhost
  const isLocalHost = locationParts.slice(-1)[0] === 'localhost'
  if (isLocalHost) sliceTil = -1

  return locationParts.slice(0, sliceTil).join('')
}
