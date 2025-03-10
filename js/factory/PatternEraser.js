class PatternEraser {
    static removeSolids(vrmlText) {

        const solidShapeRegex = /#---------- SOLID:[\s\S]*?Shape\s*{[\s\S]*?geometry\s+IndexedFaceSet\s*{[\s\S]*?solid\s+FALSE[\s\S]*?}[\s\S]*?}/g;

        return vrmlText.replace(solidShapeRegex, '');
    }

}

export { PatternEraser }