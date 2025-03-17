"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Package, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import type { Shirt } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deleteShirt } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Card, CardContent } from "@/components/ui/card"

interface InventoryTableProps {
  shirts: Shirt[]
  onEdit: (shirt: Shirt) => void
  onDelete: (id: string) => void
  onSort: (field: string) => void
  sortField: string
  sortDirection: "asc" | "desc"
}

export default function InventoryTable({
  shirts,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortDirection,
}: InventoryTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [shirtToDelete, setShirtToDelete] = useState<Shirt | null>(null)
  const [detailsShirt, setDetailsShirt] = useState<Shirt | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Verificar se é dispositivo móvel
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleDeleteClick = (shirt: Shirt) => {
    setShirtToDelete(shirt)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (shirtToDelete) {
      await deleteShirt(shirtToDelete.id)
      onDelete(shirtToDelete.id)
      setDeleteDialogOpen(false)
      setShirtToDelete(null)
    }
  }

  const handleDetailsClick = (shirt: Shirt) => {
    setDetailsShirt(shirt)
    setDetailsDialogOpen(true)
  }

  const getSortIndicator = (field: string) => {
    if (field === sortField) {
      return sortDirection === "asc" ? " ↑" : " ↓"
    }
    return ""
  }

  const getQuantityColor = (quantity: number) => {
    if (quantity <= 0) return "bg-red-100 text-red-800"
    if (quantity <= 5) return "bg-amber-100 text-amber-800"
    return "bg-green-100 text-green-800"
  }

  // Renderização para dispositivos móveis
  if (isMobile) {
    return (
      <>
        <div className="space-y-4 animate-slide-in">
          {shirts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-center bg-white rounded-lg border p-4">
              <Package className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-muted-foreground">Nenhuma camiseta encontrada.</p>
            </div>
          ) : (
            shirts.map((shirt) => (
              <Card key={shirt.id} className="overflow-hidden hover-scale">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <h3 className="font-medium">{shirt.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="font-semibold">
                          {shirt.size}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full border shadow-sm"
                            style={{ backgroundColor: shirt.color.toLowerCase() }}
                          />
                          <span className="text-xs text-muted-foreground">{shirt.color}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium">R$ {shirt.price.toFixed(2)}</span>
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getQuantityColor(
                          shirt.quantity,
                        )}`}
                      >
                        {shirt.quantity} un.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <div>
                      {shirt.paid !== undefined ? (
                        shirt.paid ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" /> Pago
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" /> Não Pago
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          N/A
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDetailsClick(shirt)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(shirt)}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleDeleteClick(shirt)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Diálogo de detalhes para visualização em dispositivos móveis */}
        <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalhes da Camiseta</AlertDialogTitle>
            </AlertDialogHeader>
            {detailsShirt && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{detailsShirt.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tamanho</p>
                    <Badge variant="outline" className="font-semibold">
                      {detailsShirt.size}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Cor</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border shadow-sm"
                        style={{ backgroundColor: detailsShirt.color.toLowerCase() }}
                      />
                      {detailsShirt.color}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Material</p>
                    <p>{detailsShirt.material}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getQuantityColor(
                        detailsShirt.quantity,
                      )}`}
                    >
                      {detailsShirt.quantity}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preço</p>
                    <p className="font-medium">R$ {detailsShirt.price.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status de Pagamento</p>
                  {detailsShirt.paid !== undefined ? (
                    detailsShirt.paid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" /> Pago
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                      >
                        <XCircle className="h-3 w-3" /> Não Pago
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                      N/A
                    </Badge>
                  )}
                </div>

                {detailsShirt.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="text-sm">{detailsShirt.description}</p>
                  </div>
                )}
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Fechar</AlertDialogCancel>
              <Button
                onClick={() => {
                  setDetailsDialogOpen(false)
                  if (detailsShirt) onEdit(detailsShirt)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Diálogo de confirmação de exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a camiseta
                {shirtToDelete && <strong> "{shirtToDelete.name}"</strong>} do seu estoque.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // Renderização para desktop
  return (
    <>
      <div className="rounded-lg border shadow-sm overflow-hidden animate-slide-in">
        <Table className="inventory-table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("name")}>
                Nome da Pessoa{getSortIndicator("name")}
              </TableHead>
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("size")}>
                Tamanho{getSortIndicator("size")}
              </TableHead>
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("color")}>
                Cor{getSortIndicator("color")}
              </TableHead>
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("material")}>
                Material{getSortIndicator("material")}
              </TableHead>
              <TableHead className="cursor-pointer text-right font-semibold" onClick={() => onSort("quantity")}>
                Quantidade{getSortIndicator("quantity")}
              </TableHead>
              <TableHead className="cursor-pointer text-right font-semibold" onClick={() => onSort("price")}>
                Preço{getSortIndicator("price")}
              </TableHead>
              <TableHead className="cursor-pointer text-center font-semibold" onClick={() => onSort("paid")}>
                Pagamento{getSortIndicator("paid")}
              </TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shirts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-10 w-10 mb-2 opacity-20" />
                    <p>Nenhuma camiseta encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              shirts.map((shirt) => (
                <TableRow key={shirt.id} className="hover-scale">
                  <TableCell className="font-medium">{shirt.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">
                      {shirt.size}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border shadow-sm"
                        style={{ backgroundColor: shirt.color.toLowerCase() }}
                      />
                      {shirt.color}
                    </div>
                  </TableCell>
                  <TableCell>{shirt.material}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getQuantityColor(
                        shirt.quantity,
                      )}`}
                    >
                      {shirt.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">R$ {shirt.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {shirt.paid !== undefined ? (
                      shirt.paid ? (
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" /> Pago
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" /> Não Pago
                          </Badge>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          N/A
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => onEdit(shirt)} className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2 text-blue-500" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(shirt)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a camiseta
              {shirtToDelete && <strong> "{shirtToDelete.name}"</strong>} do seu estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

