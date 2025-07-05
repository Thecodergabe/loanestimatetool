declare module 'csv-parser' {
  import { Transform } from 'stream'
  interface Options {
    headers?: string[]
    skipLines?: number
  }
  function csv(options?: Options): Transform
  export default csv
}