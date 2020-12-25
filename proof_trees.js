//Constructed with p5.js: https://p5js.org/get-started/
//https://p5js.org/examples/
let font,
  bounds, // holds x, y, w, h of the text's bounding box
  fontsize = 15,
  infers,
  inp1,
  inp2,
  button1,
  button2;

let root = null;
let pressed_node = null;
let cnt = 0;
let tex_generated = false;

function preload() {
  font = loadFont('arial.ttf');
}

function setup(){
	createCanvas(1600,1600);
	//textFont(font);
	textSize(fontsize);
	infers = [];

	inp1 = createInput('Conclusion Here');
	inp1.position(20,30);
	inp2 = createInput('Label Here');
	inp2.position(300,30);
	button1 = createButton('Add Node');
	button1.position(575,30);
	button1.mousePressed(add_node);
	button2 = createButton('Get Tex');
	button2.position(715,30);
	button2.mousePressed(get_tex);

}

function draw(){
	if(!tex_generated){
		background(255);
		let x = mouseX
		let y = mouseY

		rect(50,600,800,200);
		for(let i = 0; i < infers.length;i++){
			infers[i].show(x,y);
		}
	}
}

function doubleClicked(){
	if(root == null){	
		let x = mouseX;
		let y = mouseY;
		
		infr = new Inference(x,y,inp1.value(),inp2.value(),[]);
		infers.push(infr);
		infr.show(x,y);
		root = infr;
	}
}

function mousePressed(){
	let x = mouseX;
	let y = mouseY;
	for(let i = 0; i < infers.length;i++){
		infers[i].pressed(x,y);
	}
}

function mouseReleased(){
	for(let i = 0; i < infers.length;i++){
		infers[i].notPressed();
	}
}

function add_node(){
	if(pressed_node != null){
		let x = 100;
		let y = 200;
		
		infr = new Inference(x,y,inp1.value(),inp2.value(),[]);
		infers.push(infr);
		infr.show(x,y);
		
		pressed_node.children.push(infr);
	}
}

class Inference{
  constructor(x,y,conc,label,children){
		this.x = x;
		this.y = y;
		this.dragging = false;
		this.offsetX = 0;
		this.offsetY = 0;
		this.conc = conc;
		this.label = label;
		this.children = children
		this.is_selected = false;
		this.id = cnt;
		cnt=cnt+1;
   }

  show(px, py) {
    if (this.dragging) {
      this.x = px + this.offsetX;
      this.y = py + this.offsetY;
    }
    
    //Need to center w.r.t line somehow
    let conc_bbox = font.textBounds(this.conc,this.x,this.y,fontsize);
    if(this.is_selected){
    	strokeWeight(1);
	    text(this.conc,this.x,this.y);
	    //Will need to configure depending on assumptions
	    strokeWeight(4);
	    stroke(255,0,0);
	    line(conc_bbox.x-10,conc_bbox.y-10,conc_bbox.x+conc_bbox.w+10,conc_bbox.y-10);
	    strokeWeight(1);
	    stroke(0);
	    text(this.label,conc_bbox.x + conc_bbox.w + 15,conc_bbox.y-5);
	}
	else{
		stroke(0);
		strokeWeight(1);
		text(this.conc,this.x,this.y);
	    //Will need to configure depending on assumptions
	    strokeWeight(4);
	    line(conc_bbox.x-10,conc_bbox.y-10,conc_bbox.x+conc_bbox.w+10,conc_bbox.y-10);
	    strokeWeight(1);
	    text(this.label,conc_bbox.x+ conc_bbox.w + 15,conc_bbox.y-5);
	}

    this.bb_x = conc_bbox.x-10;
    this.bb_y = conc_bbox.y-10;
    this.bb_w = conc_bbox.w+20;
    this.bb_h = conc_bbox.h+10;
  }

  pressed(px, py) {
    if (px < this.bb_x + this.bb_w && px > this.bb_x && py > this.bb_y && py < this.bb_y+this.bb_h) {
      this.dragging = true;
      this.offsetX = this.x - px;
      // print(this.offsetX);
      this.offsetY = this.y - py;
      // print(this.offsetY);
      pressed_node = this;
      this.is_selected = true;

      this.print_children();

    }
    else{
    	if(pressed_node != null && pressed_node.id == this.id){pressed_node = null;}
    	this.is_selected = false;
    }
  }

  notPressed() {
      this.dragging = false;
  }

  print_children(){
  	  for(let i = 0; i < this.children.length; i++){
  	  	console.log(this.children[i].id);
  	  }
  }

}

function convert_to_tex(node){
	//Structure: \infer["label"]{"conclusion"}{children}
	//Assumes everything in a math environment'
	let tex = "\\infer";
	tex = tex + "[" + node.label + "]";
	tex = tex + "{" + node.conc + "}";

	let children = "";
	for(let i = 0; i < node.children.length; i++){
		let res = convert_to_tex(node.children[i]);
		children = children + res;
	}
	children = "{" + children + "}";
	tex = tex + children;
	tex = "{" + tex + "}";
	return tex;
}

function get_tex(){
	console.log(root);
	if(root != null){
		let tex = convert_to_tex(root);
		console.log(tex);
		textSize(12);
		text(tex,55,605,800,200);
		tex_generated = true;
		saveStrings([tex],"proof_tree.txt");
	}
}