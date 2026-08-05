import { useMutation } from "@tanstack/react-query";

interface PrepareSessionInput {
  topicId: string;
}

// Placeholder for a real content-generation call (e.g. an AI backend that
// generates a fresh custom topic). Modeled as a proper async boundary via
// TanStack Query so swapping the body for a real fetch later requires no
// changes to the screens that consume this hook.
async function prepareSession({ topicId }: PrepareSessionInput): Promise<{ topicId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 650 + Math.random() * 350));
  return { topicId };
}

export function useGenerateSession() {
  return useMutation({ mutationFn: prepareSession });
}
