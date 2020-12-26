//Constructed with p5.js: https://p5js.org/get-started/
//https://p5js.org/examples/
let font,
  bounds, // holds x, y, w, h of the text's bounding box
  fontsize = 15,
  infers,
  inp1,
  inp2,
  button1,
  button2,
  button3,
  button4,
  button5,
  b1,b2,b3,b4,b5;

let root = null;
let parent = null;
let child = null;
let cnt = 0;
let tex_generated = false;
let links_on = false;
b1 = false;
b2 = false;
b3 = false;
b4 = false;
b5 = false;

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
	button3 = createButton('Link');
	button3.position(855,30);
	button3.mousePressed(link);
	button4 = createButton('Get Info');
	button4.position(575,100);
	button4.mousePressed(get_info);
	button5 = createButton('Toggle Links');
	button5.position(715,100);
	button5.mousePressed(toggle_links);
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

		if(links_on){
			drawingContext.setLineDash([5,15]);
			for(let i = 0; i < infers.length; i++){
				for(let j = 0; j < infers[i].children.length; j++){
					let px = infers[i].x;
					let py = infers[i].y;
					let cx = infers[i].children[j].x;
					let cy = infers[i].children[j].y;
					let rx = px - cx;
					let ry = py - cy;
					v0 = createVector(rx,ry);
					v1 = createVector(cx,cy);
					drawArrow(v1,v0,'blue');
				}
			}
			drawingContext.setLineDash([]);
		}

		b1 = false;
		b2 = false;
		b3 = false;
		b4 = false;
		b5 = false;
	}
}

//How does this work?
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function doubleClicked(){
	for(let i = 0; i < infers.length; i++){
		if(infers[i].is_parent){
			infers.splice(i,1);
			break;
		}
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
	b1 = true;
	let x = 100;
	let y = 200;
	
	infr = new Inference(x,y,inp1.value(),inp2.value(),[]);
	infers.push(infr);
	infr.show(x,y);
	
	if(root == null){root = infr;}
}

function link(){
	b3 = true;
	if(parent != null && child != null){
		console.log("LINKING");
		parent.children.push(child);
		parent.is_parent = false;
		child.is_child = false;
		parent =null;
		child = null;
	}
}

function touching_button(){
	return b1 || b2 || b3 || b4 || b5;
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
		this.is_child = false;
		this.is_parent = false;
		this.id = cnt;
		cnt=cnt+1;
   }

  show(px, py) {
    if (this.dragging) {
      this.x = px + this.offsetX;
      this.y = py + this.offsetY;
    }
    
    //Need to center w.r.t line somehow
    let child_len = 0;

    for(let i = 0; i < this.children.length; i++){
    	child_len = child_len + 5 +this.children[i].bb_w;
    }

    let conc_bbox = font.textBounds(this.conc,0,0,fontsize);

    let parent_len = conc_bbox.w + 20;

    let line_len = max(parent_len,child_len);
    if(this.is_parent){
    	strokeWeight(4);
	    stroke(255,0,0);
	    line(this.x,this.y,this.x+line_len,this.y);
    	//console.log("Is parent");
    	//console.log(this.id);
    	stroke(0);
    	strokeWeight(1);
    	textAlign(CENTER);
	    text(this.conc,(this.x+this.x+line_len)/2,this.y+20);
	    textAlign(LEFT);
	    text(this.label,this.x+line_len + 15,this.y+5);
	}
	else if(this.is_child){
		strokeWeight(4);
	    stroke(0,0,255);
	    line(this.x,this.y,this.x+line_len,this.y);
    	//console.log("Is parent");
    	//console.log(this.id);
    	stroke(0);
    	strokeWeight(1);
    	textAlign(CENTER);
	    text(this.conc,(this.x+this.x+line_len)/2,this.y+20);
	    textAlign(LEFT);
	    text(this.label,this.x+line_len + 15,this.y+5);
	}
	else{
		strokeWeight(4);
	    stroke(0);
	    line(this.x,this.y,this.x+line_len,this.y);
    	//console.log("Is parent");
    	//console.log(this.id);
    	strokeWeight(1);
    	textAlign(CENTER);
	    text(this.conc,(this.x+this.x+line_len)/2,this.y+20);
	    textAlign(LEFT);
	    text(this.label,this.x+line_len + 15,this.y+5);
	}

    this.bb_x = this.x;
    this.bb_y = this.y;
    this.bb_w = line_len;
    this.bb_h = conc_bbox.h+10;
  }

  pressed(px, py) {
    if (px < this.bb_x + this.bb_w && px > this.bb_x && py > this.bb_y && py < this.bb_y+this.bb_h) {
      this.dragging = true;
      this.offsetX = this.x - px;;

      // print(this.offsetX);
      this.offsetY = this.y - py;
      // print(this.offsetY);
      parent = this;
  	  this.is_parent = true;

      //this.print_info();

    }
    else if(!touching_button()){
    	if(this.is_parent){child = this; this.is_parent = false; this.is_child = true;}
    	else if(this.is_child){child = null; this.is_child = false;}
    }
  }

  notPressed() {
      this.dragging = false;
  }

  print_info(){
  	  console.log("Info: " + this.id);

  	  console.log(this.is_parent);
  	  console.log(this.is_child);

  	  console.log("Children:");
  	  for(let i = 0; i < this.children.length; i++){
  	  	console.log(this.children[i].id);
  	  }
  }

}

function get_info(){
	b4 = true;
	for(let i = 0; i < infers.length; i++){
		infers[i].print_info();
	}
}

function toggle_links(){
	b5 = true;
	links_on = !links_on;
	console.log(links_on);
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
    if (i > 0) {
      children += " & ";
    }
		children = children + res;
	}
	children = "{" + children + "}";
	tex = tex + children;
	//tex = "{" + tex + "}";
	return tex;
}

function get_tex(){
	b2 = true;
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