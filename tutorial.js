function startInteractiveTutorial() {
    if (typeof Shepherd === 'undefined') return;
    
    // Check if already completed
    if (localStorage.getItem('stoich_tutorial_done') === 'true') {
        return;
    }

    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            cancelIcon: { enabled: true },
            classes: 'shadow-md bg-purple-dark',
            scrollTo: { behavior: 'smooth', block: 'center' }
        }
    });

    tour.addStep({
        id: 'welcome',
        text: 'Welcome to StoichBalance! 🧪 Let me show you how to balance your first chemical equation.',
        attachTo: { element: '#main-eval-box', on: 'bottom' },
        buttons: [{ text: 'Next', action: tour.next }]
    });

    tour.addStep({
        id: 'tray',
        text: 'These are your elements. You need to drag them to the boxes below to build molecules!',
        attachTo: { element: '#tray-left', on: 'bottom' },
        buttons: [{ text: 'Back', action: tour.back }, { text: 'Next', action: tour.next }]
    });

    tour.addStep({
        id: 'drag',
        text: 'Go ahead! Click and drag a molecule from here, and drop it into the Reactants box.',
        attachTo: { element: '#area-left', on: 'top' },
        advanceOn: { selector: '#area-left', event: 'drop' },
        buttons: [{ text: 'Back', action: tour.back }] // Advances on drop!
    });

    tour.addStep({
        id: 'scale',
        text: 'Awesome! Notice how the Master Scale tilted? Your goal is to make the amount of elements on both sides exactly equal.',
        attachTo: { element: '#master-scale', on: 'top' },
        buttons: [{ text: 'Back', action: tour.back }, { text: 'Next', action: tour.next }]
    });

    tour.addStep({
        id: 'finish',
        text: 'Keep dragging molecules to both sides until the scale perfectly balances. Good luck!',
        attachTo: { element: '#level-screen', on: 'center' },
        buttons: [{ text: 'Start Playing!', action: tour.complete }]
    });

    tour.on('complete', () => {
        localStorage.setItem('stoich_tutorial_done', 'true');
    });
    
    tour.on('cancel', () => {
        localStorage.setItem('stoich_tutorial_done', 'true');
    });

    tour.start();
}

window.startInteractiveTutorial = startInteractiveTutorial;
