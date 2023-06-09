const fs = require('node:fs');
const test = require('ava');
const cons = require('../../');

function getName(name) {
  return name === 'liquid-node' ? 'liquid' : name;
}

exports.test = function (name) {
  const user = { name: 'Tobi' };

  // Use case: return upper case string.
  test(`${name} filters should support filters`, async (t) => {
    const str = fs
      .readFileSync(
        'test/fixtures/' + getName(name) + '/filters.' + getName(name)
      )
      .toString();

    const locals = {
      user,
      filters: {
        toupper(object) {
          return object.toUpperCase();
        }
      }
    };

    const html = await new Promise((resolve, reject) => {
      cons[getName(name)].render(str, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });
    t.is(html, 'TOBI');
  });
};
