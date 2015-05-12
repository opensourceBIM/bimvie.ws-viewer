YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AmbientLight",
        "Anaglyph",
        "BIMSURFER",
        "BIMSURFER.Viewer",
        "BIMSURFER.constants",
        "BoxGeometry",
        "BoxObject",
        "Camera",
        "CameraControl",
        "Canvas",
        "ClickSelectObjects",
        "Component",
        "Configs",
        "Debug",
        "DepthOfField",
        "DirLight",
        "Effect",
        "Fly",
        "Geometry",
        "HighlightEffect",
        "Input",
        "IsolateEffect",
        "KeyboardAxisCamera",
        "KeyboardOrbitCamera",
        "KeyboardPanCamera",
        "KeyboardZoomCamera",
        "Label",
        "LabelEffect",
        "Light",
        "MouseOrbitCamera",
        "MousePanCamera",
        "MouseZoomCamera",
        "Object",
        "ObjectSet",
        "PointLight",
        "Position",
        "RandomObjects",
        "TeapotGeometry",
        "TeapotObject",
        "XRayEffect",
        "math"
    ],
    "modules": [
        "BIMSURFER",
        "animate",
        "camera",
        "control",
        "debug",
        "effect",
        "geometry",
        "input"
    ],
    "allModules": [
        {
            "displayName": "animate",
            "name": "animate",
            "description": "**Fly** flys a {{#crossLink \"Camera\"}}{{/crossLink}}\n## Overview\n## Example\nTODO\n````javascript\n TODO\n ````"
        },
        {
            "displayName": "BIMSURFER",
            "name": "BIMSURFER",
            "description": "The BIMSURFER namespace."
        },
        {
            "displayName": "camera",
            "name": "camera",
            "description": "A **Camera** defines a viewpoint within a {{#crossLink \"Viewer\"}}Viewer{{/crossLink}}.\n\n## Overview\n\n<ul>\n<li>You can have an unlimited number of Cameras in a {{#crossLink \"Viewer\"}}{{/crossLink}}.</li>\n<li>At any instant, the Camera we're looking through is the one whose {{#crossLink \"Camera/active:property\"}}active{{/crossLink}} property is true.</li>\n<li>Cameras can be controlled with controls such as {{#crossLink \"CameraControl\"}}{{/crossLink}}, {{#crossLink \"KeyboardAxisCamera\"}}{{/crossLink}},\n{{#crossLink \"KeyboardOrbitCamera\"}}{{/crossLink}}, {{#crossLink \"KeyboardPanCamera\"}}{{/crossLink}}, {{#crossLink \"KeyboardZoomCamera\"}}{{/crossLink}},\n{{#crossLink \"MouseOrbitCamera\"}}{{/crossLink}}, {{#crossLink \"MousePanCamera\"}}{{/crossLink}} and {{#crossLink \"MouseZoomCamera\"}}{{/crossLink}}.</li>\n</ul>\n\n## Example\n\nIn this example we define multiple Cameras looking at a {{#crossLink \"TeapotObject\"}}{{/crossLink}}, then periodically switch between the Cameras.\n\n<iframe style=\"width: 600px; height: 400px\" src=\"../../examples/camera_Camera_multiple.html\"></iframe>\n\n````Javascript\n// Create a Viewer\nvar viewer = new BIMSURFER.Viewer({ element: \"myDiv\" });\n\n// Create an object\nvar box = new BIMSURFER.TeapotObject(viewer);\n\n// Create some Cameras\nvar cameras = [\n\n   new BIMSURFER.Camera(viewer, {\n       eye: [5, 5, 5],\n       active: false\n   }),\n\n   new BIMSURFER.Camera(viewer, {\n       eye: [-5, 5, 5],\n       active: false\n   }),\n\n   new BIMSURFER.Camera(viewer, {\n       eye: [5, -5, 5],\n       active: false\n   }),\n\n   new BIMSURFER.Camera(viewer, {\n       eye: [5, 5, -5],\n       active: false\n   }),\n\n   new BIMSURFER.Camera(viewer, {\n       eye: [-5, -5, 5],\n       active: false\n   })\n];\n\n// Periodically switch between the Cameras\n\nvar i = -1;\nvar last = -1;\n\nsetInterval(function () {\n\n       if (last > -1) {\n           cameras[last].active = false\n       }\n\n       i = (i + 1) % (cameras.length - 1);\n\n       cameras[i].active = true;\n\n       last = i;\n\n   }, 1000);\n````"
        },
        {
            "displayName": "control",
            "name": "control",
            "description": "A **CameraControl** allows you to pan, rotate and zoom a {{#crossLink \"Camera\"}}{{/crossLink}} using the mouse and keyboard,\nas well as switch it between preset left, right, anterior, posterior, superior and inferior views.\n\n## Overview\n\n<ul>\n<li>You can have multiple CameraControls within the same {{#crossLink \"Viewer\"}}{{/crossLink}}.</li>\n<li>Multiple CameraControls can drive the same {{#crossLink \"Camera\"}}{{/crossLink}}, or can each drive their own separate {{#crossLink \"Camera\"}}Cameras{{/crossLink}}.</li>\n<li>At any instant, the CameraControl we're driving is the one whose {{#crossLink \"Camera/active:property\"}}active{{/crossLink}} property is true.</li>\n<li>You can switch a CameraControl to a different {{#crossLink \"Camera\"}}{{/crossLink}} at any time.</li>\n</ul>\n\n## Example\n\n#### Controlling a Camera\n\nIn this example we're viewing a {{#crossLink \"TeapotObject\"}}{{/crossLink}} with a {{#crossLink \"Camera\"}}{{/crossLink}} that's controlled by a CameraControl.\n\n<iframe style=\"width: 600px; height: 400px\" src=\"../../examples/control_CameraControl.html\"></iframe>\n\n````Javascript\nvar viewer = new BIMSURFER.Viewer({ element: \"myDiv\" });\n\nvar camera = new BIMSURFER.Camera(viewer, {\n       eye: [5, 5, -5]\n   });\n\nvar cameraControl = new BIMSURFER.CameraControl(viewer, {\n       camera: camera\n   });\n\nvar teapot = new BIMSURFER.TeapotObject(viewer);\n\n\n````"
        },
        {
            "displayName": "debug",
            "name": "debug",
            "description": "var debug = viewer.debug;\n\n debug.color = [1,0,0];\n debug.addPoint(1,2,3);\n debug.addPoint(2,3,4);\n debug.line();"
        },
        {
            "displayName": "effect",
            "name": "effect",
            "description": "An **Effect** is a the base class for visual effects that are applied to {{#crossLink \"ObjectSet\"}}ObjectSets{{/crossLink}}.\n\n## Overview\n\n<ul>\n<li>Effect is subclassed by {{#crossLink \"HighlightEffect\"}}{{/crossLink}}, {{#crossLink \"IsolateEffect\"}}{{/crossLink}} and {{#crossLink \"XRayEffect\"}}{{/crossLink}}.</li>\n<li>Multiple Effects can share the same {{#crossLink \"ObjectSet\"}}{{/crossLink}} if required.</li>\n<li>An Effect will provide its own default {{#crossLink \"ObjectSet\"}}{{/crossLink}} when you don't configure it with one.</li>\n</ul>"
        },
        {
            "displayName": "geometry",
            "name": "geometry",
            "description": "An **BoxGeometry** is a box-shaped {{#crossLink \"Geometry\"}}{{/crossLink}}.\n\n## Overview\n\nTODO\n\n## Example\n\n<iframe style=\"width: 600px; height: 400px\" src=\"../../examples/geometry_BoxGeometry.html\"></iframe>\n\n````javascript\n// Create a Viewer\nvar viewer = new BIMSURFER.Viewer({ element: \"myDiv\" });\n\n// Create a Camera\nvar camera = new BIMSURFER.Camera(viewer, {\n   eye: [0, 0, -10]\n});\n\n// Create a CameraControl to interact with the Camera\nvar cameraControl = new BIMSURFER.CameraControl(viewer, {\n   camera: camera\n});\n\n// Create a BoxGeometry\nvar boxGeometry = new BIMSURFER.BoxGeometry(viewer);\n\n// Create an Object that uses our BoxGeometry\n// Note that an Object can have multiple Geometries\n\nnew BIMSURFER.Object(viewer, {\n   id: \"foo\",\n   type: \"IfcWall\",\n   geometries: [ boxGeometry ]\n});\n````"
        },
        {
            "displayName": "input",
            "name": "input",
            "description": "Publishes key and mouse events that occur on the parent {{#crossLink \"Viewer\"}}Viewer{{/crossLink}}'s {{#crossLink \"Canvas\"}}Canvas{{/crossLink}}.\n\n## Overview\n\n<ul>\n<li>Each {{#crossLink \"Viewer\"}}{{/crossLink}} provides an Input on itself as a read-only property.</li>\n</ul>\n\n## Example\n\nIn this example, we're subscribing to some mouse and key events that will occur on\na {{#crossLink \"Viewer\"}}Viewer's{{/crossLink}} {{#crossLink \"Canvas\"}}Canvas{{/crossLink}}.\n\n````javascript\nvar viewer = new BIMSURFER.Viewer(...);\n\nvar input = viewer.input;\n\n// We'll save a handle to this subscription\n// to show how to unsubscribe, further down\nvar handle = input.on(\"mousedown\", function(coords) {\n      console.log(\"Mouse down at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"mouseup\", function(coords) {\n      console.log(\"Mouse up at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"mouseclicked\", function(coords) {\n     console.log(\"Mouse clicked at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"dblclick\", function(coords) {\n      console.log(\"Double-click at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"keydown\", function(keyCode) {\n       switch (keyCode) {\n\n           case this.KEY_A:\n              console.log(\"The 'A' key is down\");\n              break;\n\n           case this.KEY_B:\n              console.log(\"The 'B' key is down\");\n              break;\n\n           case this.KEY_C:\n              console.log(\"The 'C' key is down\");\n              break;\n\n           default:\n              console.log(\"Some other key is down\");\n      }\n    });\n\ninput.on(\"keyup\", function(keyCode) {\n       switch (keyCode) {\n\n           case this.KEY_A:\n              console.log(\"The 'A' key is up\");\n              break;\n\n           case this.KEY_B:\n              console.log(\"The 'B' key is up\");\n              break;\n\n           case this.KEY_C:\n              console.log(\"The 'C' key is up\");\n              break;\n\n           default:\n              console.log(\"Some other key is up\");\n       }\n    });\n\n// TODO: ALT and CTRL keys etc\n````\n\n### Unsubscribing from Events\n\nIn the snippet above, we saved a handle to one of our event subscriptions.\n\nWe can then use that handle to unsubscribe again, like this:\n\n````javascript\ninput.off(handle);\n````"
        }
    ]
} };
});