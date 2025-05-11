"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAllRooms } from "@/actions/app.action"

function Rooms() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const result = await fetchAllRooms()
      if (result.error) throw new Error(result.error)
      return result.data
    },
  })

  if (isLoading)
    return (
      <div
        className={
          "text-xl font-semibold w-full flex items-center justify-center w-screen h-screen"
        }
      >
        Loading...
      </div>
    )

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-screen h-screen">
        <p className="text-red-500">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 px-5 font-semibold text-[.970rem] bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Rooms List:</h2>
      {data?.map((room) => (
        <div key={room.id} className="p-4 border rounded">
          {room.name}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-8">Fetch All Rooms</h1>
      <Rooms />
    </main>
  )
}
