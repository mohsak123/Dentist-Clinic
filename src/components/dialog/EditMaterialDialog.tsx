"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"

export interface Material {
  id: number
  name: string
  description: string
  quantity: number
  price: string
}

const schema = z.object({
  quantity: z
    .number("The quantity should ba a number.")
    .nonnegative("The quantity should ba bigger than 0."),
})

type FormValues = z.infer<typeof schema>

interface EditMaterialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material: Material | null
  onUpdated?: (updatedMaterial: Material) => void
}

export default function EditMaterialDialog({
  open,
  onOpenChange,
  material,
  onUpdated
}: EditMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: material?.quantity ?? 0 },
  })

  const {token} = useAuth();

  // Sync form when material changes
  useEffect(() => {
    if (material) {
      setValue("quantity", material.quantity)
    } else {
      reset({ quantity: 0 })
    }
  }, [material, setValue, reset])

  const onSubmit = async (values: FormValues) => {
    if (!material) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/materials/${material.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ quantity: values.quantity }),
        }
      )

      if (!res.ok) {
        throw new Error(`Update failed (${res.status})`)
      }

      const updated: Material = await res.json()
      toast.success("Edit material has been successfully")
      onOpenChange(false)
      if (onUpdated) onUpdated(updated)
    } catch (e) {
      toast.error("صار خطأ أثناء التحديث")
      console.log(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit the quantity of material</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="quantity">The new quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                {...register("quantity", {
                  setValueAs: (v: any) => (v === "" || v === null ? 0 : Number(v)),
                })}
                className="mt-1"
                placeholder="Enter the new quantity"
              />
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "loading..." : "save changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
