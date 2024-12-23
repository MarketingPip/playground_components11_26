import { Modal } from "https://esm.sh/flowbite";
import ytTranscriptFetcher from "https://cdn.jsdelivr.net/gh/MarketingPip/playground_components11_26/utils/ytTranscriptFetcher.min.js";  

function createTranscriptModal(title = 'Extracted YouTube Transcript', transcriptUrl) {
  // Create modal outer div
  const modal = document.createElement('div');
  modal.id = 'yt-transcript-modal';
  modal.tabIndex = -1;
  modal.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'w-full', 'p-4', 'overflow-x-hidden', 'overflow-y-auto', 'md:inset-0', 'h-[calc(100%-1rem)]', 'max-h-full', 'fade-in', 'hidden');

  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('relative', 'w-full', 'max-w-4xl', 'max-h-full');

  // Create modal content wrapper
  const modalContent = document.createElement('div');
  modalContent.classList.add('relative', 'bg-[#1A1A1A]', 'rounded-lg', 'shadow-lg');
//
  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('flex', 'items-center', 'justify-between', 'p-4', 'md:p-5', 'border-b', 'rounded-t', 'dark:border-gray-600');

  // Create header title
  const modalTitle = document.createElement('h3');
  modalTitle.classList.add('text-xl', 'font-medium', 'text-gray-900', 'dark:text-white');
  modalTitle.textContent = title;

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('text-gray-400', 'bg-transparent', 'hover:bg-gray-200', 'hover:text-gray-900', 'rounded-lg', 'text-sm', 'w-8', 'h-8', 'inline-flex', 'justify-center', 'items-center', 'dark:hover:bg-gray-600', 'dark:hover:text-white');
  closeButton.innerHTML = `<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>`;

  // Append title and close button to the header
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  // Create modal body
  const modalBody = document.createElement('div');
  modalBody.classList.add('p-4', 'md:p-5');
  
  // Add a loading spinner element
  const loadingSpinner = document.createElement('div');
  loadingSpinner.classList.add('flex', 'justify-center', 'items-center', 'space-x-2');
  loadingSpinner.innerHTML = `<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div><span class="text-gray-400 text-sm">Fetching Transcript...</span>`;

  // Add a container for the transcript content
  const transcriptContainer = document.createElement('div');
  transcriptContainer.classList.add('hidden', 'mt-4', 'p-2', 'bg-gray-800', 'rounded-lg', 'border', 'border-gray-700', 'text-white', 'whitespace-pre-wrap');
  
  // Add error message element (hidden by default)
  const errorMessage = document.createElement('p');
  errorMessage.classList.add('text-red-500', 'text-xs', 'mt-1', 'hidden');
  errorMessage.textContent = 'Failed to fetch transcript. Please try again later.';
  
  // Append loading spinner, transcript container, and error message to the modal body
  modalBody.appendChild(loadingSpinner);
  modalBody.appendChild(transcriptContainer);
  modalBody.appendChild(errorMessage);

  // Create modal footer
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('flex', 'justify-end', 'gap-4', 'mt-4', 'p-4', 'border-t', 'border-gray-200', 'rounded-b', 'dark:border-gray-600');

  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.classList.add('px-4', 'py-2', 'bg-gray-700', 'hover:bg-gray-600', 'rounded-lg', 'text-white');
  cancelButton.textContent = 'Close';
 // Function to remove the modal when the cancel button is clicked
 

// Event listener for cancel button
cancelButton.addEventListener('click', closeModal);


  modalFooter.appendChild(cancelButton);

  // Append everything to modal content
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalContainer.appendChild(modalContent);

  // Append modal container to the modal
  modal.appendChild(modalContainer);

  // Append modal to the body of the page
  document.body.appendChild(modal);

  // Event listener for closing the modal
  // Function to close the modal
function closeModal() {
   
  modalEvents.hide();
  closeButton.removeEventListener('click', closeModal); // Remove the event listener after triggering
   cancelButton.removeEventListener('click', closeModal); // Remove the event listener after triggering
}

// Event listener for closing the modal
closeButton.addEventListener('click', closeModal);


  // Simulate fetching transcript
  fetchTranscript(transcriptUrl)

  // Function to simulate fetching the transcript
 async function fetchTranscript(url) {
    loadingSpinner.classList.add('hidden'); // Hide the loading spinner
    errorMessage.classList.add('hidden'); // Hide error message
    
 
   
   
 
     try {
        // Simulate fetched transcript data
        const transcript = await ytTranscriptFetcher(url)
        transcriptContainer.textContent = transcript;
        transcriptContainer.classList.remove('hidden'); // Show the transcript
      } catch(err) {
        errorMessage.innerText = err.message
        errorMessage.classList.remove('hidden'); // Show error message
      }
    
  }
  
  
  const modalEvents = new Modal(modal, {
  
    onHide: () => {
          modalEvents.destroy();
         modal.parentNode.removeChild(modal);
    },
    onShow: () => {
        console.log('modal is shown');
    },
    onToggle: () => {
        console.log('modal has been toggled');
    },
})

 
 
  return modalEvents
  
}

function Modal(url){
const modal = createTranscriptModal('YouTube Transcript', url); // Example call to create the modal

modal.show()
}
export default Modal
