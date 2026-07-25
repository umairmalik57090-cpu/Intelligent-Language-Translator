const { GoogleGenerativeAI } = require('@google/generative-ai');
const g = new GoogleGenerativeAI('test-key');
console.log('GoogleGenerativeAI own props:', Object.getOwnPropertyNames(g));
console.log('GoogleGenerativeAI prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(g)).sort());
if (g.getGenerativeModel) {
  console.log('getGenerativeModel exists');
}
