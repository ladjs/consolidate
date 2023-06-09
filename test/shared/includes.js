const fs = require('node:fs');
const test = require('ava');
const cons = require('../../');

function getName(name) {
  return name === 'liquid-node' ? 'liquid' : name;
}

exports.test = function (name) {
  const user = { name: 'Tobi' };

  test(`${name} includes should support includes`, async (t) => {
    const str = fs
      .readFileSync(
        'test/fixtures/' + getName(name) + '/include.' + getName(name)
      )
      .toString();

    const viewsDir = 'test/fixtures/' + getName(name);
    const locals = { user, settings: { views: viewsDir } };

    if (
      name === 'liquid' ||
      name === 'liquid-node' ||
      name === 'arc-templates'
    ) {
      locals.includeDir = viewsDir;
    }

    const html = await new Promise((resolve, reject) => {
      cons[getName(name)].render(str, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });

    if (name === 'liquid' || name === 'liquid-node') {
      t.is(html, '<p>Tobi</p><section></section><footer></footer>');
    } else {
      t.is(html, '<p>Tobi</p>');
    }
  });

  if (name === 'nunjucks') {
    test(`${name} includes should support extending views`, async (t) => {
      const str = fs
        .readFileSync(
          'test/fixtures/' + getName(name) + '/layouts.' + getName(name)
        )
        .toString();

      const locals = {
        user,
        settings: { views: 'test/fixtures/' + getName(name) }
      };

      const html = await new Promise((resolve, reject) => {
        cons[getName(name)].render(str, locals, function (err, html) {
          if (err) return reject(err);
          resolve(html);
        });
      });
      t.is(html, '<header></header><p>Tobi</p><footer></footer>');
    });
  }
};
