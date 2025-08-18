document.addEventListener('DOMContentLoaded', () => {
    // ... (අනිත් variable ටික කලින් වගේම තියෙන්න ඕන)
    const addVideoForm = document.getElementById('add-video-form');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const formStatus = document.getElementById('form-status');
    const videosList = document.getElementById('videos-list');

    const videosCollection = firestore.collection('videos');

    // --- වීඩියෝ එකතු කිරීමේ Function එක (DEBUGGING එක්ක) ---
    addVideoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("1. Add Video button එක click කලා!");

        const fullUrl = youtubeUrlInput.value;
        console.log("2. ලබාගත් URL එක:", fullUrl);

        const youtubeIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = fullUrl.match(youtubeIdRegex);

        if (!match || !match[1]) {
            console.error("3. ERROR: වැරදි YouTube URL එකක්.");
            formStatus.textContent = 'වැරදි YouTube URL එකක්. කරුණාකර නැවත උත්සාහ කරන්න.';
            formStatus.className = 'text-center text-sm text-red-600 h-4';
            return;
        }

        const videoId = match[1];
        console.log("3. Video ID එක වෙන් කරගත්තා:", videoId);

        console.log("4. Firestore එකට data යවන්න උත්සාහ කරනවා...");

        videosCollection.add({
            videoId: videoId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log("5. SUCCESS: වීඩියෝව Firestore එකට සාර්ථකව එකතු කලා!");
            formStatus.textContent = 'වීඩියෝව සාර්ථකව එකතු කරන ලදී!';
            formStatus.className = 'text-center text-sm text-green-600 h-4';
            addVideoForm.reset();
        })
        .catch((error) => {
            console.error("5. FAILED: Firebase Error එකක් ආවා:", error);
            formStatus.textContent = 'වීඩියෝව එකතු කිරීමේදී දෝෂයක් ඇතිවිය. Console බලන්න.';
            formStatus.className = 'text-center text-sm text-red-600 h-4';
        });
        
        setTimeout(() => formStatus.textContent = '', 3000);
    });

    // --- සියලු වීඩියෝ පෙන්නුම් කිරීමේ Function එක (මේක වෙනස් කරන්න එපා) ---
    videosCollection.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        // ... (මේ කොටස කලින් තිබ්බ විදියටම තියන්න)
        videosList.innerHTML = '';
        if (snapshot.empty) {
            videosList.innerHTML = '<p class="text-gray-500">වීඩියෝ කිසිවක් නොමැත...</p>';
            return;
        }
        snapshot.forEach((doc) => {
            const docId = doc.id;
            const data = doc.data();
            const videoId = data.videoId;
            const videoElement = document.createElement('div');
            videoElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg border';
            videoElement.innerHTML = `
                <div class="flex items-center">
                    <img src="https://i.ytimg.com/vi/${videoId}/default.jpg" alt="video thumbnail" class="w-20 h-15 object-cover rounded mr-4">
                    <p class="font-medium text-gray-700">${videoId}</p>
                </div>
                <button data-id="${docId}" class="delete-btn text-gray-400 hover:text-red-500 transition-colors">
                    <i class="fas fa-trash-alt text-lg"></i>
                </button>
            `;
            videosList.appendChild(videoElement);
        });
    });
    
    // ... (delete function එකත් කලින් වගේම තියන්න)
    videosList.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const docId = deleteButton.dataset.id;
            if (confirm('මෙම වීඩියෝව ඉවත් කිරීමට ඔබට විශ්වාසද?')) {
                videosCollection.doc(docId).delete();
            }
        }
    });
});