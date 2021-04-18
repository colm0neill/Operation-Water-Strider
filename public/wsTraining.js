const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

const checked = document.querySelectorAll('#mandUnderstood');




openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.trainingModal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  let values = [];

  console.log(checked.length);
  for (var i = 0; i < checked.length; i++) {
    if (checked[i].checked) {
      values.push(i);
    }
  }
  if (values.length == checked.length) {
    console.log('values are:'+values.length);
    console.log('cheched are '+checked.length);

    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
  }
  else {
    let toastAlert = document.getElementById('liveToast');
    toastAlert.classList.remove('hide');
    toastAlert.classList.add('show');
    setTimeout(function(){
      toastAlert.classList.remove('show');
      toastAlert.classList.add('hide');
    },5000)
  }

}

function removeToast(){
  let toastAlert = document.getElementById('liveToast');
    toastAlert.classList.remove('show');
    toastAlert.classList.add('hide');
}