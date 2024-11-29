export async function showNotification(type = 'info', title = '', message = '') {
  const container = document.getElementById('notification-container');
  if (!container) {
    console.error('Notification container not found!');
    return;
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `bg-${type}-100 border-l-4 border-${type}-500 text-${type}-700 p-4 rounded-lg shadow-md opacity-100`;
  notification.setAttribute('role', 'alert');

  // Create title element
  const titleElement = document.createElement('p');
  titleElement.className = 'font-bold text-lg';
  titleElement.innerText = title;

  // Create message element
  const messageElement = document.createElement('p');
  messageElement.innerText = message;

  // Append title and message to notification
  notification.appendChild(titleElement);
  notification.appendChild(messageElement);

  // Append notification to the container
  const fragment = document.createDocumentFragment();
  fragment.appendChild(notification);
  container.appendChild(fragment);

  // Function to handle animation end
  const handleAnimationEnd = () => {
    container.removeChild(notification);
    notification.removeEventListener('animation', handleAnimationEnd); // Remove event listener after it fires
  };

  // Add a listener for the animationend event
  notification.addEventListener('animation', handleAnimationEnd);
}
