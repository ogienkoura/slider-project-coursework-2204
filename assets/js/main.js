import SwipeCarousel from "./extra/swipe-carousel.js";

const carousel = new SwipeCarousel({
  containerID: ".mySlider",
  slideID: ".mySlide",
  interval: 2000,
  isPlaying: true,
});
carousel.init();
