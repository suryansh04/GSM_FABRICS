/** Hamburger Menu */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const body = document.body;

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
  body.classList.toggle("no-scroll"); // Toggle no-scroll class
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    body.classList.remove("no-scroll"); // Remove no-scroll class when menu is closed
  });
});

// Gulf countries capitals with their coordinates
const capitals = [
  { name: "Riyadh", coordinates: [46.7219, 24.6877], country: "Saudi Arabia" },
  { name: "Kuwait City", coordinates: [47.9783, 29.3759], country: "Kuwait" },
  { name: "Manama", coordinates: [50.586, 26.2285], country: "Bahrain" },
  { name: "Doha", coordinates: [51.531, 25.2867], country: "Qatar" },
  { name: "Abu Dhabi", coordinates: [54.3773, 24.4539], country: "UAE" },
  { name: "Muscat", coordinates: [58.4059, 23.588], country: "Oman" },
];

// Create vector source and layer for markers
const vectorSource = new ol.source.Vector();

// Add markers for each capital
capitals.forEach((capital) => {
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(capital.coordinates)),
    name: capital.name,
    country: capital.country,
  });

  vectorSource.addFeature(marker);
});

// Create the vector layer with custom style
const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8,
      fill: new ol.style.Fill({ color: "#3963af" }),
      stroke: new ol.style.Stroke({
        color: "#fff",
        width: 2,
      }),
    }),
  }),
});

// Create the map
const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    vectorLayer,
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([51.531, 25.2867]), // Centered on Qatar
    zoom: 5,
  }),
});

// Create popup overlay
const popup = document.createElement("div");
popup.className = "ol-popup";
const overlay = new ol.Overlay({
  element: popup,
  positioning: "bottom-center",
  stopEvent: false,
  offset: [0, -10],
});
map.addOverlay(overlay);

// Add click handler
map.on("click", function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    const coordinates = feature.getGeometry().getCoordinates();
    popup.innerHTML = `
      <h3 style="margin: 0; color: #3963af;">GSM FABRICS</h3>
      <p style="margin: 5px 0 0 0;">
        ${feature.get("name")}, ${feature.get("country")}
      </p>
    `;
    overlay.setPosition(coordinates);
  } else {
    overlay.setPosition(undefined);
  }
});

// Change cursor style when hovering markers
map.on("pointermove", function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? "pointer" : "";
});

// Handle window resize
window.addEventListener("resize", () => {
  map.updateSize();
});

const form = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");
const submitButton = form.querySelector(".submit-button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Show loading state
  submitButton.classList.add("loading");
  submitButton.textContent = "Sending...";

  try {
    const formData = new FormData(form);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      // Show success message
      successMessage.style.display = "block";

      // Reset form
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 5000);
    } else {
      throw new Error("Submission failed");
    }
  } catch (error) {
    alert("There was an error sending your message. Please try again.");
  } finally {
    // Reset button state
    submitButton.classList.remove("loading");
    submitButton.textContent = "Submit";
  }
});
