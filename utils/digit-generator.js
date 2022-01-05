module.exports = (max) => String(Math.round(Math.random() * 10 ** max)).padEnd(max, '0') - 0;
