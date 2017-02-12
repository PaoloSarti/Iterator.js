QUnit.test( 'filter predicate', assert => {
    var it = Iterator.from([1,2,3])
    var a = it.filter(i=>i>2).toArray()
    assert.equal(a[0],3)
})

QUnit.test( 'filter object', assert => {
    var it = Iterator.of({a:1,b:2},{a:3,b:5},{a:1,b:9})
    var a = it.filter({a:1}).toArray()
    assert.equal(a[0].b,2)
    assert.equal(a[1].b,9)
})

QUnit.test('filter regex', assert=>{
    var it = Iterator.of("ciao","miao","caio")
    var a = it.filter(/c.*o/).toArray()
    assert.equal(a[0],'ciao')
    assert.equal(a[1],'caio')
})