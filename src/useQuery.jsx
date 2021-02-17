import {useLocation} from 'react-router-dom'

/** @return {Record<string, string>} */
export default function useQuery() {
  return Object.fromEntries(
    new URLSearchParams(useLocation().search)
  )
}
