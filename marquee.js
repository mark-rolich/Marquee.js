/**
* Provides functionality similar to <marquee> HTML tag.
*
* Supports:
* - continuous and scroll behaviors
* - ininite or limited loops
* - left-to-right and right-to-left directions
*
* @author Mark Rolich <mark.rolich@gmail.com>
*/
var Marquee = function (element, settings) {
    "use strict";
    var elem            = document.getElementById(element),
        options         = (settings === undefined) ? {} : settings,
        behavior        = options.behavior  || 'continuous',
        ms              = options.ms        || 1,
        step            = options.step      || 1,
        direction       = options.direction || 'ltr',
        loops           = options.loops     || -1,
        interrupt       = options.interrupt || 'yes',
        process         = null,
        start           = 0,
        milestone       = 0,
        scroller        = null,
        sWidth          = null,
        self            = this,
        ltrCond         = 0,
        loopCnt         = 0,
        construct       = function (elem) {
            var scrollerContent = elem.innerHTML,
                scrollerNode = elem.childNodes[1] || elem;

            sWidth = scrollerNode.offsetWidth;

            scroller = '<div>' + scrollerContent + '</div>';
            elem.innerHTML = scroller;
            scroller = elem.getElementsByTagName('div')[0];

            scroller.style.position = 'relative';

            if (behavior === 'continuous') {
                scroller.innerHTML += scrollerContent;
                scroller.style.width = '200%';

                if (direction === 'ltr') {
                    start = -sWidth;
                }
            } else {
                ltrCond = elem.offsetWidth;

                if (direction === 'rtl') {
                    milestone = ltrCond;
                }
            }

            if (direction === 'ltr') {
                milestone = -sWidth;
            } else if (direction === 'rtl') {
                step = -step;
            }

            self.start();

            return scroller;
        };

    this.start = function () {
        process = window.setInterval(function () {
            scroller.style.left = start + 'px';
            start = start + step;

            if (start > ltrCond || start < -sWidth) {
                start = milestone;
                loopCnt++;

                if (loops !== -1 && loopCnt >= loops) {
                    scroller.style.left = 0;
                    self.pause();
                }
            }

        }, ms);
    };

    this.pause = function () {
        if (process !== null) {
            window.clearInterval(process);
        }
    };

    if (interrupt === 'yes') {
        elem.onmouseover = function () {
            self.pause();
        };

        elem.onmouseout = function () {
            if (loops === -1 || loopCnt < loops) {
                self.start();
            }
        };
    }

    scroller = construct(elem);
};