function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('load', async () => {
    const title = document.getElementById("title")

    function titleType(txt){
        title.textContent = title.textContent.replace("_","")
        title.textContent += txt+"_"
    }
    const split = "Wolfyxon Space".split("")
    title.textContent = ""

    for(var i=0;i<split.length;i++){
        titleType(split[i])
        await wait(10)
    }

    setInterval(function (){
        if(title.textContent.includes("_")){
            title.textContent = title.textContent.replace("_","")
        }
        else {
            title.textContent += "_"
        }
    },500)
})
