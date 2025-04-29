// eslint-disable-next-line ts/no-unsafe-function-type
export interface Type<T = any> extends Function {
  new (...args: any[]): T
}
