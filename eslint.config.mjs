import playwright from 'eslint-plugin-playwright'

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
})
const playwrightConfig = [
    ...compat.config({
        extends: ['next', 'prettier'],
    }),
    {
        ...playwright.configs['flat/recommended'],
        files: ['src/tests/**.ts'],
    },
]

const eslintConfig = [...playwrightConfig]

export default eslintConfig
