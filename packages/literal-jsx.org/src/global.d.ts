declare module "railroad-diagrams" {
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
