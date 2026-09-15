import { createContext, useContext } from "react";
import { useFlashToggle } from "@/hooks/useFlashToggle";

/**
 * Flash isolation: the toggle re-renders only the components that actually
 * consume useFlash() — shift lights, alarm banner, bezel shift LED. The
 * provider wraps the dashboard but DDU3Dashboard itself does NOT consume the
 * context, so it stays calm between data frames.
 *
 * Consumers that only need to flash when active (AlarmOverlay, bezel shift LED)
 * are split into outer/inner components so the outer returns null before
 * subscribing when idle — no 5Hz re-renders when nothing is flashing.
 */

export const FlashContext = createContext(false);

export function FlashProvider({ children, hz = 2.5 }) {
  const flash = useFlashToggle(hz);
  return <FlashContext.Provider value={flash}>{children}</FlashContext.Provider>;
}

export function useFlash() {
  return useContext(FlashContext);
}