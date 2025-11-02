"use client";

import { Float, RoundedBox, Text, useTexture } from "@react-three/drei";

interface AvatarBadgeProps {
  position?: [number, number, number];
  scale?: number;
}

export default function AvatarBadge({ position = [0, 0, 0], scale = 1 }: AvatarBadgeProps) {
  const badgeRadius = 0.92 * scale;
  const frameSize = badgeRadius * 1.75;
  const avatarTexture = useTexture("/avatar-placeholder.jpg");

  return (
    <Float floatIntensity={0.35} rotationIntensity={0.12} speed={1.6}>
      <group position={position}>
        <RoundedBox args={[frameSize, frameSize, 0.12]} radius={badgeRadius * 0.35} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1f2937" metalness={0.15} roughness={0.55} />
        </RoundedBox>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[frameSize * 0.88, frameSize * 0.88]} />
          <meshBasicMaterial map={avatarTexture} toneMapped={false} transparent={false} />
        </mesh>
        <Text
          position={[0, badgeRadius * 1.55, 0]}
          fontSize={0.18 * scale}
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
