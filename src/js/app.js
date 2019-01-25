import {fadeOut, forEach} from 'ditoy-js-utils';

/**
 * custom polyfills
 */

(function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


/**
 * action after onload event
 */
window.onload = function() {
    // equalize div heights
    checkResize();
};


/**
 * action after viewport was resized
 */
window.onresize = function() {
    resized = true;
};


/**
 * action before unload event (does not work on Safari)
 */
const ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('safari') === -1 || ua.indexOf('chrome') >= -1) {
    window.addEventListener('beforeunload', (e) => { fadeOut(document.querySelector('.wrapper')); });
}


/**
 * menu toggle
 */

const  menu = document.getElementById('collapsible'),
    toggler = document.getElementById('toggler')
;
if (toggler) {
    // toggle the navigation UI
    const toggleNavigation = function() {
        if (menu.classList.contains('collapsed')) {
            // open nav
            menu.classList.remove('collapsed');
            menu.setAttribute('aria-hidden', 'false');
            toggler.classList.add('expanded');
            toggler.setAttribute('aria-expanded', 'true');
        } else {
            // close nav
            menu.classList.add('collapsed');
            menu.setAttribute('aria-hidden', 'true');
            toggler.classList.remove('expanded');
            toggler.setAttribute('aria-expanded', 'false');
        }
    };
    toggler.addEventListener('click', function() {
        toggleNavigation();
    });
}


/**
 * equalize height of elements
 */

function equalize() {
    const equalizers = document.querySelectorAll('.equalize');
    const parents = new Set();
    for (const item of equalizers) {
        parents.add(item.parentNode);
    }

    for (const parent of parents) {
        const children = parent.querySelectorAll('.equalize');
        const tallest = Math.max.apply(Math, Array.from(children).map(function(elem) {
            elem.style.minHeight = '';
            return elem.offsetHeight;
        }));

        for (const child of children) {
            child.style.minHeight = (tallest + 1) + 'px';
        }
    }
}


/**
 * window resize event listener
 */

let resized = true,
    timeout = null
;
const checkResize = function() {
        if (resized) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(equalize);
            }
        }

        clearTimeout(timeout);
        timeout = setTimeout(checkResize, 50);
        resized = false;
    }
;

/**
 * youtube video url handling
 */

function youtube_parser (url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
}

function embed_youtube_videos() {
    let elements = document.querySelectorAll('[data-youtube]');
    forEach(elements, (element) => {
        let youtubeId = youtube_parser(element.dataset.youtube);
        let height = Math.round(element.offsetWidth / 16 * 9);
        let embed = '<iframe frameborder="0"  width="100%" height="' + height + '" ' +
            'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ' +
            'src="https://www.youtube.com/embed/' + encodeURI(youtubeId) + '?controls=0&rel=0" title="YouTube Video">' +
            '</iframe>'
        ;
        element.innerHTML = embed;
    });

}

function add_youtube_thumbnails() {
    let elements = document.querySelectorAll('[data-youtubethumb]');
    forEach(elements, (element) => {
        let youtubeId = youtube_parser(element.dataset.youtubethumb);
        let featuredImgSrc = "url('https://i1.ytimg.com/vi/" + encodeURI(youtubeId) + "/0.jpg')";
        element.style.backgroundImage = featuredImgSrc;
    });
}

// maxicard & single layouts
embed_youtube_videos();

// list & card layouts
add_youtube_thumbnails();

