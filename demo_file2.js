function calculateSum(a, b, c = 0) {
  return a + b + c;
}

function multiplyNumbers(x, y) {
  return x * y;
}

function divideNumbers(x, y) {
  if (y === 0) {
    throw new Error('Division by zero');
  }
  return x / y;
}

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
];

console.log('Application started with enhanced features');
