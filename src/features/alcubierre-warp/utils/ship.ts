import {
  AdditiveBlending,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from 'three';
import {
  ENGINE_COLOR,
  ENGINE_RADIUS,
  ENGINE_X,
  SHIP_BODY_LENGTH,
  SHIP_BODY_RADIUS,
  SHIP_BODY_X,
  SHIP_COLOR,
  SHIP_NOSE_LENGTH,
  SHIP_NOSE_RADIUS,
  SHIP_NOSE_X,
} from '../constants';

/** Ship at the origin, nose along +x. */
export const createShip = (): Group => {
  const group = new Group();
  const hull = new MeshBasicMaterial({ color: SHIP_COLOR });

  const nose = new Mesh(new ConeGeometry(SHIP_NOSE_RADIUS, SHIP_NOSE_LENGTH, 16), hull);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = SHIP_NOSE_X;

  const body = new Mesh(new CylinderGeometry(SHIP_BODY_RADIUS, SHIP_BODY_RADIUS, SHIP_BODY_LENGTH, 12), hull);
  body.rotation.z = Math.PI / 2;
  body.position.x = SHIP_BODY_X;

  const engine = new Mesh(
    new SphereGeometry(ENGINE_RADIUS, 16, 12),
    new MeshBasicMaterial({ color: ENGINE_COLOR, transparent: true, blending: AdditiveBlending, depthWrite: false }),
  );
  engine.position.x = ENGINE_X;

  group.add(nose, body, engine);
  return group;
};
