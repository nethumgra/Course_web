// reviews.js - Wault Dot Design Academy

document.addEventListener('DOMContentLoaded', function() {
    // 1. අලුත්ම Firebase Configuration එක (ඔයාගේ අලුත් Project එකට ගැලපෙන ලෙස)
    const firebaseConfig = {
        apiKey: "AIzaSyCV2IrYyrDuvwo0KrDkErYU5jQzF_Ay33A",
        authDomain: "waultdot-design.firebaseapp.com",
        databaseURL: "https://waultdot-design-default-rtdb.firebaseio.com",
        projectId: "waultdot-design",
    };

    // Firebase Initialize කිරීම
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const database = firebase.database();
    const reviewsRef = database.ref('reviews');
    const testimonialsWrapper = document.getElementById('testimonials-swiper-wrapper');

    // HTML ආරක්ෂිතව පෙන්වීමට (XSS වැළැක්වීමට)
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    let swiper;

    // 2. Realtime Database එකෙන් දත්ත ලබාගැනීම
    // orderByChild පාවිච්චි කරලා අලුත්ම ඒවා අන්තිමට එන විදිහට ගන්නවා
    reviewsRef.orderByChild('timestamp').limitToLast(15).on('value', function(snapshot) {
        if (!testimonialsWrapper) return;
        
        testimonialsWrapper.innerHTML = ''; // කලින් තියෙන ඒවා Clear කරනවා
        const data = snapshot.val();
        
        if (data) {
            // දත්ත Array එකකට හරවා අලුත්ම ඒවා මුලට එනසේ සකසනවා
            const reviewsArray = Object.keys(data).map(key => data[key]);
            reviewsArray.reverse().forEach(review => {
                
                // තරු ලකුණු (Rating) සෑදීම
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    starsHTML += `<i class="fas fa-star ${i <= review.rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`;
                }

                // Slide එක සාදා Wrapper එකට එකතු කිරීම
                const slide = document.createElement('div');
                slide.className = 'swiper-slide pb-4';
                slide.innerHTML = `
                    <div class="bg-white rounded-xl shadow-md p-6 flex flex-col border border-slate-200/80 hover:shadow-xl transition-all duration-300">
                        <header class="flex items-center gap-4 mb-4">
                            <img src="${review.imageUrl || 'https://i.ibb.co/68XqnT3/default-avatar.png'}" 
                                 class="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-gray-100">
                            <div class="flex-grow">
                                <h4 class="font-bold text-slate-800">${escapeHTML(review.name)}</h4>
                                <div class="text-yellow-400 text-lg">${starsHTML}</div>
                            </div>
                        </header>
                        <blockquote class="text-slate-600 leading-relaxed text-left border-l-4 border-slate-200 pl-4 italic">
                            <p>"${escapeHTML(review.comment)}"</p>
                        </blockquote>
                    </div>
                `;
                testimonialsWrapper.appendChild(slide);
            });

            // 3. Swiper Slider එක Refresh/Re-initialize කිරීම
            if (swiper) swiper.destroy(); 
            
            swiper = new Swiper('.testimonials-swiper', {
                loop: reviewsArray.length > 1,
                spaceBetween: 30,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                breakpoints: {
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        }
    });
});
