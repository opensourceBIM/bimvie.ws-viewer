/**
 * BIMSurfer constants.
 * @module BIMSURFER
 * @submodule configs
 * @class constants
 * @static
 */
if (typeof BIMSURFER.constants != 'object') {
    BIMSURFER.constants = {};
}

/**
 * Time in milliseconds before a connect or login action will timeout
 */
BIMSURFER.constants.timeoutTime = 10000; // ms

/**
 * Default IFC types.
 * @property defaultTypes
 * @namespace BIMSURFER
 * @type {{Array of String}}
 */
BIMSURFER.constants.defaultTypes = [
    "IfcColumn",
    "IfcStair",
    "IfcSlab",
    "IfcWindow",
//	"IfcOpeningElement",
    "IfcDoor",
    "IfcBuildingElementProxy",
    "IfcWallStandardCase",
    "IfcWall",
    "IfcBeam",
    "IfcRailing",
    "IfcProxy",
    "IfcRoof"
];

//writeMaterial(jsonWriter, "IfcSpace", new double[] { 0.137255f, 0.403922f, 0.870588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcRoof", new double[] { 0.837255f, 0.203922f, 0.270588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcSlab", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWall", new double[] { 0.537255f, 0.337255f, 0.237255f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWallStandardCase", new double[] { 1.0f, 1.0f, 1.0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDoor", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWindow", new double[] { 0.2f, 0.2f, 0.8f }, 0.2f);
//writeMaterial(jsonWriter, "IfcRailing", new double[] { 0.137255f, 0.203922f, 0.270588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcColumn", new double[] { 0.437255f, 0.603922f, 0.370588f, }, 1.0f);
//writeMaterial(jsonWriter, "IfcBeam", new double[] { 0.437255f, 0.603922f, 0.370588f, }, 1.0f);
//writeMaterial(jsonWriter, "IfcFurnishingElement", new double[] { 0.437255f, 0.603922f, 0.370588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcCurtainWall", new double[] { 0.5f, 0.5f, 0.5f }, 0.5f);
//writeMaterial(jsonWriter, "IfcStair", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcBuildingElementProxy", new double[] { 0.5f, 0.5f, 0.5f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowSegment", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowFitting", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowTerminal", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcProxy", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcSite", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcLightFixture", new double[] {0.8470588235f, 0.8470588235f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDuctSegment", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDuctFitting", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcAirTerminal", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);

BIMSURFER.constants.materials = {
    IfcSpace: [0.137255, 0.403922, 0.870588, 1.0],
    IfcRoof: [ 0.837255, 0.203922, 0.270588, 1.0],
    IfcSlab: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcWall: [ 0.537255, 0.337255, 0.237255, 1.0],
    IfcWallStandardCase: [ 0.537255, 0.337255, 0.237255, 1.0],
    IfcDoor: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcWindow: [ 0.137255, 0.403922, 0.870588, 0.5],
    IfcOpeningElement: [ 0.137255, 0.403922, 0.870588, 0],
    IfcRailing: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcColumn: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcBeam: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFurnishingElement: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcCurtainWall: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcStair: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcStairFlight: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcBuildingElementProxy: [ 0.5, 0.5, 0.5, 1.0],
    IfcFlowSegment: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFlowitting: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFlowTerminal: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcProxy: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcSite: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcLightFixture: [ 0.8470588235, 0.8470588235, 0.870588, 1.0],
    IfcDuctSegment: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcDistributionFlowElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcDuctFitting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcPlate: [ 0.8470588235, 0.427450980392, 0, 0.5],
    IfcAirTerminal: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcMember: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcCovering: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcTransportElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFlowController: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFlowFitting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcRamp: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFurniture: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFooting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcSystemFurnitureElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcSpace: [ 0.137255, 0.303922, 0.570588, 0.5],
    DEFAULT: [ 0.8470588235, 0.427450980392, 0, 1.0]
};

/*
 * Default camera settings
 */
BIMSURFER.constants.camera = {
    maxOrbitSpeed: Math.PI * 0.1,
    orbitSpeedFactor: 0.05,
    zoomSpeedFactor: 0.1,
    panSpeedFactor: 0.6
};

/*
 * Default markup for highlighted objects
 */
BIMSURFER.constants.highlightSelectedObject = {
    type: 'material',
    wire: true,
    id: 'highlight',
    emit: 0.0,
    baseColor: {r: 0.0, g: 1, b: 0}
};

/*
 * Default markup for highlighted special objects
 */
BIMSURFER.constants.highlightSelectedSpecialObject = {
    type: 'material',
    id: 'specialselectedhighlight',
    emit: 1,
    baseColor: {r: 0.16, g: 0.70, b: 0.88},
    shine: 10.0
};

/*
 * Enumeration for progressbar types
 */
BIMSURFER.constants.ProgressBarStyle = {
    Continuous: 1,
    Marquee: 2
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} s The number to clamp
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
BIMSURFER.constants.clamp = function (s, min, max) {
    return Math.min(Math.max(s, min), max);
};