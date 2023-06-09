const { readFileSync } = require('node:fs');
const test = require('ava');
const consolidate = require('../../');

exports.test = function (name) {
  const user = { name: 'Tobi' };
  let cons;

  test.beforeEach(function () {
    cons = consolidate;
  });

  test(`${name} react should support locals`, (t) => {
    const path = 'test/fixtures/' + name + '/user.' + name;
    const locals = { user };
    cons[name](path, locals, function (err, html) {
      t.is(err, null);
      t.is(html, '<p>Tobi</p>');
      t.pass();
    });
  });

  test(`${name} react should support promises`, async (t) => {
    const path = 'test/fixtures/' + name + '/user.' + name;
    const locals = { user };
    const html = await cons[name](path, locals);
    t.is(html, '<p>Tobi</p>');
  });

  test(`${name} react should support rendering a string`, (t) => {
    const str = readFileSync(
      'test/fixtures/' + name + '/user.' + name
    ).toString();
    const locals = { user };

    cons[name].render(str, locals, function (err, html) {
      t.is(err, null);
      t.is(html, '<p>Tobi</p>');
      t.pass();
    });
  });

  test(`${name} react should support promises from a string`, async (t) => {
    const str = readFileSync(
      'test/fixtures/' + name + '/user.' + name
    ).toString();
    const locals = { user };

    const html = await cons[name].render(str, locals);
    t.is(html, '<p>Tobi</p>');
    t.pass();
  });

  test(`${name} react should support rendering into a base template`, (t) => {
    const path = 'test/fixtures/' + name + '/user.' + name;
    const locals = {
      user,
      base: 'test/fixtures/' + name + '/base.html',
      title: 'My Title'
    };

    cons[name](path, locals, function (err, html) {
      t.is(err, null);

      t.is(
        html,
        '<html><head><title>My Title</title></head><body><p>Tobi</p></body></html>'
      );
      t.pass();
    });
  });
};
