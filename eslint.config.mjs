import playwright from 'eslint-plugin-playwright'

const playwrightConfig = [
    {
        files: ['src/tests/**.ts'],
        ...playwright.configs['flat/recommended'],
    },
]

const eslintConfig = [...playwrightConfig]

export default eslintConfig
