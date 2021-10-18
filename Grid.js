//create sound synthesis var
let monoSynth = new p5.MonoSynth();
//initialise array of notes to be played by monoSynth
let notes = [
  ["A5", "C2", "F#5"],
  ["F3", "E3", "D5"],
  ["D5", "C5", "B3"],
  ["G2", "A3", "F#3"],
  ["E4", "G3", "C3"],
  ["C3", "E3", "F#5"],
  ["F#2", "A3", "C4"]
];

class Grid {

  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        //get the position (center of circle)
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        //state 0 = not active, 1 = active
        //initialise to 0 inactive first
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        //if the noteState = 1 means active note
        if (this.noteState[i][j]>0) {   
             
          //set alpha state, gradually decays
          var alpha = this.noteState[i][j] * 150;

          //adjust colours based on grid coords
          var c1Map = map(x, 0,this.gridWidth, 0,255);
          var c2Map = map(y, 0,this.gridHeight, 0,255);
          var c1 = color(c2Map,c2Map,c1Map,alpha);
          var c2 = color(c1Map,c2Map,c2Map,alpha);
            
          //apply colour mix to drawing notes
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          stroke(255); 
            
          //length reducing by s (the state will slowly go from 1 to 0)
          //decrement of -0.05
          var s = this.noteState[i][j];
          var outerCircle = 1 - this.noteState[i][j];
          var mapOuterCircle = map(outerCircle, 0,1, 1,2);
            
          //**ADDITIONAL GRAPHICS TO ELLIPSE**    
          //original ellipse
          ellipse(x, y, this.noteSize*s, this.noteSize*s);
            push();
            //outer circle ring
            stroke(color(255,255,230,alpha*0.3));
            strokeWeight(5);
            ellipse(x, y, this.noteSize*mapOuterCircle, this.noteSize*mapOuterCircle);
            
                //inner circle ring
                push();
//                fill(255,255,0, alpha*0.2);
                stroke(color(255,255,230,alpha*0.2));
//                ellipse(x, y, this.noteSize*mapOuterCircle*0.4, this.noteSize*mapOuterCircle*0.4); //expanding
                ellipse(x, y, this.noteSize*s*0.5, this.noteSize*s*0.5); //contracting
                pop();
            
                //additional larger fade circles
                push();
                mix.setAlpha(alpha*0.2);
                fill(mix);
                noStroke();
                ellipse(x, y, this.noteSize*mapOuterCircle*2, this.noteSize*mapOuterCircle*2);
                    //nested push/pop for bigger fade circle
//                    push();
//                    mix.setAlpha(alpha*0.05);
////                    stroke(color(255,255,230,alpha*0.08));
//                    ellipse(x, y, this.noteSize*mapOuterCircle*2, this.noteSize*mapOuterCircle*2);
//                    pop();
                pop();
            pop();
            
            //**RANDOM ELEMENT**
            //original position
            //create random element of white circling ripples
            var randElem = int(random(1,100));
            noFill();
            stroke(color(255,255,230));
            if(randElem == 25){
                ellipse(x,y, this.noteSize*mapOuterCircle*1.5, this.noteSize*mapOuterCircle*1.5);
            }
            
           //**SOUND ON NOTE**
           //map and then convert to int type (using: | 0) for 2D array indexes 
           //values derived base off drawn notes X and Y coords
           var noteX = map(x, 0, this.gridWidth, 0, 7) | 0;
           var noteY = map(y, 0, this.gridHeight, 0, 3) | 0;
           //pass in the array indexes to the synth
           this.playSynth(noteX, noteY);
        }
        this.noteState[i][j]-=0.05;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }
  /////////////////////////////////
  playSynth(noteX, noteY){
      //starts the audio
      userStartAudio();
      //get note from the notes array initialised using the arguments passed in
      let note = notes[noteX][noteY];
      //volume from 0 to 1
      let velocity = random();
      monoSynth.play(note, velocity, 0, 1/64); //parameters are(note, volume(0-1), time from now, note duration)
  }
   
}
