/*global defineSuite*/
defineSuite([
        'Scene/Cesium3DTileBatchTable',
        'Core/Cartesian2',
        'Core/Cartesian3',
        'Core/Cartesian4',
        'Core/Color',
        'Core/HeadingPitchRange',
        'Core/Matrix2',
        'Core/Matrix3',
        'Core/Matrix4',
        'Renderer/ContextLimits',
        'Specs/Cesium3DTilesTester',
        'Specs/createScene'
    ], function(
        Cesium3DTileBatchTable,
        Cartesian2,
        Cartesian3,
        Cartesian4,
        Color,
        HeadingPitchRange,
        Matrix2,
        Matrix3,
        Matrix4,
        ContextLimits,
        Cesium3DTilesTester,
        createScene) {
    'use strict';

    var scene;
    var centerLongitude = -1.31968;
    var centerLatitude = 0.698874;

    var withBatchTableUrl = './Data/Cesium3DTiles/Batched/BatchedWithBatchTable/';
    var withoutBatchTableUrl = './Data/Cesium3DTiles/Batched/BatchedWithoutBatchTable/';
    var batchLengthZeroUrl = './Data/Cesium3DTiles/Batched/BatchedNoBuildings/';

    var result = new Color();

    var mockContent = {
        getFeature : function(batchId) {
            return {};
        }
    };

    beforeAll(function() {
        scene = createScene();

        // One building in each data set is always located in the center, so point the camera there
        var center = Cartesian3.fromRadians(centerLongitude, centerLatitude, 5.0);
        scene.camera.lookAt(center, new HeadingPitchRange(0.0, -1.57, 10.0));
    });

    afterAll(function() {
        scene.destroyForSpecs();
    });

    afterEach(function() {
        scene.primitives.removeAll();
    });

    function expectRender(tileset) {
        tileset.show = false;
        expect(scene.renderForSpecs()).toEqual([0, 0, 0, 255]);
        tileset.show = true;
        var pixelColor = scene.renderForSpecs();
        expect(pixelColor).not.toEqual([0, 0, 0, 255]);
        return pixelColor;
    }

    it('setShow throws with invalid batchId', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.setShow();
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.setShow(-1);
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.setShow(2);
        }).toThrowDeveloperError();
    });

    it('setShow throws with undefined value', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.setShow(0);
        }).toThrowDeveloperError();
    });

    it('setShow', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);

        // Batch table resources are undefined by default
        expect(batchTable._batchValues).toBeUndefined();
        expect(batchTable._batchTexture).toBeUndefined();

        // Check that batch table resources are still undefined because value is true by default
        batchTable.setShow(0, true);
        batchTable.update(mockContent, scene.frameState);
        expect(batchTable._batchValues).toBeUndefined();
        expect(batchTable._batchTexture).toBeUndefined();
        expect(batchTable.getShow(0)).toEqual(true);

        // Check that batch values are dirty and resources are created when value changes
        batchTable.setShow(0, false);
        expect(batchTable._batchValuesDirty).toEqual(true);
        batchTable.update(mockContent, scene.frameState);
        expect(batchTable._batchValues).toBeDefined();
        expect(batchTable._batchTexture).toBeDefined();
        expect(batchTable._batchValuesDirty).toEqual(false);
        expect(batchTable.getShow(0)).toEqual(false);

        // Check that dirty stays false when value is the same
        batchTable.setShow(0, false);
        expect(batchTable._batchValuesDirty).toEqual(false);
        expect(batchTable.getShow(0)).toEqual(false);
    });

    it('getShow throws with invalid batchId', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.getShow();
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.getShow(-1);
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.getShow(2);
        }).toThrowDeveloperError();
    });

    it('getShow', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        // Show is true by default
        expect(batchTable.getShow(0)).toEqual(true);
        batchTable.setShow(0, false);
        expect(batchTable.getShow(0)).toEqual(false);
    });
    
    it('setColor throws with invalid batchId', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.setColor();
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.setColor(-1);
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.setColor(2);
        }).toThrowDeveloperError();
    });

    it('setColor throws with undefined value', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.setColor(0);
        }).toThrowDeveloperError();
    });

    it('setColor', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);

        // Batch table resources are undefined by default
        expect(batchTable._batchValues).toBeUndefined();
        expect(batchTable._batchTexture).toBeUndefined();

        // Check that batch table resources are still undefined because value is true by default
        batchTable.setColor(0, Color.WHITE);
        batchTable.update(mockContent, scene.frameState);
        expect(batchTable._batchValues).toBeUndefined();
        expect(batchTable._batchTexture).toBeUndefined();
        expect(batchTable.getColor(0, result)).toEqual(Color.WHITE);

        // Check that batch values are dirty and resources are created when value changes
        batchTable.setColor(0, Color.YELLOW);
        expect(batchTable._batchValuesDirty).toEqual(true);
        batchTable.update(mockContent, scene.frameState);
        expect(batchTable._batchValues).toBeDefined();
        expect(batchTable._batchTexture).toBeDefined();
        expect(batchTable._batchValuesDirty).toEqual(false);
        expect(batchTable.getColor(0, result)).toEqual(Color.YELLOW);

        // Check that dirty stays false when value is the same
        batchTable.setColor(0, Color.YELLOW);
        expect(batchTable._batchValuesDirty).toEqual(false);
        expect(batchTable.getColor(0, result)).toEqual(Color.YELLOW);
    });

    it('setAllColor throws with undefined value', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.setAllColor();
        }).toThrowDeveloperError();
    });

    it('setAllColor', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 2);
        batchTable.setAllColor(Color.YELLOW);
        expect(batchTable.getColor(0, result)).toEqual(Color.YELLOW);
        expect(batchTable.getColor(1, result)).toEqual(Color.YELLOW);
    });

    it('getColor throws with invalid batchId', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.getColor();
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.getColor(-1);
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.getColor(2);
        }).toThrowDeveloperError();
    });

    it('getColor throws with undefined result', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.getColor(0);
        }).toThrowDeveloperError();
    });

    it('getColor', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        // Color is true by default
        expect(batchTable.getColor(0, result)).toEqual(Color.WHITE);
        batchTable.setColor(0, Color.YELLOW);
        expect(batchTable.getColor(0, result)).toEqual(Color.YELLOW);
    });

    it('hasProperty throws with undefined name', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.hasProperty();
        }).toThrowDeveloperError();
    });

    it('hasProperty', function() {
        var batchTableJson = {
            height: [0.0]
        };
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1, batchTableJson);
        expect(batchTable.hasProperty('height')).toEqual(true);
        expect(batchTable.hasProperty('id')).toEqual(false);
    });

    it('getPropertyNames', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(batchTable.getPropertyNames()).toEqual([]);

        var batchTableJson = {
            height: [0.0],
            id : [0]
        };
        batchTable = new Cesium3DTileBatchTable(mockContent, 1, batchTableJson);
        expect(batchTable.getPropertyNames()).toEqual(['height', 'id']);
    });

    it('getProperty throws with invalid batchId', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.getProperty();
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.getProperty(-1);
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.getProperty(2);
        }).toThrowDeveloperError();
    });

    it('getProperty throws with undefined name', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.getProperty(0);
        }).toThrowDeveloperError();
    });

    it('getProperty', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(batchTable.getProperty(0, 'height')).toBeUndefined();

        var batchTableJson = {
            height: [1.0]
        };
        batchTable = new Cesium3DTileBatchTable(mockContent, 1, batchTableJson);
        expect(batchTable.getProperty(0, 'height')).toEqual(1.0);
        expect(batchTable.getProperty(0, 'id')).toBeUndefined();
    });

    it('setProperty throws with invalid batchId', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.setProperty();
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.setProperty(-1);
        }).toThrowDeveloperError();
        expect(function() {
            batchTable.setProperty(2);
        }).toThrowDeveloperError();
    });

    it('setProperty throws with undefined name', function() {
        var batchTable = new Cesium3DTileBatchTable(mockContent, 1);
        expect(function() {
            batchTable.setProperty(0);
        }).toThrowDeveloperError();
    });

    it('setProperty without existing batch table', function() {
        // Check that a batch table is created with a height of 1.0 for the first resource and undefined for the others
        var batchTable = new Cesium3DTileBatchTable(mockContent, 3);
        batchTable.setProperty(0, 'height', 1.0);

        expect(batchTable.batchTableJson.height.length).toEqual(3);
        expect(batchTable.getProperty(0, 'height')).toEqual(1.0);
        expect(batchTable.getProperty(1, 'height')).toBeUndefined();
        expect(batchTable.getProperty(2, 'height')).toBeUndefined();
    });

    it('setProperty with existing batch table', function() {
        var batchTableJson = {
            height : [1.0, 2.0]
        };
        var batchTable = new Cesium3DTileBatchTable(mockContent, 2, batchTableJson);
        batchTable.setProperty(0, 'height', 3.0);

        expect(batchTable.getProperty(0, 'height')).toEqual(3.0);
        expect(batchTable.getProperty(1, 'height')).toEqual(2.0);
    });

    it('setProperty with object value', function() {
        var batchTableJson = {
            info : [{name : 'building0', year : 2000}, {name : 'building1', year : 2001}]
        };
        var batchTable = new Cesium3DTileBatchTable(mockContent, 2, batchTableJson);
        batchTable.setProperty(0, 'info', {name : 'building0_new', year : 2002});

        expect(batchTable.getProperty(0, 'info')).toEqual({name : 'building0_new', year : 2002});
        expect(batchTable.getProperty(1, 'info')).toEqual({name : 'building1', year : 2001});
    });

    it('setProperty with array value', function() {
        var batchTableJson = {
            rooms : [['room1', 'room2'], ['room3', 'room4']]
        };
        var batchTable = new Cesium3DTileBatchTable(mockContent, 2, batchTableJson);
        batchTable.setProperty(0, 'rooms', ['room1_new', 'room2']);

        expect(batchTable.getProperty(0, 'rooms')).toEqual(['room1_new', 'room2']);
        expect(batchTable.getProperty(1, 'rooms')).toEqual(['room3', 'room4']);
    });

    it('throws if the binary property does not specify a componentType', function() {
        var batchTableJson = {
            propertyScalar : {
                byteOffset : 0,
                type : 'SCALAR'
            }
        };
        var batchTableBinary = new Float64Array([0, 1]);
        expect(function() {
            return new Cesium3DTileBatchTable(mockContent, 2, batchTableJson, batchTableBinary);
        }).toThrowDeveloperError();
    });

    it('throws if the binary property does not specify a type', function() {
        var batchTableJson = {
            propertyScalar : {
                byteOffset : 0,
                componentType : 'DOUBLE'
            }
        };
        var batchTableBinary = new Float64Array([0, 1]);
        expect(function() {
            return new Cesium3DTileBatchTable(mockContent, 2, batchTableJson, batchTableBinary);
        }).toThrowDeveloperError();
    });

    it('throws if a binary property exists but there is no batchTableBinary', function() {
        var batchTableJson = {
            propertyScalar : {
                byteOffset : 0,
                componentType : 'DOUBLE',
                type : 'SCALAR'
            }
        };
        expect(function() {
            return new Cesium3DTileBatchTable(mockContent, 2, batchTableJson);
        }).toThrowDeveloperError();
    });

    function concatTypedArrays(arrays) {
        var i;
        var length = arrays.length;

        var byteLength = 0;
        for (i = 0; i < length; ++i) {
            byteLength += arrays[i].byteLength;
        }
        var buffer = new Uint8Array(byteLength);

        var byteOffset = 0;
        for (i = 0; i < length; ++i) {
            var data = new Uint8Array(arrays[i].buffer);
            byteLength = data.length;
            for (var j = 0; j < byteLength; ++j) {
                buffer[byteOffset++] = data[j];
            }
        }
        return buffer;
    }

    it('getProperty and setProperty work for binary properties', function() {
        var propertyScalarBinary = new Float64Array([0, 1]);
        var propertyVec2Binary = new Float32Array([2, 3, 4, 5]);
        var propertyVec3Binary = new Int32Array([6, 7, 8, 9, 10, 11]);
        var propertyVec4Binary = new Uint32Array([12, 13, 14, 15, 16, 17, 18, 19]);
        var propertyMat2Binary = new Int16Array([20, 21, 22, 23, 24, 25, 26, 27]);
        var propertyMat3Binary = new Uint16Array([28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]);
        var propertyMat4Binary = new Uint8Array([46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77]);

        var buffers = [propertyScalarBinary, propertyVec2Binary, propertyVec3Binary, propertyVec4Binary, propertyMat2Binary, propertyMat3Binary, propertyMat4Binary];
        var batchTableBinary = concatTypedArrays(buffers);
        var batchTableJson = {
            propertyScalar : {
                byteOffset : 0,
                componentType : 'DOUBLE',
                type : 'SCALAR'
            },
            propertyVec2 : {
                byteOffset : 16,
                componentType : 'FLOAT',
                type : 'VEC2'
            },
            propertyVec3 : {
                byteOffset : 32,
                componentType : 'INT',
                type : 'VEC3'
            },
            propertyVec4 : {
                byteOffset : 56,
                componentType : 'UNSIGNED_INT',
                type : 'VEC4'
            },
            propertyMat2 : {
                byteOffset : 88,
                componentType : 'SHORT',
                type : 'MAT2'
            },
            propertyMat3 : {
                byteOffset : 104,
                componentType : 'UNSIGNED_SHORT',
                type : 'MAT3'
            },
            propertyMat4 : {
                byteOffset : 140,
                componentType : 'UNSIGNED_BYTE',
                type : 'MAT4'
            }
        };

        var batchTable = new Cesium3DTileBatchTable(mockContent, 2, batchTableJson, batchTableBinary);

        expect(batchTable.getProperty(1, 'propertyScalar')).toEqual(1);
        expect(batchTable.getProperty(1, 'propertyVec2')).toEqual(new Cartesian2(4, 5));
        expect(batchTable.getProperty(1, 'propertyVec3')).toEqual(new Cartesian3(9, 10, 11));
        expect(batchTable.getProperty(1, 'propertyVec4')).toEqual(new Cartesian4(16, 17, 18, 19));
        expect(batchTable.getProperty(1, 'propertyMat2')).toEqual(new Matrix2(24, 26, 25, 27)); // Constructor is row-major, data is column major
        expect(batchTable.getProperty(1, 'propertyMat3')).toEqual(new Matrix3(37, 40, 43, 38, 41, 44, 39, 42, 45));  // Constructor is row-major, data is column major
        expect(batchTable.getProperty(1, 'propertyMat4')).toEqual(new Matrix4(62, 66, 70, 74, 63, 67, 71, 75, 64, 68, 72, 76, 65, 69, 73, 77));  // Constructor is row-major, data is column major

        batchTable.setProperty(1, 'propertyScalar', 2);
        batchTable.setProperty(1, 'propertyVec2', new Cartesian2(5, 6));
        batchTable.setProperty(1, 'propertyVec3', new Cartesian3(10, 11, 12));
        batchTable.setProperty(1, 'propertyVec4', new Cartesian4(17, 18, 19, 20));
        batchTable.setProperty(1, 'propertyMat2', new Matrix2(25, 27, 26, 28));
        batchTable.setProperty(1, 'propertyMat3', new Matrix3(38, 41, 44, 39, 42, 45, 40, 43, 46));
        batchTable.setProperty(1, 'propertyMat4', new Matrix4(63, 67, 71, 75, 64, 68, 72, 76, 65, 69, 73, 77, 66, 70, 74, 78));

        expect(batchTable.getProperty(1, 'propertyScalar')).toEqual(2);
        expect(batchTable.getProperty(1, 'propertyVec2')).toEqual(new Cartesian2(5, 6));
        expect(batchTable.getProperty(1, 'propertyVec3')).toEqual(new Cartesian3(10, 11, 12));
        expect(batchTable.getProperty(1, 'propertyVec4')).toEqual(new Cartesian4(17, 18, 19, 20));
        expect(batchTable.getProperty(1, 'propertyMat2')).toEqual(new Matrix2(25, 27, 26, 28));
        expect(batchTable.getProperty(1, 'propertyMat3')).toEqual(new Matrix3(38, 41, 44, 39, 42, 45, 40, 43, 46));
        expect(batchTable.getProperty(1, 'propertyMat4')).toEqual(new Matrix4(63, 67, 71, 75, 64, 68, 72, 76, 65, 69, 73, 77, 66, 70, 74, 78));
    });

    it('renders tileset with batch table', function() {
        return Cesium3DTilesTester.loadTileset(scene, withBatchTableUrl).then(function(tileset) {
            var content = tileset._root.content;

            // Each feature in the b3dm file has an id property from 0 to 9,
            // check that the 2nd resource has an id of 2
            expect(content.getFeature(2).getProperty('id')).toEqual(2);

            // Check that a property can be an array
            expect(content.getFeature(2).getProperty('rooms')).toEqual(['room2_a', 'room2_b', 'room2_c']);

            // Check that a property can be an object
            expect(content.getFeature(2).getProperty('info')).toEqual({name : 'building2', year : 2});

            Cesium3DTilesTester.expectRenderTileset(scene, tileset);
        });
    });

    it('renders tileset without batch table', function() {
        return Cesium3DTilesTester.loadTileset(scene, withoutBatchTableUrl).then(function(tileset) {
            var content = tileset._root.content;

            expect(content.getFeature(2).getProperty('id')).toBeUndefined();

            Cesium3DTilesTester.expectRenderTileset(scene, tileset);
        });
    });

    it('renders when vertex texture fetch is not supported', function() {
        // Disable VTF
        var maximumVertexTextureImageUnits = ContextLimits.maximumVertexTextureImageUnits;
        ContextLimits._maximumVertexTextureImageUnits = 0;

        return Cesium3DTilesTester.loadTileset(scene, withoutBatchTableUrl).then(function(tileset) {
            Cesium3DTilesTester.expectRenderTileset(scene, tileset);

            // Re-enable VTF
            ContextLimits._maximumVertexTextureImageUnits = maximumVertexTextureImageUnits;
        });
    });

    it('renders with featuresLength greater than maximumTextureSize', function() {
        // Set maximum texture size to 4 temporarily. Batch length of b3dm file is 10.
        var maximumTextureSize = ContextLimits.maximumTextureSize;
        ContextLimits._maximumTextureSize = 4;

        return Cesium3DTilesTester.loadTileset(scene, withoutBatchTableUrl).then(function(tileset) {
            var content = tileset._root.content;
            expect(content.featuresLength).toBeGreaterThan(ContextLimits._maximumTextureSize);
            Cesium3DTilesTester.expectRenderTileset(scene, tileset);

            // Reset maximum texture size
            ContextLimits._maximumVertexTextureImageUnits = maximumTextureSize;
        });
    });

    it('renders with featuresLength of zero', function() {
        return Cesium3DTilesTester.loadTileset(scene, batchLengthZeroUrl).then(function(tileset) {
            expectRender(tileset);

            // Expect the picked primitive to be the entire model rather than a single building
            var picked = scene.pickForSpecs().primitive;
            expect(picked).toBe(tileset._root.content._model);
        });
    });

    it('renders with debug color', function() {
        return Cesium3DTilesTester.loadTileset(scene, withoutBatchTableUrl).then(function(tileset) {
            var color = expectRender(tileset);
            tileset.debugColorizeTiles = true;
            var debugColor = expectRender(tileset);
            expect(debugColor).not.toEqual(color);
            tileset.debugColorizeTiles = false;
            debugColor = expectRender(tileset);
            expect(debugColor).toEqual(color);
        });
    });

    it('renders translucent style', function() {
        return Cesium3DTilesTester.loadTileset(scene, withoutBatchTableUrl).then(function(tileset) {
            var batchTable = tileset._root.content.batchTable;

            var opaqueColor = expectRender(tileset);

            // Render transparent
            batchTable.setAllColor(new Color(1.0, 1.0, 1.0, 0.5));
            var translucentColor = expectRender(tileset);
            expect(translucentColor).not.toEqual(opaqueColor);

            // Render restored to opaque
            batchTable.setAllColor(Color.WHITE);
            var restoredOpaque = expectRender(tileset);
            expect(restoredOpaque).toEqual(opaqueColor);

            // Generate both translucent and opaque commands
            batchTable.setColor(0, new Color(1.0, 1.0, 1.0, 0.5));
            expectRender(tileset);

            // Fully transparent
            batchTable.setAllColor(new Color(1.0, 1.0, 1.0, 0.0));
            expect(scene.renderForSpecs()).toEqual([0, 0, 0, 255]);
        });
    });

    it('renders translucent style when vertex texture fetch is not supported', function() {
        // Disable VTF
        var maximumVertexTextureImageUnits = ContextLimits.maximumVertexTextureImageUnits;
        ContextLimits._maximumVertexTextureImageUnits = 0;

        return Cesium3DTilesTester.loadTileset(scene, withoutBatchTableUrl).then(function(tileset) {
            var batchTable = tileset._root.content.batchTable;

            var opaqueColor = expectRender(tileset);

            // Render transparent
            batchTable.setAllColor(new Color(1.0, 1.0, 1.0, 0.5));
            var translucentColor = expectRender(tileset);
            expect(translucentColor).not.toEqual(opaqueColor);

            // Render restored to opaque
            batchTable.setAllColor(Color.WHITE);
            var restoredOpaque = expectRender(tileset);
            expect(restoredOpaque).toEqual(opaqueColor);

            // Generate both translucent and opaque commands
            batchTable.setColor(0, new Color(1.0, 1.0, 1.0, 0.5));
            expectRender(tileset);

            // Fully transparent
            batchTable.setAllColor(new Color(1.0, 1.0, 1.0, 0.0));
            expect(scene.renderForSpecs()).toEqual([0, 0, 0, 255]);

            // Re-enable VTF
            ContextLimits._maximumVertexTextureImageUnits = maximumVertexTextureImageUnits;
        });
    });

    it('destroys', function() {
        return Cesium3DTilesTester.loadTileset(scene, withoutBatchTableUrl).then(function(tileset) {
            var content = tileset._root.content;
            var batchTable = content.batchTable;
            expect(batchTable.isDestroyed()).toEqual(false);
            scene.primitives.remove(tileset);
            expect(batchTable.isDestroyed()).toEqual(true);
        });
    });

}, 'WebGL');
