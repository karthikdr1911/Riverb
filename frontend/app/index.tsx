// Root index - Redirect to onboarding splash
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to splash screen
    router.replace("/(onboarding)/splash");
  }, []);

  return null;
}
