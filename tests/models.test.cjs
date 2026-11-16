const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');
function setup(initial){
    const memory=new Map(initial ? [['cinepick-journal-v1',initial]] : []);
    const context=vm.createContext({localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)},URL,URLSearchParams,t:(kk,en)=>en,pageUrl:name=>name+'-en.html'});
    for(const file of ['film.js','journal-store.js'])vm.runInContext(readFileSync(join(__dirname,'../js',file),'utf8'),context);
    return {memory,context,run:code=>vm.runInContext(code,context)};
}
test('journal create, edit, reload and delete retain the same identity',()=>{
    const a=setup();a.run("var store=new JournalStore(); var entry=new JournalEntry({title:'Interstellar'}); store.save(entry)");
    assert.equal(a.run('store.entries.length'),1);
    a.run("store.save(new JournalEntry({...entry.toJSON(),title:'Edited'}))");
    assert.equal(a.run('store.entries.length'),1);
    assert.equal(a.run('new JournalStore().entries[0].title'),'Edited');
    a.run('store.remove(entry.id)');assert.equal(a.run('store.entries.length'),0);
});
test('watched validation and statistics use real records',()=>{
    const a=setup();assert.equal(a.run("Object.keys(new JournalEntry({title:'A',status:'watched'}).validate()).length"),2);
    a.run("var store=new JournalStore(); store.save(new JournalEntry({title:'A',status:'watched',rating:8,watchedOn:'2020-01-01',runtime:120})); store.save(new JournalEntry({title:'B'}))");
    assert.equal(a.run('store.getStats().watched'),1);assert.equal(a.run('store.getStats().average'),8);assert.equal(a.run('store.getStats().minutes'),120);
    assert.equal(a.run("new JournalEntry({title:'A',status:'planned',rating:8,watchedOn:'2020-01-01'}).rating"),null);
});
test('invalid JSON is recoverable',()=>{
    const a=setup('{broken');a.run('var store=new JournalStore()');assert.equal(a.run('store.warning'),'invalid');
    assert.equal(a.run("store.save(new JournalEntry({title:'Recovered'}))"),true);
    assert.equal(JSON.parse(a.memory.get('cinepick-journal-v1')).entries.length,1);
});
test('a blocked write does not produce a false successful save',()=>{
    const a=setup();a.run("var store=new JournalStore(); localStorage.setItem=()=>{throw new Error('quota')}");
    assert.equal(a.run("store.save(new JournalEntry({title:'Unsaved'}))"),false);assert.equal(a.run('store.entries.length'),0);
});
test('Film objects normalize data, filter and build journal links',()=>{
    const a=setup();a.run("var film=new Film({id:'test-1',title:'Totoro',director:'Miyazaki',release_date:'1988',running_time:'86',rt_score:'94'})");
    assert.equal(a.run("film.matches('toto','all',90,'1980')"),true);
    assert.equal(a.run("film.matches('toto','all',95,'all')"),false);
    assert.equal(a.run('film.durationLabel()'),'86 min');assert.match(a.run('film.journalUrl()'),/^journal-en\.html\?title=Totoro&year=1988&runtime=86$/);
});
test('remote image URLs are restricted to the expected HTTPS host',()=>{
    const a=setup();a.run("var film=new Film({id:'test-1',title:'Test'})");
    assert.equal(a.run("film.safeImage('javascript:alert(1)')"),'');assert.equal(a.run("film.safeImage('https://untrusted.invalid/poster.jpg')"),'');
    assert.equal(a.run("film.safeImage('https://image.tmdb.org/t/p/original/poster.jpg')"),'https://image.tmdb.org/t/p/original/poster.jpg');
});
