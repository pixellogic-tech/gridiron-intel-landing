document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('signup-form').addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    alert(`Thanks ${data.name}! Your deposit/selection has been recorded. We'll follow up via email.`);
    e.target.reset();
});

function bookNow(){
    alert("Book Now clicked! You can extend this to integrate payment processing for deposits.");
}
