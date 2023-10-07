import JsEasings from '@constants/js-easings.constant';

export default class Tween {
  params: any = {
    duration: 400,
    easing: JsEasings.EaseOutExpo,
  };
  timer: any;

  constructor(params: any) {
    this.params = {
      ...this.params,
      ...params,
    };
  }

  start() {
    let params = this.params;
    let start: number = Date.now();
    let timer: any = setInterval(() => {
      let time: number = Date.now() - start;
      let current: any = {};

      for (let i in params.from) {
        current[i] = params.easing(
          time,
          params.from[i],
          params.to[i] - params.from[i],
          params.duration
        );
      }

      params.onStep(current);

      if (time >= params.duration) {
        clearInterval(timer);
        if (typeof params.onComplete === 'function') params.onComplete();
      }
    }, 1000 / 60);

    this.timer = timer;
  }

  stop() {
    clearInterval(this.timer);
  }
}
