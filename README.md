# FloatSticky
Пример в файле example.html

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dwenge/FloatSticky/style.css">
<link rel='stylesheet'
    href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap-reboot.min.css' />
<link rel='stylesheet'
    href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap-grid.min.css' />

<style>
    .full-screen {
        min-height: 100vh;
    }

    .content-box {
        --c: red;
        background: var(--c) url(l.png);
        background-size: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 18px;
    }

    .content-box:before,
    .content-box:after {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 30px;
        background-color: var(--c);
    }

    .content-box:before {
        content: "TOP";
    }

    .content-box:after {
        content: "BOTTOM";
    }

    ._t1 {
        --c: red;
        height: 130vh;
        margin-top: -100px;
        margin-bottom: -100px;
    }

    ._t2 {
        --c: green;
        height: 250vh;
    }

    ._t3 {
        --c: yellow;
        height: 150vh;
    }

    ._t4 {
        --c: pink;
        height: 50vh;
    }

    .sticky_bottom ._t1 {
        bottom: 50px;
    }

    .sticky_top ._t1,
    .sticky_top ._t3 {
        top: 50px;
    }

</style>

<br><br><br><br>
<div class="container">
    <div class="row full-screen" id="example">
        <div class="col-12 col-sm-3">
            <div class="content-box _t1">margin -100px</div>
        </div>
        <div class="col-12 col-sm-3">
            <div class="content-box _t2"></div>
        </div>
        <div class="col-12 col-sm-3">
            <div class="content-box _t3"></div>
        </div>
        <div class="col-12 col-sm-3">
            <div class="content-box _t4"></div>
        </div>
    </div>
</div>
<br><br><br><br>

<script src="https://cdn.jsdelivr.net/gh/dwenge/FloatSticky/script.js"></script>
<script>
    new FloatSticky(document.getElementById('example'));
</script>
```