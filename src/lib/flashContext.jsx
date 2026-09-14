import { createContext, useContext } from "react";
import { useFlashToggle } from "@/hooks/useFlashToggle";

/**
 * Flash isolation: the toggle re-renders only the components that actually
 * need to flash (shift lights, alarm banner, bezel shift LED) — not the
 * entire dashboard 5×/sec. DDU3Dashboard wraps its content in <FlashProvider>
 * but does NOT consume the context, so it stays calm between data frames.
 */

export const FlashContext = createContext(true);

export function FlashProvider({ children, hz = 2.5 }) {
  const flash = useFlashToggle(hz);
  return <FlashContext.Provider value={flash}>{children}</FlashContext.Provider>;
}

export function useFlash() {
  return useContext(FlashContext);
}