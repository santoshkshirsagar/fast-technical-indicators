export class NumberFormatter {
  private precision: number;

  constructor(precision: number = 2) {
    this.precision = precision;
  }

  format(value: number): number {
    if (typeof value !== 'number' || !isFinite(value)) {
      return value;
    }

    return parseFloat(value.toFixed(this.precision));
  }

  static format(value: number, precision: number = 2): number {
    if (typeof value !== 'number' || !isFinite(value)) {
      return value;
    }

    return parseFloat(value.toFixed(precision));
  }

  static formatArray(values: number[], precision: number = 2): number[] {
    return values.map(value => NumberFormatter.format(value, precision));
  }

  setPrecision(precision: number): void {
    this.precision = precision;
  }

  getPrecision(): number {
    return this.precision;
  }
}

// Utility function for direct formatting
export function formatNumber(value: number, precision: number = 2): number {
  return NumberFormatter.format(value, precision);
}

export function formatNumbers(values: number[], precision: number = 2): number[] {
  return NumberFormatter.formatArray(values, precision);
}