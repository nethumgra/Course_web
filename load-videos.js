document.addEventListener("DOMContentLoaded", function() {
    const videoContainer = document.getElementById('video-swiper-wrapper');

    // videos.html file එකේ content එක fetch කරනවා
   fetch('videoload.html')
        .then(response => {
            // response එක හරිද බලනවා
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // HTML content එක text විදියට ගන්නවා
        })
        .then(html => {
            // ගත්ත HTML content එක videoContainer එක ඇතුළට දානවා
            videoContainer.innerHTML = html;

            // --- වැදගත්ම කොටස ---
            // HTML content එක load කරාට පස්සේ Swiper එක initialize කරනවා
            // එසේ නොකළහොත්, Swiper එක හිස් container එකක් මත initialize වෙනවා
            const videoSwiper = new Swiper('.video-swiper', {
                loop: true, // ඔබට loop අවශ්‍ය නම් true කරන්න
                spaceBetween: 30,
                slidesPerView: 1,
                pagination: {
                    el: '.video-swiper .swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.video-swiper .swiper-button-next',
                    prevEl: '.video-swiper .swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1280: {
                        slidesPerView: 3,
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or loading videos:', error);
            videoContainer.innerHTML = '<p class="text-center text-red-500 w-full">Could not load videos.</p>';
        });
});