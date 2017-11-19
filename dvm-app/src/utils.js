export const clampInt = (num, min, max) => {
  return typeof num === 'number' ? Math.min(Math.max(num, min), max) : num;
};

// Converts a string of hex ('#rrggbb') to rgb and returns it ('rrr,ggg,bbb')
export const hexToRgb = hex => {
  const hexString = hex.indexOf('#') === 0 ? hex.slice(1) : hex;
  const hexInt = parseInt(hexString, 16);
  const r = (hexInt >> 16) & 255;
  const g = (hexInt >> 8) & 255;
  const b = hexInt & 255;

  return `${r},${g},${b}`;
};

// Converts a string of rgb ('rrr,ggg,bbb') to hex and returns it ('#rrggbb')
export const rgbToHex = rgb => {
  const rgbArr = rgb.split(',');
  const red = parseInt(rgbArr[0]);
  const green = parseInt(rgbArr[1]);
  const blue = parseInt(rgbArr[2]);
  const rgbVal = blue | (green << 8) | (red << 16);

  return '#' + (0x1000000 + rgbVal).toString(16).slice(1);
};

// Returns the appropriate color for a text superimposed on a background with
// color hex
export const getTextContrastColorForHex = hex => {
  const hexString = hex.indexOf('#') === 0 ? hex.slice(1) : hex;

  return (parseInt(hexString, 16) > 0xffffff / 2) ? 'black' : 'white';
};

export const slugify = str => {
  let slug = str.replace(/^\s+|\s+$/g, ''); // Trim whitespaces
  const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
  const to = 'aaaaaeeeeeiiiiooooouuuunc------';
  slug = slug.toLowerCase();

  if (slug.charAt(0) === '/') {
    slug = slug.substring(1);
  }

  // Remove accents, swap ñ for n, etc
  for (let i = 0, l = from.length; i < l; i += 1) {
    slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  slug = slug.replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Collapse whitespace and replace by -
    .replace(/-+/g, '-'); // Collapse dashes

  return slug;
};

export const deSlugify = str => {
  let returnStr = str.replace(/-/g, ' ');

  returnStr = `${returnStr.charAt(0).toUpperCase()}${returnStr.slice(1)}`;

  return returnStr;
};
