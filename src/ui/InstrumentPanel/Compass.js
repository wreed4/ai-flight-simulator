export class Math {
  static toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  static toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  static distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  static distance3D(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(
      Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2),
    );
  }

  static randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static quaternionFromEuler(x, y, z) {
    const c1 = Math.cos(x / 2);
    const s1 = Math.sin(x / 2);
    const c2 = Math.cos(y / 2);
    const s2 = Math.sin(y / 2);
    const c3 = Math.cos(z / 2);
    const s3 = Math.sin(z / 2);

    return {
      w: c1 * c2 * c3 - s1 * s2 * s3,
      x: s1 * c2 * c3 + c1 * s2 * s3,
      y: c1 * s2 * c3 - s1 * c2 * s3,
      z: c1 * c2 * s3 + s1 * s2 * c3,
    };
  }
}
