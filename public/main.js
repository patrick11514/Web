//Load
$(function () {
    $('#loader').css('display', 'none');
    $('#content').css('display', '');
});

//Drag img prevent
$('img').on('dragstart', function (event) {
    event.preventDefault();
});

//Analytics
$(function () {
    var n = [],
        p = [];
    window.location.search
        .replace('?', '')
        .split('&')
        .forEach((u) => {
            if (u.includes('=')) {
                n.push(u.split('=')[0]);
                p.push(u.split('=')[1]);
            } else {
                n.push(u);
                p.push('');
            }
        });
    if (n.includes('pa')) {
        var uri = '?';
        n.forEach((k, i) => {
            if (k != 'pa') {
                if (p[i] == '') uri += k;
                else uri += k + '=' + p[i];
                if (n.length - 1 > i) {
                    uri += '&';
                }
            }
        });
        window.location.search = uri;
    }
    $('.cc-revoke').remove();
});

//Cookies
window.cookieconsent.initialise({
    palette: {
        popup: {
            background: '#237afc',
        },
        button: {
            background: 'transparent',
            text: '#fff',
            border: '#fff',
        },
    },
    type: 'opt-out',
    content: {
        message: 'Tento web používá cookies pro analýzu návštěvnosti webu.',
        allow: 'Přijmout',
        deny: 'Odmítnout',
        link: 'Přečíst si více',
    },
});

//Age
var _0x241c = [
    '2FwUlgI',
    'text',
    '4936YbpkZD',
    '3ITLJiw',
    'getHours',
    'getMinutes',
    'toFixed',
    'getFullYear',
    '1URvpps',
    'Age:\x20',
    '119853dnwwGS',
    'onload',
    '242527GkyYdc',
    '#age',
    '185495sVZMyc',
    'getMonth',
    'abs',
    '28927UiyIru',
    '12cQmkba',
    '10765DVIvqZ',
    '432931PwSbBd',
];
var _0xb527 = function (_0x45617f, _0x5178f5) {
    _0x45617f = _0x45617f - 0x1f1;
    var _0x241c82 = _0x241c[_0x45617f];
    return _0x241c82;
};
var _0x52badf = _0xb527;
(function (_0x5e94d2, _0x3ca0e6) {
    var _0x4365f3 = _0xb527;
    while (!![]) {
        try {
            var _0x3818f2 =
                -parseInt(_0x4365f3(0x1f4)) +
                -parseInt(_0x4365f3(0x1fe)) * parseInt(_0x4365f3(0x1f2)) +
                parseInt(_0x4365f3(0x1f8)) +
                parseInt(_0x4365f3(0x202)) * parseInt(_0x4365f3(0x1fb)) +
                -parseInt(_0x4365f3(0x1fd)) +
                -parseInt(_0x4365f3(0x1f6)) * -parseInt(_0x4365f3(0x1ff)) +
                parseInt(_0x4365f3(0x1fc)) * parseInt(_0x4365f3(0x201));
            if (_0x3818f2 === _0x3ca0e6) break;
            else _0x5e94d2['push'](_0x5e94d2['shift']());
        } catch (_0x1dac71) {
            _0x5e94d2['push'](_0x5e94d2['shift']());
        }
    }
})(_0x241c, 0x3dc55),
    (window[_0x52badf(0x1f5)] = setInterval(function () {
        var _0x453e3e = _0x52badf,
            _0x52847b = new Date(),
            _0x2b3da1 =
                ((((0x0 / 0x3c + 0x37) / 0x3c + 0x7) / 0x18 + 0x1) / 0x1e +
                    0x5) /
                    0xc +
                0x7d3,
            _0x486cf7 =
                (((((_0x52847b['getMilliseconds']() / 0x3e8 +
                    _0x52847b['getSeconds']()) /
                    0x3c +
                    _0x52847b[_0x453e3e(0x204)]()) /
                    0x3c +
                    _0x52847b[_0x453e3e(0x203)]()) /
                    0x18 +
                    _0x52847b['getDate']()) /
                    0x1e +
                    (_0x52847b[_0x453e3e(0x1f9)]() + 0x1)) /
                    0xc +
                _0x52847b[_0x453e3e(0x1f1)](),
            _0x1c0df7 = Math[_0x453e3e(0x1fa)](_0x486cf7 - _0x2b3da1);
        $(_0x453e3e(0x1f7))[_0x453e3e(0x200)](
            _0x453e3e(0x1f3) + _0x1c0df7[_0x453e3e(0x205)](0xc)
        );
    }, 0x1));
