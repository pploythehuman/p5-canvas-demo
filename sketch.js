const bgSketch = {
  $footer: document.getElementById('footer_bg'),
  config: {
    hash: 'oo6sSpnzSDBVCD5pw4JK9nvTCZduncGhr3wLtfmuY1hx1UUWFxk',
    enableFPS: true,
    bgColor: {r: 89, g: 2, b: 47},
    bgColorHSB: [329, 98, 35],
    easeScalar: 0.26,
    stripeZoom: Math.max(window.innerWidth, window.innerHeight) / 800,
    stripeCount: 250
  },
  init(winWidth, winHeight) {
    this.sketch = new p5(
      this.setUpP5.bind(this),
      document.getElementById('footer_bg')
    );
    this.p5 = undefined;
    this.animating = true;
    this.winWidth = winWidth;
    this.winHeight = winHeight
  },

  setUpP5(p5Fn) {
    const that = this;
    this.p5 = p5Fn;

    this.p5.setup = () => {
      //INLINE
			//---- do not edit the following code (you can indent as you wish)
			let alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
			var fxhash =
        that.config.hash ||
				'oo' +
					Array(49)
						.fill(0)
						.map((_) => alphabet[(Math.random() * alphabet.length) | 0])
						.join('');
			let b58dec = (str) => [...str].reduce((p, c) => (p * alphabet.length + alphabet.indexOf(c)) | 0, 0);
			let fxhashTrunc = fxhash.slice(2);
			let regex = new RegExp('.{' + ((fxhash.length / 4) | 0) + '}', 'g');
			let hashes = fxhashTrunc.match(regex).map((h) => b58dec(h));
			let sfc32 = (a, b, c, d) => {
				return () => {
					a |= 0;
					b |= 0;
					c |= 0;
					d |= 0;
					var t = (((a + b) | 0) + d) | 0;
					d = (d + 1) | 0;
					a = b ^ (b >>> 9);
					b = (c + (c << 3)) | 0;
					c = (c << 21) | (c >>> 11);
					c = (c + t) | 0;
					return (t >>> 0) / 4294967296;
				};
			};
			var fxrand = sfc32(...hashes);

			window.$fx = {
				hash: fxhash,
				rand: fxrand,
			};

      //PARAMS
      window.fx = $fx;
      window.fxhash = $fx.hash;
      window.fxrand = $fx.rand;
      window.rand = fxrand;
      window.seed = parseInt(1e7 * fxrand());

      //UTILS
      let mapValue = (t, e, n, a, i) => (((t = Math.min(Math.max(t, e), n)) - e) * (i - a)) / (n - e) + a;
      const pmap = (t, e, n, a, i, r) => (r ? Math.min(Math.max(((t - e) / (n - e)) * (i - a) + a, a), i) : ((t - e) / (n - e)) * (i - a) + a);
      let R = (t = 1) => Math.random() * t,
        L = (t, e) => (t * t + e * e) ** 0.5;

      // PiterNoise
      /*! For license information please see piterNoise.js.LICENSE.txt */
      const noiseCanvasWidth = 1;
      const noiseCanvasHeight = 1;

      function oct(n, i, o, r, a = 1) {
        let s = 0;
        let t = 1;
        r *= a;
        for (let e = 0; e < a; e++) {
          s += n2(n, i, o * t, r + e) / t;
          t *= 2;
        }
        return s;
      }

      let { sin, cos, imul, PI } = Math;
      let TAU = 2 * PI;
      let F = (n, i) => [...Array(n)].map((_, o) => i(o));
      let S = Uint32Array.of(9, 7, 5, 3);

      let R2 = (n = 1) => {
        n *= S[3];
        S[3] = S[2];
        S[2] = S[1];
        n ^= n << 11;
        S[0] ^= n ^ (n >>> 8) ^ (S[1] = S[0]) >>> 19;
        return S[0] / 2 ** 32;
      };

      [...(seed + "ThxPiter")].map((n) => R2((S[3] ^= 23205 * n.charCodeAt())));

      const KNUTH = 2654435761;
      const NSEED = R2(2 ** 32);

      const ri = (n, i, o) => {
        n = imul((((1023 & n) << 20) | ((1023 & i) << 10) | (1023 & (n ^ i ^ o))) ^ NSEED, KNUTH);
        n <<= 3 + (n >>> 29);
        return (n >>> 1) / 2 ** 31 - 0.5;
      };

      const no = F(99, () => R2(1024));

      const n3 = (n, i, o, r, a, s = Math.floor((n = n * r + no[(a *= 3)])), t = Math.floor((i = i * r + no[a + 1])), e = Math.floor((o = o * r + no[a + 2]))) => {
        n -= s;
        i -= t;
        o -= e;
        n *= n * (3 - 2 * n);
        i *= i * (3 - 2 * i);
        o *= o * (3 - 2 * o);
        return (
          ri(s, t, e) * (1 - n) * (1 - i) * (1 - o) +
          ri(s, t, e + 1) * (1 - n) * (1 - i) * o +
          ri(s, t + 1, e) * (1 - n) * i * (1 - o) +
          ri(s, t + 1, e + 1) * (1 - n) * i * o +
          ri(s + 1, t, e) * n * (1 - i) * (1 - o) +
          ri(s + 1, t, e + 1) * n * (1 - i) * o +
          ri(s + 1, t + 1, e) * n * i * (1 - o) +
          ri(s + 1, t + 1, e + 1) * n * i * o
        );
      };

      const na = F(99, () => R2(TAU));
      const ns = na.map(sin);
      const nc = na.map(cos);
      const nox = F(99, () => R2(1024));
      const noy = F(99, () => R2(1024));

      const n2 = (n, i, o, r, a = nc[r] * o, s = ns[r] * o, t = p5Fn.floor((([n, i] = [(n - noiseCanvasWidth / 2) * a + (i - 2 * noiseCanvasHeight) * s + nox[r], (i - 2 * noiseCanvasHeight) * a - (n - noiseCanvasWidth / 2) * s + noy[r]]), n)), e = p5Fn.floor(i)) => {
        n -= t;
        i -= e;
        n *= n * (3 - 2 * n);
        i *= i * (3 - 2 * i);
        return ri(t, e, r) * (1 - n) * (1 - i) + ri(t, e + 1, r) * (1 - n) * i + ri(t + 1, e, r) * n * (1 - i) + ri(t + 1, e + 1, r) * n * i;
      };

      const ZZ = (n, i, o, r) => {
        if (n < 0) return n;
        if (n > (o *= 4 * r)) return n - o;
        n /= r;
        return (fract(n / 4) < 0.5 ? r : -r) * (1 - ((n = Math.abs(fract(n / 2) - 0.5)) > i ? 2 * n : n * (n /= i) * n * (2 - n) + i));
      };

      // MOVER
      class Mover {
        constructor(i, t, s, h, e, r, a, n, p, o, c, x, d, l, u, v, y) {
          (this.x = i),
            (this.y = t),
            (this.initX = i),
            (this.initY = t),
            (this.prevX = i),
            (this.prevY = t),
            (this.posArr = []),
            (this.xi = s),
            (this.yi = h),
            (this.initHue = e),
            (this.initSat = [0, 10, 20, 20, 20, 30, 40, 40, 60, 80, 80, 90][Math.floor(12 * fxrand())]),
            (this.initBri = [40, 60, 70, 70, 80, 80, 80, 90, 100][Math.floor(9 * fxrand())]),
            (this.initAlpha = 40),
            (this.initS = 2 * that.config.stripeZoom),
            (this.hue = this.initHue),
            (this.sat = 0),
            (this.bri = 100),
            (this.a = this.initAlpha),
            (this.hueStep = 0),
            (this.s = this.initS),
            (this.scl1 = r),
            (this.scl2 = a),
            (this.ang1 = n),
            (this.ang2 = p),
            (this.seed = v),
            (this.xRandDivider = l),
            (this.yRandDivider = u),
            (this.xRandSkipper = 0),
            (this.yRandSkipper = 0),
            (this.xRandSkipperVal = 0),
            (this.yRandSkipperVal = 0),
            (this.xMin = o),
            (this.xMax = c),
            (this.yMin = x),
            (this.yMax = d),
            (this.oct = 1),
            (this.centerX = p5Fn.width / 2),
            (this.centerY = p5Fn.height / 2),
            (this.borderX = p5Fn.width / 1.75),
            (this.borderY = p5Fn.height / 1.75),
            (this.maxFrames = y),
            (this.uvalue = 5);
        }
        show() {
          if ((p5Fn.strokeWeight(this.s),
          p5Fn.stroke(this.hue, this.sat, this.bri, this.a),
          p5Fn.noFill(),
          p5Fn.beginShape(),
          this.posArr.length >= this.maxFrames - 1)) {
            p5Fn.curveVertex(this.initX, this.initY);
            p5Fn.curveVertex(this.initX, this.initY);
            for (let i = 0; i < this.posArr.length; i++) {
              p5Fn.curveVertex(this.posArr[i].x, this.posArr[i].y);
            }
            p5Fn.curveVertex(this.prevX, this.prevY);
            p5Fn.curveVertex(this.x, this.y);
          }
          p5Fn.endShape();
        }
        move(i, t) {
          (this.prevX = this.x),
          (this.prevY = this.y),
          this.posArr.push(p5Fn.createVector(this.x, this.y));
          let s = superCurve(this.x, this.y, this.xi, this.yi, this.scl1, this.scl2, this.ang1, this.ang2, this.seed, this.oct, this.clampvaluearray, this.uvalue);
          (this.x += (s.x * that.config.stripeZoom) / this.xRandDivider),
          (this.y += (s.y * that.config.stripeZoom) / this.yRandDivider);
        }
      }
      function superCurve(i, t, s, h, e, r, a, n, p, o, c, x) {
        let d,
          l,
          u = i + s,
          v = t + h,
          y = a,
          g = n,
          m = e,
          R = r;
        (d = oct(u, v, m, 0, o)),
          (l = oct(u, v, R, 2, o)),
          (u += d * y),
          (v += l * g),
          (d = oct(u, v, m, 1, o)),
          (l = oct(u, v, R, 3, o)),
          (u += d * y),
          (v += l * g),
          (d = oct(u, v, m, 1, o)),
          (l = oct(u, v, R, 2, o)),
          (u += d * y),
          (v += l * g);
        let M = oct(u, v, m, 0, o),
          S = oct(u, v, R, 1, o);
        return {
          x: pmap(S, pmap(u, 0, p5Fn.width, -10.0001, -1e-7), pmap(u, 0, p5Fn.width, 1e-7, 10.0001), -2, 2),
          y: pmap(M, pmap(v, 0, p5Fn.height, -10.0001, -1e-7), pmap(v, 0, p5Fn.height, 1e-7, 10.0001), -2, 2)
        };
      }

      ({sin, cos, imul, PI} = Math),
      TAU = 2 * PI,
      F = (e, a) => [...Array(e)].map(((e, i) => a(i)));

      let scl1, scl2, rseed, xMin, xMax, yMin, yMax, xRandDivider, yRandDivider, startTime, animationFrameId,
        movers = [],
        movers_pos = [],
        hue = 360 * fxrand(),
        W = window.innerWidth,
        H = window.innerHeight,
        maxFrames = 30,
        easeAng = 0,
        cycleCount = 0,
        xi = 0,
        yi = 0,
        xoff = 1000000 * fxrand(),
        yoff = 1000000 * fxrand(),
        axoff = 1000000 * fxrand(),
        ayoff = 1000000 * fxrand(),
        sxoff = 1000000 * fxrand(),
        syoff = 1000000 * fxrand(),
        elapsedTime = 0,
        drawing = !0;

      //SETUP FN
      const width = this.winWidth;
      const height = this.winHeight;

      p5Fn.createCanvas(width, height);
      p5Fn.rectMode(p5Fn.CENTER);
      p5Fn.colorMode(p5Fn.HSB, 360, 100, 100, 100);

      INIT();

      function INIT(e) {
        startTime = p5Fn.frameCount;
        p5Fn.randomSeed(1000000 * fxrand());
        p5Fn.noiseSeed(1000000 * fxrand());
        xMin = -.1;
        xMax = 1.1;
        yMin = -.1;
        yMax = 1.1;
        const borderXMin = -.1;
        const borderXMax = 1.1;
        const borderYMin = -.1;
        const borderYMax = 1.1;
        const xMinW = xMin * p5Fn.width;
        const xMaxW = xMax * p5Fn.width;
        const yMinH = yMin * p5Fn.height;
        const yMaxH = yMax * p5Fn.height;

        let a = Math.floor(that.config.stripeCount / 4);
        const i = -5;

        for (let e = 0; e < 4; e++) {
          switch (3 === e && (a += that.config.stripeCount % 4), e) {
            case 0:
              for (let e = 0; e < a; e++) {
                let r = p5Fn.map(e, 0, a - 1, xMinW - i, xMaxW + i),
                  n = yMinH - i;
                movers_pos.push({
                  x: r,
                  y: n
                })
              }
              break;
            case 1:
              for (let e = 0; e < a; e++) {
                let r = p5Fn.map(e, 0, a - 1, xMinW - i, xMaxW + i),
                  n = yMaxH + i;
                movers_pos.push({
                  x: r,
                  y: n
                })
              }
              break;
            case 2:
              for (let e = 0; e < a; e++) {
                let r = xMinW - i,
                  n = p5Fn.map(e, 0, a - 1, yMinH - i, yMaxH + i);
                movers_pos.push({
                  x: r,
                  y: n
                })
              }
              break;
            case 3:
              for (let e = 0; e < a; e++) {
                let r = xMaxW + i,
                  n = p5Fn.map(e, 0, a - 1, yMinH - i, yMaxH + i);
                movers_pos.push({
                  x: r,
                  y: n
                })
              }
          }
        }

        FRAME(e);
        animationManager();
      }

      function FRAME(e) {
        let a = p5Fn.radians(easeAng);
        scl1 = mapValue(cos(a), -1, 1, 0.00071, .0025, !0);
        scl2 = mapValue(cos(a), -1, 1, .0025, 0.00071, !0);
        const amplitude1 = parseInt(mapValue(cos(a), -1, 1, 1200, 1, !0));
        const amplitude2 = parseInt(mapValue(cos(a), -1, 1, 1, 1200, !0));
        xRandDivider = p5Fn.random([.025]),
        yRandDivider = p5Fn.random([.025]);
        easeAng += that.config.easeScalar;
        xoff += 0.000001;
        yoff += 0.000001;
        axoff += 0.00025;
        ayoff += 0.00025;
        sxoff += 0.00025;
        syoff += 0.00025;

        for (let a = 0; a < that.config.stripeCount; a++) {
          let i = movers_pos[a].x,
              r = movers_pos[a].y,
              n = hue + 2 * fxrand() - 1;

          n = n > 360 ? n - 360 : n < 0 ? n + 360 : n;
          movers.push(new Mover(i, r, xi, yi, n, scl1 / that.config.stripeZoom, scl2 / that.config.stripeZoom, amplitude1 * that.config.stripeZoom, amplitude2 * that.config.stripeZoom, xMin, xMax, yMin, yMax, xRandDivider, yRandDivider, e, maxFrames));
        }
      }


      function animationManager() {
        const drawIterator = drawGenerator();

        if (drawing && cycleCount < 1) {
          function animationLoop() {
            p5Fn.background(p5Fn.color(...that.config.bgColorHSB));

            if (that.animating && drawIterator.next().done) {
              cancelAnimationFrame(animationFrameId);

              for (let i = 0; i < that.config.stripeCount; i++) {
                movers[i].show();
              }

              drawing = false;
            } else {
              animationFrameId = requestAnimationFrame(animationLoop);
            }
          }

          animationLoop();
        }
      }

      function* drawGenerator() {
        let frameCount = 0;
        let totalFrames = 0;
        const framesPerStripe = maxFrames * that.config.stripeCount / 1;

        while (true) {
          if (that.animating) {
            // Check if the elapsed time exceeds the maximum frames and drawing is still in progress
            if (elapsedTime >= maxFrames && drawing) {
              drawing = false;
              return;
            }

            // Iterate over each stripe
            for (let stripeIndex = 0; stripeIndex < that.config.stripeCount; stripeIndex++) {
              // Check if the frame count exceeds the frames per stripe and drawing is still in progress
              if (frameCount > framesPerStripe && drawing) {
                frameCount = 0;
                yield;
              }

              // Get the current mover for the stripe
              const mover = movers[stripeIndex];

              // If drawing is in progress, show and move the mover
              if (drawing) {
                mover.show();
                mover.move();
              }

              // Increment the frame count
              frameCount++;
            }

            // Update the elapsed time
            elapsedTime = totalFrames - startTime;

            // Increment the total frames
            totalFrames++;

            // Check if the total frames is divisible by the maximum frames
            if (totalFrames % maxFrames === 0) {
              // Check if the cosine of the easeAng in radians is greater than or equal to 1
              if (cos(p5Fn.radians(easeAng)) >= 1) {
                cycleCount++;
              }

              // Reset movers, elapsed time, total frames, and call FRAME with rseed
              movers = [];
              elapsedTime = 0;
              totalFrames = 0;
              FRAME(rseed);
            }
          }
        }
      }
    };

    this.p5.windowResized = () => {
      const width = this.winWidth
      const height = this.winHeight

      p5Fn.resizeCanvas(width, height);
    };
  },

  start() {
    this.animating = true;
  },

  pause() {
    this.animating = false;
  }
};

export default bgSketch;
