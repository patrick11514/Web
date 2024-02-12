<script lang="ts">
    import Link from '$/components/link.svelte';
    import TimeLinePart from '$/components/timelinePart.svelte';
</script>

<h4 class="border-b-2 border-b-text pb-4 text-center font-inter 3xl:text-xl">
    Zde nalezneš můj příběh, jak jsem se dostal k programování úplně od začátku seřazený chronologicky od nejnovějšího k nejstaršímu.
</h4>

<TimeLinePart
    reverse={true}
    src={{
        'min-width: 1024px': '/images/fei_hr.png',
        default: '/images/fei.png'
    }}
    alt="VŠB - FEI text"
    label="2022 - Současnost"
>
    Po stření škole jsem se dal na <Link href="https://www.vsb.cz">Vysokou Školu Báňskou</Link>, přesněji <Link href="https://fei.vsb.cz">
        Fakultu Elektrotechniky a Informatiky
    </Link> obor Informatika. Osobně jsem na Vysokou školu šel s tím cílem 1. získat titul a 2. se přiučit nové věci ohledně technologíí, které bych se sám nikdy nenaučil. Například
    jsem se díky programovacímu jazyku C naučil lépe porozumět jak program pracuje s pamětí, jak jsou v ní data reprezentovaná a jak s ní správně nacházet. Dále jsem se naučil základy
    dalších programovacích jazyků, jako je C, C++, C# a Python. Díky předmětu Databázové Systémy jsem se zase naučil líp navrhovat relační databáze.
</TimeLinePart>

<TimeLinePart
    reverse={false}
    src={{
        'min-width: 1024px': '/images/djs_hr.png',
        default: '/images/djs.png'
    }}
    alt="Discord JS text"
    label="2022: DiscordJS"
>
    Mimo tvorbu webových stránek jsem také začal tvořit Discord Boty, mezi první větší discord boty je můj discord bot pro zobrazování statistik ze hry League of Legends <Link
        href="https://github.com/patrick11514/MinonkaBot"
    >
        Miňonka
    </Link>, který aktuálně prochází do nové verze 3. Dále jsem dělal i další discord boty pro Minecraft servery viz <Link href="/projects">projekty</Link>.
</TimeLinePart>

<TimeLinePart
    reverse={true}
    src={{
        'min-width: 1024px': '/images/sveltekit_hr.png',
        default: '/images/sveltekit.png'
    }}
    alt="sveltekit logo"
    label="2022: SvelteKit"
>
    Ke konci střední jsem se seznámil s prvním fullstack frameworkem Next.JS, kdy jsem měl příležito se přidat k projeklu kamaráda <Link href="https://skypad6000.eu">
        Skypada
    </Link>, který pracoval na hostingu. Menší problém byl v tom, že jsem sice něco málo pochopil, ale většinu věcí v Reactu dělal jen copy-paste, takže jsem si moc React
    neoblíbil. Na sítích (primárně u streamera <Link href="https://twitch.tv/Ottomated">Ottomated</Link>) jsem ale narazil na framework <Link href="https://kit.svelte.dev">
        SvelteKit
    </Link>, který oproti Reactu prochází kompilací kódu, tedy z mého pohledu je pak syntaxe kódu hezčí a víc přívětivější. V tomto frameworku jsem poté začal dělat všechno spojené
    s webovým vývojem. První projekt, který jsem v něm dělal, kromě mého webu byla <Link href="https://wiki.gamerealms.cz/">wiki</Link> pro server
    <Link href="https://gamerealms.cz/">GameRealms</Link>.
</TimeLinePart>

<TimeLinePart
    reverse={false}
    src={{
        'min-width: 1024px': '/images/code_hr.png',
        default: '/images/code.png'
    }}
    alt="aa"
    label="2020 - 2022"
>
    Během střední školy jsem se postupně začal učit i více JavaScript, nejvíce jsem na něho narazil při tvorbě již zmíněného informačního systému pro minecraft server, kde jsem
    používal jQuery a Ajax pro komikaci s API a toho, aby stránka byla více plynulá a nemusela se po každé akci znovu načítat. Dále jsem zavítal i do NodeJS, kde jsem začínal s
    tvorbou Discord botů, prvně jsem tvořil Self Bota, který ukazoval statistiky z League of Legends a později ho předělal na normálního Bota. Během střední školy jsem si tvořil
    stránky na "ulehčení" některých počtů v chemii, první z nich je v PHP na počítání <Link href="https://sch.patrick115.eu/beta-prumer/">Q-Testu</Link> a druhá na počítání <Link
        href="https://sch.patrick115.eu/rovnice_z_grafu/"
    >
        rovnice z grafu
    </Link> v JavaScriptu.
</TimeLinePart>

<TimeLinePart
    reverse={true}
    src={{
        'min-width: 1024px': '/images/oldPage_hr.png',
        default: '/images/oldPage.png'
    }}
    alt="Old page screenshot"
    label="2018 - 2020 Střední Škola"
>
    Na střední školu jsem chodil do Ostravy Zabřehu na <Link href="https://spsch.edupage.org/">Chemickou průmyslovou školu akademika Heyrovského</Link>, tuto školu jsem si zvolil
    hlavně z toho důvodu, že mě na základní škole bavila chemie a programování jsem se učil ve volném čase doma, proto jsem nešel na Elektrotechnickou školu a osobně si myslím, že
    jsem se toho sám naučil víc, než bych se naučil na střední. Na střední jsem se s PHP setkával již pravidelně, ale vše si dělal sám, bez nějakého frameworku. Vytvořil jsem v něm
    jednoduchý <Link href="https://github.com/patrick11514/SinusBotAdministrace">systém</Link> na vytváření <Link href="https://www.sinusbot.com/">Sinus botů</Link>, protože jejich
    free verze umožňovala pouze dva boty, takže jsem si přes ní mohl vytvářet nové "boty", což se prakticky připojilo na SSH, zkopírovalo zip do nový složky, v configu upravilo
    port a poté se přes danou administraci dali jednotlivé instance vypínat, zapínat, nebo restartovat. Poté jsem minecraft serveru <Link href="https://surpriseplay.cz"
        >SurprisePlay.eu</Link
    > vytvořil <Link href="https://github.com/patrick11514/SurprisePlay.eu-InfoPanel">informační systém</Link>, kde hráči mohli psát Tickety, admin team jim mohl odpovídat, dále si
    admin team mohl psát věci do Todo listu, mohli přes něho upravovat permise, přidávat hráčům prémiovou měnu a mnoho dalšího. (Screenshoty z něho lze naléz v kategorii Projekty)
</TimeLinePart>

<TimeLinePart
    reverse={false}
    src={{
        'min-width: 1024px': '/images/webBuilder_hr.jpg',
        default: '/images/webBuilder.jpg'
    }}
    alt="Screenshot of wysiwyg web builder from 2016"
    label="2016"
>
    V 8. třídě na základní škole jsem se začal zajímat o tvorbu webových stránek. Začal jsem prvně tvořit stránky přes WYSIWIG Web Builder, ale brzy jsem zjístil, že to není ono,
    něco málo jsem zkoušel tvorǐt i ve Wordu, kde to ale vyplivlo do HTML souboru hromadu zbytečných tagů a obrázky se tam zobrazovaly špatně. V tento moment jsem se začal postupně
    učit HTML a CSS, s tím že jsem si na svoje stránky stáhnul nějaký základní AUTH systém, kdy se dokáži přihlásit a poté z PHP session zjišťovat, kdo je přihlášený. Tento systém
    jsem začal zkoumat a zjišťovat si více věci o PHP.
</TimeLinePart>
