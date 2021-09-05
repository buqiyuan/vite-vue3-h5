export {}

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    orderNo?: number
    // title
    title: string
    // role info
    roles?: RoleEnum[]
    // Whether not to cache
    ignoreKeepAlive?: boolean
    // icon on tab
    icon?: string
  }
}
