"use client";

import { Float, Ring, RoundedBox, Text } from "@react-three/drei";

interface AvatarBadgeProps {
  position?: [number, number, number];
  scale?: number;
}

const accent = {
  frame: "#ffffff",
  inner: "#94a3ff",
  glow: "#c084fc"
};

export default function AvatarBadge({ position = [0, 0, 0], scale = 1 }: AvatarBadgeProps) {
  const badgeRadius = 0.88 * scale;
  const frameWidth = 0.07 * scale;
  const innerSize = badgeRadius * 1.45;

  return (
    <Float floatIntensity={0.35} rotationIntensity={0.12} speed={1.6}>
      <group position={position}>
        <Ring args={[badgeRadius - frameWidth, badgeRadius + frameWidth, 48]} position={[0, 0, 0]}>
          <meshStandardMaterial color={accent.frame} emissive={accent.glow} emissiveIntensity={0.25} />
        </Ring>
        <RoundedBox args={[innerSize, innerSize, 0.16]} radius={badgeRadius * 0.36} position={[0, 0, -0.05]}>
          <meshStandardMaterial color={accent.inner} metalness={0.4} roughness={0.35} />
        </RoundedBox>
        <Text
          position={[0, badgeRadius * 1.4, 0]}
          fontSize={0.16 * scale}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          material-toneMapped={false}
          letterSpacing={0.02}
          fontWeight={600}
        >
          aerolinks.creator
        </Text>
      </group>
    </Float>
  );
}
