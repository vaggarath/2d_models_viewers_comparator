class CanvasBuilder{
    constructor( _divParent, _canvas, _model, _scale){
        this.parent = _divParent
        this.div = _canvas;
        this.models = _model
        this.img = _model[0].img;
        this.json = _model[0].json;
        this.scale = _scale ? _scale : window.innerWidth >= 1200 ? 0.75 : 0.5;
        this.context = null
        this.winWidth = window.innerWidth;
        this.patches = null;
        this.thumb = false;
        this.canvas = null;
        this.wrapper = document.getElementById('app-wrapper')
        this.image=null;
        this.objet=null;
    }

    buildCanvas(){
        // console.log(document.getElementById(this.parent).clientHeight)
        // document.getElementById(this.parent).style.height = document.getElementById(this.parent).clientHeight * this.scale
        
        const parent = document.getElementById(this.parent)
        // parent.style.width = "150px";
        let canvas = null

        if( document.getElementById(this.div)){
            canvas  = document.getElementById(this.div)
        }else{
            canvas = document.createElement('canvas')
            // canvas.style.width= 100*this.scale+"%"
            // canvas.style.height =100*this.scale+"vh"
            canvas.id = this.div
            parent.append(canvas)
        }

        const context = canvas.getContext("2d")
        this.context = context

        const img = new Image()
        img.src = this.img; //au chargement on recupere le premier index
        img.alt = "vue d'un crâne"

        img.onload = (e)=>{
            this.image=img;
            canvas.width = (img.width * this.scale)
            canvas.height = (img.height * this.scale)
            // parent.style.width = (img.width * this.scale)+"px"
            parent.style.height = (img.height * this.scale)+"px"
            // console.log(img.width * this.scale)
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            this.loadMetaData();

            document.getElementById(this.parent).onmousemove = (e)=>{
                // console.log(zoneName)
                let bb = canvas.getBoundingClientRect();
                // console.log(bb)
                if(this.patches){
                  handleMouseMove(e, bb);  
                }
            }          

            const hexToRgb=(hex)=>{
                let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            

            const handleMouseMove = (e, bb) => {
                // console.log(e);
                e.preventDefault();
                e.stopPropagation();
                // canva.handleMouseMove();
                zoneName = "null";

                document.getElementById('popup').style.display="none";
                document.getElementById('popup').innerText=""
                let offsetX = bb.left
                let offsetY = bb.top

                let mouseX=parseInt(e.clientX-offsetX);
			    let mouseY=parseInt(e.clientY-offsetY);
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
               
                for(let i = 0; i<this.patches.length; i++){
                    const c = hexToRgb(this.patches[i].color)
                    let polys = this.patches[i].polys

                    for(let j = 1; j<polys.length; j++){
                        this.drawPoly(polys[j])

                        if(context.isPointInPath(mouseX, mouseY)){
                            zoneName = this.patches[i].name
                            // console.log(zoneName)
                            canvas.style.cursor = "pointer"
                            // console.log("dans isPointInPath")
                            context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+",0.8)";
						    context.fill();
                            
                            const topy= mouseY > window.innerHeight/2 ? -300 : 225
                            const lefty = mouseX > window.innerWidth/2 ? -300 : 300
                            
                            document.getElementById('popup').style.bottom ="250px"
                            // document.getElementById('popup').style.left =mouseX+lefty+"px"
                            document.getElementById('popup').style.left = "0px"
                            document.getElementById('popup').style.display="block";

                            const boneName = document.createElement('h4')
                            boneName.classList.add('text-center')
                            boneName.innerText = this.patches[i].name

                            const boneShadow = document.createElement('canvas')
                            boneShadow.style.backgroundColor = "white"
                            // boneShadow.style.opacity=0
                            boneShadow.width = canvas.width*0.25
                            boneShadow.height = canvas.height*0.25
                            const boneContext = boneShadow.getContext("2d")
                            // console.log(polys[j])

                            boneContext.beginPath();

                            boneContext.moveTo(polys[j][0][0]*0.2, polys[j][0][1]*0.2)
                            // console.log(polys[j].length)

                            for(let a=1; a < polys[j].length; a++){
                                // console.log(polys[j])
                                boneContext.lineTo(polys[j][a][0]*0.2, polys[j][a][1]*0.2);
                                
                            }
                            
                            boneContext.fillStyle = "black";
				            boneContext.fill();
                            boneContext.closePath();
                            // boneContext.stroke();

                            const boneDescription = document.createElement('div')
                            boneDescription.classList.add('alert')
                            boneDescription.classList.add('alert-success')
                            boneDescription.innerText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quas explicabo quasi ex. Necessitatibus, delectus odio vel accusamus sequi cupiditate amet harum alias enim numquam dolor ea, ipsum commodi eveniet.Quos, enim exercitationem nemo recusandae optio a. Tenetur minima ratione, dolorum numquam excepturi possimus delectus quasi eaque, architecto saepe, doloribus perferendis repudiandae recusandae ipsam sint rem. Odio, recusandae neque! Facere!"


                            // document.getElementById('popup').append(boneShadow)
                            document.getElementById('popup').append(boneName)
                            document.getElementById('popup').append(boneDescription)
                            // document.getElementById('popup').innerText = this.patches[i].name
                            
                            for(let k = 1; k<polys.length; k++){
                                if(k != j){
                                    this.drawPoly(polys[k]);
                                    context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+",0.25)";
                                    context.fill();                                    
                                }
                            }
                            j = polys.length;
                        }else{
                            context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+",0.25)";
						    context.fill();                                                                     
                        }
                    }
                }

                
                // console.log(patches)
            }   

        }
        this.canvas = canvas;
        this.buildSwap()
        // this.objet = this
        // return canvas;
    }

    handleZoneName(zone){
        const hexToRgb=(hex)=>{
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        const context = this.context

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        for(let i = 0; i<this.patches.length; i++){
            // console.log(this.patches[i])
            const c = hexToRgb(this.patches[i].color)
            let polys = this.patches[i].polys
            // console.log(zone)

            for(let j = 1; j<polys.length; j++){
                this.drawPoly(polys[j])

                context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+",0.2)";
                context.fill();

                if(zone.toLowerCase() === this.patches[i].name.toLowerCase()){
                    console.log("yep")
                    canvas.style.cursor = "pointer"
                    context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+",0.8)";
                    context.fill();
 
                    
                    for(let k = 1; k<polys.length; k++){
                        if(k != j){
                            this.drawPoly(polys[k]);
                            context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+",0.8)";
                            context.fill();                                    
                        }
                    }
                    j = polys.length;
                }else{
                    console.log("nope")
                    context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+",0.2)";
                    context.fill();                                                            
                }
            }
        }
    }

    loadMetaData(){
        fetch(this.json)
        .then(res=>res.json())
        .then(data=>{
            const patches = data.patches;
            this.patches = data.patches;
            // console.log(patches)
            patches.map((patch, id)=>{
               const poly = patch.polys
               
               poly.map((pol, id)=>{
                   let cRgb = id>0 ? hexToRgb(patch.color) : ""
                   id > 0 ? this.drawPoly(pol, cRgb) : ""
               })
            })
        })

        const hexToRgb=(hex)=>{
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    }

    createPopUp = () =>{
        const popUp = document.createElement('div')
        popUp.id = "popup"

        return popUp;
    }
    
    drawPoly = (points, c) =>{
        // console.log(points)
        this.context.beginPath();
        this.context.moveTo(points[0][0]*this.scale, points[0][1]*this.scale)

        for(let i = 1; i< points.length; i++){
            this.context.lineTo(points[i][0]*this.scale, points[i][1]*this.scale)
            
        }
        if(c && c!= null){
            this.context.fillStyle = "rgba("+c.r+","+c.g+","+c.b+", 0.25)"
            this.context.fill();
        }
        this.context.closePath();
        this.context.stroke();
    }

    buildSwap(){
        if(!this.thumb){
            const wrapper = document.createElement('div')
            wrapper.classList.add('d-flex')
            // wrapper.classList.add('mt-3')
            wrapper.id = "wrapper"+this.parent
            this.models.map((th, id)=>{
                // console.log(th)
                const thumb = document.createElement('img')
                thumb.src = th.thum ? th.thum : th.img
                thumb.style.width = "120px"
                thumb.setAttribute('data-parent', this.parent)
                thumb.setAttribute('data-div', this.div)
                thumb.classList.add('thumbnail')
                thumb.onclick = (e) =>{
                    e.preventDefault();
                    e.stopPropagation();
                    this.parent = e.target.getAttribute('data-parent')
                    this.div = e.target.getAttribute('data-div')
                    // console.log(this.parent)
                    // this.canvas ? this.canvas.remove() : '' //if there is a canvas : remove it
                    
                    this.img = th.img
                    this.json = th.json
                    
                    this.buildCanvas();
                }
                wrapper.append(thumb)
            })

            const sizerWrapper = document.createElement('div')
            sizerWrapper.classList.add('d-flex')
            sizerWrapper.classList.add('flex-column')

            const magnify = document.createElement('i')
            magnify.classList.add('fas')
            magnify.id = "magnify"
            magnify.classList.add('fa-plus-square')
            magnify.classList.add('h4')
            magnify.style.cursor = "pointer"
            magnify.onclick = (e)=>{
                e.preventDefault()
                if(this.scale <= 0.5){
                   this.scale = this.scale + 0.1;
                    // this.canvas ? this.canvas.remove() : ""

                    this.buildCanvas() 
                }
                
            }

            const minimize = document.createElement('i')
            minimize.classList.add('fas')
            minimize.id = "magnify"
            minimize.classList.add('fa-minus-square')
            minimize.classList.add('h4')
            minimize.style.cursor = "pointer"
            minimize.onclick = (e)=> {
                if(this.scale >= 0.2){
                    this.scale = this.scale - 0.1;
                    //  this.canvas ? this.canvas.remove() : ""
 
                     this.buildCanvas() 
                 }
            }

            sizerWrapper.append(magnify)
            sizerWrapper.append(minimize)

            wrapper.appendChild(sizerWrapper)
            document.getElementById(this.parent).prepend(wrapper)
            
            this.thumb = true;
        }
        
    }

}