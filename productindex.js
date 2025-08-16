// --- FIREBASE IMPORTS ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyAVu0_PvOOA_1D1Dk0La4Gy-X_dlrq5n4s",
    authDomain: "mindinu-vege.firebaseapp.com",
    projectId: "mindinu-vege",
    storageBucket: "mindinu-vege.appspot.com",
    messagingSenderId: "122155864706",
    appId: "1:122155864706:web:42f6c6aff06b3aeb779a9b",
    measurementId: "G-8X3DYYXF2K"
};
const imgbbApiKey = '65be3e7586c166102752452ff286571a';
const whatsappNumber = '94779004063';

// --- INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- MAIN SCRIPT ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- DOM ELEMENTS ---
    const productsGrid = document.getElementById('products-grid');
    const productsContainer = document.getElementById('products');
    
    const modal = document.getElementById('course-modal');
    if (!modal) return; // Stop if modal is not on the page
    
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const enrollForm = document.getElementById('enroll-form');
    const enrollNameInput = document.getElementById('enroll-name');
    const enrollSlipInput = document.getElementById('enroll-slip');
    const slipPreview = document.getElementById('slip-preview');
    const enrollNowBtn = document.getElementById('enroll-now-btn');
    const enrollStatus = document.getElementById('enroll-status');
    let currentCourseTitle = '';

    // --- DATA FETCHING & RENDERING (FOR GRID LAYOUT) ---
    function renderProducts(products) {
        if (!productsGrid) return;
        
        let productsHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">No courses available.</p>';
            return;
        }

        products.forEach(product => {
            const firstImageUrl = product.imageUrl?.split(',')[0].trim() || 'https://via.placeholder.com/1080x1080.png?text=No+Image';
            productsHTML += `
                <div class="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div class="aspect-square w-full overflow-hidden">
                        <img src="${firstImageUrl}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="course-title text-lg font-bold text-gray-800 flex-grow">${product.name}</h3>
                        <p class="course-price text-xl text-red-600 font-semibold mt-2">${product.price}</p>
                        <button class="open-modal-btn mt-4 w-full bg-black text-white font-bold py-2 px-4 rounded-lg transition duration-300 hover:bg-red-500"
                            data-title="${product.name}"
                            data-price="${product.price}"
                            data-description="${product.description || 'No description available.'}">
                            Get This Course
                        </button>
                    </div>
                </div>`;
        });
        productsGrid.innerHTML = productsHTML;
    }
    
    const productsQuery = query(collection(db, "products"));
    onSnapshot(productsQuery, (snapshot) => {
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProducts(allProducts);
    });

    // --- MODAL & FORM LOGIC ---
    function openModal(title, description, price) {
        currentCourseTitle = title;
        modalTitle.textContent = title;
        modalDescription.innerHTML = description.replace(/\\n/g, '<br>');
        enrollForm.reset();
        slipPreview.classList.add('hidden');
        enrollNowBtn.disabled = true;
        enrollStatus.textContent = '';
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function validateForm() {
        const nameFilled = enrollNameInput.value.trim() !== '';
        const slipSelected = enrollSlipInput.files.length > 0;
        enrollNowBtn.disabled = !(nameFilled && slipSelected);
    }
    
    enrollNameInput.addEventListener('input', validateForm);
    enrollSlipInput.addEventListener('change', () => {
        const file = enrollSlipInput.files[0];
        if (file) {
            slipPreview.src = URL.createObjectURL(file);
            slipPreview.classList.remove('hidden');
        } else {
            slipPreview.classList.add('hidden');
        }
        validateForm();
    });

    enrollForm.addEventListener('submit', function(event) {
        event.preventDefault();
        enrollNowBtn.disabled = true;
        enrollStatus.textContent = 'Uploading payment slip...';
        
        const file = enrollSlipInput.files[0];
        const formData = new FormData();
        formData.append('image', file);
        
        fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const slipUrl = data.data.url;
                const studentName = enrollNameInput.value.trim();
                const whatsappMessage = `New Course Enrollment!\n-------------------------------\nStudent Name: *${studentName}*\nCourse: *${currentCourseTitle}*\nPayment Slip: ${slipUrl}\n-------------------------------\nPlease verify and confirm.`;
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappURL, '_blank');
                enrollStatus.textContent = 'Redirecting to WhatsApp...';
                setTimeout(closeModal, 2000);
            } else {
                throw new Error(data.error.message);
            }
        })
        .catch(error => {
            console.error('Upload Failed:', error);
            enrollStatus.textContent = `Error: ${error.message}`;
            enrollNowBtn.disabled = false;
        });
    });

    if (productsContainer) {
        productsContainer.addEventListener('click', function(event) {
            const button = event.target.closest('.open-modal-btn');
            if (button) {
                openModal(button.dataset.title, button.dataset.description, button.closest('.flex-col').querySelector('.course-price').textContent.trim());
            }
        });
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    document.addEventListener('keydown', (e) => e.key === "Escape" && !modal.classList.contains('hidden') && closeModal());
});