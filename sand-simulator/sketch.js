const rows = 50
const columns = 50
const cellSize = 2
const scaleNum = 4
let frameNum = 0
let arraySpace = []
let mouseMatIndex = 2
const materials = new Map([
  ['empty', [0, [0, 0, 0]]],
  ['water', [1, [0, 0, 255]]],
  ['sand',  [2, [226, 202, 118]]],
  ['stone', [3, [100, 100, 100]]]])
let matIds = Array.from (materials.keys())
let matValues = Array.from(materials.values())

class Particle {
  constructor(id) {
    this.id = id
    this.updated = false
    this.updateValues()
  }
  setId(id) {
    this.id = id
    this.updateValues()
    this.updated = true
  }
  setUpdated(bool) {
    this.updated = bool
  }
  switchPlaces(otherP) {
    let temp = otherP.id
    otherP.setId(this.id)
    this.setId(temp)
  }
  updateValues() {
    // Update the color and the weight
    this.weight = materials.get(this.id)[0]
    this.pixelColor = materials.get(this.id)[1]
  }
  update(bel, bL, bR, l, r) {
    // Sand behavior
    let rand = Math.random() * 10
    if (this.id == "sand") {
        if (bel.weight < this.weight) {
          this.switchPlaces(bel)
        } else if (bL.weight < this.weight && bR.weight < this.weight) {
          if (rand < 5) {
            this.switchPlaces(bL)
          } else {
            this.switchPlaces(bR)
          }
        } else {
          for (const pos of [bL, bR]) {
            if (pos.weight < this.weight && pos!=0 && pos!=undefined) {
            this.switchPlaces(pos)
          }
        }
      } 
    } else if (this.id == "water") {
      if (bel.weight < this.weight) {
          this.switchPlaces(bel)
        } else if (bL.weight < this.weight && bR.weight < this.weight) {
          if (rand < 5) {
            this.switchPlaces(bL)
          } else {
            this.switchPlaces(bR)
          }
        } else {
          for (const pos of [bL, bR]) {
            if (pos.weight < this.weight && pos!=0 && pos!=undefined) {
              this.switchPlaces(pos)
              break
          }
        }
          if (l.weight < this.weight && r.weight < this.weight) {
            if (rand < 5) {
              this.switchPlaces(l)
            } else {
              this.switchPlaces(r)
            }
          } else {
            let posList = []
            if (rand < 5) {
              posList = [l, r]
            } else {
              posList = [r, l]
            }
            for (const pos of posList) {
              if (pos.weight < this.weight && pos!=0 && pos!=undefined) {
                this.switchPlaces(pos)
                break
            }
          }
        }
      }
    }
  }
}

for (let i = 0; i < rows; i++) {
  arraySpace[i] = []
  for (let j = 0; j < columns; j++)
    arraySpace[i][j] = new Particle("empty")
}
// console.log(arraySpace)

function setup() {
  const canvas = createCanvas(cellSize*columns*scaleNum, cellSize*rows*scaleNum + 50);
  background('green')
  canvas.elt.oncontextmenu = () => false;
  strokeWeight(0)
  textAlign(LEFT, TOP)
  textSize(10)
  //frameRate(5)
}

function draw() {
  frameNum += 1
  scale(scaleNum)
  background('green')
  fill('white')
  text("Selected: " + matIds[mouseMatIndex], 2, cellSize*rows+2)
  for (let i = 0; i < arraySpace.length; i++) {
    for (let j = 0; j < arraySpace[0].length; j++) {
      let currentParticle = arraySpace[i][j]
      currentParticle.setUpdated(false)
      fill(currentParticle.pixelColor)
      square(cellSize*j, cellSize*i, cellSize)
    }
  }
  for (let i = rows-1; i >= 0; i--) {
    for (let j = 0; j < columns; j++) {
      let currentParticle = arraySpace[i][j]
      if (i!=rows-1) {belowParticle = arraySpace[i+1][j]} else {
        belowParticle = 0
        //console.log("b not set")
      }
      if (j!=0 && i!=rows-1) {bottLeftParticle = arraySpace[i+1][j-1]} else {bottLeftParticle = 0}
      if (j!=columns - 1 && i!=rows-1) {bottRightParticle = arraySpace[i+1][j+1]} else {bottRightParticle = 0}
      if (j!=0) {leftParticle = arraySpace[i][j-1]} else {leftParticle = 0}
      if (j!=columns-1) {rightParticle = arraySpace[i][j+1]} else {rightParticle = 0}
      if (!currentParticle.updated) {
        currentParticle.update(belowParticle, bottLeftParticle, bottRightParticle, leftParticle, rightParticle)
      }
    }
  }
  if (mouseIsPressed && (frameNum % 2 == 0)) {
    const gridX = constrain(Math.floor(Math.floor(mouseX/scaleNum) / cellSize), 0, columns-1)
    const gridY = constrain(Math.floor(Math.floor(mouseY/scaleNum) / cellSize), 0, rows-1)
    // console.log(gridX)
    // console.log(gridY)
    if (mouseButton == "left") {
      arraySpace[gridY][gridX] = new Particle(matIds[mouseMatIndex])
    }
  }
}

function mousePressed() {
  if (mouseButton == "right") {
    mouseMatIndex += 1
    if (mouseMatIndex > matValues.length-1) {
      mouseMatIndex = 0
    }
  }
}
