const typescript = require('rollup-plugin-typescript2');

module.exports = [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfig: 'tsconfig.json'
      })
    ]
  },
  // CommonJS build  
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfig: 'tsconfig.json'
      })
    ]
  }
];