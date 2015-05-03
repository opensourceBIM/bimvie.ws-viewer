YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AmbientLight",
        "BIMSURFER",
        "BoxGeometry",
        "BoxObject",
        "Camera",
        "CameraControl",
        "Canvas",
        "ClickSelectObjects",
        "Component",
        "Configs",
        "DirLight",
        "Effect",
        "Fly",
        "Geometry",
        "HighlightEffect",
        "Input",
        "IsolateEffect",
        "KeyboardAxisCamera",
        "KeyboardOrbitCamera",
        "KeyboardZoomCamera",
        "Light",
        "MouseOrbitCamera",
        "MousePanCamera",
        "MouseZoomCamera",
        "Object",
        "PointLight",
        "Selection",
        "TeapotGeometry",
        "TeapotObject",
        "Viewer",
        "XRayEffect",
        "math"
    ],
    "modules": [
        "BIMSURFER",
        "animate",
        "camera",
        "control",
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
            "description": "**Component** is the base class for all components within a {{#crossLink \"Viewer\"}}{{/crossLink}}.\n<hr>\n*Contents*\n<Ul>\n <li><a href=\"#ids\">Component IDs</a></li>\n <li><a href=\"#componentProps\">Properties</a></li>\n <li><a href=\"#metadata\">Metadata</a></li>\n <li><a href=\"#logging\">Logging</a></li>\n <li><a href=\"#destruction\">Destruction</a></li>\n </ul>\n<hr>\n## <a name=\"ids\">Component IDs</a>\nEvery Component has an ID that's unique within the parent {{#crossLink \"Viewer\"}}{{/crossLink}}. the {{#crossLink \"Viewer\"}}{{/crossLink}} generates\n the IDs automatically by default, however you can also specify them yourself. In the example below, we're creating a\n viewer comprised of {{#crossLink \"Viewer\"}}{{/crossLink}}, {{#crossLink \"Material\"}}{{/crossLink}}, {{#crossLink \"Geometry\"}}{{/crossLink}} and\n {{#crossLink \"GameObject\"}}{{/crossLink}} components, while letting xeoEngine generate its own ID for\n the {{#crossLink \"Geometry\"}}{{/crossLink}}:\n````javascript\n````\n## <a name=\"componentProps\">Properties</a>\nAlmost every property on a xeoEngine Component fires a change event when you update it. For example, we can subscribe\n to the {{#crossLink \"Material/diffuse:event\"}}{{/crossLink}} event that a\n {{#crossLink \"Material\"}}{{/crossLink}} fires when its {{#crossLink \"Material/diffuse:property\"}}{{/crossLink}}\n property is updated, like so:\n````javascript\n // Bind a change callback to a property\n var handle = material.on(\"diffuse\", function(diffuse) {\n    console.log(\"Material diffuse color has changed to: [\" + diffuse[0] + \", \" + diffuse[1] + \",\" + diffuse[2] + \"]\");\n});\n// Change the property value, which fires the callback\n material.diffuse = [ 0.0, 0.5, 0.5 ];\n// Unsubscribe from the property change event\n material.off(handle);\n ````\nWe can also subscribe to changes in the way components are attached to each other, since components are properties\n of other components. For example, we can subscribe to the '{{#crossLink \"GameObject/material:event\"}}{{/crossLink}}' event that a\n {{#crossLink \"GameObject\"}}GameObject{{/crossLink}} fires when its {{#crossLink \"GameObject/material:property\"}}{{/crossLink}}\n property is set to a different {{#crossLink \"Material\"}}Material{{/crossLink}}:\n```` javascript\n // Bind a change callback to the GameObject's Material\n object1.on(\"material\", function(material) {\n    console.log(\"GameObject's Material has changed to: \" + material.id);\n});\n// Now replace that Material with another\n object1.material = new BIMSURFER.Material({\n    id: \"myOtherMaterial\",\n    diffuse: [ 0.3, 0.3, 0.6 ]\n    //..\n});\n ````\n## <a name=\"metadata\">Metadata</a>\nYou can set optional **metadata** on your Components, which can be anything you like. These are intended\n to help manage your components within your application code or content pipeline. You could use metadata to attach\n authoring or version information, like this:\n````javascript\n // Viewer with authoring metadata\n var viewer = new BIMSURFER.Viewer({\n    id: \"myViewer\",\n    metadata: {\n        title: \"My awesome 3D viewer\",\n        author: \"@xeolabs\",\n date: \"February 13 2015\"\n }\n });\n// Material with descriptive metadata\n var material = new BIMSURFER.Material(viewer, {\n    id: \"myMaterial\",\n    diffuse: [1, 0, 0],\n    metadata: {\n        description: \"Bright red color with no textures\",\n        version: \"0.1\",\n        foo: \"bar\"\n    }\n});\n ````\nAs with all properties, you can subscribe and change the metadata like this:\n````javascript\n // Subscribe to changes to the Material's metadata\n material.on(\"metadata\", function(value) {\n    console.log(\"Metadata changed: \" + JSON.stringify(value));\n});\n// Change the Material's metadata, firing our change handler\n material.metadata = {\n    description: \"Bright red color with no textures\",\n    version: \"0.2\",\n    foo: \"baz\"\n};\n ````\n## <a name=\"logging\">Logging</a>\nComponents have methods to log ID-prefixed messages to the JavaScript console:\n````javascript\n material.log(\"Everything is fine, situation normal.\");\n material.warn(\"Wait, whats that red light?\");\n material.error(\"Aw, snap!\");\n ````\nThe logged messages will look like this in the console:\n````text\n [LOG]   myMaterial: Everything is fine, situation normal.\n [WARN]  myMaterial: Wait, whats that red light..\n [ERROR] myMaterial: Aw, snap!\n ````\n## <a name=\"destruction\">Destruction</a>\nGet notification of destruction directly on the Components:\n````javascript\n material.on(\"destroyed\", function() {\n    this.log(\"Component was destroyed: \" + this.id);\n});\n ````\nOr get notification of destruction of any Component within its {{#crossLink \"Viewer\"}}{{/crossLink}}, indiscriminately:\n````javascript\n viewer.on(\"componentDestroyed\", function(component) {\n    this.log(\"Component was destroyed: \" + component.id);\n});\n ````\nThen destroy a component like this:\n````javascript\n material.destroy();\n ````\nOther Components that are linked to it will fall back on a default of some sort. For example, any\n {{#crossLink \"GameObject\"}}GameObjects{{/crossLink}} that were linked to our {{#crossLink \"Material\"}}{{/crossLink}}\n will then automatically link to the {{#crossLink \"Viewer\"}}Viewer's{{/crossLink}} default {{#crossLink \"Viewer/material:property\"}}{{/crossLink}}."
        },
        {
            "displayName": "camera",
            "name": "camera",
            "description": "A **Camera** defines a viewpoint within a {{#crossLink \"Viewer\"}}Viewer{{/crossLink}}.\n\n## Overview\n\n<ul>\n<li>You can have an unlimited number of Cameras in a {{#crossLink \"Viewer\"}}GameObjects{{/crossLink}}.</li>\n<li>At any instant, the Camera we're looking through is the one whose {{#crossLink \"Camera/active:property\"}}active{{/crossLink}} property is true.</li>\n</ul>\n\n## Example\n\nIn this example we have a {{#crossLink \"Viewer\"}}{{/crossLink}} with a\nCamera, {{#crossLink \"CameraControl\"}}{{/crossLink}} and a {{#crossLink \"TeapotObject\"}}{{/crossLink}}.\n\n````Javascript\n\nvar viewer = new BIMSURFER.Viewer(null, \"myDiv\", {}, false);\n\nvar camera = new BIMSURFER.Camera(viewer, {\n       eye: [0, 0, -10]\n   });\n\nvar cameraControl = new BIMSURFER.CameraControl(viewer, {\n       camera: camera\n   });\n\nvar teapot = new BIMSURFER.TeapotObject(viewer);\n\n````"
        },
        {
            "displayName": "control",
            "name": "control",
            "description": "A **CameraControl** allows you to control a {{#crossLink \"Camera\"}}{{/crossLink}} with mouse and keyboard.\n\n## Overview\n\n<ul>\n<li>You can have an unlimited number of Cameras in a {{#crossLink \"Viewer\"}}GameObjects{{/crossLink}}.</li>\n<li>At any instant, the Camera we're looking through is the one whose {{#crossLink \"Camera/active:property\"}}active{{/crossLink}} property is true.</li>\n</ul>\n\n## Example\n\nIn this example we have a {{#crossLink \"Viewer\"}}{{/crossLink}} with a\n{{#crossLink \"Camera\"}}{{/crossLink}} that's controlled by a CameraControl.\n\n````Javascript\n\nvar viewer = new BIMSURFER.Viewer(null, \"myDiv\", {}, false);\n\nvar camera = new BIMSURFER.Camera(viewer, {\n       eye: [0, 0, -10]\n   });\n\nvar cameraControl = new BIMSURFER.CameraControl(viewer, {\n       camera: camera\n   });\n\nvar teapot = new BIMSURFER.TeapotObject(viewer);\n\n````"
        },
        {
            "displayName": "effect",
            "name": "effect",
            "description": "TODO\n\n## Overview\n\nTODO\n\n## Example\n\nTODO"
        },
        {
            "displayName": "geometry",
            "name": "geometry",
            "description": "TODO\n\n## Overview\n\nTODO\n\n## Example\n\nTODO"
        },
        {
            "displayName": "input",
            "name": "input",
            "description": "Publishes key and mouse events that occur on the parent {{#crossLink \"Viewer\"}}Viewer{{/crossLink}}'s {{#crossLink \"Canvas\"}}Canvas{{/crossLink}}.\n\n## Overview\n\n<ul>\n<li>Each {{#crossLink \"Viewer\"}}{{/crossLink}} provides an Input on itself as a read-only property.</li>\n</ul>\n\n## Example\n\nIn this example, we're subscribing to some mouse and key events that will occur on\na {{#crossLink \"Viewer\"}}Viewer's{{/crossLink}} {{#crossLink \"Canvas\"}}Canvas{{/crossLink}}.\n\n````javascript\nvar viewer = new BIMSURFER.Viewer(...);\n\nvar input = viewer.input;\n\n// We'll save a handle to this subscription\n// to show how to unsubscribe, further down\nvar handle = input.on(\"mousedown\", function(coords) {\n      console.log(\"Mouse down at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"mouseup\", function(coords) {\n      console.log(\"Mouse up at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"mouseclicked\", function(coords) {\n     console.log(\"Mouse clicked at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"dblclick\", function(coords) {\n      console.log(\"Double-click at: x=\" + coords[0] + \", y=\" + coords[1]);\n});\n\ninput.on(\"keydown\", function(keyCode) {\n       switch (keyCode) {\n\n           case this.KEY_A:\n              console.log(\"The 'A' key is down\");\n              break;\n\n           case this.KEY_B:\n              console.log(\"The 'B' key is down\");\n              break;\n\n           case this.KEY_C:\n              console.log(\"The 'C' key is down\");\n              break;\n\n           default:\n              console.log(\"Some other key is down\");\n      }\n    });\n\ninput.on(\"keyup\", function(keyCode) {\n       switch (keyCode) {\n\n           case this.KEY_A:\n              console.log(\"The 'A' key is up\");\n              break;\n\n           case this.KEY_B:\n              console.log(\"The 'B' key is up\");\n              break;\n\n           case this.KEY_C:\n              console.log(\"The 'C' key is up\");\n              break;\n\n           default:\n              console.log(\"Some other key is up\");\n       }\n    });\n\n// TODO: ALT and CTRL keys etc\n````\n\n### Unsubscribing from Events\n\nIn the snippet above, we saved a handle to one of our event subscriptions.\n\nWe can then use that handle to unsubscribe again, like this:\n\n````javascript\ninput.off(handle);\n````"
        }
    ]
} };
});