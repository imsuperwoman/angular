export default (str: string): void => {
  // From https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  const el = document.createElement('textarea');
  el.style.width = '0px';
  el.style.height = '0px';
  el.style.position = 'absolute';
  el.style.top = '-999px';
  el.style.left = '-999px';
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
