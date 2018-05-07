import * as T from 'three'

import { point, face } from './geometry'
import { move } from './meshes';

export class Limb {
    private initMesh(thickness: number, length: number) {
        this.meshGeometry = new T.Geometry()
        let material = new T.MeshNormalMaterial()

        let a0 = point(0, 0, 0),         a1 = point(thickness, 0, 0),
            a2 = point(0, thickness, 0), a3 = point(thickness, thickness, 0)

        let b0 = point(0, 0, length),         b1 = point(thickness, 0, length),
            b2 = point(0, thickness, length), b3 = point(thickness, thickness, length)

        this.meshGeometry.vertices.push(
            a0, a1, a2, a3, // Lower square.
            b0, b1, b2, b3 // Upper square.
        )
        this.meshGeometry.faces.push(
            face(0, 2, 3), face(3, 1, 0), // Lower square.
            face(4, 5, 7), face(7, 6, 4), // Upper sqaure.
            face(6, 2, 0), face(0, 4, 6), // Left side.
            face(0, 1, 5), face(5, 4, 0), // Top side.
            face(1, 3, 7), face(7, 5, 1), // Right side.
            face(7, 3, 2), face(2, 6, 7) // Bottom side.
        )

        this.mesh = new T.Mesh(this.meshGeometry, material)
    }

    private initLine(thickness: number, length: number) {
        this.lineGeometry = new T.Geometry()
        let material = new T.LineBasicMaterial()
        let center = thickness / 2

        let mult = 10

        this.elbowVertex = point(center, center, 0 - mult)
        this.wristVertex = point(center, center, length + mult)

        this.lineGeometry.vertices.push(this.elbowVertex, this.wristVertex)

        this.line = new T.Line(this.lineGeometry, material)
    }

    private meshGeometry: T.Geometry
    private lineGeometry: T.Geometry

    public constructor(private thickness: number, private length: number) {
        this.initMesh(thickness, length)
        this.initLine(thickness, length)
    }

    public setMeshMaterial(material: T.Material) { this.mesh.material = material }
    public getMeshMaterial(): T.Material { return this.mesh.material as T.Material }
    public setLineMaterial(material: T.Material) { this.line.material = material }
    public getLineMaterial(material: T.Material) { return this.line.material }

    private wristVertex: T.Vector3
    public getWristVertex() { return this.lineGeometry.vertices[0] }

    private elbowVertex: T.Vector3
    public getElbowVertex() { return this.lineGeometry.vertices[1] }

    private mesh: T.Mesh
    public getMesh(): T.Mesh { return this.mesh }

    private line: T.Line
    public getLine(): T.Line { return this.line }

    public move(x: number, y: number, z: number) {
        move(this.mesh, x, y, z)
        move(this.line, x, y, z);
        (this.line.geometry as T.Geometry).verticesNeedUpdate = true
    }

    public rotate(v: T.Vector3, r: number) {
        this.mesh.rotateOnAxis(v, r)
        this.line.rotateOnAxis(v, r);
        (this.line.geometry as T.Geometry).verticesNeedUpdate = true
    }

    public toScene(scene: T.Scene) {
        scene.add(this.mesh)
        scene.add(this.line);
    }
}