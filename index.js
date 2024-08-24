import bgSketch from './sketch.js'

document.addEventListener('DOMContentLoaded', () => {
  bgSketch.init(window.innerWidth, window.innerHeight);
  bgSketch.start();
});
