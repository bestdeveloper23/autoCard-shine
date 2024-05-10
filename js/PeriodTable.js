import { UIDiv } from "./libs/ui";

function PeriodicTable (density, energy, onChange, button, container, materialName) {
    const periodicTableContainer = new UIDiv();
    periodicTableContainer.addClass('periodicTable');
    periodicTableContainer.setId('displayTable');

    PeriodicTableElements.map((element, i) => {
        const TitleContainer = new UIDiv();
        TitleContainer.setClass(`${element.class} elementTile`);
        TitleContainer.dom.setAttribute('title', element.title);

        const elementNumber = new UIDiv();
        elementNumber.setInnerHTML(element.id);
        elementNumber.addClass(`elementNumber`);

        const elementSymbol = new UIDiv();
        elementSymbol.setInnerHTML(element.symbol);
        elementSymbol.addClass(`elementSymbol`);

        TitleContainer.add(
            elementNumber,
            elementSymbol
        );

        TitleContainer.onClick(() => {
            density.setValue(element.density);
            energy.setValue(element.energy);
            materialName.setValue(0);
            onChange(true, element.id-1);
            button.setInnerHTML(`G4_${element.symbol}`);
            container.dom.style.display = 'none';
        });

        periodicTableContainer.add(TitleContainer);
    });

    const blankRow1 = new UIDiv();
    const blankRow2 = new UIDiv();
    const blankRow3 = new UIDiv();
    const blankRow4 = new UIDiv();
    const blankRow5 = new UIDiv();

    blankRow1.addClass('blankRow1');
    blankRow2.addClass('blankRow2');
    blankRow3.addClass('blankRow3');
    blankRow4.addClass('blankRow4');
    blankRow5.addClass('blankRow5');

    periodicTableContainer.add(
        blankRow1,
        blankRow2,
        blankRow3,
        blankRow4,
        blankRow5
    )

    return periodicTableContainer;

}

const PeriodicTableElements = [
    {
        id: 1,
        title: 'Non-Metal',
        class: 'nonMetal',
        symbol: 'H',
        elementType: 'G4_H',
        density: 8.3748e-05,
        energy: 19.2
    },
    {
        id: 2,
        title: 'Noble Gas',
        class: 'nobleGas',
        symbol: 'He',
        elementType: 'G4_He',
        density: 0.000166322,
        energy: 41.8
    },
    {
        id: 3,
        title: 'Alkali Metal',
        class: 'alkaliMetal',
        symbol: 'Li',
        elementType: 'G4_Li',
        density: 0.534,
        energy: 40
    },
    {
        id: 4,
        title: 'Alkaline Earth Metal',
        class: 'alkalineEarthMetal',
        symbol: 'Be',
        elementType: 'G4_Be',
        density: 1.848,
        energy: 63.7
    },
    {
        id: 5,
        title: 'Metalloid',
        class: 'metalloid',
        symbol: 'B',
        elementType: 'G4_B',
        density: 2.37,
        energy: 76
    },
    {
        id: 6,
        title: 'Non-Metal',
        class: 'nonMetal',
        symbol: 'C',
        elementType: 'G4_C',
        density: 2,
        energy: 81
    },
    {
        id: 7,
        title: 'Non-Metal',
        class: 'nonMetal',
        symbol: 'N',
        elementType: 'G4_N',
        density: 0.0011652,
        energy: 82
    },
    {
        id: 8,
        title: 'Non-Metal',
        class: 'nonMetal',
        symbol: 'O',
        elementType: 'G4_O',
        density: 0.00133151,
        energy: 95
    },
    {
        id: 9,
        title: 'Halogen',
        class: 'halogen',
        symbol: 'F',
        elementType: 'G4_F',
        density: 0.00158029,
        energy: 115
    },
    {
        id: 10,
        title: 'Noble Gas',
        class: 'nobleGas',
        symbol: 'Ne',
        elementType: 'G4_Ne',
        density: 0.000838505,
        energy: 137
    },
    {
        id: 11,
        title: 'Alkali Metal',
        class: 'alkaliMetal',
        symbol: 'Na',
        elementType: 'G4_Na',
        density: 0.971,
        energy: 149
    },
    {
        id: 12,
        title: 'Alkaline Earth Metal',
        class: 'alkalineEarthMetal',
        symbol: 'Mg',
        elementType: 'G4_Mg',
        density: 1.74,
        energy: 156
    },
    {
        id: 13,
        title: 'Post Transition Metal',
        class: 'postTransitionMetal',
        symbol: 'Al',
        elementType: 'G4_Al',
        density: 2.699,
        energy: 166
    },
    {
        id: 14,
        title: 'Metalloid',
        class: 'metalloid',
        symbol: 'Si',
        elementType: 'G4_Si',
        density: 2.33,
        energy: 173
    },
    {
        id: 15,
        title: 'Non-Metal',
        class: 'nonMetal',
        symbol: 'P',
        elementType: 'G4_P',
        density: 2.2,
        energy: 173
    },
    {
        id: 16,
        title: 'Non-Metal',
        class: 'nonMetal',
        symbol: 'S',
        elementType: 'G4_S',
        density: 2,
        energy: 180
    },
    {
        id: 17,
        title: 'Halogen',
        class: 'halogen',
        symbol: 'Cl',
        elementType: 'G4_Cl',
        density: 0.00299473,
        energy: 174
    },
    {
        id: 18,
        title: 'Noble Gas',
        class: 'nobleGas',
        symbol: 'Ar',
        elementType: 'G4_Ar',
        density: 0.00166201,
        energy: 188
    },
    {
        id: 19,
        title: 'Alkali Metal',
        class: 'alkaliMetal',
        symbol: 'K',
        elementType: 'G4_K',
        density: 0.862,
        energy: 190
    },
    {
        id: 20,
        title: 'Alkaline Earth Metal',
        class: 'alkalineEarthMetal',
        symbol: 'Ca',
        elementType: 'G4_Ca',
        density: 1.55,
        energy: 191
    },
    {
        id: 21,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Sc',
        elementType: 'G4_Sc',
        density: 2.989,
        energy: 216
    },
    {
        id: 22,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Ti',
        elementType: 'G4_Ti',
        density: 4.54,
        energy: 233
    },
    {
        id: 23,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'V',
        elementType: 'G4_V',
        density: 6.11,
        energy: 245
    },
    {
        id: 24,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Cr',
        elementType: 'G4_Cr',
        density: 7.18,
        energy: 257
    },
    {
        id: 25,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Mn',
        elementType: 'G4_Mn',
        density: 7.44,
        energy: 272
    },
    {
        id: 26,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Fe',
        elementType: 'G4_Fe',
        density: 7.874,
        energy: 286
    },
    {
        id: 27,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Co',
        elementType: 'G4_Co',
        density: 8.9,
        energy: 297
    },
    {
        id: 28,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Ni',
        elementType: 'G4_Ni',
        density: 8.902,
        energy: 311
    },
    {
        id: 29,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Cu',
        elementType: 'G4_Cu',
        density: 8.96,
        energy: 322
    },
    {
        id: 30,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Zn',
        elementType: 'G4_Zn',
        density: 7.133,
        energy: 330
    },
    {
        id: 31,
        title: 'Post Transition Metal',
        class: 'postTransitionMetal',
        symbol: 'Ga',
        elementType: 'G4_Ga',
        density: 5.904,
        energy: 334
    },
    {
        id: 32,
        title: 'Metalloid',
        class: 'metalloid',
        symbol: 'Ge',
        elementType: 'G4_Ge',
        density: 5.323,
        energy: 350
    },
    {
        id: 33,
        title: 'Metalloid',
        class: 'metalloid',
        symbol: 'As',
        elementType: 'G4_As',
        density: 5.73,
        energy: 347
    },
    {
        id: 34,
        title: 'Non-Metal',
        class: 'nonMetal',
        symbol: 'Se',
        elementType: 'G4_Se',
        density: 4.5,
        energy: 348
    },
    {
        id: 35,
        title: 'Halogen',
        class: 'halogen',
        symbol: 'Br',
        elementType: 'G4_Br',
        density: 0.0070721,
        energy: 343
    },
    {
        id: 36,
        title: 'Noble Gas',
        class: 'nobleGas',
        symbol: 'Kr',
        elementType: 'G4_Kr',
        density: 0.00347832,
        energy: 352
    },
    {
        id: 37,
        title: 'Alkali Metal',
        class: 'alkaliMetal',
        symbol: 'Rb',
        elementType: 'G4_Rb',
        density: 1.532,
        energy: 363
    },
    {
        id: 38,
        title: 'Alkaline Earth Metal',
        class: 'alkalineEarthMetal',
        symbol: 'Sr',
        elementType: 'G4_Sr',
        density: 2.54,
        energy: 366
    },
    {
        id: 39,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Y',
        elementType: 'G4_Y',
        density: 4.469,
        energy: 379
    },
    {
        id: 40,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Zr',
        elementType: 'G4_Zr',
        density: 6.506,
        energy: 393
    },
    {
        id: 41,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Nb',
        elementType: 'G4_Nb',
        density: 8.57,
        energy: 417
    },
    {
        id: 42,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Mo',
        elementType: 'G4_Mo',
        density: 10.22,
        energy: 424
    },
    {
        id: 43,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Tc',
        elementType: 'G4_Tc',
        density: 11.5,
        energy: 428
    },
    {
        id: 44,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Ru',
        elementType: 'G4_Ru',
        density: 12.41,
        energy: 441
    },
    {
        id: 45,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Rh',
        elementType: 'G4_Rh',
        density: 12.41,
        energy: 449
    },
    {
        id: 46,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Pd',
        elementType: 'G4_Pd',
        density: 12.02,
        energy: 470
    },
    {
        id: 47,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Ag',
        elementType: 'G4_Ag',
        density: 10.5,
        energy: 470
    },
    {
        id: 48,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Cd',
        elementType: 'G4_Cd',
        density: 8.65,
        energy: 469
    },
    {
        id: 49,
        title: 'Post Transition Metal',
        class: 'postTransitionMetal',
        symbol: 'In',
        elementType: 'G4_In',
        density: 7.31,
        energy: 488
    },
    {
        id: 50,
        title: 'Post Transition Metal',
        class: 'postTransitionMetal',
        symbol: 'Sn',
        elementType: 'G4_Sn',
        density: 7.31,
        energy: 488
    },
    {
        id: 51,
        title: 'Metalloid',
        class: 'metalloid',
        symbol: 'Sb',
        elementType: 'G4_Sb',
        density: 6.691,
        energy: 487
    },
    {
        id: 52,
        title: 'Metalloid',
        class: 'metalloid',
        symbol: 'Te',
        elementType: 'G4_Te',
        density: 6.24,
        energy: 485
    },
    {
        id: 53,
        title: 'Halogen',
        class: 'halogen',
        symbol: 'I',
        elementType: 'G4_I',
        density: 4.93,
        energy: 491
    },
    {
        id: 54,
        title: 'Noble Gas',
        class: 'nobleGas',
        symbol: 'Xe',
        elementType: 'G4_Xe',
        density: 0.00548536,
        energy: 482
    },
    {
        id: 55,
        title: 'Alkali Metal',
        class: 'alkaliMetal',
        symbol: 'Cs',
        elementType: 'G4_Cs',
        density: 1.873,
        energy: 488
    },
    {
        id: 56,
        title: 'Alkaline Earth Metal',
        class: 'alkalineEarthMetal',
        symbol: 'Ba',
        elementType: 'G4_Ba',
        density: 3.5,
        energy: 491
    },
    {
        id: 57,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'La',
        elementType: 'G4_La',
        density: 6.154,
        energy: 501
    },
    {
        id: 58,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Ce',
        elementType: 'G4_Ce',
        density: 6.657,
        energy: 523
    },
    {
        id: 59,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Pr',
        elementType: 'G4_Pr',
        density: 6.71,
        energy: 535
    },
    {
        id: 60,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Nd',
        elementType: 'G4_Nd',
        density: 6.9,
        energy: 546
    },
    {
        id: 61,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Pm',
        elementType: 'G4_Pm',
        density: 7.22,
        energy: 560
    },
    {
        id: 62,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Sm',
        elementType: 'G4_Sm',
        density: 7.46,
        energy: 574
    },
    {
        id: 63,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Eu',
        elementType: 'G4_Eu',
        density: 5.243,
        energy: 580
    },
    {
        id: 64,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Gd',
        elementType: 'G4_Gd',
        density: 7.9004,
        energy: 591
    },
    {
        id: 65,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Tb',
        elementType: 'G4_Tb',
        density: 8.229,
        energy: 614
    },
    {
        id: 66,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Dy',
        elementType: 'G4_Dy',
        density: 8.55,
        energy: 628
    },
    {
        id: 67,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Ho',
        elementType: 'G4_Ho',
        density: 8.795,
        energy: 650
    },
    {
        id: 68,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Er',
        elementType: 'G4_Er',
        density: 9.066,
        energy: 658
    },
    {
        id: 69,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Tm',
        elementType: 'G4_Tm',
        density: 9.321,
        energy: 674
    },
    {
        id: 70,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Yb',
        elementType: 'G4_Yb',
        density: 6.73,
        energy: 684
    },
    {
        id: 71,
        title: 'Lanthanide',
        class: 'lanthanide',
        symbol: 'Lu',
        elementType: 'G4_Lu',
        density: 9.84,
        energy: 694
    },
    {
        id: 72,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Hf',
        elementType: 'G4_Hf',
        density: 13.31,
        energy: 705
    },
    {
        id: 73,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Ta',
        elementType: 'G4_Ta',
        density: 16.654,
        energy: 718
    },
    {
        id: 74,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'W',
        elementType: 'G4_W',
        density: 19.3,
        energy: 727
    },
    {
        id: 75,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Re',
        elementType: 'G4_Re',
        density: 21.02,
        energy: 736
    },
    {
        id: 76,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Os',
        elementType: 'G4_Os',
        density: 22.57,
        energy: 746
    },
    {
        id: 77,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Ir',
        elementType: 'G4_Ir',
        density: 22.42,
        energy: 757
    },
    {
        id: 78,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Pt',
        elementType: 'G4_Pt',
        density: 21.45,
        energy: 790
    },
    {
        id: 79,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Au',
        elementType: 'G4_Au',
        density: 19.32,
        energy: 790
    },
    {
        id: 80,
        title: 'Transition Metal',
        class: 'transitionMetal',
        symbol: 'Hg',
        elementType: 'G4_Hg',
        density: 13.546,
        energy: 800
    },
    {
        id: 81,
        title: 'Post Transition metal',
        class: 'postTransitionMetal',
        symbol: 'Tl',
        elementType: 'G4_Tl',
        density: 11.72,
        energy: 810
    },
    {
        id: 82,
        title: 'Post Transition metal',
        class: 'postTransitionMetal',
        symbol: 'Pb',
        elementType: 'G4_Pb',
        density: 11.35,
        energy: 823
    },
    {
        id: 83,
        title: 'Post Transition metal',
        class: 'postTransitionMetal',
        symbol: 'Bi',
        elementType: 'G4_Bi',
        density: 9.747,
        energy: 823
    },
    {
        id: 84,
        title: 'Metalloid',
        class: 'metalloid',
        symbol: 'Po',
        elementType: 'G4_Po',
        density: 9.32,
        energy: 830
    },
    {
        id: 85,
        title: 'Halogen',
        class: 'halogen',
        symbol: 'At',
        elementType: 'G4_At',
        density: 9.32,
        energy: 830
    },
    {
        id: 86,
        title: 'Noble Gas',
        class: 'nobleGas',
        symbol: 'Rn',
        elementType: 'G4_Rn',
        density: 0.00900662,
        energy: 794
    },
    {
        id: 87,
        title: 'Alkali Metal',
        class: 'alkaliMetal',
        symbol: 'Fr',
        elementType: 'G4_Fr',
        density: 1,
        energy: 827
    },
    {
        id: 88,
        title: 'Alkaline Earth Metal',
        class: 'alkalineEarthMetal',
        symbol: 'Ra',
        elementType: 'G4_Ra',
        density: 5,
        energy: 826
    },
    {
        id: 89,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Ac',
        elementType: 'G4_Ac',
        density: 10.07,
        energy: 841
    },
    {
        id: 90,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Th',
        elementType: 'G4_Th',
        density: 11.72,
        energy: 847
    },
    {
        id: 91,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Pa',
        elementType: 'G4_Pa',
        density: 15.37,
        energy: 878
    },
    {
        id: 92,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'U',
        elementType: 'G4_U',
        density: 18.95,
        energy: 890
    },
    {
        id: 93,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Np',
        elementType: 'G4_Np',
        density: 20.25,
        energy: 902
    },
    {
        id: 94,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Pu',
        elementType: 'G4_Pu',
        density: 19.84,
        energy: 921
    },
    {
        id: 95,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Am',
        elementType: 'G4_Am',
        density: 13.67,
        energy: 934
    },
    {
        id: 96,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Cm',
        elementType: 'G4_Cm',
        density: 13.51,
        energy: 939
    },
    {
        id: 97,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Bk',
        elementType: 'G4_Bk',
        density: 14,
        energy: 952
    },
    {
        id: 98,
        title: 'Actinide',
        class: 'actinide',
        symbol: 'Cf',
        elementType: 'G4_Cf',
        density: 10,
        energy: 966
    },

]


export  { PeriodicTable };