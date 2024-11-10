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


let cart = [];

// abre o Modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar Modal clique fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closedMdalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Adicionar item
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // ADD Carrinho
        addToCart(name, price)
    }
})

// Função para add carrinho
function addToCart(name, price){
    const existItem = cart.find(item => item.name === name)

    if(existItem){
        // Caso item exista, aumenta a quantidade +1
        existItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    
updateCartModal()

}

// Atualiza carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between"
            <div>
                <div> 
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>


                <button class="remove-btn" data-name="${item.name}">
                    remover
                </button>

            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

// Função de remover
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }

})

// Removedor visivél
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return
        }
        cart.splice(index, 1);
        updateCartModal();
    }

}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

})
//--------------------------TROCO--------------------------------------------
trocoInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        trocoInput.classList.remove("border-red-500")
        trocoWarn.classList.add("hidden")
    }

})

// Finalizar Pedido
checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const trocoInputValue = trocoInput.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    let trocoMessage = "";
    let paymentMethod = "";

    // Verificar se o valor no campo troco é um número para pagamento em dinheiro
    const trocoValue = parseFloat(trocoInputValue);

    if (!isNaN(trocoValue) && trocoValue >= total) {
        // Pagamento em dinheiro com valor para troco
        paymentMethod = `Troco para: R$ ${trocoValue.toFixed(2)}`;
        const troco = trocoValue - total;
        trocoMessage = `%0ATroco a ser devolvido: R$ ${troco.toFixed(2)}`;
        trocoWarn.classList.add("hidden");  // Esconde o aviso de erro de troco
    } else if (["debito", "Débito", "Crédito", "Cred", "Deb", "credito", "pix"].includes(trocoInputValue)) {
        // Pagamento via cartão ou Pix, sem troco
        paymentMethod = trocoInputValue.charAt(0).toUpperCase() + trocoInputValue.slice(1);
        trocoMessage = `%0APagamento por ${paymentMethod}.`;
        trocoWarn.classList.add("hidden");  // Esconde o aviso de erro de troco
    } else {
        // Caso o campo troco esteja incorreto, mostra o aviso de erro de troco
        trocoWarn.classList.remove("hidden");
        return;  // Impede de enviar a mensagem sem corrigir o troco
    }

    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price}`;
    }).join(" | ");

    const message = encodeURIComponent(cartItems) +
        `%0AEndereço: ${addressInput.value}` +
        `%0AForma de pagamento: ${paymentMethod}` +
        `%0AObs: ${obsInput.value}` +
        `%0ATotal do pedido: R$ ${total.toFixed(2)}` +
        trocoMessage;

    const phone = "33988538798";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
});




// Card de abertura
function checkRestaurantOpen(){
    const data = new Date();
    const dia = data.getDay();
    const hora = data.getHours();

    return dia>= 1 && dia <=5 && hora >= 14 && hora < 18;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bf-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}