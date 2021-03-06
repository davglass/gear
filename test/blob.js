var Blob = require('../lib/blob').Blob,
    path = require('path'),
    fs = require('fs'),
    Crypto = require('crypto'),
    fixtures = {
        input: 'test/fixtures/image.png',
        output: 'testing/image_{checksum}.png'
    };

describe('Blob', function() {
    describe('constructor()', function() {
        it('should accept mixed input', function() {
            (new Blob('abcdef')).result.should.equal('abcdef');
            (new Blob(['abc', 'def'])).result.should.equal('abcdef');
            (new Blob(['abc', new Blob('def')])).result.should.equal('abcdef');
        });

        it('should preserve encoding', function(done) {
            var checksum = Crypto.createHash('md5');
            checksum.update(fs.readFileSync(fixtures.input));

            Blob.readFile(fixtures.input, 'bin', function(err, blob) {
                Blob.writeFile(fixtures.output, blob, 'bin', function() {
                    var file = fixtures.output.replace('{checksum}', checksum.digest('hex'));
                    path.existsSync(file).should.equal(true);
                    done();
                });
            });
        });
    });
});