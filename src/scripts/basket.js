import { body, basketBtn, basketTotal, basketList, basketDelete, basket } from "./variables.js";

let products = [];
let sum = 0;

export const showProductCount = () => {
    const products = JSON.parse(localStorage.getItem("products"));
    const productCount = document.querySelector(".product__count");

    if (products.length) {
        productCount.innerText = `${products.length}`;
        productCount.classList.remove("hide");
    } else {
        productCount.classList.add("hide");
    }
};

export const addProductToBasket = (product) => {
    const products = JSON.parse(localStorage.getItem("products"));
    const find = products.find((item) => item.id === product.id);
    const message = document.querySelector(".message");

    message.classList.add("show");
    setTimeout(() => {
        message.classList.remove("show");
    }, 1500);

    if (find) {
        message.innerText = "Товар уже есть в корзине";
        return;
    }

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    showProductCount();
};

export const createProduct = (id, name, newPrice, oldPrice, imgSrc) => {
    const basketItem = document.createElement("li");
    const image = document.createElement("img");
    const productInfo = document.createElement("div");
    const productName = document.createElement("p");
    const costs = document.createElement("div");
    const newCost = document.createElement("p");
    const oldCost = document.createElement("p");
    const deleteProduct = document.createElement("button");

    basketItem.className = "basket__item";
    image.className = "basket__image";
    productInfo.className = "basket__info";
    productName.className = "basket__info-name";
    costs.className = "basket__info-costs";
    newCost.className = "basket__info-new-cost";
    oldCost.className = "basket__info-old-cost";
    deleteProduct.className = "basket__info-delete";

    basketItem.dataset.productId = id;
    basketItem.append(image, productInfo);
    productInfo.append(productName, costs);
    costs.append(newCost, oldCost, deleteProduct);

    image.src = imgSrc;
    productName.innerText = name;
    newCost.innerText = `${newPrice} руб.`;
    oldCost.innerText = `${oldPrice} руб.`;
    deleteProduct.innerText = "Удалить";

    deleteProduct.addEventListener("click", (event) => {
        const parent = event.target.closest(".basket__item");
        parent.remove();
        products = products.filter(
            (product) => +product.id !== +parent.dataset.productId,
        );
        localStorage.setItem("products", JSON.stringify(products));
        sum -= newPrice;

        if (sum <= 0) {
            basketTotal.innerText = `В корзине пока ничего нет`;
        } else {
            basketTotal.innerText = `Итого ${sum} руб.`;
        }

        showProductCount();
    });
    return basketItem;
};

export const initBasket = () => {
    body.style.overflow = "hidden";
    sum = 0;
    const productsFromStorage = JSON.parse(localStorage.getItem("products"));
    showProductCount();

    if (
        "products" in localStorage &&
        productsFromStorage &&
        productsFromStorage.length
    ) {
        basketList.innerHTML = "";
        productsFromStorage.forEach((product) => {
            basketList.append(
                createProduct(
                    product.id,
                    product.name,
                    product.newPrice,
                    product.oldPrice,
                    product.imgSrc,
                ),
            );
            products.push(product);
            sum += product.newPrice;
        });
        basketTotal.innerText = `Итого ${sum} руб.`;
    }

    basket.classList.add("show");
};

export const initListeners = () => {
    basketBtn.addEventListener("click", () => {
        initBasket();
    });

    basketDelete.addEventListener("click", () => {
        basketList.innerHTML = "";
        basketTotal.innerText = `В корзине пока ничего нет`;
        products = [];
        localStorage.setItem("products", JSON.stringify(products));
        showProductCount();
    });
};


