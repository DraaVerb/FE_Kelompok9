// Mengisi isi Modal Bootstrap berdasarkan tombol Detail yang diklik.
const productModal = document.getElementById('productModal');

productModal.addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget;
  const name = button.getAttribute('data-name');
  const price = button.getAttribute('data-price');
  const description = button.getAttribute('data-description');

  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductPrice').textContent = price;
  document.getElementById('modalProductDescription').textContent = description;
});
