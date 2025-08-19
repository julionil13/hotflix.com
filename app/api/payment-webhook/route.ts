import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Função auxiliar para calcular a data de expiração com base no nome do plano.
function getPlanDetails(planTitle: string): { days: number } {
  const lowerCaseTitle = planTitle.toLowerCase()
  if (lowerCaseTitle.includes('mensal')) return { days: 30 }
  if (lowerCaseTitle.includes('trimestral')) return { days: 90 }
  if (lowerCaseTitle.includes('semestral')) return { days: 180 }
  if (lowerCaseTitle.includes('anual')) return { days: 365 }
  return { days: 0 } // Retorna 0 se o plano não for reconhecido
}

// Esta é a função que a TriboPay irá chamar.
export async function POST(request: Request) {
  try {
    // 1. RECEBER E PROCESSAR OS DADOS DA TRIBOPAY
    const body = await request.json()

    // Adicionamos um log para podermos ver no terminal do servidor exatamente o que a TriboPay nos enviou.
    console.log('Webhook da TriboPay recebido:', JSON.stringify(body, null, 2))

    // Extraímos o status da transação e os metadados (onde guardámos o ID do utilizador).
    const transactionStatus = body.status
    const userId = body.metadata?.userId // Assumindo que a TriboPay devolve os metadados que enviámos.

    // 2. VERIFICAR SE O PAGAMENTO FOI APROVADO
    // A TriboPay usa o status "paid" para pagamentos aprovados.
    if (transactionStatus === 'paid' && userId) {
      // 3. CONECTAR AO SUPABASE COM PERMISSÕES DE ADMINISTRADOR
      // Para atualizar dados de forma segura no back-end, usamos as chaves de serviço do Supabase.
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Esta é uma chave secreta!
      )

      // 4. CALCULAR A NOVA DATA DE EXPIRAÇÃO DO ACESSO
      const planTitle = body.cart?.[0]?.title || ''
      const planDetails = getPlanDetails(planTitle)

      if (planDetails.days > 0) {
        const newExpirationDate = new Date()
        newExpirationDate.setDate(newExpirationDate.getDate() + planDetails.days)

        // 5. ATUALIZAR O REGISTO DO UTILIZADOR NA BASE DE DADOS
        const { error } = await supabaseAdmin
          .from('users')
          .update({ access_expires_at: newExpirationDate.toISOString() })
          .eq('id', userId) // Encontra o utilizador pelo ID que guardámos.

        if (error) {
          // Se houver um erro ao atualizar a base de dados, registamo-lo.
          console.error('Erro ao atualizar o acesso do utilizador:', error)
          // Mesmo com erro, devolvemos 200 para a TriboPay não continuar a enviar a notificação.
          return NextResponse.json({ received: true, error: 'Erro na base de dados' }, { status: 200 })
        }

        console.log(`Acesso concedido ao utilizador ${userId} por ${planDetails.days} dias.`)
      }
    }

    // 6. RESPONDER À TRIBOPAY
    // É crucial devolver uma resposta de sucesso (status 200) para que a TriboPay saiba
    // que recebemos a notificação e não tente enviá-la novamente.
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('Erro ao processar o webhook da TriboPay:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
