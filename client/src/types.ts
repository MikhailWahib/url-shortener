export interface User {
  id: number
  username: string
}

export interface Url {
  id: number
  originalUrl: string
  shortUrl: string
  clicks: number
}
