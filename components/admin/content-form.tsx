"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Define o esquema de validação para os campos do formulário.
const formSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  model_id: z.string().uuid({ message: "Por favor, selecione uma modelo." }),
  category_id: z.string().uuid({ message: "Por favor, selecione uma categoria." }),
  // Adicionamos os campos para os ficheiros, mas a validação é opcional aqui.
  poster_file: z.any().optional(),
  video_file: z.any().optional(),
})

// Tipagem para os dados do formulário.
type ContentFormValues = z.infer<typeof formSchema>

interface ContentFormProps {
  models: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  initialData?: any // Para o modo de edição
  onClose: () => void
}

export function ContentForm({ models, categories, initialData, onClose }: ContentFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      model_id: initialData?.model_id || "",
      category_id: initialData?.category_id || "",
    },
  })

  // Função chamada quando o formulário é submetido.
  const onSubmit = (data: ContentFormValues) => {
    startTransition(async () => {
      try {
        const posterFile = data.poster_file?.[0]
        const videoFile = data.video_file?.[0]

        if (!posterFile || !videoFile) {
          toast({
            title: "Ficheiros em falta",
            description: "Por favor, selecione um poster e um ficheiro de vídeo.",
            variant: "destructive",
          })
          return
        }

        // --- LÓGICA DE UPLOAD PARA O SUPABASE STORAGE ---

        // 1. Upload do Poster
        const posterFileName = `${Date.now()}-${posterFile.name}`
        const { data: posterUploadData, error: posterError } = await supabase.storage
          .from("hotflix-assets") // Nome do teu bucket
          .upload(`posters/${posterFileName}`, posterFile)

        if (posterError) throw posterError

        // 2. Upload do Vídeo
        const videoFileName = `${Date.now()}-${videoFile.name}`
        const { data: videoUploadData, error: videoError } = await supabase.storage
          .from("hotflix-assets") // Nome do teu bucket
          .upload(`videos/${videoFileName}`, videoFile)

        if (videoError) throw videoError

        // 3. Obter os URLs públicos dos ficheiros
        const { data: posterUrlData } = supabase.storage
          .from("hotflix-assets")
          .getPublicUrl(posterUploadData.path)
        
        const { data: videoUrlData } = supabase.storage
          .from("hotflix-assets")
          .getPublicUrl(videoUploadData.path)

        const posterUrl = posterUrlData.publicUrl
        const videoUrl = videoUrlData.publicUrl

        // 4. Guardar os dados (incluindo os URLs) no banco de dados
        const { error: dbError } = await supabase.from("contents").insert({
          title: data.title,
          description: data.description,
          model_id: data.model_id,
          category_id: data.category_id,
          poster_url: posterUrl,
          video_url: videoUrl,
        })

        if (dbError) throw dbError

        toast({
          title: "Sucesso!",
          description: "Novo conteúdo adicionado.",
        })
        router.refresh() // Atualiza a tabela de conteúdos
        onClose() // Fecha o modal
      } catch (error: any) {
        console.error("Erro ao adicionar conteúdo:", error)
        toast({
          title: "Erro",
          description: error.message || "Não foi possível adicionar o conteúdo.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo do Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do vídeo ou ensaio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Campo da Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o conteúdo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo de Seleção de Modelo */}
          <FormField
            control={form.control}
            name="model_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma modelo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Campo de Seleção de Categoria */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- NOVOS CAMPOS DE UPLOAD --- */}
        <FormField
          control={form.control}
          name="poster_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster (Imagem de Capa)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="video_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ficheiro de Vídeo</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="video/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Guardar Alterações" : "Adicionar Conteúdo"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
