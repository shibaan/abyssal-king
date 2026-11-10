import { createContext, useContext } from 'react'

export const NavContext = createContext({ navigate: () => {}, lenis: { current: null } })
export const useNavigate = () => useContext(NavContext).navigate
export const useLenis = () => useContext(NavContext).lenis
