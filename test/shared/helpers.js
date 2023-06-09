const assert = require('node:assert');
const { readFileSync } = require('node:fs');
const test = require('ava');
const handlebars = require('handlebars');
// const Sqrl = require('squirrelly');
const cons = require('../../');

function getName(name) {
  return name === 'liquid-node' ? 'liquid' : name;
}

exports.test = function (name) {
  let user;

  if (name === 'handlebars') {
    user = { name: '<strong>Tobi</strong>' };

    // Use case: return safe HTML that won’t be escaped in the final render.
    test(`${name} helpers should support helpers`, (t) => {
      const str = readFileSync(
        'test/fixtures/' + getName(name) + '/helpers.' + getName(name)
      ).toString();

      const locals = {
        user,
        helpers: {
          safe(object) {
            return new handlebars.SafeString(object);
          }
        }
      };

      cons[getName(name)].render(str, locals, function (err, html) {
        t.is(err, null);
        assert.equal(html, '<strong>Tobi</strong>');
        t.pass();
      });
    });
  }
  // } else if (name === 'squirrelly') {
  //   user = { name: '<strong>Tobi</strong>' };

  //   // Use case: return safe HTML that won’t be escaped in the final render.
  //   it('should support helpers', function (done) {
  //     const str = readFileSync(
  //       'test/fixtures/' + getName(name) + '/helpers.' + getName(name)
  //     ).toString();
  //     Sqrl.helpers.define('myhelper', function (content) {
  //       console.log('content', content);
  //       return content;
  //       // content.params[0];
  //     });
  //     const options = { cache: false, user };

  //     cons[getName(name)].render(str, options, function (err, html) {
  //       if (err) return done(err);
  //       assert.equal(html, 'strong>Tobi</strong');
  //       done();
  //     });
  //   });
  // }

  if (name === 'vash') {
    user = { name: 'Tobi' };

    // See this for Vash helper system : https://github.com/kirbysayshi/vash#helper-system
    // Use case: return as as lower case
    test(`${name} helpers should support helpers`, (t) => {
      const str = readFileSync(
        'test/fixtures/' + getName(name) + '/helpers.' + getName(name)
      ).toString();

      const locals = {
        user,
        helpers: {
          lowerCase(text) {
            return text.toLowerCase();
          }
        }
      };

      cons[getName(name)].render(str, locals, function (err, html) {
        t.is(err, null);
        assert.equal(html, '<strong>tobi</strong>');
        t.pass();
      });
    });
  }
};
