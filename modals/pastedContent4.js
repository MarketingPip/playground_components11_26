 
import { Modal } from "https://esm.sh/flowbite";

/**
 * Calculates the file size and line count from a given content string.
 * 
 * @param {string} content - The content (text) for which the file size and line count are to be calculated.
 * @returns {void} Logs the formatted file size and the line count to the console.
 */
function getBlobInfo(content) {
  const blob = new Blob([content], { type: 'text/plain' });

  const fileSizeInBytes = blob.size;
  const fileSize = formatFileSize(fileSizeInBytes);  // Format the size as a readable string

  const lineCount = countLines(content);  // Count lines in the provided content string

 return {
      fileSize,
      lineCount
    }
}

/**
 * Formats a given file size in bytes to a human-readable format (B, KB, MB, GB).
 * 
 * @param {number} bytes - The size in bytes to be formatted.
 * @returns {string} The formatted file size string (e.g., '10 KB', '1.5 MB').
 */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1048576) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1073741824) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  } else {
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  }
}

/**
 * Counts the number of lines in a string by splitting it at newline characters.
 * 
 * @param {string} content - The content to be analyzed for line count.
 * @returns {number} The number of lines in the provided content.
 */
function countLines(content) {
  return content.split('\n').length;
}


function pastedContentModal(text ="hello") {
  // Create modal outer div
  const modal = document.createElement('div');
  modal.id = 'large-modal';
  modal.tabIndex = -1;
  modal.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'w-full', 'p-4', 'overflow-x-hidden', 'overflow-y-auto', 'md:inset-0', 'h-[calc(100%-1rem)]', 'max-h-full', 'fade-in');

  // Create modal inner container
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('relative', 'w-full', 'max-w-4xl', 'max-h-full');

  // Create modal content wrapper
  const modalContent = document.createElement('div');
  modalContent.classList.add('relative', 'bg-[#1A1A1A]', 'rounded-lg', 'shadow-lg');

  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('flex', 'items-center', 'justify-between', 'p-4', 'md:p-5', 'border-b', 'rounded-t', 'dark:border-gray-600');

  // Create header title
  const modalTitle = document.createElement('h3');
  modalTitle.classList.add('text-xl', 'font-medium', 'text-gray-900', 'dark:text-white');
  modalTitle.textContent = 'Pasted content';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.id = 'closeModal';
  closeButton.type = 'button';
  closeButton.classList.add('text-gray-400', 'bg-transparent', 'hover:bg-gray-200', 'hover:text-gray-900', 'rounded-lg', 'text-sm', 'w-8', 'h-8', 'ms-auto', 'inline-flex', 'justify-center', 'items-center', 'dark:hover:bg-gray-600', 'dark:hover:text-white');

  
  closeButton.innerHTML = `<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
            </svg>`
 //
  
  // Accessibility span for the close button
  const span = document.createElement('span');
  span.classList.add('sr-only');
  span.textContent = 'Close modal';

   
  closeButton.appendChild(span);

  // Append title and close button to the header
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  // Create modal body
  const modalBody = document.createElement('div');
  modalBody.classList.add('p-4', 'md:p-5', 'space-y-4');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('flex', 'flex-col', 'min-h-full');
 
 
// Dynamically create the textInfo content
const textInfo = document.createElement('p');
textInfo.classList.add('text-text-400', 'mb-2', 'text-sm');
//
// Create the inner flex container for the text elements
const flexContainer = document.createElement('span');
flexContainer.classList.add('text-text-500', 'mb-3', 'mt-0.5', 'flex', 'flex-wrap', 'gap-y-2', 'items-start', 'items-center', 'text-xs');

 const fileData = getBlobInfo(text) 
  
// Create the first span that contains file size and line count
const fileInfo = document.createElement('span');

// File size text  
const fileSize = document.createElement('span');
fileSize.textContent = fileData.fileSize

// Spacer (•) between file size and line count
const spacer1 = document.createElement('span');
spacer1.classList.add('opacity-50', 'mx-1');
spacer1.textContent = '•';

// Line count text (264 lines)
const lineCount = document.createElement('span');
lineCount.textContent = `${fileData.lineCount} lines`;

// Spacer (•) between line count and the next text
const spacer2 = document.createElement('span');
spacer2.classList.add('opacity-50', 'mx-1');
spacer2.textContent = '•';

// Append the elements to the fileInfo container
fileInfo.appendChild(fileSize);
fileInfo.appendChild(spacer1);
fileInfo.appendChild(lineCount);
fileInfo.appendChild(spacer2);

// Create the "Formatting may be inconsistent from source" text
const formattingText = document.createElement('span');
formattingText.textContent = 'Formatting may be inconsistent from source';

// Append everything to the flexContainer
flexContainer.appendChild(fileInfo);
flexContainer.appendChild(formattingText);

// Finally, append the flexContainer to the textInfo element
textInfo.appendChild(flexContainer);

  const codeBox = document.createElement('div');
  codeBox.classList.add('bg-bg-000', 'rounded-lg', 'border-0.5', 'border-border-300', 'shadow-sm', 'whitespace-pre-wrap', 'break-all', 'text-xs', 'p-4', 'font-mono');
  codeBox.textContent = text;

  contentWrapper.appendChild(textInfo);
  contentWrapper.appendChild(codeBox);

  modalBody.appendChild(contentWrapper);

  // Create modal footer
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('flex', 'flex-col', 'md:flex-row', 'justify-end', 'gap-4', 'mt-6', 'p-4', 'md:p-5', 'border-t', 'border-gray-200', 'rounded-b', 'dark:border-gray-600');

  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.id = 'closeButton';
  cancelButton.type = 'button';
  cancelButton.classList.add('w-full', 'md:w-auto', 'px-4', 'py-2', 'bg-gray-700', 'hover:bg-gray-600', 'rounded-lg', 'text-white');
  cancelButton.textContent = 'Cancel';

  // Create download button (initially hidden)
  const downloadButton = document.createElement('button');
  downloadButton.id = 'downloadFramesBtn';
  downloadButton.classList.add('w-full', 'md:w-auto', 'px-4', 'py-2', 'bg-green-600', 'hover:bg-green-500', 'rounded-lg', 'text-white', 'hidden');
  downloadButton.textContent = 'Download All Frames';

  modalFooter.appendChild(cancelButton);
  modalFooter.appendChild(downloadButton);

  // Append all parts to the modal container
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalContainer.appendChild(modalContent);

  // Append modal container to the modal
  modal.appendChild(modalContainer);

  // Append modal to the body of the page
  document.body.appendChild(modal);

  // Shared function to remove the modal and remove the event listener
function closeModal() {
  modalInstance.hide();
  closeButton.removeEventListener('click', closeModal); // Remove listener from closeButton
  cancelButton.removeEventListener('click', closeModal); // Remove listener from cancelButton
  modal.parentNode.removeChild(modal);
}

// Add event listeners to both buttons
closeButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);

  
  
    // Initialize Flowbite modal for this custom modal
  const modalInstance = new Modal(modal, {
    onShow: () => {
      //console.log(`${type} modal is now shown.`);
    },
    onHide: () => {
      // callback(false);
      //
       modalInstance.destroy()
    }
  });

  // Show the modal
  modalInstance.show();


  
}
export default pastedContentModal
