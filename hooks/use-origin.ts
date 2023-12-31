import { useEffect, useState } from "react";

export const UseOrigin = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin =
    typeof window !== undefined &&
    window.location.origin &&
    window.location.origin;

  if (!origin || !mounted) return "";

  return origin;
};
