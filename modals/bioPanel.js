export class BioPanel {
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
