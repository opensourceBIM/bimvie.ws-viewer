# bimvie.ws-viewer

An extensible and modular WebGL-based 3D viewer for BIMSurfer.  

 * [API Documentation](http://opensourcebim.github.io/bimvie.ws-viewer/docs/)
 * [Live Examples](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#object_RandomObjects)
 * [Issues](https://github.com/opensourceBIM/bimvie.ws-viewer/issues)

## Features

Features so far - work in progress.

#### Cameras

 * [Multiple cameras](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#camera_Camera_multiple)
 * [Camera interaction](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_CameraControl)
 
#### Animation

 * [Fly camera to boundary](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#animate_CameraFlyAnimation_boundary)
 * [Fly camera to position](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#animate_CameraFlyAnimation_position)
 
#### Effects

 * [Highlight objects](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#effect_HighlightEffect)
 * [X-Ray objects](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#effect_XRayEffect)
 * [Label objects - labels for debugging](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#effect_LabelEffect)
 * [Label objects - custom HTML labels](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#label_Label)
 
#### Lights

 * [Ambient lights](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#light_AmbientLight)
 * [Directional lights](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#light_DirLight)
 * [Point lights](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#light_PointLight)
 
#### Geometry
  
 * [Custom meshes](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#geometry_Geometry)
 * Primitives for debugging - [box](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#geometry_Box), [box](examples/#geometry_Teapot) 
 
## Dev Tasks

 * Create viewer core in this repository
 * Finish API docs
 * Finish examples
 * Integrate viewer into [bimvie.ws](https://github.com/opensourceBIM/bimvie.ws)
 
## Installation

(in progress)

````
npm install grunt --save-dev

npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-jshint --save-dev
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-clean --save-dev
npm install grunt-contrib-yuidoc --save-dev
npm install grunt-contrib-copy --save-dev
npm install grunt-contrib-jasmine --save-dev

````

