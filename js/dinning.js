let carts = document.querySelectorAll('.cart');
let products = [
    {
        name: 'Allen',
        price: 120,
        inCart: 0
    },
    {
        name: 'Allen Queen',
        price: 120,
        inCart: 0
    },
    {
        name: 'Bordo Queen',
        price: 120,
        inCart: 0
    },
    {
        name: 'OSO Single Seater',
        price: 120,
        inCart: 0
    },
    {
        name: 'Papillon Queen Storge',
        price: 120,
        inCart: 0
    },
]

for (let i=0; i < carts.length; i++){
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if(productNumbers) {
        document.querySelector('.cart_no span').textContent = productNumbers;
    }
}

function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers);
    
    if(productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart_no span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart_no span').textContent = 1;
    }
    setItems(product);
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null){
        if(cartItems[product.name] == undefined){
            cartItems = {
                ...cartItems,
                [product.name]: product
            }
        }
        cartItems[product.name].inCart += 1;
    } else{
        product.inCart = 1;
        cartItems = {
            [product.name]: product
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product){
    let cartCost = localStorage.getItem('totalCost');
    
    if(cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    }else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");

    cartItems = JSON.parse(cartItems);
    console.log(cartItems);
    let productContainer = document.querySelector(".checkoutItem");

    let cartCost = localStorage.getItem('totalCost');

    if(cartItems && productContainer ) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="checkout__container--middle">
                <div class="remove__item">
                    <i class="uil uil-times-circle"></i>
                </div>
            <div class="remove__itemDetails">
                <p class="cart-title-name">${item.name}</p>
                <div class="add_no">
                    <i class="uil uil-plus-circle"></i>
                    <span>${item.inCart}</span>
                    <i class="uil uil-minus-circle"></i>
                </div>
                <p class="money">$${item.inCart * item.price},00</p>
            </div>
            </div>
            `
        });

        productContainer.innerHTML += `
        <div class="total_price">
            <h2>Total Price</h2>
            <p class="cart-total-price">$${cartCost},00</p>
        </div>
        `;
    }
}

if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}else {
    ready()
}

function ready(){
    var removeCartItemButtons = document.getElementsByClassName('remove__item')
    for (var i=0; i< removeCartItemButtons.length; i++){
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i=0; i< quantityInputs.length; i++){
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    var addToCartButtons = document.getElementsByClassName('cart')
    for (var i=0; i< addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event){
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('p-name')[0].innerText
    var price = shopItem.getElementsByClassName('price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
}

function addItemToCart(title, price) {
    var cartRow = document.createElement('div')
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName('checkoutItem')[0]
    cartItems.append(cartRow)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('checkoutItem')[0]
    var cartRows = cartItemContainer.getElementsByClassName('checkout__container--middle')
    var total = 0
    for (var i=0; i< cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('money')[0]
        var qantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseInt(priceElement.innerText.replace('$', ''))
        var quantity = qantityElement.value
        total = total + (price * quantity)
    }
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}


onLoadCartNumbers();
displayCart();