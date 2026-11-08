import UsageStats from "@/modules/usage-stats";
import { useEffect, useState } from "react";

/** Whether Android "Usage access" is granted, kept in sync with the native side. */
export function useUsagePermission(): boolean {
  const [granted, setGranted] = useState(() => UsageStats.hasPermission());

  useEffect(() => {
    const subscription = UsageStats.addListener(
      "onPermissionChanged",
      (event) => setGranted(event.granted),
    );
    return () => subscription.remove();
  }, []);

  return granted;
}
