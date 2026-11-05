(function(root) {
// ==========================================
// StoichBalance Bilingual Translation System (EN / BM)
// Concise, 1-to-1 Snappy Vocabulary (KSSM SPM Syllabus)
// ==========================================

root.TRANSLATIONS = {
    en: {
        // UI Navigation & Card Descriptions (Exact Originals)
        app_title: "StoichBalance",
        start_game: "Start Game",
        challenge_mode: "Challenge Mode",
        challenge_desc: "Test your balancing speed and accuracy.",
        sandbox_mode: "Sandbox Mode",
        sandbox_desc: "Build & solve custom equations.",
        periodic_table: "Periodic Table",
        periodic_desc: "Explore elements & weights.",
        help: "Help",
        settings: "Settings",
        sound_effects: "Sound Effects",
        bg_music: "Background Music",
        back: "Back",
        back_to_menu: "Menu",
        exit: "Exit",
        reset: "Reset",
        check_equation: "Check Equation",
        next_level: "Next Level",
        saved_reactions: "Saved",
        new_chat: "New Chat",
        close: "Close",
        fullscreen: "Fullscreen",
        exit_fullscreen: "Exit Fullscreen",
        select_level: "Select Level",
        form4: "Form 4",
        form5: "Form 5",
        all_levels: "All Levels",

        // Main Landing Page & Cards
        tour_guide_btn: "Interactive Tour & Guide",
        interactive_pt_btn: "Interactive Periodic Table",
        tagline: "Chemistry Made Fun!",
        player_name_label: "PLAYER NAME",
        player_name_placeholder: "Type your name...",
        player_profile_tooltip: "Select saved player profile",
        career_records_tooltip: "Career Records & Achievements",
        choose_activity: "Choose Activity",
        class_mode: "Class Mode",
        class_desc: "Standard curriculum progression.",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        modifiers: "Modifiers",
        mod_scale_name: "No Scale",
        mod_scale_desc: "Solve without the balance beam (+0.5x)",
        mod_hints_name: "No Hints",
        mod_hints_desc: "Solve without hints (+0.5x)",
        mod_rush_name: "90s Rush",
        mod_rush_desc: "90-second countdown rush (+0.5x)",
        create: "Create",
        levels: "Levels",
        fs_nudge_text: "✨ Hey, click me!",
        fs_nudge_title: "Click to go Fullscreen!",

        // Sandbox Choice Modal
        sb_choice_title: "How do you want to build?",
        sb_choice_subtitle: "Create custom chemical reactions using AI, the interactive periodic table, or manual text.",
        sb_ai_title: "AI Reaction Builder",
        sb_ai_desc: "Type informal text or messy formulas. AI will structure and balance the level!",
        sb_pt_title: "Periodic Table & Numpad",
        sb_pt_desc: "Full 118-element periodic grid, auto-complete, and tactile laboratory keypad.",
        sb_manual_title: "Manual Text Boxes",
        sb_manual_desc: "Classic separate input boxes for reactants and products.",
        sb_saved_title: "📁 Saved Custom Levels",
        sb_saved_hint: "Click any saved level to play immediately",
        sb_saved_empty: "No saved custom levels yet. Use AI or the Periodic Table to build one!",

        // Sandbox Input Modal (Visual Builder)
        builder_title: "Visual Equation Builder",
        builder_subtitle: "Type elements or click the Table icon to insert them!",
        builder_insert_el: "📊 Insert Element",
        builder_check_eq: "🔍 Check Equation",
        builder_save_play: "✅ Save & Play!",

        // Sandbox Virtual Modal (Chemistry Keyboard)
        vk_header_title: "Chemistry Keyboard & Equation Builder",
        vk_header_subtitle: "Tap elements on the periodic table or type with your physical keyboard.",
        vk_display_placeholder: "Type directly with physical keyboard or click elements below",
        vk_backspace_title: "Backspace: Delete previous character",
        vk_bunsen_title: "Prof. Bunsen",
        vk_bunsen_role: "AI Chemist",
        vk_bunsen_desc: "Prof. Bunsen is an advanced AI chemist that can help you turn your ideas into an equation.",
        vk_bunsen_cta: "Click to talk!",
        vk_tab_prompt: "Prompt Assistant",
        vk_tab_keypad: "Lab Keypad",
        vk_tab_tools: "Tools",
        vk_guide_title: "How to Build an Equation",
        vk_step1_label: "Pick Elements:",
        vk_step1_desc: "Tap the <b>Periodic Table</b> or click <b>Prof. Bunsen</b> above.",
        vk_step2_label: "Add Operators:",
        vk_step2_desc: "Use <b>+</b> and <b>→</b> to split reactants & products.",
        vk_step3_label: "Check & Solve:",
        vk_step3_desc: "Tap <b>Check Equation</b> to balance or auto-complete.",
        vk_step4_label: "Save to Play:",
        vk_step4_desc: "Tap <b>Save This Level</b> to store into your collection!",
        vk_btn_plus: "Plus",
        vk_btn_yields: "Yields",
        vk_btn_clear: "Clear",
        vk_btn_check: "Check Equation",
        vk_btn_save: "Save This Level",
        vk_btn_saved: "Saved to Collection! ✓",
        vk_btn_test: "Test Now",

        // Interactive Periodic Table Modal
        pt_modal_title: "Interactive Periodic Table",
        pt_awaiting_title: "Awaiting Input",
        pt_awaiting_desc: "Hover over any element on the periodic table to analyze its atomic structure.",
        pt_label_group: "Group",
        pt_label_period: "Period",
        pt_label_type: "Type",
        pt_label_mass: "Atomic Mass",
        pt_label_density: "Density",
        pt_label_melt: "Melting Point",
        pt_label_boil: "Boiling Point",
        pt_label_discoverer: "Discovered By",
        pt_label_year: "Discovery Year",
        pt_val_unknown: "Unknown",
        pt_label_protons: "Protons",
        pt_label_neutrons: "Neutrons",
        pt_label_electrons: "Electrons",
        pt_label_shells: "Shell Distribution",

        // Career Archive / Stats Modal
        stats_archive_badge: "CAREER ARCHIVE",
        stats_title: "Player Records",
        stats_role_chemist: "Chemist",
        stats_tab_history: "Match History",
        stats_tab_badges: "Badges & Trophies",
        stats_filter_label: "FILTER:",
        stats_filter_all: "All",
        stats_kpi_runs: "TOTAL RUNS",
        stats_kpi_best: "BEST TIME",
        stats_kpi_rate: "CLEAR RATE",
        stats_kpi_tier: "RANK TIER",
        stats_empty_title: "No Challenge Attempts Yet",
        stats_empty_desc: "Select a difficulty on the home screen and launch a run to log your best times and multiplier ranks here.",
        stats_achievements_unlocked: "Achievements Unlocked:",

        // Top Typing Bar Overlay (Player Name)
        top_typing_title: "Enter Player Name",
        top_typing_done: "Done",
        top_typing_quick: "Quick Picks:",

        // Help Guide & Teaching Notes Modal
        guide_title: "Lab Guide & Teaching Notes",
        guide_syllabus_badge: "SPM CHEMISTRY • FORM 4 & FORM 5",
        guide_tab_teacher: "👨‍🏫 Teacher's Classroom Guide",
        guide_tab_student: "🎒 Student's How to Balance",
        guide_tut_hero_title: "Prefer learning by doing?",
        guide_tut_hero_desc: "Play our interactive tutorial level with a live dimmed spotlight guiding you through each tool!",
        guide_tut_hero_btn: "Play Tutorial (TUT0)",
        guide_smartboard_title: "Smartboard & Projector Display",
        guide_smartboard_desc: "Project the live simulation directly in the classroom. The centered 3-column layout scales element tokens, seesaws, and discrete bar counts so every student in the lecture hall can easily follow along.",
        guide_curriculum_title: "Curriculum Alignment",
        guide_curriculum_desc: "Structured around <b>KSSM Kimia Tingkatan 4 Bab 3</b> (Chemical Formulae & Equations). Covers diatomic synthesis, acid-metal reactions, precipitation, and thermal decomposition.",
        guide_dual_models_title: "Dual Visual Models",
        guide_dual_models_desc: "Use the left sidebar to toggle between the <b>3D Seesaw</b> (mass-balance intuition) and <b>Bar Graphs</b> (discrete stoichiometric atomic counts).",
        guide_tip_start1_title: "Classroom Pedagogical Tip: Starting with 1",
        guide_tip_start1_desc: "Equations always default to 1 of each molecule. Emphasize to students that coefficients of zero do not exist in real chemical reactions: we adjust counts from 1 until both sides reach equilibrium.",
        guide_law_title: "The Golden Law of Conservation of Mass",
        guide_law_desc: "Atoms can never disappear, and new atoms cannot appear from nowhere. Whatever atoms enter as reactants must leave as products. When both sides match, the seesaw balances!",
        guide_minoh_framework_title: "The 3-Step MINOH Strategy",
        guide_minoh_step1: "<b>M & I:</b> Balance Metals (Na, Mg, Fe) and Polyatomic Ions (NO₃, SO₄, CO₃ as intact groups) first.",
        guide_minoh_step2: "<b>N:</b> Balance Non-metals (Cl, C, S) next.",
        guide_minoh_step3: "<b>O & H:</b> Balance Oxygen and Hydrogen last—they usually fall into place naturally!",
        guide_student_instruction1: "Tap <b>+</b> on molecule badges to drop compounds into beakers. You can only add complete molecules, never split atoms apart!",
        guide_student_instruction2: "When every element indicator turns green and equilibrium is reached, the reaction is balanced!",
        guide_try_level1: "Try Level 1 (Haber Process) Now",

        // Prof. Bunsen AI Modal
        bunsen_saved_btn: "📁 Saved",
        bunsen_new_chat_title: "Start New Conversation",
        bunsen_new_chat: "New Chat",
        bunsen_ask_label: "Ask Bunsen:",
        bunsen_chip_starter: "🧪 Friendly Starter",
        bunsen_chip_combustion: "🔥 Fiery Combustion",
        bunsen_chip_precipitate: "🌧️ Precipitate Reaction",
        bunsen_chip_spm: "🎯 Tough SPM Challenge",
        bunsen_chip_minoh: "💡 Explain MINOH Rule",
        bunsen_chip_alkali: "⚡ Alkali Metal & Water",
        bunsen_chip_rocket: "🚀 Rocket Fuel",
        bunsen_send_title: "Send Message",
        bunsen_sidebar_title: "📁 Saved Reactions",

        // Game Arena & Split Status Bar
        reactants: "REACTANTS",
        products: "PRODUCTS",
        element_trays: "Element Trays",
        drop_reactants: "Drop Reactants Here",
        drop_products: "Drop Products Here",
        status_unbalanced: "UNBALANCED",
        status_incomplete: "INCOMPLETE",
        status_balanced: "BALANCED",
        status_simplified: "SIMPLIFIED",
        status_not_simplified: "NOT SIMPLIFIED",
        status_empty: "EMPTY",
        status_no_atoms: "NO ATOMS",
        mass_difference: "Mass Difference",
        equal_mass: "Equal Mass",
        atoms_count: "Atom Counts",

        // MINOH Strategy
        minoh_title: "MINOH Strategy",
        minoh_desc: "Metals, Polyatomic Ions, Non-metals, Oxygen, Hydrogen",
        step_m: "1. Metals (M)",
        step_i: "2. Polyatomic Ions (I)",
        step_n: "3. Non-metals (N)",
        step_o: "4. Oxygen (O)",
        step_h: "5. Hydrogen (H)",

        // Victory Popup
        level_complete: "LEVEL COMPLETE!",
        equation_balanced: "Equation Balanced!",
        conservation_satisfied: "Conservation of mass satisfied.",
        moves_taken: "Moves:",
        time_spent: "Time:",
        play_again: "Play Again",
        level_select: "Level Select",

        // Prof. Bunsen AI Modal & Keypad
        bunsen_title: "Prof. Bunsen",
        what_reaction_today: "What reaction should we balance today?",
        quick_ideas: "QUICK IDEAS:",
        generate_level: "Generate Level",
        burning_methane: "Burning Methane",
        rusting_iron: "Rusting Iron",
        mg_o2: "Mg + O2",
        acid_base: "Acid + Base",
        ask_bunsen_label: "Ask Bunsen:",
        ask_bunsen_placeholder: "Ask Prof. Bunsen for reaction ideas, formulas, or recommendations in any language...",
        chip_starter: "Friendly Starter",
        chip_combustion: "Fiery Combustion",
        chip_precipitate: "Precipitate Reaction",
        chip_spm: "Tough SPM Challenge",
        chip_minoh: "Explain MINOH Rule",
        chip_alkali: "Alkali Metal & Water",
        chip_rocket: "Rocket Fuel",
        play_sandbox: "Play",
        edit_keypad: "Edit",
        save_reaction: "Save",
        saved_custom_title: "My Saved Reactions",

        // Level Selection Screen (levels.html)
        levels_back: "Back",
        levels_tutorial: "Tutorial",
        levels_tutorial_title: "Interactive Tutorial: Learn to Balance",
        levels_greeting_prefix: "Welcome, ",
        levels_chemical_equations: "Chemical Equations",
        levels_form_4_title: "Form 4",
        levels_form_5_title: "Form 5",
        levels_sandbox_title: "Sandbox Levels",
        levels_sandbox_subtitle: "CUSTOM CREATED REACTIONS",
        levels_sandbox_created_count: "{n} Created",
        levels_sandbox_empty_title: "No Custom Levels Yet!",
        levels_sandbox_empty_desc: "Click below to open the Periodic Table & Numpad builder and craft your first custom reaction level.",
        levels_sandbox_empty_btn: "Create Your First Level",
        levels_sandbox_custom_badge: "Custom",
        levels_sandbox_delete_title: "Delete custom level",
        levels_sandbox_delete_confirm: "Delete level \"{title}\"?",
        levels_sandbox_custom_reaction_prefix: "Custom Reaction #",
        levels_sandbox_create_badge: "Create",
        levels_sandbox_create_name: "Build New Level",
        levels_sandbox_create_pill: "Periodic Table & Numpad",
        levels_sandbox_create_banner: "+ CREATE LEVEL",
        levels_play_banner: "PLAY",
        levels_review_banner: "REVIEW (SOLVED)",
        levels_prev_btn: "◀ Prev",
        levels_next_btn: "Next ▶",
        levels_tier_easy: "EASY",
        levels_tier_medium: "MEDIUM",
        levels_tier_hard: "HARD",

        // Chemical States
        state_s: "Solid (s)",
        state_l: "Liquid (l)",
        state_g: "Gas (g)",
        state_aq: "Aqueous (aq)",
        // In-Game UI
        game_back: "Back",
        game_test_timeout: "Test Timeout",
        game_scale: "SCALE",
        game_bar: "BAR",
        game_element_trays: "Element Trays",
        game_equilibrium: "EQUILIBRIUM",
        game_status_incomplete: "INCOMPLETE",
        game_status_simplified: "SIMPLIFIED",
        game_status_not_simplified: "NOT SIMPLIFIED",
        game_status_no_atoms: "NO ATOMS",
        game_status_empty: "EMPTY",
        game_ai_mistakes: "AI makes mistakes too",
        game_study_room: "Study Room",
        game_stuck_help: "I am Stuck! Help!",
        game_give_answer: "Give me answer!",
        game_clear_chat: "Clear Chat",
        game_ask_beaker_placeholder: "Ask Prof. Beaker in any language about chemistry!",
        game_send_question: "Send question",
        game_how_to_play: "How to Play?",
        game_study_room_title: "Prof. Beaker's Chemistry Study Room",
        game_reaction_under_study: "Reaction Under Study",
        game_conservation_of_mass: "Conservation of Mass • Visual Atom Scales",
        game_lhs_vs_rhs: "LHS vs RHS",
        game_spm_strategy_minoh: "SPM Strategy • The MINOH Method",
        game_recommended_order: "Recommended Order",
        game_minoh_m: "Metals First",
        game_minoh_i: "Polyatomic Ions",
        game_minoh_i_sub: "SO₄, NO₃, CO₃ (if intact)",
        game_minoh_n: "Non-Metals",
        game_minoh_o: "Oxygen",
        game_minoh_o_sub: "Leave for the end",
        game_minoh_h: "Hydrogen",
        game_minoh_h_sub: "Balances out last!",
        game_minoh_rule_banner: "💡 Rule: Change big molecule coefficients only, never small subscripts!",
        game_chip_step_by_step: "📝 Step-by-step balance",
        game_chip_why_not_subscripts: "🔬 Why not subscripts?",
        game_chip_real_world: "🌍 Real-world application",
        game_study_room_input_ph: "Ask Prof. Beaker any chemistry question...",
        game_send: "Send",
        game_win_perfect_title: "PERFECT BALANCE!",
        game_win_balanced_title: "BALANCED!",
        game_win_perfect_sub: "Flawless work! The equation is in its simplest form.",
        game_win_balanced_sub: "Nice job! The equation is balanced, but the coefficients can be simplified further.",
        game_win_tut0_sub: "Awesome job! You balanced your first reaction: 2H₂ + O₂ → 2H₂O. You are ready for Form 4!",
        game_win_3_stars: "3 STARS",
        game_win_1_5_stars: "1.5 STARS",
        game_win_retry: "RETRY",
        game_win_review: "REVIEW",
        game_win_next_level: "NEXT LEVEL",
        game_win_start_form4: "START FORM 4 ▶",
        game_win_main_menu: "MAIN MENU",
        game_review_next_btn: "Next ▶",

    },

    bm: {
        // UI Navigation & Card Descriptions (Concise BM Equivalents)
        app_title: "StoichBalance",
        start_game: "Mula Main",
        challenge_mode: "Mod Cabaran",
        challenge_desc: "Uji kelajuan dan ketepatan anda.",
        sandbox_mode: "Mod Eksperimen",
        sandbox_desc: "Bina & selesaikan persamaan sendiri.",
        periodic_table: "Jadual Berkala",
        periodic_desc: "Terokai unsur & jisim atom.",
        help: "Bantuan",
        settings: "Tetapan",
        sound_effects: "Kesan Bunyi",
        bg_music: "Muzik Latar",
        back: "Kembali",
        back_to_menu: "Menu",
        exit: "Keluar",
        reset: "Tetap Semula",
        check_equation: "Semak Persamaan",
        next_level: "Tahap Seterusnya",
        saved_reactions: "Disimpan",
        new_chat: "Sembang Baru",
        close: "Tutup",
        fullscreen: "Skrin Penuh",
        exit_fullscreen: "Keluar Skrin Penuh",
        select_level: "Pilih Tahap",
        form4: "Tingkatan 4",
        form5: "Tingkatan 5",
        all_levels: "Semua Tahap",

        // Main Landing Page & Cards
        tour_guide_btn: "Panduan Interaktif & Nota",
        interactive_pt_btn: "Jadual Berkala Interaktif",
        tagline: "Pembelajaran Kimia Interaktif!",
        player_name_label: "NAMA PEMAIN",
        player_name_placeholder: "Masukkan nama anda...",
        player_profile_tooltip: "Pilih profil pemain tersimpan",
        career_records_tooltip: "Rekod Kerjaya & Pencapaian",
        choose_activity: "Pilih Aktiviti",
        class_mode: "Mod Kelas",
        class_desc: "Kemajuan kurikulum standard.",
        easy: "Mudah",
        medium: "Sederhana",
        hard: "Sukar",
        modifiers: "Pengubah Suai",
        mod_scale_name: "Tanpa Neraca",
        mod_scale_desc: "Selesaikan tanpa neraca penimbang (+0.5x)",
        mod_hints_name: "Tanpa Petunjuk",
        mod_hints_desc: "Selesaikan tanpa petunjuk (+0.5x)",
        mod_rush_name: "Pecutan 90s",
        mod_rush_desc: "Pecutan masa undur 90 saat (+0.5x)",
        create: "Bina",
        levels: "Tahap",
        fs_nudge_text: "✨ Klik sini untuk skrin penuh!",
        fs_nudge_title: "Klik untuk Mod Skrin Penuh!",

        // Sandbox Choice Modal
        sb_choice_title: "Bagaimana anda ingin membina persamaan?",
        sb_choice_subtitle: "Bina tindak balas kimia sendiri menggunakan AI, jadual berkala interaktif, atau teks manual.",
        sb_ai_title: "Pembina Persamaan AI",
        sb_ai_desc: "Taip ayat biasa atau formula ringkas. AI akan menyusun dan mengimbangkannya!",
        sb_pt_title: "Jadual Berkala & Pad Nombor",
        sb_pt_desc: "Grid 118 unsur kimia lengkap, pelengkap automatik, dan pad makmal interaktif.",
        sb_manual_title: "Kotak Input Manual",
        sb_manual_desc: "Kotak input berasingan klasik untuk bahan dan hasil tindak balas.",
        sb_saved_title: "📁 Tahap Tersimpan",
        sb_saved_hint: "Klik mana-mana tahap untuk bermain serta-merta",
        sb_saved_empty: "Belum ada tahap tersimpan. Gunakan AI atau Jadual Berkala untuk membina satu!",

        // Sandbox Input Modal (Visual Builder)
        builder_title: "Pembina Persamaan Visual",
        builder_subtitle: "Taip unsur atau klik ikon Jadual untuk memasukkannya!",
        builder_insert_el: "📊 Masukkan Unsur",
        builder_check_eq: "🔍 Semak Persamaan",
        builder_save_play: "✅ Simpan & Main!",

        // Sandbox Virtual Modal (Chemistry Keyboard)
        vk_header_title: "Papan Kekunci Kimia & Pembina Persamaan",
        vk_header_subtitle: "Ketik unsur pada jadual berkala atau taip menggunakan papan kekunci fizikal.",
        vk_display_placeholder: "Taip terus dengan papan kekunci atau klik unsur di bawah",
        vk_backspace_title: "Undur: Padam aksara sebelumnya",
        vk_bunsen_title: "Prof. Bunsen",
        vk_bunsen_role: "Ahli Kimia AI",
        vk_bunsen_desc: "Prof. Bunsen ialah ahli kimia AI yang sedia membantu mengubah idea anda menjadi persamaan kimia.",
        vk_bunsen_cta: "Klik untuk berbual!",
        vk_tab_prompt: "Pembantu Gesaan",
        vk_tab_keypad: "Pad Makmal",
        vk_tab_tools: "Alatan",
        vk_guide_title: "Cara Membina Persamaan",
        vk_step1_label: "Pilih Unsur:",
        vk_step1_desc: "Ketik <b>Jadual Berkala</b> atau klik <b>Prof. Bunsen</b> di atas.",
        vk_step2_label: "Tambah Simbol:",
        vk_step2_desc: "Gunakan <b>+</b> dan <b>→</b> untuk mengasingkan bahan & hasil tindak balas.",
        vk_step3_label: "Semak & Selesai:",
        vk_step3_desc: "Ketik <b>Semak Persamaan</b> untuk mengimbang atau melengkapkan secara automatik.",
        vk_step4_label: "Simpan & Main:",
        vk_step4_desc: "Ketik <b>Simpan Tahap Ini</b> untuk menyimpannya dalam koleksi anda!",
        vk_btn_plus: "Tambah (+)",
        vk_btn_yields: "Hasil (→)",
        vk_btn_clear: "Padam Semua",
        vk_btn_check: "Semak Persamaan",
        vk_btn_save: "Simpan Tahap Ini",
        vk_btn_saved: "Tersimpan dalam Koleksi! ✓",
        vk_btn_test: "Uji Sekarang",

        // Interactive Periodic Table Modal
        pt_modal_title: "Jadual Berkala Interaktif",
        pt_awaiting_title: "Menunggu Pilihan Unsur",
        pt_awaiting_desc: "Layangkan kursor pada mana-mana unsur untuk menganalisis struktur atomnya.",
        pt_label_group: "Kumpulan",
        pt_label_period: "Kala",
        pt_label_type: "Jenis",
        pt_label_mass: "Jisim Atom Relatif",
        pt_label_density: "Ketumpatan",
        pt_label_melt: "Takat Lebur",
        pt_label_boil: "Takat Didih",
        pt_label_discoverer: "Ditemui Oleh",
        pt_label_year: "Tahun Penemuan",
        pt_val_unknown: "Tidak Diketahui",
        pt_label_protons: "Proton",
        pt_label_neutrons: "Neutron",
        pt_label_electrons: "Elektron",
        pt_label_shells: "Susunan Petala Elektron",

        // Career Archive / Stats Modal
        stats_archive_badge: "ARKIB KERJAYA",
        stats_title: "Rekod Pemain",
        stats_role_chemist: "Ahli Kimia",
        stats_tab_history: "Sejarah Perlawanan",
        stats_tab_badges: "Lencana & Trofi",
        stats_filter_label: "TAPISAN:",
        stats_filter_all: "Semua",
        stats_kpi_runs: "JUMLAH LARIAN",
        stats_kpi_best: "MASA TERBAIK",
        stats_kpi_rate: "KADAR KEJAYAAN",
        stats_kpi_tier: "TAHAP PANGKAT",
        stats_empty_title: "Belum Ada Cubaan Cabaran",
        stats_empty_desc: "Pilih tahap kesukaran di menu utama dan mulakan cabaran untuk merekodkan masa terbaik dan pangkat pengganda anda di sini.",
        stats_achievements_unlocked: "Pencapaian Dibuka:",

        // Top Typing Bar Overlay (Player Name)
        top_typing_title: "Masukkan Nama Pemain",
        top_typing_done: "Selesai",
        top_typing_quick: "Pilihan Pantas:",

        // Help Guide & Teaching Notes Modal
        guide_title: "Panduan Makmal & Nota Guru",
        guide_syllabus_badge: "KIMIA SPM • TINGKATAN 4 & TINGKATAN 5",
        guide_tab_teacher: "👨‍🏫 Panduan Bilik Darjah Guru",
        guide_tab_student: "🎒 Panduan Mengimbang Murid",
        guide_tut_hero_title: "Lebih gemar belajar secara praktikal?",
        guide_tut_hero_desc: "Main tahap tutorial interaktif kami dengan sorotan lampu memandu anda menerokai setiap alatan!",
        guide_tut_hero_btn: "Main Tutorial (TUT0)",
        guide_smartboard_title: "Paparan Papan Pintar & Projektor",
        guide_smartboard_desc: "Pancarkan simulasi secara langsung di bilik darjah. Susun atur 3 lajur berpusat menskalakan dulang unsur, neraca, dan graf bar agar mudah dilihat oleh semua murid di dalam kelas.",
        guide_curriculum_title: "Penjajaran Kurikulum",
        guide_curriculum_desc: "Disusun berdasarkan <b>KSSM Kimia Tingkatan 4 Bab 3</b> (Formula dan Persamaan Kimia). Meliputi tindak balas sintesis dwiatom, asid-logam, pemendakan, dan penguraian terma.",
        guide_dual_models_title: "Dwi Model Visual",
        guide_dual_models_desc: "Gunakan bar sisi kiri untuk beralih antara <b>Neraca 3D</b> (intuisi jisim seimbang) dan <b>Graf Bar</b> (perbandingan kuantitatif atom stoikiometrik).",
        guide_tip_start1_title: "Tip Pedagogi Bilik Darjah: Bermula Dengan 1",
        guide_tip_start1_desc: "Persamaan sentiasa bermula dengan pekali 1 untuk setiap molekul. Tegaskan kepada murid bahawa pekali sifar tidak wujud dalam tindak balas kimia sebenar: kita laraskan bilangan dari 1 sehingga kedua-dua belah seimbang.",
        guide_law_title: "Hukum Keabadian Jisim",
        guide_law_desc: "Atom tidak boleh dicipta atau dimusnahkan. Semua atom yang memasuki bahan tindak balas mesti wujud dalam bilangan yang sama pada hasil tindak balas. Apabila kedua-dua belah sepadan, neraca akan seimbang!",
        guide_minoh_framework_title: "Strategi 3 Langkah MINOH",
        guide_minoh_step1: "<b>M & I:</b> Imbangkan Logam (Na, Mg, Fe) dan Ion Poliatom (NO₃, SO₄, CO₃ sebagai kumpulan utuh) terlebih dahulu.",
        guide_minoh_step2: "<b>N:</b> Imbangkan Bukan Logam (Cl, C, S) seterusnya.",
        guide_minoh_step3: "<b>O & H:</b> Imbangkan Oksigen dan Hidrogen paling akhir - biasanya ia akan seimbang secara automatik!",
        guide_student_instruction1: "Ketik <b>+</b> pada lencana molekul untuk meletakkan sebatian ke dalam bikar. Anda hanya boleh menambah molekul lengkap, bukan memisahkan atom secara tunggal!",
        guide_student_instruction2: "Apabila setiap penunjuk unsur bertukar hijau dan keseimbangan dicapai, persamaan telah seimbang!",
        guide_try_level1: "Cuba Tahap 1 (Proses Haber) Sekarang",

        // Prof. Bunsen AI Modal
        bunsen_saved_btn: "📁 Disimpan",
        bunsen_new_chat_title: "Mulakan Perbualan Baru",
        bunsen_new_chat: "Sembang Baru",
        bunsen_ask_label: "Tanya Bunsen:",
        bunsen_chip_starter: "🧪 Permulaan Mudah",
        bunsen_chip_combustion: "🔥 Pembakaran Rancak",
        bunsen_chip_precipitate: "🌧️ Tindak Balas Pemendakan",
        bunsen_chip_spm: "🎯 Cabaran SPM Sukar",
        bunsen_chip_minoh: "💡 Terangkan Peraturan MINOH",
        bunsen_chip_alkali: "⚡ Logam Alkali & Air",
        bunsen_chip_rocket: "🚀 Bahan Api Roket",
        bunsen_send_title: "Hantar Mesej",
        bunsen_sidebar_title: "📁 Persamaan Disimpan",

        // Game Arena & Split Status Bar
        reactants: "BAHAN TINDAK BALAS",
        products: "HASIL TINDAK BALAS",
        element_trays: "Dulang Unsur",
        drop_reactants: "Letak Bahan di Sini",
        drop_products: "Letak Hasil di Sini",
        status_unbalanced: "BELUM SEIMBANG",
        status_incomplete: "BELUM LENGKAP",
        status_balanced: "SEIMBANG",
        status_simplified: "TERMUDAH",
        status_not_simplified: "TIDAK TERMUDAH",
        status_empty: "KOSONG",
        status_no_atoms: "TIADA ATOM",
        mass_difference: "Beza Jisim",
        equal_mass: "Jisim Seimbang",
        atoms_count: "Bilangan Atom",

        // MINOH Strategy
        minoh_title: "Strategi MINOH",
        minoh_desc: "Logam, Ion Poliatom, Bukan Logam, Oksigen, Hidrogen",
        step_m: "1. Logam (M)",
        step_i: "2. Ion Poliatom (I)",
        step_n: "3. Bukan Logam (N)",
        step_o: "4. Oksigen (O)",
        step_h: "5. Hidrogen (H)",

        // Victory Popup
        level_complete: "TAHAP SELESAI!",
        equation_balanced: "Persamaan Seimbang!",
        conservation_satisfied: "Hukum keabadian jisim dipatuhi.",
        moves_taken: "Langkah:",
        time_spent: "Masa:",
        play_again: "Main Semula",
        level_select: "Pilih Tahap",

        // Prof. Bunsen AI Modal & Keypad
        bunsen_title: "Prof. Bunsen",
        what_reaction_today: "Apakah tindak balas yang ingin kita seimbangkan?",
        quick_ideas: "IDEA PANTAS:",
        generate_level: "Jana Tahap",
        burning_methane: "Pembakaran Metana",
        rusting_iron: "Pengaratan Besi",
        mg_o2: "Mg + O2",
        acid_base: "Asid + Bes",
        ask_bunsen_label: "Tanya Bunsen:",
        ask_bunsen_placeholder: "Tanya Prof. Bunsen cadangan tindak balas, formula, atau penjelasan dalam apa jua bahasa...",
        chip_starter: "Permulaan Mudah",
        chip_combustion: "Pembakaran Rancak",
        chip_precipitate: "Tindak Balas Pemendakan",
        chip_spm: "Cabaran Sukar SPM",
        chip_minoh: "Terangkan Petua MINOH",
        chip_alkali: "Logam Alkali & Air",
        chip_rocket: "Bahan Api Roket",
        play_sandbox: "Main",
        edit_keypad: "Sunting",
        save_reaction: "Simpan",
        saved_custom_title: "Tindak Balas Disimpan",

        // Level Selection Screen (levels.html)
        levels_back: "Kembali",
        levels_tutorial: "Tutorial",
        levels_tutorial_title: "Tutorial Interaktif: Belajar Mengimbang",
        levels_greeting_prefix: "Selamat Datang, ",
        levels_chemical_equations: "Persamaan Kimia",
        levels_form_4_title: "Tingkatan 4",
        levels_form_5_title: "Tingkatan 5",
        levels_sandbox_title: "Tahap Eksperimen",
        levels_sandbox_subtitle: "TINDAK BALAS CIPTAAN ANDA",
        levels_sandbox_created_count: "{n} Dicipta",
        levels_sandbox_empty_title: "Belum Ada Tahap Eksperimen!",
        levels_sandbox_empty_desc: "Ketik di bawah untuk membuka pembina Jadual Berkala & Pad Nombor bagi membina tahap tindak balas kimia pertama anda.",
        levels_sandbox_empty_btn: "Bina Tahap Pertama Anda",
        levels_sandbox_custom_badge: "Ciptaan",
        levels_sandbox_delete_title: "Padam tahap ciptaan",
        levels_sandbox_delete_confirm: "Padam tahap \"{title}\"?",
        levels_sandbox_custom_reaction_prefix: "Tindak Balas Ciptaan #",
        levels_sandbox_create_badge: "Bina",
        levels_sandbox_create_name: "Bina Tahap Baru",
        levels_sandbox_create_pill: "Jadual Berkala & Pad Nombor",
        levels_sandbox_create_banner: "+ BINA TAHAP",
        levels_play_banner: "MAIN",
        levels_review_banner: "ULANGKAJI",
        levels_prev_btn: "◀ Sebelum",
        levels_next_btn: "Seterusnya ▶",
        levels_tier_easy: "MUDAH",
        levels_tier_medium: "SEDERHANA",
        levels_tier_hard: "SUKAR",

        // Chemical States
        state_s: "Pepejal (p)",
        state_l: "Cecair (ce)",
        state_g: "Gas (g)",
        state_aq: "Akueus (ak)",
        // In-Game UI
        game_back: "Kembali",
        game_test_timeout: "Uji Masa Tamat",
        game_scale: "NERACA",
        game_bar: "GRAF PALANG",
        game_element_trays: "Dulang Unsur",
        game_equilibrium: "KESEIMBANGAN",
        game_status_incomplete: "BELUM LENGKAP",
        game_status_simplified: "TERMUDAH",
        game_status_not_simplified: "TIDAK TERMUDAH",
        game_status_no_atoms: "TIADA ATOM",
        game_status_empty: "KOSONG",
        game_ai_mistakes: "AI juga boleh buat kesilapan",
        game_study_room: "Bilik Belajar",
        game_stuck_help: "Saya Buntu! Tolong!",
        game_give_answer: "Beri saya jawapan!",
        game_clear_chat: "Kosongkan Sembang",
        game_ask_beaker_placeholder: "Tanya Prof. Beaker dalam apa jua bahasa tentang kimia!",
        game_send_question: "Hantar soalan",
        game_how_to_play: "Cara Bermain?",
        game_study_room_title: "Bilik Belajar Kimia Prof. Beaker",
        game_reaction_under_study: "Tindak Balas Yang Dikaji",
        game_conservation_of_mass: "Keabadian Jisim • Neraca Visual Atom",
        game_lhs_vs_rhs: "Kiri vs Kanan",
        game_spm_strategy_minoh: "Strategi SPM • Kaedah MINOH",
        game_recommended_order: "Urutan Disyorkan",
        game_minoh_m: "Logam Dahulu",
        game_minoh_i: "Ion Poliatom",
        game_minoh_i_sub: "SO₄, NO₃, CO₃ (jika utuh)",
        game_minoh_n: "Bukan Logam",
        game_minoh_o: "Oksigen",
        game_minoh_o_sub: "Biarkan ke hujung",
        game_minoh_h: "Hidrogen",
        game_minoh_h_sub: "Seimbangkan paling akhir!",
        game_minoh_rule_banner: "💡 Peraturan: Ubah pekali molekul besar sahaja, jangan ubah subskrip kecil!",
        game_chip_step_by_step: "📝 Seimbangkan langkah demi langkah",
        game_chip_why_not_subscripts: "🔬 Mengapa bukan subskrip?",
        game_chip_real_world: "🌍 Aplikasi dunia sebenar",
        game_study_room_input_ph: "Tanya Prof. Beaker apa-apa soalan kimia...",
        game_send: "Hantar",
        game_win_perfect_title: "SEIMBANG SEMPURNA!",
        game_win_balanced_title: "SEIMBANG!",
        game_win_perfect_sub: "Tahniah! Persamaan kimia berada dalam nisbah teringkas.",
        game_win_balanced_sub: "Bagus! Persamaan telah seimbang, tetapi pekali masih boleh dipermudahkan lagi.",
        game_win_tut0_sub: "Syabas! Anda telah berjaya mengimbangi tindak balas pertama: 2H₂ + O₂ → 2H₂O. Anda kini bersedia untuk Tingkatan 4!",
        game_win_3_stars: "3 BINTANG",
        game_win_1_5_stars: "1.5 BINTANG",
        game_win_retry: "CUBA LAGI",
        game_win_review: "ULANGKAJI",
        game_win_next_level: "TAHAP SETERUSNYA ▶",
        game_win_start_form4: "MULA TINGKATAN 4 ▶",
        game_win_main_menu: "MENU UTAMA",
        game_review_next_btn: "Seterusnya ▶",

    }
};


// KSSM Malaysian Chemistry Nomenclature (SPM Syllabus)
root.KSSM_ELEMENT_NAMES = {
    H: { en: "Hydrogen", bm: "Hidrogen" },
    O: { en: "Oxygen", bm: "Oksigen" },
    N: { en: "Nitrogen", bm: "Nitrogen" },
    Na: { en: "Sodium", bm: "Natrium" },
    K: { en: "Potassium", bm: "Kalium" },
    I: { en: "Iodine", bm: "Iodin" },
    Zn: { en: "Zinc", bm: "Zink" },
    S: { en: "Sulfur", bm: "Sulfur" },
    Ag: { en: "Silver", bm: "Argentum" },
    C: { en: "Carbon", bm: "Karbon" },
    Pb: { en: "Lead", bm: "Plumbum" },
    Al: { en: "Aluminium", bm: "Aluminium" },
    Cl: { en: "Chlorine", bm: "Klorin" },
    Mg: { en: "Magnesium", bm: "Magnesium" },
    Fe: { en: "Iron", bm: "Ferum" },
    Cu: { en: "Copper", bm: "Kuprum" },
    Br: { en: "Bromine", bm: "Bromin" },
    P: { en: "Phosphorus", bm: "Fosforus" },
    Ca: { en: "Calcium", bm: "Kalsium" },
    Ba: { en: "Barium", bm: "Barium" },
    Li: { en: "Lithium", bm: "Litium" },
    Sn: { en: "Tin", bm: "Stanum" },
    Ni: { en: "Nickel", bm: "Nikel" },
    Mn: { en: "Manganese", bm: "Mangan" },
    Cr: { en: "Chromium", bm: "Kromium" }
};

root.STATE_MAP_BM = {
    s: 'p',
    l: 'ce',
    g: 'g',
    aq: 'ak'
};

root.getElementName = function(symbol, lang) {
    const l = lang || (typeof localStorage !== 'undefined' ? (localStorage.getItem('stoich_lang') || 'en') : 'en');
    const entry = root.KSSM_ELEMENT_NAMES ? root.KSSM_ELEMENT_NAMES[symbol] : null;
    if (entry && entry[l]) return entry[l];
    return symbol;
};

root.getStateLabel = function(rawState, lang) {
    const l = lang || (typeof localStorage !== 'undefined' ? (localStorage.getItem('stoich_lang') || 'en') : 'en');
    const clean = (rawState || '').toLowerCase().replace(/[()]/g, '').trim();
    if (l === 'bm') {
        return root.STATE_MAP_BM[clean] || clean;
    }
    return clean;
};

// Exact 1-to-1 Level Titles Mapping (Matches levels.js 100%)
root.LEVEL_TRANSLATIONS = {
    // Tutorial
    TUT0: { en: "Tutorial : Water Synthesis", bm: "Tutorial : Sintesis Air" },

    // Form 4
    F4L1: { en: "Haber Process", bm: "Proses Haber" },
    F4L2: { en: "Sodium-Water Reaction", bm: "Tindak Balas Natrium-Air" },
    F4L3: { en: "Halogen Displacement", bm: "Penyesaran Halogen" },
    F4L4: { en: "Acid-Metal Reaction", bm: "Tindak Balas Asid-Logam" },
    F4L5: { en: "Neutralisation", bm: "Peneutralan" },
    F4L6: { en: "Metal Displacement", bm: "Penyesaran Logam" },
    F4L7: { en: "Acid-Carbonate Reaction", bm: "Tindak Balas Asid-Karbonat" },
    F4L8: { en: "Combustion of Propane", bm: "Pembakaran Propana" },
    F4L9: { en: "Precipitation", bm: "Pemendakan" },
    F4L10: { en: "Decomposition of Silver Nitrate", bm: "Penguraian Argentum Nitrat" },
    F4L11: { en: "Combustion of Aluminium", bm: "Pembakaran Aluminium" },
    F4L12: { en: "Decomposition of Potassium Chlorate", bm: "Penguraian Kalium Klorat" },

    // Form 5
    F5L1: { en: "Oxidation of Magnesium", bm: "Pengoksidaan Magnesium" },
    F5L2: { en: "Combustion of Methane", bm: "Pembakaran Metana" },
    F5L3: { en: "Combustion of Ethanol", bm: "Pembakaran Etanol" },
    F5L4: { en: "Metal Displacement", bm: "Penyesaran Logam" },
    F5L5: { en: "Esterification", bm: "Pengesteran" },
    F5L6: { en: "Hydration of Ethene", bm: "Penghidratan Etena" },
    F5L7: { en: "Contact Process", bm: "Proses Sentuh" },
    F5L8: { en: "Reduction of Metal Oxide", bm: "Penurunan Oksida Logam" },
    F5L9: { en: "Fermentation of Glucose", bm: "Penapaian Glukosa" },
    F5L10: { en: "Reaction of a Metal with Acid", bm: "Tindak Balas Logam-Asid" }
};

// Helper: Get Translation Key
root.getTranslation = function(key, defaultVal) {
    let lang = 'en';
    try {
        lang = (localStorage.getItem('stoich_lang') || 'en').toLowerCase();
    } catch(e) {}
    const dict = (root.TRANSLATIONS && root.TRANSLATIONS[lang]) || (root.TRANSLATIONS && root.TRANSLATIONS.en) || {};
    return dict[key] !== undefined ? dict[key] : (defaultVal !== undefined ? defaultVal : key);
};

// Helper: Get Level Title in Current Language
root.getLevelTitle = function(levelId, defaultTitle) {
    let lang = 'en';
    try {
        lang = (localStorage.getItem('stoich_lang') || 'en').toLowerCase();
    } catch(e) {}
    const entry = root.LEVEL_TRANSLATIONS ? root.LEVEL_TRANSLATIONS[levelId] : null;
    if (entry && entry[lang]) {
        return entry[lang];
    }
    return defaultTitle || (entry ? entry.en : levelId);
};

// Helper: Periodic Table Group Names
root.getGroupNameTranslation = function(groupKey, lang) {
    if (!groupKey) return '';
    const l = (lang || (typeof localStorage !== 'undefined' && localStorage.getItem('stoich_lang')) || 'en').toLowerCase();
    const cleanKey = String(groupKey).toLowerCase().replace(/[\s\-_]/g, '');
    const map = {
        alkali: { en: "Alkali Metals", bm: "Logam Alkali" },
        alkalimetal: { en: "Alkali Metal", bm: "Logam Alkali" },
        alkaline: { en: "Alkaline Earth", bm: "Logam Alkali Bumi" },
        alkalineearth: { en: "Alkaline Earth", bm: "Logam Alkali Bumi" },
        transition: { en: "Transition Metals", bm: "Logam Peralihan" },
        transitionmetal: { en: "Transition Metal", bm: "Logam Peralihan" },
        post: { en: "Post-transition", bm: "Logam Pasca-peralihan" },
        posttransition: { en: "Post-transition", bm: "Logam Pasca-peralihan" },
        posttransitionmetal: { en: "Post-transition Metal", bm: "Logam Pasca-peralihan" },
        metalloid: { en: "Metalloids", bm: "Metaloid" },
        nonmetal: { en: "Reactive Nonmetals", bm: "Bukan Logam Reaktif" },
        reactivenonmetal: { en: "Reactive Nonmetal", bm: "Bukan Logam Reaktif" },
        halogen: { en: "Halogens", bm: "Halogen" },
        noble: { en: "Noble Gases", bm: "Gas Nadir" },
        noblegas: { en: "Noble Gas", bm: "Gas Nadir" },
        lanthanide: { en: "Lanthanides", bm: "Lantanida" },
        actinide: { en: "Actinides", bm: "Aktinida" },
        unknown: { en: "Unknown", bm: "Tidak Diketahui" }
    };
    const item = map[cleanKey];
    if (item) return item[l] || item.en;
    return String(groupKey).charAt(0).toUpperCase() + String(groupKey).slice(1);
};

// Helper: Badges Translation
root.getBadgeTranslation = function(badgeId, lang) {
    const l = (lang || localStorage.getItem('stoich_lang') || 'en').toLowerCase();
    const badgesMap = {
        mental_math: {
            name: { en: "Mental Math Master", bm: "Pakar Congak Mental" },
            desc: { en: "Complete a challenge run with the Balance Scale turned OFF.", bm: "Selesaikan larian cabaran dengan Neraca Imbang DIMATIKAN." }
        },
        solo_chemist: {
            name: { en: "Solo Chemist", bm: "Ahli Kimia Bersendirian" },
            desc: { en: "Complete a challenge run with Prof Beaker hints disabled.", bm: "Selesaikan larian cabaran tanpa menggunakan petunjuk Prof Beaker." }
        },
        blindfold: {
            name: { en: "Pure Blindfold", bm: "Cabaran Mata Tertutup" },
            desc: { en: "Complete Hard difficulty with both Scale and Hints OFF.", bm: "Selesaikan mod Sukar dengan kedua-dua Neraca dan Petunjuk DIMATIKAN." }
        },
        flawless: {
            name: { en: "First-Try Flawless", bm: "Sempurna Percubaan Pertama" },
            desc: { en: "Complete all 5 rounds without resetting any equation.", bm: "Selesaikan semua 5 pusingan tanpa menetapkan semula sebarang persamaan." }
        },
        lightning: {
            name: { en: "Lightning Balancer", bm: "Pengimbang Sepantas Kilat" },
            desc: { en: "Complete a 5-round challenge in under 60 seconds total.", bm: "Selesaikan cabaran 5 pusingan dalam masa bawah 60 saat." }
        },
        apprentice: {
            name: { en: "Apprentice Balancer", bm: "Pengimbang Perantis" },
            desc: { en: "Complete the Easy Challenge tier with 3 stars.", bm: "Selesaikan cabaran Mudah dengan 3 bintang." }
        },
        specialist: {
            name: { en: "Reaction Specialist", bm: "Pakar Tindak Balas" },
            desc: { en: "Complete the Medium Challenge tier with 3 stars.", bm: "Selesaikan cabaran Sederhana dengan 3 bintang." }
        },
        grandmaster: {
            name: { en: "Stoichiometry Grandmaster", bm: "Grandmaster Stoikiometri" },
            desc: { en: "Complete the Hard Challenge tier with 3 stars.", bm: "Selesaikan cabaran Sukar dengan 3 bintang." }
        },
        grand_slam: {
            name: { en: "The Grand Slam", bm: "Kemenangan Mutlak" },
            desc: { en: "Earn 3 stars across all three difficulty tiers.", bm: "Raih 3 bintang dalam ketiga-tiga tahap kesukaran." }
        },
        veteran: {
            name: { en: "Lab Veteran", bm: "Veteran Makmal" },
            desc: { en: "Complete 10 total challenge runs.", bm: "Selesaikan sejumlah 10 larian cabaran." }
        }
    };
    return badgesMap[badgeId] || null;
};

// Core: Apply Translations Across the Active DOM
let isApplyingTranslations = false;
root.applyTranslations = function(targetLang) {
    if (isApplyingTranslations) return;
    isApplyingTranslations = true;
    try {
        let lang = 'en';
        try {
            lang = (targetLang || localStorage.getItem('stoich_lang') || 'en').toLowerCase();
        } catch(e) {}
        root.stoich_lang = lang;
        if (typeof window !== 'undefined') window.stoich_lang = lang;
        const dict = (root.TRANSLATIONS && root.TRANSLATIONS[lang]) || (root.TRANSLATIONS && root.TRANSLATIONS.en) || {};

        if (typeof document === 'undefined') return;

    // 1. Text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    // 3. Tooltips & Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key] !== undefined) {
            el.setAttribute('title', dict[key]);
        }
    });

    // 4. HTML root attribute
    if (document.documentElement) {
        document.documentElement.setAttribute('lang', lang);
    }

    // 5. Update Language Toggle Button State
    const toggle = document.getElementById('btn-lang-toggle');
    if (toggle) {
        toggle.setAttribute('data-lang', lang);
        const enOpt = toggle.querySelector('.lang-opt-en');
        const bmOpt = toggle.querySelector('.lang-opt-bm');
        if (enOpt && bmOpt) {
            if (lang === 'bm') {
                enOpt.classList.remove('active');
                bmOpt.classList.add('active');
                toggle.setAttribute('title', 'Bahasa: Bahasa Melayu (BM)');
            } else {
                bmOpt.classList.remove('active');
                enOpt.classList.add('active');
                toggle.setAttribute('title', 'Language: English (EN)');
            }
        }
    }

    // 6. Broadcast event for dynamic page components
    if (typeof window !== 'undefined' && typeof root.dispatchEvent === 'function') {
        root.dispatchEvent(new CustomEvent('stoich_lang_changed', { detail: { lang } }));
    }
    } finally {
        isApplyingTranslations = false;
    }
};

// Global: Set Specific Language
root.setLanguage = function(lang) {
    if (typeof playSound === 'function') playSound('tactile');
    const target = (lang || 'en').toLowerCase();
    try {
        localStorage.setItem('stoich_lang', target);
    } catch(e) {}
    root.applyTranslations(target);
};

// Global: Toggle Between EN and BM
root.toggleLanguage = function(pref) {
    let current = 'en';
    try {
        current = (localStorage.getItem('stoich_lang') || 'en').toLowerCase();
    } catch(e) {}
    const target = pref ? pref.toLowerCase() : (current === 'en' ? 'bm' : 'en');
    root.setLanguage(target);
};

// Node.js module export support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TRANSLATIONS: root.TRANSLATIONS,
        LEVEL_TRANSLATIONS: root.LEVEL_TRANSLATIONS,
        KSSM_ELEMENT_NAMES: root.KSSM_ELEMENT_NAMES,
        STATE_MAP_BM: root.STATE_MAP_BM,
        getElementName: root.getElementName,
        getStateLabel: root.getStateLabel,
        getTranslation: root.getTranslation,
        getLevelTitle: root.getLevelTitle,
        getGroupNameTranslation: root.getGroupNameTranslation,
        getBadgeTranslation: root.getBadgeTranslation,
        applyTranslations: root.applyTranslations
    };
}

// Auto-initialize on load in browser
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('stoich_lang')) || 'en';
            root.applyTranslations(saved);
        });
    } else {
        const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('stoich_lang')) || 'en';
        root.applyTranslations(saved);
    }
}

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
