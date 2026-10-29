import { Gfx, rng, fractal, type Ctx, type Env, type Medium, type P } from "./core";
import type { Film } from "./film";
import { brush, JIAO, NONG, ZHONG, DAN, QING, type Brush } from "./sumiEKit";

// ANDORINHA NO SALGUEIRO · sumi-e (ink on xuan paper), one still.
//
// IDEA: spring arriving. A barn swallow has just landed on a willow bough and turns its head
// back toward the open sky it came from, where a second swallow is still on the wing.
// FOCAL SUBJECT: the perched swallow. LIGHT: diffuse daylight from the upper left, carried, as
// sumi-e carries it, by leaving paper: the belly is bare sheet, the back the brush's dry lift.
// REALISM (from knowledge of Hirundo rustica, side view, perched, facing left): a small flat
// head with a short, wide bill; dark chestnut forehead and throat (here heavy ink, the only red
// is the seal); a dark breast band; pale buff underparts; long, pointed folded wings whose tips
// cross past the rump; a deeply forked tail whose outer streamers run well beyond the wingtips;
// tiny legs, short toes. In flight: scythe wings swept back, the fork open.
// ORDER (the Mustard Seed Garden order): the bough first, then the hanging willow strands
// behind and in front, the willow leaves in quick pressed flicks, then the bird (beak, eye,
// head, throat, back, wings, tail, belly, feet), the far swallow, and the seal last.

const SUMI_M: Medium = { nib: 1, taper: 1, pressure: 1, retrace: false, wobble: 0, rough: 0 };
const PAPER = "#f3ede0";

// ---------------------------------------------------------------- the paper
const ground = (g: Gfx) => {
  const c = g.cur, e = g.env; c.setTransform(e.scale, 0, 0, e.scale, 0, 0); c.fillStyle = PAPER; c.fillRect(0, 0, e.W, e.H);
  g.group("plain", () => {
    const k = g.cur, r = rng(311); k.lineCap = "round";
    for (let i = 0; i < 340; i++) {
      const x = r() * e.W, y = r() * e.H, a = (fractal(312, x, y, 0.004, 0.004, 2) - 0.5) * 5, L = 18 + r() * 70, bend = (r() - 0.5) * 0.5;
      k.strokeStyle = r() < 0.5 ? "#d9cfbc" : "#fbf7ee"; k.globalAlpha = 0.35 + r() * 0.35; k.lineWidth = 0.4 + r() * 0.6;
      k.beginPath(); k.moveTo(x, y); k.quadraticCurveTo(x + Math.cos(a + bend) * L * 0.5, y + Math.sin(a + bend) * L * 0.5, x + Math.cos(a) * L, y + Math.sin(a) * L); k.stroke();
    }
    for (let i = 0; i < 26; i++) { const x = r() * e.W, y = r() * e.H, a = r() * 6.28, L = 1.5 + r() * 4; k.strokeStyle = "#8f806b"; k.globalAlpha = 0.25 + r() * 0.3; k.lineWidth = 0.6 + r() * 0.5; k.beginPath(); k.moveTo(x, y); k.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); k.stroke(); }
    k.globalAlpha = 1; g.touch(0, 0, e.W, e.H);
  });
};

// ---------------------------------------------------------------- the willow
// the bough: in from the right edge, drooping a little as it thins toward the left, in two
// strokes (the brush reloaded at the fork where the bird sits)
const BOUGH: Brush[] = [
  { ctrl: [[1100, 470], [980, 500], [860, 540], [740, 580], [640, 606]], w: 22, ink: NONG, press: [[0, 1], [0.1, 1.05], [0.5, 0.85], [0.95, 0.9], [1, 0.8]], load: 1.05, dry: 0.11, edge: 0.4, split: 0.6, bleed: 0.7, slow: [[0.02, 0.5], [0.98, 0.5]], seed: 10 },
  { ctrl: [[644, 606], [560, 624], [470, 640], [380, 660], [300, 690]], w: 13, ink: NONG, press: [[0, 1], [0.3, 0.85], [0.8, 0.5], [1, 0.12]], load: 0.95, dry: 0.16, edge: 0.3, split: 0.6, bleed: 0.6, slow: [[0.02, 0.5]], seed: 11 },
  // a short twig off the bough, and dark knot dots
  { ctrl: [[860, 540], [880, 590], [890, 640]], w: 6, ink: ZHONG, press: [[0, 1], [1, 0.2]], load: 1, dry: 0.2, split: 0.4, bleed: 0.5, slow: [[0.02, 0.5]], hairs: 10, seed: 12 },
  ...([] as P[]).map(([x, y], i): Brush => ({ ctrl: [[x, y], [x + 3, y + 2]], w: 6 + (i % 2) * 3, ink: JIAO, press: [[0, 0.9], [1, 0.8]], load: 1, dry: 0, edge: 0, split: 0, bleed: 0.8, slow: [[0.5, 0.5]], hairs: 10, seed: 20 + i })),
];
// hanging strands: a long falling stroke each, light ink behind, heavier in front
type Strand = { ctrl: P[]; w: number; ink: number; seed: number };
const STRANDS: Strand[] = [
  { ctrl: [[1000, 480], [1006, 620], [1000, 780], [984, 940], [970, 1090]], w: 4, ink: DAN, seed: 40 },
  { ctrl: [[930, 500], [944, 650], [946, 800], [936, 930]], w: 3.6, ink: QING, seed: 41 },
  { ctrl: [[1060, 476], [1074, 640], [1078, 820], [1070, 1000]], w: 3.4, ink: QING, seed: 42 },
  { ctrl: [[860, 540], [850, 680], [846, 820], [852, 960], [862, 1080]], w: 4.4, ink: ZHONG, seed: 43 },
  { ctrl: [[760, 572], [746, 700], [744, 820], [752, 900]], w: 3.6, ink: DAN, seed: 44 },
  { ctrl: [[1080, 0], [1060, 140], [1048, 300], [1052, 470]], w: 3.4, ink: QING, seed: 45 },
  { ctrl: [[960, -10], [946, 120], [940, 260], [946, 380]], w: 3.4, ink: DAN, seed: 46 },
];
const strand = (s: Strand): Brush => ({ ctrl: s.ctrl, w: s.w, ink: s.ink, press: [[0, 1], [0.6, 0.8], [1, 0.25]], load: 1, dry: 0.12, edge: 0, split: 0.3, bleed: 0.5, slow: [[0.01, 0.4]], hairs: 8, seed: s.seed });
// a willow leaf: narrow, lanceolate, one quick press-and-lift hanging off the strand
const leaf = (base: P, deg: number, len: number, w: number, ink: number, seed: number): Brush => {
  const a = (deg * Math.PI) / 180, d: P = [Math.cos(a), Math.sin(a)], n: P = [-d[1], d[0]], bend = (seed % 2 ? 1 : -1) * len * 0.08;
  const q = (t: number, s: number): P => [base[0] + d[0] * len * t + n[0] * s, base[1] + d[1] * len * t + n[1] * s];
  return { ctrl: [q(0, 0), q(0.35, bend * 0.7), q(0.7, bend), q(1, bend * 0.4)], w, ink, press: [[0, 0.15], [0.12, 0.6], [0.35, 1], [0.7, 0.6], [1, 0.02]], load: 1, dry: 0.1, edge: -0.3, split: 0.5, bleed: 0.5, slow: [[0.03, 0.45]], hairs: 10, seed };
};
// leaves along a strand: point at a fraction of the way down, alternating sides, angled down
const strandLeaves = (s: Strand, count: number, from: number, to: number): Brush[] => {
  const r = rng(s.seed * 13 + 1), out: Brush[] = [];
  for (let i = 0; i < count; i++) {
    const t = from + ((to - from) * (i + r() * 0.5)) / count, seg = Math.min(s.ctrl.length - 2, Math.floor(t * (s.ctrl.length - 1))), f = t * (s.ctrl.length - 1) - seg;
    const p: P = [s.ctrl[seg][0] + (s.ctrl[seg + 1][0] - s.ctrl[seg][0]) * f, s.ctrl[seg][1] + (s.ctrl[seg + 1][1] - s.ctrl[seg][1]) * f];
    const side = r() < 0.5 ? 1 : -1, ang = 90 + side * (8 + r() * 38) + 12;
    out.push(leaf(p, ang, 30 + r() * 30, 6.5 + r() * 4, Math.min(1, s.ink + 0.08 + r() * 0.08), s.seed * 100 + i));
  }
  return out;
};
const LEAVES: Brush[] = [
  ...strandLeaves(STRANDS[1], 9, 0.1, 0.95), ...strandLeaves(STRANDS[2], 8, 0.1, 0.95), ...strandLeaves(STRANDS[5], 7, 0.2, 1),
  ...strandLeaves(STRANDS[0], 12, 0.1, 0.98), ...strandLeaves(STRANDS[4], 7, 0.15, 1), ...strandLeaves(STRANDS[6], 6, 0.25, 1),
  ...strandLeaves(STRANDS[3], 13, 0.08, 0.98),
  // a few leaves straight off the bough, near the bird, in heavy ink
  leaf([700, 590], 104, 50, 9, ZHONG, 300), leaf([706, 592], 128, 44, 8.5, ZHONG, 301), leaf([620, 612], 96, 42, 8, DAN, 302),
  leaf([380, 660], 118, 46, 8, ZHONG, 303), leaf([372, 664], 92, 40, 7.5, DAN, 304), leaf([320, 682], 136, 42, 7.5, ZHONG, 305),
];

// ---------------------------------------------------------------- the swallow
// Authored in its own frame: origin where the toes grip the bough, x toward the tail, y up is
// negative, facing LEFT. The body sits about 30 degrees off horizontal, tail down to the right.
const PERCH: P = [560, 622];
const S = 2.5;
const LOWER = 4.5; // the body settles onto the bough: everything but the feet sits this much lower than authored
const sp = (pts: [number, number][], dy = LOWER): P[] => pts.map(([x, y]) => [PERCH[0] + x * S, PERCH[1] + (y + dy) * S]);
const bird = (ink: number, ctrl: [number, number][], w: number, press: [number, number][], seed: number, o: Partial<Brush> = {}): Brush => ({ ctrl: sp(ctrl), w: w * S, ink, press, load: 1, dry: 0.16, edge: 0, split: 0.4, bleed: 0.5, slow: [[0.02, 0.4]], hairs: Math.max(8, Math.round(w * S * 1.1)), seed, ...o });
const SWALLOW: Brush[] = [
  // beak: short and flat, two scorched hairlines, the gape just open
  bird(JIAO, [[-37, -50.5], [-41.5, -50], [-45.5, -48.8]], 1.7, [[0, 1], [0.6, 0.7], [1, 0.1]], 700, { dry: 0.05, bleed: 0.2, slow: [], hairs: 8 }),
  bird(JIAO, [[-37, -47.8], [-41, -47.6], [-44, -47.9]], 1.2, [[0, 1], [1, 0.1]], 701, { dry: 0.05, bleed: 0.2, slow: [], hairs: 6 }),
  // the head: one loaded dab of scorched ink over the crown, dragged back to the nape
  bird(JIAO, [[-33, -53.5], [-29.5, -56.2], [-24.5, -56.4], [-20, -54], [-17.5, -50.5]], 7.5, [[0, 0.5], [0.2, 1], [0.7, 1], [1, 0.55]], 703, { load: 1.1, dry: 0.4, streak: true, edge: 0.2, split: 0.6, bleed: 0.8, slow: [[0.05, 0.6]] }),
  // the eye: a tiny dot of scorched ink with a fleck of paper left above it
  bird(JIAO, [[-31.2, -51.6], [-31.9, -51], [-31.6, -50.3], [-30.8, -50.5], [-30.9, -51.3]], 1.3, [[0, 1], [1, 1]], 702, { dry: 0, bleed: 0.15, slow: [], hairs: 6 }),
  // the chestnut forehead and throat: heavy ink, pressed and lifted, wet so it bleeds softly
  bird(ZHONG, [[-35.8, -52.6], [-34, -53.6], [-32.2, -54.2]], 2.2, [[0, 0.7], [0.5, 1], [1, 0.4]], 704, { dry: 0.1, bleed: 0.6, hairs: 8 }),
  bird(ZHONG, [[-36.2, -47], [-34.5, -43.5], [-31, -40.2], [-27, -38.8]], 5.5, [[0, 0.6], [0.3, 1], [0.8, 0.9], [1, 0.4]], 705, { dry: 0.15, bleed: 0.8, slow: [[0.1, 0.6]], wet: 0.25 }),
  // the dark cheek: the cap runs down behind the eye to meet the breast band
  bird(NONG, [[-27, -51], [-26, -46], [-24.5, -41], [-23, -37.5]], 4, [[0, 0.6], [0.4, 1], [1, 0.5]], 708, { dry: 0.3, streak: true, split: 0.7, bleed: 0.5 }),
  // the dark breast band: a side-pressed stroke of thick ink across the chest below the throat
  bird(NONG, [[-31.5, -38.4], [-27, -36.4], [-22, -36], [-18, -37.5]], 4, [[0, 0.5], [0.4, 1], [1, 0.3]], 706, { dry: 0.35, streak: true, split: 0.7, bleed: 0.5 }),
  // the back: the brush on its side, from nape to rump, breaking into dry streaks: the gloss
  bird(NONG, [[-23, -55], [-8, -51], [6, -44], [16, -36]], 10, [[0, 0.5], [0.18, 1], [0.8, 0.9], [1, 0.4]], 707, { load: 1.05, dry: 0.55, streak: true, edge: 0.4, split: 0.85, bleed: 0.6 }),
  // the folded wing: the coverts as one pressed stroke, then two long primaries, scorched, the
  // longest crossing past the rump to a fine point
  bird(NONG, [[-20, -45], [-6, -40.5], [8, -34], [20, -27]], 8.5, [[0, 0.5], [0.2, 1], [0.8, 0.8], [1, 0.3]], 710, { load: 1, dry: 0.5, streak: true, edge: 0.35, split: 0.85, bleed: 0.5 }),
  bird(JIAO, [[-10, -44.5], [10, -36], [30, -25], [50, -12.5], [62, -5]], 4, [[0, 0.6], [0.15, 1], [0.6, 0.8], [1, 0.03]], 711, { dry: 0.32, split: 0.6, bleed: 0.3, hairs: 12 }),
  bird(JIAO, [[-8, -39], [12, -30.5], [30, -20.5], [46, -10], [56, -3]], 3.2, [[0, 0.6], [0.15, 1], [0.6, 0.75], [1, 0.03]], 712, { load: 0.95, dry: 0.4, split: 0.7, bleed: 0.3, hairs: 10 }),
  // the tail: the deep fork, two outer streamers in scorched hairline running far past the
  // wingtips, the inner feathers short and pale between them
  bird(ZHONG, [[16, -30], [26, -22], [36, -13]], 5, [[0, 0.8], [0.4, 1], [1, 0.3]], 715, { dry: 0.6, streak: true, split: 0.9, bleed: 0.3 }),
  bird(JIAO, [[18, -31], [36, -18], [56, -3], [76, 12], [92, 24]], 1.6, [[0, 1], [0.3, 0.75], [1, 0.03]], 716, { dry: 0.08, split: 0.3, bleed: 0.2, slow: [], hairs: 6 }),
  bird(JIAO, [[17, -27], [32, -12], [48, 4], [62, 18], [72, 30]], 1.4, [[0, 1], [0.3, 0.7], [1, 0.03]], 717, { dry: 0.1, split: 0.3, bleed: 0.2, slow: [], hairs: 6 }),
  // the breast and belly: one pale hairline down the front, then one clear wash along the
  // underside away from the light; the rest of the belly is bare paper
  bird(DAN, [[-26.5, -35], [-24, -26], [-18.5, -17.5], [-11, -12.5]], 1.2, [[0, 0.3], [0.5, 1], [1, 0.2]], 718, { dry: 0.1, bleed: 0.3, slow: [], hairs: 5 }),
  bird(QING, [[-20, -14.5], [-8, -10.5], [4, -11.5], [14, -17], [20, -24]], 5.5, [[0, 0.35], [0.2, 1], [0.75, 0.8], [1, 0.2]], 719, { load: 1, dry: 0.5, streak: true, edge: -0.2, split: 0.8, bleed: 1.1, slow: [[0.04, 1]] }),
  // the undertail, a dry touch under the rump where the streamers leave the body
  bird(DAN, [[8, -14], [14, -18], [19, -24.5]], 3, [[0, 0.4], [0.5, 1], [1, 0.3]], 720, { dry: 0.7, streak: true, split: 0.9, bleed: 0.3 }),
];
// short legs out of the belly feathers, toes wrapping over the bough, authored on the bough itself
const toe = (ctrl: [number, number][], w: number, seed: number): Brush => ({ ...bird(JIAO, ctrl, w, [[0, 0.9], [0.7, 1], [1, 0.35]], seed, { dry: 0.05, bleed: 0.2, slow: [] }), ctrl: sp(ctrl, 0) });
const FEET: Brush[] = [
  toe([[-6, -5.5], [-5.5, -3], [-5, -0.5]], 1, 730), toe([[1, -5.5], [1.5, -3], [2, -0.5]], 1, 731),
  toe([[-5, -0.5], [-9, 0.4], [-12, 2.8]], 0.8, 732), toe([[2, -0.5], [-2, 0.6], [-4.5, 3]], 0.8, 733), toe([[-5, -0.5], [-1.5, 1.6], [0.5, 4]], 0.75, 734), toe([[2, -0.5], [5, 1.2], [6.5, 4]], 0.7, 735),
];

// the far swallow: high in the empty sky, light ink, scythe wings swept back, fork open
const FAR: P = [300, 250];
const far = (ink: number, ctrl: [number, number][], w: number, press: [number, number][], seed: number): Brush => ({ ctrl: ctrl.map(([x, y]) => [FAR[0] + x, FAR[1] + y] as P), w, ink, press, load: 1, dry: 0.2, edge: 0, split: 0.4, bleed: 0.4, slow: [[0.02, 0.4]], hairs: 10, seed });
const FLYER: Brush[] = [
  far(ZHONG, [[0, 0], [-12, -10], [-30, -22], [-52, -28]], 6, [[0, 1], [0.3, 0.9], [1, 0.03]], 800),   // the far wing, swept up and back
  far(ZHONG, [[2, 2], [16, -2], [34, -12], [58, -16]], 6.5, [[0, 1], [0.3, 0.9], [1, 0.03]], 801),      // the near wing
  far(NONG, [[-6, 2], [0, 0.5], [6, 2.5], [10, 5]], 6, [[0, 0.8], [0.4, 1], [1, 0.5]], 802),             // head and body
  far(DAN, [[9, 5], [16, 14], [20, 26]], 1.5, [[0, 1], [1, 0.05]], 803), far(DAN, [[9, 5], [12, 15], [10, 27]], 1.4, [[0, 1], [1, 0.05]], 804), // the forked tail
];

// ---------------------------------------------------------------- the seal
const SEAL = { x: 116, y: 880, s: 72 };
const GLYPHS: [number, number][][][] = [
  [[[0.14, 0.18], [0.86, 0.18]], [[0.5, 0.18], [0.5, 0.86]], [[0.2, 0.52], [0.8, 0.52]], [[0.18, 0.86], [0.82, 0.86]]],
  [[[0.18, 0.12], [0.18, 0.88], [0.82, 0.88]], [[0.18, 0.4], [0.7, 0.4], [0.7, 0.66]], [[0.46, 0.12], [0.46, 0.4]]],
  [[[0.12, 0.24], [0.88, 0.24]], [[0.3, 0.24], [0.3, 0.84]], [[0.7, 0.24], [0.7, 0.84]], [[0.3, 0.56], [0.7, 0.56]]],
  [[[0.2, 0.16], [0.8, 0.16], [0.8, 0.84], [0.2, 0.84], [0.2, 0.42], [0.58, 0.42], [0.58, 0.62]]],
];
const seal = (g: Gfx) => {
  const { x, y, s } = SEAL, r = rng(901);
  g.group("plain", () => {
    const k = g.cur; g.touch(x - 4, y - 4, x + s + 4, y + s + 4);
    k.fillStyle = "#b8352b"; k.globalAlpha = 0.92; k.beginPath();
    const edge: P[] = []; for (let i = 0; i < 40; i++) { const t = i / 10, side = Math.floor(t), f = t - side, j = (fractal(902, i, 0, 0.7, 0.7, 2) - 0.5) * 2.2; edge.push(side === 0 ? [x + s * f, y + j] : side === 1 ? [x + s + j, y + s * f] : side === 2 ? [x + s * (1 - f), y + s + j] : [x + j, y + s * (1 - f)]); }
    edge.forEach(([a, b], i) => (i ? k.lineTo(a, b) : k.moveTo(a, b))); k.closePath(); k.fill();
    // the carving: cut into the stone, so it prints as paper
    k.globalCompositeOperation = "destination-out"; k.globalAlpha = 1; k.lineCap = "square"; k.lineJoin = "miter";
    const cell = (s - 12) / 2, order = [[1, 0], [1, 1], [0, 0], [0, 1]];
    GLYPHS.forEach((gl, gi) => { const [cx, cy] = order[gi], ox = x + 6 + cx * cell, oy = y + 6 + cy * cell; gl.forEach((ln) => { k.lineWidth = cell * 0.13 * (0.9 + r() * 0.25); k.beginPath(); ln.forEach(([u, v], i) => { const px = ox + cell * (0.08 + u * 0.84) + (r() - 0.5) * 0.8, py = oy + cell * (0.08 + v * 0.84) + (r() - 0.5) * 0.8; i ? k.lineTo(px, py) : k.moveTo(px, py); }); k.stroke(); }); });
    k.lineWidth = 1.6; k.strokeRect(x + 3.2, y + 3.2, s - 6.4, s - 6.4);
    for (let i = 0; i < 90; i++) { const px = x + r() * s, py = y + r() * s, lighter = fractal(903, px, py, 0.06, 0.06, 2); if (lighter < 0.52) continue; k.globalAlpha = (lighter - 0.5) * 1.4; k.beginPath(); k.arc(px, py, 0.5 + r() * 1.3, 0, 6.28); k.fill(); }
    k.globalCompositeOperation = "source-over"; k.globalAlpha = 1;
  }, { blend: "multiply", alpha: 1, textures: ["risoSpeck"] });
};

export const drawAndorinha = (ctx: Ctx, _frame: number, env: Env) => {
  const g = new Gfx(ctx, env, 0, SUMI_M);
  ground(g);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const fit = Math.min(env.W, env.H) / 1080;
  g.push((env.W - 1080 * fit) / 2, (env.H - 1080 * fit) / 2, fit);
  // back strands first (they sit behind the bough), then the bough, the front strands, leaves
  [1, 2, 5, 6, 0, 4].forEach((i) => brush(g, strand(STRANDS[i])));
  BOUGH.forEach((b) => brush(g, b));
  brush(g, strand(STRANDS[3]));
  LEAVES.forEach((b) => brush(g, b));
  [...SWALLOW, ...FEET].forEach((b) => brush(g, b));
  FLYER.forEach((b) => brush(g, b));
  seal(g);
  g.pop();
  g.paper("paper", 0.1); g.paper("coldpress", 0.045);
};

export const andorinha: Film = {
  meta: { title: "andorinha no salgueiro · sumi-e", W: 1080, H: 1080, fps: 30, bpm: 60, durationFrames: 1, raster: "cpu" },
  assets: { images: {} },
  shots: [{ id: "andorinha", start: 0, end: 1, draw: drawAndorinha }],
};
