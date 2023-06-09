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

  test.afterEach.always(function () {
    fs.readFile = readFile;
    fs.readFileSync = readFileSync;
  });

  test(`${name} should support locals`, async (t) => {
    const path = 'test/fixtures/' + getName(name) + '/user.' + getName(name);
    const locals = { user };
    const html = await new Promise((resolve, reject) => {
      cons[getName(name)](path, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });
    t.regex(html, /Tobi/);
  });

  test(`${name} should not cache by default`, async (t) => {
    const path = 'test/fixtures/' + getName(name) + '/user.' + getName(name);
    const locals = { user };
    let calls = 0;

    fs.readFileSync = function (...args) {
      ++calls;
      return Reflect.apply(readFileSync, this, args);
    };

    fs.readFile = function (...args) {
      ++calls;
      Reflect.apply(readFile, this, args);
    };

    let html;
    html = await new Promise((resolve, reject) => {
      cons[getName(name)](path, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });
    t.regex(html, /Tobi/);
    html = await new Promise((resolve, reject) => {
      cons[getName(name)](path, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });
    t.regex(html, /Tobi/);
    t.is(calls, name === 'atpl' ? 4 : 2);
  });

  test(`${name} should support caching`, async (t) => {
    const path = 'test/fixtures/' + getName(name) + '/user.' + getName(name);
    const locals = { user, cache: true };

    let html;
    html = await new Promise((resolve, reject) => {
      cons[getName(name)](path, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });

    fs.readFile = function (path) {
      throw new Error('fs.readFile() called with ' + path);
    };

    t.regex(html, /Tobi/);

    html = await new Promise((resolve, reject) => {
      cons[getName(name)](path, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });

    t.regex(html, /Tobi/);
  });

  test(`${name} should support rendering a string`, async (t) => {
    const str = fs
      .readFileSync('test/fixtures/' + getName(name) + '/user.' + getName(name))
      .toString();
    const locals = { user };
    const html = await new Promise((resolve, reject) => {
      cons[getName(name)].render(str, locals, function (err, html) {
        if (err) return reject(err);
        resolve(html);
      });
    });
    t.regex(html, /Tobi/);
  });

  test(`${name} should return a promise if no callback provided`, async (t) => {
    const path = 'test/fixtures/' + getName(name) + '/user.' + getName(name);
    const locals = { user };
    const html = await cons[getName(name)](path, locals);
    t.regex(html, /Tobi/);
    t.pass();
  });

  test(`${name} should return a promise if no callback provided (string)`, async (t) => {
    const str = fs
      .readFileSync('test/fixtures/' + getName(name) + '/user.' + getName(name))
      .toString();
    const locals = { user };
    const html = await cons[getName(name)].render(str, locals);
    t.regex(html, /Tobi/);
    t.pass();
  });

  test(`${name} should be exposed in the requires object`, (t) => {
    const requiredName = getName(name);
    t.true(cons.requires[requiredName] !== undefined);
  });
};
