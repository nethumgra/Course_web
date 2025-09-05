

// js/admin.js

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- START: NEW IMAGE UPLOAD LOGIC ---
// !!! IMPORTANT: DELETE THIS KEY AND GENERATE A NEW ONE ON IMGBB !!!
const apiKey = "b2dcc15e462679116be8965d41b19f09"; // <-- USE YOUR NEW KEY HERE
// !!! IMPORTANT: THIS KEY IS NOW PUBLIC. REPLACE IT! !!!

const imageUploadInput = document.getElementById('image-upload-input');
const uploadStatus = document.getElementById('upload-status');
const productImageUrlInput = document.getElementById('product-image-url');

if (imageUploadInput) {
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        uploadStatus.textContent = 'Uploading image...';
        const formData = new FormData();
        formData.append('key', apiKey);
        formData.append('image', file);

        fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                uploadStatus.textContent = 'Upload successful!';
                productImageUrlInput.value = result.data.url;
            } else {
                throw new Error(result.error.message);
            }
        })
        .catch(error => {
            console.error('ImgBB Upload Error:', error);
            uploadStatus.textContent = `Upload failed: ${error.message}`;
        });
    });
}
// --- END: NEW IMAGE UPLOAD LOGIC ---

// --- Add Product Logic ---
const productForm = document.getElementById('product-form');
const submitProductBtn = document.getElementById('submit-product-btn');
const productSuccessMessage = document.getElementById('product-success-message');

if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitProductBtn.disabled = true;
        submitProductBtn.textContent = 'Adding Product...';

        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const imageUrl = productImageUrlInput.value;
        const stock = document.getElementById('stock-status').value;

        if (imageUrl.trim() === '' && imageUploadInput.files.length > 0) {
            alert('Please wait for the image to finish uploading.');
            submitProductBtn.disabled = false;
            submitProductBtn.textContent = 'Add Product';
            return;
        }

        try {
            await addDoc(collection(db, "products"), { name, price, imageUrl, stock, createdAt: serverTimestamp() });
            productSuccessMessage.classList.remove('hidden');
            productForm.reset();
            uploadStatus.textContent = '';
            setTimeout(() => { productSuccessMessage.classList.add('hidden'); }, 3000);
        } catch (error) {
            console.error("Error adding product: ", error);
            alert('Error adding product.');
        } finally {
            submitProductBtn.disabled = false;
            submitProductBtn.innerHTML = '<i class="fas fa-plus-circle mr-2"></i>Add Product';
        }
    });
}

// --- Add Review Logic (remains unchanged) ---
// ... (The rest of the review form script)