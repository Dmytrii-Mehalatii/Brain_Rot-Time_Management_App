import { createContext, useContext } from "react";

/**
 * A context whose hook throws when no provider is mounted, so a missing
 * provider fails loudly instead of leaking `null` into components.
 */
export function createStrictContext<T>(providerName: string) {
  const Context = createContext<T | null>(null);

  function useStrictContext(): T {
    const value = useContext(Context);
    if (value === null) {
      throw new Error(`${providerName} is missing from the component tree`);
    }
    return value;
  }

  return [Context.Provider, useStrictContext] as const;
}
