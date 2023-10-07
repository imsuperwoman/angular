// Easings gotten from http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js
export default {
  EaseInQuad(t: any, b: any, c: any, d: any) {
    return c * (t /= d) * t + b;
  },
  EaseOutQuad(t: any, b: any, c: any, d: any) {
    return -c * (t /= d) * (t - 2) + b;
  },
  EaseInOutQuad(t: any, b: any, c: any, d: any) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  },
  EaseInCubic(t: any, b: any, c: any, d: any) {
    return c * (t /= d) * t * t + b;
  },
  EaseOutCubic(t: any, b: any, c: any, d: any) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  EaseInOutCubic(t: any, b: any, c: any, d: any) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  },
  EaseInQuart(t: any, b: any, c: any, d: any) {
    return c * (t /= d) * t * t * t + b;
  },
  EaseOutQuart(t: any, b: any, c: any, d: any) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  EaseInOutQuart(t: any, b: any, c: any, d: any) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  },
  EaseInQuint(t: any, b: any, c: any, d: any) {
    return c * (t /= d) * t * t * t * t + b;
  },
  EaseOutQuint(t: any, b: any, c: any, d: any) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  EaseInOutQuint(t: any, b: any, c: any, d: any) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
  },
  EaseInSine(t: any, b: any, c: any, d: any) {
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
  },
  EaseOutSine(t: any, b: any, c: any, d: any) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  },
  EaseInOutSine(t: any, b: any, c: any, d: any) {
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
  },
  EaseInExpo(t: any, b: any, c: any, d: any) {
    return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  EaseOutExpo(t: any, b: any, c: any, d: any) {
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  },
  EaseInCirc(t: any, b: any, c: any, d: any) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  EaseOutCirc(t: any, b: any, c: any, d: any) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  EaseInOutCirc(t: any, b: any, c: any, d: any) {
    if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
};
