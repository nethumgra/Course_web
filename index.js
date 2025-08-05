// js/main.js (Corrected and Combined Version)

import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- DOM Element Variables ---
const productsGrid = document.getElementById('products-grid');
const searchBar = document.getElementById('search-bar');
const stockFilter = document.getElementById('stock-filter');
const testimonialsWrapper = document.getElementById('testimonials-swiper-wrapper');
const toastEl = document.getElementById('success-toast');
const toastMessageEl = document.getElementById('toast-message');
const links = document.querySelectorAll('a[href^="#"]');

// --- State Variables ---
let allProducts = []; // Stores all products from Firebase
let testimonialsSwiper; // Stores the swiper instance
let toastTimeout;

// --- Reusable Functions ---
function showToast(message) {
    if (!toastEl || !toastMessageEl) return;
    clearTimeout(toastTimeout);
    toastMessageEl.textContent = message;
    toastEl.classList.remove('translate-x-full');
    toastTimeout = setTimeout(() => {
        toastEl.classList.add('translate-x-full');
    }, 3000);
}

function renderProducts() {
    if (!productsGrid || !searchBar || !stockFilter) return;

    const searchTerm = searchBar.value.toLowerCase();
    const filterValue = stockFilter.value;

    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesStock = (filterValue === 'all') || (product.stock === filterValue);
        return matchesSearch && matchesStock;
    });

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">No products match your criteria.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const imageUrl = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : 'https://via.placeholder.com/400x300.png?text=No+Image';
        const isSoldOut = product.stock === 'out';
        const stockBadgeClass = isSoldOut ? 'bg-red-500' : 'bg-green-500';
        const stockBadgeText = isSoldOut ? 'Sold Out' : 'In Stock';
        const cardEffects = isSoldOut ? 'grayscale opacity-70' : '';
        const buttonDisabled = isSoldOut ? 'disabled' : '';

        const productCardHTML = `
            <div class="relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 product-card ${cardEffects}">
                <div class="absolute top-2 right-2 text-xs font-bold text-white py-1 px-3 rounded-full z-10 ${stockBadgeClass}">${stockBadgeText}</div>
                <img src="${imageUrl}" alt="${product.name}" class="w-full h-48 object-cover bg-gray-200">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-green-600 font-bold text-lg mb-4">${product.price}</p>
                    <button class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded ${isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-green-600'}" ${buttonDisabled}>
                        <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>`;
        productsGrid.innerHTML += productCardHTML;
    });
}


document.addEventListener('DOMContentLoaded', function() {
    
    // This code initializes the slider for your manual reviews
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        // General settings
        loop: true,
        spaceBetween: 30, //  කාඩ්පත් අතර ඉඩ
        
        // Autoplay settings
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        
        // Pagination dots at the bottom
        pagination: {
            el: '.testimonials-swiper .swiper-pagination',
            clickable: true,
        },

        // --- Breakpoints for different screen sizes ---
        
        // Default view (for mobile)
        slidesPerView: 1,

        // Settings for larger screens
        breakpoints: {
            // For tablets (768px and wider)
            768: {
                slidesPerView: 2, // reviews 2ක් පේනවා
            },
            // For PCs (1024px and wider)
            1024: {
                slidesPerView: 3, // reviews 3ක් පේනවා
            }
        }
    });

});

     

// Make function globally accessible for onclick attribute
window.scrollToProducts = function() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

