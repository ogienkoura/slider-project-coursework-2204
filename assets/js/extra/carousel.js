export default class Carousel {
  constructor(p) {
    const s = {
      ...{
        containerID: '#carousel',
        slideID: '.slide',
        interval: 5000,
        isPlaying: true,
      },
      ...p,
    };
    this.container = document.querySelector(s.containerID);
    this.slides = this.container.querySelectorAll(s.slideID);
    this.interval = s.interval;
    this.isPlaying = s.isPlaying;
  }

  _initProps() {
    this.currentSlide = 0;

    this.SLIDES_LENGTH = this.slides.length;
    this.CODE_LEFT_ARROW = 'ArrowLeft';
    this.CODE_RIGHT_ARROW = 'ArrowRight';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
  }

  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = `<span class="control control-pause" id="pause">
        <span id="fa-pause-icon">${this.FA_PAUSE}</span>
        <span id="fa-play-icon">${this.FA_PLAY}</span>
    </span>`;
    const PREV = `<span class="control control-prev" id="prev">${this.FA_PREV}</span>`;
    const NEXT = `<span class="control control-next" id="next">${this.FA_NEXT}</span>`;
    controls.innerHTML = PREV + PAUSE + NEXT;
    controls.setAttribute('class', 'controls');
    this.container.append(controls);

    this.pauseBtn = document.querySelector('#pause');
    this.prevBtn = document.querySelector('#prev');
    this.nextBtn = document.querySelector('#next');

    this.pauseIcon = this.container.querySelector('#fa-pause-icon');
    this.playIcon = this.container.querySelector('#fa-play-icon');

    this.isPlaying ? this._pauseVisible() : this._playVisible();
  }

  _pauseVisible(isVisible = true) {
    this.pauseIcon.style.opacity = isVisible ? 1 : 0;
    this.playIcon.style.opacity = !isVisible ? 1 : 0;
  }

  _playVisible() {
    this._pauseVisible(false);
  }

  _initIndicators() {
    const indicators = document.createElement('div');
    indicators.setAttribute('class', 'indicators');

    for (let i = 0, n = this.SLIDES_LENGTH; i < n; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute(
        'class',
        i !== 0 ? 'indicator' : 'indicator active'
      );
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }

    this.container.append(indicators);

    this.indicatorContainer = this.container.querySelector('.indicators');
    this.indicators = this.indicatorContainer.querySelectorAll('.indicator');
  }

  _initListeners() {
    document.addEventListener('keydown', this._pressKey.bind(this));
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.indicatorContainer.addEventListener(
      'click',
      this._indicate.bind(this)
    );
    this.container.addEventListener('mouseenter', this._pause.bind(this));
    this.container.addEventListener('mouseleave', this._play.bind(this));
  }

  _pressKey(e) {
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_SPACE) this.pausePlay();
  }

  _tick(flag = true) {
    if (!flag) return;
    this.timerId = setInterval(() => this._gotoNext(), this.interval);
  }

  _gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_LENGTH) % this.SLIDES_LENGTH;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  _pause() {
    clearInterval(this.timerId);
    this.isPlaying = false;
    this._playVisible();
  }

  _play() {
    this.isPlaying = true;
    this._pauseVisible();
    this._tick();
  }

  _indicate(e) {
    const target = e.target;
    if (target && target.classList.contains('indicator')) {
      this._gotoNth(+target.dataset.slideTo);
      this._pause();
    }
  }

  pausePlay() {
    this.isPlaying ? this._pause() : this._play();
  }

  prev() {
    this._gotoPrev();
    this._pause();
  }

  next() {
    this._gotoNext();
    this._pause();
  }

  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    this._tick(this.isPlaying);
  }
}
