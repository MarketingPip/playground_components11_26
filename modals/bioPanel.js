class BioPanel {
  constructor(config = {}) {
    this.config = {
      title: "Previous Output(s)",
      placeholderMessage: "You have no previous outputs.",
      onClose: () => {},
      onOpen: () => {},
      ...config,
    };

    this.panel = null;
    this.closeButton = null;
    this.panelContent = null;
    this.isOpen = false;

    // Initialize the component
    this.init();
  }

  init() {
    // Create the panel container
    this.panel = document.createElement('div');
    this.panel.id = 'bioPanel';
    this.panel.setAttribute('role', 'region');
    this.panel.setAttribute('aria-labelledby', 'toggleButton');
    this.panel.setAttribute('aria-live', 'polite');
    this.panel.classList.add('fixed', 'bottom-0', 'right-0', 'w-full', 'bg-white', 'h-full', 'overflow-y-auto', 'border-r', 'border-gray-200', 'shadow-lg', 'transition-transform', 'duration-300', 'transform', 'origin-right', 'translate-x-full');

    // Panel header with close button
    const header = document.createElement('div');
    header.classList.add('flex', 'justify-end');
    
    this.closeButton = document.createElement('button');
    this.closeButton.classList.add('close-output-slide', 'text-gray-500', 'hover:text-gray-700', 'm-2');
    this.closeButton.setAttribute('aria-label', 'Close replies panel');
    
    const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    closeIcon.setAttribute("class", "w-6 h-6");
    closeIcon.setAttribute("fill", "none");
    closeIcon.setAttribute("stroke", "currentColor");
    closeIcon.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("d", "M6 18L18 6M6 6l12 12");
    closeIcon.appendChild(path);
    this.closeButton.appendChild(closeIcon);
    
    // Add close button to header
    header.appendChild(this.closeButton);
    
    // Panel title
    const title = document.createElement('h1');
    title.classList.add('flex', 'items-center', 'justify-center', 'text-xl', 'font-semibold', 'prompt-font');
    title.textContent = this.config.title;

    // Panel content container
    this.panelContent = document.createElement('div');
    this.panelContent.classList.add('p-4');
  
    
    // Assemble the panel
    this.panel.appendChild(header);
    this.panel.appendChild(title);
    this.panel.appendChild(this.panelContent);
    
   

    // Bind events
    this.bindEvents();
   
    return
     // Append the panel to the body
    document.body.appendChild(this.panel);
  }

  bindEvents() {
    // Close button click handler
    this.closeButton._clickHandler = (event) => {
      event.stopPropagation();
      this.closePanel();
    };
    this.closeButton.addEventListener('click', this.closeButton._clickHandler);
  }

  openPanel() {
    this.isOpen = true;
    this.panel.classList.remove('translate-x-full');
    this.panel.classList.add('translate-x-0');
    this.config.onOpen();
  }

  closePanel() {
    this.isOpen = false;
    this.panel.classList.remove('translate-x-0');
    this.panel.classList.add('translate-x-full');
    this.config.onClose();
  }

  // Method to update the content dynamically
  updateContent(newContent) {
    this.panelContent.innerHTML = `
      <div class="flex items-center justify-center previous-outputs-msg">
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-lg text-gray-700">${newContent}</p>
        </div>
      </div>
    `;
  }

  // Method to append another component like CustomComponent into the panel
  appendComponent(component) {
    if (component && component instanceof HTMLElement) {
      this.panelContent.appendChild(component);
    }
  }

  // Cleanup method to remove the component and event listeners
  cleanup() {
    this.closeButton.removeEventListener('click', this.closeButton._clickHandler);
    this.panel.remove();
  }
}

// Create a CustomComponent that can be dynamically appended to BioPanel

class CustomComponent {
  constructor(options) {
    this.config = {
      items: [], // List of objects containing title and content
      onButton1Click: () => {},
      onButton2Click: () => {},
      ...options,
    };

    this.component = null;
    this.render();
  }

  render() {
    // Create a container for the custom component
    this.component = document.createElement('div');
    this.component.classList.add('space-y-4', 'flex', 'flex-col', 'items-center', 'justify-start');

    // Loop through the list of items and create a component for each
    this.config.items.forEach((item, index) => {
      item.index = index
      const itemComponent = this.createItemComponent(item, index);
      
      this.component.appendChild(itemComponent);
    });
  }

  createItemComponent(item, index) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('space-y-2', 'flex', 'flex-row', 'items-center', 'justify-between', 'rounded-lg', 'border', 'p-4', 'w-full');

    const header = document.createElement('div');
    header.classList.add('space-y-0.5');

    const titleLabel = document.createElement('label');
    titleLabel.classList.add('font-medium', 'text-base');
    titleLabel.textContent = item.title;

    const description = document.createElement('p');
    description.classList.add('text-sm', 'text-muted-foreground', 'max-h-32', 'line-clamp-3');
    description.textContent = item.content;

    header.appendChild(titleLabel);
    header.appendChild(description);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('space-x-3', 'flex');

       // Add a method to update button content
    description.updateContent = (newText, newIcon) => {
      description.textContent = newText;  // Update text
     // svg.innerHTML = newIcon;  // Update SVG icon
    };
    
    const button1 = this.createButton(() => this.config.onButton1Click(index, description.updateContent), 'button1');
    const button2 = this.createButton(() => this.config.onButton2Click(index, itemContainer, this.component), 'button2');

    buttonContainer.appendChild(button1);
    buttonContainer.appendChild(button2);

    itemContainer.appendChild(header);
    itemContainer.appendChild(buttonContainer);

    return itemContainer;
  }

  createButton(onClickHandler, buttonType) {
    const button = document.createElement('button');
    button.classList.add('items-center', 'justify-center', 'rounded-md', 'text-sm', 'font-medium', 'ring-offset-background', 'transition-colors', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:pointer-events-none', 'disabled:opacity-50', 'h-10', 'px-4', 'py-2', 'flex', 'gap-x-2', 'border', 'border-input', 'hover:bg-accent', 'hover:text-accent-foreground', 'shadow-none');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    
    if (buttonType === 'button1') {
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.innerHTML = '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path>';
    } else if (buttonType === 'button2') {
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('viewBox', '0 0 256 256');
      svg.innerHTML = '<path d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"></path>';
    }

    button.appendChild(svg);
    button.addEventListener('click', onClickHandler);

    
 

    
    return button;
  }

  handleDelete(index, itemContainer) {
    itemContainer.classList.add('fade-out');
    itemContainer.addEventListener('animationend', () => {
      itemContainer.remove();
    //  this.config.items.splice(index, 1);
    });
  }
}

function createNoMemoriesMessage() {
  // Create the outer div with classes "flex items-center justify-center previous-outputs-msg"
  const outerDiv = document.createElement('div');
  outerDiv.classList.add('flex', 'items-center', 'justify-center', 'previous-outputs-msg');

  // Create the inner div with classes "bg-gray-100 rounded-lg p-4"
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('bg-gray-100', 'rounded-lg', 'p-4');

  // Create the paragraph element with classes "text-lg text-gray-700"
  const paragraph = document.createElement('p');
  paragraph.classList.add('text-lg', 'text-gray-700');
  paragraph.textContent = 'No memories'; // Set the text content

  // Append the paragraph to the inner div
  innerDiv.appendChild(paragraph);

  // Append the inner div to the outer div
  outerDiv.appendChild(innerDiv);

  // Return the outer div element
  return outerDiv;
}



let bioItems =  []


function createEditModal({ title = 'Edit Item', onSave, onCancel, fields = [], showModal = false }) {
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




function BioModal(){
  


const bioPanel = new BioPanel({ title: 'My Output Panel', onClose:function(){
  
  bioPanel.cleanup()
  
} });

if(bioItems.length === 0){
bioPanel.appendComponent(createNoMemoriesMessage());
}
  
document.body.appendChild(bioPanel.panel);
bioPanel.openPanel();


const customComponent = new CustomComponent({
  items: bioItems,
    
  onButton1Click: (index, updateContent) => {
 
   
    
    //
   //  console.log(bioItems)//
    // Usage Example
const myModal = createEditModal({
  title: 'Edit Bio Memory',
  onSave: (formData) => {
 // Convert FormData to a JSON object
    const formJSON = {};
    formData.forEach((value, key) => {
      formJSON[key] = value;
    });

    updateContent(formJSON.memoryValue)
    
   // console.log(bioItems)
   
    
     
    const obj = bioItems.find(obj => obj.index === index);
if (obj) {
  obj.content = formJSON.memoryValue;
}

    
    
   
    
   // bioItems = customComponent.config.items 
    myModal.close()
  },
  onCancel: () => console.log('Cancelled'),
  fields: [
    { id: 'memoryValue', label: 'Memory', type: 'textarea', value:bioItems.find(obj => obj.index === index).content},//
  ],
  showModal: true,
});
    
    myModal.open()},
  onButton2Click: (index, container, component) => {
     customComponent.handleDelete(index, container)//

     
const objIndex = bioItems.findIndex(obj => obj.index === index);
if (objIndex !== -1) {
  bioItems.splice(objIndex, 1);
}//

    if(bioItems.length === 0){
      component.innerHTML = `
      <div class="flex items-center justify-center previous-outputs-msg">
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-lg text-gray-700">No memories</p>
        </div>
      </div>
    `
    }
      //
   // bioItems[index].splice(index, 1); //
  
  },
});

bioPanel.appendComponent(customComponent.component);
   bioPanel.openPanel();
}

// Open modal programmatically


export BioModal
