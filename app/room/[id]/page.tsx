"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getById } from "@/actions/app.action"

export default function RoomDetailsPage() {
  const { id } = useParams()

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const result = await getById(id as string)
      if (result.error) throw new Error(result.error)
      return result.data
    },
  })

  if (isLoading) {
    return (
      <section className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-screen h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 font-semibold text-[.970rem] bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </section>
    )
  }

  return (
    <section className="w-screen h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">{data?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-lg">{data?.shortDescription}</p>
          <p>{data?.longDescription}</p>
          <p className="font-semibold">Price: ${data?.price}</p>
          <p>Capacity: {data?.capacity} persons</p>
          <p>Room Type: {data?.type}</p>
        </div>
      </div>
    </section>
  )
}
