// --- FIREBASE IMPORTS (Realtime Database Modular SDK) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCV2IrYyrDuvwo0KrDkErYU5jQzF_Ay33A",
    authDomain: "waultdot-design.firebaseapp.com",
    projectId: "waultdot-design",
    storageBucket: "waultdot-design.appspot.com",
    databaseURL: "https://waultdot-design-default-rtdb.firebaseio.com" 
};

// --- INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productsRef = ref(db, 'products');

// Config for Enrollment
const imgbbApiKey = '65be3e7586c166102752452ff286571a';
const whatsappNumber = '94778629117'; 

// --- MAIN SCRIPT ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- DOM ELEMENTS ---
    const productsGrid = document.getElementById('products-grid');
    const modal = document.getElementById('course-modal');
    
    // Modal Elements
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

    // --- RENDERING FUNCTION (දත්ත පෙන්වන ආකාරය) ---
    function renderProducts(products) {
        if (!productsGrid) return;
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">No courses available at the moment.</p>';
            return;
        }

        let productsHTML = '';
        products.forEach(product => {
            const imageUrl = product.imageUrl || 'https://via.placeholder.com/400x400.png?text=No+Image';
            
            productsHTML += `
                <div class="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                    <div class="aspect-square w-full overflow-hidden">
                        <img src="${imageUrl}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="course-title text-lg font-bold text-gray-800">${product.name}</h3>
                        
                        <p class="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">
                            ${product.description || 'Join our expert-led course to master your skills.'}
                        </p>

                        <button class="open-modal-btn mt-4 w-full bg-black text-white font-bold py-3 px-4 rounded-lg transition duration-300 hover:bg-red-500"
                            data-title="${product.name}"
                            data-description="${product.description || 'Master your skills with our expert-led course.'}">
                            Get This Course
                        </button>
                    </div>
                </div>`;
        });
        productsGrid.innerHTML = productsHTML;
    }
    
    // --- REAL-TIME DATA FETCH (Database එකෙන් දත්ත ගැනීම) ---
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        const productsList = [];
        if (data) {
            Object.keys(data).forEach(key => {
                productsList.push({ id: key, ...data[key] });
            });
        }
        // අලුත්ම Course එක මුලට එන විදිහට Reverse කර ඇත
        renderProducts(productsList.reverse());
    });

    // --- MODAL & ENROLLMENT LOGIC ---
    function openModal(title, description) {
        currentCourseTitle = title;
        if(modalTitle) modalTitle.textContent = title;
        if(modalDescription) modalDescription.innerHTML = description.replace(/\\n/g, '<br>');
        
        // Reset form and status
        if(enrollForm) enrollForm.reset();
        if(slipPreview) slipPreview.classList.add('hidden');
        if(enrollNowBtn) enrollNowBtn.disabled = true;
        if(enrollStatus) enrollStatus.textContent = '';
        
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    // Form එකේ දත්ත තියෙනවාදැයි බැලීම (Validation)
    function validateForm() {
        const nameFilled = enrollNameInput && enrollNameInput.value.trim() !== '';
        const slipSelected = enrollSlipInput && enrollSlipInput.files.length > 0;
        if(enrollNowBtn) enrollNowBtn.disabled = !(nameFilled && slipSelected);
    }
    
    if(enrollNameInput) enrollNameInput.addEventListener('input', validateForm);
    if(enrollSlipInput) enrollSlipInput.addEventListener('change', () => {
        const file = enrollSlipInput.files[0];
        if (file && slipPreview) {
            slipPreview.src = URL.createObjectURL(file);
            slipPreview.classList.remove('hidden');
        } else if(slipPreview) {
            slipPreview.classList.add('hidden');
        }
        validateForm();
    });

    // --- ENROLLMENT SUBMISSION (ImgBB + WhatsApp) ---
    if(enrollForm) {
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
                    const whatsappMessage = `*New Course Enrollment!*\n\nStudent Name: ${studentName}\nCourse: ${currentCourseTitle}\nPayment Slip: ${slipUrl}\n\nPlease verify.`;
                    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                    
                    window.open(whatsappURL, '_blank');
                    enrollStatus.textContent = 'Redirecting to WhatsApp...';
                    setTimeout(closeModal, 2000);
                } else {
                    throw new Error("Image upload failed");
                }
            })
            .catch(error => {
                enrollStatus.textContent = `Error: ${error.message}`;
                enrollNowBtn.disabled = false;
            });
        });
    }

    // Grid එකේ බටන් එක ක්ලික් කිරීම හඳුනාගැනීම
    if (productsGrid) {
        productsGrid.addEventListener('click', function(event) {
            const button = event.target.closest('.open-modal-btn');
            if (button) {
                openModal(button.dataset.title, button.dataset.description);
            }
        });
    }

    // Modal එක වැසීම
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if(e.target === modal) closeModal();
    });
});