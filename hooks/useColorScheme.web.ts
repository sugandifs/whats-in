import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme(); // Move this before any conditional returns

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Return the actual colorScheme if hydrated, otherwise return 'light'
  return hasHydrated ? colorScheme : "light";
}
