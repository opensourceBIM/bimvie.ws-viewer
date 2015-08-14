YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AmbientLight",
        "Anaglyph",
        "BIMSURFER.constants",
        "BoxGeometry",
        "BoxObject",
        "Camera",
        "CameraControl",
        "CameraFlyAnimation",
        "Canvas",
        "ClickSelectObjects",
        "Component",
        "Configs",
        "Cursor",
        "DepthOfField",
        "DesaturateEffect",
        "DirLight",
        "Download",
        "Effect",
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
        "MousePickObject",
        "MouseZoomCamera",
        "Object",
        "ObjectSet",
        "PointLight",
        "Position",
        "RandomObjects",
        "Task",
        "Tasks",
        "TeapotGeometry",
        "TeapotObject",
        "Viewer",
        "XRayEffect",
        "math"
    ],
    "modules": [
        "BIMSURFER",
        "animation",
        "camera",
        "canvas",
        "configs",
        "effect",
        "effects",
        "geometry",
        "input",
        "labelling",
        "lighting",
        "loading",
        "math",
        "objects",
        "reporting"
    ],
    "allModules": [
        {
            "displayName": "animation",
            "name": "animation",
            "description": "Animation components."
        },
        {
            "displayName": "BIMSURFER",
            "name": "BIMSURFER",
            "description": "**Component** is the base class for all components within a {{#crossLink \"Viewer\"}}{{/crossLink}}.\n<hr>\n*Contents*\n<Ul>\n <li><a href=\"#ids\">Component IDs</a></li>\n <li><a href=\"#componentProps\">Properties</a></li>\n <li><a href=\"#metadata\">Metadata</a></li>\n <li><a href=\"#logging\">Logging</a></li>\n <li><a href=\"#destruction\">Destruction</a></li>\n </ul>\n<hr>\n## <a name=\"ids\">Component IDs</a>\nEvery Component has an ID that's unique within the parent {{#crossLink \"Viewer\"}}{{/crossLink}}. the {{#crossLink \"Viewer\"}}{{/crossLink}} generates\n the IDs automatically by default, however you can also specify them yourself. In the example below, we're creating a\n viewer comprised of {{#crossLink \"Viewer\"}}{{/crossLink}}, {{#crossLink \"Material\"}}{{/crossLink}}, {{#crossLink \"Geometry\"}}{{/crossLink}} and\n {{#crossLink \"GameObject\"}}{{/crossLink}} components, while letting BIMSURFER generate its own ID for\n the {{#crossLink \"Geometry\"}}{{/crossLink}}:\n````javascript\n````\n## <a name=\"componentProps\">Properties</a>\nAlmost every property in a Viewer Component fires a change event when you update it. For example, we can subscribe\n to the {{#crossLink \"Material/diffuse:event\"}}{{/crossLink}} event that a\n {{#crossLink \"Material\"}}{{/crossLink}} fires when its {{#crossLink \"Material/diffuse:property\"}}{{/crossLink}}\n property is updated, like so:\n````javascript\n // Bind a change callback to a property\n var handle = material.on(\"diffuse\", function(diffuse) {\n    console.log(\"Material diffuse color has changed to: [\" + diffuse[0] + \", \" + diffuse[1] + \",\" + diffuse[2] + \"]\");\n});\n// Change the property value, which fires the callback\n material.diffuse = [ 0.0, 0.5, 0.5 ];\n// Unsubscribe from the property change event\n material.off(handle);\n ````\nWe can also subscribe to changes in the way components are attached to each other, since components are properties\n of other components. For example, we can subscribe to the '{{#crossLink \"GameObject/material:event\"}}{{/crossLink}}' event that a\n {{#crossLink \"GameObject\"}}GameObject{{/crossLink}} fires when its {{#crossLink \"GameObject/material:property\"}}{{/crossLink}}\n property is set to a different {{#crossLink \"Material\"}}Material{{/crossLink}}:\n```` javascript\n // Bind a change callback to the GameObject's Material\n object1.on(\"material\", function(material) {\n    console.log(\"GameObject's Material has changed to: \" + material.id);\n});\n// Now replace that Material with another\n object1.material = new BIMSURFER.Material({\n    id: \"myOtherMaterial\",\n    diffuse: [ 0.3, 0.3, 0.6 ]\n    //..\n});\n ````\n## <a name=\"metadata\">Metadata</a>\nYou can set optional **metadata** on your Components, which can be anything you like. These are intended\n to help manage your components within your application code or content pipeline. You could use metadata to attach\n authoring or version information, like this:\n````javascript\n // Viewer with authoring metadata\n var viewer = new BIMSURFER.Viewer({\n    id: \"myViewer\",\n    metadata: {\n        title: \"My awesome 3D viewer\",\n        author: \"@xeolabs\",\n date: \"February 13 2015\"\n }\n });\n// Material with descriptive metadata\n var material = new BIMSURFER.Material(viewer, {\n    id: \"myMaterial\",\n    diffuse: [1, 0, 0],\n    metadata: {\n        description: \"Bright red color with no textures\",\n        version: \"0.1\",\n        foo: \"bar\"\n    }\n});\n ````\nAs with all properties, you can subscribe and change the metadata like this:\n````javascript\n // Subscribe to changes to the Material's metadata\n material.on(\"metadata\", function(value) {\n    console.log(\"Metadata changed: \" + JSON.stringify(value));\n});\n// Change the Material's metadata, firing our change handler\n material.metadata = {\n    description: \"Bright red color with no textures\",\n    version: \"0.2\",\n    foo: \"baz\"\n};\n ````\n## <a name=\"logging\">Logging</a>\nComponents have methods to log ID-prefixed messages to the JavaScript console:\n````javascript\n material.log(\"Everything is fine, situation normal.\");\n material.warn(\"Wait, whats that red light?\");\n material.error(\"Aw, snap!\");\n ````\nThe logged messages will look like this in the console:\n````text\n [LOG]   myMaterial: Everything is fine, situation normal.\n [WARN]  myMaterial: Wait, whats that red light..\n [ERROR] myMaterial: Aw, snap!\n ````\n## <a name=\"destruction\">Destruction</a>\nGet notification of destruction directly on the Components:\n````javascript\n material.on(\"destroyed\", function() {\n    this.log(\"Component was destroyed: \" + this.id);\n});\n ````\nOr get notification of destruction of any Component within its {{#crossLink \"Viewer\"}}{{/crossLink}}, indiscriminately:\n````javascript\n viewer.on(\"componentDestroyed\", function(component) {\n    this.log(\"Component was destroyed: \" + component.id);\n});\n ````\nThen destroy a component like this:\n````javascript\n material.destroy();\n ````\nOther Components that are linked to it will fall back on a default of some sort. For example, any\n {{#crossLink \"GameObject\"}}GameObjects{{/crossLink}} that were linked to our {{#crossLink \"Material\"}}{{/crossLink}}\n will then automatically link to the {{#crossLink \"Viewer\"}}Viewer's{{/crossLink}} default {{#crossLink \"Viewer/material:property\"}}{{/crossLink}}."
        },
        {
            "displayName": "camera",
            "name": "camera",
            "description": "Camera components."
        },
        {
            "displayName": "canvas",
            "name": "canvas",
            "description": "Core viewer components."
        },
        {
            "displayName": "configs",
            "name": "configs",
            "description": "Viewer configuration management."
        },
        {
            "displayName": "effect",
            "name": "effect",
            "description": "A **DesaturateEffect** is an {{#crossLink \"Effect\"}}{{/crossLink}} that desaturates the colours of\n{{#crossLink \"Object\"}}Objects{{/crossLink}} within an {{#crossLink \"ObjectSet\"}}{{/crossLink}}.\n\n## Overview\n\nTODO\n\n## Example\n\n#### Desaturating an ObjectSet\n\nIn this example we create four {{#crossLink \"Object\"}}Objects{{/crossLink}}, then add two of them to an {{#crossLink \"ObjectSet\"}}{{/crossLink}}.\n<br> Then we apply a {{#crossLink \"DesaturateEffect\"}}{{/crossLink}} to the {{#crossLink \"ObjectSet\"}}{{/crossLink}}, causing the colour of\nit's {{#crossLink \"Object\"}}Objects{{/crossLink}} to become desaturated while the other two {{#crossLink \"Object\"}}Objects{{/crossLink}} remain normal.\n\n<iframe style=\"width: 600px; height: 400px\" src=\"../../examples/effect_DesaturateEffect.html\"></iframe>\n\n````javascript\n\n// Create a Viewer\nvar viewer = new BIMSURFER.Viewer({ element: \"myDiv\" });\n\n// Create a Camera\nvar camera = new BIMSURFER.Camera(viewer, {\n       eye: [30, 20, -30]\n   });\n\n// Spin the camera\nviewer.on(\"tick\", function () {\n       camera.rotateEyeY(0.2);\n   });\n\n// Create a CameraControl so we can move the Camera\nvar cameraControl = new BIMSURFER.CameraControl(viewer, {\n       camera: camera\n   });\n\n// Create an AmbientLight\nvar ambientLight = new BIMSURFER.AmbientLight(viewer, {\n       color: [0.7, 0.7, 0.7]\n   });\n\n// Create a DirLight\nvar dirLight1 = new BIMSURFER.DirLight(viewer, {\n       color: [0.6, 0.9, 0.9],\n       dir: [1.0, 0.0, 0.0],\n       space: \"view\"\n   });\n\n// Create a DirLight\nvar dirLight2 = new BIMSURFER.DirLight(viewer, {\n       color: [0.6, 0.9, 0.9],\n       dir: [-0.5, 0.0, -1.0],\n       space: \"view\"\n   });\n\n// Create a BoxGeometry\nvar geometry = new BIMSURFER.BoxGeometry(viewer, {\n       id: \"myGeometry\"\n   });\n\n// Create some Objects\n// Share the BoxGeometry among them\n\nvar object1 = new BIMSURFER.Object(viewer, {\n       type: \"IfcRoof\",\n       geometries: [ geometry ],\n       matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])\n   });\n\nvar object2 = new BIMSURFER.Object(viewer, {\n       type: \"IfcDistributionFlowElement\",\n       geometries: [ geometry ],\n       matrix: BIMSURFER.math.translationMat4v([8, 0, -8])\n   });\n\nvar object3 = new BIMSURFER.Object(viewer, {\n       type: \"IfcRailing\",\n       geometries: [ geometry ],\n       matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])\n   });\n\nvar object4 = new BIMSURFER.Object(viewer, {\n       type: \"IfcRoof\",\n       geometries: [ geometry ],\n       matrix: BIMSURFER.math.translationMat4v([8, 0, 8])\n   });\n\n// Create an ObjectSet that initially contains one of our Objects\n\nvar objectSet = new BIMSURFER.ObjectSet(viewer, {\n       objects: [object1 ]\n   });\n\n// Apply a Desaturate effect to the ObjectSet, which causes the\n// Object in the ObjectSet to become desaturated.\n\nvar desaturate = new BIMSURFER.DesaturateEffect(viewer, {\n       objectSet: objectSet\n   });\n\n// Add a second Object to the ObjectSet, causing the Desaturate to now render\n// that Object as desaturated also\n\nobjectSet.addObjects([object3]);\n\n````"
        },
        {
            "displayName": "effects",
            "name": "effects",
            "description": "Rendering effects components."
        },
        {
            "displayName": "geometry",
            "name": "geometry",
            "description": "Geometry components."
        },
        {
            "displayName": "input",
            "name": "input",
            "description": "Components for handling user interaction."
        },
        {
            "displayName": "labelling",
            "name": "labelling",
            "description": "A **Position** is a spatial location within a {{#crossLink \"Viewer\"}}{{/crossLink}}.\n\n## Overview\n\nA Position provides its coordinates in each of BIMSurfer's five coordinate systems:\n\n<ul>\n<li>{{#crossLink \"Position/pos:property\"}}{{/crossLink}} - 3D coordinates within the Position's local Model coordinate system.</li>\n<li>{{#crossLink \"Position/worldPos:property\"}}{{/crossLink}} - 3D coordinates within the Viewer's current World coordinate\nsystem, after transformation by the {{#crossLink \"Position/matrix:property\"}}Position's modelling matrix{{/crossLink}}.</li>\n<li>{{#crossLink \"Position/viewPos:property\"}}{{/crossLink}} - 3D coordinates within the Viewer's current View\ncoordinate system, after transformation by the {{#crossLink \"Viewer/viewMatrix:property\"}}Viewer's view matrix{{/crossLink}}.</li>\n<li>{{#crossLink \"Position/projPos:property\"}}{{/crossLink}} - 3D coordinates within the Viewer's current Projection\ncoordinate system, after transformation by the {{#crossLink \"Viewer/projMatrix:property\"}}Viewer's projection matrix{{/crossLink}}.</li>\n<li>{{#crossLink \"Position/canvasPos:property\"}}{{/crossLink}} - 2D coordinates within the Viewer's current Canvas\ncoordinate system.</li>\n</ul>\n\n## Example\n\n````Javascript\n// Create a Viewer\nvar viewer = new BIMSURFER.Viewer({ element: \"myDiv\" });\n\n// Create a Camera\nvar camera = new BIMSURFER.Camera(viewer, {\n    eye: [20, 20, -20]\n});\n\n// Create a CameraControl to interact with the Camera\nvar cameraControl = new BIMSURFER.CameraControl(viewer, {\n   camera: camera\n});\n\n// Create a Position\nnew BIMSURFER.Position(viewer, {\n   pos: [0,0,0],\n   matrix: BIMSURFER.math.translationMat4v([4, 0,0])\n});\n\n````"
        },
        {
            "displayName": "lighting",
            "name": "lighting",
            "description": "Light source objects."
        },
        {
            "displayName": "loading",
            "name": "loading",
            "description": "Components for loading content."
        },
        {
            "displayName": "math",
            "name": "math",
            "description": "Math utilities."
        },
        {
            "displayName": "objects",
            "name": "objects",
            "description": "Viewer objects and utilities."
        },
        {
            "displayName": "reporting",
            "name": "reporting",
            "description": "Components for reporting viewer activity and statistics."
        }
    ]
} };
});