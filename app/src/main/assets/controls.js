$(function(){
    $('.header-tab li').click(function() {
        $('.header-tab li').removeClass("active");
        $(this).addClass("active");
        var pannel = $(this).data('tab');
        $('.panels > div').removeClass('active')
        $('#'+ pannel).addClass('active');
    });
});
clearAll();

var isSupportTouch = "ontouchend" in document ? true: false;

function postKeyCode(keyCode) {
    $.post("/key", {
        code: keyCode
    },
    function(data) {
        console.log(data)
    })
}

function sendKeyCode(keyCode) {
    $.get("/key?keycode=" + keyCode, {
        code: keyCode
    },
    function(data) {
        console.log(data)
    })
}


function deleteOneChar() {
    var text = $("#inputarea").val().toString()
    if ( text.length > 0 ) {
        var newText = text.substring(0, text.length - 1)
        $("#inputarea").val(newText)
    }
}

function clearAll() {
    $("#inputarea").val('')
}

// delete one char
$("#btnDel").on("click",
function() {
    sendKeyCode($(this).attr("data-key"))
    deleteOneChar()
}),
// clear all
$("#btnCls").on("click",
function() {
    sendKeyCode($(this).attr("data-key"))
    clearAll()
}),
$(".direction").on(isSupportTouch ? "touchstart": "mousedown",
function() {
    var o = $(this);
    $("#direction-btns").css({
        "background-position": o.attr("data-bp")
    }),
    sendKeyCode(o.attr("data-key"))
}),
$(".otherbtn").on(isSupportTouch ? "touchstart": "mousedown",
function() {
    var o = $(this);
    o.css({
        "background-position": o.attr("data-bp")
    }),
    sendKeyCode(o.attr("data-key"))
}),
$(".direction,.otherbtn").on(isSupportTouch ? "touchend touchmove": "mouseup mousemove",
function() {
    $("#direction-btns,.direction,.otherbtn").css({
        "background-position": ""
    })
});

function sendText(text) {
    "" != text, $.get("/text?text=" + text, {
            text: text
        },
        function (data) {
            console.log(data)
        });
}

// 中英文输入法切换
let _mode = document.getElementById('mode');
_mode.addEventListener("click",
function() {
    if (_mode.getAttribute('isChineseInput') === 'true') {
        _mode.setAttribute('isChineseInput', 'false');
        _mode.innerText = '英';
    } else {
        _mode.setAttribute('isChineseInput', 'true');
        _mode.innerText = '中';
    }
})

let _inputArea = document.getElementById('inputarea');
_inputArea.addEventListener('compositionend', () => {
    if (_mode.getAttribute('isChineseInput') === 'true') {
        var text = $("#inputarea").val();
        console.log('input : ' + text)
        sendText(text);
        _inputArea.value = "";
    }
});

_inputArea.addEventListener('keyup', (event) => {
    // console.log($("#inputarea").val() + "," + event.code+ "," +event.key+ "," +event.keyCode+ "," +event.type)
    const key = event.key;
    if (_mode.getAttribute('isChineseInput') === 'true') {
        if (key === "Backspace" || key === "Delete") {
            sendKeyCode(67)
        }
    } else {
        if (key === "Backspace" || key === "Delete") {
            sendKeyCode(67)
        } else {
            console.log('input : ' + key)
            sendText(key);
            _inputArea.value = "";
        }
    }
});