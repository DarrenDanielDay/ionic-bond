import { solvent } from "./index";
describe("bond", () => {
  it("should work like this", () => {
    interface Nested {
      a: {
        b: {
          c: number;
        };
        d: {
          e: {
            f: string;
          }[];
        };
      };
    }
    const idx = 2;
    const b = solvent<Nested>().ionize((n) => n.a.d.e[idx].f);
    const obj: Nested = {
      a: {
        b: { c: 1 },
        d: {
          e: [{ f: "aaa" }, { f: "bbb" }, { f: "ccc" }],
        },
      },
    };
    const newObj = b.dissolve(obj).crystallize("fff");
    // should create a new object
    expect(newObj).not.toBe(obj);
    // should preserve not updated parts
    expect(newObj.a.b).toBe(obj.a.b);
    expect(newObj.a.d.e[0]).toBe(obj.a.d.e[0]);
    expect(newObj.a.d.e[1]).toBe(obj.a.d.e[1]);
    // should update the changed parts
    expect(newObj).toStrictEqual({
      a: {
        b: { c: 1 },
        d: {
          e: [{ f: "aaa" }, { f: "bbb" }, { f: "fff" }],
        },
      },
    });
  });

  it("should throw error for invalid usage", () => {
    expect(() => {
      solvent<{ fn: () => void }>()
        .ionize((a) => a.fn)
        .dissolve({ fn() {} });
    }).toThrow(/function/i);
    expect(() => {
      solvent<string[]>()
        .ionize((a) => a[0].length)
        .dissolve(["aaa"]);
    }).toThrow(/primitive/i);
    expect(() => {
      solvent<{ tag?: string }>()
        .ionize((a) => a.tag)
        .dissolve({});
    }).toThrow(/unknown prop/i);
    expect(() => {
      solvent<string[]>()
        .ionize((a) => {
          const arr = [a[0]];
          arr.pop();
          return "aaa";
        })
        .dissolve(["aaa"]);
    }).toThrow(/bond lost/i);
    expect(() => {
      class A {
        b = 1;
      }
      solvent<A>()
        .ionize((a) => a.b)
        .dissolve(new A());
    }).toThrow(/class/i);
  });
});
