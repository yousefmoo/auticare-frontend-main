import { specialistDirectory as specialistsSeed } from '../features/dashboard/portalArabicData'

const wait = (value, delay = 250) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), delay)
  })

export function getSpecialists() {
  return wait(structuredClone(specialistsSeed))
}
