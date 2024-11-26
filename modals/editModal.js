export function createEditModal({ title = 'Edit Item', onSave, onCancel, fields = [], showModal = false }) {
  // Modal container
  const modal = document.createElement('div');
  modal.id = 'editModal';
  modal.classList.add('fixed', 'inset-0', 'overflow-y-auto', 'hidden');

  // Modal background overlay
  const container = document.createElement('div');
  container.classList.add('flex', 'items-end', 'justify-center', 'min-h-screen', 'pt-4', 'px-4', 'pb-20', 'text-center', 'sm:block', 'sm:p-0');

  const backgroundOverlay = document.createElement('div');
  backgroundOverlay.classList.add('fixed', 'inset-0', 'transition-opacity');
  
  const backgroundColor = document.createElement('div');
  backgroundColor.classList.add('absolute', 'inset-0', 'bg-gray-500', 'opacity-75');
  backgroundOverlay.appendChild(backgroundColor);

  const spacer = document.createElement('span');
  spacer.classList.add('hidden', 'sm:inline-block', 'sm:align-middle', 'sm:h-screen');
  spacer.innerHTML = '&#8203;'; // Zero-width space

  // Modal content box
  const modalContent = document.createElement('div');
  modalContent.classList.add(
    'inline-block', 'align-bottom', 'bg-white', 'rounded-lg', 'text-left', 'overflow-hidden', 
    'shadow-xl', 'transform', 'transition-all', 'sm:my-8', 'sm:align-middle', 'sm:max-w-lg', 'sm:w-full'
  );

  // Modal header with title and close button
  const header = document.createElement('div');
  header.classList.add('bg-gray-100', 'p-4');
  const titleElement = document.createElement('h2');
  titleElement.classList.add('text-lg', 'font-semibold', 'text-gray-900');
  titleElement.textContent = title;

  const closeButton = document.createElement('button');
  closeButton.classList.add('absolute', 'top-0', 'right-0', 'p-2', 'm-2');
  closeButton.setAttribute('aria-label', 'Close modal');
  closeButton.addEventListener('click', closeModal);

  const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeIcon.setAttribute('class', 'w-6 h-6');
  closeIcon.setAttribute('fill', 'none');
  closeIcon.setAttribute('stroke', 'currentColor');
  closeIcon.setAttribute('viewBox', '0 0 24 24');
  closeIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
  closeIcon.appendChild(path);
  closeButton.appendChild(closeIcon);

  header.appendChild(titleElement);
  header.appendChild(closeButton);

  // Modal form
  const formSection = document.createElement('div');
  formSection.classList.add('bg-white', 'px-4', 'pt-5', 'pb-4', 'sm:p-6', 'sm:pb-4');

  const form = document.createElement('form');
  form.id = 'editForm';
  
  fields.forEach(({ id, label, type, required,value }) => {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.classList.add('mb-4');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.classList.add('block', 'text-sm', 'font-medium', 'text-gray-600');
    labelElement.textContent = label;

    const input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    input.id = id;
    input.name = id;
    input.type = type;
    input.value = value;
    input.classList.add('mt-1', 'p-2', 'border', 'rounded-md', 'w-full');
    if (required) {
      input.setAttribute('required', true);
      input.setAttribute('pattern', '.*\\S+.*');
    }
    
    if (type === 'textarea') input.rows = 3;

    fieldWrapper.appendChild(labelElement);
    fieldWrapper.appendChild(input);
    form.appendChild(fieldWrapper);
  });

  // Buttons
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('mt-5', 'sm:mt-4', 'sm:flex', 'sm:flex-row-reverse');

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.classList.add(
    'w-full', 'inline-flex', 'justify-center', 'rounded-md', 'border', 'border-transparent', 
    'shadow-sm', 'px-4', 'py-2', 'bg-blue-500', 'text-base', 'font-medium', 'text-white', 
    'hover:bg-blue-600', 'focus:outline-none', 'focus:ring', 'focus:border-blue-300', 
    'sm:ml-3', 'sm:w-auto', 'sm:text-sm'
  );
  saveButton.textContent = 'Save';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.classList.add(
    'mt-3', 'w-full', 'inline-flex', 'justify-center', 'rounded-md', 'border', 'border-gray-300', 
    'shadow-sm', 'px-4', 'py-2', 'bg-white', 'text-base', 'font-medium', 'text-gray-700', 
    'hover:bg-gray-50', 'focus:outline-none', 'focus:ring', 'focus:border-blue-300', 
    'sm:mt-0', 'sm:w-auto', 'sm:text-sm'
  );
  cancelButton.textContent = 'Cancel';
  
  buttonWrapper.appendChild(saveButton);
  buttonWrapper.appendChild(cancelButton);

  formSection.appendChild(form);
  formSection.appendChild(buttonWrapper);

  // Assemble the modal content
  modalContent.appendChild(header);
  modalContent.appendChild(formSection);
  container.appendChild(backgroundOverlay);
  container.appendChild(spacer);
  container.appendChild(modalContent);
  modal.appendChild(container);

  document.body.appendChild(modal);

  // Event Listener Cleanup
  function removeAllEventListeners() {
    closeButton.removeEventListener('click', closeModal);
    cancelButton.removeEventListener('click', closeModal);
    modal.removeEventListener('click', onClickOutsideModal);
    saveButton.removeEventListener('click', onSaveCallback);
  }

  // Close Modal
  function closeModal() {
    modal.classList.add('hidden');
    removeAllEventListeners();
    
  }

  // Close if clicked outside of modal content
  function onClickOutsideModal(event) {
    if (!modalContent.contains(event.target)) {
      closeModal();
    }
  }
  
  // Handle Saves 
  function onSaveCallback(event) {
       event.preventDefault();
    if (onSave) onSave(new FormData(form));
  }
  

  // Add event listeners
  function initEvents(){
  closeButton.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  modal.addEventListener('click', onClickOutsideModal);

  // Handle Save Button Submit (calling the onSave callback)
  saveButton.addEventListener('click', onSaveCallback)
  }
  // Open modal if required
  if (showModal) {
    openModal();
  }

  // Open the modal
  function openModal() {
    initEvents()
    modal.classList.remove('hidden');
  }

  // Return modal API
  return {
    modal,
    open: openModal,
    close: closeModal,
    removeAllEventListeners,
  };
}
