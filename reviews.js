// --- TESTIMONIALS SLIDER WITH FIREBASE ---

// Find the existing Swiper initialization in your main scripts, or add this one.
// We are assuming a 'testimonials-swiper' class on your swiper container.
const testimonialsSwiper = new Swiper('.testimonials-swiper', {
    loop: true,
    spaceBetween: 30,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.testimonials-swiper .swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
    }
});

// Firebase Configuration (Add your config here as well)
const firebaseConfig = {
    apiKey: "AIzaSyCV2IrYyrDuvwo0KrDkErYU5jQzF_Ay33A",
    authDomain: "web-course-ba01f.firebaseapp.com",
    databaseURL: "https://web-course-ba01f-default-rtdb.firebaseio.com",
    projectId: "web-course-ba01f",
    // ... rest of your config keys
};

// Check if Firebase is already initialized to avoid errors
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const reviewsRef = database.ref('reviews').orderByChild('timestamp'); // Order by newest

// Function to generate star icons
function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star text-yellow-400"></i>';
        } else {
            starsHTML += '<i class="fas fa-star text-gray-300"></i>';
        }
    }
    return starsHTML;
}



testimonialsSwiper.prependSlide(newSlideHTML);
testimonialsSwiper.update();