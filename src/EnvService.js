export function getVar(name) {
  return import.meta.env[`SNOWPACK_PUBLIC_${name}`]
}
