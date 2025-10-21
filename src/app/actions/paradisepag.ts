
// @ts-nocheck
'use server';

const API_TOKEN = 'sk_a689a20c480aee9372486cfc6ed7c349ecd7951ce3129f0236adff9a31ee42c7';
const PRODUCT_HASH = 'prod_36678ec9169f9196';
const PRODUCT_TITLE = 'Viva Sorte';
const IS_DROPSHIPPING = false;
const PIX_EXPIRATION_MINUTES = 5;

export async function checkPaymentStatus(hash) {
    if (!hash) {
        return { error: 'Hash não informado', status: 400 };
    }
    const status_url = `https://multi.paradisepags.com/api/v1/check_status.php?hash=${encodeURIComponent(hash)}`;

    try {
        const response = await fetch(status_url, {
            method: 'GET',
            headers: { 
                'Accept': 'application/json',
                'X-API-Key': API_TOKEN
            },
            cache: 'no-store'
        });

        const responseData = await response.json();

        if (response.ok) {
            if (responseData.payment_status) {
                return { payment_status: responseData.payment_status, status: 200 };
            } else {
                return { error: 'Resposta da API inválida', status: 500 };
            }
        } else {
            return { error: responseData, status: response.status };
        }
    } catch (error) {
        return { error: error.message, status: 500 };
    }
}

export async function createPayment(data) {
    const { amount, offerHash } = data;
    const api_url = `https://multi.paradisepags.com/api/v1/transaction.php`;
    let customer_data = data.customer || {};
    const utms = data.utms || {};
    
    // --- FAKE DATA GENERATION ---
    const cpfs = ['42879052882', '07435993492', '93509642791', '73269352468', '35583648805', '59535423720', '77949412453', '13478710634', '09669560950', '03270618638'];
    const firstNames = ['João', 'Marcos', 'Pedro', 'Lucas', 'Mateus', 'Gabriel', 'Daniel', 'Bruno', 'Maria', 'Ana', 'Juliana', 'Camila', 'Beatriz', 'Larissa', 'Sofia', 'Laura'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho'];
    const ddds = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '92', '27', '48'];
    const emailProviders = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br', 'terra.com.br'];

    let generatedName = null;
    if (!customer_data.name) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        generatedName = `${randomFirstName} ${randomLastName}`;
        customer_data.name = generatedName;
    }

    if (!customer_data.email) {
        const nameForEmail = generatedName || customer_data.name;
        const nameParts = String(nameForEmail).split(' ', 2);
        const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w]/g, '');
        
        let emailUserParts = [];
        if (nameParts.length > 0 && nameParts[0].length > 0) emailUserParts.push(normalize(nameParts[0]));
        if (nameParts.length > 1 && nameParts[1].length > 0) emailUserParts.push(normalize(nameParts[1]));
        if(emailUserParts.length === 0) emailUserParts.push('cliente');

        const emailUser = `${emailUserParts.join('.')}${Math.floor(100 + Math.random() * 900)}`;
        customer_data.email = `${emailUser}@${emailProviders[Math.floor(Math.random() * emailProviders.length)]}`;
    }

    if (!customer_data.phone_number) {
        customer_data.phone_number = `${ddds[Math.floor(Math.random() * ddds.length)]}9${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    if (!customer_data.document) {
        customer_data.document = cpfs[Math.floor(Math.random() * cpfs.length)];
    }
    // --- END FAKE DATA ---

    if (!IS_DROPSHIPPING) {
        customer_data.street_name = customer_data.street_name ?? 'Rua do Produto Digital';
        customer_data.number = customer_data.number ?? '0';
        customer_data.complement = customer_data.complement ?? 'N/A';
        customer_data.neighborhood = customer_data.neighborhood ?? 'Internet';
        customer_data.city = customer_data.city ?? 'Brasil';
        customer_data.state = customer_data.state ?? 'BR';
        customer_data.zip_code = customer_data.zip_code ?? '00000000';
    }

    const payload = {
      "amount": Math.round(amount),
      "description": PRODUCT_TITLE,
      "reference": 'CKO-' + new Date().getTime(),
      "checkoutUrl": data.checkout_url || '',
      "productHash": PRODUCT_HASH,
      "orderbump": [],
      "customer": {
          'name': customer_data.name,
          'email': customer_data.email,
          'document': (customer_data.document || '').replace(/\D/g, ''),
          'phone': (customer_data.phone_number || '').replace(/\D/g, '')
      },
      "address": {
          "street": customer_data.street_name,
          "number": customer_data.number,
          "neighborhood": customer_data.neighborhood,
          "city": customer_data.city,
          "state": customer_data.state,
          "zipcode": (customer_data.zip_code || '').replace(/\D/g, ''),
          "complement": customer_data.complement || ''
      },
      "tracking": utms
    };

    if (Object.keys(payload.tracking).length === 0) {
        delete payload.tracking;
    }

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'X-API-Key': API_TOKEN
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();
        
        // Handle new API response structure
        if (response.ok && responseData.transaction) {
             const transaction_data = responseData.transaction;
             const frontend_response = {
                hash: transaction_data.id,
                pix: {
                    pix_qr_code: transaction_data.qr_code || '',
                    expiration_date: transaction_data.expires_at || null
                },
                amount_paid: Math.round(amount)
            };
            return { data: { transaction: frontend_response }, status: response.status };
        }
        
        return { data: responseData, status: response.status, error: responseData.message };

    } catch (error) {
        return { error: error.message, status: 500 };
    }
}
