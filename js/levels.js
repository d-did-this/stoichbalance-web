const ATOM_COLORS = {
    "H": {
        "bg": "#f8fafc",
        "color": "#0f172a"
    },
    "O": {
        "bg": "#ef4444",
        "color": "white"
    },
    "N": {
        "bg": "#8b5cf6",
        "color": "white"
    },
    "Na": {
        "bg": "#3b82f6",
        "color": "white"
    },
    "K": {
        "bg": "#a855f7",
        "color": "white"
    },
    "I": {
        "bg": "#6b21a8",
        "color": "white"
    },
    "Br": {
        "bg": "#b91c1c",
        "color": "white"
    },
    "Zn": {
        "bg": "#94a3b8",
        "color": "white"
    },
    "Cl": {
        "bg": "#22c55e",
        "color": "white"
    },
    "S": {
        "bg": "#eab308",
        "color": "#422006"
    },
    "Ag": {
        "bg": "#cbd5e1",
        "color": "#0f172a"
    },
    "C": {
        "bg": "#1e293b",
        "color": "white"
    },
    "Pb": {
        "bg": "#475569",
        "color": "white"
    },
    "Al": {
        "bg": "#64748b",
        "color": "white"
    },
    "Mg": {
        "bg": "#334155",
        "color": "white"
    },
    "Cu": {
        "bg": "#f59e0b",
        "color": "#451a03"
    },
    "Fe": {
        "bg": "#991b1b",
        "color": "white"
    }
};
const LEVELS = {
    "F4L1": {
        "title": "Haber Process",
        "form": 4,
        "equation": "N₂ + H₂ → NH₃",
        "reactants": [
            {
                "id": "N2",
                "name": "Nitrogen Gas",
                "displayHtml": "N<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "N": 2
                },
                "state": "g"
            },
            {
                "id": "H2",
                "name": "Hydrogen Gas",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "H": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "NH3",
                "name": "Ammonia",
                "displayHtml": "NH<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "N": 1,
                    "H": 3
                },
                "state": "g"
            }
        ],
        "elements": [
            "N",
            "H"
        ]
    },
    "F4L2": {
        "title": "Sodium-Water Reaction",
        "form": 4,
        "equation": "Na + H₂O → NaOH + H₂",
        "reactants": [
            {
                "id": "Na",
                "name": "Sodium Solid",
                "displayHtml": "Na",
                "composition": {
                    "Na": 1
                },
                "state": "s"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "products": [
            {
                "id": "NaOH",
                "name": "Sodium Hydroxide",
                "displayHtml": "NaOH",
                "composition": {
                    "Na": 1,
                    "O": 1,
                    "H": 1
                },
                "state": "aq"
            },
            {
                "id": "H2",
                "name": "Hydrogen Gas",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "H": 2
                },
                "state": "g"
            }
        ],
        "elements": [
            "Na",
            "H",
            "O"
        ]
    },
    "F4L3": {
        "title": "Halogen Displacement",
        "form": 4,
        "equation": "KI + Br₂ → I₂ + KBr",
        "reactants": [
            {
                "id": "KI",
                "name": "Potassium Iodide",
                "displayHtml": "KI",
                "composition": {
                    "K": 1,
                    "I": 1
                },
                "state": "aq"
            },
            {
                "id": "Br2",
                "name": "Bromine Liquid",
                "displayHtml": "Br<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "Br": 2
                },
                "state": "l"
            }
        ],
        "products": [
            {
                "id": "I2",
                "name": "Iodine Solid",
                "displayHtml": "I<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "I": 2
                },
                "state": "s"
            },
            {
                "id": "KBr",
                "name": "Potassium Bromide",
                "displayHtml": "KBr",
                "composition": {
                    "K": 1,
                    "Br": 1
                },
                "state": "aq"
            }
        ],
        "elements": [
            "K",
            "I",
            "Br"
        ]
    },
    "F4L4": {
        "title": "Acid-Metal Reaction",
        "form": 4,
        "equation": "Zn + HCl → ZnCl₂ + H₂",
        "reactants": [
            {
                "id": "Zn",
                "name": "Zinc Solid",
                "displayHtml": "Zn",
                "composition": {
                    "Zn": 1
                },
                "state": "s"
            },
            {
                "id": "HCl",
                "name": "Hydrochloric Acid",
                "displayHtml": "HCl",
                "composition": {
                    "H": 1,
                    "Cl": 1
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "ZnCl2",
                "name": "Zinc Chloride",
                "displayHtml": "ZnCl<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "Zn": 1,
                    "Cl": 2
                },
                "state": "aq"
            },
            {
                "id": "H2",
                "name": "Hydrogen Gas",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "H": 2
                },
                "state": "g"
            }
        ],
        "elements": [
            "Zn",
            "H",
            "Cl"
        ]
    },
    "F4L5": {
        "title": "Neutralisation",
        "form": 4,
        "equation": "H₂SO₄ + NaOH → Na₂SO₄ + H₂O",
        "reactants": [
            {
                "id": "H2SO4",
                "name": "Sulfuric Acid",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>SO<span style='font-size:0.6em'>4</span>",
                "composition": {
                    "H": 2,
                    "S": 1,
                    "O": 4
                },
                "state": "aq"
            },
            {
                "id": "NaOH",
                "name": "Sodium Hydroxide",
                "displayHtml": "NaOH",
                "composition": {
                    "Na": 1,
                    "O": 1,
                    "H": 1
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "Na2SO4",
                "name": "Sodium Sulfate",
                "displayHtml": "Na<span style='font-size:0.6em'>2</span>SO<span style='font-size:0.6em'>4</span>",
                "composition": {
                    "Na": 2,
                    "S": 1,
                    "O": 4
                },
                "state": "aq"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "elements": [
            "H",
            "S",
            "O",
            "Na"
        ]
    },
    "F4L6": {
        "title": "Metal Displacement",
        "form": 4,
        "equation": "Zn + AgNO₃ → Zn(NO₃)₂ + Ag",
        "reactants": [
            {
                "id": "Zn",
                "name": "Zinc Solid",
                "displayHtml": "Zn",
                "composition": {
                    "Zn": 1
                },
                "state": "s"
            },
            {
                "id": "AgNO3",
                "name": "Silver Nitrate",
                "displayHtml": "AgNO<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "Ag": 1,
                    "N": 1,
                    "O": 3
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "ZnNO3_2",
                "name": "Zinc Nitrate",
                "displayHtml": "Zn(NO<span style='font-size:0.6em'>3</span>)<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "Zn": 1,
                    "N": 2,
                    "O": 6
                },
                "state": "aq"
            },
            {
                "id": "Ag",
                "name": "Silver Solid",
                "displayHtml": "Ag",
                "composition": {
                    "Ag": 1
                },
                "state": "s"
            }
        ],
        "elements": [
            "Zn",
            "Ag",
            "N",
            "O"
        ]
    },
    "F4L7": {
        "title": "Acid-Carbonate Reaction",
        "form": 4,
        "equation": "Na₂CO₃ + HCl → NaCl + H₂O + CO₂",
        "reactants": [
            {
                "id": "Na2CO3",
                "name": "Sodium Carbonate",
                "displayHtml": "Na<span style='font-size:0.6em'>2</span>CO<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "Na": 2,
                    "C": 1,
                    "O": 3
                },
                "state": "aq"
            },
            {
                "id": "HCl",
                "name": "Hydrochloric Acid",
                "displayHtml": "HCl",
                "composition": {
                    "H": 1,
                    "Cl": 1
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "NaCl",
                "name": "Sodium Chloride",
                "displayHtml": "NaCl",
                "composition": {
                    "Na": 1,
                    "Cl": 1
                },
                "state": "aq"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            },
            {
                "id": "CO2",
                "name": "Carbon Dioxide",
                "displayHtml": "CO<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "C": 1,
                    "O": 2
                },
                "state": "g"
            }
        ],
        "elements": [
            "Na",
            "C",
            "O",
            "H",
            "Cl"
        ]
    },
    "F4L8": {
        "title": "Combustion of Propane",
        "form": 4,
        "equation": "C₃H₈ + O₂ → CO₂ + H₂O",
        "reactants": [
            {
                "id": "C3H8",
                "name": "Propane Gas",
                "displayHtml": "C<span style='font-size:0.6em'>3</span>H<span style='font-size:0.6em'>8</span>",
                "composition": {
                    "C": 3,
                    "H": 8
                },
                "state": "g"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "CO2",
                "name": "Carbon Dioxide",
                "displayHtml": "CO<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "C": 1,
                    "O": 2
                },
                "state": "g"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "elements": [
            "C",
            "H",
            "O"
        ]
    },
    "F4L9": {
        "title": "Precipitation",
        "form": 4,
        "equation": "Pb(NO₃)₂ + KI → PbI₂ + KNO₃",
        "reactants": [
            {
                "id": "PbNO3_2",
                "name": "Lead(II) Nitrate",
                "displayHtml": "Pb(NO<span style='font-size:0.6em'>3</span>)<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "Pb": 1,
                    "N": 2,
                    "O": 6
                },
                "state": "aq"
            },
            {
                "id": "KI",
                "name": "Potassium Iodide",
                "displayHtml": "KI",
                "composition": {
                    "K": 1,
                    "I": 1
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "PbI2",
                "name": "Lead(II) Iodide",
                "displayHtml": "PbI<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "Pb": 1,
                    "I": 2
                },
                "state": "s"
            },
            {
                "id": "KNO3",
                "name": "Potassium Nitrate",
                "displayHtml": "KNO<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "K": 1,
                    "N": 1,
                    "O": 3
                },
                "state": "aq"
            }
        ],
        "elements": [
            "Pb",
            "N",
            "O",
            "K",
            "I"
        ]
    },
    "F4L10": {
        "title": "Decomposition of Silver Nitrate",
        "form": 4,
        "equation": "AgNO₃ → Ag + NO₂ + O₂",
        "reactants": [
            {
                "id": "AgNO3",
                "name": "Silver Nitrate",
                "displayHtml": "AgNO<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "Ag": 1,
                    "N": 1,
                    "O": 3
                },
                "state": "s"
            }
        ],
        "products": [
            {
                "id": "Ag",
                "name": "Silver Solid",
                "displayHtml": "Ag",
                "composition": {
                    "Ag": 1
                },
                "state": "s"
            },
            {
                "id": "NO2",
                "name": "Nitrogen Dioxide",
                "displayHtml": "NO<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "N": 1,
                    "O": 2
                },
                "state": "g"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "elements": [
            "Ag",
            "N",
            "O"
        ]
    },
    "F4L11": {
        "title": "Combustion of Aluminium",
        "form": 4,
        "equation": "Al + O₂ → Al₂O₃",
        "reactants": [
            {
                "id": "Al",
                "name": "Aluminium Solid",
                "displayHtml": "Al",
                "composition": {
                    "Al": 1
                },
                "state": "s"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "Al2O3",
                "name": "Aluminium Oxide",
                "displayHtml": "Al<span style='font-size:0.6em'>2</span>O<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "Al": 2,
                    "O": 3
                },
                "state": "s"
            }
        ],
        "elements": [
            "Al",
            "O"
        ]
    },
    "F4L12": {
        "title": "Decomposition of Potassium Chlorate",
        "form": 4,
        "equation": "KClO₃ → KCl + O₂",
        "reactants": [
            {
                "id": "KClO3",
                "name": "Potassium Chlorate",
                "displayHtml": "KClO<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "K": 1,
                    "Cl": 1,
                    "O": 3
                },
                "state": "s"
            }
        ],
        "products": [
            {
                "id": "KCl",
                "name": "Potassium Chloride",
                "displayHtml": "KCl",
                "composition": {
                    "K": 1,
                    "Cl": 1
                },
                "state": "s"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "elements": [
            "K",
            "Cl",
            "O"
        ]
    },
    "F5L1": {
        "title": "Oxidation of Magnesium",
        "form": 5,
        "equation": "Mg + O₂ → MgO",
        "reactants": [
            {
                "id": "Mg",
                "name": "Magnesium Solid",
                "displayHtml": "Mg",
                "composition": {
                    "Mg": 1
                },
                "state": "s"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "MgO",
                "name": "Magnesium Oxide",
                "displayHtml": "MgO",
                "composition": {
                    "Mg": 1,
                    "O": 1
                },
                "state": "s"
            }
        ],
        "elements": [
            "Mg",
            "O"
        ]
    },
    "F5L2": {
        "title": "Combustion of Methane",
        "form": 5,
        "equation": "CH₄ + O₂ → CO₂ + H₂O",
        "reactants": [
            {
                "id": "CH4",
                "name": "Methane Gas",
                "displayHtml": "CH<span style='font-size:0.6em'>4</span>",
                "composition": {
                    "C": 1,
                    "H": 4
                },
                "state": "g"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "CO2",
                "name": "Carbon Dioxide",
                "displayHtml": "CO<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "C": 1,
                    "O": 2
                },
                "state": "g"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "elements": [
            "C",
            "H",
            "O"
        ]
    },
    "F5L3": {
        "title": "Combustion of Ethanol",
        "form": 5,
        "equation": "C₂H₅OH + O₂ → CO₂ + H₂O",
        "reactants": [
            {
                "id": "C2H5OH",
                "name": "Ethanol Liquid",
                "displayHtml": "C<span style='font-size:0.6em'>2</span>H<span style='font-size:0.6em'>5</span>OH",
                "composition": {
                    "C": 2,
                    "H": 6,
                    "O": 1
                },
                "state": "l"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "CO2",
                "name": "Carbon Dioxide",
                "displayHtml": "CO<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "C": 1,
                    "O": 2
                },
                "state": "g"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "elements": [
            "C",
            "H",
            "O"
        ]
    },
    "F5L4": {
        "title": "Metal Displacement",
        "form": 5,
        "equation": "Al + CuCl₂ → AlCl₃ + Cu",
        "reactants": [
            {
                "id": "Al",
                "name": "Aluminium Solid",
                "displayHtml": "Al",
                "composition": {
                    "Al": 1
                },
                "state": "s"
            },
            {
                "id": "CuCl2",
                "name": "Copper(II) Chloride",
                "displayHtml": "CuCl<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "Cu": 1,
                    "Cl": 2
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "AlCl3",
                "name": "Aluminium Chloride",
                "displayHtml": "AlCl<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "Al": 1,
                    "Cl": 3
                },
                "state": "aq"
            },
            {
                "id": "Cu",
                "name": "Copper Solid",
                "displayHtml": "Cu",
                "composition": {
                    "Cu": 1
                },
                "state": "s"
            }
        ],
        "elements": [
            "Al",
            "Cu",
            "Cl"
        ]
    },
    "F5L5": {
        "title": "Esterification",
        "form": 5,
        "equation": "CH₃COOH + C₃H₇OH → CH₃COOC₃H₇ + H₂O",
        "reactants": [
            {
                "id": "CH3COOH",
                "name": "Ethanoic Acid",
                "displayHtml": "CH<span style='font-size:0.6em'>3</span>COOH",
                "composition": {
                    "C": 2,
                    "H": 4,
                    "O": 2
                },
                "state": "l"
            },
            {
                "id": "C3H7OH",
                "name": "Propanol",
                "displayHtml": "C<span style='font-size:0.6em'>3</span>H<span style='font-size:0.6em'>7</span>OH",
                "composition": {
                    "C": 3,
                    "H": 8,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "products": [
            {
                "id": "CH3COOC3H7",
                "name": "Propyl Ethanoate",
                "displayHtml": "CH<span style='font-size:0.6em'>3</span>COOC<span style='font-size:0.6em'>3</span>H<span style='font-size:0.6em'>7</span>",
                "composition": {
                    "C": 5,
                    "H": 10,
                    "O": 2
                },
                "state": "l"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "elements": [
            "C",
            "H",
            "O"
        ]
    },
    "F5L6": {
        "title": "Hydration of Ethene",
        "form": 5,
        "equation": "C₂H₄ + H₂O → C₂H₅OH",
        "reactants": [
            {
                "id": "C2H4",
                "name": "Ethene Gas",
                "displayHtml": "C<span style='font-size:0.6em'>2</span>H<span style='font-size:0.6em'>4</span>",
                "composition": {
                    "C": 2,
                    "H": 4
                },
                "state": "g"
            },
            {
                "id": "H2O",
                "name": "Steam",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "C2H5OH",
                "name": "Ethanol Liquid",
                "displayHtml": "C<span style='font-size:0.6em'>2</span>H<span style='font-size:0.6em'>5</span>OH",
                "composition": {
                    "C": 2,
                    "H": 6,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "elements": [
            "C",
            "H",
            "O"
        ]
    },
    "F5L7": {
        "title": "Contact Process",
        "form": 5,
        "equation": "SO₂ + O₂ → SO₃",
        "reactants": [
            {
                "id": "SO2",
                "name": "Sulfur Dioxide",
                "displayHtml": "SO<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "S": 1,
                    "O": 2
                },
                "state": "g"
            },
            {
                "id": "O2",
                "name": "Oxygen Gas",
                "displayHtml": "O<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "O": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "SO3",
                "name": "Sulfur Trioxide",
                "displayHtml": "SO<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "S": 1,
                    "O": 3
                },
                "state": "g"
            }
        ],
        "elements": [
            "S",
            "O"
        ]
    },
    "F5L8": {
        "title": "Reduction of Metal Oxide",
        "form": 5,
        "equation": "Fe₂O₃ + H₂ → Fe + H₂O",
        "reactants": [
            {
                "id": "Fe2O3",
                "name": "Iron(III) Oxide",
                "displayHtml": "Fe<span style='font-size:0.6em'>2</span>O<span style='font-size:0.6em'>3</span>",
                "composition": {
                    "Fe": 2,
                    "O": 3
                },
                "state": "s"
            },
            {
                "id": "H2",
                "name": "Hydrogen Gas",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "H": 2
                },
                "state": "g"
            }
        ],
        "products": [
            {
                "id": "Fe",
                "name": "Iron Solid",
                "displayHtml": "Fe",
                "composition": {
                    "Fe": 1
                },
                "state": "s"
            },
            {
                "id": "H2O",
                "name": "Liquid Water",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>O",
                "composition": {
                    "H": 2,
                    "O": 1
                },
                "state": "l"
            }
        ],
        "elements": [
            "Fe",
            "O",
            "H"
        ]
    },
    "F5L9": {
        "title": "Fermentation of Glucose",
        "form": 5,
        "equation": "C₆H₁₂O₆ → C₂H₅OH + CO₂",
        "reactants": [
            {
                "id": "C6H12O6",
                "name": "Glucose",
                "displayHtml": "C<span style='font-size:0.6em'>6</span>H<span style='font-size:0.6em'>12</span>O<span style='font-size:0.6em'>6</span>",
                "composition": {
                    "C": 6,
                    "H": 12,
                    "O": 6
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "C2H5OH",
                "name": "Ethanol Liquid",
                "displayHtml": "C<span style='font-size:0.6em'>2</span>H<span style='font-size:0.6em'>5</span>OH",
                "composition": {
                    "C": 2,
                    "H": 6,
                    "O": 1
                },
                "state": "l"
            },
            {
                "id": "CO2",
                "name": "Carbon Dioxide",
                "displayHtml": "CO<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "C": 1,
                    "O": 2
                },
                "state": "g"
            }
        ],
        "elements": [
            "C",
            "H",
            "O"
        ]
    },
    "F5L10": {
        "title": "Reaction of a Metal with Acid",
        "form": 5,
        "equation": "Mg + HCl → MgCl₂ + H₂",
        "reactants": [
            {
                "id": "Mg",
                "name": "Magnesium Solid",
                "displayHtml": "Mg",
                "composition": {
                    "Mg": 1
                },
                "state": "s"
            },
            {
                "id": "HCl",
                "name": "Hydrochloric Acid",
                "displayHtml": "HCl",
                "composition": {
                    "H": 1,
                    "Cl": 1
                },
                "state": "aq"
            }
        ],
        "products": [
            {
                "id": "MgCl2",
                "name": "Magnesium Chloride",
                "displayHtml": "MgCl<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "Mg": 1,
                    "Cl": 2
                },
                "state": "aq"
            },
            {
                "id": "H2",
                "name": "Hydrogen Gas",
                "displayHtml": "H<span style='font-size:0.6em'>2</span>",
                "composition": {
                    "H": 2
                },
                "state": "g"
            }
        ],
        "elements": [
            "Mg",
            "H",
            "Cl"
        ]
    }
};



const CHALLENGE_BADGES = [
    { id: "mental_math", name: "Mental Math Master", icon: "🧠", desc: "Complete a challenge run with the Balance Scale turned OFF.", color: "#8b5cf6" },
    { id: "solo_chemist", name: "Solo Chemist", icon: "🎓", desc: "Complete a challenge run with Prof Beaker hints disabled.", color: "#3b82f6" },
    { id: "blindfold", name: "Pure Blindfold", icon: "👁️", desc: "Complete Hard difficulty with both Scale and Hints OFF.", color: "#ef4444" },
    { id: "flawless", name: "First-Try Flawless", icon: "🎯", desc: "Complete all 5 rounds without resetting any equation.", color: "#10b981" },
    { id: "lightning", name: "Lightning Balancer", icon: "⚡", desc: "Complete a 5-round challenge in under 60 seconds total.", color: "#f59e0b" },
    { id: "apprentice", name: "Apprentice Balancer", icon: "🥉", desc: "Complete the Easy Challenge tier with 3 stars.", color: "#94a3b8" },
    { id: "specialist", name: "Reaction Specialist", icon: "🥈", desc: "Complete the Medium Challenge tier with 3 stars.", color: "#cbd5e1" },
    { id: "grandmaster", name: "Stoichiometry Grandmaster", icon: "🥇", desc: "Complete the Hard Challenge tier with 3 stars.", color: "#eab308" },
    { id: "grand_slam", name: "The Grand Slam", icon: "🏆", desc: "Earn 3 stars across all three difficulty tiers.", color: "#f97316" },
    { id: "veteran", name: "Lab Veteran", icon: "🧪", desc: "Complete 10 total challenge runs.", color: "#06b6d4" }
];

const CHALLENGE_POOLS = {
    easy: [
        {
            id: "CE1",
            title: "Synthesis of Hydrochloric Acid",
            equation: "H₂ + Cl₂ → 2HCl",
            reactants: [
                { id: "H2", name: "Hydrogen Gas", displayHtml: "H<span style='font-size:0.6em'>2</span>", composition: { H: 2 }, state: "g" },
                { id: "Cl2", name: "Chlorine Gas", displayHtml: "Cl<span style='font-size:0.6em'>2</span>", composition: { Cl: 2 }, state: "g" }
            ],
            products: [
                { id: "HCl", name: "Hydrochloric Acid", displayHtml: "HCl", composition: { H: 1, Cl: 1 }, state: "g" }
            ],
            elements: ["H", "Cl"]
        },
        {
            id: "CE2",
            title: "Synthesis of Water",
            equation: "2H₂ + O₂ → 2H₂O",
            reactants: [
                { id: "H2", name: "Hydrogen Gas", displayHtml: "H<span style='font-size:0.6em'>2</span>", composition: { H: 2 }, state: "g" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            products: [
                { id: "H2O", name: "Liquid Water", displayHtml: "H<span style='font-size:0.6em'>2</span>O", composition: { H: 2, O: 1 }, state: "l" }
            ],
            elements: ["H", "O"]
        },
        {
            id: "CE3",
            title: "Formation of Table Salt",
            equation: "2Na + Cl₂ → 2NaCl",
            reactants: [
                { id: "Na", name: "Sodium Solid", displayHtml: "Na", composition: { Na: 1 }, state: "s" },
                { id: "Cl2", name: "Chlorine Gas", displayHtml: "Cl<span style='font-size:0.6em'>2</span>", composition: { Cl: 2 }, state: "g" }
            ],
            products: [
                { id: "NaCl", name: "Sodium Chloride", displayHtml: "NaCl", composition: { Na: 1, Cl: 1 }, state: "s" }
            ],
            elements: ["Na", "Cl"]
        },
        {
            id: "CE4",
            title: "Oxidation of Carbon Monoxide",
            equation: "2CO + O₂ → 2CO₂",
            reactants: [
                { id: "CO", name: "Carbon Monoxide", displayHtml: "CO", composition: { C: 1, O: 1 }, state: "g" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            products: [
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" }
            ],
            elements: ["C", "O"]
        },
        {
            id: "CE5",
            title: "Synthesis of Potassium Iodide",
            equation: "2K + I₂ → 2KI",
            reactants: [
                { id: "K", name: "Potassium Solid", displayHtml: "K", composition: { K: 1 }, state: "s" },
                { id: "I2", name: "Iodine Solid", displayHtml: "I<span style='font-size:0.6em'>2</span>", composition: { I: 2 }, state: "s" }
            ],
            products: [
                { id: "KI", name: "Potassium Iodide", displayHtml: "KI", composition: { K: 1, I: 1 }, state: "s" }
            ],
            elements: ["K", "I"]
        },
        {
            id: "CE6",
            title: "Magnesium Combustion",
            equation: "2Mg + O₂ → 2MgO",
            reactants: [
                { id: "Mg", name: "Magnesium Solid", displayHtml: "Mg", composition: { Mg: 1 }, state: "s" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            products: [
                { id: "MgO", name: "Magnesium Oxide", displayHtml: "MgO", composition: { Mg: 1, O: 1 }, state: "s" }
            ],
            elements: ["Mg", "O"]
        }
    ],
    medium: [
        {
            id: "CM1",
            title: "Combustion of Methane",
            equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
            reactants: [
                { id: "CH4", name: "Methane Gas", displayHtml: "CH<span style='font-size:0.6em'>4</span>", composition: { C: 1, H: 4 }, state: "g" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            products: [
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" },
                { id: "H2O", name: "Liquid Water", displayHtml: "H<span style='font-size:0.6em'>2</span>O", composition: { H: 2, O: 1 }, state: "l" }
            ],
            elements: ["C", "H", "O"]
        },
        {
            id: "CM2",
            title: "Zinc in Hydrochloric Acid",
            equation: "Zn + 2HCl → ZnCl₂ + H₂",
            reactants: [
                { id: "Zn", name: "Zinc Solid", displayHtml: "Zn", composition: { Zn: 1 }, state: "s" },
                { id: "HCl", name: "Hydrochloric Acid", displayHtml: "HCl", composition: { H: 1, Cl: 1 }, state: "aq" }
            ],
            products: [
                { id: "ZnCl2", name: "Zinc Chloride", displayHtml: "ZnCl<span style='font-size:0.6em'>2</span>", composition: { Zn: 1, Cl: 2 }, state: "aq" },
                { id: "H2", name: "Hydrogen Gas", displayHtml: "H<span style='font-size:0.6em'>2</span>", composition: { H: 2 }, state: "g" }
            ],
            elements: ["Zn", "H", "Cl"]
        },
        {
            id: "CM3",
            title: "Synthesis of Ammonia",
            equation: "N₂ + 3H₂ → 2NH₃",
            reactants: [
                { id: "N2", name: "Nitrogen Gas", displayHtml: "N<span style='font-size:0.6em'>2</span>", composition: { N: 2 }, state: "g" },
                { id: "H2", name: "Hydrogen Gas", displayHtml: "H<span style='font-size:0.6em'>2</span>", composition: { H: 2 }, state: "g" }
            ],
            products: [
                { id: "NH3", name: "Ammonia Gas", displayHtml: "NH<span style='font-size:0.6em'>3</span>", composition: { N: 1, H: 3 }, state: "g" }
            ],
            elements: ["N", "H"]
        },
        {
            id: "CM4",
            title: "Chlorination of Iron",
            equation: "2Fe + 3Cl₂ → 2FeCl₃",
            reactants: [
                { id: "Fe", name: "Iron Solid", displayHtml: "Fe", composition: { Fe: 1 }, state: "s" },
                { id: "Cl2", name: "Chlorine Gas", displayHtml: "Cl<span style='font-size:0.6em'>2</span>", composition: { Cl: 2 }, state: "g" }
            ],
            products: [
                { id: "FeCl3", name: "Iron(III) Chloride", displayHtml: "FeCl<span style='font-size:0.6em'>3</span>", composition: { Fe: 1, Cl: 3 }, state: "s" }
            ],
            elements: ["Fe", "Cl"]
        },
        {
            id: "CM5",
            title: "Contact Process Oxidation",
            equation: "2SO₂ + O₂ → 2SO₃",
            reactants: [
                { id: "SO2", name: "Sulfur Dioxide", displayHtml: "SO<span style='font-size:0.6em'>2</span>", composition: { S: 1, O: 2 }, state: "g" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            products: [
                { id: "SO3", name: "Sulfur Trioxide", displayHtml: "SO<span style='font-size:0.6em'>3</span>", composition: { S: 1, O: 3 }, state: "g" }
            ],
            elements: ["S", "O"]
        },
        {
            id: "CM6",
            title: "Decomposition of Hydrogen Peroxide",
            equation: "2H₂O₂ → 2H₂O + O₂",
            reactants: [
                { id: "H2O2", name: "Hydrogen Peroxide", displayHtml: "H<span style='font-size:0.6em'>2</span>O<span style='font-size:0.6em'>2</span>", composition: { H: 2, O: 2 }, state: "l" }
            ],
            products: [
                { id: "H2O", name: "Liquid Water", displayHtml: "H<span style='font-size:0.6em'>2</span>O", composition: { H: 2, O: 1 }, state: "l" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            elements: ["H", "O"]
        }
    ],
    hard: [
        {
            id: "CH1",
            title: "Combustion of Ethane",
            equation: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O",
            reactants: [
                { id: "C2H6", name: "Ethane Gas", displayHtml: "C<span style='font-size:0.6em'>2</span>H<span style='font-size:0.6em'>6</span>", composition: { C: 2, H: 6 }, state: "g" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            products: [
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" },
                { id: "H2O", name: "Liquid Water", displayHtml: "H<span style='font-size:0.6em'>2</span>O", composition: { H: 2, O: 1 }, state: "l" }
            ],
            elements: ["C", "H", "O"]
        },
        {
            id: "CH2",
            title: "Blast Furnace Iron Reduction",
            equation: "Fe₂O₃ + 3CO → 2Fe + 3CO₂",
            reactants: [
                { id: "Fe2O3", name: "Iron(III) Oxide", displayHtml: "Fe<span style='font-size:0.6em'>2</span>O<span style='font-size:0.6em'>3</span>", composition: { Fe: 2, O: 3 }, state: "s" },
                { id: "CO", name: "Carbon Monoxide", displayHtml: "CO", composition: { C: 1, O: 1 }, state: "g" }
            ],
            products: [
                { id: "Fe", name: "Iron Solid", displayHtml: "Fe", composition: { Fe: 1 }, state: "s" },
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" }
            ],
            elements: ["Fe", "O", "C"]
        },
        {
            id: "CH3",
            title: "Combustion of Propane",
            equation: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
            reactants: [
                { id: "C3H8", name: "Propane Gas", displayHtml: "C<span style='font-size:0.6em'>3</span>H<span style='font-size:0.6em'>8</span>", composition: { C: 3, H: 8 }, state: "g" },
                { id: "O2", name: "Oxygen Gas", displayHtml: "O<span style='font-size:0.6em'>2</span>", composition: { O: 2 }, state: "g" }
            ],
            products: [
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" },
                { id: "H2O", name: "Liquid Water", displayHtml: "H<span style='font-size:0.6em'>2</span>O", composition: { H: 2, O: 1 }, state: "l" }
            ],
            elements: ["C", "H", "O"]
        },
        {
            id: "CH4",
            title: "Reduction of Aluminum Oxide",
            equation: "2Al₂O₃ + 3C → 4Al + 3CO₂",
            reactants: [
                { id: "Al2O3", name: "Aluminum Oxide", displayHtml: "Al<span style='font-size:0.6em'>2</span>O<span style='font-size:0.6em'>3</span>", composition: { Al: 2, O: 3 }, state: "s" },
                { id: "C", name: "Carbon Solid", displayHtml: "C", composition: { C: 1 }, state: "s" }
            ],
            products: [
                { id: "Al", name: "Aluminum Solid", displayHtml: "Al", composition: { Al: 1 }, state: "s" },
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" }
            ],
            elements: ["Al", "O", "C"]
        },
        {
            id: "CH5",
            title: "Lead Oxide Reduction",
            equation: "2PbO + C → 2Pb + CO₂",
            reactants: [
                { id: "PbO", name: "Lead(II) Oxide", displayHtml: "PbO", composition: { Pb: 1, O: 1 }, state: "s" },
                { id: "C", name: "Carbon Solid", displayHtml: "C", composition: { C: 1 }, state: "s" }
            ],
            products: [
                { id: "Pb", name: "Lead Solid", displayHtml: "Pb", composition: { Pb: 1 }, state: "s" },
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" }
            ],
            elements: ["Pb", "O", "C"]
        },
        {
            id: "CH6",
            title: "Fermentation of Glucose",
            equation: "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂",
            reactants: [
                { id: "C6H12O6", name: "Glucose", displayHtml: "C<span style='font-size:0.6em'>6</span>H<span style='font-size:0.6em'>12</span>O<span style='font-size:0.6em'>6</span>", composition: { C: 6, H: 12, O: 6 }, state: "aq" }
            ],
            products: [
                { id: "C2H5OH", name: "Ethanol", displayHtml: "C<span style='font-size:0.6em'>2</span>H<span style='font-size:0.6em'>5</span>OH", composition: { C: 2, H: 6, O: 1 }, state: "l" },
                { id: "CO2", name: "Carbon Dioxide", displayHtml: "CO<span style='font-size:0.6em'>2</span>", composition: { C: 1, O: 2 }, state: "g" }
            ],
            elements: ["C", "H", "O"]
        }
    ]
};

if (typeof window !== 'undefined') {
    window.CHALLENGE_BADGES = CHALLENGE_BADGES;
    window.CHALLENGE_POOLS = CHALLENGE_POOLS;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVELS, ATOM_COLORS, CHALLENGE_BADGES, CHALLENGE_POOLS };
}
