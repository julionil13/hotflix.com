"use client"

import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768 // Corresponde ao breakpoint 'md' do Tailwind CSS

export function useMobile() {
  // CORREÇÃO: Inicializamos o estado como 'false' para garantir que o servidor
  // e o cliente renderizem a mesma coisa na primeira vez.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // A lógica para verificar o tamanho da janela agora só é executada no navegador,
    // depois de o componente ter sido "montado", evitando o erro de hidratação.
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Verifica o tamanho inicial da janela
    checkDevice()

    // Adiciona um "ouvinte" para verificar sempre que a janela for redimensionada
    window.addEventListener('resize', checkDevice)

    // Remove o "ouvinte" quando o componente for desmontado para evitar problemas de memória
    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  return isMobile
}
