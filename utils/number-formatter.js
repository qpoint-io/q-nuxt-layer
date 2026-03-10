export function abbreviateNumber(value) {
  if (value >= 1000) {
    // suffix formats
    const suffixes = ["", "k", "m", "b", "t"];

    // determine which suffix to use based on number length
    let suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = '';

    // calculate the shortened value
    shortValue = value / Math.pow(1000, suffixNum);

    // if we're using a suffix (k, m, b, t), allow decimals
    if (shortValue >= 1) {
      shortValue = shortValue.toFixed(1);
      // remove trailing .0 if present
      shortValue = shortValue.endsWith('.0') ? shortValue.slice(0, -2) : shortValue;
    } else {
      // if less than 1, round up to the previous suffix with whole number
      suffixNum--;
      shortValue = (value / Math.pow(1000, suffixNum)).toFixed(0);
    }

    return [shortValue, suffixes[suffixNum]];
  }
  return [value.toString(), ''];
}

export function formatBytes(bytes) {
  // if the number is negative, flip the sign
  if (bytes < 0) {
    bytes = -bytes
  }

  if (bytes === 0) return { value: 0, unit: 'B' };

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return {
    value: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
    unit: sizes[i]
  };
}

export function formatDuration(ms) {
  // if the number is negative, flip the sign
  if (ms < 0) {
    ms = -ms
  }

  // if the number is a decimal, round it to nearest double digits
  if (ms % 1 !== 0) {
    ms = Math.round(ms * 100) / 100
  }

  if (ms < 1000) return { value: ms, unit: 'ms' };
  if (ms < 60000) return { value: (ms / 1000).toFixed(1), unit: 's' };
  if (ms < 3600000) {
    const minutes = Math.floor(ms / 60000);
    return { value: `${minutes}`, unit: 'min' };
  }
  const hours = Math.floor(ms / 3600000);
  return { value: `${hours}`, unit: 'h' };
}
