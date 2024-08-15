function initQuickAddToCart() {
    let customProductFormChangeUnsubscriber;

    function init() {
        customProductFormChangeUnsubscriber = subscribe(
            PUB_SUB_EVENTS.customProductFormChange,
            optionValueListener
        );

        const overlay = document.querySelector('[js-quick-atc-overlay]');
        document.querySelectorAll('[js-quick-add-to-cart-btn]').forEach((gridElm) => {
            gridElm.addEventListener('click', ({ currentTarget }) => {
                const productHandle = currentTarget.dataset.productHandle;
                fetchProductForm(productHandle);
            });
        });

        overlay.addEventListener('click', () => {
            if (!overlay.classList.contains('hide')) {
                overlay.classList.add('hide');
                document.querySelector('[js-quick-add-to-cart]').classList.add('hide');
            }
        });
    }

    function optionValueListener(arg) {
        const { selectedOptionValues, target } = arg;
        const productHandle = target.dataset.productUrl;
        const url = `${productHandle}/?option_values=${selectedOptionValues.join(',')}&view=quick-popup`;

        updateVariantOptions(url);
    }

    async function updateVariantOptions(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
    
            const htmlText = await response.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(htmlText, 'text/html');
            
            const newProductForm = html.querySelector('product-form');
            const currentProductForm = document.querySelector('product-form');
    
            if (newProductForm && currentProductForm) {
                currentProductForm.replaceWith(newProductForm);
            } else {
                console.error('Product form element not found.');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async function fetchProductForm(handle) {
        const url = `${location.origin}/products/${handle}?view=quick-popup`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to load quick popup content.');

            const htmlText = await response.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(htmlText, 'text/html');

            const quickAtcElement = document.querySelector('[js-quick-add-to-cart]');
            const overlay = document.querySelector('[js-quick-atc-overlay]');

            if (quickAtcElement.classList.contains('hide')) {
                quickAtcElement.classList.remove('hide');
                overlay.classList.remove('hide');
            }

            quickAtcElement.innerHTML = ''; 
            const newContent = html.body.querySelector('.modal_product_card');
            if (newContent) {
                quickAtcElement.appendChild(newContent);
            }

            const crossBtn = document.querySelector('[js-popup-cross-btn]');
            crossBtn.addEventListener('click', closeQuickPopup);

        } catch (error) {
            console.error('Error loading quick popup:', error);
        }
    }
    function closeQuickPopup() {
        const quickAtcElement = document.querySelector('[js-quick-add-to-cart]');
        const overlay = document.querySelector('[js-quick-atc-overlay]');
    
        if (!quickAtcElement.classList.contains('hide')) {
            quickAtcElement.classList.add('hide');
            overlay.classList.add('hide');
        }
    }

    function cleanup() {
        if (customProductFormChangeUnsubscriber) {
            customProductFormChangeUnsubscriber();
        }
    }

    // Initialize the quick add-to-cart functionality
    init();

    // Return cleanup function to be called when needed (like when the component is removed)
    return cleanup;
}

// Automatically run the initialization when the script loads
const quickAddToCartCleanup = initQuickAddToCart();

//  header related js
function toggleMenu(event) {
    const headerWrapper = event.currentTarget.closest('[js-header-wrapper]');
    headerWrapper.classList.toggle('open');
}

function initializeMenuToggle() {
    const toggleMenuButtons = document.querySelectorAll('[js-toggle-menu-btn]');
    toggleMenuButtons.forEach(function(btn) {
        btn.addEventListener('click', toggleMenu);
    });
}

// Initialize the menu toggle functionality
initializeMenuToggle();