class FloatSticky {
    #events = []; // Обработчики
    #rootWidth = 0; // Последняя ширина главного элемента. Для ресайза
    #intersectionObserver = null; // Отслеживание попадание/уход из области экрана
    #visible = true; // Элемент находится в видимой области экрана
    #scrollElement = document.documentElement; // Элемент прокрутки
    #lastScrollTop = 0; // Для определения направления прокрутки

    /**
     * @param {Element} root 
     * @param {Object} options 
     */
    constructor(root, options = {}) {
        this.$root = root;
        this.options = Object.assign({
            classes: {
                inited: 'js-sticky-inited',
                wrap: 'sticky_wrap',
                container: 'sticky_container',
                freeze: 'sticky_freeze',
                top: 'sticky_top',
                bottom: 'sticky_bottom',
            }
        }, options);

        if (this.#init()) {
            this.#buildEvents();
        }
    }

    #init() {
        let items = [],
            max = 0;
        for (const wrap of this.$root.children) {
            let container = wrap.firstElementChild,
                height = container.offsetHeight;

            if (height === 0) continue; // Элемент скрыт

            items.push({
                wrap,
                container,
                height,
                errTop: 0,
                errBottom: 0,
            });
            if (height > max) max = height;
        }
        // Отсеиваем самый длинный
        items = items.filter(item => item.height < max);
        items.forEach(item => {
            item.wrap.classList.add(this.options.classes.wrap, this.options.classes.top, this.options.classes.bottom);
            item.container.classList.add(this.options.classes.container);
            item.position = 'top';

            let cs = getComputedStyle(item.container);
            item.errTop = +cs.top.replace('px', '');
            item.errBottom = +cs.bottom.replace('px', '');
            item.wrap.classList.remove(this.options.classes.bottom);
        });

        this.$root.classList.add(this.options.classes.inited);
        this.#rootWidth = this.$root.offsetWidth;
        this.#scrollElement = this.#getScrollParent(this.$root);
        this.#lastScrollTop = this.#scrollElement.scrollTop;

        // Отсеиваем элементы, которые полностью влезают в область прокрутки
        this.items = items.filter(item => item.height > this.#scrollElement.clientHeight);

        if (this.items.length < 1) return false;

        return true;
    }

    #getScrollParent(element) {
        return (element.scrollHeight > element.clientHeight) ? element : this.#getScrollParent(element.parentElement);
    }

    #destroy() {
        this.items.forEach(item => {
            item.wrap.classList.remove(this.options.classes.wrap, this.options.classes.top);
            item.container.classList.remove(this.options.classes.container);
        });
        this.$root.classList.remove(this.options.classes.inited);
    }

    #isOverTop(item) {
        if (this.#scrollElement.tagName === 'HTML') {
            return (this.#scrollElement.scrollTop + item.errTop) > (this.#scrollElement.scrollTop + item.container.getBoundingClientRect().top);
        }

        return this.#scrollElement.scrollTop + item.errTop > item.container.offsetTop;
    }

    #isOverBottom(item) {
        let scrollBottomBorder, containerBottomBorder;
        scrollBottomBorder = this.#scrollElement.scrollTop + this.#scrollElement.clientHeight;
        if (this.#scrollElement.tagName === 'HTML') {
            containerBottomBorder = this.#scrollElement.scrollTop + item.container.getBoundingClientRect().top + item.container.offsetHeight;
        } else {
            containerBottomBorder = item.container.offsetTop + item.container.offsetHeight;
        }
        return containerBottomBorder + item.errBottom > scrollBottomBorder;
    }

    #setFreeze(item) {
        if (item.position === 'freeze') return;
        item.container.style.marginTop = `${item.container.offsetTop}px`;
        item.wrap.classList.remove(this.options.classes.top, this.options.classes.bottom);
        item.wrap.classList.add(this.options.classes.freeze);
        item.position = 'freeze';

    }
    #setTop(item) {
        if (item.position === 'top') return;
        item.wrap.classList.remove(this.options.classes.freeze, this.options.classes.bottom);
        item.wrap.classList.add(this.options.classes.top);
        item.container.style.marginTop = ``;
        item.position = 'top';
    }
    #setBottom(item) {
        if (item.position === 'bottom') return;
        item.wrap.classList.remove(this.options.classes.freeze, this.options.classes.top);
        item.wrap.classList.add(this.options.classes.bottom);
        item.container.style.marginTop = ``;
        item.position = 'bottom';
    }

    #handlerResize() {
        if (this.#rootWidth !== this.$root.offsetWidth) {
            this.refresh();
        }
    }

    #handlerScroll() {
        if (this.#visible) {
            for (const item of this.items) {
                if (this.#lastScrollTop > this.#scrollElement.scrollTop) {
                    //top
                    if (this.#isOverTop(item)) {
                        this.#setFreeze(item);
                    } else {
                        this.#setTop(item);
                    }
                } else {
                    //down
                    if (this.#isOverBottom(item)) {
                        this.#setFreeze(item);
                    } else {
                        this.#setBottom(item);
                    }
                }
            }
            this.#lastScrollTop = this.#scrollElement.scrollTop;
        }
    }

    #buildEvents() {
        let d = (this.#scrollElement.tagName == 'HTML') ? document : this.#scrollElement;
        this.#events = [
            [window, 'resize', this.#handlerResize.bind(this)],
            [d, 'scroll', this.#handlerScroll.bind(this)],
        ];
        for (const e of this.#events) {
            e[0].addEventListener(...e.slice(1));
        }

        this.#intersectionObserver = new IntersectionObserver((entries) => this.#visible = entries[0].isIntersecting);
        this.#intersectionObserver.observe(this.$root);
    }

    destroy() {
        this.#destroy();
        for (const e of this.#events) {
            e[0].removeEventListener(...e.slice(1));
        }
        this.#intersectionObserver.disconnect();
    }

    refresh() {
        this.#destroy();
        this.#init();
    }
}
