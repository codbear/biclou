(function(window, document) {
    class Slider {

        constructor(userContainer, shouldAutoScroll = false, autoScrollInterval = 0, userOptions = {}) {
            this.userContainer = userContainer;
            this.userOptions = Object.assign({}, {
                slidesToScroll: 1,
                slidesVisible: 1
            }, userOptions);
            this.isSmallScreen = false;
            this.currentSlide = 0;
            this.moveNext = this.moveNext.bind(this);
            this.movePrev = this.movePrev.bind(this);
            this.onWindowResize = this.onWindowResize.bind(this);
            this.shouldAutoScroll = shouldAutoScroll;
            this.autoScrollInterval = autoScrollInterval;
            this.pauseAutoScroll = this.pauseAutoScroll.bind(this);
            this.startAutoScroll = this.startAutoScroll.bind(this);
            this.createHtmlStructure();
            this.setStyle();
            this.createNavigation();
            this.onWindowResize();
            window.addEventListener('resize', this.onWindowResize);
            if (shouldAutoScroll) {
                if (this.autoScrollInterval <= 0) {
                    this.autoScrollInterval = 5000;
                }
                this.startAutoScroll();
            }
        }

        get slidesVisible() {
            return this.isSmallScreen ? 1 : this.userOptions.slidesVisible;
        }

        get slidesToScroll() {
            return this.isSmallScreen ? 1 : this.userOptions.slidesToScroll;
        }

        createHtmlStructure() {
            const userContainerChildren = [].slice.call(this.userContainer.children);
            this.root = document.createElement('div');
            this.root.classList.add('cdw-slider');
            this.root.setAttribute('tabindex', '0');
            this.container = document.createElement('div');
            this.container.classList.add('cdw-slider-container');
            this.root.appendChild(this.container);
            this.userContainer.appendChild(this.root);
            this.slides = userContainerChildren.map(child => {
                let slide = document.createElement('div');
                slide.classList.add('cdw-slide');
                slide.appendChild(child);
                this.container.appendChild(slide);
                return slide;
            })
        }

        setStyle() {
            let displayRatio = this.slides.length / this.slidesVisible;
            this.container.style.width = (displayRatio * 100) + '%';
            this.slides.forEach(slide => slide.style.width = ((100 / this.slidesVisible) / displayRatio) + '%');
        }

        createNavigation() {
            this.nextButton = document.createElement('i');
            this.nextButton.textContent = 'chevron_right';
            this.nextButton.classList.add('cdw-slider-nextBtn', 'material-icons', 'medium', 'blue', 'white-text', 'darken-1');
            this.root.appendChild(this.nextButton);
            this.prevButton = document.createElement('i');
            this.prevButton.textContent = 'chevron_left';
            this.prevButton.classList.add('cdw-slider-prevBtn', 'material-icons', 'medium', 'blue', 'white-text', 'darken-1');
            this.root.appendChild(this.prevButton);
            this.nextButton.addEventListener('click', this.moveNext);
            this.prevButton.addEventListener('click', this.movePrev);
            this.root.addEventListener('keyup', e => {
                if (e.key === 'ArrowRight' || e.key === 'Right') {
                    this.moveNext();
                } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                    this.movePrev();
                }
            })
            if (this.shouldAutoScroll) {
                this.pauseButton = document.createElement('i');
                this.pauseButton.textContent = 'pause_circle_outline';
                this.pauseButton.classList.add('cdw-slider-pauseBtn', 'material-icons', 'medium', 'blue', 'darken-1', 'white-text');
                this.playButton = document.createElement('i');
                this.playButton.textContent = 'play_circle_outline';
                this.playButton.classList.add('cdw-slider-playBtn', 'material-icons', 'medium', 'blue', 'darken-1', 'white-text');
                this.root.appendChild(this.pauseButton);
                this.root.appendChild(this.playButton);
                this.pauseButton.addEventListener('click', this.pauseAutoScroll);
                this.playButton.addEventListener('click', this.startAutoScroll);
            }
        }

        pauseAutoScroll() {
            clearInterval(this.autoScrollClock);
            this.autoScrollClock = undefined;
            this.playButton.style.removeProperty('display');
            this.pauseButton.style.display = 'none';
        }

        startAutoScroll() {
            if (this.autoScrollClock === undefined) {
                this.autoScrollClock = setInterval(this.moveNext, this.autoScrollInterval);
                this.playButton.style.display = 'none';
                this.pauseButton.style.removeProperty('display');
            }
        }

        moveNext() {
            this.gotoSlide(this.currentSlide + this.slidesToScroll);
            if (this.shouldAutoScroll) {
                this.pauseAutoScroll();
                this.startAutoScroll();
            }
        }

        movePrev() {
            this.gotoSlide(this.currentSlide - this.slidesToScroll);
            if (this.shouldAutoScroll) {
                this.pauseAutoScroll();
                this.startAutoScroll();
            }
        }

        gotoSlide(sliderIndex) {
            if (sliderIndex < 0) {
                sliderIndex = this.slides.length - this.slidesVisible;
            } else if (sliderIndex >= this.slides.length || (this.slides[this.currentSlide + this.slidesVisible] === undefined && sliderIndex > this.currentSlide)) {
                sliderIndex = 0;
            }
            let translateX = sliderIndex * -100 / this.slides.length;
            this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
            this.currentSlide = sliderIndex;
        }

        onWindowResize() {
            let isSmallScreen = window.innerWidth < 800;
            if (isSmallScreen !== this.isSmallScreen) {
                this.isSmallScreen = isSmallScreen;
                this.setStyle();
                if (this.isSmallScreen) {
                    this.pauseButton.classList.remove('medium');
                    this.playButton.classList.remove('medium');
                    this.nextButton.classList.remove('medium');
                    this.prevButton.classList.remove('medium');
                    this.pauseButton.classList.add('small');
                    this.playButton.classList.add('small');
                    this.nextButton.classList.add('small');
                    this.prevButton.classList.add('small');
                } else {
                    this.pauseButton.classList.remove('small');
                    this.playButton.classList.remove('small');
                    this.nextButton.classList.remove('small');
                    this.prevButton.classList.remove('small');
                    this.pauseButton.classList.add('medium');
                    this.playButton.classList.add('medium');
                    this.nextButton.classList.add('medium');
                    this.prevButton.classList.add('medium');
                }
            }
        }

        destruct() {
            window.removeEventListener('resize', this.onWindowResize);
            this.nextButton.removeEventListener('click', this.moveNext);
            this.prevButton.removeEventListener('click', this.movePrev);
            this.pauseButton.removeEventListener('click', this.pauseAutoScroll);
            this.playButton.removeEventListener('click', this.startAutoScroll);
        }
    }

    window.Slider = Slider;
})(window, document)
