<script lang="ts">
    import Link from '$/components/link.svelte'
    import TimeLinePart from '$/components/timelinePart.svelte'
</script>

<TimeLinePart reverse={false} src="aa" alt="aa" label="2020">
    Během střední školy jsem se postupně začal učit i více JavaScript, nejvíce jsem na něho narazil při tvorbě již zmíněného informačního systému pro minecraft server, kde jsem
    používal jQuery a Ajax pro komikaci s API a toho, aby stránka byla více plynulá a nemusela se po každé akci znovu načítat. Dále jsem zavítal i do NodeJS, kde jsem začínal s
    tvorbou Discord botů, prvně jsem tvořil Self Bota, který ukazoval statistiky z League of Legends a později ho předělal na normálního Bota. Během střední školy jsem si tvořil
    stránky na "ulehčení" některých počtů v chemii, první z nich je v PHP na počítání <Link href="https://sch.patrick115.eu/beta-prumer/">Q-Testu</Link> a druhá na počítání <Link
        href="https://sch.patrick115.eu/rovnice_z_grafu/"
    >
        rovnice z grafu
    </Link> v JavaScriptu.
</TimeLinePart>

<TimeLinePart reverse={true} src="aa" alt="aa" label="2018 - 2020 Střední Škola">
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

<TimeLinePart reverse={false} src="aa" alt="aa" label="2016">
    V 8. třídě na základní škole jsem se začal zajímat o tvorbu webových stránek. Začal jsem prvně tvořiz stránky přes WYSIWIG Web Builder, ale brzy jsem zjístil, že to není ono,
    něco málo jsem zkoušel tvorǐt i ve Wordu, kde to ale vyplivlo do HTML souboru hromadu zbytečných tagů a obrázky se tam zobrazovaly špatně. V tento moment jsem se začal postupně
    učit HTML a CSS, s tím že jsem si na svoje stránky stáhnul nějaký základní AUTH systém, kdy se dokáži přihlásit a poté z PHP session zjišťovat, kdo je přihlášený. Tento systém
    jsem začal zkoumat a zjišťovat si více věci o PHP.
</TimeLinePart>
