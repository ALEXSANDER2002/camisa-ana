"use server"

import { v4 as uuidv4 } from "uuid"
import type { Shirt } from "./types"
import { supabase, isSupabaseConfigured } from "./supabase"
import { revalidatePath } from "next/cache"

export async function getShirts(): Promise<Shirt[]> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    console.error("Supabase não está configurado. Verifique as variáveis de ambiente.")
    return []
  }

  try {
    const { data, error } = await supabase.from("shirts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar camisetas:", error)
      // Se a tabela não existir, retornamos um array vazio em vez de lançar um erro
      return []
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      color: item.color,
      material: item.material,
      quantity: item.quantity,
      price: item.price,
      description: item.description || "",
      paid: item.paid !== undefined ? item.paid : false,
    }))
  } catch (error) {
    console.error("Erro ao buscar camisetas:", error)
    return []
  }
}

export async function addShirt(shirtData: Shirt): Promise<Shirt> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  const newShirt = {
    id: uuidv4(),
    name: shirtData.name,
    size: shirtData.size,
    color: shirtData.color,
    material: shirtData.material,
    quantity: shirtData.quantity,
    price: shirtData.price,
    description: shirtData.description || null,
    paid: shirtData.paid !== undefined ? shirtData.paid : false,
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("shirts").insert([newShirt]).select()

  if (error) {
    console.error("Erro ao adicionar camiseta:", error)
    throw new Error("Falha ao adicionar camiseta")
  }

  revalidatePath("/")

  return {
    id: newShirt.id,
    name: newShirt.name,
    size: newShirt.size,
    color: newShirt.color,
    material: newShirt.material,
    quantity: newShirt.quantity,
    price: newShirt.price,
    description: newShirt.description || "",
    paid: newShirt.paid,
  }
}

export async function updateShirt(shirtData: Shirt): Promise<Shirt> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  const { data, error } = await supabase
    .from("shirts")
    .update({
      name: shirtData.name,
      size: shirtData.size,
      color: shirtData.color,
      material: shirtData.material,
      quantity: shirtData.quantity,
      price: shirtData.price,
      description: shirtData.description || null,
      paid: shirtData.paid !== undefined ? shirtData.paid : false,
    })
    .eq("id", shirtData.id)
    .select()

  if (error) {
    console.error("Erro ao atualizar camiseta:", error)
    throw new Error("Falha ao atualizar camiseta")
  }

  revalidatePath("/")

  return shirtData
}

export async function deleteShirt(id: string): Promise<void> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  const { error } = await supabase.from("shirts").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir camiseta:", error)
    throw new Error("Falha ao excluir camiseta")
  }

  revalidatePath("/")
}

// Função simplificada para verificar se a tabela existe
export async function checkTableExists(): Promise<boolean> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    console.error("Supabase não está configurado. Verifique as variáveis de ambiente.")
    return false
  }

  try {
    // Tentar selecionar da tabela e ver se funciona
    const { data, error } = await supabase.from("shirts").select("id").limit(1)

    // Se não houver erro, a tabela existe
    if (error) {
      console.error("Erro ao verificar tabela:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao verificar tabela:", error)
    return false
  }
}

