function Carousel() {
  this.container = document.querySelector("#carousel");
  this.slides = this.container.querySelectorAll(".slide");

}

Carousel.prototype = {
  _initProps() {
    this.currentSlide = 0;
    this.isPlaying = true;
    this.interval = 2000;

    this.SLIDES_LENGTH = this.slides.length;
    this.CODE_LEFT_ARROW = "ArrowLeft";
    this.CODE_RIGHT_ARROW = "ArrowRight";
    this.CODE_SPACE = "Space";
    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT= '<i class="fas fa-angle-right"></i>';
  },

  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = `<span class="control control-pause" id="pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span class="control control-prev" id="prev">${this.FA_PREV}</span>`;
    const NEXT = `<span class="control control-next" id="next">${this.FA_NEXT}</span>`;
    controls.innerHTML = PAUSE + PREV + NEXT;
    controls.setAttribute('class','controls');
    this.container.append(controls);  

    this.pauseBtn = document.querySelector("#pause");
    this.prevBtn = document.querySelector("#prev");
    this.nextBtn = document.querySelector("#next");
  },

  _initIndicators(){
    const indicators = document.createElement('div');
    indicators.setAttribute('class', 'indicators')

    for (let i = 0, n = this.SLIDES_LENGTH; i < n; i++){
      const indicator = document.createElement('div');
      indicator.setAttribute('class', i !== 0 ? 'indicator' : 'indicator active');
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }

    this.container.append(indicators);

    this.indicatorContainer = this.container.querySelector(".indicators");
    this.indicators = this.indicatorContainer.querySelectorAll(".indicator");
    
  },

  _pressKey: function (e) {
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_SPACE) this.pausePlay();
  },

  _tick() {
    this.timerId = setInterval(() => this._gotoNext(), this.interval);
  },

  _gotoNth: function (n) {
    this.slides[this.currentSlide].classList.toggle("active");
    this.indicators[this.currentSlide].classList.toggle("active");
    this.currentSlide = (n + this.SLIDES_LENGTH) % this.SLIDES_LENGTH;
    this.slides[this.currentSlide].classList.toggle("active");
    this.indicators[this.currentSlide].classList.toggle("active");
  },

  _gotoPrev: function () {
    this._gotoNth(this.currentSlide - 1);
  },

  _gotoNext: function () {
    this._gotoNth(this.currentSlide + 1);
  },

  _pause: function () {
    clearInterval(this.timerId);
    this.isPlaying = false;
    this.pauseBtn.innerHTML = this.FA_PLAY;
  },

  _play: function () {
    this.isPlaying = true;
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this._tick();
  },

  _indicate: function (e) {
    const target = e.target;
    if (target && target.classList.contains("indicator")) {
      this._gotoNth(+target.dataset.slideTo);
      this._pause();
    }
  },

  _swipeStart: function (e) {
    this.swipeStartX = e.changedTouches[0].pageX;
  },

  _swipeEnd: function (e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    this.swipeStartX - this.swipeEndX < -100 && this.prev();
    this.swipeStartX - this.swipeEndX > 100 && this.next();
  },

  _initListeners: function () {
    this.pauseBtn.addEventListener("click", this.pausePlay.bind(this));
    this.prevBtn.addEventListener("click", this.prev.bind(this));
    this.nextBtn.addEventListener("click", this.next.bind(this));
    this.container.addEventListener("touchstart", this._swipeStart.bind(this));
    this.container.addEventListener("touchend", this._swipeEnd.bind(this));
    this.indicatorContainer.addEventListener(
      "click",
      this._indicate.bind(this)
    );
    document.addEventListener("keydown", this._pressKey.bind(this));
  },

  pausePlay: function () {
    this.isPlaying ? this._pause() : this._play();
  },

  prev: function () {
    this._gotoPrev();
    this._pause();
  },

  next: function () {
    this._gotoNext();
    this._pause();
  },

  init: function () {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    this._tick();
  },
};

Carousel.prototype.constructor = Carousel;

const carousel = new Carousel();
carousel.init();