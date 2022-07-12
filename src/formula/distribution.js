export function arrival(ui, _threshold) {
  const arrivalConstant = 8;
  return Math.abs(Math.log(1 - ui)) * arrivalConstant;
}

export function taskDistribution(ui, threshold = 0.6) {
  return 0 <= ui && ui <= threshold ? 1 : 2;
}

export function distribution({ a, c, m, totalTask, func, threshold = 0.6 }) {
  let initial = 1;
  const distributions = [];

  for (let i = 1; i <= totalTask; i++) {
    const first = a * initial + c;
    const zi = first % m;
    const ui = zi / m;

    const value = func(ui, threshold);
    initial = zi;

    distributions.push({ i, first, zi, ui, value: value });
  }

  return distributions;
}
