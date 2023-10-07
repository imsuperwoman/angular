import Tween from '@classes/tween.class';
import JsEasings from '@constants/js-easings.constant';

export default (targetScrollPosition: number): void => {
  if (window) {
    new Tween({
      from: {
        scrollY: window.scrollY,
      },
      to: {
        scrollY: targetScrollPosition,
      },
      onStep: (step: any) => {
        window.scrollTo(window.scrollX, step.scrollY);
      },
      easing: JsEasings.EaseOutQuint,
      duration: 800,
    }).start();
  }
};
