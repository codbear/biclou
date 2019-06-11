(function(window) {

    class SignaturePad {

        constructor(container, width, height, onValidation, lineWidth = '1.5') {
            this.canvas = container.querySelector('.sp-canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.resetButton = container.querySelector('.sp-reset-btn');
            this.validationButton = container.querySelector('.sp-validation-btn');
            this.errorText = container.querySelector('.sp-error-txt');
            this.ctx = this.canvas.getContext('2d');
            this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.initListeners();
        }

        setLineWidth(lineWidth) {
            if (lineWidth) {
                this.ctx.lineWidth = lineWidth;
            }
        }

        draw(event) {
            this.ctx.lineTo(event.layerX, event.layerY);
            this.ctx.stroke();
        }

        clearPad() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
        }

        isEmpty() {
            const pixelsMatrix = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
            const isPixelNull = function(pixelValue) {
                return pixelValue === 0;
            }
            return pixelsMatrix.every(isPixelNull);
        }

        displayErrorText() {
            this.errorText.style.visibility = 'visible';
            this.canvas.style.borderColor = 'red';
        }

        hideErrorText() {
            this.canvas.style.borderColor = 'black';
            this.errorText.style.visibility = 'hidden';
        }

        initListeners() {
            const drawBound = this.draw.bind(this);
            this.canvas.addEventListener('mousedown', (e) => {
                this.hideErrorText();
                this.ctx.moveTo(e.layerX, e.layerY);
                this.canvas.addEventListener('mousemove', drawBound);
            });
            window.addEventListener('mouseup', () => {
                this.canvas.removeEventListener('mousemove', drawBound);
            })
            this.resetButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearPad();
            })
        }

        onValidation(callback) {
            this.validationButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isEmpty()) {
                    this.displayErrorText();
                    return;
                }
                callback(e);
            })
        }
    }

    window.SignaturePad = SignaturePad;
})(window)
