// @ts-nocheck
'use server';

const API_TOKEN = 'yZLG3dKGFhhPYE4Mezz1HLMtqXmfnsokvD22tiklMz2BvdMHODvPQ0IanOCk';
// OFFER_HASH will be passed dynamically
const PRODUCT_HASH = '034fadkvwm';
// BASE_AMOUNT will be passed dynamically
const PRODUCT_TITLE = 'VIVA SORTE';
const IS_DROPSHIPPING = false;
const PIX_EXPIRATION_MINUTES = 5;

export async function checkPaymentStatus(hash) {
    if (!hash) {
        return { error: 'Hash não informado', status: 400 };
    }
    const status_url = `https://api.paradisepagbr.com/api/public/v1/transactions/${encodeURIComponent(hash)}?api_token=${API_TOKEN}`;

    try {
        const response = await fetch(status_url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
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
    const api_url = `https://api.paradisepagbr.com/api/public/v1/transactions?api_token=${API_TOKEN}`;
    let customer_data = data.customer || {};
    const utms = data.utms || {};
    const is_direct_pix = true;

    if (is_direct_pix) {
        customer_data = {};
    }

    const cpfs = ['42879052882', '07435993492', '93509642791', '73269352468', '35583648805', '59535423720', '77949412453', '13478710634', '09669560950', '03270618638'];
    const firstNames = ['João', 'Marcos', 'Pedro', 'Lucas', 'Mateus', 'Gabriel', 'Daniel', 'Bruno', 'Maria', 'Ana', 'Juliana', 'Camila', 'Beatriz', 'Larissa', 'Sofia', 'Laura'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho'];
    const ddds = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '92', '27', '48'];
    const emailProviders = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br', 'terra.com.br'];

    let generatedName = null;
    if (!customer_data.name && (is_direct_pix || !false)) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        generatedName = `${randomFirstName} ${randomLastName}`;
        customer_data.name = generatedName;
    }

    if (!customer_data.email && (is_direct_pix || !false)) {
        const nameForEmail = generatedName || customer_data.name || `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const nameParts = String(nameForEmail).split(' ', 2);
        const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w]/g, '');
        
        let emailUserParts = [];
        if (nameParts.length > 0 && nameParts[0].length > 0) {
            emailUserParts.push(normalize(nameParts[0]));
        }
        if (nameParts.length > 1 && nameParts[1].length > 0) {
             emailUserParts.push(normalize(nameParts[1]));
        }
        if(emailUserParts.length === 0){
            emailUserParts.push('cliente');
        }
        const emailUser = `${emailUserParts.join('.')}${Math.floor(100 + Math.random() * 900)}`;
        customer_data.email = `${emailUser}@${emailProviders[Math.floor(Math.random() * emailProviders.length)]}`;
    }

    if (!customer_data.phone_number && (is_direct_pix || !false)) {
        customer_data.phone_number = `${ddds[Math.floor(Math.random() * ddds.length)]}9${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    if (!customer_data.document && (is_direct_pix || !false)) {
        customer_data.document = cpfs[Math.floor(Math.random() * cpfs.length)];
    }

    if (!IS_DROPSHIPPING) {
        customer_data.street_name = customer_data.street_name ?? 'Rua do Produto Digital';
        customer_data.number = customer_data.number ?? '0';
        customer_data.complement = customer_data.complement ?? 'N/A';
        customer_data.neighborhood = customer_data.neighborhood ?? 'Internet';
        customer_data.city = customer_data.city ?? 'Brasil';
        customer_data.state = customer_data.state ?? 'BR';
        customer_data.zip_code = customer_data.zip_code ?? '00000000';
    }

    const cart_items = [{ "product_hash": PRODUCT_HASH, "title": PRODUCT_TITLE, "price": amount, "quantity": 1, "operation_type": 1, "tangible": IS_DROPSHIPPING }];

    const payload = { 
        "amount": Math.round(amount), 
        "offer_hash": offerHash, 
        "payment_method": "pix", 
        "customer": customer_data, 
        "cart": cart_items, 
        "installments": 1, 
        "tracking": utms 
    };

    if (PIX_EXPIRATION_MINUTES > 0) {
        payload.pix_expires_in = PIX_EXPIRATION_MINUTES * 60;
    }

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();
        return { data: responseData, status: response.status };

    } catch (error) {
        return { error: error.message, status: 500 };
    }
}
