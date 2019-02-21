import * as math from 'mathjs'

export function polarToCart(theta, radius) {
  return [radius * Math.cos(theta), -radius * Math.sin(theta)]
}

export function xyzToRGB(xyz) {
  var mat = [[3.2404542, -1.5371385, -0.4985314],
            [-0.9692660,  1.8760108, 0.0415560],
            [0.0556434, -0.2040259, 1.0572252]]
  return math.multiply(mat, xyz)
}

export function JChToXYZ(jch, sp) {
  var J = jch[0]
  var C = jch[1]
  var h = jch[2]

  var t = Math.pow(C/(Math.sqrt(J/100)*Math.pow(1.64 - Math.pow(0.29, sp.n), 0.73)), 1/0.9)
  var et = 0.25 * (Math.cos(h + 2) + 3.8)
  var A = sp.Aw * Math.pow(J / 100, 1/(sp.c * sp.z))
  var p1 = (50000/13) * sp.Nc * sp.Ncb * et / t
  var p2 = A/sp.Nbb + 0.305
  var p3 = 21/20
  // console.log("n: " + sp.n)
  // console.log("A: "+ A)
  // console.log("p1 p2 p3 " + p1 + " " + p2 + " " + p3)

  // console.log("t: " + t)
  var a = 0
  var b = 0
  if(Math.abs(Math.sin(h)) >= Math.abs(Math.cos(h))) {
    // console.log("path A")
    var p4 = p1 / Math.sin(h)
    b = (p2 * (2 + p3) * 460 / 1403) / 
      (p4 + (2 + p3) * (220/1403) * (Math.cos(h) / Math.sin(h)) - (27/1403) + p3 * 6300/1403)
    a = b * Math.cos(h) / Math.sin(h)
  } else {
    // console.log("path B")
    var p5 = p1 / Math.cos(h)
    a = (p2 * (2 + p3) * 460 / 1403) / 
      (p5 + (2 + p3) * (220/1403) - ((27/1403) - p3 * 6300/1403) * (Math.sin(h) / Math.cos(h)))
    b = a * Math.sin(h) / Math.cos(h)
  }

  // console.log("a,b = " + a + " " + b)

  var RGBPa = [
    (460/1403) * p2 + (451/1403) * a + (288/1403) * b,
    (460/1403) * p2 - (891/1403) * a - (261/1403) * b,
    (460/1403) * p2 - (220/1403) * a - (6300/1403) * b
  ]

  var RGBp = [
    Math.sign(RGBPa[0] - 0.1) * (100/sp.FL) * 
      Math.pow((27.13 * Math.abs(RGBPa[0] - 0.1)) / (400 - Math.abs(RGBPa[0] - 0.1)), 1/0.42),
    Math.sign(RGBPa[1] - 0.1) * (100/sp.FL) * 
      Math.pow((27.13 * Math.abs(RGBPa[1] - 0.1)) / (400 - Math.abs(RGBPa[1] - 0.1)), 1/0.42),
    Math.sign(RGBPa[2] - 0.1) * (100/sp.FL) * 
      Math.pow((27.13 * Math.abs(RGBPa[2] - 0.1)) / (400 - Math.abs(RGBPa[2] - 0.1)), 1/0.42)
  ]

  // console.log("RGBPa: "+ RGBPa)
  // console.log("RGBp: "+ RGBp)

  var RGBc = math.multiply(Mcat(), math.multiply(MhpeInv(), RGBp))

  var RGB = [RGBc[0] / sp.Dr,
             RGBc[1] / sp.Dg,
             RGBc[2] / sp.Db]
  var xyz = math.multiply(McatInv(), RGB)

  return xyz
}

export function getSharedParameters() {
  var XYZw = [95.05, 100.00, 108.88]
  // var XYZw = [100, 120.00, 100]

  var LA = 318.30988618379
  var Yb = 20

  var k = 1/(5*LA+1)
  var n = Yb / XYZw[1]
  var F = 1.0

  var FL = 0.2*Math.pow(k,4)*5*LA+0.1*Math.pow(1-Math.pow(k, 4), 2)*Math.pow(5*LA, 1.0/3.0)

  var D = F*(1-(1/3.6)*Math.exp((-LA-42)/92))

  var Nbb = 0.725 * Math.pow(1/n, 0.2)
  var z = 1.48 + Math.sqrt(n)
  var Ncb = Nbb

  var RGBw = math.multiply(Mcat(), XYZw)

  var Dr = (D*(XYZw[1]/RGBw[0])+1-D)
  var Dg = (D*(XYZw[1]/RGBw[1])+1-D)
  var Db = (D*(XYZw[1]/RGBw[2])+1-D)
  

  var RGBwc = [RGBw[0] * Dr, RGBw[1] * Dg, RGBw[2] * Db]

  var RGBpw = math.multiply(Mhpe(), math.multiply(McatInv(), RGBwc))
  var RGBPaw = [
    ((400*Math.pow(FL*RGBpw[0]/100,0.42))/((Math.pow(FL*RGBpw[0]/100, 0.42))+27.13))+0.1,
    ((400*Math.pow(FL*RGBpw[1]/100,0.42))/((Math.pow(FL*RGBpw[1]/100, 0.42))+27.13))+0.1,
    ((400*Math.pow(FL*RGBpw[2]/100,0.42))/((Math.pow(FL*RGBpw[2]/100, 0.42))+27.13))+0.1
  ]

  var Aw = (2 * RGBPaw[0] + RGBPaw[1] + RGBPaw[2]/20 - 0.305) * Nbb
  var Nc = 1.0
  

  var c = 0.69

  return {
    RGBPaw: RGBPaw,
    Aw: Aw,
    Dr: Dr,
    Dg: Dg,
    Db: Db,
    FL: FL,
    Nbb: Nbb,
    Ncb: Ncb,
    z: z,
    n: n,
    Nc: Nc,
    c: c
  }
  
}

function Mcat() {
  return [[0.7328, 0.4296, -0.1624], [-0.7036, 1.6975, 0.0061], [0.0030, 0.0136, 0.9834]]
}

function Mhpe() {
  return [[0.38971, 0.68898, -0.07868], [-0.22981, 1.18340, 0.04641], [0.00000, 0.00000, 1.00000]]
}

function McatInv() {
  return [[1.096124, -0.278869, 0.182745], [0.454369, 0.473533, 0.072098], [-0.009628, -0.005698, 1.015326]]
}

function MhpeInv() {
  return [[1.910197, -1.112124, 0.201908], [0.370950, 0.629054, -0.000008], [0.000000, 0.000000, 1.000000]]
}

export function xyzToJCh(XYZ, sp) {
  var RGB = math.multiply(Mcat(), XYZ)

  var RGBc = [RGB[0] * sp.Dr, RGB[1] * sp.Dg, RGB[2] * sp.Db]
  // console.log(RGBc)

  var RGBp = math.multiply(Mhpe(), math.multiply(McatInv(), RGBc))
  // console.log(RGBp)

  var RGBPa = [
    ((400*Math.pow(sp.FL*RGBp[0]/100,0.42))/((Math.pow(sp.FL*RGBp[0]/100, 0.42))+27.13))+0.1,
    ((400*Math.pow(sp.FL*RGBp[1]/100,0.42))/((Math.pow(sp.FL*RGBp[1]/100, 0.42))+27.13))+0.1,
    ((400*Math.pow(sp.FL*RGBp[2]/100,0.42))/((Math.pow(sp.FL*RGBp[2]/100, 0.42))+27.13))+0.1
  ]

  var a = RGBPa[0]-12*RGBPa[1]/11+RGBPa[2]/11
  var b = (1.0/9)*(RGBPa[0]+RGBPa[1]-2*RGBPa[2])


  // console.log("a, b = " + a + " " + b)

  var h = 0;
  if(b>=0) {
    h = Math.atan2(b,a)
  } else {
    h = Math.PI * 2 + Math.atan2(b,a)
  }

  var et = 0.25 * (Math.cos(h + 2) + 3.8)

  var A = (2 * RGBPa[0] + RGBPa[1] + RGBPa[2]/20 - 0.305) * sp.Nbb

  var J = 100 * Math.pow(A / sp.Aw, sp.c * sp.z)

  var t = (((50000/13) * sp.Nc * sp.Ncb) * et * Math.sqrt(a * a + b * b)) /
    (RGBPa[0] + RGBPa[1] + (21/20) * RGBPa[2])

  var C = Math.pow(t, 0.9) * Math.pow(J / 100, 0.5) * 
      Math.pow(1.64 - Math.pow(0.29, sp.n), 0.73)

  return [J, C, h]
}