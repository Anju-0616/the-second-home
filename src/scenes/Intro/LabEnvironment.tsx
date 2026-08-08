function LabEnvironment() {
  return (
    <>
      <gridHelper args={[40, 40, 0x2a4a5f, 0x142230]} position={[0, -1.4, 0]} />
      <mesh position={[0, -1.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color="#0b1622" roughness={0.15} metalness={0.6} transparent opacity={0.55} />
      </mesh>
    </>
  )
}

export default LabEnvironment