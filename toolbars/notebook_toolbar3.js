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

  const dropZoneTitle = document.querySelector('.drop-zone-loading > h1');
  const originalDropzoneVal = dropZoneTitle?.innerHTML || "Processing...";

  function setDropZoneLoading(show = true, errorMessage = '') {
    const dropZoneBg = document.querySelector('.drop-zone-bg');
    const dropZoneLoading = document.querySelector('.drop-zone-loading');

    if (!dropZoneLoading || !dropZoneBg || !dropZoneTitle) return;

    if (show) {
      dropZoneTitle.innerHTML = errorMessage
        ? `<span class="text-red-600 font-semibold">${errorMessage}</span>`
        : `Upgrading prompt!<br><span class="spinner"></span>`;
      dropZoneBg.classList.add('bg-opacity-50', 'bg-gray-200');
      dropZoneLoading.classList.remove('hidden');
    } else {
      dropZoneTitle.innerHTML = originalDropzoneVal;
      dropZoneLoading.classList.add('hidden');
    }
  }

  try {
    textArea.focus();
    setDropZoneLoading(true);

    if (actionHandlers[action] && !defaultActions[action]) {
      await actionHandlers[action](textArea, setDropZoneLoading);
    } else if (defaultActions[action]) {
      await actionHandlers[action](textArea, setDropZoneLoading);
      textArea.dispatchEvent(new Event('input'));
    } else {
      console.warn(`No handler found for action: ${action}`);
    }
  } catch (error) {
    console.error(`Error while handling toolbar action "${action}":`, error);
    setDropZoneLoading(true, '⚠️ Error upgrading prompt. Please try again.');
  } finally {
    // If an error occurred, keep the message visible briefly, then hide
    if (dropZoneTitle?.innerText.includes('Error upgrading')) {
      setTimeout(() => setDropZoneLoading(false), 3000);
    } else {
      setDropZoneLoading(false);
    }
  }
}
