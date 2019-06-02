declare module "railroad-diagrams/railroad" {
  export const Skip: () => FakeSVG;
  export const Start: (...items: any[]) => FakeSVG;
  export const Stack: (...items: any[]) => FakeSVG;
  export const End: (...items: any[]) => FakeSVG;
  export const Comment: (...items: any[]) => FakeSVG;
  export const Sequence: (...items: any[]) => FakeSVG;
  export const Diagram: (...items: any[]) => FakeSVG;
  export const ComplexDiagram: (...items: any[]) => FakeSVG;
  export const Choice: (...items: any[]) => FakeSVG;
  export const NonTerminal: (...items: any[]) => FakeSVG;
  export const OneOrMore: (...items: any[]) => FakeSVG;
  export const ZeroOrMore: (...items: any[]) => FakeSVG;
  export const Optional: (child: any, skip?: "skip") => FakeSVG;
  export const ZeroOrMore: (child: any, repeat: any, skip: any) => FakeSVG;
  export const Choice: (index: number, ...children: any[]) => FakeSVG;
  export const NonTerminal: (child: any) => FakeSVG;
}

declare module "arcsecond";

declare module "literal-jsx" {
  export type DefaultR = {
    _JSXElement: true;
    name: string;
    attributes: null | {
      [attr: string]: JSXData<DefaultR>;
    };
    children: JSXData<DefaultR>[];
  };

  export type JSXData<R = DefaultR> =
    | string
    | null
    | boolean
    | number
    | JSXData[]
    | { [key: string]: JSXData<R> }
    | R;

  export const parse: <R = DefaultR>(
    code: string,
    factory?: (
      name: string,
      attributes: null | { [attr: string]: JSXData<R> },
      ...children: JSXData<R>
    ) => R
  ) => JSXData<R>;
}
