import type { ZodError } from "zod";

export function zodMessagesFromError(error: ZodError): string[] {
  return error.issues.map((issue) => {
    if (issue.path.length === 0) {
      return `${issue.message}.`
    } else {
      const path = issue.path.map((i) => i).join('.')
      return `${path}: ${issue.message}.`
    }
  })
}