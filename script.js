// basic interactions for signup and booking modal
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(signupForm);
      const payload = Object.fromEntries(fd.entries());
      console.log('Signup intent:', payload);
      alert('Thanks — we recorded your request. We will follow up by email to finalize deposit/payment and set up your account.');
      signupForm.reset();
    });
  }

  // modal form
  const modal = document.getElementById('bookModal');
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(modalForm);
      const payload = Object.fromEntries(fd.entries());
      // choose modalChoice
      const choice = document.querySelector('input[name="modalChoice"]:checked');
      payload.early = choice ? choice.value : '35';
      console.log('Modal reserve:', payload);
      alert('Reservation noted. We will contact you to collect deposit and finish setup.');
      closeBookModal();
      modalForm.reset();
    });
  }
});

// scrolling helper
function scrollToSignup(plan) {
  const el = document.getElementById('signup');
  if (el) {
    el.scrollIntoView({behavior:'smooth', block:'start'});
    const title = document.getElementById('signup-title');
    if (title) title.textContent = `Reserve — ${plan}`;
  }
}

// modal controls
function openBookModal(){
  const modal = document.getElementById('bookModal');
  if (modal) modal.setAttribute('aria-hidden', 'false');
}
function closeBookModal(){
  const modal = document.getElementById('bookModal');
  if (modal) modal.setAttribute('aria-hidden', 'true');
}
