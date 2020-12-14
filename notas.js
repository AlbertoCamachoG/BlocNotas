/*============
    MODELO
============*/
var notaArray=[];
var tiempo=0;
var numeroNotas=localStorage.length;
var notas;
document.getElementById("anadir").addEventListener("click",function(){añadirNota("Titulo"),"Contenido"});
mostrarNotas();
function añadirNota(nombre,contenido){
    /*let a=new Date;
    let fecha=a.toLocaleDateString();
    fecha=" "+fecha+" | "+a.getHours()+"h - "+a.getMinutes()+"M - "+a.getSeconds()+"S ";*/
    notas={
        "NombreNota":nombre,
        "Contenido":contenido,
        "num":numeroNotas,
        "date":0,
        "x":100,
        "y":100,
        "height":"",
        "width":""

    }
    localStorage.setItem("N"+numeroNotas,JSON.stringify(notas));
    notas=JSON.parse(localStorage.getItem("N"+numeroNotas));
    crearDiv(notas,numeroNotas);
    numeroNotas++;
    
}

function limpiar(){
    for(var i=0;i<localStorage.length;i++){
        let aux=localStorage.getItem(localStorage.key(i));
        if(aux!=null){notaArray.push(aux)}
    }
    localStorage.clear();
    for(var i=0;i<notaArray.length;i++){
        localStorage.setItem("N"+i,notaArray[i]);
    }
    numeroNotas=localStorage.length;
}

/*============
    VISTA
============*/
function crearDiv(json,num){
    //control variables
    if(json.NombreNota==null)json.NombreNota="Vacio";
    if(json.Contenido==null)json.Contenido="Inserta Texto";
    if(json.NombreNota)json.NombreNota=json.NombreNota.toUpperCase();

    //crear nota amarilla
    var div = document.createElement("div");
    var titulo=document.createTextNode(json.NombreNota+"\n");
    var texto = document.createTextNode(json.Contenido);
    var textarea=document.createElement("textarea");
    textarea.style.color=json.color;
    textarea.setAttribute("id",num+"text");
    div.setAttribute("id",num);
    div.style.top=json.y+"px";
    div.style.left=json.x+"px";
    textarea.style.height=json.height+"px";
    textarea.style.width=json.width+"px";
    document.getElementById("padre").appendChild(div);

    //crear header nota
    var head = document.createElement("div");
    var btn = document.createElement("button");
    var color = document.createElement("button");
    var x = document.createTextNode("X");
    var p=document.createElement("p");
    var colorText = document.createTextNode("Color");
    var fecha = document.createTextNode(json.date+"M");
    head.setAttribute("id",num+"header");
    head.setAttribute("fontSize","small");
    btn.setAttribute("onclick","borrar("+num+")");
    color.setAttribute("onclick","cambiarColor(prompt('Escribe el codigo hexadecimal del color, sin (#)'),"+num+")");
    textarea.setAttribute("onfocusout","actualizar("+div+","+textarea+")");
    div.setAttribute("onmouseout","mouseOut("+num+")");
    div.setAttribute("onmouseover","cabesa("+num+")");

    //appends, meter lo creado a la nota
    p.appendChild(fecha);
    btn.appendChild(x);
    color.appendChild(colorText);
    head.appendChild(btn);
    head.appendChild(color);
    head.appendChild(p);
    div.appendChild(head);
    textarea.appendChild(titulo);
    textarea.appendChild(texto);
    div.appendChild(textarea);

    //hacer la nota arrastable
    dragElement(num);

    //ajustar textarea
    textarea.style.height=textarea.scrollHeight+"px";
    div.style.height=textarea.style.height+30;
    head.style.width=100+"%";
    if(textarea.offsetWidth<div.offsetWidth-1){
        textarea.style.width=99+"%";        
    }
    head.style.display="none";
}
function borrar(id){
    localStorage.removeItem("N"+id);
    document.getElementById(id).remove();
}
function mostrarNotas(){
    for(var i=0;i<localStorage.length;i++){
        let aux=JSON.parse(localStorage.getItem(localStorage.key(i)));
        crearDiv(aux,i);
    }
    
}
/*================
    CONTROLADOR
================*/
function dragElement(elmnt) {
    elmnt=document.getElementById(elmnt);
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    // set the element's new position:
    elmnt.style.top = (e.clientY-20) + "px";
    elmnt.style.left = (e.clientX-100) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function mouseOut(div){
    var header=document.getElementById(div+"header");
    header.style.display="none";
    let text=document.getElementById(div+"text");
    div=document.getElementById(div);
    text.style.height=(text.scrollHeight)+"px";
    div.style.height=text.style.height+30;
    if(text.offsetWidth<div.offsetWidth-1){
        text.style.width=99+"%";        
    }else{}
    actualizar(div, text);
}
function actualizar(div, text){
    let str=text.value;
    let split=str.split("\n");
    let content="";
    for(var x=0;x<split[1].length;x++){
        content=content+split[1][x];
    }
    for(var j=2;j<split.length;j++){
        content=content+"\n"+split[j];
    }
    let nombre="";
    for(var i=0; i<split[0].length;i++){
        nombre=nombre+split[0][i];
    }
    let notas={
        "NombreNota":nombre,
        "Contenido":content,
        "num":div.id,
        "date":JSON.parse(localStorage.getItem("N"+div.id)).date,
        "color":text.style.color,
        "y":div.offsetTop-10,
        "x":div.offsetLeft-10,
        "height":text.offsetHeight,
        "width":text.offsetWidth
    }
    localStorage.setItem("N"+div.id,JSON.stringify(notas));
}
function cambiarColor(color,id){
    let text=document.getElementById(id+"text");
    text.style.color="#"+color;
    actualizar(document.getElementById(id),text);
}
function cabesa(id){
    let fecha=JSON.parse(localStorage.getItem("N"+id)).date;
    id=document.getElementById(id+"header");
    id.children[2].innerText=fecha+" M";
    id.style.display="block";
}
function reloj(){
    for(var i=0;i<localStorage.length;i++){
        objeto=JSON.parse(localStorage.getItem(localStorage.key(i)));
        objeto.date++;
        localStorage.setItem(localStorage.key(i),JSON.stringify(objeto));
    }
}
setInterval(reloj,60000);
