export function getCookie(name) {
  return getAllCookies()[name]
}
export function setCookie(name, value) {
  document.cookie = `${name}=${value}`
}
export function getAllCookies() {
  const arrCookies = document.cookie.split(';')
  let objCookies = {}
  for (const strCookie of arrCookies) {
    const [key, value] = strCookie.trim().split('=')
    objCookies[key] = value
  }
  return objCookies
}
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=${new Date()}`
}
