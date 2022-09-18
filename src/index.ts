type Ionization<S extends Salt, I> = {
  (salt: S): I;
};
type Salt = object;
type Bond = PropertyKey;
type Suspension = [Salt, Salt, Bond];

const solvent = <S extends Salt>() => ({
  ionize: <I>(ionization: Ionization<S, I>) => {
    return {
      dissolve: (salt: S) => {
        return {
          crystallize: dissolveWith(salt, ionization),
        };
      },
    };
  },
});
const isPrimitive: unique symbol = Symbol("isPrimitive");
const dissolveWith = <S extends Salt, I>(salt: S, ionization: Ionization<S, I>) => {
  const suspensions = new WeakMap<Salt, Suspension>();
  const createProxy = <T extends Salt>(target: T): T => {
    if (typeof target === "function") {
      throw new Error("Cannot call function in ionization.");
    }
    if (!(typeof target === "object" && target)) {
      // @ts-expect-error Dynamic Implementation
      return createProxy({
        [isPrimitive]: isPrimitive,
      });
    }

    return new Proxy(target, {
      get(proxyTarget, property, receiver) {
        if (Reflect.has(target, isPrimitive)) {
          throw new Error("Cannot chain bond with primitive properties.");
        }
        if (!(property in proxyTarget)) {
          throw new Error("Invalid ionization. Unknown properties are not allowed.");
        }
        const accessed = Reflect.get(proxyTarget, property);
        const newProxy = createProxy(accessed);
        suspensions.set(newProxy, [receiver, proxyTarget, property]);
        return newProxy;
      },
    });
  };
  const proxy = createProxy(salt);
  // @ts-expect-error Dynamic Implementation
  const located: object = ionization(proxy);
  let suspension = suspensions.get(located);
  if (!suspension) {
    throw new Error("Ionic bond lost.");
  }
  const crystalizeDirectives: ((ion: unknown) => unknown)[] = [];
  while (suspension) {
    const [nucleus, cluster, bond] = suspension;
    if (Array.isArray(cluster)) {
      crystalizeDirectives.push((ion) => Object.assign(new Array(cluster.length), cluster, { [bond]: ion }));
    } else {
      const prototype = Object.getPrototypeOf(cluster);
      if (prototype === null || Object.is(prototype, Object.prototype)) {
        crystalizeDirectives.push((ion) => Object.assign({}, cluster, { [bond]: ion }));
      } else {
        throw new Error("Class instance is currently not supported. Only simple object and array are supported.");
      }
    }
    suspension = suspensions.get(nucleus);
  }
  return (ion: I): S => crystalizeDirectives.reduce<any>((previousSalt, directive) => directive(previousSalt), ion);
};

export { solvent };
