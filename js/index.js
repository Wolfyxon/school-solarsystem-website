const facts = [
    "współczesne zwyczajne kalkulatory mają większą moc niż komputer pokładowy Apollo który zabrał ludzi na księżyc?",
    "na Marsie, Zachod słońca jest niebieski?",
    "na Ziemi jest więcej drzew niż gwiazd w naszej galaktyce?",
    "nasz Księżyc składa się z tych samych skał co Ziemia?",
    "światło ze Słońca potrzebuje 7 minut by dotrzeć do Ziemi?",
    "ludzie zajmują tylko 0.007% całej historii Ziemi?",
    "Jowisz jest większy niż niektóre gwiazdy?",
    "najprawdopodobniej ok. 4 miliardy lat temu, na Marsie istniały warunki do powstania życia?"
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