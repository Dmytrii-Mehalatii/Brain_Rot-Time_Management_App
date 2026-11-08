import { useEffect, useState } from "react";
import { useUsagePermission } from "./useUsagePermission";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 50;

/**
 * Reads a snapshot from the native usage-stats module and fills it in once
 * usage access is granted. Android can return nothing for a moment right after
 * the permission flips, so an empty read is retried a few times.
 *
 * `read` and `isEmpty` must be stable references (define them at module scope).
 */
export function useUsageSnapshot<T>(
  read: () => T,
  isEmpty: (snapshot: T) => boolean,
): T {
  const granted = useUsagePermission();
  const [snapshot, setSnapshot] = useState(read);

  useEffect(() => {
    if (!granted || !isEmpty(snapshot)) return;

    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const refresh = () => {
      const next = read();
      if (!isEmpty(next)) {
        setSnapshot(next);
      } else if (attempt++ < MAX_RETRIES) {
        timer = setTimeout(refresh, RETRY_DELAY_MS);
      }
    };

    refresh();
    return () => clearTimeout(timer);
  }, [granted, snapshot, read, isEmpty]);

  return snapshot;
}
