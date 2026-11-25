export const INSTAGRAM_PATH =
  'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM17.5 6.5h.01'

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`
}
