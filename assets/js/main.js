import SwipeCarousel from "./extra/swipe-carousel.js";

const carousel = new SwipeCarousel({
  containerID: ".slider",
  slideID: ".slide",
  interval: 2000,
  isPlaying: true,
});
carousel.init();
