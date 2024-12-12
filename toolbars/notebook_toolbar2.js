// A registry for action handlers
const actionHandlers = {};

// Define the default actions that cannot be removed
const defaultActions = {
  clear: (textArea, setDropZoneLoading) => {
    document.execCommand('selectAll');
    document.execCommand('delete');
  },
  selectAll: (textArea, setDropZoneLoading) => {
    textArea.select();
  },
  copy: (textArea, setDropZoneLoading) => {
    document.execCommand('copy');
  },
  cut: (textArea, setDropZoneLoading) => {
    document.execCommand('cut');
  },
  paste: (textArea, setDropZoneLoading) => {
    document.execCommand('paste');
  },
  undo: (textArea, setDropZoneLoading) => {
    document.execCommand('undo');
  },
  redo: (textArea, setDropZoneLoading) => {
    document.execCommand('redo');
  }
};

// Initialize the actionHandlers with default actions
Object.assign(actionHandlers, defaultActions);

// Function to register a new handler for custom actions
export function registerActionHandler(action, handler) {
  if (defaultActions[action]) {
    console.warn(`Default action "${action}" already exists and cannot be overwritten.`);
    return;
  }
  actionHandlers[action] = handler;
}

// The handleButtonClick function
export async function handleToolbarClick(action) {
  const textArea = document.querySelector('.prompt-input');
  if (!textArea) return;

  let dropZoneTitle = document.querySelector('.drop-zone-loading > h1');
  const dropzoneVal = dropZoneTitle.innerHTML;

  function setDropZoneLoading(show = true) {
    const dropZoneBg = document.querySelector('.drop-zone-bg'); // Background of drop zone
    const dropZoneLoading = document.querySelector(".drop-zone-loading");
    if (show) {
      dropZoneTitle.innerHTML = `Upgrading prompt!<br><span class="spinner"></span>`;
      dropZoneBg.classList.add('bg-opacity-50', 'bg-gray-200');
      dropZoneLoading.classList.remove('hidden');
    } else {
      dropZoneTitle.innerHTML = dropzoneVal;
      dropZoneLoading.classList.add('hidden');
    }
  }

  // Focus the text area to ensure commands work properly
  textArea.focus();

  // If the action exists in the registry, call it
  if (actionHandlers[action] && !defaultActions[action]) {
    await actionHandlers[action](textArea, setDropZoneLoading);
  } 

  if(defaultActions[action]){
    // Trigger input event after executing the command to notify any frameworks of changes
    await actionHandlers[action](textArea, setDropZoneLoading);
  textArea.dispatchEvent(new Event('input'));
  } 
  
 if (!actionHandlers[action] && !defaultActions[action]) {
   console.warn(`No handler found for action: ${action}`);
 }
  
  
}
