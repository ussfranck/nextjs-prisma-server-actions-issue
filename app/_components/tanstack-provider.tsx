"use client"

import { ReactNode } from "react"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function TanStackProvider({
  children,
}: {
  children: ReactNode
}) {
  ;<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
