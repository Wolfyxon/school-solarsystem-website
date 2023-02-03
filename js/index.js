const facts = [
    "współczesne biurowe kalkulatory mają większą moc niż komputer Apollo który zabrał ludzi na księżyc?",
    "na Marsie, zachod słońca jest niebieski?",
    "na Ziemi jest więcej drzew niż gwiazd w naszej galaktyce?",
    "nasz Księżyc jest z tych samych skał co Ziemskie?"
]

window.addEventListener('load', () => {
    const f = facts[Math.floor(Math.random() * facts.length)]
    document.getElementById("didyouknow-text").textContent = f
    console.log(f)

    setTimeout(function (){ //timeout for weird people like me who click on the screen right after entering a website
        const canvas = document.getElementById("solarsys-canvas")
        const overlay = document.getElementById("enter-canvas")
        overlay.onclick = function (){
            canvas.style.pointerEvents = "all"
            overlay.style.display = "none"
        }
    },1000)
})