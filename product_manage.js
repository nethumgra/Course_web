import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Add Product and Add Review form logic can be placed here if you have them in your admin panel

// --- DISPLAY, UPDATE, DELETE PRODUCTS LOGIC (Table View) ---
const productsTableBody = document.getElementById('products-table-body');
if (productsTableBody) {

    const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));

    onSnapshot(productsQuery, (snapshot) => {
        if (snapshot.empty) {
            productsTableBody.innerHTML = '<tr><td colspan="4" class="py-4 px-4 text-center text-gray-500">No products found. Add one to get started.</td></tr>';
            return;
        }

        productsTableBody.innerHTML = ''; // Clear the container
        snapshot.forEach(doc => {
            const product = doc.data();
            const productId = doc.id;

            const isInStock = product.stock === 'in';

            // Create the HTML for one table row
            const productRowHTML = `
                <tr class="hover:bg-gray-50">
                    <td class="py-4 px-4">
                        <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" alt="${product.name}" class="w-16 h-16 object-cover rounded-md">
                    </td>
                    <td class="py-4 px-4">
                        <p class="font-bold text-gray-900">${product.name}</p>
                        <p class="text-sm text-gray-500">${product.price}</p>
                    </td>
                    <td class="py-4 px-4">
                        <button data-id="${productId}" data-stock="${product.stock}" class="update-stock-btn relative inline-flex items-center h-6 rounded-full w-11 ${isInStock ? 'bg-green-500' : 'bg-gray-300'}">
                            <span class="sr-only">Stock Status</span>
                            <span class="toggle-circle inline-block w-4 h-4 transform bg-white rounded-full ${isInStock ? 'translate-x-6' : 'translate-x-1'}"></span>
                        </button>
                    </td>
                    <td class="py-4 px-4">
                        <button data-id="${productId}" class="delete-product-btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            productsTableBody.innerHTML += productRowHTML;
        });
    });

    // Event Listener for Clicks (Update and Delete)
    productsTableBody.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const productId = target.dataset.id;

        // Handle Stock Update via Toggle Switch
        if (target.classList.contains('update-stock-btn')) {
            const currentStock = target.dataset.stock;
            const newStock = currentStock === 'in' ? 'out' : 'in';
            const productDocRef = doc(db, "products", productId);
            try {
                await updateDoc(productDocRef, { stock: newStock });
            } catch (error) {
                console.error("Error updating stock: ", error);
            }
        }

    });
}