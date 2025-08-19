import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Esta é a função principal que será executada quando o teu site chamar esta API.
export async function POST(request: Request) {
  // Obtém os dados do plano (ex: "mensal") e o preço que o front-end enviou.
  const { plan, price } = await request.json()

  // 1. VERIFICAR SE O UTILIZADOR ESTÁ AUTENTICADO
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Se não houver um utilizador logado, devolve um erro.
    return NextResponse.json({ error: 'É preciso estar autenticado para fazer uma compra.' }, { status: 401 })
  }

  // 2. OBTER O TOKEN SECRETO DA TRIBOPAY (DE FORMA SEGURA)
  const triboPayToken = process.env.TRIBOPAY_API_TOKEN

  if (!triboPayToken) {
    console.error('Token da TriboPay não configurado no servidor.')
    return NextResponse.json({ error: 'Erro de configuração do servidor.' }, { status: 500 })
  }

  // 3. PREPARAR OS DADOS PARA ENVIAR À TRIBOPAY (ESTRUTURA CORRIGIDA)
  
  // --- ATENÇÃO: DADOS DO CLIENTE ---
  // A TriboPay exige um CPF/CNPJ e um número de telemóvel válidos.
  // Para o site funcionar em produção, terás de adicionar estes campos ao formulário de registo
  // e guardá-los nos metadados do utilizador no Supabase.
  const customerPhoneNumber = user.phone || '11999999999'; // Usar o do utilizador ou um placeholder para testes
  const customerDocument = user.user_metadata?.document || '00000000000'; // Usar o do utilizador ou um placeholder para testes

  if (customerDocument === '00000000000') {
      console.error("AVISO: O documento (CPF) do cliente é um placeholder. A transação pode falhar.");
  }

  const payload = {
    amount: Math.round(price * 100), // Valor em centavos
    
    // --- PASSO CRÍTICO PARA O PIX FUNCIONAR ---
    // O 'offer_hash' e o 'product_hash' NÃO são valores que inventamos.
    // 1. Vai ao teu painel da TriboPay.
    // 2. Cria uma "Oferta" (ex: "Planos de Acesso Hotflix"). A TriboPay vai dar-te um HASH para esta oferta.
    // 3. Dentro da Oferta, cria um "Produto" (ex: "Acesso Mensal"). A TriboPay vai dar-te um HASH para este produto.
    // 4. Substitui os valores de exemplo abaixo pelos HASHES REAIS da tua conta TriboPay.
    offer_hash: '7becb', // SUBSTITUIR PELO TEU OFFER HASH REAL
    
    payment_method: 'pix',
    customer: {
      name: user.user_metadata?.full_name || 'Utilizador Hotflix',
      email: user.email,
      phone_number: customerPhoneNumber,
      document: customerDocument,
    },
    cart: [
      {
        product_hash: '7tjdfkshdv', // SUBSTITUIR PELO TEU PRODUCT HASH REAL
        title: `Acesso Hotflix - Plano ${plan}`,
        price: Math.round(price * 100),
        quantity: 1,
        operation_type: 1,
        tangible: false,
      },
    ],
    // O postback_url é essencial para que a TriboPay nos avise quando o pagamento for aprovado.
    postback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment-webhook`,
  }

  // 4. CHAMAR A API DA TRIBOPAY COM A URL E AUTENTICAÇÃO CORRETAS
  try {
    const apiUrl = `https://api.tribopay.com.br/api/public/v1/transactions?api_token=${triboPayToken}`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro da API TriboPay:', data)
      return NextResponse.json({ error: 'Não foi possível gerar o pagamento PIX. Verifica os dados enviados, especialmente o offer_hash.' }, { status: response.status })
    }
    
    console.log('Resposta da TriboPay recebida:', JSON.stringify(data, null, 2));

    // 5. DEVOLVER OS DADOS DO PIX PARA O FRONT-END
    // Com base na resposta da TriboPay, extraímos os dados do PIX.
    return NextResponse.json({
      qrCodeBase64: data.qr_code_base64, // Imagem do QR Code em base64
      pixCode: data.qr_code,             // Código "copia e cola"
    })
  } catch (error) {
    console.error('Erro ao comunicar com a TriboPay:', error)
    return NextResponse.json({ error: 'Ocorreu um erro de comunicação com o sistema de pagamentos.' }, { status: 500 })
  }
}
