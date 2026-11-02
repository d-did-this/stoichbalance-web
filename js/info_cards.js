/**
 * Stoichbalance - Universal Interactive Chemistry Info Card Engine
 * Compact, Essential, High-Retention Chemical Tooltips
 */

(function () {
    let cardEl = null;
    let currentTarget = null;
    let activeHideTimeout = null;

    const ATOM_COLORS_LOCAL = {
        H: { bg: '#f8fafc', color: '#0f172a' },
        O: { bg: '#ef4444', color: 'white' },
        N: { bg: '#8b5cf6', color: 'white' },
        Na: { bg: '#3b82f6', color: 'white' },
        K: { bg: '#a855f7', color: 'white' },
        I: { bg: '#6b21a8', color: 'white' },
        Br: { bg: '#b91c1c', color: 'white' },
        Zn: { bg: '#94a3b8', color: 'white' },
        Cl: { bg: '#22c55e', color: 'white' },
        S: { bg: '#eab308', color: '#422006' },
        Ag: { bg: '#cbd5e1', color: '#0f172a' },
        C: { bg: '#1e293b', color: 'white' },
        Pb: { bg: '#475569', color: 'white' },
        Al: { bg: '#64748b', color: 'white' },
        Mg: { bg: '#334155', color: 'white' },
        Cu: { bg: '#f59e0b', color: '#451a03' },
        Fe: { bg: '#991b1b', color: 'white' }
    };

    const ELEM_NAMES_LOCAL = {
        H: "Hydrogen", O: "Oxygen", N: "Nitrogen", Na: "Sodium", K: "Potassium",
        I: "Iodine", Zn: "Zinc", S: "Sulfur", Ag: "Silver", C: "Carbon",
        Pb: "Lead", Al: "Aluminium", Cl: "Chlorine", Mg: "Magnesium",
        Fe: "Iron", Cu: "Copper", Br: "Bromine", P: "Phosphorus", Ca: "Calcium"
    };

    
    const ELEMENT_GROUPS = {
        H: "Group 1 (Period 1)",
        He: "Group 18 (Noble Gas)",
        Li: "Group 1 (Alkali Metal)",
        C: "Group 14 (Carbon Group)",
        N: "Group 15 (Nitrogen Group)",
        O: "Group 16 (Oxygen Group / Chalcogen)",
        F: "Group 17 (Halogen)",
        Na: "Group 1 (Alkali Metal)",
        Mg: "Group 2 (Alkaline Earth Metal)",
        Al: "Group 13 (Boron Group)",
        P: "Group 15 (Nitrogen Group)",
        S: "Group 16 (Oxygen Group / Chalcogen)",
        Cl: "Group 17 (Halogen)",
        K: "Group 1 (Alkali Metal)",
        Ca: "Group 2 (Alkaline Earth Metal)",
        Fe: "Transition Metal (Group 8)",
        Cu: "Transition Metal (Group 11)",
        Zn: "Transition Metal (Group 12)",
        Br: "Group 17 (Halogen)",
        Ag: "Transition Metal (Group 11)",
        I: "Group 17 (Halogen)",
        Pb: "Group 14 (Carbon Group)"
    };

    const COMPOUND_DESCRIPTIONS = {
        "NH3": {
            name: "Ammonia",
            together: "Pungent alkaline gas synthesized from nitrogen and hydrogen. Together, it acts as a base and cleaner, completely different from N₂ or H₂.",
            type: "Covalent Compound"
        },
        "H2O": {
            name: "Water",
            together: "Neutral liquid compound formed from combustible hydrogen and oxygen gases. Essential for all biological life.",
            type: "Covalent Compound"
        },
        "Na": {
            name: "Sodium Metal",
            together: "Soft, highly reactive alkali metal with 1 valence electron.",
            type: "Metallic Element"
        },
        "NaOH": {
            name: "Sodium Hydroxide",
            together: "Strong caustic alkali base formed from sodium, oxygen, and hydrogen.",
            type: "Ionic Compound"
        },
        "H2": {
            name: "Hydrogen Gas",
            together: "Diatomic molecule of 2 hydrogen atoms sharing a single covalent bond (H-H).",
            type: "Diatomic Molecule"
        },
        "N2": {
            name: "Nitrogen Gas",
            together: "Inert diatomic atmospheric gas held by a strong triple covalent bond (N≡N).",
            type: "Diatomic Molecule"
        },
        "O2": {
            name: "Oxygen Gas",
            together: "Diatomic gas vital for respiration and combustion (O=O).",
            type: "Diatomic Molecule"
        },
        "CO2": {
            name: "Carbon Dioxide",
            together: "Dense greenhouse gas formed by the complete combustion of carbon.",
            type: "Covalent Compound"
        },
        "CH4": {
            name: "Methane",
            together: "Clean-burning hydrocarbon gas, the primary constituent of natural gas fuel.",
            type: "Hydrocarbon"
        },
        "NaCl": {
            name: "Sodium Chloride (Table Salt)",
            together: "Edible ionic crystal formed from reactive sodium and toxic chlorine.",
            type: "Ionic Salt"
        },
        "HCl": {
            name: "Hydrochloric Acid",
            together: "Corrosive acid solution of hydrogen and chlorine.",
            type: "Acid Solution"
        },
        "Zn": {
            name: "Zinc Metal",
            together: "Silvery transition metal that acts as a strong reducing agent.",
            type: "Metallic Element"
        },
        "ZnCl2": {
            name: "Zinc Chloride",
            together: "Soluble salt formed when zinc dissolves in hydrochloric acid.",
            type: "Ionic Salt"
        },
        "KI": {
            name: "Potassium Iodide",
            together: "Soluble halide salt containing potassium and iodide ions.",
            type: "Ionic Salt"
        },
        "Br2": {
            name: "Bromine Liquid",
            together: "Dense, volatile reddish-brown liquid halogen.",
            type: "Halogen Element"
        },
        "I2": {
            name: "Iodine Solid",
            together: "Dark purple-black crystalline halogen that sublimes into purple vapor.",
            type: "Halogen Element"
        },
        "KBr": {
            name: "Potassium Bromide",
            together: "White ionic salt formed by displacement of iodine by bromine.",
            type: "Ionic Salt"
        },
        "H2SO4": {
            name: "Sulfuric Acid",
            together: "Strong diprotic mineral acid used across chemical industries.",
            type: "Strong Acid"
        },
        "Na2SO4": {
            name: "Sodium Sulfate",
            together: "Neutral salt formed from acid-base neutralisation.",
            type: "Neutral Salt"
        },
        "AgNO3": {
            name: "Silver Nitrate",
            together: "Water-soluble silver salt that yields elemental silver in displacement reactions.",
            type: "Silver Salt"
        },
        "ZnNO3_2": {
            name: "Zinc Nitrate",
            together: "Soluble crystalline nitrate salt of zinc.",
            type: "Ionic Nitrate"
        },
        "Ag": {
            name: "Silver Metal",
            together: "Precious transition metal deposited as brilliant metallic crystals.",
            type: "Metallic Element"
        },
        "Na2CO3": {
            name: "Sodium Carbonate",
            together: "Alkaline carbonate salt that fizzes with acids to produce CO₂.",
            type: "Carbonate Salt"
        },
        "C3H8": {
            name: "Propane",
            together: "Flammable gaseous alkane hydrocarbon fuel stored as LPG.",
            type: "Hydrocarbon Fuel"
        },
        "PbNO3_2": {
            name: "Lead(II) Nitrate",
            together: "Soluble heavy metal nitrate salt.",
            type: "Heavy Metal Salt"
        },
        "PbI2": {
            name: "Lead(II) Iodide",
            together: "Vibrant yellow insoluble precipitate ('golden rain' compound).",
            type: "Insoluble Precipitate"
        },
        "KNO3": {
            name: "Potassium Nitrate",
            together: "Crystalline oxidizing salt used in agricultural fertilizers.",
            type: "Nitrate Salt"
        },
        "NO2": {
            name: "Nitrogen Dioxide",
            together: "Toxic reddish-brown choking gas produced in nitrate decomposition.",
            type: "Covalent Gas"
        },
        "Al": {
            name: "Aluminium Metal",
            together: "Lightweight, highly reactive metal that forms a protective oxide layer.",
            type: "Metallic Element"
        },
        "Al2O3": {
            name: "Aluminium Oxide",
            together: "Tough, amphoteric oxide ceramic powder.",
            type: "Amphoteric Oxide"
        },
        "KClO3": {
            name: "Potassium Chlorate",
            together: "Strong oxidizing salt that decomposes into oxygen gas.",
            type: "Oxidizing Salt"
        },
        "KCl": {
            name: "Potassium Chloride",
            together: "White crystalline ionic salt formed from potassium and chlorine.",
            type: "Ionic Salt"
        },
        "Mg": {
            name: "Magnesium Ribbon",
            together: "Group 2 alkaline earth metal that burns with a brilliant white flame.",
            type: "Alkaline Earth Metal"
        },
        "MgO": {
            name: "Magnesium Oxide",
            together: "Basic ionic white ash formed by burning magnesium in oxygen.",
            type: "Basic Oxide"
        },
        "C2H5OH": {
            name: "Ethanol",
            together: "Clean-burning biofuel and industrial alcohol produced by fermentation.",
            type: "Organic Alcohol"
        },
        "CuCl2": {
            name: "Copper(II) Chloride",
            together: "Blue-green transition metal salt solution.",
            type: "Transition Metal Salt"
        },
        "Cu": {
            name: "Copper Metal",
            together: "Reddish ductile transition metal displaced by more reactive metals.",
            type: "Metallic Element"
        },
        "AlCl3": {
            name: "Aluminium Chloride",
            together: "Volatile white compound formed from aluminium and chlorine.",
            type: "Covalent/Ionic Salt"
        },
        "CH3COOH": {
            name: "Ethanoic Acid",
            together: "Weak carboxylic organic acid, the acidic component of vinegar.",
            type: "Carboxylic Acid"
        },
        "C3H7OH": {
            name: "Propanol",
            together: "Three-carbon organic alcohol used in ester synthesis.",
            type: "Organic Alcohol"
        },
        "CH3COOC3H7": {
            name: "Propyl Ethanoate",
            together: "Fruity, sweet-smelling ester compound synthesized by condensation.",
            type: "Organic Ester"
        },
        "C2H4": {
            name: "Ethene",
            together: "Reactive gaseous alkene containing a carbon-carbon double bond (C=C).",
            type: "Alkene Hydrocarbon"
        },
        "SO2": {
            name: "Sulfur Dioxide",
            together: "Choking acidic gas produced by combustion of sulfur.",
            type: "Acidic Gas"
        },
        "SO3": {
            name: "Sulfur Trioxide",
            together: "Dense fuming gas converted into concentrated sulfuric acid.",
            type: "Acidic Oxide"
        },
        "Fe2O3": {
            name: "Iron(III) Oxide",
            together: "Natural hematite rust ore reduced to molten iron in blast furnaces.",
            type: "Iron Ore"
        },
        "Fe": {
            name: "Iron Metal",
            together: "Magnetic transition metal widely used in structural engineering.",
            type: "Transition Metal"
        },
        "C6H12O6": {
            name: "Glucose",
            together: "Simple hexose carbohydrate sugar fermented into ethanol and CO₂.",
            type: "Carbohydrate Sugar"
        },
        "MgCl2": {
            name: "Magnesium Chloride",
            together: "Soluble ionic salt formed when magnesium dissolves in acid.",
            type: "Ionic Salt"
        }
    };

    const LEVEL_REACTION_EXPLANATIONS = {
        "Haber Process": "Industrial method combining nitrogen and hydrogen to synthesize ammonia for agricultural fertilizers.",
        "Sodium-Water Reaction": "Exothermic reaction between reactive sodium metal and water forming sodium hydroxide and hydrogen gas.",
        "Halogen Displacement": "Reactive bromine displaces iodide ions from potassium iodide, releasing elemental iodine.",
        "Acid-Metal Reaction": "Zinc dissolves in hydrochloric acid to produce hydrogen gas and zinc chloride salt.",
        "Neutralisation": "Sulfuric acid reacts with sodium hydroxide base to produce neutral water and sodium sulfate salt.",
        "Metal Displacement": "Zinc displaces silver ions from silver nitrate solution, depositing pure silver crystals.",
        "Acid-Carbonate Reaction": "Sodium carbonate reacts with hydrochloric acid, releasing carbon dioxide bubbles, water, and salt.",
        "Combustion of Propane": "Propane LPG gas burns in oxygen to yield carbon dioxide, water vapor, and heat energy.",
        "Precipitation": "Lead(II) nitrate mixes with potassium iodide, forming bright yellow insoluble lead(II) iodide precipitate.",
        "Decomposition of Silver Nitrate": "Thermal breakdown of silver nitrate into metallic silver, nitrogen dioxide gas, and oxygen gas.",
        "Combustion of Aluminium": "Aluminium metal powder burns in oxygen to form an aluminium oxide layer.",
        "Decomposition of Potassium Chlorate": "Thermal decomposition of potassium chlorate yielding potassium chloride and oxygen gas.",
        "Oxidation of Magnesium": "Magnesium burns with a blinding white flame in oxygen to produce white magnesium oxide ash.",
        "Combustion of Methane": "Natural gas burns cleanly in oxygen to release energy, carbon dioxide, and water vapor.",
        "Combustion of Ethanol": "Biofuel ethanol combusts in oxygen to generate clean energy, carbon dioxide, and steam.",
        "Esterification": "Ethanoic acid reacts with propanol in acid catalyst to synthesize sweet-smelling propyl ethanoate ester.",
        "Hydration of Ethene": "Addition of steam to ethene gas over a catalyst to manufacture industrial ethanol.",
        "Contact Process": "Key industrial stage converting sulfur dioxide to sulfur trioxide to manufacture sulfuric acid.",
        "Reduction of Metal Oxide": "Reduction of iron(III) oxide with hydrogen gas to yield pure elemental iron.",
        "Fermentation of Glucose": "Anaerobic respiration by yeast enzymes breaking down glucose into ethanol and carbon dioxide.",
        "Reaction of a Metal with Acid": "Magnesium vigorously reacts with hydrochloric acid, rapidly liberating hydrogen gas."
    };

    function initCard() {
        if (cardEl) return;
        cardEl = document.createElement('div');
        cardEl.id = 'sci-info-card';
        document.body.appendChild(cardEl);
    }

    function getElementMeta(sym) {
        const db = window.FULL_ELEMENT_DB || {};
        const meta = db[sym] || {};
        const name = ELEM_NAMES_LOCAL[sym] || sym;
        const color = ATOM_COLORS_LOCAL[sym] || { bg: '#64748b', color: '#ffffff' };
        return {
            sym,
            name,
            mass: meta.mass || 'Unknown mass',
            type: meta.type || 'Chemical Element',
            fact: meta.fact || '',
            bg: color.bg,
            color: color.color
        };
    }

    function renderAtomCircle(sym, customSize = 24) {
        const meta = getElementMeta(sym);
        return `<div class="sic-atom-circle" style="width:${customSize}px; height:${customSize}px; font-size:${Math.round(customSize*0.48)}px; background:${meta.bg}; color:${meta.color};">${sym}</div>`;
    }

    function parseComposition(formula) {
        const comp = {};
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;
        while ((match = regex.exec(formula)) !== null) {
            if (!match[1]) continue;
            const el = match[1];
            const cnt = parseInt(match[2]) || 1;
            comp[el] = (comp[el] || 0) + cnt;
        }
        return comp;
    }

    function buildCardData(type, target, e) {
        const text = target.innerText.trim();

        switch (type) {
            // 1. Level Title: Real chemistry explanation
            case 'level-title': {
                const titleText = (window.currentLevelData && window.currentLevelData.title) 
                    ? window.currentLevelData.title 
                    : text.replace(/^Level\s*\d+\s*:\s*/i, '').trim();
                const cleanTitle = titleText.replace(/^Round\s*\d+\/\d+\s*:\s*/i, '').trim();
                const exp = LEVEL_REACTION_EXPLANATIONS[cleanTitle] 
                    || (window.currentLevelData ? `Chemical reaction: ${window.currentLevelData.equation}` : "Interactive chemical reaction.");
                const eq = (window.currentLevelData && window.currentLevelData.equation) ? window.currentLevelData.equation : '';

                return {
                    badgeClass: 'sic-badge-molecule',
                    badgeText: 'Reaction Profile',
                    title: cleanTitle,
                    visualHtml: eq ? `<div style="font-weight:900; font-size:0.92rem; color:#1e40af; text-align:center;">${eq}</div>` : '',
                    callout: exp
                };
            }

            // 2. Coefficient: Visual Groups + Exact Math Calculations
            case 'coeff': {
                const coeff = parseInt(text) || 0;
                const molName = target.getAttribute('data-mol-name') || 'Molecule';
                const formula = target.getAttribute('data-mol-formula') || molName;
                
                let comp = null;
                try {
                    const rawComp = target.getAttribute('data-composition');
                    if (rawComp) comp = JSON.parse(rawComp);
                } catch (err) {}
                if (!comp || Object.keys(comp).length === 0) {
                    comp = parseComposition(formula || target.innerText);
                }

                // Helper to format chemical subscript numbers
                const uniMap = { '0':'₀', '1':'₁', '2':'₂', '3':'₃', '4':'₄', '5':'₅', '6':'₆', '7':'₇', '8':'₈', '9':'₉' };
                const cleanFormula = (formula || molName).replace(/([0-9]+)/g, m => m.split('').map(d => uniMap[d] || d).join(''));

                let atomsPerMol = 0;
                for (let el in comp) {
                    atomsPerMol += comp[el];
                }
                if (atomsPerMol === 0) atomsPerMol = 1;

                const displayCoeff = coeff;
                const totalAtoms = displayCoeff * atomsPerMol;

                if (displayCoeff === 0) {
                    return {
                        badgeClass: 'sic-badge-coeff',
                        badgeText: 'Coefficient',
                        accentColor: '#f59e0b',
                        title: 'Big Number "0"',
                        visualHtml: `
                            <div style="background:#fef3c7; border:2px solid #b45309; border-radius:8px; padding:8px 12px; text-align:center;">
                                <div style="font-size:1.02rem; font-weight:900; color:#000000; margin-bottom:2px;">
                                    0 Groups of [${cleanFormula}]
                                </div>
                                <div style="font-size:0.84rem; font-weight:700; color:#78350f;">
                                    0 molecules × ${atomsPerMol} atoms = 0 total atoms
                                </div>
                            </div>
                        `,
                        desc: `No ${molName} molecules on this side yet. Click + below to add a group.`
                    };
                }

                // Build one group's bonded atom visualization
                let oneGroupAtoms = '';
                let isFirstAtom = true;
                for (let el in comp) {
                    for (let c = 0; c < comp[el]; c++) {
                        if (!isFirstAtom) {
                            oneGroupAtoms += `<span style="color:#94a3b8; font-weight:900; margin:0 3px;">—</span>`;
                        }
                        oneGroupAtoms += renderAtomCircle(el, 20);
                        isFirstAtom = false;
                    }
                }

                // Render each group box visually
                let groupBoxesHtml = '';
                const visibleGroups = Math.min(displayCoeff, 3);
                for (let i = 1; i <= visibleGroups; i++) {
                    groupBoxesHtml += `
                        <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:8px; padding:4px 8px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1.5px 0 #cbd5e1;">
                            <span style="font-size:0.72rem; font-weight:900; color:#475569; text-transform:uppercase;">Group ${i}:</span>
                            <div style="display:flex; align-items:center;">${oneGroupAtoms}</div>
                        </div>
                    `;
                }
                if (displayCoeff > 3) {
                    groupBoxesHtml += `
                        <div style="background:#f1f5f9; border:1.5px dashed #94a3b8; border-radius:8px; padding:3px 8px; text-align:center; font-size:0.75rem; font-weight:800; color:#64748b;">
                            + ${displayCoeff - 3} more ${displayCoeff - 3 === 1 ? 'group' : 'groups'} of [${cleanFormula}]
                        </div>
                    `;
                }

                // Math breakdown lines for each element
                let mathLines = [];
                for (let el in comp) {
                    const countPerMol = comp[el];
                    const elTotal = displayCoeff * countPerMol;
                    const meta = getElementMeta(el);
                    mathLines.push(`• ${displayCoeff} × ${countPerMol} ${el} = <strong>${elTotal} ${meta.name} atom${elTotal === 1 ? '' : 's'}</strong>`);
                }

                return {
                    badgeClass: 'sic-badge-coeff',
                    badgeText: 'Coefficient',
                    accentColor: '#f59e0b',
                    title: `Big Number "${displayCoeff}"`,
                    visualHtml: `
                        <div style="margin-bottom:6px;">
                            <div style="font-size:0.88rem; font-weight:900; color:#0f172a; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
                                <span>${displayCoeff} ${displayCoeff === 1 ? 'Group' : 'Groups'} of [${cleanFormula}]</span>
                                <span style="font-size:0.72rem; color:#b45309; background:#fef3c7; padding:1px 6px; border-radius:4px; border:1px solid #fde68a;">${atomsPerMol} atoms / mol</span>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:4px;">
                                ${groupBoxesHtml}
                            </div>
                        </div>
                        <div style="background:#fef3c7; border:2px solid #b45309; border-radius:8px; padding:7px 10px; text-align:left;">
                            <div style="font-size:0.75rem; font-weight:900; color:#b45309; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px;">
                                📐 Math Calculation:
                            </div>
                            <div style="font-size:0.85rem; font-weight:800; color:#451a03; line-height:1.45;">
                                ${mathLines.join('<br>')}
                            </div>
                        </div>
                    `
                };
            }

            // 3. Subscript: Small Number (User's chosen Tactile Pill style)
            case 'subscript': {
                const count = target.getAttribute('data-count') || text || '2';
                const elSym = target.getAttribute('data-element') || 'H';
                const elMeta = getElementMeta(elSym);

                let bondedChain = '';
                const atomCount = parseInt(count) || 2;
                for (let i = 0; i < atomCount; i++) {
                    if (i > 0) bondedChain += `<span style="color:#7e22ce; font-weight:900; margin:0 6px; font-size:1.1rem; line-height:1;">—</span>`;
                    bondedChain += renderAtomCircle(elSym, 26);
                }

                return {
                    badgeClass: 'sic-badge-subscript',
                    badgeText: 'Subscript',
                    accentColor: '#8b5cf6',
                    title: `Small Number "${count}"`,
                    visualHtml: `
                        <div style="background:#f3e8ff; border:2px solid #7e22ce; border-radius:8px; padding:8px 12px; display:flex; align-items:center; justify-content:center;">
                            <div style="display:flex; align-items:center;">
                                ${bondedChain}
                            </div>
                        </div>
                    `,
                    desc: `That means there are ${count} ${elMeta.name.toLowerCase()} in this`
                };
            }

            // 4. Element Symbol: Shows Periodic Table Group instead of atomic mass
            case 'element': {
                const sym = target.getAttribute('data-element') || text;
                const meta = getElementMeta(sym);
                const grp = ELEMENT_GROUPS[sym] || "Periodic Table Element";

                return {
                    badgeClass: 'sic-badge-element',
                    badgeText: 'Periodic Element',
                    title: `${meta.name} (${sym})`,
                    visualHtml: `
                        <div class="sic-visual-graphic" style="gap:10px;">
                            ${renderAtomCircle(sym, 32)}
                            <div style="font-size:0.82rem; font-weight:800; color:#0f172a; text-align:left;">
                                <div style="color:#0284c7; font-weight:900;">${grp}</div>
                                <div style="color:#64748b; font-size:0.75rem;">${meta.type}</div>
                            </div>
                        </div>
                    `,
                    callout: `Every ${sym} atom entering on the left must exit on the right.`
                };
            }

            // 5. State of Matter
            case 'state': {
                const st = (target.getAttribute('data-state') || text.replace(/[\(\)]/g, '')).toLowerCase();
                const stateMap = {
                    g: { name: 'Gas', icon: '💨' },
                    s: { name: 'Solid', icon: '🧱' },
                    l: { name: 'Liquid', icon: '💧' },
                    aq: { name: 'Aqueous (Dissolved)', icon: '🧪' }
                };
                const info = stateMap[st] || { name: 'Physical State', icon: '🧪' };

                return {
                    badgeClass: 'sic-badge-state',
                    badgeText: 'State of Matter',
                    title: `State: ${info.name}`,
                    visualHtml: `
                        <div class="sic-visual-graphic" style="font-size:1.6rem; gap:8px;">
                            <span>${info.icon}</span>
                            <span style="font-size:1.05rem; font-weight:900; color:#1e40af;">(${st})</span>
                        </div>
                    `,
                    callout: `Indicates whether substance is gas, liquid, solid, or dissolved in water.`
                };
            }

            // 6. Plus Sign: Simple 1-2 words
            case 'plus': {
                return {
                    badgeClass: 'sic-badge-operator',
                    badgeText: 'Operator',
                    title: 'Plus Sign (+)',
                    visualHtml: `
                        <div class="sic-visual-graphic" style="font-weight:900; font-size:1.05rem; color:#475569;">
                            <span>A</span> <span style="color:#2563eb; font-size:1.3rem;">+</span> <span>B</span>
                        </div>
                    `,
                    callout: `Combines separate substances.`
                };
            }

            // 7. Arrow: Simple 1-2 words
            case 'arrow': {
                return {
                    badgeClass: 'sic-badge-operator',
                    badgeText: 'Operator',
                    title: 'Reaction Arrow (➔)',
                    visualHtml: `
                        <div class="sic-visual-graphic" style="font-weight:900; font-size:0.95rem;">
                            <span style="color:#2563eb;">Reactants</span>
                            <span style="font-size:1.3rem; margin:0 4px;">➔</span>
                            <span style="color:#ea580c;">Products</span>
                        </div>
                    `,
                    callout: `Law of Conservation of Mass: Matter is rearranged, not created or destroyed.`
                };
            }

            // 8. Molecule: Chemical Compound (User's chosen direct sentence)
            case 'molecule': {
                const molName = target.getAttribute('data-mol-name') || text;
                const rawFormula = target.getAttribute('data-mol-formula') || text;
                const cleanKey = rawFormula.replace(/[^A-Za-z0-9_]/g, '');
                
                // Helper to format chemical subscript numbers
                const uniMap = { '0':'₀', '1':'₁', '2':'₂', '3':'₃', '4':'₄', '5':'₅', '6':'₆', '7':'₇', '8':'₈', '9':'₉' };
                const cleanFormula = (rawFormula || molName).replace(/([0-9]+)/g, m => m.split('').map(d => uniMap[d] || d).join(''));

                // Lookup compound explanation
                const compData = COMPOUND_DESCRIPTIONS[cleanKey] 
                    || COMPOUND_DESCRIPTIONS[rawFormula] 
                    || { name: molName, together: "A stable chemical substance formed by bonded elements.", type: "Covalent Compound" };

                return {
                    badgeClass: 'sic-badge-molecule',
                    badgeText: compData.type || 'Covalent Compound',
                    accentColor: '#10b981',
                    title: `${compData.name || molName} (${cleanFormula})`,
                    desc: compData.together
                };
            }

            // 9. Add Molecule Buttons: Shows how much it will add
            case 'btn-react':
            case 'btn-prod': {
                const isReact = type === 'btn-react';
                const molName = target.getAttribute('data-mol-name') || target.innerText.replace('+', '').trim();
                const molId = target.getAttribute('data-mol-id') || '';
                
                let comp = null;
                try {
                    const raw = target.getAttribute('data-composition');
                    if (raw) comp = JSON.parse(raw);
                } catch(e) {}
                if (!comp && window.currentLevelData) {
                    const list = isReact ? window.currentLevelData.reactants : window.currentLevelData.products;
                    const found = list.find(m => m.id === molId || m.name === molName);
                    if (found) comp = found.composition;
                }
                if (!comp) comp = parseComposition(molId || molName);

                let itemsHtml = '';
                let totalAtoms = 0;
                for (let el in comp) {
                    const count = comp[el];
                    totalAtoms += count;
                    itemsHtml += `
                        <div class="sic-add-item">
                            <span style="display:flex; align-items:center; gap:5px;">
                                ${renderAtomCircle(el, 20)}
                                <span>${el}</span>
                            </span>
                            <span class="sic-add-badge">+${count}</span>
                        </div>
                    `;
                }

                return {
                    badgeClass: isReact ? 'sic-badge-state' : 'sic-badge-coeff',
                    badgeText: isReact ? 'Add to Left' : 'Add to Right',
                    title: `+1 ${molName}`,
                    visualHtml: `
                        <div class="sic-add-list">${itemsHtml}</div>
                        <div class="sic-visual-caption">Clicking adds <strong>+${totalAtoms} atoms</strong> to ${isReact ? 'Reactants' : 'Products'}</div>
                    `,
                    callout: `Drops 1 molecule into the scale beaker.`
                };
            }

            // 10. Element Tray Tracker Card: Direct and non-wordy
            case 'tracker-card': {
                const elSym = target.getAttribute('data-element') || 'H';
                const elMeta = getElementMeta(elSym);

                let rCount = 0;
                let pCount = 0;
                if (window.counts && window.counts.rCounts && window.counts.pCounts) {
                    rCount = window.counts.rCounts[elSym] || 0;
                    pCount = window.counts.pCounts[elSym] || 0;
                } else {
                    rCount = parseInt(target.getAttribute('data-rcount')) || 0;
                    pCount = parseInt(target.getAttribute('data-pcount')) || 0;
                }

                const isBalanced = (rCount === pCount && rCount > 0);
                const isEmpty = (rCount === 0 && pCount === 0);

                if (isEmpty) {
                    return {
                        badgeClass: 'sic-badge-control',
                        badgeText: 'Empty',
                        accentColor: '#64748b',
                        title: `${elMeta.name}, Empty`,
                        desc: 'No atoms added yet.'
                    };
                }

                if (isBalanced) {
                    return {
                        badgeClass: 'sic-badge-balanced',
                        badgeText: 'Balanced',
                        accentColor: '#10b981',
                        title: `${elMeta.name}, Balanced`,
                        desc: 'Left and right atom counts match.'
                    };
                }

                // Unbalanced: exact user-requested phrasing
                if (rCount < pCount) {
                    return {
                        badgeClass: 'sic-badge-unbalanced',
                        badgeText: 'Unbalanced',
                        accentColor: '#ef4444',
                        title: `${elMeta.name}, Unbalanced`,
                        desc: `The Reactants' ${elMeta.name} is low.`
                    };
                } else {
                    return {
                        badgeClass: 'sic-badge-unbalanced',
                        badgeText: 'Unbalanced',
                        title: `${elMeta.name}, Unbalanced`,
                        desc: `The Products' ${elMeta.name} is low.`
                    };
                }
            }

            // 11. Element Trays Toggle Drawer
            case 'btn-tray': {
                const isClosed = document.querySelector('.block-left')?.classList.contains('collapsed');
                return {
                    badgeClass: 'sic-badge-control',
                    badgeText: 'Drawer',
                    accentColor: '#06b6d4',
                    title: 'Element Tray',
                    desc: 'Compare each of your Element type on each side.',
                    callout: isClosed ? 'Click to show me.' : 'Click to hide me.'
                };
            }

            case 'settings-clear-chat': {
                return {
                    badgeClass: 'sic-badge-settings',
                    badgeText: 'Setting',
                    accentColor: '#6366f1',
                    title: 'Delete chat?'
                };
            }

            case 'settings-mute': {
                const isMuted = !!window.isMuted;
                return {
                    badgeClass: 'sic-badge-settings',
                    badgeText: 'Setting',
                    accentColor: '#14b8a6',
                    title: isMuted ? 'Unmute?' : 'Mute?'
                };
            }

            case 'settings-fullscreen': {
                return {
                    badgeClass: 'sic-badge-settings',
                    badgeText: 'Setting',
                    accentColor: '#6366f1',
                    title: 'Full screen?'
                };
            }

            case 'settings-help':
            case 'settings-hint': {
                return {
                    badgeClass: 'sic-badge-settings',
                    badgeText: 'Help',
                    title: 'How to play?'
                };
            }

            case 'settings-undo': {
                return {
                    badgeClass: 'sic-badge-settings',
                    badgeText: 'Setting',
                    accentColor: '#6366f1',
                    title: 'Undo?'
                };
            }

            case 'settings-reset': {
                return {
                    badgeClass: 'sic-badge-settings',
                    badgeText: 'Setting',
                    accentColor: '#6366f1',
                    title: 'Reset?'
                };
            }

            
            // 13. Bottom Panel Footer Atom Counters
                        case 'footer-count': {
                const elSym = target.getAttribute('data-element') || 'H';
                const side = target.getAttribute('data-side') || 'react';
                const isReact = side === 'react';
                let count = target.getAttribute('data-count') || '0';
                if (window.counts) {
                    if (isReact && window.counts.rCounts && window.counts.rCounts[elSym] !== undefined) {
                        count = window.counts.rCounts[elSym];
                    } else if (!isReact && window.counts.pCounts && window.counts.pCounts[elSym] !== undefined) {
                        count = window.counts.pCounts[elSym];
                    }
                }
                const elMeta = getElementMeta(elSym);
                const grp = ELEMENT_GROUPS[elSym] || '';

                return {
                    badgeClass: isReact ? 'sic-badge-state' : 'sic-badge-coeff',
                    badgeText: isReact ? 'Reactant Tally' : 'Product Tally',
                    accentColor: isReact ? '#1d4ed8' : '#c2410c',
                    title: `${elMeta.name} (${elSym})`,
                    visualHtml: `
                        <div class="sic-visual-graphic" style="gap:8px; font-weight:900;">
                            ${renderAtomCircle(elSym, 28)}
                            <span style="font-size:1.15rem; color:${isReact ? '#1d4ed8' : '#c2410c'};相對">= ${count} atom${count === 1 || count === '1' ? '' : 's'}</span>
                        </div>
                        <div class="sic-visual-caption">Total ${elMeta.name} in ${isReact ? 'Reactants beaker' : 'Products beaker'}</div>
                    `,
                    callout: `${elMeta.name} is in ${grp}.`
                };
            }

            case 'btn-hint': {
                return {
                    badgeClass: 'sic-badge-coeff',
                    badgeText: 'Hint',
                    title: 'Need a Hint?',
                    desc: 'Stuck? No shame in asking!'
                };
            }

            case 'status-balance': {
                let isEmpty = false;
                let isBalanced = false;

                if (window.counts) {
                    if (window.counts.isEmpty !== undefined) {
                        isEmpty = window.counts.isEmpty;
                    } else if (window.counts.rCounts && window.counts.pCounts) {
                        let totalR = 0, totalP = 0;
                        for (let k in window.counts.rCounts) totalR += window.counts.rCounts[k] || 0;
                        for (let k in window.counts.pCounts) totalP += window.counts.pCounts[k] || 0;
                        isEmpty = (totalR === 0 && totalP === 0);
                    }
                }
                if (window.molCounts) {
                    let totalMol = 0;
                    for (let id in window.molCounts.react || {}) totalMol += window.molCounts.react[id] || 0;
                    for (let id in window.molCounts.prod || {}) totalMol += window.molCounts.prod[id] || 0;
                    if (totalMol === 0) isEmpty = true;
                }

                if (isEmpty) {
                    return {
                        badgeClass: 'sic-badge-unbalanced',
                        badgeText: 'Empty',
                        accentColor: '#ef4444',
                        title: 'Unbalanced',
                        desc: 'Go on, give it a try! Add something!'
                    };
                }

                if (window.counts && window.counts.rCounts && window.counts.pCounts) {
                    const r = JSON.stringify(window.counts.rCounts);
                    const p = JSON.stringify(window.counts.pCounts);
                    isBalanced = (r === p && r !== '{}' && !isEmpty);
                } else if (target.innerText.includes('BALANCED') && !target.innerText.includes('UN')) {
                    isBalanced = true;
                }

                return {
                    badgeClass: isBalanced ? 'sic-badge-balanced' : 'sic-badge-unbalanced',
                    badgeText: isBalanced ? 'Balanced' : 'Unbalanced',
                    accentColor: isBalanced ? '#10b981' : '#ef4444',
                    title: isBalanced ? 'Balanced' : 'Unbalanced',
                    desc: isBalanced
                        ? 'Your equation is Balanced! Superb, if you are reading this, it is either not simplfied or you are reviewing'
                        : 'Your equation is not balanced! Make sure both side have equal amount of atom for each element!'
                };
            }

            case 'status-simplify': {
                let isEmpty = false;
                let isBalanced = false;
                let isSimplified = false;
                let ratioText = '';

                if (window.counts) {
                    if (window.counts.isEmpty !== undefined) {
                        isEmpty = window.counts.isEmpty;
                    } else if (window.counts.rCounts && window.counts.pCounts) {
                        let totalR = 0, totalP = 0;
                        for (let k in window.counts.rCounts) totalR += window.counts.rCounts[k] || 0;
                        for (let k in window.counts.pCounts) totalP += window.counts.pCounts[k] || 0;
                        isEmpty = (totalR === 0 && totalP === 0);
                    }
                }
                if (window.molCounts) {
                    let totalMol = 0;
                    for (let id in window.molCounts.react || {}) totalMol += window.molCounts.react[id] || 0;
                    for (let id in window.molCounts.prod || {}) totalMol += window.molCounts.prod[id] || 0;
                    if (totalMol === 0) isEmpty = true;
                }

                if (isEmpty) {
                    return {
                        badgeClass: 'sic-badge-unbalanced',
                        badgeText: 'Empty',
                        accentColor: '#ef4444',
                        title: 'Not Simplified',
                        desc: 'Go on, give it a try! Add something!'
                    };
                }

                if (window.counts && window.counts.rCounts && window.counts.pCounts) {
                    const r = JSON.stringify(window.counts.rCounts);
                    const p = JSON.stringify(window.counts.pCounts);
                    isBalanced = (r === p && r !== '{}' && !isEmpty);
                } else if (document.querySelector('.status-left')?.innerText.includes('BALANCED') && !document.querySelector('.status-left')?.innerText.includes('UN')) {
                    isBalanced = true;
                }
                
                if (window.currentLevelData && window.molCounts) {
                    let allCoeffs = [];
                    let hasZero = false;
                    window.currentLevelData.reactants.forEach(m => {
                        let c = window.molCounts.react[m.id] || 0;
                        if (c === 0) hasZero = true;
                        allCoeffs.push(c);
                    });
                    window.currentLevelData.products.forEach(m => {
                        let c = window.molCounts.prod[m.id] || 0;
                        if (c === 0) hasZero = true;
                        allCoeffs.push(c);
                    });
                    if (!hasZero && allCoeffs.length > 0) {
                        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
                        let g = allCoeffs.reduce((acc, val) => gcd(acc, val), allCoeffs[0]);
                        isSimplified = (g === 1);
                        ratioText = allCoeffs.join(' : ');
                    }
                }

                if (!isBalanced) {
                    return {
                        badgeClass: 'sic-badge-unbalanced',
                        badgeText: 'Status',
                        accentColor: '#ef4444',
                        title: 'Incomplete',
                        desc: 'Balance the equation first before checking lowest coefficients.'
                    };
                }

                if (!isSimplified) {
                    return {
                        badgeClass: 'sic-badge-coeff',
                        badgeText: 'Simplify',
                        accentColor: '#eab308',
                        title: ratioText ? `${ratioText} Not Simplified` : 'Not Simplified',
                        desc: 'You can simplfy this! reduce the coeffeicint of both side element atom, until it is in its lowest whole-number ratio.'
                    };
                }

                return {
                    badgeClass: 'sic-badge-balanced',
                    badgeText: 'Simplified',
                    accentColor: '#10b981',
                    title: 'Simplified',
                    desc: 'You did it! You found the lowest coeeffecnt, happy review'
                };
            }

            case 'scale-bucket': {
                const isLeft = target.getAttribute('data-side') === 'left';
                let countsMap = {};
                if (window.counts && window.counts.rCounts && window.counts.pCounts) {
                    countsMap = isLeft ? window.counts.rCounts : window.counts.pCounts;
                }
                if (window.currentLevelData && Object.keys(countsMap).length === 0) {
                    const list = isLeft ? window.currentLevelData.reactants : window.currentLevelData.products;
                    list.forEach(m => {
                        for (let el in m.composition) {
                            if (countsMap[el] === undefined) countsMap[el] = 0;
                        }
                    });
                }

                let elementRowsHtml = '';
                let totalAtoms = 0;
                let hasElements = false;

                for (let el in countsMap) {
                    hasElements = true;
                    const count = countsMap[el] || 0;
                    totalAtoms += count;
                    const meta = getElementMeta(el);
                    elementRowsHtml += `
                        <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:8px; padding:4px 10px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1.5px 0 #cbd5e1;">
                            <span style="display:flex; align-items:center; gap:8px;">
                                ${renderAtomCircle(el, 22)}
                                <strong style="font-size:0.92rem; color:#0f172a;">${meta.name} (${el}):</strong>
                            </span>
                            <span style="font-size:1.05rem; font-weight:900; color:${count > 0 ? (isLeft ? '#1d4ed8' : '#c2410c') : '#94a3b8'};">
                                ${count}
                            </span>
                        </div>
                    `;
                }

                if (!hasElements) {
                    elementRowsHtml = `<div style="font-size:0.86rem; color:#64748b; font-weight:700; text-align:center; padding:6px 0;">No atom marbles in beaker yet.</div>`;
                }

                return {
                    badgeClass: isLeft ? 'sic-badge-state' : 'sic-badge-coeff',
                    badgeText: isLeft ? 'Reactants' : 'Products',
                    accentColor: isLeft ? '#3b82f6' : '#ea580c',
                    title: isLeft ? 'Reactants Scale' : 'Products Scale',
                    visualHtml: `
                        <div style="display:flex; flex-direction:column; gap:4px; margin:4px 0;">
                            ${elementRowsHtml}
                        </div>
                    `,
                    desc: `Total: ${totalAtoms} atom${totalAtoms === 1 ? '' : 's'} in ${isLeft ? 'Reactants (Left)' : 'Products (Right)'} scale beaker.`
                };
            }

            case 'prof-beaker': {
                const isClosed = document.querySelector('.block-right')?.classList.contains('collapsed');
                return {
                    badgeClass: 'sic-badge-control',
                    badgeText: 'Tutor',
                    accentColor: '#3b82f6',
                    title: 'Prof. Beaker',
                    desc: 'Stuck? Let me help you!',
                    callout: isClosed ? "Don't be shy!" : 'Click to hide me.'
                };
            }

            case 'mode-simple':
            case 'mode-pro': {
                const isSimple = type === 'mode-simple';
                return {
                    badgeClass: 'sic-badge-state',
                    badgeText: 'Mode',
                    title: isSimple ? 'Simple Mode' : 'Pro Mode',
                    visualHtml: `<div style="font-size:1.4rem; text-align:center;">${isSimple ? '⚖️ Seesaw Physics' : '🔬 Coefficients Only'}</div>`,
                    callout: `Switch visual style anytime.`
                };
            }

            default:
                return null;
        }
    }

    function showCard(target, e) {
        const infoType = target.getAttribute('data-info');
        if (!infoType) return;

        const data = buildCardData(infoType, target, e);
        if (!data) return;

        if (activeHideTimeout) {
            clearTimeout(activeHideTimeout);
            activeHideTimeout = null;
        }

        initCard();

        cardEl.style.borderTopColor = data.accentColor || '#0f172a';
        cardEl.innerHTML = `
            <div class="sic-header">
                <h4 class="sic-title">${data.title}</h4>
                <span class="sic-badge ${data.badgeClass}">${data.badgeText}</span>
            </div>
            ${data.visualHtml ? `<div class="sic-visual-box">${data.visualHtml}</div>` : ''}
            ${data.desc ? `<p class="sic-desc">${data.desc}</p>` : ''}
            ${data.callout ? `<div class="sic-callout"><span class="sic-callout-icon">💡</span><span>${data.callout}</span></div>` : ''}
        `;

        cardEl.className = 'is-visible';
        positionCard(target);
        currentTarget = target;
    }

    function hideCard() {
        if (!cardEl) return;
        cardEl.classList.remove('is-visible');
        currentTarget = null;
    }

    function positionCard(target) {
        if (!cardEl) return;
        const rect = target.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        const gap = 10;

        let top = rect.top - cardRect.height - gap;
        let left = rect.left + (rect.width / 2) - (cardRect.width / 2);

        if (top < 10) {
            top = rect.bottom + gap;
        }

        if (left < 10) {
            left = 10;
        } else if (left + cardRect.width > window.innerWidth - 10) {
            left = window.innerWidth - cardRect.width - 10;
        }

        if (top + cardRect.height > window.innerHeight - 10) {
            top = window.innerHeight - cardRect.height - 10;
        }

        cardEl.style.top = `${Math.round(top)}px`;
        cardEl.style.left = `${Math.round(left)}px`;
    }

    function setupListeners() {
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-info]');
            if (target && target !== currentTarget) {
                showCard(target, e);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-info]');
            if (target && target === currentTarget) {
                activeHideTimeout = setTimeout(() => {
                    hideCard();
                }, 40);
            }
        });

        window.addEventListener('scroll', () => {
            if (currentTarget) positionCard(currentTarget);
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (currentTarget) positionCard(currentTarget);
        }, { passive: true });
    }

    window.showChemInfoCard = showCard;
    window.hideChemInfoCard = hideCard;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCard();
            setupListeners();
        });
    } else {
        initCard();
        setupListeners();
    }
})();
