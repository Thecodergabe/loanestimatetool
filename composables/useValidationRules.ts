// composables/useValidationRules.ts
export const useValidationRules = () => {
  const required = (v: unknown) => !!v || 'This field is required'
  const number = (v: number) => !isNaN(v) || 'Must be a number'
  const positive = (v: number) => (v > 0) || 'Must be greater than 0'
  const percent = (v: number) =>
    (v >= 0 && v <= 100) || 'Must be between 0 and 100'

  const currency = (v: number) =>
    (v >= 0) || 'Enter valid currency amount'

  const zip = (v: string) =>
    /^\d{5}$/.test(v) || 'ZIP must be 5 digits'

  const optionalPercent = (v: number | null) =>
    v === null || percent(v)

  const optionalPositive = (v: number | null) =>
    v === null || positive(v)

  return {
    required,
    number,
    positive,
    percent,
    currency,
    zip,
    optionalPercent,
    optionalPositive,
  }
}
