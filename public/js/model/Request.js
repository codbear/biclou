(function(window, document) {
    class Request {

        constructor(url, userOptions = {}) {
            this.xhr = new XMLHttpRequest();
            this.url = url;
            this.options = Object.assign({}, {
                method: 'GET',
                async: true
            }, userOptions)
        }

        setUrl(url) {
            if (url) {
                this.url = url;
            }
        }

        setMethod(method) {
            method = method.toUpperCase();
            const authoMethods = ['GET', 'POST', 'PUT', 'DELETE'];
            if (authoMethods.contains(method)) {
                this.options.method = method;
            }
        }

        setParams(params) {
            for (let param in params) {
                if (this.url.indexOf('?') !== -1) {
                    this.url += '&';
                } else {
                    this.url += '?';
                }
                this.url += encodeURIComponent(param) + '=' + encodeURIComponent(params[param]);
            }
        }

        setPostDatas(postDatas, isJson = false) {
            if (!postDatas) {
                return
            }
            if (isJson) {
                this.xhr.setRequestHeader('Content-Type', 'application/json');
                this.postDatas = JSON.stringify(postDatas);
            } else {
                this.postDatas = new FormData(postDatas);
            }
        }

        execute(onSuccess, onError) {
            if (!this.url) {
                return;
            }
            this.xhr.open(this.options.method, this.url, this.options.async);
            this.xhr.onreadystatechange = function () {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status >= 400) {
                    return onError(this.status, this.statusText);
                }
                const parsedDatas = JSON.parse(this.responseText);
                onSuccess(parsedDatas);
            }
            if (this.options.method === 'POST') {
                this.xhr.send(this.postDatas);
            } else {
                this.xhr.send();
            }
        }
    }

    window.Request = Request;
})(window, document)
