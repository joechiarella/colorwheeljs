import * as ColorMath from './colormath.js'
import * as React from 'react'
import { Component } from 'react'
import { PaperScope, paper } from 'paper'


const paperStyle = {
  width: '800px',
  height: '800px'
}

class PaperSetup extends Component {
    constructor(props) {
        super(props)
        console.log("in const")
        this.canvasRef = React.createRef();
        // window['paper'] = new PaperScope()
    }
    render() {
        return (
            <canvas style={paperStyle} ref={this.canvasRef} data-paper-resize="true"/>
        )
    }

    drawCircle() {



      const hueSteps = 25
      const chromaSteps = 10
      const chromaInc = 100 / chromaSteps
      const J = 70

      const sp = ColorMath.getSharedParameters()
      const greyXYZ = ColorMath.JChToXYZ([J, 0, 0], sp)
      const greyRGB = ColorMath.xyzToRGB(greyXYZ)

      var greyCirc = new paper.Path.Circle({
          center: [0, 0],
          radius: 5,
          fillColor: new paper.Color(greyRGB[0]/100, greyRGB[1]/100, greyRGB[2]/100)
        });






        for(let C = chromaInc; C < 100; C += chromaInc) {
          const steps = 1 + (C * hueSteps / 100)
          const hueInc = Math.PI / steps
          for(let h = 0; h < 2 * Math.PI; h += hueInc) {
            // J = 40 + C / 2
            const jch = [J, C, h]
            const xyz1 = ColorMath.JChToXYZ([J, C, h - (hueInc / 2)], sp)
            const xyz2 = ColorMath.JChToXYZ([J, C, h + (hueInc / 2)], sp)
            // console.log(xyz)
            this.createPoint(jch, xyz1, xyz2, hueInc, chromaInc)
          }
        
          new paper.Path.Circle({
            center: new paper.Point(0, 0),
            radius: C * 48 / 100,
            strokeColor: 'black',
            strokeWidth: 0.05
          });
          // break;
        }

      new paper.Path.Circle({
        center: new paper.Point(0, 0),
        radius: 48,
        strokeColor: 'black',
        strokeWidth: 1
      });
    }

    createPoint(jch, XYZ1, XYZ2, hueInc, chromaInc) {
      // console.log(XYZ)
      const rgb1 = ColorMath.xyzToRGB(XYZ1)
      const rgb2 = ColorMath.xyzToRGB(XYZ2)
      // var jch = xyzToJCh(XYZ)
      // console.log("RGB: " + rgb)
      // console.log("JCh: " + jch)
      
      const radius = jch[1] * 48 / 100
    
      const hueMin = jch[2] - (hueInc/2 + 0.01)
      const hueMax = jch[2] + (hueInc/2  + 0.01)
      const chromaMin = (jch[1]) * 48 / 100
      let chromaMax = (jch[1] + chromaInc * 2) * 48 / 100
      chromaMax = Math.min(chromaMax, 48)
    
      const loc1 = new paper.Point(ColorMath.polarToCart(hueMin, chromaMin))
      const loc2 = new paper.Point(ColorMath.polarToCart(hueMin, chromaMax))
      const loc3 = new paper.Point(ColorMath.polarToCart(hueMax, chromaMax))
      const loc4 = new paper.Point(ColorMath.polarToCart(hueMax, chromaMin))
    
      const color1 = new paper.Color(rgb1[0]/100, rgb1[1]/100, rgb1[2]/100)
      const color2 = new paper.Color(rgb2[0]/100, rgb2[1]/100, rgb2[2]/100)
    
      const stops = [ [color1, 0], [color2, 1.0] ];
      const gradient = new paper.Gradient(stops);
    
      const gradientColor = new paper.Color(gradient, loc1, loc4);
    
      const path = new paper.Path({
        segments: [loc1, loc2, loc3, loc4],
        closed: true,
        fillColor: gradientColor,
        // strokeColor: 'black',
        // strokeWidth: 0.2
        // selected: true
      });
      
    
      
      
      // var dot = new Path.Circle({
      //   center: loc,
      //   strokeColor: 'black',
      //   strokeWidth: 0,
      //   radius: 1,
      //   fillColor: new Color(rgb[0]/100, rgb[1]/100, rgb[2]/100)
      // });
      
      return path
    }

    componentDidMount() {
        // let scope = window['paper']
        // console.log("Scope: "+ scope)
        console.log("Scope: "+ paper)
        // paper.activate()
        paper.setup(this.canvasRef.current)


        console.log("canvas: "+ this.canvasRef.current)


        paper.view.onResize = function(event) {
          console.log("onResize")
          var size = paper.view.viewSize
          var minDim = Math.min(size.height, size.width)
          paper.view.translate(paper.view.center)
          paper.view.scaling = (minDim/100)
          // Whenever the window is resized, recenter the path:
          // path.position = view.center;
        }

        this.drawCircle()

        // Draw the view now:
        // paper.view.update()
        
        paper.view.onResize()
        // paper.view.draw();

  
        // console.log("view: " + paper.view)
    }



    componentDidUpdate() {
      console.log("update")
      // paper.view.draw();
    }
    
    
}

export default PaperSetup