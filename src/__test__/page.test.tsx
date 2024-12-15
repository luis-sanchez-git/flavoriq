import { test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
    render(<Page />)
    screen.getByText(/save and see/i)
})