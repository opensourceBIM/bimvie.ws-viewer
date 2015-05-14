# bimvie.ws-viewer

An extensible and modular WebGL-based 3D viewer for BIMSurfer.  

 * [API Documentation](http://opensourcebim.github.io/bimvie.ws-viewer/docs/)
 * [Live Examples](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#object_RandomObjects)
 * [Issues](https://github.com/opensourceBIM/bimvie.ws-viewer/issues)

## Features

Work in progress!

**Viewer**

 * Embed multiple viewers in a page
 * Transparent canvas for reduced GPU workload
 
**Cameras**

Create an [unlimited number of cameras](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#camera_Camera_multiple) in your Viewer 
and switch between them as required.
 
Use a [CameraControl](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_CameraControl) to interact with your 
cameras, or compose your own custom camera control from these modular controller components:

 * [KeyboardAxisCamera](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_KeyboardAxisCamera)
 * [KeyboardOrbitCamera](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_KeyboardOrbitCamera)
 * [KeyboardPanCamera](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_KeyboardPanCamera)
 * [KeyboardZoomCamera](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_KeyboardZoomCamera)
 * [MouseOrbitCamera](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_MouseOrbitCamera)
 * [MouseZoomCamera](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#control_MouseZoomCamera)  
 
**Animation**

Fly your cameras around using these animation components:

 * [Fly camera to boundary](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#animate_CameraFlyAnimation_boundary)
 * [Fly camera to position](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#animate_CameraFlyAnimation_position)
 
**Effects**

Emphasise your objects using these modular effects components:

 * [HighlightEffect](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#effect_HighlightEffect)
 * [XRayEffect](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#effect_XRayEffect)
 * [LabelEffect - labels for debugging](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#effect_LabelEffect)
 * [Label - custom HTML labels](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#label_Label)
 
**Lights**

Create an unlimited number of ambient, directional and point lights in your Viewer, using these light source components:

 * [AmbientLight](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#light_AmbientLight)
 * [DirLight](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#light_DirLight)
 * [PointLight](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#light_PointLight)
 
**Objects**
  
 Define objects that may be 
 * [Custom meshes](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#geometry_Geometry)
 * Primitives for debugging - [box](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#geometry_BoxGeometry), [teapot](http://opensourcebim.github.io/bimvie.ws-viewer/examples/#geometry_TeapotGeometry) 
 
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

