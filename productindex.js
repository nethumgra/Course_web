// --- FIREBASE IMPORTS ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyAVu0_PvOOA_1D1Dk0La4Gy-X_dlrq5n4s",
    authDomain: "mindinu-vege.firebaseapp.com",
    projectId: "mindinu-vege",
    storageBucket: "mindinu-vege.appspot.com",
    messagingSenderId: "122155864706",
    appId: "1:122155864706:web:42f6c6aff06b3aeb779a9b",
    measurementId: "G-8X3DYYXF2K"
};

// --- INITIALIZE FIREBASE APP ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('products-grid'); // This is the swiper-wrapper
    let allProducts = [];
    let productsSwiper; // To hold the swiper instance

    // UPDATED: Swiper initialization with mobile-first settings
    function initializeSwiper() {
        if (productsSwiper) {
            productsSwiper.destroy(true, true);
        }
        productsSwiper = new Swiper('.products-swiper', {
            // --- Mobile View Settings ---
            loop: true,
            slidesPerView: 1.25, // එක product එකකුයි, ඊළඟ එකෙන් ටිකකුයි පේනවා
            spaceBetween: 16,    // Product කාඩ් දෙකක් අතර ඉඩ
            centeredSlides: true,
            
            // Autoplay from your original code
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            
            // Pagination dots
            pagination: {
                el: '.products-swiper .swiper-pagination', // Made selector more specific
                clickable: true,
            },
            
            // --- Settings for Larger Screens ---
            breakpoints: {
                // Small devices (tablets, landscape phones) @ 640px
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false, // Centering is only for the mobile look
                },
                // Medium devices (tablets) @ 768px
                768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
                // Large devices (desktops) @ 1024px
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                },
            }
        });
    }

    // Function to render products into the slider
    function renderProducts() {
        if (!productsGrid) return;
        
        productsGrid.innerHTML = ''; // Clear previous slides
        if (allProducts.length === 0) {
            productsGrid.innerHTML = '<p class="text-center text-gray-500">No products available.</p>';
            return;
        }

        allProducts.forEach(product => {
            const firstImageUrl = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl.split(',')[0].trim() : 'https://via.placeholder.com/400x500.png?text=No+Image';
            
            const productSlideHTML = `
                <div class="swiper-slide h-auto">
                    <div class="bg-white rounded-lg shadow-md overflow-hidden product-card transition-shadow duration-300 hover:shadow-xl h-full">
                        <a href="#" class="cursor-pointer">
                            <img src="${firstImageUrl}" alt="${product.name}" class="w-full h-auto aspect-[4/3] object-cover">
                            <div class="p-4 text-center">
                                <h3 class="text-sm font-medium text-gray-800 uppercase truncate product-name" title="${product.name}">
                                    ${product.name}
                                </h3>
                                <p class="text-base text-gray-500 mt-1 product-price">
                                    ${product.price}
                                </p>
                            </div>
                        </a>
                    </div>
                </div>`;
            productsGrid.innerHTML += productSlideHTML;
        });

        // Re-initialize or update the swiper after rendering slides
        if (productsSwiper) {
            productsSwiper.update();
        } else {
            initializeSwiper();
        }
    }

    // Fetch products from Firebase and render them
    const productsQuery = query(collection(db, "products"));
    onSnapshot(productsQuery, (querySnapshot) => {
        allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProducts();
    }, (error) => {
        console.error("Error fetching products: ", error);
        productsGrid.innerHTML = '<p class="text-center text-red-500">Could not load products.</p>';
    });
});