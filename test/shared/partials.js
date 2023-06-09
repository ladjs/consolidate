const { join } = require('node:path');
const fs = require('node:fs');
const test = require('ava');
const cons = require('../../');

const { readFile } = fs;
const { readFileSync } = fs;

function getName(name) {
  return name === 'liquid-node' ? 'liquid' : name;
}

exports.test = function (name) {
  const user = { name: 'Tobi' };

  test.afterEach(function () {
    fs.readFile = readFile;
    fs.readFileSync = readFileSync;
  });

  if (name === 'dust' || name === 'arc-templates') {
    test(`${name} partials should support rendering a partial`, async (t) => {
      const str = fs
        .readFileSync(
          'test/fixtures/' + getName(name) + '/user_partial.' + getName(name)
        )
        .toString();
      const locals = {
        user,
        views: './test/fixtures/' + getName(name)
      };

      const html = await new Promise((resolve, reject) => {
        cons[getName(name)].render(str, locals, function (err, html) {
          if (err) return reject(err);
          resolve(html);
        });
      });

      t.is(html, '<p>Tobi from partial!</p><p>Tobi</p>');
    });
  } else {
    test(`${name} partials should support partials`, async (t) => {
      const path =
        'test/fixtures/' + getName(name) + '/partials.' + getName(name);
      const locals = { user, partials: { partial: 'user' } };

      const html = await new Promise((resolve, reject) => {
        cons[getName(name)](path, locals, function (err, html) {
          if (err) return reject(err);
          resolve(html);
        });
      });

      t.is(html, '<p>Tobi</p>');
    });
    test(`${name} partials should support absolute path partial`, async (t) => {
      const path =
        'test/fixtures/' + getName(name) + '/partials.' + getName(name);
      const locals = {
        user,
        partials: {
          partial: join(__dirname, '/../../test/fixtures/', name, '/user')
        }
      };

      const html = await new Promise((resolve, reject) => {
        cons[getName(name)](path, locals, function (err, html) {
          if (err) return reject(err);
          resolve(html);
        });
      });

      t.is(html, '<p>Tobi</p>');
    });
    test(`${name} partials should support relative path partial`, async (t) => {
      const path =
        'test/fixtures/' + getName(name) + '/partials.' + getName(name);
      const locals = {
        user,
        partials: { partial: '../' + getName(name) + '/user' }
      };

      const html = await new Promise((resolve, reject) => {
        cons[getName(name)](path, locals, function (err, html) {
          if (err) return reject(err);
          resolve(html);
        });
      });
      t.is(html, '<p>Tobi</p>');
    });
  }
};
