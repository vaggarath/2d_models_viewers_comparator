let zoneName = 'null';
const models = [
    {
        img:'assets/img/Alligator_dorsal.png',
        json:'assets/json/ALLIGATOR_Dorsal_patches_metadata.json',
        thumb:'',
    },
    {
        img:'assets/img/Alligator_lateral.png',
        json:'assets/json/ALLIGATOR_Lateral_patches_metadata.json',
        thumb:'',
    },
    {
        img:'assets/img/Alligator_ventral.png',
        json:'assets/json/ALLIGATOR_Ventral_patches_metadata.json',
        thumb:'',
    }
]

const binoculars = document.getElementById('binoculars')
const reload = document.getElementById('reload')

// const canva = new CanvasBuilder("canvas", "model", ["assets/img/Alligator_dorsal.png"], ["assets/json/ALLIGATOR_Dorsal_patches_metadata.json"], 0.5)

/**
 * 1st param : Parent div's id
 * 2nd param : canvas' id
 * 3rd : An array of objects. Cf const models
 * 4th : The wanted scale (optionnal)
 */
const canva = new CanvasBuilder("canvas", "model", models, 0.5)
canva.buildCanvas()

let canva2;

binoculars.addEventListener('click', (e)=>{
    // create && add a comparative viewer
    canva2 = new CanvasBuilder("canvas2", "model2", models, 0.5)
    canva2.buildCanvas()
    binoculars.style.display='none'
    reload.style.display = "block"

    canva.canvas.onmousemove = (e) =>{
        canva2.handleZoneName(zoneName);
    }


    canva2.canvas.onmousemove = (e) =>{
        canva.handleZoneName(zoneName);
    }

    // canva2.canvas.onmouseleave = (e) =>{
    //     canva.buildCanvas()
    // }
    
})

reload.addEventListener('click', (e)=>{
    e.preventDefault()
    // document.getElementById(canva2.parent).style.display ="block"
    document.getElementById(canva2.div).remove()
    document.getElementById('wrappercanvas2').remove()
    e.target.style.display="none"
    binoculars.style.display="block"
})

document.getElementById('orientator').addEventListener('click', (e)=>{
    e.preventDefault()
    if(!document.getElementById('app-wrapper').classList.contains('flex-column')){
        document.getElementById('app-wrapper').classList.add('flex-column')
        
        document.getElementById('orientator').classList.remove('fa-level-down-alt')
        document.getElementById('orientator').classList.add('fa-exchange-alt')
    }else{
        document.getElementById('app-wrapper').classList.remove('flex-column')
        document.getElementById('orientator').classList.remove('fa-exchange-alt')
        document.getElementById('orientator').classList.add('fa-level-down-alt')
    }
})






