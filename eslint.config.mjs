import playwright from "eslint-plugin-playwright"

const playwrightConfig = [
    {
        files: ["src/tests/**.ts"],
        ...playwright.configs["flat/recommended"],
    },
]

const eslintConfig = [
    {
        files: ["src/tests/**.ts"],
        rules: {
            "react-hooks/rules-of-hooks": "off",
        },
    },
    ...playwrightConfig,
]

export default eslintConfig
