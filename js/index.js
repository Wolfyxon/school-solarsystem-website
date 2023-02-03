window.addEventListener('load', () => {
    setTimeout(function (){ //timeout for weird people like me who click on the screen right after entering a website
        const canvas = document.getElementById("solarsys-canvas")
        const overlay = document.getElementById("enter-canvas")
        overlay.onclick = function (){
            canvas.style.pointerEvents = "all"
            overlay.style.display = "none"
        }
    },1000)

})