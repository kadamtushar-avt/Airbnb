// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// Wait for page to load
document.addEventListener("DOMContentLoaded", () => {

    const mapDiv = document.getElementById("map");

    if (mapDiv) {
        const lat = parseFloat(mapDiv.dataset.lat);
        const lng = parseFloat(mapDiv.dataset.lng);
        const title = mapDiv.dataset.title;

        console.log("Coordinates:", lat, lng);

        // safety check
        if (isNaN(lat) || isNaN(lng)) {
            console.log("Invalid coordinates");
            return;
        }

        // create map
        const map = L.map('map').setView([lat, lng], 13);

        // tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // marker
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${title}</b>`)
            .openPopup();
    }

});