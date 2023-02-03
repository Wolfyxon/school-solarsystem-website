window.addEventListener('load', () => {
    setTimeout(function (){ //timeout for weird people like me who click on the screen right after entering a website
        const overlay = document.getElementById("enter-canvas")
        overlay.onclick = function (){
            overlay.style.display = "none"
        }
    },1000)

})