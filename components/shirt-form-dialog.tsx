"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Shirt } from "@/lib/types"
import { addShirt, updateShirt } from "@/lib/actions"
import { ShirtIcon, User, Palette, Ruler, Package, DollarSign, FileText, CreditCard } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface ShirtFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (shirt: Shirt) => void
  onUpdate: (shirt: Shirt) => void
  editingShirt: Shirt | null
}

const defaultShirt: Shirt = {
  id: "",
  name: "",
  size: "M",
  color: "",
  material: "",
  quantity: 0,
  price: 0,
  description: "",
  paid: false,
}

const sizeOptions = ["PP", "P", "M", "G", "GG", "XGG"]

export default function ShirtFormDialog({ open, onOpenChange, onAdd, onUpdate, editingShirt }: ShirtFormDialogProps) {
  const [formData, setFormData] = useState<Shirt>(defaultShirt)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (editingShirt) {
      setFormData({
        ...editingShirt,
        // Se o campo paid não existir no editingShirt, defina como false
        paid: editingShirt.paid !== undefined ? editingShirt.paid : false,
      })
    } else {
      setFormData(defaultShirt)
    }
    setErrors({})
  }, [editingShirt, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.color.trim()) {
      newErrors.color = "Cor é obrigatória"
    }

    if (!formData.material.trim()) {
      newErrors.material = "Material é obrigatório"
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantidade não pode ser negativa"
    }

    if (formData.price < 0) {
      newErrors.price = "Preço não pode ser negativo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof Shirt, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpar erro quando o campo é editado
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (editingShirt) {
        // Atualizar camiseta existente
        const updatedShirt = await updateShirt(formData)
        onUpdate(updatedShirt)
      } else {
        // Adicionar nova camiseta
        const newShirt = await addShirt(formData)
        onAdd(newShirt)
      }
    } catch (error) {
      console.error("Erro ao salvar camiseta:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-h-[90vh] overflow-y-auto transition-all duration-200",
        isMobile ? "w-[95%] max-w-[95%] p-4" : "sm:max-w-[600px] p-6"
      )}>
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center text-xl font-semibold">
            <ShirtIcon className="h-5 w-5 mr-2 text-pink-500" />
            {editingShirt ? "Editar Camiseta" : "Adicionar Nova Camiseta"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {editingShirt
              ? "Atualize os detalhes desta camiseta no seu estoque."
              : "Preencha os detalhes da pessoa e da camiseta para adicionar ao estoque."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-6 max-h-[calc(90vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
          <div className="grid gap-3">
            <Label htmlFor="name" className="required flex items-center text-sm font-medium">
              <User className="h-4 w-4 mr-2 text-pink-500" />
              Nome da Pessoa
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nome da Pessoa"
              className={cn(
                "transition-all duration-200 focus:ring-2 focus:ring-pink-200",
                errors.name ? "border-red-500 focus:ring-red-200" : "border-input"
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500 animate-slideDown">
                {errors.name}
              </p>
            )}
          </div>

          <div className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            <div className="grid gap-3">
              <Label htmlFor="size" className="required flex items-center text-sm font-medium">
                <Ruler className="h-4 w-4 mr-2 text-pink-500" />
                Tamanho
              </Label>
              <Select value={formData.size} onValueChange={(value) => handleChange("size", value)}>
                <SelectTrigger id="size" className="focus:ring-2 focus:ring-pink-200">
                  <SelectValue placeholder="Selecione o tamanho" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="color" className="required flex items-center text-sm font-medium">
                <Palette className="h-4 w-4 mr-2 text-pink-500" />
                Cor
              </Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                placeholder="ex: Azul"
                className={cn(
                  "transition-all duration-200 focus:ring-2 focus:ring-pink-200",
                  errors.color ? "border-red-500 focus:ring-red-200" : "border-input"
                )}
              />
              {errors.color && (
                <p className="text-sm text-red-500 animate-slideDown">
                  {errors.color}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="material" className="required flex items-center text-sm font-medium">
              <ShirtIcon className="h-4 w-4 mr-2 text-pink-500" />
              Material
            </Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => handleChange("material", e.target.value)}
              placeholder="ex: Algodão"
              className={cn(
                "transition-all duration-200 focus:ring-2 focus:ring-pink-200",
                errors.material ? "border-red-500 focus:ring-red-200" : "border-input"
              )}
            />
            {errors.material && (
              <p className="text-sm text-red-500 animate-slideDown">
                {errors.material}
              </p>
            )}
          </div>

          <div className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            <div className="grid gap-3">
              <Label htmlFor="quantity" className="required flex items-center text-sm font-medium">
                <Package className="h-4 w-4 mr-2 text-pink-500" />
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value) || 0)}
                min="0"
                className={cn(
                  "transition-all duration-200 focus:ring-2 focus:ring-pink-200",
                  errors.quantity ? "border-red-500 focus:ring-red-200" : "border-input"
                )}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500 animate-slideDown">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="price" className="required flex items-center text-sm font-medium">
                <DollarSign className="h-4 w-4 mr-2 text-pink-500" />
                Preço (R$)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className={cn(
                  "transition-all duration-200 focus:ring-2 focus:ring-pink-200",
                  errors.price ? "border-red-500 focus:ring-red-200" : "border-input"
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500 animate-slideDown">
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full bg-pink-100">
                  <CreditCard className="h-4 w-4 text-pink-500" />
                </div>
                <div>
                  <Label htmlFor="paid" className="text-sm font-medium cursor-pointer">
                    Status de Pagamento
                  </Label>
                  <p className="text-xs text-gray-500">
                    Clique para alterar o status
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "text-xs font-medium",
                  formData.paid ? "text-green-600" : "text-red-600"
                )}>
                  {formData.paid ? "Pago" : "Não Pago"}
                </span>
                <Switch
                  id="paid"
                  checked={formData.paid}
                  onCheckedChange={(checked) => handleChange("paid", checked)}
                  className={cn(
                    "data-[state=checked]:bg-green-500",
                    "data-[state=unchecked]:bg-red-500",
                    "transition-all duration-300 ease-in-out",
                    "hover:opacity-90"
                  )}
                />
              </div>
            </div>
            <div className={cn(
              "relative flex items-center justify-between px-4 py-3 rounded-md transition-all duration-300",
              formData.paid 
                ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200" 
                : "bg-gradient-to-r from-red-50 to-red-100 border border-red-200",
              "hover:shadow-sm"
            )}>
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  formData.paid 
                    ? "bg-green-100" 
                    : "bg-red-100"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    formData.paid 
                      ? "bg-green-500" 
                      : "bg-red-500"
                  )} />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-medium",
                    formData.paid 
                      ? "text-green-700" 
                      : "text-red-700"
                  )}>
                    {formData.paid ? "Pagamento Confirmado" : "Aguardando Pagamento"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formData.paid 
                      ? "Pedido pronto para entrega" 
                      : "Aguardando confirmação do pagamento"}
                  </span>
                </div>
              </div>
              <div className={cn(
                "flex items-center justify-center px-3 py-1.5 rounded-full font-medium text-xs",
                formData.paid 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-red-100 text-red-800 border border-red-200",
                "transition-all duration-300",
                "hover:shadow-sm"
              )}>
                {formData.paid ? "PAGO" : "NÃO PAGO"}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description" className="flex items-center text-sm font-medium">
              <FileText className="h-4 w-4 mr-2 text-pink-500" />
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Adicione notas ou detalhes sobre esta camiseta"
              rows={3}
              className="resize-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
        </div>

        <DialogFooter className={cn(
          "mt-6",
          isMobile ? "flex-col space-y-2" : "space-x-2"
        )}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className={cn(
              "border-pink-200 hover:bg-pink-50",
              isMobile ? "w-full" : ""
            )}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "bg-pink-500 hover:bg-pink-600 relative",
              isMobile ? "w-full" : ""
            )}
          >
            {isSubmitting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
            <span className={isSubmitting ? "opacity-0" : ""}>
              {editingShirt ? "Atualizar" : "Adicionar"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

