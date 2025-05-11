"use server"

import prisma from "@/lib/prisma"

export async function fetchAllRooms() {
  try {
    const rooms = await prisma.room.findMany()
    return {data: rooms}
  } catch (error) {
    return {error: "Failed to fetch rooms"}
  }
}

export async function getById(id: string) {
  try {
    const room = await prisma.room.findUnique({
      where: {id},
    })
    if (!room) {
      return {error: "Room not found"}
    }
    return {data: room}
  } catch (error) {
    return {error: "Failed to fetch room"}
  }
}
