QUnit.test( 'augmented', assert => {
    var a = [3,2,1]
    Iterator.augmented(()=>{
        assert.equal(a.iterator().sum(),6)
    })
    assert.equal(a.iterator, undefined)
})
