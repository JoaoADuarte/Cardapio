const menu = document.getElementById("menu")
const cartModal = document.getElementById("cart-modal")
const cartBtn = document.getElementById("cart-btn")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const closedMdalBtn = document.getElementById("closed-modal-btn")
const checkoutBtn = document.getElementById("checkout-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const trocoInput = document.getElementById("troco")
const trocoWarn = document.getElementById("troco-warn")
const obsInput = document.getElementById("Obs")
const paymentMethodSelect = document.getElementById("Pagamento") // dropdown do pagamento
const valueCamp = document.getElementById("campoValor")
const valueInput = document.getElementById("valor")
const paymentwarn = document.getElementById("payment-warn")

let cart = [];
let total = 0; // Variável global para o total
let trocoMessage = ""; // Variável global para a mensagem de troco


// Função para calcular o troco
function calcularTroco() {
    const valorPago = parseFloat(valueInput.value.replace(/[^\d,]/g, "").replace(",", "."));
    const troco = valorPago - total;

    if (!isNaN(troco) && troco >= 0) {
        trocoMessage = `%0ATroco: R$ ${troco.toFixed(2)}`;
    } else {
        trocoMessage = "%0ATroco: Valor insuficiente";
    } 
} 

// abre o Modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
})

// Fechar Modal clique fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none";
    }
})

closedMdalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
})

// Adicionar item
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if(parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        // ADD Carrinho
        addToCart(name, price);
    }
})

// Função para add carrinho
function addToCart(name, price) {
    const existItem = cart.find(item => item.name === name);

    if(existItem) {
        // Caso item exista, aumenta a quantidade +1
        existItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

// Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    total = 0; // Reinicia o total

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-name="${item.name}">remover</button>
        </div>
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função de remover
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
})

// Removedor visível
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1) {
        const item = cart[index];

        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}






//--------------------------TROCO e Finalização do Pedido--------------------------------------------

// Finalizar Pedido

// Função para verificar o valor do troco e exibir/esconder o aviso se necessário
function verificarValorTroco() {
    const valorPago = parseFloat(valueInput.value.replace(/[^\d,]/g, "").replace(",", "."));

    if (isNaN(valorPago) || valorPago < total) {
        trocoWarn.classList.remove("hidden");
        valueInput.classList.add("border-red-500");
    } else {
        trocoWarn.classList.add("hidden");
        valueInput.classList.remove("border-red-500");
    }
}

// Atualiza o campo de valor ao digitar
valueInput.addEventListener("input", verificarValorTroco);

// Função para verificar o valor do troco e exibir/esconder o aviso se necessário
function verificarValorTroco() {
    const valorPago = parseFloat(valueInput.value.replace(/[^\d,]/g, "").replace(",", "."));

    if (isNaN(valorPago) || valorPago < total) {
        trocoWarn.classList.remove("hidden");
        valueInput.classList.add("border-red-500");
    } else {
        trocoWarn.classList.add("hidden");
        valueInput.classList.remove("border-red-500");
    }
}

// Atualiza o campo de valor ao digitar
valueInput.addEventListener("input", verificarValorTroco);

// Função para verificar a opção de pagamento e exibir/esconder o campo de valor
function verificarOpcao() {
    if (paymentMethodSelect.value === "_blank") {
        paymentwarn.classList.remove("hidden");
        paymentMethodSelect.classList.add("border-red-500");
    } else {
        paymentwarn.classList.add("hidden");
        paymentMethodSelect.classList.remove("border-red-500");
    }

    // Exibe o campo de valor apenas quando a opção "Dinheiro" é selecionada
    if (paymentMethodSelect.value === "Dinheiro") {
        valueCamp.style.display = "block";
    } else {
        valueCamp.style.display = "none";
        trocoWarn.classList.add("hidden"); // Oculta o aviso de troco se a opção não for "Dinheiro"
        valueInput.classList.remove("border-red-500");
    }
}

// Adiciona o listener ao dropdown para executar a verificação
paymentMethodSelect.addEventListener("change", verificarOpcao);

// Esconde o aviso de endereço e pagamento se estiver preenchido/correto
addressInput.addEventListener("input", function() {
    if (addressInput.value !== "") {
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500");
    }
});

// Atualiza o aviso do campo de observação
obsInput.addEventListener("input", function() {
    if (obsInput.value !== "") {
        document.getElementById("obs-warn").classList.add("hidden");
        obsInput.classList.remove("border-red-500");
    }
});

// Função para calcular o troco se a forma de pagamento for dinheiro e o valor for suficiente
function calcularTroco() {
    const valorPago = parseFloat(valueInput.value.replace(/[^\d,]/g, "").replace(",", "."));
    const troco = valorPago - total;

    if (!isNaN(troco) && troco >= 0) {
        trocoMessage = `%0ATroco: R$ ${troco.toFixed(2)}`;
    } else {
        trocoMessage = ""; // Limpa o trocoMessage se o valor for insuficiente
    }
}

// Finalizar Pedido com verificações atualizadas
checkoutBtn.addEventListener("click", function() {
    if (cart.length === 0) return;

    // Verifica endereço
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Verifica método de pagamento
    if (paymentMethodSelect.value === "_blank") {
        paymentwarn.classList.remove("hidden");
        paymentMethodSelect.classList.add("border-red-500");
        return;
    }

    // Verifica o valor no campo de troco
    const valorPago = parseFloat(valueInput.value.replace(/[^\d,]/g, "").replace(",", "."));
    if (paymentMethodSelect.value === "Dinheiro" && (isNaN(valorPago) || valorPago < total)) {
        trocoWarn.classList.remove("hidden");
        valueInput.classList.add("border-red-500");
        return;
    }

    // Calcula o troco apenas se a forma de pagamento for dinheiro e o valor for suficiente
    const paymentMethod = paymentMethodSelect.value;
    if (paymentMethod === "Dinheiro" && valorPago >= total) {
        calcularTroco();
    } else {
        trocoMessage = ""; // Zera a mensagem de troco para outras formas de pagamento ou valor insuficiente
    }

    // Cria a mensagem de pedido para o WhatsApp com a forma de pagamento e o troco (se aplicável)
    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price}`;
    }).join(" | ");

    const message = encodeURIComponent(cartItems) +
        `%0AEndereço: ${addressInput.value}` +
        `%0AForma de pagamento: ${paymentMethod}` +
        `%0AObs: ${obsInput.value || "Nenhuma"}` +
        `%0ATotal do pedido: R$ ${total.toFixed(2)}` +
        trocoMessage;

    const phone = "5533988538798";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
});


// Card de abertura
function checkRestaurantOpen() {
    const data = new Date();
    const dia = data.getDay();
    const hora = data.getHours();

    return dia >= 1 && dia <= 5 && hora >= 14 && hora < 18;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
