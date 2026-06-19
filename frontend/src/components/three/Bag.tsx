"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { BagModel } from "@/lib/products";

/**
 * Procedural luxury handbags — a distinct premium silhouette per model type.
 * Leather color + hardware tint morph smoothly (~700ms) on variant change.
 * No GLB download required; all primitives.
 */

function useBagMaterials(leather: string, hardware: string) {
  const targetLeather = useMemo(() => new THREE.Color(leather), [leather]);
  const targetHardware = useMemo(() => new THREE.Color(hardware), [hardware]);

  const leatherMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(leather),
        roughness: 0.52,
        metalness: 0.04,
        clearcoat: 0.4,
        clearcoatRoughness: 0.45,
        sheen: 0.5,
        sheenColor: new THREE.Color("#ffffff"),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const flapMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(leather),
        roughness: 0.42,
        metalness: 0.04,
        clearcoat: 0.55,
        clearcoatRoughness: 0.38,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(hardware),
        roughness: 0.16,
        metalness: 1,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.004, delta); // ~700ms morph
    leatherMat.color.lerp(targetLeather, k);
    flapMat.color.lerp(targetLeather, k);
    metalMat.color.lerp(targetHardware, k);
  });

  return { leatherMat, flapMat, metalMat };
}

type Mats = ReturnType<typeof useBagMaterials>;

/** Row of stitch dots along a horizontal edge. */
function Stitches({ y, z, width = 1.5, count = 14, color = "#efe9dd" }: {
  y: number; z: number; width?: number; count?: number; color?: string;
}) {
  const pts = useMemo(() => {
    const a: [number, number, number][] = [];
    for (let i = 0; i < count; i++) a.push([-width / 2 + (i * width) / (count - 1), y, z]);
    return a;
  }, [y, z, width, count]);
  return (
    <>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.011, 6, 6]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
    </>
  );
}

/** Branded metal plaque. */
function Plaque({ mat, position }: { mat: THREE.Material; position: [number, number, number] }) {
  return (
    <mesh position={position} material={mat}>
      <boxGeometry args={[0.34, 0.085, 0.02]} />
    </mesh>
  );
}

/** Turn-lock clasp used on flap bags. */
function TurnLock({ mat, position }: { mat: THREE.Material; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={mat}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
      </mesh>
      <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]} material={mat}>
        <torusGeometry args={[0.11, 0.016, 12, 36]} />
      </mesh>
    </group>
  );
}

/** Thin metal chain strap as a high arc (reads as a shoulder chain). */
function ChainStrap({ mat, radius = 0.62, tube = 0.022, y = 0.55 }: {
  mat: THREE.Material; radius?: number; tube?: number; y?: number;
}) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <torusGeometry args={[radius, tube, 10, 64, Math.PI]} />
    </mesh>
  );
}

function Feet({ mat, y, spread = 0.55, depth = 0.2 }: {
  mat: THREE.Material; y: number; spread?: number; depth?: number;
}) {
  const pts: [number, number, number][] = [
    [-spread, y, depth], [spread, y, depth], [-spread, y, -depth], [spread, y, -depth],
  ];
  return (
    <>
      {pts.map((p, i) => (
        <mesh key={i} position={p} material={mat}>
          <sphereGeometry args={[0.032, 12, 12]} />
        </mesh>
      ))}
    </>
  );
}

// ── Model variants ──────────────────────────────────────────

function ToteModel({ m }: { m: Mats }) {
  return (
    <group>
      <RoundedBox args={[1.7, 1.35, 0.6]} radius={0.1} smoothness={6} material={m.leatherMat} castShadow receiveShadow />
      {/* open-top inner shadow */}
      <mesh position={[0, 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.45]} />
        <meshStandardMaterial color="#1a140e" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* two arched handles front + back */}
      {[0.26, -0.26].map((z) => (
        <mesh key={z} position={[0, 0.78, z]} rotation={[0, 0, 0]} material={m.leatherMat} castShadow>
          <torusGeometry args={[0.4, 0.045, 14, 48, Math.PI]} />
        </mesh>
      ))}
      <Plaque mat={m.metalMat} position={[0, -0.1, 0.31]} />
      <Stitches y={0.56} z={0.31} width={1.5} />
      <Feet mat={m.metalMat} y={-0.7} spread={0.6} depth={0.18} />
    </group>
  );
}

function SatchelModel({ m }: { m: Mats }) {
  return (
    <group>
      <RoundedBox args={[1.8, 1.2, 0.55]} radius={0.09} smoothness={6} material={m.leatherMat} castShadow receiveShadow />
      {/* large front flap */}
      <RoundedBox args={[1.74, 0.7, 0.08]} radius={0.05} smoothness={5} position={[0, 0.05, 0.3]} material={m.flapMat} castShadow />
      {/* two buckle straps */}
      {[-0.5, 0.5].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.05, 0.345]} material={m.flapMat}>
            <boxGeometry args={[0.1, 0.85, 0.03]} />
          </mesh>
          <mesh position={[x, -0.18, 0.36]} material={m.metalMat}>
            <torusGeometry args={[0.06, 0.018, 10, 24]} />
          </mesh>
        </group>
      ))}
      {/* top handle */}
      <mesh position={[0, 0.72, 0]} material={m.leatherMat} castShadow>
        <torusGeometry args={[0.3, 0.04, 12, 40, Math.PI]} />
      </mesh>
      <Stitches y={-0.34} z={0.31} width={1.6} count={16} />
      <Feet mat={m.metalMat} y={-0.62} spread={0.65} depth={0.16} />
    </group>
  );
}

function CrossbodyModel({ m }: { m: Mats }) {
  return (
    <group>
      <RoundedBox args={[1.35, 0.95, 0.42]} radius={0.1} smoothness={6} material={m.leatherMat} castShadow receiveShadow />
      {/* flap over top third */}
      <RoundedBox args={[1.3, 0.5, 0.07]} radius={0.06} smoothness={5} position={[0, 0.18, 0.22]} material={m.flapMat} castShadow />
      <TurnLock mat={m.metalMat} position={[0, -0.05, 0.27]} />
      <ChainStrap mat={m.metalMat} radius={0.62} y={0.42} />
      {/* strap anchors */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]} material={m.metalMat}>
          <torusGeometry args={[0.05, 0.016, 10, 24]} />
        </mesh>
      ))}
      <Stitches y={0.41} z={0.23} width={1.2} count={12} />
      <Feet mat={m.metalMat} y={-0.5} spread={0.45} depth={0.13} />
    </group>
  );
}

function HoboModel({ m }: { m: Mats }) {
  // Elegant crescent-moon hobo (à la the burgundy reference): a half-moon
  // body, a curved top handle hugging the dip, and a slim toggle clasp.
  const edge = useMemo(() => {
    const a: [number, number, number][] = [];
    const count = 30;
    for (let i = 0; i <= count; i++) {
      const t = Math.PI + (i / count) * Math.PI; // lower half arc
      a.push([Math.cos(t) * 0.86, Math.sin(t) * 0.86 + 0.05, 0.21]);
    }
    return a;
  }, []);

  return (
    <group>
      {/* crescent body: a squashed sphere, scaled wide & low */}
      <mesh scale={[1.0, 0.66, 0.42]} position={[0, -0.05, 0]} material={m.leatherMat} castShadow receiveShadow>
        <sphereGeometry args={[0.95, 48, 36]} />
      </mesh>
      {/* concave top — carve the moon dip with a body-colored disc set back */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.5]} />
        <meshStandardMaterial color="#15110c" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* piping along the crescent edge */}
      {edge.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.014, 6, 6]} />
          <meshStandardMaterial color="#efe9dd" roughness={0.85} />
        </mesh>
      ))}
      {/* curved top handle hugging the dip */}
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.leatherMat} castShadow>
        <torusGeometry args={[0.5, 0.055, 16, 48, Math.PI]} />
      </mesh>
      {/* toggle T-bar clasp at the centre of the dip */}
      <mesh position={[0, 0.34, 0.12]} rotation={[0, 0, Math.PI / 2]} material={m.metalMat}>
        <cylinderGeometry args={[0.028, 0.028, 0.26, 16]} />
      </mesh>
      {/* side strap anchors */}
      {[-0.78, 0.78].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]} material={m.metalMat}>
          <torusGeometry args={[0.05, 0.016, 10, 24]} />
        </mesh>
      ))}
    </group>
  );
}

function BostonModel({ m }: { m: Mats }) {
  // Premium tan bowler/Boston bag (the entry-animation bag): a domed top
  // over a structured body, gold zip across the crown, twin rolled
  // handles, a front slip pocket, gold feet and side D-rings.
  return (
    <group>
      {/* structured lower body */}
      <RoundedBox args={[1.7, 0.78, 0.74]} radius={0.14} smoothness={6} position={[0, -0.12, 0]} material={m.leatherMat} castShadow receiveShadow />
      {/* domed top (horizontal half-cylinder) */}
      <mesh position={[0, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} material={m.leatherMat} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.7, 48]} />
      </mesh>
      {/* end caps for the dome */}
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} material={m.flapMat}>
          <cylinderGeometry args={[0.42, 0.42, 0.02, 48]} />
        </mesh>
      ))}
      {/* gold zip line across the crown */}
      <mesh position={[0, 0.74, 0]} material={m.metalMat}>
        <boxGeometry args={[1.5, 0.05, 0.07]} />
      </mesh>
      <mesh position={[0.3, 0.74, 0.06]} material={m.metalMat}>
        <boxGeometry args={[0.07, 0.12, 0.03]} />
      </mesh>
      {/* twin rolled top handles */}
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.78, 0]} rotation={[0, Math.PI / 2, 0]} material={m.leatherMat} castShadow>
          <torusGeometry args={[0.2, 0.045, 14, 36, Math.PI]} />
        </mesh>
      ))}
      {/* front slip pocket */}
      <RoundedBox args={[1.0, 0.5, 0.06]} radius={0.05} smoothness={5} position={[0, -0.18, 0.38]} material={m.flapMat} castShadow />
      <Plaque mat={m.metalMat} position={[0, -0.36, 0.42]} />
      {/* side D-rings */}
      {[-0.86, 0.86].map((x) => (
        <mesh key={x} position={[x, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} material={m.metalMat}>
          <torusGeometry args={[0.06, 0.018, 10, 24]} />
        </mesh>
      ))}
      <Stitches y={-0.48} z={0.36} width={1.4} count={16} />
      <Feet mat={m.metalMat} y={-0.52} spread={0.6} depth={0.22} />
    </group>
  );
}

function BucketModel({ m }: { m: Mats }) {
  return (
    <group>
      {/* tapered bucket body */}
      <mesh material={m.leatherMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.5, 1.2, 40]} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color="#1a140e" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* drawstring collar */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.metalMat}>
        <torusGeometry args={[0.6, 0.03, 12, 48]} />
      </mesh>
      {/* drawstring loops */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.6, 0.42, Math.sin(a) * 0.6]} material={m.metalMat}>
            <torusGeometry args={[0.035, 0.012, 8, 18]} />
          </mesh>
        );
      })}
      {/* shoulder strap */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.leatherMat} castShadow>
        <torusGeometry args={[0.5, 0.04, 12, 40, Math.PI]} />
      </mesh>
    </group>
  );
}

function ClutchModel({ m }: { m: Mats }) {
  return (
    <group rotation={[0, 0, 0]}>
      <RoundedBox args={[1.85, 0.95, 0.2]} radius={0.09} smoothness={6} material={m.leatherMat} castShadow receiveShadow />
      {/* envelope flap (angled triangle-ish via thin box) */}
      <mesh position={[0, 0.1, 0.11]} rotation={[0.18, 0, 0]} material={m.flapMat} castShadow>
        <boxGeometry args={[1.8, 0.55, 0.04]} />
      </mesh>
      {/* bar clasp */}
      <mesh position={[0, -0.12, 0.13]} material={m.metalMat}>
        <boxGeometry args={[0.5, 0.05, 0.04]} />
      </mesh>
      <Stitches y={-0.4} z={0.105} width={1.65} count={18} />
      {/* slim wrist chain */}
      <mesh position={[0.92, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} material={m.metalMat}>
        <torusGeometry args={[0.22, 0.012, 8, 40]} />
      </mesh>
    </group>
  );
}

function MiniModel({ m }: { m: Mats }) {
  return (
    <group>
      <RoundedBox args={[0.95, 0.8, 0.4]} radius={0.09} smoothness={6} material={m.leatherMat} castShadow receiveShadow />
      <RoundedBox args={[0.9, 0.42, 0.07]} radius={0.05} smoothness={5} position={[0, 0.15, 0.21]} material={m.flapMat} castShadow />
      <TurnLock mat={m.metalMat} position={[0, -0.04, 0.26]} />
      {/* short top handle */}
      <mesh position={[0, 0.5, 0]} material={m.leatherMat} castShadow>
        <torusGeometry args={[0.22, 0.032, 12, 36, Math.PI]} />
      </mesh>
      <ChainStrap mat={m.metalMat} radius={0.5} y={0.36} tube={0.018} />
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]} material={m.metalMat}>
          <torusGeometry args={[0.04, 0.014, 10, 24]} />
        </mesh>
      ))}
      <Feet mat={m.metalMat} y={-0.42} spread={0.32} depth={0.12} />
    </group>
  );
}

function WeekenderModel({ m }: { m: Mats }) {
  return (
    <group>
      {/* barrel duffel body */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={m.leatherMat} castShadow receiveShadow>
        <capsuleGeometry args={[0.62, 1.5, 16, 32]} />
      </mesh>
      {/* zipper line */}
      <mesh position={[0, 0.6, 0]} material={m.metalMat}>
        <boxGeometry args={[1.7, 0.04, 0.05]} />
      </mesh>
      <mesh position={[0.2, 0.6, 0.06]} material={m.metalMat}>
        <boxGeometry args={[0.08, 0.1, 0.03]} />
      </mesh>
      {/* twin top handles meeting at center */}
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 0.72, 0]} rotation={[0, Math.PI / 2, 0]} material={m.leatherMat} castShadow>
          <torusGeometry args={[0.16, 0.035, 12, 32, Math.PI]} />
        </mesh>
      ))}
      {/* end-cap trims */}
      {[-1.07, 1.07].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.flapMat}>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 32]} />
        </mesh>
      ))}
      <Plaque mat={m.metalMat} position={[0, 0.1, 0.62]} />
    </group>
  );
}

function LunaModel({ m }: { m: Mats }) {
  // An elegant round "circle" bag — a plump leather disc with a ring
  // top-handle, a slim chain arc, and a turn-lock. Reads as soft & round.
  const stitches = useMemo(() => {
    const a: [number, number, number][] = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      a.push([Math.cos(t) * 0.64, Math.sin(t) * 0.64, 0.19]);
    }
    return a;
  }, []);

  return (
    <group>
      {/* puffy rounded rim */}
      <mesh material={m.leatherMat} castShadow receiveShadow>
        <torusGeometry args={[0.8, 0.2, 28, 80]} />
      </mesh>
      {/* disc faces (front + back) */}
      {[0.18, -0.18].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} material={m.flapMat} castShadow>
          <cylinderGeometry args={[0.82, 0.82, 0.04, 80]} />
        </mesh>
      ))}
      {/* stitch ring on the front face */}
      {stitches.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.011, 6, 6]} />
          <meshStandardMaterial color="#efe9dd" roughness={0.85} />
        </mesh>
      ))}
      {/* ring top-handle */}
      <mesh position={[0, 1.02, 0]} material={m.metalMat} castShadow>
        <torusGeometry args={[0.2, 0.032, 16, 44]} />
      </mesh>
      {/* connector from body to handle */}
      <mesh position={[0, 0.84, 0]} material={m.metalMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
      </mesh>
      {/* slim chain arc over the top */}
      <mesh material={m.metalMat}>
        <torusGeometry args={[1.02, 0.02, 10, 80, Math.PI]} />
      </mesh>
      {/* turn-lock clasp, centered */}
      <TurnLock mat={m.metalMat} position={[0, -0.05, 0.21]} />
    </group>
  );
}

const MODELS: Record<BagModel, (p: { m: Mats }) => JSX.Element> = {
  luna: LunaModel,
  boston: BostonModel,
  tote: ToteModel,
  satchel: SatchelModel,
  crossbody: CrossbodyModel,
  hobo: HoboModel,
  bucket: BucketModel,
  clutch: ClutchModel,
  mini: MiniModel,
  weekender: WeekenderModel,
};

export function Bag({
  model = "tote",
  leather,
  hardware,
  autoRotate = true,
}: {
  model?: BagModel;
  leather: string;
  hardware: string;
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const mats = useBagMaterials(leather, hardware);
  const Model = MODELS[model] ?? ToteModel;

  useFrame((_, delta) => {
    if (group.current && autoRotate) group.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={group}>
      <Model m={mats} />
    </group>
  );
}
