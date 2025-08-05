import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- START: CUSTOM CONFIRMATION MODAL LOGIC ---
const confirmModal = document.getElementById('custom-confirm-modal');
const confirmOverlay = document.getElementById('confirm-modal-overlay');
const confirmBox = document.getElementById('confirm-modal-box');
const confirmText = document.getElementById('confirm-modal-text');
const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const dontAskAgainCheckbox = document.getElementById('dont-ask-again');

let confirmCallback = null;

// Function to show the custom confirm modal
function showCustomConfirm(message, callback) {
    confirmText.textContent = message;
    confirmCallback = callback;
    confirmModal.classList.remove('hidden');
    setTimeout(() => {
        confirmOverlay.classList.remove('opacity-0');
        confirmOverlay.classList.add('opacity-50');
        confirmBox.classList.remove('scale-95');
        confirmBox.classList.add('scale-100');
    }, 10);
}

// Function to hide the modal
function hideCustomConfirm() {
    confirmOverlay.classList.remove('opacity-50');
    confirmOverlay.classList.add('opacity-0');
    confirmBox.classList.remove('scale-100');
    confirmBox.classList.add('scale-95');
    setTimeout(() => {
        confirmModal.classList.add('hidden');
        dontAskAgainCheckbox.checked = false; // Reset checkbox
    }, 300);
}

// Event listeners for modal buttons
confirmCancelBtn.addEventListener('click', () => {
    if (confirmCallback) confirmCallback(false);
    hideCustomConfirm();
});

confirmDeleteBtn.addEventListener('click', () => {
    if (dontAskAgainCheckbox.checked) {
        localStorage.setItem('skipDeleteConfirmation', 'true');
    }
    if (confirmCallback) confirmCallback(true);
    hideCustomConfirm();
});

confirmOverlay.addEventListener('click', hideCustomConfirm);
// --- END: CUSTOM CONFIRMATION MODAL LOGIC ---


// --- DISPLAY, UPDATE, DELETE PRODUCTS LOGIC (Updated to use custom confirm) ---
const productsTableBody = document.getElementById('products-table-body');
if (productsTableBody) {
    const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));

    onSnapshot(productsQuery, (snapshot) => {
        // ... (The code to render the table rows remains the same) ...
    });

    productsTableBody.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const productId = target.dataset.id;

        // Handle Stock Update (no change here)
        if (target.classList.contains('update-stock-btn')) {
            // ... (Stock update logic remains the same) ...
        }

        // Handle Delete (UPDATED to use custom confirm)
        if (target.classList.contains('delete-product-btn')) {
            const skipConfirmation = localStorage.getItem('skipDeleteConfirmation') === 'true';

            const deleteAction = async () => {
                const productDocRef = doc(db, "products", productId);
                try {
                    await deleteDoc(productDocRef);
                } catch (error) {
                    console.error("Error deleting product: ", error);
                }
            };
            
            if (skipConfirmation) {
                deleteAction(); // If user checked "don't ask", delete immediately
            } else {
                showCustomConfirm('Are you sure you want to delete this product? This action cannot be undone.', (isConfirmed) => {
                    if (isConfirmed) {
                        deleteAction();
                    }
                });
            }
        }
    });
}