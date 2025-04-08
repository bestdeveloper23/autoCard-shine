class PatternModifier {
    static removeSolids(vrmlText) {

        const solidShapeRegex = /#---------- SOLID:[\s\S]*?Shape\s*{[\s\S]*?geometry\s+IndexedFaceSet\s*{[\s\S]*?solid\s+FALSE[\s\S]*?}[\s\S]*?}/g;

        return vrmlText.replace(solidShapeRegex, '');
    }

    static addDEFTokens(vrmlText) {
        return vrmlText.replace(/(#---------- SOLID: (\w+):\d+\s*)\n(\s*)Shape \{/g, (match, comment, solidName, indent) => {
            return `${comment}\n${indent}DEF ${solidName} Shape {`;
        });
    }

    static removeAxes(vrmlText) {
        const axesSolidRegex = /#---------- SOLID: Axes[\s\S]*?Shape\s*{[\s\S]*?geometry\s+IndexedFaceSet\s*{[\s\S]*?solid\s+FALSE[\s\S]*?}[\s\S]*?}/g;
        return vrmlText.replace(axesSolidRegex, '');
    }

}

export { PatternModifier }