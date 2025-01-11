type UnitGroup = {
    units: string[]
    conversions: { [key: string]: number }
    baseUnit: string
    compatibleUnits: { [key: string]: string[] }
}

// Normalize unit strings to handle variations
const normalizeUnit = (unit: string): string => {
    const unitMap: { [key: string]: string } = {
        tablespoon: 'tbsp',
        tablespoons: 'tbsp',
        teaspoon: 'tsp',
        teaspoons: 'tsp',
        cups: 'cup',
        'tbsp.': 'tbsp',
        'tsp.': 'tsp',
        pound: 'lb',
        pounds: 'lb',
        ounce: 'oz',
        ounces: 'oz',
        'lb.': 'lb',
        'oz.': 'oz',
    }
    return unitMap[unit.toLowerCase()] || unit.toLowerCase()
}

export const unitGroups: { [key: string]: UnitGroup } = {
    volume: {
        units: ['tsp', 'tbsp', 'cup', 'fl oz', 'ml', 'l'],
        conversions: {
            tsp: 1,
            tbsp: 3,
            'fl oz': 6,
            cup: 48,
            ml: 4.93,
            l: 4929.4,
        },
        baseUnit: 'tsp',
        compatibleUnits: {
            tsp: ['tsp', 'tbsp', 'cup'],
            tbsp: ['tsp', 'tbsp', 'cup'],
            cup: ['cup', 'tbsp', 'tsp'],
            'fl oz': ['fl oz'],
            ml: ['ml', 'l'],
            l: ['ml', 'l'],
        },
    },
    weight: {
        units: ['g', 'kg', 'oz', 'lb'],
        conversions: {
            g: 1,
            kg: 1000,
            oz: 28.35,
            lb: 453.59,
        },
        baseUnit: 'g',
        compatibleUnits: {
            g: ['g', 'kg'],
            kg: ['g', 'kg'],
            oz: ['oz', 'lb'],
            lb: ['oz', 'lb'],
        },
    },
}

export const findUnitGroup = (unit: string): UnitGroup | null => {
    const normalizedUnit = normalizeUnit(unit)
    return (
        Object.values(unitGroups).find((group) =>
            group.units.includes(normalizedUnit),
        ) || null
    )
}

export const getCompatibleUnits = (unit: string): string[] => {
    const normalizedUnit = normalizeUnit(unit)
    const group = findUnitGroup(normalizedUnit)
    if (!group || !group.compatibleUnits[normalizedUnit]) return [unit]
    return group.compatibleUnits[normalizedUnit]
}

export const convertUnits = (
    value: number,
    fromUnit: string,
    toUnit: string,
): number | null => {
    const normalizedFromUnit = normalizeUnit(fromUnit)
    const normalizedToUnit = normalizeUnit(toUnit)
    const group = findUnitGroup(normalizedFromUnit)

    if (
        !group ||
        !group.conversions[normalizedFromUnit] ||
        !group.conversions[normalizedToUnit]
    ) {
        return null
    }

    // Convert to base unit first, then to target unit
    const baseValue = value * group.conversions[normalizedFromUnit]
    return baseValue / group.conversions[normalizedToUnit]
}

export const findBestUnit = (
    value: number,
    currentUnit: string,
): { value: number; unit: string } | null => {
    const normalizedUnit = normalizeUnit(currentUnit)
    const group = findUnitGroup(normalizedUnit)
    if (!group) return null

    // Get only compatible units for the current unit
    const compatibleUnits = group.compatibleUnits[normalizedUnit]
    if (!compatibleUnits) return null

    // Convert to base unit first
    const baseValue = value * group.conversions[normalizedUnit]

    let bestUnit = normalizedUnit
    let bestValue = value
    let closestToOne = Math.abs(value - 1)

    // Try each compatible unit and find the one that gives a value closest to 1
    for (const unit of compatibleUnits) {
        const convertedValue = baseValue / group.conversions[unit]
        const distanceFromOne = Math.abs(convertedValue - 1)

        // Update if this unit gives a value closer to 1
        if (distanceFromOne < closestToOne) {
            closestToOne = distanceFromOne
            bestUnit = unit
            bestValue = convertedValue
        }
    }

    return {
        value: Math.round(bestValue * 100) / 100,
        unit: bestUnit,
    }
}
