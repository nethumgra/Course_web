import { db } from './firebase-config.js'; // අපේ නිවැරදි config එක import කරනවා
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function () {
    const videoSwiperWrapper = document.getElementById('video-swiper-wrapper');
    if (!videoSwiperWrapper) {
        console.error("Video Swiper wrapper not found!");
        return;
    }

    const videoSwiper = new Swiper('.video-swiper', {
        loop: false,
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
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 }
        },
        on: {
            slideChange: function () {
                if (this.slides[this.previousIndex]) {
                    const previousSlide = this.slides[this.previousIndex];
                    const iframe = previousSlide.querySelector('iframe');
                    if (iframe) {
                        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                }
            },
        },
    });

    const videosCollectionRef = collection(db, 'videos');
    const q = query(videosCollectionRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            videoSwiperWrapper.innerHTML = '<p class="text-center text-gray-500 w-full">No videos have been added yet.</p>';
            videoSwiper.update();
            return;
        }

        const videoSlides = snapshot.docs.map(doc => {
            const video = doc.data();
            if (!video.videoId) return '';
            
            const youtubeUrl = `https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`;

            return `
                <div class="swiper-slide">
                    <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                        <iframe 
                            src="${youtubeUrl}" 
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                            class="rounded-lg shadow-lg">
                        </iframe>
                    </div>
                </div>
            `;
        }).join('');

        videoSwiper.removeAllSlides();
        videoSwiper.appendSlide(videoSlides);
        videoSwiper.update();
    });
});