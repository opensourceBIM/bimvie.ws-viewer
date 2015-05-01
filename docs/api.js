YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AmbientLight",
        "BIMSURFER",
        "BoxGeometry",
        "Camera",
        "Canvas",
        "ClickSelectObjects",
        "Component",
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
        "TeapotGeometry",
        "Viewer",
        "XRayEffect",
        "math"
    ],
    "modules": [
        "BIMSURFER"
    ],
    "allModules": [
        {
            "displayName": "BIMSURFER",
            "name": "BIMSURFER",
            "description": "**Component** is the base class for all components within a {{#crossLink \"Viewer\"}}{{/crossLink}}.\n<hr>\n*Contents*\n<Ul>\n <li><a href=\"#ids\">Component IDs</a></li>\n <li><a href=\"#componentProps\">Properties</a></li>\n <li><a href=\"#metadata\">Metadata</a></li>\n <li><a href=\"#logging\">Logging</a></li>\n <li><a href=\"#destruction\">Destruction</a></li>\n </ul>\n<hr>\n## <a name=\"ids\">Component IDs</a>\nEvery Component has an ID that's unique within the parent {{#crossLink \"Viewer\"}}{{/crossLink}}. BIMViewer generates\n the IDs automatically by default, however you can also specify them yourself. In the example below, we're creating a\n viewer comprised of {{#crossLink \"Viewer\"}}{{/crossLink}}, {{#crossLink \"Material\"}}{{/crossLink}}, {{#crossLink \"Geometry\"}}{{/crossLink}} and\n {{#crossLink \"GameObject\"}}{{/crossLink}} components, while letting xeoEngine generate its own ID for\n the {{#crossLink \"Geometry\"}}{{/crossLink}}:\n````javascript\n // The Viewer is a Component too\n var viewer = new BIMSURFER.Viewer({\n    id: \"myViewer\"\n});\nvar material = new BIMSURFER.Material(viewer, {\n    id: \"myMaterial\"\n});\nvar geometry = new BIMSURFER.Geometry(viewer, {\n    id: \"myGeometry\"\n});\n// Let xeoEngine automatically generated the ID for our GameObject\n var object = new BIMSURFER.GameObject(viewer, {\n    material: material,\n    geometry: geometry\n});\n ````\nWe can then find those components like this:\n````javascript\n // Find the Viewer\n var theViewer = BIMSURFER.viewers[\"myViewer\"];\n// Find the Material\n var theMaterial = theViewer.components[\"myMaterial\"];\n ````\n## <a name=\"componentProps\">Properties</a>\nAlmost every property on a xeoEngine Component fires a change event when you update it. For example, we can subscribe\n to the {{#crossLink \"Material/diffuse:event\"}}{{/crossLink}} event that a\n {{#crossLink \"Material\"}}{{/crossLink}} fires when its {{#crossLink \"Material/diffuse:property\"}}{{/crossLink}}\n property is updated, like so:\n````javascript\n // Bind a change callback to a property\n var handle = material.on(\"diffuse\", function(diffuse) {\n    console.log(\"Material diffuse color has changed to: [\" + diffuse[0] + \", \" + diffuse[1] + \",\" + diffuse[2] + \"]\");\n});\n// Change the property value, which fires the callback\n material.diffuse = [ 0.0, 0.5, 0.5 ];\n// Unsubscribe from the property change event\n material.off(handle);\n ````\nWe can also subscribe to changes in the way components are attached to each other, since components are properties\n of other components. For example, we can subscribe to the '{{#crossLink \"GameObject/material:event\"}}{{/crossLink}}' event that a\n {{#crossLink \"GameObject\"}}GameObject{{/crossLink}} fires when its {{#crossLink \"GameObject/material:property\"}}{{/crossLink}}\n property is set to a different {{#crossLink \"Material\"}}Material{{/crossLink}}:\n```` javascript\n // Bind a change callback to the GameObject's Material\n object1.on(\"material\", function(material) {\n    console.log(\"GameObject's Material has changed to: \" + material.id);\n});\n// Now replace that Material with another\n object1.material = new BIMSURFER.Material({\n    id: \"myOtherMaterial\",\n    diffuse: [ 0.3, 0.3, 0.6 ]\n    //..\n});\n ````\n## <a name=\"metadata\">Metadata</a>\nYou can set optional **metadata** on your Components, which can be anything you like. These are intended\n to help manage your components within your application code or content pipeline. You could use metadata to attach\n authoring or version information, like this:\n````javascript\n // Viewer with authoring metadata\n var viewer = new BIMSURFER.Viewer({\n    id: \"myViewer\",\n    metadata: {\n        title: \"My awesome 3D viewer\",\n        author: \"@xeolabs\",\n date: \"February 13 2015\"\n }\n });\n// Material with descriptive metadata\n var material = new BIMSURFER.Material(viewer, {\n    id: \"myMaterial\",\n    diffuse: [1, 0, 0],\n    metadata: {\n        description: \"Bright red color with no textures\",\n        version: \"0.1\",\n        foo: \"bar\"\n    }\n});\n ````\nAs with all properties, you can subscribe and change the metadata like this:\n````javascript\n // Subscribe to changes to the Material's metadata\n material.on(\"metadata\", function(value) {\n    console.log(\"Metadata changed: \" + JSON.stringify(value));\n});\n// Change the Material's metadata, firing our change handler\n material.metadata = {\n    description: \"Bright red color with no textures\",\n    version: \"0.2\",\n    foo: \"baz\"\n};\n ````\n## <a name=\"logging\">Logging</a>\nComponents have methods to log ID-prefixed messages to the JavaScript console:\n````javascript\n material.log(\"Everything is fine, situation normal.\");\n material.warn(\"Wait, whats that red light?\");\n material.error(\"Aw, snap!\");\n ````\nThe logged messages will look like this in the console:\n````text\n [LOG]   myMaterial: Everything is fine, situation normal.\n [WARN]  myMaterial: Wait, whats that red light..\n [ERROR] myMaterial: Aw, snap!\n ````\n## <a name=\"destruction\">Destruction</a>\nGet notification of destruction directly on the Components:\n````javascript\n material.on(\"destroyed\", function() {\n    this.log(\"Component was destroyed: \" + this.id);\n});\n ````\nOr get notification of destruction of any Component within its {{#crossLink \"Viewer\"}}{{/crossLink}}, indiscriminately:\n````javascript\n viewer.on(\"componentDestroyed\", function(component) {\n    this.log(\"Component was destroyed: \" + component.id);\n});\n ````\nThen destroy a component like this:\n````javascript\n material.destroy();\n ````\nOther Components that are linked to it will fall back on a default of some sort. For example, any\n {{#crossLink \"GameObject\"}}GameObjects{{/crossLink}} that were linked to our {{#crossLink \"Material\"}}{{/crossLink}}\n will then automatically link to the {{#crossLink \"Viewer\"}}Viewer's{{/crossLink}} default {{#crossLink \"Viewer/material:property\"}}{{/crossLink}}."
        }
    ]
} };
});