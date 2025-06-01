document.addEventListener('DOMContentLoaded', function () {
  const timestampField = document.getElementById('timestamp');
  const now = new Date();
  timestampField.value = now.toISOString();
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';

  const modalContent = modal.querySelector('.modal-content');
  modalContent.focus();

  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';

  document.body.style.overflow = 'auto';
}

window.addEventListener('click', function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
});

function handleCloseKeydown(event, modalId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    closeModal(modalId);
  }
}