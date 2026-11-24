/** Sign-in URL that brings the person back to where they were. */
export function signInPath(location: { pathname: string; search: string }): string {
  return `/entrar?voltar=${encodeURIComponent(location.pathname + location.search)}`
}
