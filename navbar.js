document.addEventListener('DOMContentLoaded', function() {
            // All other scripts remain the same
            const header = document.getElementById('main-header');
            const nav = document.getElementById('main-nav');
            const mobileMenu = document.getElementById('mobile-menu');

            function setPositions() {
                if (header && nav) {
                    const headerHeight = header.offsetHeight;
                    if (window.innerWidth >= 768) { nav.style.display = 'block'; nav.style.top = headerHeight + 'px'; const navHeight = nav.offsetHeight; document.body.style.paddingTop = (headerHeight + navHeight) + 'px'; } else { nav.style.display = 'none'; document.body.style.paddingTop = headerHeight + 'px'; }
                    if(mobileMenu) { mobileMenu.style.top = headerHeight + 'px'; }
                }
            }
            setPositions(); window.addEventListener('resize', setPositions);
            const dropdownButton = document.querySelector('.dropdown > button');
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownButton && dropdownMenu) { dropdownButton.addEventListener('click', function(event) { event.stopPropagation(); dropdownMenu.classList.toggle('hidden'); }); }
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            if (mobileMenuButton && mobileMenu) { mobileMenuButton.addEventListener('click', function() { mobileMenu.classList.toggle('hidden'); }); }
            const categoryTrigger = document.getElementById('mobile-category-trigger');
            const categorySubmenu = document.getElementById('mobile-category-submenu');
            if (categoryTrigger && categorySubmenu) { categoryTrigger.addEventListener('click', function() { categorySubmenu.classList.toggle('hidden'); const icon = categoryTrigger.querySelector('i'); icon.classList.toggle('rotate-180'); }); }
            document.addEventListener('click', function(event) { if (dropdownMenu && !dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) { dropdownMenu.classList.add('hidden'); } });

            // Swiper for Hero Slider
            var heroSwiper = new Swiper(".myHeroSwiper", {
                loop: true,
                autoplay: { delay: 4000, disableOnInteraction: false, },
                pagination: { el: ".swiper-pagination", clickable: true, },
                on: {
                    init: function () {
                        this.slides.forEach(slide => {
                            const background = slide.dataset.background;
                            if (background) {
                                slide.style.backgroundImage = `url(${background})`;
                                slide.style.backgroundSize = 'contain';
                                slide.style.backgroundRepeat = 'no-repeat';
                                slide.style.backgroundPosition = 'center right';
                            }
                        });
                    },
                    slideChange: function () {
                        this.slides.forEach(slide => {
                            const background = slide.dataset.background;
                            if (background && slide.style.backgroundImage === '') {
                                slide.style.backgroundImage = `url(${background})`;
                                slide.style.backgroundSize = 'contain';
                                slide.style.backgroundRepeat = 'no-repeat';
                                slide.style.backgroundPosition = 'center right';
                            }
                        });
                    }
                }
            });

            // Swiper for Category Slider
            var categorySwiper = new Swiper(".category-slider", {
                loop: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                    reverseDirection: true, 
                },
                slidesPerView: 3,
                spaceBetween: 0,
                breakpoints: {
                    480: { slidesPerView: 4, spaceBetween: 0, },
                    640: { slidesPerView: 5, spaceBetween: 0, },
                    768: { slidesPerView: 6, spaceBetween: 0, },
                    1024: { slidesPerView: 8, spaceBetween: 0, },
                },
            });
        });

  // Swiper for Ads
            var adSwiper = new Swiper(".ad-swiper", {
                // Mobile-first configuration
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                slidesPerView: 1.1, // Changed from 1.25
                spaceBetween: 16,
                centeredSlides: true,
                pagination: {
                    el: ".ad-swiper .swiper-pagination",
                    clickable: true,
                },
                // When window width is >= 768px (md breakpoint)
                breakpoints: {
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                        centeredSlides: false,
                        loop: true, 
                        autoplay: { 
                            delay: 3000,
                            disableOnInteraction: false,
                        },
                    }
                }
            });

        