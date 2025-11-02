"use client";

import { useCursor, Float, RoundedBox, Text, useTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, MathUtils } from "three";

export type BannerMaterial = "glass" | "metal" | "plate";

export interface BannerData {
  id: string;
  title: string;
  description?: string;
  url: string;
  material: BannerMaterial;
  color?: string;
  flippable?: boolean;
  emblem?: {
    color: string;
    label: string;
    imageUrl?: string;
  };
}

interface Banner3DProps {
  banner: BannerData;
  position: [number, number, number];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    radius: number;
    titleSize: number;
    descriptionSize: number;
    padding: number;
  };
  onOpen: (banner: BannerData) => void;
}

export default function Banner3D({ banner, position, dimensions, onOpen }: Banner3DProps) {
  const groupRef = useRef<Group>(null);
  const isFlippable = banner.flippable ?? false;
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [floatIntensity, setFloatIntensity] = useState(0.9);

  useCursor(hovered);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setFloatIntensity(media.matches ? 0.2 : 0.9);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = isFlippable && flipped ? Math.PI : 0;
    groupRef.current.rotation.y = MathUtils.damp(groupRef.current.rotation.y, target, 8, delta);
  });

  const materialElement = useMemo(() => {
    const color = banner.color;
    switch (banner.material) {
      case "glass":
        return (
          <meshPhysicalMaterial
            color={color ?? "#eef2ff"}
            transmission={1}
            ior={1.2}
            roughness={0.05}
            thickness={1}
            clearcoat={0.85}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
          />
        );
      case "metal":
        return (
          <meshStandardMaterial
            color={color ?? "#d4d4d8"}
            metalness={0.95}
            roughness={0.18}
            envMapIntensity={1.4}
          />
        );
      case "plate":
      default:
        return <meshStandardMaterial color={color ?? "#6366f1"} metalness={0.2} roughness={0.6} />;
    }
  }, [banner.material, banner.color]);

  const frontVisible = !isFlippable || !flipped;
  const backVisible = isFlippable && flipped;
  const emblemSize = dimensions.height * 0.48;
  const emblem = banner.emblem;
  const circleRadius = emblemSize / 2;
  const emblemX = -dimensions.width / 2 + dimensions.padding + circleRadius;
  const textLeftX = emblem
    ? emblemX + circleRadius + dimensions.padding * 0.55
    : -dimensions.width / 2 + dimensions.padding;
  const emblemTexture = useTexture(emblem?.imageUrl ?? "/logos/transparent.png");
  const hasEmblemImage = Boolean(emblem?.imageUrl);

  const handleSelect = (event: ThreeEvent<globalThis.MouseEvent>) => {
    event.stopPropagation();
    if (isFlippable) {
      setFlipped((prev) => {
        if (prev) {
          onOpen(banner);
          return prev;
        }
        return true;
      });
    } else {
      onOpen(banner);
    }
  };

  return (
    <Float floatIntensity={floatIntensity} rotationIntensity={floatIntensity} speed={1.4}>
      <group ref={groupRef} position={position}>
        <RoundedBox
          args={[dimensions.width, dimensions.height, dimensions.depth]}
          radius={dimensions.radius}
          smoothness={6}
          onClick={handleSelect}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            setHovered(false);
          }}
        >
          {materialElement}
          <group position={[0, 0, dimensions.depth / 2 + 0.01]} visible={frontVisible}>
            {emblem ? (
              <group position={[emblemX, 0, 0]}>
                <mesh position={[0, 0, dimensions.depth * 0.2]}>
                  <circleGeometry args={[circleRadius, 48]} />
                  <meshStandardMaterial color={emblem.color} metalness={0.5} roughness={0.25} />
                </mesh>
                {hasEmblemImage ? (
                  <mesh position={[0, 0, dimensions.depth * 0.24]}>
                    <circleGeometry args={[circleRadius * 0.82, 48]} />
                    <meshBasicMaterial map={emblemTexture} toneMapped={false} transparent />
                  </mesh>
                ) : (
                  <Text
                    position={[0, 0, dimensions.depth * 0.26]}
                    fontSize={circleRadius * 0.78}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    material-toneMapped={false}
                    fontWeight={600}
                  >
                    {emblem.label}
                  </Text>
                )}
              </group>
            ) : null}
            <Text
              position={[textLeftX, isFlippable ? dimensions.height * 0.05 : 0, 0]}
              fontSize={dimensions.titleSize}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
              maxWidth={dimensions.width - dimensions.padding * 1.6}
              lineHeight={1.1}
              material-toneMapped={false}
              fontWeight={600}
            >
              {banner.title}
            </Text>
            {banner.description ? (
              <Text
                position={[textLeftX, -dimensions.height * 0.28, 0]}
                fontSize={dimensions.descriptionSize}
                color="#e2e8f0"
                anchorX="left"
                anchorY="middle"
                maxWidth={dimensions.width - dimensions.padding * 1.4}
                lineHeight={1.2}
                material-toneMapped={false}
              >
                {banner.description}
              </Text>
            ) : null}
            {isFlippable ? (
              <Text
                position={[textLeftX, dimensions.height * 0.28, 0]}
                fontSize={dimensions.descriptionSize * 0.9}
                color="#cbd5f5"
                anchorX="left"
                anchorY="middle"
                maxWidth={dimensions.width - dimensions.padding * 1.4}
                material-toneMapped={false}
              >
                Tap to flip
              </Text>
            ) : null}
          </group>

          {isFlippable ? (
            <group rotation={[0, Math.PI, 0]} position={[0, 0, dimensions.depth / 2 + 0.01]} visible={backVisible}>
              {emblem ? (
                <group position={[emblemX, 0, 0]}>
                  <mesh position={[0, 0, dimensions.depth * 0.2]}>
                    <circleGeometry args={[circleRadius, 48]} />
                    <meshStandardMaterial color={emblem.color} metalness={0.5} roughness={0.25} />
                  </mesh>
                  {hasEmblemImage ? (
                    <mesh position={[0, 0, dimensions.depth * 0.24]}>
                      <circleGeometry args={[circleRadius * 0.82, 48]} />
                      <meshBasicMaterial map={emblemTexture} toneMapped={false} transparent />
                    </mesh>
                  ) : (
                    <Text
                      position={[0, 0, dimensions.depth * 0.26]}
                      fontSize={circleRadius * 0.78}
                      color="#ffffff"
                      anchorX="center"
                      anchorY="middle"
                      material-toneMapped={false}
                      fontWeight={600}
                    >
                      {emblem.label}
                    </Text>
                  )}
                </group>
              ) : null}
              <Text
                position={[textLeftX, dimensions.height * 0.05, 0]}
                fontSize={dimensions.titleSize * 0.85}
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
                maxWidth={dimensions.width - dimensions.padding * 1.5}
                material-toneMapped={false}
              >
                {banner.title}
              </Text>
              {banner.description ? (
                <Text
                  position={[textLeftX, -dimensions.height * 0.22, 0]}
                  fontSize={dimensions.descriptionSize}
                  color="#cbd5f5"
                  anchorX="left"
                  anchorY="middle"
                  maxWidth={dimensions.width - dimensions.padding * 1.6}
                  lineHeight={1.2}
                  material-toneMapped={false}
                >
                  {banner.description}
                </Text>
              ) : null}
              <Text
                position={[textLeftX, dimensions.height * 0.27, 0]}
                fontSize={dimensions.descriptionSize * 0.9}
                color="#94f6ff"
                anchorX="left"
                anchorY="middle"
                maxWidth={dimensions.width - dimensions.padding * 1.8}
                material-toneMapped={false}
              >
                Tap to launch
              </Text>
            </group>
          ) : null}
        </RoundedBox>
      </group>
    </Float>
  );
}
