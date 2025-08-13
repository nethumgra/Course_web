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
    const productsGrid = document.getElementById('products-grid');
    let allProducts = [];
    let productsSwiper; 

    // Swiper initialization
    function initializeSwiper() {
        if (productsSwiper) {
            productsSwiper.destroy(true, true);
        }
        productsSwiper = new Swiper('.products-swiper', {
            loop: false, // Loop is often better as false when dynamically adding/removing content
            slidesPerView: 2,
            spaceBetween: 16,
            pagination: {
                el: '.products-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 24 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
            }
        });
    }

    // Function to render products into the slider
    function renderProducts() {
        if (!productsGrid) return;
        
        productsGrid.innerHTML = ''; // Clear previous slides
        if (allProducts.length === 0) {
            productsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">No courses available.</p>';
            return;
        }

        allProducts.forEach(product => {
            const firstImageUrl = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl.split(',')[0].trim() : 'https://via.placeholder.com/400x300.png?text=No+Image';
            
            // ========== HTML STRUCTURE EDITED HERE ==========
            // Added 'course-card', 'course-title', 'course-price' classes
            // Made the main div clickable by adding cursor-pointer
            const productSlideHTML = `
                <div class="swiper-slide h-auto">
                    <div class="course-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                        <img src="${firstImageUrl}" alt="${product.name}" class="w-full h-44 object-cover">
                        <div class="p-4 flex flex-col flex-grow">
                            <h3 class="course-title text-lg font-bold text-gray-800 flex-grow" title="${product.name}">
                                ${product.name}
                            </h3>
                            <p class="course-price text-xl text-fresh-green font-semibold mt-2">
                                ${product.price}
                            </p>
                        </div>
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
        productsGrid.innerHTML = '<p class="text-center text-red-500 col-span-full">Could not load products.</p>';
    });

    // ========== WHATSAPP CLICK LOGIC ADDED HERE ==========
    const whatsappNumber = '94779004063'; 
    const productsContainer = document.getElementById('products'); // The parent section

    if (productsContainer) {
        productsContainer.addEventListener('click', function(event) {
            const card = event.target.closest('.course-card');

            if (card) {
                const titleElement = card.querySelector('.course-title');
                const priceElement = card.querySelector('.course-price');

                const courseTitle = titleElement ? titleElement.textContent.trim() : 'a selected course';
                const coursePrice = priceElement ? priceElement.textContent.trim() : 'N/A';

                const whatsappMessage = `
Hello! I'm interested in the "${courseTitle}" course.
The listed price is ${coursePrice}.
Can you please provide me with more details on how to enroll?
Thank you.
                `.trim();

                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');
            }
        });
    }
});